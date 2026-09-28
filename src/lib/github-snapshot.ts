import fallbackJson from '../data/github-snapshot.json';

export interface Snapshot {
  updatedAt: string;
  user: {
    login: string;
    name: string | null;
    publicRepos: number;
    followers: number;
    totalStars: number;
  };
  topRepos: {
    name: string;
    fullName: string;
    description: string;
    url: string;
    stars: number;
    forks: number;
    language: string | null;
    pushedAt: string;
  }[];
  recentEvents: { type: string; repo: string; createdAt: string; details: string }[];
  contributions: { total: number; weeks: number[][] };
}

const fallback = fallbackJson as Snapshot;

const USER = 'bradtraversy';
const TOP_REPO_COUNT = 8;
const RECENT_EVENT_COUNT = 10;
const TIMEOUT_MS = 10_000;

// Runs at build time. Any failure, or a missing GH_TOKEN, falls back to the
// committed snapshot so a build never depends on GitHub being reachable.
export async function loadSnapshot(): Promise<Snapshot> {
  const token = process.env.GH_TOKEN;
  if (!token) {
    console.warn('[github] GH_TOKEN not set, using committed snapshot');
    return fallback;
  }
  try {
    const snapshot = await fetchSnapshot(token);
    console.log(
      `[github] live snapshot: ${snapshot.user.publicRepos} repos, ` +
        `${snapshot.user.totalStars} stars, ${snapshot.contributions.total} contributions`
    );
    return snapshot;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`[github] live fetch failed, using committed snapshot: ${reason}`);
    return fallback;
  }
}

type GhEvent = {
  type: string;
  repo?: { name?: string };
  created_at: string;
  payload?: Record<string, any>;
};

async function fetchSnapshot(token: string): Promise<Snapshot> {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'bradtraversy-dev-snapshot',
    Authorization: `Bearer ${token}`,
  };

  // One budget for the whole refresh, not one per request.
  const signal = AbortSignal.timeout(TIMEOUT_MS);

  const rest = async (path: string) => {
    const res = await fetch(`https://api.github.com${path}`, { headers, signal });
    if (!res.ok) throw new Error(`GET ${path} -> ${res.status} ${res.statusText}`);
    return res.json();
  };

  const user = await rest(`/users/${USER}`);

  // Search API caps at 100 per page; the same page gives both the top repos and the star total.
  const search = await rest(
    `/search/repositories?q=user:${USER}+fork:false&sort=stars&order=desc&per_page=100`
  );
  const repos: any[] = search.items ?? [];
  if (search.incomplete_results || repos.length === 0) {
    throw new Error('search returned incomplete results');
  }
  const topRepos = repos.slice(0, TOP_REPO_COUNT).map((r) => ({
    name: r.name,
    fullName: r.full_name,
    description: r.description ?? '',
    url: r.html_url,
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language ?? null,
    pushedAt: r.pushed_at,
  }));
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

  const events: GhEvent[] = await rest(`/users/${USER}/events/public?per_page=30`);
  const recentEvents = events.slice(0, RECENT_EVENT_COUNT).map((e) => ({
    type: e.type,
    repo: e.repo?.name ?? 'unknown',
    createdAt: e.created_at,
    details: summarizeEvent(e),
  }));

  const gql = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks { contributionDays { contributionCount } }
            }
          }
        }
      }`,
      variables: { login: USER },
    }),
    signal,
  });
  if (!gql.ok) throw new Error(`GraphQL -> ${gql.status} ${gql.statusText}`);
  const gqlJson = await gql.json();
  if (gqlJson.errors) throw new Error(`GraphQL errors: ${JSON.stringify(gqlJson.errors)}`);
  const cal = gqlJson.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) throw new Error('GraphQL response had no contribution calendar');
  const contributions = {
    total: cal.totalContributions as number,
    weeks: (cal.weeks as { contributionDays: { contributionCount: number }[] }[]).map((w) =>
      w.contributionDays.map((d) => d.contributionCount)
    ),
  };

  return {
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
}

function summarizeEvent(event: GhEvent): string {
  const p = event.payload ?? {};
  switch (event.type) {
    case 'PushEvent': {
      // payload.size only comes back on authenticated fetches.
      const size = p.size ?? p.commits?.length;
      const branch = p.ref?.replace('refs/heads/', '') ?? '';
      const where = branch ? `to ${branch}` : '';
      if (typeof size === 'number' && size > 0) {
        return `pushed ${size} ${size === 1 ? 'commit' : 'commits'} ${where}`.trim();
      }
      return `pushed ${where}`.trim();
    }
    case 'CreateEvent':
    case 'DeleteEvent': {
      const verb = event.type === 'CreateEvent' ? 'created' : 'deleted';
      const refType = p.ref_type ?? 'ref';
      return p.ref ? `${verb} ${refType} ${p.ref}` : `${verb} ${refType}`;
    }
    case 'PullRequestEvent': {
      const num = p.number ?? '';
      return `${p.action ?? 'updated'} pull request${num ? ` #${num}` : ''}`;
    }
    case 'IssuesEvent': {
      const num = p.issue?.number ?? '';
      return `${p.action ?? 'updated'} issue${num ? ` #${num}` : ''}`;
    }
    case 'IssueCommentEvent': {
      const num = p.issue?.number ?? '';
      return `commented on issue${num ? ` #${num}` : ''}`;
    }
    case 'WatchEvent':
      return 'starred this repo';
    case 'ForkEvent':
      return 'forked this repo';
    case 'ReleaseEvent': {
      const tag = p.release?.tag_name ?? '';
      return `${p.action ?? 'released'} release${tag ? ` ${tag}` : ''}`;
    }
    case 'PublicEvent':
      return 'made the repo public';
    default:
      return event.type.replace(/Event$/, '').toLowerCase();
  }
}
