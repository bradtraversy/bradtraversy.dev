---
status: planning
created: 2026-05-03
last_updated: 2026-05-04
tags: [project, bradtraversy-dev, open-questions, decisions]
---

# bradtraversy.dev — Open Questions

> Decisions that aren't locked yet. Each gets resolved before or during Phase 1; once resolved it moves to a Decisions section in this file.

> **Rebrand note (2026-05-06):** the site was renamed from "TravxLabs.com" to "bradtraversy.dev" to avoid confusing the audience with a new company name. The work is Brad's personal lab. References to "Travx Labs" / "TravxLabs.com" below preserve the original wording of decisions made under that brand — the decisions still stand, the brand name just changed. The `travxlabs/*` GitHub org persists as the home for private commercial repos.

## Resolved

### Q1 — Email provider: Buttondown vs ConvertKit? — RESOLVED 2026-05-04
Decision: **Buttondown.** Cheap, dev-friendly, markdown-native, accepts MailerLite CSV exports cleanly. Brad's primary need is somewhere cheap to migrate the existing MailerLite audience to; Buttondown clears that bar without overpaying for ConvertKit features the lab won't use at v1.
Rationale: Buttondown's pricing scales gently with list size and the markdown-native authoring fits the rest of the stack (vault → repo → site is all markdown). ConvertKit's sequence/automation power isn't needed for a personal lab newsletter. If the migrated MailerLite list pushes Buttondown into a tier that no longer feels cheap, revisit at Phase 4.
Alternatives considered: ConvertKit (rejected — overpowered and more expensive for v1 needs). Self-host (rejected — operational burden, deliverability headaches).
Revisit if: Buttondown pricing becomes uncompetitive at the migrated list size, or Brad needs sequence-style automations Buttondown can't do.

### Q2 — Visual identity: who designs it? — RESOLVED 2026-05-04
Decision: **AI iteration in code, using `prototypes/home-mockup-airy.html` as the visual North Star.** No designer hire. The airy mockup (Tokyo Night palette, JetBrains Mono, VSCode editor metaphor — traffic lights, tabs, file tree, gutter, status bar; 13.5px base type, 96px section spacing, 80px content padding, 3-item sections) is the locked aesthetic for v1. Build out the site by translating that mockup into Astro components, iterating in code with AI assistance.
Rationale: The mockup already cleared the "do I want to look at this every day" bar. Hiring a designer for a brand sprint at this stage is premature given the lab is one person's personal site; AI-assisted iteration is fast and the aesthetic is specific enough that the constraint helps rather than hurts. The VSCode/editor metaphor is also meaningfully on-brand for the lab.
Alternatives considered: Brad designs solo from scratch (rejected — slower, no real upside vs the locked mockup). Hire a designer for a brand sprint (rejected — premature for v1, can revisit at v2 if the lab earns it). Pick another reference site as inspiration (rejected — the airy mockup is already the reference).
Revisit if: The aesthetic feels stale after 6+ months of content, or the lab earns a level of audience where a polish-pass with a real designer would meaningfully move the needle.

### Q3 — Newsletter cadence: weekly or biweekly? — RESOLVED 2026-05-04
Decision: **Weekly.** Brad's already producing enough material via sessions, devlog, and articles that a weekly issue is sustainable without filler. Weekly also matches the cadence of the lab's other channels (YouTube, social) and keeps the lab top-of-mind for subscribers.
Rationale: Biweekly is the safer answer but undersells the actual content velocity. The lab is supposed to demonstrate momentum; a weekly cadence reinforces that. If a week's content is genuinely thin, the issue can be a short "what's brewing" note rather than skipping — better to maintain rhythm than optimize per-issue depth.
Alternatives considered: Biweekly (rejected — concedes momentum the lab actually has). Monthly (rejected — too sparse to build the habit on either end). Irregular (rejected — kills subscriber trust).
Revisit if: Brad starts dreading the issue or skipping weeks for filler reasons (then drop to biweekly), or a sustained content drought makes weekly feel forced.

### Q5 — Comments: yes, later, or never? — RESOLVED 2026-05-04
Decision: **Never on-page.** No Giscus, Disqus, or in-house comment system at any phase. Conversation flows to Twitter/X reply CTA + email + GitHub issues for tools.
Rationale: On-page comments add moderation burden, performance cost, and rarely improve the discourse over off-site channels for a small personal site. Twitter/X is where the audience already is, email is the high-signal channel, and GitHub issues are the right venue for tool-specific feedback. Routing each kind of conversation to its native venue is cleaner than centralizing on-page.
Alternatives considered: Giscus at v1.1 (rejected — adds maintenance, niche audience). In-house comment system (rejected — overkill). Defer the decision (rejected — informs page templates now, want to commit).
Revisit if: Off-site engagement starts feeling fragmented in a way that a single on-page conversation thread would meaningfully fix.

### Q6 — Subdomain or root for the site? — RESOLVED 2026-05-04
Decision: **`travxlabs.com` root, with 301 redirect from `www.travxlabs.com` to root.** No splitting (no `blog.`, no `tools.`). The lab is one site at one canonical URL.
Rationale: Splitting subdomains fragments SEO equity and complicates analytics. The lab's identity is a single coherent thing — articles, devlog, and tools all share the same brand surface, so they should share the URL space. `www → root` redirect handles the legacy convention without introducing two canonical URLs.
Alternatives considered: `www.travxlabs.com` as canonical (rejected — root is shorter and more modern). Split subdomains for blog/tools (rejected — fragments the brand and SEO). No redirect (rejected — splits the canonical URL, hurts SEO).
Revisit if: A specific section of the site grows into something that genuinely deserves its own subdomain (e.g., a dedicated SaaS product needing its own auth/marketing surface), in which case spin that subdomain up rather than reorganizing the root.

### Q8 — How does the agent workflow get featured? — RESOLVED 2026-05-04
Decision: **Flagship article first.** Write "How Travis works" as the launch-window flagship. See how it lands (engagement, signups, references). If it earns it — sustained interest, follow-up questions, repeat traffic — promote agent content into its own section or `/agents` page in v1.1.
Rationale: The agent workflow is genuinely distinctive and worth featuring, but it doesn't need its own real estate at v1 to prove that. A flagship article is enough surface for launch; if it justifies more, the analytics will say so. Building a dedicated section preemptively risks it being half-empty if the format doesn't sustain.
Alternatives considered: Dedicated `/agents` section at launch (rejected — premature; risks looking thin). One-and-done article (rejected — undersells if it lands well). Live setup page with links (rejected — high maintenance, low payoff at this scale).
Revisit if: The flagship article over-performs and reader interest in agent-specific content is sustained for 2+ months — then build the section in v1.1.

### Q9 — Open-source the site repo? — RESOLVED 2026-05-04
Decision: **Private during build, public at or shortly after launch.** Repo lives at `github.com/bradtraversy/bradtraversy.dev` per the GitHub split rule (OSS → `bradtraversy`). Kept private through Phase 1–5 to avoid premature visibility into half-built work. Flipped to public at Phase 6 launch (or shortly after) once the site reads well.
Rationale: There's nothing sensitive in the site repo; the source is part of the demonstration the lab makes. But there's no upside to public visibility before the site is presentable, and the in-progress noise (placeholder copy, half-built components, exploratory commits) doesn't help anyone. Private during build, public at launch gets both: clean public-facing repo at the moment of debut, no audience watching the messy middle.
Alternatives considered: Public from day one (rejected — premature visibility into half-built work). Stay private indefinitely (rejected — gives up the demonstration value of a public lab repo). Public only on the launch article's repo link (rejected — same destination, just less control over timing).
Revisit if: A specific reason to keep it private emerges before launch (e.g., embedded credentials, sponsor-confidential content), in which case audit and remove rather than keep private.

### Q10 — Tools page: separate billing per tool or unified? — RESOLVED 2026-05-04
Decision: **Defer.** Each paid tool keeps its own checkout (Vidpipe runs its own Stripe). Revisit when there are 2+ paid SaaS products beyond Vidpipe, at which point the unified-account question becomes real.
Rationale: A unified Travx Labs account is a real piece of infrastructure (auth, billing, entitlement, support flows) that only earns its complexity at 3+ products. With Vidpipe as the only paid SaaS today, deferring is the obvious call. The decision is also cheap to defer: separate billing today doesn't preclude a unified account later, since each product can keep its current Stripe and a future "Travx Labs account" layer can sit on top.
Alternatives considered: Build unified account at v1 (rejected — massively over-scoped for one paid product). Build it speculatively at v2 (rejected — same reason, just delayed). Commit to never doing it (rejected — closes a door for no reason).
Revisit if: A second paid SaaS product ships and a third is planned, OR a single user explicitly asks "can I pay once across products" enough times to be a real signal.

### Q11 — Should Brad announce the site before content is live? — RESOLVED 2026-05-04
Decision: **Build in silence, launch with content.** No "coming soon" placeholder, no email-capture landing page, no pre-announcement. Soft-launch to a small group during Phase 5 (Dennis, a few close devs), public launch at Phase 6 with full content live. Pairs cleanly with Q9 (private repo during build).
Rationale: A coming-soon page makes sense for a product trying to validate demand or build a list before launch. The lab isn't either — it's a personal site whose value is the content itself, and a placeholder doesn't demonstrate anything. Building in silence preserves the option to delay or pivot without a public obligation, and a real launch with real content is a stronger debut than a list-building placeholder.
Alternatives considered: Coming-soon placeholder with email capture (rejected — wrong vibe for a personal site, doesn't demonstrate anything). Build entirely in public with live progress (rejected — Brad's preference; messy middle isn't useful to outsiders). Launch with minimal content and grow visibly (rejected — content density at launch matters for first impressions).
Revisit if: A specific reason to capture emails pre-launch emerges (e.g., a paid product launching alongside the site that benefits from a warm list).

### Q7 — Should TravxLabs ever become a separate legal entity? — RESOLVED 2026-05-04
Decision: No. Travx Labs stays a Brad-personal brand with no separate legal entity. It is **not** under Traversy Media's umbrella either — TM is the joint Brad+Dennis LLC; Travx Labs is Brad's solo project, distinct from TM at the brand and operational layer. Revenue may flow through existing accounting infrastructure for convenience, but conceptually and operationally it's Brad's alone.
Rationale: Dennis has no stake in Travx Labs decisions, profits, or work. Calling it a "sub-brand of Traversy Media" misrepresents the ownership. It's not a separate legal entity because the operational benefit (separate billing, contributors, taxes) doesn't exist yet.
Alternatives considered: Spin up a separate LLC (rejected — premature, no operational benefit). Frame as TM sub-brand (rejected — misrepresents that Dennis is part of it).
Revisit if: A contributor besides Brad joins, multiple paid SaaS products generate enough revenue to warrant separation, or tax treatment becomes meaningfully better with separation.

### Q4 — Devlog source: hand-written or piped from vault? — RESOLVED 2026-05-04
Decision: **Hybrid, phased.** v1 launch ships with a `polish-devlog` skill (chat-invoked) — Brad points it at a session log and it produces a polished draft (strips internal details, tightens tone, generates frontmatter). Used during the launch backfill of 10 devlog entries from existing session logs. **No scheduled task or web UI at launch** — the skill is enough. v1.1 adds the auto-pipeline: tag-driven scheduled task on trav-ai picks up `publish`-tagged vault notes/sessions, runs them through the skill, drafts land in the site repo. v1.1 also adds a dedicated web publishing app at `publish.travxlabs.com` for review/approve from anywhere.
Rationale: Pure hand-written sacrifices the recursive aesthetic (the lab is supposed to demonstrate this kind of automation). Pure auto-pipeline at launch is premature — manual flow proves demand and the skill alone covers the backfill ergonomically. Skill-first means launch needs no new infra (no cron, no web UI) but Brad still gets AI-assisted polish on demand. Skill is opinionated and can refuse to polish a session it judges as too internal/half-baked, so not every session becomes a devlog (intentional).
Alternatives considered: Pure hand-written for v1 (rejected — wastes the existing session corpus during backfill, loses the "the lab automates itself" angle). Auto-pipeline at launch (rejected — adds 1–2 weeks scope without proof the manual flow works). 1:1 session-to-devlog mapping (rejected — most sessions are too internal to publish even after stripping).
Revisit if: Manual skill-invocation gets tedious (then accelerate the v1.1 scheduled task), or if drafts pile up faster than Brad can review them (then accelerate the web app).

### Q-PA — Publishing platform architecture: extend Mission Control or separate app? — RESOLVED 2026-05-04
Decision: **Separate app, not Mission Control.** When the v1.1 publishing UI lands, it ships as a small dedicated app at `publish.travxlabs.com` (separate Astro/Next codebase, GitHub OAuth, only Brad can log in). Mission Control stays LAN-only via UFW; it is **not** exposed to the internet under any circumstance.
Rationale: Mission Control reads the entire vault — sponsor stuff, finances, personal context, every session log. Exposing that to the internet, even auth-gated, is a different security posture than a tiny app whose entire job is to read/write `content/devlog/_drafts/` in one specific repo. Smaller blast radius, better separation of concerns. The publish app is also a fun thing to write a devlog post about (recursive lab aesthetic). Cloudflare Tunnel + Access on Mission Control was the alternative — rejected for surface-area reasons.
Alternatives considered: (1) Cloudflare Tunnel + Cloudflare Access on existing Mission Control (rejected — exposes too much surface). (2) Tailscale-only access to Mission Control (rejected — awkward for phone/random device access from anywhere). (3) Add a Publish Queue tab to Mission Control (rejected — same surface-area problem; still requires exposing MC).
Revisit if: The dedicated publish app proves to be more friction than benefit, OR Mission Control gets refactored to allow per-tab auth/exposure (then a public-only Publish Queue tab could be exposed without the rest).

### Q-GH — GitHub org strategy: consolidate to bradtraversy or keep travxlabs org? — RESOLVED 2026-05-04
Decision: **Split by visibility, not by brand.** OSS / public-facing repos → `github.com/bradtraversy/*` (audience equity matters there). Private / commercial SaaS repos → `github.com/travxlabs/*` (distribution irrelevant for private; org boundary gives a clean asset line for any future sell/spinoff and slightly cleaner CI/secrets/billing).
Concrete placement: TravxLabs.com site, RepoReviver, DevSheets, Webutils, Typesmith → `bradtraversy/*`. Vidpipe, Mission Control, network-dashboard, AskBrad-style closed work → `travxlabs/*`.
Rationale: The original case for full consolidation was distribution — `bradtraversy` has audience, `travxlabs` doesn't. But that benefit only applies to public repos. For private repos nobody can see them either way, so the audience argument is moot, and keeping commercial work in an org gives a cleaner asset boundary if anything ever sells or spins out. Split rule captures the upside of both worlds.
Alternatives considered: (1) Full consolidation to `bradtraversy` — rejected because there's no upside for private repos and it loses the org-level boundary for commercial work. (2) Full consolidation to `travxlabs` — rejected because OSS repos sacrifice their audience benefit. (3) Status quo — rejected because it confused brand (Travx Labs) with visibility (public/private).
Revisit if: Travx Labs spins out as a separate entity with non-Brad contributors (then everything Travx Labs branded moves to `travxlabs`), or `bradtraversy` ever stops being "Brad personally" (e.g., if the handle is ever wound down for any reason).

## Open

_(none — all open questions resolved as of 2026-05-04)_

## Decision Log Format (for resolved questions)

```
### Q-N — <question> — RESOLVED YYYY-MM-DD
Decision: <one line>
Rationale: <2-3 sentences>
Alternatives considered: <list>
Revisit if: <conditions>
```
