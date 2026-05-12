#!/usr/bin/env node
// Generate a draft of the weekly newsletter from the past N days of content
// (new articles, devlog entries, projects, tools by publishDate), POST it to
// Buttondown as a DRAFT. Brad reviews and hits send from the dashboard.
//
// Usage:
//   pnpm draft-newsletter                     # last 7 days, posts draft
//   pnpm draft-newsletter --days=14           # custom window
//   pnpm draft-newsletter --dry-run           # preview only, no API call
//
// Env: BUTTONDOWN_API_KEY (required unless --dry-run).

import { readdir, readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const SITE_URL = 'https://bradtraversy.dev';
const ROOT = resolve(process.cwd(), 'src/content');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const daysArg = args.find((a) => a.startsWith('--days='));
const DAYS = daysArg ? parseInt(daysArg.split('=')[1], 10) : 7;
const cutoff = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);

const API_KEY = process.env.BUTTONDOWN_API_KEY;
if (!API_KEY && !dryRun) {
  console.error('error: BUTTONDOWN_API_KEY not set. use --dry-run to preview without posting.');
  process.exit(1);
}

// Minimal YAML frontmatter parser — enough for the keys we use.
function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    const km = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/);
    if (!km) continue;
    const [, k, raw] = km;
    let v = raw.trim();
    if (v.startsWith('[') && v.endsWith(']')) {
      fm[k] = v.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''));
    } else {
      fm[k] = v.replace(/^["']|["']$/g, '');
    }
  }
  return fm;
}

async function readCollection(dir) {
  const path = join(ROOT, dir);
  const files = await readdir(path);
  const entries = [];
  for (const f of files) {
    if (!f.endsWith('.mdx') && !f.endsWith('.md')) continue;
    const text = await readFile(join(path, f), 'utf8');
    const fm = parseFrontmatter(text);
    if (!fm) continue;
    if (String(fm.draft).toLowerCase() === 'true') continue;
    entries.push({ slug: f.replace(/\.(mdx|md)$/, ''), ...fm });
  }
  return entries;
}

const isRecent = (d) => d && new Date(d) >= cutoff;
const byDateDesc = (a, b) => new Date(b.publishDate) - new Date(a.publishDate);

function buildSubject({ articles, projects, tools, devlog }) {
  const parts = [];
  if (articles.length) parts.push(`${articles.length} new article${articles.length > 1 ? 's' : ''}`);
  if (projects.length) parts.push(`${projects.length} project update${projects.length > 1 ? 's' : ''}`);
  if (tools.length) parts.push(`${tools.length} new tool${tools.length > 1 ? 's' : ''}`);
  if (devlog.length && parts.length < 2)
    parts.push(`${devlog.length} devlog entr${devlog.length > 1 ? 'ies' : 'y'}`);
  return parts.length
    ? `this week from the lab — ${parts.slice(0, 2).join(', ')}`
    : 'this week from the lab';
}

function buildBody({ articles, projects, tools, devlog }) {
  const lines = ['hey —', '', 'quick weekly digest from bradtraversy.dev.', ''];

  if (articles.length) {
    lines.push('## new articles', '');
    for (const a of articles) {
      lines.push(`→ ${a.title}`);
      if (a.dek) lines.push(a.dek);
      lines.push(`${SITE_URL}/articles/${a.slug}`, '');
    }
  }

  if (projects.length) {
    lines.push('## project updates', '');
    for (const p of projects) {
      lines.push(`→ ${p.name} — ${p.tagline ?? ''}`.trimEnd());
      lines.push(`${SITE_URL}/projects/${p.slug}`, '');
    }
  }

  if (tools.length) {
    lines.push('## new tools', '');
    for (const t of tools) {
      lines.push(`→ ${t.name} — ${t.tagline ?? ''}`.trimEnd());
      lines.push(`${SITE_URL}/tools/${t.slug}`, '');
    }
  }

  if (devlog.length) {
    lines.push('## devlog', '');
    for (const d of devlog.slice(0, 5)) {
      lines.push(`- ${d.title} — ${SITE_URL}/devlog/${d.slug}`);
    }
    if (devlog.length > 5) lines.push('', `full stream → ${SITE_URL}/devlog`);
    lines.push('');
  }

  const empty = !articles.length && !projects.length && !tools.length && !devlog.length;
  if (empty) {
    lines.push(
      'quiet week on the public side. nothing new shipped, but the lab is still moving.',
      '',
      `see what's actively in progress → ${SITE_URL}/now`,
      ''
    );
  }

  lines.push("that's it. see you next sunday.", '', '— brad');
  return lines.join('\n');
}

async function main() {
  console.log(`scanning content for the last ${DAYS} days (since ${cutoff.toISOString().slice(0, 10)})…`);

  const [articles, projects, tools, devlog] = await Promise.all([
    readCollection('articles'),
    readCollection('projects'),
    readCollection('tools'),
    readCollection('devlog'),
  ]);

  const recent = {
    articles: articles.filter((x) => isRecent(x.publishDate)).sort(byDateDesc),
    projects: projects.filter((x) => isRecent(x.publishDate)).sort(byDateDesc),
    tools: tools.filter((x) => isRecent(x.publishDate)).sort(byDateDesc),
    devlog: devlog.filter((x) => isRecent(x.publishDate)).sort(byDateDesc),
  };

  console.log(
    `  ${recent.articles.length} articles · ${recent.projects.length} projects · ` +
      `${recent.tools.length} tools · ${recent.devlog.length} devlog entries`
  );

  const subject = buildSubject(recent);
  const body = buildBody(recent);

  console.log('\n--- preview ---');
  console.log(`SUBJECT: ${subject}\n`);
  console.log(body);
  console.log('--- end preview ---\n');

  if (dryRun) {
    console.log('dry run — not posting.');
    return;
  }

  console.log('posting as draft to buttondown…');
  const res = await fetch('https://api.buttondown.email/v1/emails', {
    method: 'POST',
    headers: {
      Authorization: `Token ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject, body, status: 'draft' }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`buttondown api ${res.status}:\n${errText}`);
    process.exit(1);
  }

  const data = await res.json();
  console.log(`\n✓ draft created (id: ${data.id})`);
  console.log(`review at: https://buttondown.com/emails/${data.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
