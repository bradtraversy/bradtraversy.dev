---
status: planning
created: 2026-05-03
last_updated: 2026-05-05
tags: [project, bradtraversy-dev, roadmap]
---

# bradtraversy.dev — Roadmap

> Phases from spec → MVP → public launch → v2. Dates are intentionally loose; the sequence and scope per phase are what matter.

## Phase 0 — Spec & Decisions (this week)

**Goal**: lock the foundation before writing any code.

- ✅ Site Spec (PRD)
- ✅ Information Architecture
- ✅ Tech Stack
- ✅ Content & Monetization
- ✅ Roadmap (this doc)
- ✅ Open Questions logged
- ✅ Decide: email provider → Buttondown (2026-05-04)
- ✅ Decide: visual identity → AI iteration in code, `home-mockup-airy.html` as North Star (2026-05-04)
- ☐ Decide: launch article topic + outline

**Exit criteria**: All Open Questions either decided or explicitly deferred. Brad can pull up the spec docs and feel confident handing them to an AI agent or implementing himself.

## Phase 1 — Scaffold (week 1)

**Goal**: a working Astro site at `bradtraversy.dev` that renders empty templates correctly.

- ☐ `pnpm create astro@latest` in `~/Code/bradtraversy.dev`
- ☐ Initialize repo at `github.com/bradtraversy/bradtraversy.dev` — **private during build, flip to public at Phase 6 launch** (per Q9 decided 2026-05-04; OSS goes under `bradtraversy` per the split rule)
- ☐ Wire up Tailwind v4 + Astro integrations (mdx, sitemap, rss)
- ☐ Define content collections + Zod schemas (`articles`, `devlog`, `projects`, `tools`)
- ☐ Build base layouts: `BaseLayout`, `ArticleLayout`, `DevlogLayout`, `ProjectLayout`, `ToolLayout`
- ☐ Build core components: Header, Footer, Card primitives, ProjectRow, ToolRow
- ☐ Build skeleton pages: Home, Articles index, Devlog index, Projects index, Tools catalog, Now, About
- ☐ Connect Vercel project, wire `bradtraversy.dev` DNS
- ☐ Verify deploy pipeline works (`main` → prod)

**Exit criteria**: bradtraversy.dev is live with placeholder copy; one dummy article, one dummy devlog entry, one dummy project, and one dummy tool render correctly.

## Phase 2 — Polish & Visual Direction (week 2)

**Goal**: site feels like a real product — typography, color, spacing, dark mode, code highlighting.

- ☐ Lock visual direction (typography, palette, accent)
- ☐ Implement dark mode with no-flash toggle
- ☐ Style article body (typography, code blocks, callouts, images)
- ☐ Style devlog entry (compact, time-stamped, share-friendly)
- ☐ Style project page (hero, status pill, pricing pill, screenshots, CTAs)
- ☐ Build Projects index (curated showcase, no filters)
- ☐ Build Tools catalog with filter chips (category, tag, free/paid)
- ☐ Implement RSS feeds (combined + per-mode)
- ☐ Add sitemap, robots.txt, OG defaults
- ☐ Lighthouse audit — hit perf budget
- ☐ Mobile responsiveness pass

**Exit criteria**: Brad opens the site on phone + desktop and feels good about showing it to someone.

## Phase 3 — Launch Content (week 3)

**Goal**: enough content that the site doesn't feel empty.

- ☐ Write launch article: "welcome to the lab"
- ☐ Write article: "How Travis works"
- ☐ Write article: "From prototype to prod: Vidpipe in 6 weeks"
- ☐ Build `polish-devlog` skill — chat-invoked: takes a session log, strips internal details (IPs, file paths, sponsor refs, Dennis specifics), tightens tone, generates frontmatter, writes to `content/devlog/_drafts/`. Skill can refuse to polish a session it judges as too internal/half-baked. Used during the backfill below.
- ☐ Backfill 10 devlog entries from recent vault session logs (using `polish-devlog`)
- ☐ Build project pages for: Vidpipe, DevSheets, Mission Control, RepoReviver (stub), bradtraversy.dev itself
- ☐ Add 8–10 tool catalog entries (Webutils, Typesmith, eyebreak, plus more as Brad surfaces them)
- ☐ Write Now page
- ☐ Write About page

**Exit criteria**: 3 articles, 10 devlog entries, 5 projects, 8+ tools, Now and About pages all live and reading well.

## Phase 4 — Newsletter & Subscribe (week 3–4)

**Goal**: capture traffic from day one.

- ☐ Set up Buttondown account, import MailerLite CSV export
- ☐ Build subscribe component
- ☐ Wire `/api/subscribe` endpoint (calls Buttondown API server-side)
- ☐ Add subscribe form to: home, article footer, devlog footer, site footer
- ☐ Set up welcome email in Buttondown
- ☐ Draft the first newsletter issue (weekly cadence per Q3)

**Exit criteria**: Subscribe works end-to-end on prod; a test email arrives; the welcome email is sent.

## Phase 5 — Soft Launch (week 4)

**Goal**: validate the pipeline without a public push.

- ☐ Site is live, content is in, no announcement yet
- ☐ Send link to a small group (Dennis, a few close devs)
- ☐ Collect feedback
- ☐ Fix the obvious things
- ☐ Watch analytics for any embarrassments

**Exit criteria**: No P0/P1 bugs, content reads well, navigation is clear, mobile is solid.

## Phase 6 — Public Launch (week 5)

**Goal**: tell the world.

- ☐ Flip `bradtraversy/bradtraversy.dev` repo from private → public (per Q9)
- ☐ Launch tweet/thread on X
- ☐ Pinned tweet linking to launch article
- ☐ YouTube short or community post mentioning the lab
- ☐ Add link to Traversy Media homepage / YouTube about section
- ☐ Send first newsletter issue
- ☐ Submit launch article to Hacker News (judiciously)

**Exit criteria**: Launch article is published, distribution channels have fired, first 100 subscribers in.

## Phase 7 — Steady-State (ongoing)

**Goal**: sustain the cadence without burning out.

- Devlog: ≥ 4/month
- Articles: ≥ 1/month
- Projects: updated whenever a phase ships; new ones added when a project starts
- Tools: catalog grows as one-day utilities ship — no cadence pressure
- Newsletter: weekly or biweekly
- Now page: weekly update

This is the hardest phase. Everything before this is one-time work; this is forever.

## v1.1 — Quality of Life + Publishing Pipeline (months 2–3)

- ☐ Pagefind search
- ☐ Auto-generated OG images (Satori or `@vercel/og`)
- ☐ "Reading time" badges
- ☐ Sticky table of contents on long articles
- ☐ Webmentions inbound (optional)
- ☐ **Publishing pipeline — phase 1 (auto-extract):** scheduled task on trav-ai scans for vault notes/session logs tagged `publish` (frontmatter), runs them through `polish-devlog` skill, drafts land in site repo's `content/devlog/_drafts/` branch, opens a draft PR
- ☐ **Publishing pipeline — phase 2 (web editorial app):** dedicated publish app at `publish.bradtraversy.dev` (separate small Astro/Next app, GitHub OAuth — only Brad can log in), shows queue of pending drafts pulled from the site repo's `_drafts/` folder, in-browser editor (Monaco/CodeMirror), approve/edit/discard buttons. Approval commits to main, Vercel rebuilds. Mission Control stays LAN-only and is **not** exposed — the publish app has a deliberately tiny attack surface (only knows how to read/write `content/devlog/_drafts/` in one repo).
- ☐ **Publishing pipeline — phase 3 (article research assistant):** for articles, agent assembles source material (relevant spec docs, session entries, decision log items, dates) into a structured outline + raw bullets per section. Brad writes the prose (voice stays human). Agent does polish pass: SEO, headings, internal links, frontmatter, tags.

## v2 — Product Layer (months 4–6)

- ☐ Digital products store (Lemon Squeezy / Gumroad embed)
- ☐ "Brad's Agent Setup" pack as the first paid digital product
- ☐ Astro starter sold/free via the lab
- ☐ Possibly: a small "stack" page or "uses" page

## v3 — Platform Layer (months 6+)

- Open question whether the lab ever becomes more than a personal site
- Possibilities: lab guest posts from collaborators (only if it stays focused), a small directory of hand-picked dev tools, a sponsorship slot
- All deferred until v1/v1.1 prove the muscle

## Definition of Done (per phase)

A phase is "done" when:

1. Every checkbox is checked or explicitly deferred
2. The exit criteria are met
3. A single Cowork/Claude session could verify it
4. The next phase can start without backtracking
