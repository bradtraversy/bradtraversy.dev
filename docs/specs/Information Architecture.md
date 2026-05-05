---
status: planning
created: 2026-05-03
last_updated: 2026-05-03
tags: [project, travxlabs, ia, sitemap, content-model]
---

# TravxLabs.com — Information Architecture

> Sitemap, URL structure, navigation, and the Astro content collection schemas.

## Sitemap

```
/                        — Home
/articles                — Article index (paginated)
/articles/:slug          — Article detail
/articles/tag/:tag       — Article tag listing
/devlog                  — Devlog index (reverse chronological)
/devlog/:slug            — Devlog entry detail
/devlog/tag/:tag         — Devlog tag listing
/tools                   — Tools index (filterable)
/tools/:slug             — Tool detail page
/tools/category/:cat     — Tools by category
/now                     — What I'm working on right now
/about                   — About + contact
/uses                    — (optional) hardware/software stack page
/rss.xml                 — Combined RSS (articles + devlog)
/articles/rss.xml        — Articles-only RSS
/devlog/rss.xml          — Devlog-only RSS
/sitemap.xml             — XML sitemap
/robots.txt              — Robots
/404                     — Not found
```

## Primary Navigation

Top nav (always visible):

- **Articles**
- **Devlog**
- **Tools**
- **Now**
- **About**

Right side: theme toggle, RSS icon, GitHub icon (links to `github.com/travxlabs`).

Footer:

- Subscribe form
- Social links (Twitter/X, YouTube, GitHub)
- "Part of Traversy Media" line linking to `traversymedia.com`
- Sitemap, RSS, Privacy

## URL Conventions

- Slugs are kebab-case, descriptive, stable: `/articles/how-travis-actually-works`
- Devlog slugs include date prefix: `/devlog/2026-05-03-vidpipe-phase-1-shipped`
- Tool slugs are the tool name: `/tools/vidpipe`, `/tools/repo-reviver`
- No trailing slashes
- Old slugs never break — redirects defined in `astro.config.mjs` if a slug ever changes

## Content Collections (Astro)

All content lives in `src/content/` and is validated against Zod schemas in `src/content/config.ts`.

### `articles` collection

```ts
{
  title: string,
  dek: string,                // subtitle / one-line summary
  publishDate: Date,
  updatedDate?: Date,
  draft: boolean,
  tags: string[],
  heroImage?: string,
  heroImageAlt?: string,
  ogImage?: string,           // auto-generated if missing
  relatedTools?: string[],    // slugs from tools collection
  readingTime?: number,       // computed at build time
  canonical?: string,         // for cross-posts
}
```

File location: `src/content/articles/<slug>.mdx`

### `devlog` collection

```ts
{
  title: string,
  publishDate: Date,
  draft: boolean,
  tags: string[],
  project?: string,           // slug from tools collection (optional)
  heroImage?: string,
}
```

File location: `src/content/devlog/<YYYY-MM-DD-slug>.mdx`

### `tools` collection

```ts
{
  name: string,
  slug: string,
  tagline: string,            // 1-line description
  description: string,        // longer pitch
  status: 'live' | 'beta' | 'coming-soon' | 'sunset',
  pricing: 'free' | 'open-source' | 'paid' | 'source-available',
  category: 'saas' | 'cli' | 'web-app' | 'utility' | 'library',
  url?: string,               // external product URL
  repoUrl?: string,
  pricingUrl?: string,        // direct checkout link
  stack: string[],            // ['Astro', 'Cloudflare Workers']
  heroImage?: string,
  screenshots?: string[],
  relatedArticles?: string[], // slugs
  publishDate: Date,
  updatedDate?: Date,
  featured: boolean,          // appears on home
}
```

File location: `src/content/tools/<slug>.mdx` (the body is the long-form pitch + "how I built it" content)

### Singletons

- `src/content/now.md` — the Now page
- `src/content/about.md` — the About page
- `src/content/uses.md` — optional uses page

## Tagging Strategy

Two tag taxonomies:

1. **Tech tags** — `astro`, `cloudflare`, `claude`, `agents`, `nextjs`, `python` — what tech the post/tool involves
2. **Topic tags** — `devlog`, `tutorial`, `postmortem`, `decision`, `tool-launch` — what kind of post it is

Tag pages render at `/articles/tag/:tag` and `/devlog/tag/:tag`.

## Search

V1: none. Cmd-F is enough.
V1.1: Pagefind static search (no JS framework, no server).
V2: only if traffic justifies it.

## RSS

- `/rss.xml` — combined feed (articles + devlog), most recent 50 items
- `/articles/rss.xml` — articles only
- `/devlog/rss.xml` — devlog only

Each feed item includes title, dek/excerpt, link, pub date, content, tags.

## Open Graph & Twitter Cards

- Per-page OG image
- Default fallback: site-wide OG image with logo
- Auto-generated OG images for articles via Satori or `@vercel/og` at build time (one of the v1.1 nice-to-haves)

## Sitemap & SEO

- `astro-sitemap` generates `sitemap.xml` automatically
- Per-page canonical URL
- Schema.org `Article` markup on article pages
- Schema.org `SoftwareApplication` markup on tool pages
- `robots.txt` allows everything except `/_*`

## Repo Layout (Astro)

```
travxlabs/
├── src/
│   ├── content/
│   │   ├── config.ts             # Zod schemas
│   │   ├── articles/
│   │   ├── devlog/
│   │   ├── tools/
│   │   ├── now.md
│   │   └── about.md
│   ├── components/
│   │   ├── ArticleCard.astro
│   │   ├── DevlogEntry.astro
│   │   ├── ToolCard.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── ...
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── ArticleLayout.astro
│   │   ├── DevlogLayout.astro
│   │   └── ToolLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── articles/[...slug].astro
│   │   ├── articles/index.astro
│   │   ├── articles/tag/[tag].astro
│   │   ├── devlog/[...slug].astro
│   │   ├── devlog/index.astro
│   │   ├── tools/[...slug].astro
│   │   ├── tools/index.astro
│   │   ├── now.astro
│   │   ├── about.astro
│   │   └── rss.xml.ts
│   ├── styles/
│   │   └── global.css
│   └── lib/
│       ├── readingTime.ts
│       └── seo.ts
├── public/
│   ├── images/
│   ├── favicon.svg
│   └── robots.txt
├── astro.config.mjs
├── tailwind.config.ts
├── package.json
└── README.md
```

## Vault → Site Pipeline (Optional v1.1)

Future enhancement: a small script that takes a vault note tagged `#publish` and copies it into `src/content/devlog/` with the right frontmatter. Not required for v1 — manual copy/paste is fine.

## Comments / Engagement

No on-page comments in v1. CTAs:

- Articles: "Reply to this on Twitter/X" with the article URL pre-filled
- Devlog: same
- Tools: GitHub Issues for open-source tools, contact email for paid

## Admin

There is no admin. Content lives in the repo. Brad edits markdown files in his editor, commits, and pushes. Vercel auto-deploys on push to `main`.
