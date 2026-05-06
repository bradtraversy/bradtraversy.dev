---
status: planning
created: 2026-05-03
last_updated: 2026-05-05
tags: [project, travxlabs, spec, prd]
---

# TravxLabs.com — Site Spec (PRD)

> The full product spec for TravxLabs.com. Vision, audience, content model, page templates, success metrics, and what's explicitly out of scope for v1.

## 1. Vision

TravxLabs.com is the public home of Travx Labs — a personal lab where Brad builds and ships side projects, dev tools, and SaaS products, with the building documented in the open. The site has four first-class content modes:

- **Articles** — polished, evergreen, low-cadence
- **Devlog** — raw, frequent, low-friction
- **Projects** — major ongoing work (Vidpipe, DevSheets, Mission Control), each with a rich detail page
- **Tools** — one-day utilities, designed to scale to 50+ entries as a filterable catalog

It is not a tutorial blog, not a portfolio, and not a course site. It's a working lab with a public window.

## 2. Audience

| Segment | Why they're here | What they want |
|---|---|---|
| Traversy Media followers | They already know Brad | Behind-the-scenes, what's being built, side-project rabbit holes |
| Indie hackers / builders | Projects, patterns, agent workflows | Concrete examples, real numbers, code |
| AI-curious devs | Brad's agent setup is uncommon | "How does Travis actually work?" "Show me your skills folder" |
| Search readers | Landed via Google | Solve a specific problem, maybe stick around |

V1 designs for segment 1 first. Segments 2–4 follow naturally.

## 3. Content Modes

### 3.1 Articles (Blog)

- **Cadence**: 1–4/month
- **Length**: 1500–4000 words typical
- **Voice**: First-person, direct, opinionated, no fluff
- **Quality bar**: Polished, edited, would feel at home on a top dev blog
- **Examples**: "How Travis (my agent) actually works", "Building Vidpipe from prototype to prod in 6 weeks", "Why I picked Astro over Next.js for travxlabs.com"
- **Distribution**: Featured on home, indexed by Google, shared on Twitter/X, sometimes linked from YouTube

### 3.2 Devlog (Lab Notes)

- **Cadence**: Whenever — could be 5/week or 1/week
- **Length**: 50–500 words typical
- **Voice**: Conversational, raw, sometimes just a screenshot and a paragraph
- **Quality bar**: Coherent, but not edited to death. Time-stamped.
- **Examples**: "Vidpipe phase 2 shipped — channel auto-poll working", "Tried Cloudflare Vectorize for the AskBrad RAG today — here's what I learned", "Renamed RepoSmith to RepoReviver"
- **Source pipeline**: Often promoted directly from Obsidian vault session logs or daily notes
- **Distribution**: RSS-first, browsable on the site, occasional Twitter/X thread

### 3.3 Projects

Things Brad works on — software products, infrastructure (homelab), future digital goods. Each gets a rich detail page. Examples: Vidpipe, DevSheets, Mission Control, RepoReviver, TravxLabs.com itself, Homelab.

Each project page has:

- Hero (name, tagline, screenshot/video, primary CTA)
- What it does (3–5 bullets)
- Who it's for
- Status pill (Planning / Alpha / Beta / Live / Maintenance / Sunset)
- Optional inline price hint (`pricingSummary`) for the rare paid project — most are free, no pill shown
- Install / buy / try button when applicable
- "How I built it" — links to related articles and devlog entries
- Stack badges
- Repo link if public

Projects index is a curated showcase, not a catalog — expect 5–10 items, ordered by `featured` then by status. Filtering is overkill at this size.

### 3.4 Tools

One-day utilities — small, finished-when-finished, designed to scale to 50+ entries. Examples: eyebreak, typesmith, webutils.

Every tool has its own internal page at `/tools/<slug>`. The catalog row links to that page — never out to an external host directly. The detail page is the canonical home: what it does, who it's for, screenshots, and an outbound "→ open" link to wherever the tool actually runs (or, eventually, the tool itself embedded inline).

Tool catalog row shows:

- Name (links to internal `/tools/<slug>` page)
- One-line description
- Category + tags (for filter chips)
- Free badge (paid is the rare case)

Tools index filters by: category, tag, free/paid, archived/active. Designed to stay calm at 50 items via category groups + filters.

### 3.5 Now Page

A single living page showing:

- What's the active focus this week (mirrors `Current State.md` "This Week's Focus")
- 1-2 sentences on each active project
- Last-updated timestamp
- Optional: a small uptime/status grid for live SaaS

### 3.6 About

Short page:

- Who Brad is (concise — links out to Traversy Media for the bio)
- What Travx Labs is and isn't
- Contact / social links
- The agent workflow in one paragraph (with a link to the full article)

## 4. Information Architecture (Summary)

See [[Information Architecture]] for full sitemap and URL structure.

Top-level:
- `/` — home
- `/articles` — blog index → `/articles/:slug`
- `/devlog` — devlog index → `/devlog/:slug`
- `/projects` — projects showcase → `/projects/:slug`
- `/tools` — tools catalog → `/tools/:slug` (every tool has a detail page)
- `/now` — current focus
- `/about` — about
- `/rss.xml`, `/devlog/rss.xml` — feeds

## 5. Page Templates

### 5.1 Home

Above the fold:
- Site name + tagline
- 1-line "what this is" (e.g., "Articles, devlog, projects, and the tools I ship")
- Currently building widget (3–4 active projects, pulled from `projects` collection where `featured: true` or `status` in alpha/beta/live)

Below the fold:
- Latest article (full hero)
- Latest 3–5 devlog entries (compact)
- Latest tools strip (5–6 newest from `tools` collection, with "see all → /tools" link)
- Subscribe form (email)
- About teaser

### 5.2 Article Page

- Title, dek (subtitle), date, reading time
- Hero image or no image (author's choice)
- Article body (MDX with code blocks, callouts, embeds)
- Related projects/tools (if any)
- "More from the lab" footer (3 latest devlog or articles)
- Subscribe footer

### 5.3 Devlog Entry

- Title, date, optional project tag (links to project or tool page)
- Body — markdown, screenshots, code, embeds
- Permalink + share button
- Prev/Next devlog nav

### 5.4 Project Page

See section 3.3 for content blocks.

### 5.5 Projects Index

- Curated showcase, no filter sidebar
- Card grid with hero image, name, tagline, status pill, pricing pill
- Sort: featured first, then status (live → beta → alpha → planning → maintenance → sunset)

### 5.6 Tool Detail Page

- Hero (name, tagline, free/paid pill)
- What it does (short — these are utilities, not features)
- "→ open" outbound link (if the tool lives elsewhere; optional)
- "→ repo" link if open source
- MDX body for any longer-form notes about the tool

### 5.7 Tools Catalog (Index)

- Filter chips: category, tag, free/paid, active/archived
- Compact rows (not full cards) with name, tagline, category, tag chips, "open →" link
- Designed to stay calm at 50+ items — list view, not card grid
- Sort: newest first by default; alphabetical and category-grouped views available

### 5.8 Now / About

Simple single-column markdown pages.

## 6. Content Model

See [[Information Architecture]] for the Astro content collection schemas.

Four collections:
- `articles` — blog posts
- `devlog` — short-form entries
- `projects` — major ongoing work (curated showcase)
- `tools` — one-day utilities (catalog at scale)

Plus single-page content for `/now` and `/about` (markdown files, not collections).

## 7. Voice & Style

- First-person ("I", "my")
- Direct, plain language, no buzzwords
- Opinionated but honest about tradeoffs
- Curse sparingly if at all
- Code blocks always rendered with syntax highlighting
- Numbers and proper nouns over abstractions ("shipped 12 commits in 4 days" beats "iterated rapidly")

The voice reads like Brad's existing YouTube videos and `Current State.md` decision logs — straightforward, technical, friendly, no fluff.

## 8. Visual Direction (Light)

Detailed branding lives in a separate doc later, but for v1:

- **Aesthetic**: dev-friendly, slightly warm, not overly minimal — feels like a workbench, not a luxury brand
- **Typography**: a strong sans for UI, a readable serif or modern sans for body, monospace for code
- **Color**: dark mode default with a single accent (likely a warm amber or signature Traversy color), light mode supported
- **Logo**: wordmark first ("travx labs"), no logomark needed for v1
- **Imagery**: real screenshots over stock illustrations

## 9. SEO

- All pages server-rendered (Astro static)
- Per-page meta title + description from frontmatter
- Open Graph + Twitter card images (auto-generated where possible)
- Sitemap, robots.txt, RSS
- Canonical URLs
- Schema.org markup on articles (Article type)

## 10. Performance Targets

- Lighthouse Performance ≥ 95 mobile, 100 desktop
- Largest Contentful Paint < 1.5s on 4G
- Zero client JS on text-only pages (Astro islands only where needed)
- Total page weight < 200KB on most pages

## 11. Success Metrics

V1 (first 60 days post-launch):
- 5+ articles published
- 30+ devlog entries published
- 5+ projects with detail pages
- 10+ tools listed in the catalog
- ≥ 5K unique visitors / month by day 60
- ≥ 100 email subscribers
- ≥ 1 paid project purchase via the site

V2 (first 6 months):
- ≥ 20K unique visitors / month
- ≥ 1K email subscribers
- ≥ 3 paid projects live
- 25+ tools in the catalog
- Inbound: ≥ 1 sponsor inquiry directly from the site
- 1+ article ranking in top 5 for a target keyword

## 12. Monetization

See [[Content & Monetization]] for full plan.

Summary:
- Free tools and open-source projects generate goodwill + audience
- Paid projects (Vidpipe, possible future SaaS) link out to their own checkout (Stripe)
- Possible future digital products (templates, swipe files, "Brad's agent setup" pack) sold via Lemon Squeezy or Gumroad
- No ads
- No sponsored posts in v1 (revisit later)
- Newsletter is the long-term distribution asset

## 13. Out of Scope for V1

- Comments (use Twitter/X replies, GitHub issues, or email)
- User accounts of any kind
- A Mac/iOS-style app showcase that requires non-trivial 3D/animation
- Search beyond browser Cmd-F (Pagefind comes in v1.1 if needed)
- Multi-author support (it's a personal lab)
- Translations / i18n
- A CMS UI — content lives as markdown/MDX in the repo and ships via git
- Analytics dashboard inside the site (use Plausible or Fathom)
- Webmentions / fediverse cross-posting

## 14. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Site becomes a chore and goes stale | Devlog cadence stays low-friction; pipe directly from Obsidian; no quality bar pressure |
| Project catalog rots as work sunsets | "Sunset" status pill is first-class; sunset projects get archived, not deleted |
| Tool catalog gets cluttered as it scales | Filter chips + categories; `archived: true` dims old tools without removing them |
| Articles compete for time with YouTube + courses | Articles are the lowest priority; devlog + projects + tools carry the site |
| Brand confusion with Traversy Media | Clear "Travx Labs is the workshop, Traversy Media is the school" framing on About |
| Maintenance overhead of 4 content modes | Templates are simple; deploy is automatic; no CMS to maintain |
