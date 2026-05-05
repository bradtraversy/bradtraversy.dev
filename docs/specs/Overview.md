---
status: planning
created: 2026-05-03
last_updated: 2026-05-03
tags: [project, travxlabs, blog, devlog, tools, astro]
---

# TravxLabs.com

> The public home for everything Brad builds outside of Traversy Media — polished writeups, raw devlog entries, and a catalog of tiny tools (free and paid). One site, three modes of content, all under the Travx Labs umbrella.

## What It Is

TravxLabs.com is an all-in-one "lab" site that combines:

- A **polished blog** for long-form articles, deep dives, and tutorials
- A **raw devlog** for short, frequent posts about what's being built right now
- A **tools catalog** for everything that ships out of the lab — free utilities, open-source CLIs, and paid SaaS products
- A **"now" page** showing what's actively in motion this week
- A short **about** page tying it all back to Brad and Traversy Media

The site is the public layer of the same workflow already running in the vault: Projects, Sessions, and shipped artifacts get distilled into content.

## Why It Matters

Brad is shipping a lot — agent workflows with Travis, tiny tools, SaaS products like Vidpipe, CLIs like RepoReviver, and educational content. Most of it currently lives in:

- The Obsidian vault (private)
- Scattered GitHub repos
- YouTube videos (high-effort, infrequent, big audience)
- Twitter/X (ephemeral)

There's no public surface that connects the dots. TravxLabs.com is that surface.

The strategic case:

- **Distribution multiplier** — every tool needs a place to live with context, screenshots, and a "buy/install" path. Right now they don't have one.
- **Compounding SEO** — long-form blog posts about real builds (Vidpipe, Mission Control, RepoReviver) earn search traffic indefinitely. Traversy Media's domain is course-focused; this is the dev-lab counterpart.
- **Audience bridge** — Traversy Media viewers who want to follow the building, not just learn from courses, currently have nowhere to go.
- **Proof of work** — the agent workflow with Travis is uniquely interesting and very few people are documenting it well.

## Audience

Primary: developers who already follow Traversy Media and want to see how Brad actually builds — the messy parts, the tools, the agent setup, the daily devlog rhythm.

Secondary: indie hackers and AI-curious devs looking for tools to use or patterns to copy.

Tertiary: search-driven readers landing on individual blog posts about specific tech (Astro, Cloudflare Workers, Claude agents, etc.).

## Why Now

- Travx Labs umbrella already exists as a brand concept (see [[Projects#Travx Labs]])
- Domain `travxlabs.com` is already owned
- GitHub org `travxlabs/` already hosts repos (Vidpipe, Mission Control, network-dashboard)
- Multiple shipping projects are ready to be the launch content (Vidpipe, RepoReviver, Mission Control, the Travis agent workflow)
- Astro's content collections + MDX make the build/deploy story trivial
- The vault → site pipeline can start manual and automate later

## Working Positioning

> "The public lab notebook of Traversy Media — articles, devlogs, and the tools we ship."

## Companion Docs

- [[Site Spec]] — the full PRD
- [[Information Architecture]] — sitemap, URLs, content model
- [[Tech Stack]] — Astro decisions and integrations
- [[Content & Monetization]] — cadence, voice, paid tools strategy
- [[Roadmap]] — phases from MVP to launch to v2
- [[Open Questions]] — decisions still TBD

## Next Steps

1. Lock the IA and tech stack (this spec round)
2. Scaffold the Astro project at `~/Code/travxlabs`
3. Build core templates (home, blog post, devlog entry, tool page, now, about)
4. Migrate three pieces of content from the vault as launch seeds
5. Soft launch (no announcement) to validate the pipeline
6. Public launch with an opening post: "Why I built TravxLabs"
