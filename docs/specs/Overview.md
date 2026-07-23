---
status: planning
created: 2026-05-03
last_updated: 2026-05-06
tags: [project, bradtraversy-dev, blog, devlog, tools, astro]
---

# bradtraversy.dev

> The public home for everything Brad builds outside of Traversy Media — polished writeups, raw devlog entries, a curated showcase of major projects, and a catalog of one-day tools. One site, four modes of content, all under Brad's personal brand.

## What It Is

bradtraversy.dev is an all-in-one "lab" site that combines:

- A **polished blog** for long-form articles, deep dives, and tutorials
- A **raw devlog** for short, frequent posts about what's being built right now
- A **projects showcase** for major ongoing work — Vidpipe, DevSheets, Mission Control, RepoReviver, the Homelab itself
- A **tools catalog** for one-day utilities — small things Brad ships and keeps around
- A **"now" page** showing what's actively in motion this week
- A short **about** page tying it all back to Brad and Traversy Media

The site is the public layer of the same workflow already running in the vault: Projects, Sessions, and shipped artifacts get distilled into content.

## Why It Matters

Brad is shipping a lot — agent workflows with Travis, tiny tools, SaaS products like Vidpipe, CLIs like RepoReviver, and educational content. Most of it currently lives in:

- The Obsidian vault (private)
- Scattered GitHub repos
- YouTube videos (high-effort, infrequent, big audience)
- Twitter/X (ephemeral)

There's no public surface that connects the dots. bradtraversy.dev is that surface.

The strategic case:

- **Distribution multiplier** — every project needs a place to live with context, screenshots, and a "buy/install" path. Right now they don't have one.
- **Compounding SEO** — long-form blog posts about real builds (Vidpipe, Mission Control, RepoReviver) earn search traffic indefinitely. Traversy Media's domain is course-focused; this is the dev-lab counterpart.
- **Audience bridge** — Traversy Media viewers who want to follow the building, not just learn from courses, currently have nowhere to go.
- **Proof of work** — the agent workflow with Travis is uniquely interesting and very few people are documenting it well.

## Audience

Primary: developers who already follow Traversy Media and want to see how Brad actually builds — the messy parts, the tools, the agent setup, the daily devlog rhythm.

Secondary: indie hackers and AI-curious devs looking for tools to use or patterns to copy.

Tertiary: search-driven readers landing on individual blog posts about specific tech (Astro, Cloudflare Workers, Claude agents, etc.).

## Why Now

- Domain `bradtraversy.dev` registered and ready
- GitHub repo at `bradtraversy/bradtraversy.dev` set up under Brad's personal account (OSS goes there per the visibility split rule)
- The `travxlabs/` GitHub org continues to host private commercial repos (Vidpipe, Mission Control, network-dashboard) — kept as an internal asset boundary even though the public site no longer carries that brand
- Multiple shipping projects are ready to be the launch content (Vidpipe, RepoReviver, Mission Control, the Travis agent workflow)
- Astro's content collections + MDX make the build/deploy story trivial
- The vault → site pipeline can start manual and automate later

## Working Positioning

> "Brad's public lab — articles, devlog, projects, and the tools I ship."

## Companion Docs

- [[Site Spec]] — the full PRD
- [[Information Architecture]] — sitemap, URLs, content model
- [[Tech Stack]] — Astro decisions and integrations
- [[Content & Monetization]] — cadence, voice, paid tools strategy
- [[Roadmap]] — phases from MVP to launch to v2
- [[Open Questions]] — decisions still TBD

## Next Steps

1. Lock the IA and tech stack (this spec round)
2. Scaffold the Astro project at `~/Code/Live/bradtraversy.dev`
3. Build core templates (home, blog post, devlog entry, project page, tool catalog, now, about)
4. Migrate three pieces of content from the vault as launch seeds
5. Soft launch (no announcement) to validate the pipeline
6. Public launch with an opening post: "welcome to the lab"

## Rebrand Note

This site was originally named **TravxLabs.com** and is referenced as such in older session logs and decision docs. It was rebranded to **bradtraversy.dev** on 2026-05-06 to avoid confusing the audience with a new company name; the work is Brad's personal lab. The `travxlabs/*` GitHub org persists for private commercial repos but the public surface now carries Brad's name directly.
