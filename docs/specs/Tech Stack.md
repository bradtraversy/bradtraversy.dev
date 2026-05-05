---
status: planning
created: 2026-05-03
last_updated: 2026-05-04
tags: [project, travxlabs, tech-stack, astro, vercel]
---

# TravxLabs.com — Tech Stack

> Tech decisions, integrations, and the rationale for each.

## Headline Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 5** | Built for content-heavy sites, MDX-first, content collections, fast |
| Content authoring | **MDX + Markdown** | Plain files in repo, no CMS to maintain |
| Styling | **Tailwind CSS v4** | Same stack Brad already uses everywhere |
| Components | **Astro components** + light React islands when needed | Keeps shipped JS near zero |
| Hosting | **Vercel** | Already in stack, zero-config Astro deploys, edge-fast |
| Domain | **travxlabs.com** | Already owned by Brad |
| Repo | **github.com/bradtraversy/travxlabs-site** | OSS lives under `bradtraversy` per split rule (decided 2026-05-04) |
| Analytics | **Plausible** (or Fathom) | Privacy-first, lightweight, no cookie banner |
| Email / newsletter | **Buttondown** | Cheap, markdown-native, accepts MailerLite CSV import (decided 2026-05-04) |
| Search (v1.1) | **Pagefind** | Static, no server, drop-in |
| Forms (subscribe) | Direct integration with email provider API | One-step, server-side via Astro endpoint |

## Why Astro Over Next.js

Brad already runs Next.js on Vidpipe, Mission Control, AskBrad, and Start.dev. Picking Astro here is intentional:

- TravxLabs is content-first, not app-first. Astro is built for that exact shape.
- Zero client JS by default. Pages are static HTML. Ridiculous performance with no effort.
- Content collections + Zod schemas catch frontmatter typos at build time.
- MDX support is first-class.
- Build times stay under 30s even at 100+ articles.
- Switching context away from Next.js for the lab is healthy — different tool for a different job, also a differentiation point if Brad writes about it.

If the site ever needs heavy interactivity (interactive tool playgrounds), Astro can drop a React or Solid island in without rebuilding the whole thing.

## Integrations

### Astro packages

- `@astrojs/mdx` — MDX support for articles
- `@astrojs/sitemap` — auto sitemap.xml
- `@astrojs/rss` — RSS feed generation
- `@astrojs/tailwind` — Tailwind integration
- `astro-icon` — icon system (lucide or similar)
- `@astrojs/check` — type checking on Astro files

### Markdown / MDX plugins

- `remark-gfm` — tables, strikethrough, task lists
- `remark-reading-time` — auto-compute reading time
- `rehype-slug` + `rehype-autolink-headings` — heading anchors
- `rehype-pretty-code` (or `shiki`) — syntax highlighting (GitHub Dark / Light)
- `rehype-external-links` — `target="_blank"` + `rel="noopener"` on external links

### Future integrations (v1.1+)

- `@vercel/og` or `satori` — auto-generated OG images
- `pagefind` — static search
- `astro-icon` — icons
- A simple CLI script to publish from Obsidian → site

## Hosting & Deploy

- **Vercel** project
- `main` → production at `travxlabs.com`
- PR branches → preview deploys at `travxlabs-pr-<n>.vercel.app`
- Build command: `astro build`
- Output: `dist/` static files
- Environment variables (kept minimal):
  - `BUTTONDOWN_API_KEY`
  - `PLAUSIBLE_DOMAIN`
- DNS: managed at Vercel, A/CNAME records pointing to Vercel

## Email Capture

Subscribe form on home and at the bottom of every article and devlog entry.

Implementation:
- Static HTML form
- Posts to an Astro endpoint at `/api/subscribe`
- Endpoint calls the email provider API server-side
- Returns a thank-you or error message
- No client JS required for the basic case (progressive enhancement adds inline confirmation)

## Forms & Contact

- Subscribe form → email provider
- Contact: a `mailto:` link on About + Twitter/X DM
- No general-purpose contact form in v1

## Analytics & Observability

- **Plausible** for traffic — privacy-first, lightweight, public dashboard option
- Vercel Analytics as backup / for Web Vitals
- Sentry **not** needed for v1 (static site, low risk)

## Performance Budget

- Total page weight: < 200KB on most pages, < 500KB on article pages with images
- Zero render-blocking JS on text-only pages
- Self-hosted fonts (subset, woff2) — no Google Fonts CDN
- Images via Astro's `<Image>` with proper sizing + lazy loading

## Theming

- CSS custom properties for colors
- `data-theme="dark"` on `<html>`, toggled via a small inline script (no flash on load)
- Light + dark variants of code highlighting

## SEO / Social

- `astro-seo` or hand-rolled `<head>` partial
- Per-page meta title (under 60 chars), description (under 160 chars)
- OG tags + Twitter card tags
- `application/ld+json` for `Article` and `SoftwareApplication`

## Local Dev

- Node 20+
- `pnpm` (matches the rest of Brad's stack)
- `pnpm dev` — local Astro dev server
- `pnpm build && pnpm preview` — production build smoke test
- `pnpm lint` — ESLint + Prettier
- `pnpm check` — `astro check` for type errors

## Repo Conventions

- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `content:`)
- `content:` prefix for content-only commits so deploys can be filtered later if needed
- Branch model: trunk-based, push to `main`, Vercel auto-deploys
- PRs only when the change is risky or wants review

## Cost Estimate

| Item | Cost |
|---|---|
| Domain `travxlabs.com` | already owned |
| Vercel hosting | $0 (Hobby tier, well within limits for v1) |
| Plausible analytics | ~$9/mo (or self-host on `trav-ai`) |
| Buttondown | $0–$15/mo depending on migrated MailerLite list size |
| Email-OG-image service if used | $0–$5/mo |
| **Total v1 monthly** | **~$10–25/mo** |

## What This Doesn't Use (Intentionally)

- No headless CMS (Sanity, Contentful, etc.) — content is in the repo
- No database — everything is static
- No serverless functions beyond the subscribe endpoint
- No build-time API calls to third parties (keeps build deterministic and offline-friendly)
- No client-side router — Astro's standard navigation is fine
