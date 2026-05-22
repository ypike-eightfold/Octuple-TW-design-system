# CLAUDE.md — ef-design-system

This repository hosts **two parallel design systems** plus the Claude Code skills, content guidelines, and design gallery that go with them.

When a designer (or anyone) opens a session in this repo, the **first thing to figure out is which design system version they want to work in**. Almost everything else follows from that choice.

---

## Version routing — ask before any design work

The repo supports two design systems:

| Version | What it is | When designers pick it |
|---|---|---|
| **Tailwind (`tw`)** | The new `ef-design-system` package — Tailwind v4, shadcn-style utilities, lives in `src/`. Components shown at https://ef-design-system.vercel.app/. | New projects, greenfield work, anything that doesn't need to drop into an existing OG product. |
| **OG Octuple (`og`)** | The original Eightfold Octuple component library — pre-Tailwind, classic CSS, lives upstream at https://github.com/EightfoldAI/octuple. Most existing Eightfold products use this. | Working on or alongside existing TA / TM / Octuple / Career Hub product surfaces. |

### The rule (MUST, not SHOULD)

**The very first time a user prompt contains a design verb in this session, Claude MUST stop and ask which version — unless the version is already pinned (see "Skip the ask" below).** Don't grep the codebase, don't load skills, don't draft code, don't propose options. Just ask.

**Design verbs that trigger the ask:** *design, build, mock, wireframe, prototype, sketch, create, add, layout, redesign, refactor, restyle, fix, change, update, screen, page, view, dashboard, form, modal, dialog, drawer, table, card, button, nav, header, footer, sidebar, tab.* Plural and -ing forms count. Product-area words (employee profile, talent acquisition, career hub, etc.) imply a design verb.

**The question, verbatim:**

> Quick gate before I touch anything: which design system version are you working in?
>
> - **`tw`** — new Tailwind ef-design-system (greenfield)
> - **`og`** — original Octuple (existing Eightfold products)
> - **Not sure** — I'll recommend based on context

Wait for the answer. Don't proceed until you have one.

### Skip the ask

Only skip the question when **one** of these is unambiguous:

1. The user already named the version in the current message ("design X with Octuple", "build a tw mock of Y", "/design-og-ux-designer …").
2. The user named the version earlier in this conversation and the new request is clearly the same body of work.
3. The user is editing an existing file whose imports already pin the version (e.g. they say "edit `frontend/src/pages/Foo.tsx`" and Foo.tsx imports from `@eightfold.ai/octuple` → OG, or from `@tonyh-2-eightfold/ef-design-system` → tw).
4. The user invoked a versioned skill explicitly (`/design-tw-frontend-engineer`, etc.).

When skipping, state which signal you used in one short line ("Going with `og` — your prompt said Octuple") so the user can correct you on the spot.

### What "Not sure" means

If the user picks "Not sure," recommend based on these signals, in order:

1. Did they mention an existing product surface (TA, TM, Career Hub, Talent Forge)? → `og`
2. Is the work greenfield or "new project"? → `tw`
3. Is the work touching a file whose imports name one library? → that one.
4. Default → `tw`.

Recommend, give a one-line reason, then wait for confirmation.

### After the version is chosen

For this session, **only invoke skills matching that prefix** for design work:

- `tw` → `design-tw-ux-designer`, `design-tw-frontend-engineer`
- `og` → `design-og-ux-designer`, `design-og-frontend-engineer`, `design-og-component-reference`

Non-versioned skills (architect, story-writer, ui-builder, publish-design, etc.) apply to either.

### Examples

**Triggers the ask:**

- "Design a manager review screen." → ask
- "Add a new tab to the talent profile page." → ask (talent profile = product surface, but doesn't name a version)
- "Build a dashboard for the recruiter view." → ask
- "Mock up the org chart." → ask

**Skips the ask:**

- "Design a tw mock of the recruiter dashboard." → skip, use `tw`. State why.
- "Build this in Octuple: a candidate pipeline view." → skip, use `og`. State why.
- "Edit `frontend/src/pages/Recruiter.tsx` to add a search bar." → check the file's imports first; if they pin a version, skip and state which.
- "/design-og-ux-designer design a manager review screen." → skip, the slash command pins `og`.

**Doesn't trigger (no design verb):**

- "What's in this repo?" → no ask
- "Where are the skills defined?" → no ask
- "Explain how the gallery works." → no ask

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

## Gem instructions — applied when designing AI features

Alongside the shared content rules, four files under `gems/` carry the source-of-truth instructions for internal Eightfold custom Gems (Google Gemini assistants):

```
gems/
├── response-confidence-score.md     # generic: rubric for AI uncertainty scoring
├── guidance-layer.md                # generic: AI guardrails + when-to-defer rules
└── OH/                              # specific to the OH Gem
    ├── prompt-instructions.md       # OH persona, scope, allowed topics
    └── content-quality-framework.md # OH content rubric
```

These aren't Claude Code skills — they're version-controlled mirrors of Google Docs that the design skills (`design-og-ux-designer`, `design-og-frontend-engineer`, `design-tw-ux-designer`, `design-tw-frontend-engineer`) reference when generating UI copy for AI-mediated screens. That way Claude's output matches what the OH Gem itself would produce.

The Google Doc is canonical. Each `.md` is auto-synced via Apps Script — see [`docs/CONTENT-SYNC.md`](docs/CONTENT-SYNC.md). Don't hand-edit the files; they get overwritten on the next sync.

---

## Unified web app — landing, components, gallery, docs

A single Next.js 15 app under `web/` powers everything served at `ef-design-system.vercel.app`:

| Route | Content |
|---|---|
| `/` | Landing page — hero + 3 cards (Components / Gallery / How to use) |
| `/components` | Component catalog ported from the old `demo/` Vite app — tokens, shadcn primitives, Eightfold-specific components |
| `/gallery` | Approved designs, browsable by product area |
| `/gallery/<category>/<slug>` | Design detail — thumbnail + sandboxed iframe of the design |
| `/docs/workflow` | Renders `docs/DESIGNER-WORKFLOW.md` |
| `/signin` | Google SSO via Auth.js v5, restricted to `@eightfold.ai` |

The catalog uses Next.js route groups (`app/(site)/`) so /components renders full-width while landing/gallery/docs stay constrained.

For local development the site runs with `NEXT_PUBLIC_AUTH_BYPASS=true` (auth disabled) until OAuth credentials are wired — see `web/docs/google-oauth-setup.md`. Don't set `NEXT_PUBLIC_AUTH_BYPASS` in production.

Gallery categories:

```
Talent Management        Personal Career Site
Talent Acquisition       Resource Management
Octuple                  Talent Flex
Talent Forge             Job Intelligence Engine
Workforce Exchange       Admin Console
                         Analytics
```

Designs live in `web/public/content/designs/<category-slug>/<design-slug>/` as `index.html` + `meta.json` + `thumbnail.png`. **Designs only appear in the gallery after a PR merges into `main`** — the `publish-design` skill handles the PR flow.

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
