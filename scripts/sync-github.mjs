#!/usr/bin/env node
// Snapshot bradtraversy's public GitHub state into src/data/github-snapshot.json.
// Runs on a 6-hour cron from .github/workflows/sync-github.yml. Vercel rebuilds
// when the resulting JSON change is committed back to main.
//
// Auth: GH_TOKEN (preferred) or GITHUB_TOKEN. GraphQL contributions endpoint
// requires it. REST endpoints work unauth but get rate-limited fast.

import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const USER = 'bradtraversy';
const TOP_REPO_COUNT = 8;
const RECENT_EVENT_COUNT = 10;
const OUTPUT_PATH = resolve(process.cwd(), 'src/data/github-snapshot.json');

const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

const restHeaders = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'bradtraversy-dev-snapshot',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function rest(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers: restHeaders });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GET ${path} → ${res.status} ${res.statusText}\n${body}`);
  }
  return res.json();
}

async function gql(query, variables) {
  if (!TOKEN) throw new Error('GraphQL contributions require GH_TOKEN or GITHUB_TOKEN');
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      ...restHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GraphQL → ${res.status} ${res.statusText}\n${body}`);
  }
  const json = await res.json();
  if (json.errors) throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  return json.data;
}

function summarizeEvent(event) {
  const repo = event.repo?.name ?? 'unknown';
  switch (event.type) {
    case 'PushEvent': {
      // payload.size is documented but only returns on authenticated fetches.
      // Fall back to a count-less summary if it's missing.
      const size = event.payload?.size ?? event.payload?.commits?.length;
      const branch = event.payload?.ref?.replace('refs/heads/', '') ?? '';
      const where = branch ? `to ${branch}` : '';
      if (typeof size === 'number' && size > 0) {
        const noun = size === 1 ? 'commit' : 'commits';
        return `pushed ${size} ${noun} ${where}`.trim();
      }
      return `pushed ${where}`.trim();
    }
    case 'CreateEvent': {
      const ref = event.payload?.ref ?? '';
      const refType = event.payload?.ref_type ?? 'ref';
      return ref ? `created ${refType} ${ref}` : `created ${refType}`;
    }
    case 'DeleteEvent': {
      const ref = event.payload?.ref ?? '';
      const refType = event.payload?.ref_type ?? 'ref';
      return ref ? `deleted ${refType} ${ref}` : `deleted ${refType}`;
    }
    case 'PullRequestEvent': {
      const action = event.payload?.action ?? 'updated';
      const num = event.payload?.number ?? '';
      return `${action} pull request${num ? ` #${num}` : ''}`;
    }
    case 'IssuesEvent': {
      const action = event.payload?.action ?? 'updated';
      const num = event.payload?.issue?.number ?? '';
      return `${action} issue${num ? ` #${num}` : ''}`;
    }
    case 'IssueCommentEvent': {
      const num = event.payload?.issue?.number ?? '';
      return `commented on issue${num ? ` #${num}` : ''}`;
    }
    case 'WatchEvent':
      return `starred this repo`;
    case 'ForkEvent':
      return `forked this repo`;
    case 'ReleaseEvent': {
      const action = event.payload?.action ?? 'released';
      const tag = event.payload?.release?.tag_name ?? '';
      return `${action} release${tag ? ` ${tag}` : ''}`;
    }
    case 'PublicEvent':
      return `made the repo public`;
    default:
      return event.type.replace(/Event$/, '').toLowerCase();
  }
}

async function main() {
  console.log(`fetching github snapshot for @${USER}…`);

  const user = await rest(`/users/${USER}`);

  // Top-N by stars via Search API (single request, no pagination needed).
  const search = await rest(
    `/search/repositories?q=user:${USER}+fork:false&sort=stars&order=desc&per_page=${TOP_REPO_COUNT}`
  );
  const topRepos = (search.items ?? []).map((r) => ({
    name: r.name,
    fullName: r.full_name,
    description: r.description ?? '',
    url: r.html_url,
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language ?? null,
    pushedAt: r.pushed_at,
  }));

  // Total stars across all public non-fork repos. Search API gives us this for
  // free as the sum across paginated results, but we already have the top N
  // from search. Reuse a wider count here for the headline number.
  const starsAgg = await rest(
    `/search/repositories?q=user:${USER}+fork:false&sort=stars&order=desc&per_page=100`
  );
  const totalStars = (starsAgg.items ?? []).reduce((sum, r) => sum + r.stargazers_count, 0);

  // Recent public activity (raw event stream → digestible summary).
  const events = await rest(`/users/${USER}/events/public?per_page=30`);
  const recentEvents = events
    .slice(0, RECENT_EVENT_COUNT)
    .map((e) => ({
      type: e.type,
      repo: e.repo?.name ?? 'unknown',
      createdAt: e.created_at,
      details: summarizeEvent(e),
    }));

  // Contributions calendar via GraphQL (the only way to get the cell data).
  let contributions = { total: 0, weeks: [] };
  if (TOKEN) {
    const data = await gql(
      `query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                }
              }
            }
          }
        }
      }`,
      { login: USER }
    );
    const cal = data.user?.contributionsCollection?.contributionCalendar;
    if (cal) {
      contributions = {
        total: cal.totalContributions,
        weeks: cal.weeks.map((w) => w.contributionDays.map((d) => d.contributionCount)),
      };
    }
  } else {
    console.warn('no token — skipping contributions calendar');
  }

  const snapshot = {
    updatedAt: new Date().toISOString(),
    user: {
      login: user.login,
      name: user.name,
      publicRepos: user.public_repos,
      followers: user.followers,
      totalStars,
    },
    topRepos,
    recentEvents,
    contributions,
  };

  await writeFile(OUTPUT_PATH, JSON.stringify(snapshot, null, 2) + '\n');
  console.log(`wrote ${OUTPUT_PATH}`);
  console.log(
    `  ${snapshot.user.publicRepos} repos · ${snapshot.user.followers} followers · ` +
      `${snapshot.user.totalStars} stars · ${snapshot.contributions.total} contribs · ` +
      `${snapshot.topRepos.length} top repos · ${snapshot.recentEvents.length} events`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
