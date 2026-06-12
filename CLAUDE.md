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

### When to check (MUST, not SHOULD)

Run **both** checks before emitting copy or UI in any of these situations — including when no design skill is loaded:

1. **UI labels and copy** — button text, form labels, errors, empty states, tooltips, modal titles, table headers, navigation items, settings labels, status pills, badges.
2. **Public-facing documentation under `docs/` or `web/app/(site)/docs/`** — designer-facing or user-facing text that ships at a URL.
3. **README files and any `.md` linked from `README.md` or `CLAUDE.md`**.
4. **PR titles and PR descriptions** for design / content work — those land in `git log` and the gallery commit history.
5. **Mock-data string content visible in screenshots / iframes** — names, role titles, project names, fake company names. (Persona names use the approved list in `terms-list.md` § Personas; never real customer names.)

**Skip the check** for: code comments, variable names, internal-only debug strings, dev-tooling output, scripts/CLI tools used only by maintainers.

When in doubt, run the check. The cost is ~5 seconds of grep; the cost of shipping non-compliant copy is rework.

### How to run the check (per-emission, not per-conversation)

For every batch of UI text or doc text you're about to emit:

1. **Identify candidate terms** in what you wrote — branded terms (e.g. Career Hub), feature names, role names (employee / candidate / recruiter / etc.), product nouns (1:1, performance review, skill, role).
2. **Grep `terms-list.md`** for each candidate. If the entry says "Use: X" use exactly X; if "Don't use: Y" then never Y.
3. **For non-trivial copy** (more than a one-word label) also check the relevant section of `content-design-standards.md` — voice & tone, capitalization, punctuation, link text rules, error-message patterns.
4. **Apply Gem instructions** for AI-mediated screens (chat responses, recommendations, anything OH or Companion touches) — see `gems/` for the rubric.
5. **State what you checked** in one short sentence after emitting the copy: e.g. "Checked Career Hub (branded), 1:1 (not 1-on-1), no banned terms." So the human reviewing your output can spot-check.

---

## Accessibility (WCAG 2.2 AA) is a default, not an opt-in

For any UI you generate — components, screens, prototypes, or doc-pages with interactive elements — apply the WCAG 2.2 AA defaults from `.claude/skills/design-{og,tw}-frontend-engineer/references/accessibility.md` **even when no design skill is loaded**. Specifically:

- Every `<img>` has `alt` (or `alt=""` for decorative). Icon-only buttons / links carry `aria-label`.
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<table>` with `<th>`). No `<div onClick>`.
- Headings hierarchical, no level skips.
- Color paired with text/icon — never color as the sole indicator. Status uses Tag/Pill with explicit label.
- Color contrast: 4.5:1 normal text, 3:1 large text / UI components. Use design-system semantic tokens (`bg-primary`, `text-foreground`, etc.) — they're pre-checked. Never use raw hex / Tailwind `slate-*`.
- Form fields have visible labels (never placeholder-only). Errors have explicit text + `aria-live`.
- Interactive targets ≥ 44×44 (mobile) / 24×24 (minimum). ef-design-system Button enforces this; don't override.
- Keyboard support: focus order matches visual order, `focus-visible` ring on every interactive, no keyboard traps.
- For Radix-based components: wrap properly (`<TooltipProvider>`, `<RadioGroup>`, etc.) — missing wrappers throw at runtime in React 19.

**State what you applied** when you emit a design, the same way as for content: one short line citing which a11y defaults are in effect.

### What's NOT automatic — call out explicitly when relevant

Some criteria require human verification or per-design decisions. Don't claim them silently; flag them if the design needs them:

- **Captions / audio descriptions** (1.2.x) — required if the design includes video. Add a `<track>` element or note the caption track is missing.
- **Resize text 200%** (1.4.4) and **reflow at 320px** (1.4.10) — must be tested in browser. Note "designed to be responsive; needs browser verification."
- **Focus not obscured** (2.4.11, WCAG 2.2 new) — sticky headers/modals must not hide focused elements. Add `scroll-margin-top` on focusable elements where relevant.
- **Accessible authentication** (3.3.8, WCAG 2.2 new) — login flows allow paste in password fields; CAPTCHA has non-cognitive fallback.
- **Error prevention for legal/financial/data** (3.3.4) — irreversible actions get a confirmation dialog. Flag when an action is irreversible.
- **Dragging movements** (2.5.7, WCAG 2.2 new) — drag-and-drop has a click/keyboard alternative.

If you ship a design without verifying these where applicable, say so: "Built with WCAG AA defaults applied; reflow at 320px, captions for the video, and 2.4.11 focus-not-obscured need browser verification before release."

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
Talent Forge             Talent Flex
Workforce Exchange       Job Intelligence Engine
                         Admin Console
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
