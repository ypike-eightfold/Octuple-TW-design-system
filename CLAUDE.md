# CLAUDE.md — ef-design-system

This repository hosts **two parallel design systems** plus the Claude Code skills, content guidelines, and design gallery that go with them.

When a designer (or anyone) opens a session in this repo, the **first thing to figure out is which design system version they want to work in**. Almost everything else follows from that choice.

---

## At session start: ask which version

The repo supports two design systems:

| Version | What it is | When designers pick it |
|---|---|---|
| **Tailwind (`tw`)** | The new `ef-design-system` package — Tailwind v4, shadcn-style utilities, lives in `src/`. Components shown at https://ef-design-system.vercel.app/. | New projects, greenfield work, anything that doesn't need to drop into an existing OG product. |
| **OG Octuple (`og`)** | The original Eightfold Octuple component library — pre-Tailwind, classic CSS, lives upstream at https://github.com/EightfoldAI/octuple. Most existing Eightfold products use this. | Working on or alongside existing TA / TM / Octuple / Career Hub product surfaces. |

**Required behavior:** at the start of any new design conversation, if the user has not already stated which version they want, ask them. One short question, two options (tw / og), plus "I'm not sure — recommend one." If they're not sure, recommend `tw` for greenfield and `og` for changes that have to integrate with an existing product surface.

Once a version is chosen, **only invoke skills matching that prefix** for design work in this session:

- `tw` → `design-tw-ux-designer`, `design-tw-frontend-engineer`
- `og` → `design-og-ux-designer`, `design-og-frontend-engineer`, `design-og-component-reference`

Non-versioned skills (architect, story-writer, ui-builder, publish-design, etc.) apply to either.

If a user explicitly invokes a skill by name (e.g. they type `/design-og-ux-designer`), that overrides the routing — no need to ask.

---

## Skill map

```
.claude/skills/
├── _content/                              # shared content — used by BOTH versions
│   ├── content-design-standards.md        # voice, tone, grammar, UI copy patterns
│   └── terms-list.md                      # authoritative product terminology (grep on demand)
│
├── design-tw-ux-designer/                 # TAILWIND: screen design, IA, prototypes
├── design-tw-frontend-engineer/           # TAILWIND: production engineering on the React mocks
│
├── design-og-ux-designer/                 # OG: screen design, IA, Octuple prototypes
├── design-og-frontend-engineer/           # OG: production engineering with OG Octuple
├── design-og-component-reference/         # OG: per-component docs (grep this for Button, Card, etc.)
│
├── publish-design/                        # PR helper — submits a finished design to the gallery
│
└── (version-agnostic skills)
    ├── architect/                         # system architecture
    ├── api-architect/                     # API design
    ├── backend-writer/                    # backend implementation
    ├── db-architect/                      # database design
    ├── deploy-setup/                      # deployment config
    ├── domain-researcher/                 # market & domain research
    ├── forger/                            # pipeline orchestrator across the other skills
    ├── phase-verifier/                    # verification gate between phases
    ├── story-writer/                      # user stories
    ├── test-writer/                       # tests
    └── ui-builder/                        # upgrades tailwind mocks → production code
```

---

## Skills are owned in this repo

The Claude Code skills under `.claude/skills/` are owned by this repository. Edit them here, version them here, PR changes to them here.

Some of the Tailwind skills (`design-tw-*`, plus the supporting `architect`, `story-writer`, `ui-builder`, etc.) were originally seeded from `EightfoldAI/talent-forge/.claude/skills/` as a one-time import. From this point on, this repo is where they live and evolve. **There is no ongoing sync with talent-forge** — it is a separate project with its own goals. Do not push changes back to it.

---

## Content guidelines apply to both versions

Every label, button, error, empty state, tooltip, badge, and column header — regardless of version — must follow:

1. `.claude/skills/_content/content-design-standards.md` — voice, tone, grammar, capitalization, punctuation, UI copy patterns. Read the section relevant to what you're writing.
2. `.claude/skills/_content/terms-list.md` — the authoritative glossary of Eightfold product terms. **Grep this file for specific terms** — it is 4,000+ lines and not meant to be read end-to-end.

Both `design-tw-ux-designer` and `design-og-ux-designer` reference these. If you're writing UI copy in any skill and you haven't checked the terms list, check it.

---

## Design gallery

A Next.js 15 app under `gallery/` browses all approved designs. Google SSO restricted to `@eightfold.ai` via Auth.js v5. Deploys as a **separate Vercel project** from the component-showcase site at `ef-design-system.vercel.app`.

For local development the gallery runs with `NEXT_PUBLIC_AUTH_BYPASS=true` (auth disabled) until you wire OAuth credentials — see `gallery/docs/google-oauth-setup.md` for the setup walkthrough. Don't set `NEXT_PUBLIC_AUTH_BYPASS` in production.

Categories:

```
Talent Management        Personal Career Site
Talent Acquisition       Resource Management
Octuple                  Talent Flex
Talent Forge             Job Intelligence Engine
Workforce Exchange       Admin Console
                         Analytics
```

Designs live in `gallery/public/content/designs/<category-slug>/<design-slug>/` as `index.html` + `meta.json` + `thumbnail.png`. **Designs only appear in the gallery after a PR merges into `main`** — the `publish-design` skill handles the PR flow.

---

## Verification workflow (when a preview server is running)

When code is edited while a preview server is running, verify changes before proceeding:

1. **Screenshot** — take a screenshot of the affected area to confirm visual correctness
2. **Inspect** — check changed elements via snapshot/inspect (text content, structure)
3. **Console errors** — `preview_console_logs level=error`
4. **Server errors** — `preview_logs level=error`
5. **Confirm** — state what was verified and whether the changes match the intent

Only proceed after all checks pass. If any check fails, fix the issue before continuing.

---

## Critical rules — read first

These have been broken repeatedly across past sessions:

- **Never invent components or props.** If you don't know whether something exists, grep the source (Tailwind: `src/components/`; OG: `design-og-component-reference/components/`) or ask. Hallucinated components are the single largest source of designer rework.
- **Never mix versions in one design.** A Tailwind design imports from `@tonyh-2-eightfold/ef-design-system`. An OG design imports from `@eightfold/octuple`. They are not interoperable.
- **Never hardcode customer/employee names** in mock data. Use the personas the user has approved or generic placeholders ("Manager A", "Reviewer 1").
- **Never modify upstream Octuple or shadcn components from inside this repo.** Wrap, don't fork.
- **Read the terms list before writing UI copy.** "Click here", "AI-powered", "user", "candidate" all have specific guidance.
- **Never auto-merge a design PR.** `publish-design` opens the PR; humans merge it.
