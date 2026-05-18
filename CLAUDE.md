# CLAUDE.md — bradtraversy.dev site

> Operating rules for any AI agent working on this repo. Read this first, then read the specs as needed.

## What this is

`bradtraversy.dev` — Brad Traversy's personal lab site. A public-facing combination of polished blog, raw devlog, projects showcase, and tools catalog. This is Brad's solo work, distinct from **Traversy Media** (the joint Brad+Dennis LLC) — keep that boundary clear in copy and decisions.

**Projects vs Tools** — two different content collections, don't merge them:
- **Projects** = things Brad works on (software products + infrastructure like the homelab). Curated showcase, ~5–10 items, rich detail pages with status pills, stack chips, screenshots, "how I built it" narrative. **No pricing surface on the site** — it's a lab, not a sales funnel; visitors who care about price click through to the product URL.
- **Tools** = one-day utilities (eyebreak, typesmith, webutils). Designed to scale to 50+ catalog entries. Every tool has its own internal detail page at `/tools/<slug>` — catalog rows always link there, never directly to an external host. The detail page is the canonical home for the tool; if there's an external URL where the tool actually runs, it's an outbound "→ open" link from the detail page, not the catalog row's primary destination.

## Read these specs

For any non-trivial work, read the relevant spec **before** writing code:

- `docs/specs/Site Spec.md` — full PRD: vision, audience, content modes, page templates, voice, success metrics
- `docs/specs/Information Architecture.md` — sitemap, URL structure, content collection Zod schemas, navigation, repo layout
- `docs/specs/Tech Stack.md` — Astro decisions, integrations, performance budget
- `docs/specs/Content & Monetization.md` — cadence pyramid, voice guide, tag taxonomy, monetization layers
- `docs/specs/Roadmap.md` — phased plan, exit criteria per phase
- `docs/specs/Open Questions.md` — every spec decision and its rationale (all currently resolved)

For visual ground truth: `docs/visual-north-star/home-mockup-airy.html` — Tokyo Night palette, JetBrains Mono, VSCode editor metaphor, generous whitespace. The site should feel like that mockup.

## Stack (locked)

- **Astro 6** + **Tailwind v4** + **MDX**, deployed on **Vercel**
- **Node 20+**, **pnpm**
- Static-first. **Zero client JS by default** — drop a React island only when interactivity actually requires it
- Content lives in repo (`src/content/`), not a CMS
- No database. The only server endpoint is `/api/subscribe` (Buttondown)

## Locked decisions (don't relitigate)

Pulled from `Open Questions.md` Resolved section. Don't propose alternatives without a strong new reason.

- **Email provider**: Buttondown. Env var is `BUTTONDOWN_API_KEY`. No ConvertKit, no Mailchimp.
- **Newsletter cadence**: weekly
- **Domain**: `bradtraversy.dev` root canonical; `www.` 301-redirects to root. No `blog.`/`tools.` subdomain splits.
- **Comments**: never on-page. CTAs route to Twitter/X reply, email, or GitHub issues. No Giscus, Disqus, or in-house.
- **Repo visibility**: private during build, public at Phase 6 launch. Don't reference the public repo URL in copy until Phase 6.
- **Visual identity**: AI iteration in code, `home-mockup-airy.html` is the North Star.
- **Agent workflow page**: a flagship article first ("How the agent fleet works" — covering the four-profile Hermes setup), no dedicated `/agents` section in v1.
- **Pre-launch announcement**: build in silence. No coming-soon page, no email-capture landing page.
- **Project billing**: each paid project keeps its own checkout. No unified billing layer on this site in v1.
- **Devlog source**: hand-curated for v1 launch via the `polish-devlog` skill (chat-invoked). Auto-pipeline lands in v1.1, not v1.
- **GitHub org**: this repo is `bradtraversy/bradtraversy.dev`. OSS goes under `bradtraversy`; private commercial work goes under `travxlabs/*` (kept as Brad's private GitHub org for non-public repos, even though the public site no longer carries the Travx Labs brand).

## Voice rules

- First-person, lowercase tags, no marketing-speak
- Direct over clever. "Vidpipe ships in 6 weeks" beats "We're thrilled to announce..."
- No em-dashes as a tic. Use them when grammatically right, not as a stylistic crutch.
- Short sentences are fine. Run-ons earn their length.
- No "let's dive in", "in this article we will...", "buckle up", or any other workshop-podcast filler
- Code examples are real, runnable, and minimal. No `// ... rest of code here` placeholders.
- Tag taxonomy in `Content & Monetization.md` — don't invent new tags casually

## Repo conventions

- **Conventional Commits** — `feat:`, `fix:`, `chore:`, `docs:`, `content:`, `style:`, `refactor:`
- Use `content:` for content-only commits (new article, devlog entry, project page, tool catalog entry) — lets us filter deploys later if we want
- Trunk-based: push to `main`. PRs only when the change is risky or wants explicit review.
- Vercel auto-deploys `main` to prod
- Branch names lowercase-hyphenated when used: `feat/subscribe-endpoint`, never `Feat_SubscribeEndpoint`
- **NO `Co-Authored-By: Claude` (or any AI co-author) trailer in commit messages.** This is a Brad-personal repo and the public contributors list must reflect that. Override the default agent commit template — drop the trailer entirely. If a commit has already been written with one, rewrite history before push.

## File / folder conventions

- `src/content.config.ts` — Zod schemas (Astro 5+ singular form, lives at src root, not inside `src/content/`)
- `src/content/articles/` — MDX files, slug = filename
- `src/content/devlog/` — short MDX, slug = `YYYY-MM-DD-kebab-title`
- `src/content/projects/` — one MDX per major project (rich body with hero, what-it-does, pricing, screenshots)
- `src/content/tools/` — one MDX per one-day utility. Every tool has a detail page; the body is the page content (what it does, screenshots, etc.)
- `src/components/` — Astro components first, React islands only when needed
- `src/layouts/` — `BaseLayout`, `ArticleLayout`, `DevlogLayout`, `ProjectLayout`, `ToolLayout`
- `src/styles/` — global CSS only; component styles co-located in `.astro` files
- All content has Zod-validated frontmatter — see `Information Architecture.md` for the schemas

## Don't-do list

- ❌ No headless CMS (Sanity, Contentful, Strapi, Payload)
- ❌ No database, ORM, or auth layer in v1
- ❌ No client-side router — Astro's standard navigation is fine
- ❌ No Google Fonts CDN — self-host woff2 subsets
- ❌ No on-page comment system at any phase
- ❌ No third-party trackers, pixels, or session-recording tools (no GA, FB Pixel, LinkedIn Insight, Hotjar, etc.)
- ❌ No serverless functions beyond `/api/subscribe`
- ❌ No build-time API calls to third parties (keeps build deterministic and offline-friendly)
- ❌ No README writeup of internal decisions in public-facing copy until repo flips public

## Performance budget

- Total page weight: < 200KB on most pages, < 500KB on article pages with images
- Zero render-blocking JS on text-only pages
- Lighthouse: 100/100/100/100 is the bar on the homepage. Don't ship a regression without acknowledgment.
- Self-hosted fonts (subset, woff2) — see Tech Stack

## Subscribe endpoint contract

`POST /api/subscribe` (Astro endpoint, server-side):
- Accepts `{ email: string }`
- Calls Buttondown API with `BUTTONDOWN_API_KEY`
- Returns `{ ok: true }` or `{ ok: false, error: string }`
- No client JS required for the basic case; progressive enhancement adds inline confirmation

## When in doubt

If a spec doesn't cover the case and there's no locked decision against it, prefer:
- Static over dynamic
- Plain HTML over JavaScript
- Astro component over React island
- One file over many
- Boring over clever

If still unclear, leave a `// TODO: confirm with Brad` and proceed with the least-committal implementation.
