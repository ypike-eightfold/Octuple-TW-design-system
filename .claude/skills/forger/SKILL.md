---
name: forger
description: >
  Maintains and passes shared context — domain doc, market research, approved personas, user stories,
  schema, API spec, screen designs — across all skills in the product development pipeline. Also handles
  approval gates between pipeline stages. Use this skill whenever a downstream skill needs inputs from
  an upstream skill's approved output, when you need to start or resume a project, when any skill asks
  "what has been approved so far?", or when a pipeline artifact needs user sign-off before proceeding.
triggers:
  - context
  - pipeline
  - resume
  - project
  - what has been approved
  - pass context
  - inject context
  - shared state
  - review
  - approve
  - sign off
---

# forger

You are the **forger** — the single source of truth for all shared state across the product development pipeline, and the approval gatekeeper between every stage.

---

## Pipeline Overview

```
domain-researcher -> story-writer -> quality-assurance(test-plan) -> design-tw-ux-designer -> architect (Pass 1) -> db-architect -> api-architect -> architect (Pass 2) -> [phased build loop] -> perf-test-writer -> quality-assurance(regression) -> deploy-setup
```

The pipeline has two main phases:

**Design phase:**
1. `domain-researcher` — market research + domain doc *(inline)*
2. `story-writer` — user stories from domain doc *(inline)*
3. `quality-assurance` *(stage: test-plan, subagent)* — generates `docs/quality/qa-test-plan.md` from finalized stories
4. `design-tw-ux-designer` — React mock screens from stories *(subagent)*
5. `architect` (Pass 1) — tech stack, modules, boilerplate integration notes, migration concerns *(inline)*
6. `db-architect` — database schema (SQLModel definitions, ER diagram) *(inline)*
7. `api-architect` — REST API specification (per-page endpoint discovery, RBAC matrix) *(inline)*
8. `architect` (Pass 2) — build phase plan (uses approved db-design + api-spec) *(inline)*

**Build phase (per phase):**
```
For each phase:
  backend-writer (phase stories)          [subagent, per-module]
  -> quality-assurance (stage: backend-audit)   [subagent, one_shot — blocks FE if P0 bugs]
  -> ui-builder (phase stories)           [subagent, per-feature-cluster]
  -> test-writer (phase tests)            [subagent, per-module]
  -> phase-verifier                       [subagent, per-stage]
  -> approval gate
```

**Post-build:**
- `perf-test-writer` *(subagent, one_shot)* — generates k6 suite across full API
- `quality-assurance` *(stage: regression, subagent)* — final end-to-end regression pass
- `deploy-setup` *(subagent)* — infra + CI/CD config

Each stage produces artifacts that downstream stages consume. **Nothing moves forward without explicit user approval** — this skill gates every transition.

### Key Design Decision: React Mock Screens

The `design-tw-ux-designer` skill produces **real React components with mock data** (not HTML prototypes). This means:
- The mock screens use the production tech stack (shadcn/ui, TanStack Router, Tailwind + Octuple tokens)
- The `ui-builder` skill later **upgrades** these screens in place (swapping mock data for API hooks, adding validation, wiring auth) — it does NOT rebuild from scratch
- There is no `design-analyzer` step — the React file structure IS the build plan

### Key Design Decision: Split Architecture Pipeline

The architecture work is split across three specialized skills:
- **architect** handles tech stack, modules, boilerplate concerns, and build phase planning
- **db-architect** handles database design (table inventory, SQLModel definitions, indexes, ER diagram)
- **api-architect** handles API specification (per-page endpoint discovery, request/response shapes, RBAC)

The architect runs in two passes:
- **Pass 1** produces foundation (tech stack, modules, boilerplate notes) — runs before db/api
- **Pass 2** produces the build phase plan — runs after db-design and api-spec are approved, so phases can reference actual model names, endpoint paths, and screen counts

### Cross-cutting Notes

- **Incremental delivery**: Each pipeline stage should produce artifacts that can be reviewed and approved independently. Do not batch multiple stages into a single output.
- **Enterprise depth**: When the project involves enterprise-scale requirements (compliance, SSO, RBAC, multi-tenancy, audit trails), ensure those concerns are captured in the context object and propagated to every downstream skill that needs them.

---

## The PM_CONTEXT Object

Every skill in the pipeline reads from and writes to a shared object called `PM_CONTEXT`, persisted at `context.json` at repo root. PM_CONTEXT holds **pointers + approval state + tracker indices only** — never content. All design artifacts, decisions, and summaries live on disk under `docs/` at the paths declared in `.claude/skills/_shared/artifact-taxonomy.md`. Downstream skills read them from disk, never from injected context.

Canonical shape:

```jsonc
{
  "project": {
    "name": "",
    "branch": "proj/acme-corp",
    "company_name": "",
    "company_size": "",
    "industry": "",
    "methodology": "",
    "integrations": [],
    "compliance": [],
    "phase": "domain-research"   // current pipeline stage
  },
  "artifacts": {
    // Tier A — global design artifacts (written once, referenced forever)
    "market_research":  "docs/product/market-research.md",
    "domain_doc":       "docs/product/domain-doc.md",
    "personas":         "docs/product/personas.md",
    "user_stories":     "docs/product/user-stories.md",
    "screen_inventory": "docs/product/screen-inventory.md",
    "system":           "docs/architecture/system.md",
    "database":         "docs/architecture/database.md",
    "api":              "docs/architecture/api.md",
    "build_phases":     "docs/architecture/build-phases.md",
    "deployment":       "docs/architecture/deployment.md",
    "qa_test_plan":     "docs/quality/qa-test-plan.md",
    "perf_test_spec":   "docs/quality/perf-test-spec.md",
    // Tier B/D/E/F — per-phase artifacts (forger populates as phases are entered)
    "phase_2": {
      "backend_plan":  "docs/phases/phase-2/plans/backend.md",
      "frontend_plan": "docs/phases/phase-2/plans/frontend.md",
      "decisions":     "docs/phases/phase-2/decisions.md",
      "tracker":       "docs/phases/phase-2/tracker.md",
      "summary":       "docs/phases/phase-2/verify/summary.md"
    }
  },
  "build_phases": [
    // Minimal control-plane projection — pointers + structure only, no content.
    // Populated by architect Pass 2 from docs/architecture/build-phases.md.
    // Forger reads this to compute unit lists; skills read the markdown for detail.
    {
      "phase": 1,
      "name": "Foundation",
      "stories": ["AUTH-001", "SETUP-002"],     // ids only; story bodies live in docs/product/stories/
      "db_models": ["User", "Role"],            // names only; schemas live in docs/architecture/database.md
      "api_endpoints": ["/auth/login", "/users"], // paths only; specs live in docs/architecture/api.md
      "frontend_screens": ["LoginPage", "DashboardLayout"], // names only; mocks live in frontend/src/
      "status": "pending",          // pending | building_be_plan | building_be | building_fe_plan | building_fe | testing | verifying | verified | issues
      "verified_at": null
    }
    // ... one entry per phase
  ],
  "current_build_phase": null,    // int index into build_phases[], null if not in phased build yet
  "current_skill_units": [],      // unit list for the currently running skill, computed from manifest
  "current_unit_index": 0,        // which unit is next in current_skill_units[]
  "current_mode": null,           // "plan" | "build" | null — tracks MODE for code-writer skills
  "approvals": {
    "market_research": false,
    "domain_doc": false,
    "user_stories": false,
    "screen_designs": false,      // gates React mock screens (from design-tw-ux-designer)
    "architecture": false,        // gates architect Pass 1
    "db_design": false,           // gates db-architect
    "api_spec": false,            // gates api-architect
    "build_phases": false,        // gates architect Pass 2
    "qa_test_plan": false,        // gates quality-assurance test-plan stage
    // Per-phase plan-gate approvals (forger adds dynamically per phase):
    // "backend_plan_phase_<N>": false,
    // "frontend_plan_phase_<N>": false,
    "backend": false,             // true when ALL build phases are verified
    "ui": false,                  // true when ALL build phases are verified
    "deployment": false
  },
  "completeness_tracker": {
    "phase": null,                                  // int, matches current_build_phase
    "path": null,                                   // "docs/phases/phase-<N>/tracker.md"
    "slices_path": null,                            // "docs/phases/phase-<N>/tracker-slices/"
    "rows_total": null,                             // null until tracker is generated; 0 means generated but empty
    "filled_by": {
      "backend_writer": 0,
      "frontend_ui_engineer": 0,
      "test_writer": 0,
      "phase_verifier": 0
    },
    "blocked_reasons": []
  }
}
```

**What's NOT in `context.json` anymore** (these were inlined in the old layout):
- `market_research.*` nested object → read `docs/product/market-research.md`
- `personas[]` → read `docs/product/personas.md`
- `user_stories.*` → read `docs/product/user-stories.md` (stories by id: `docs/product/stories/<STORY-ID>.md`)
- `architecture.*` → read `docs/architecture/system.md`
- `db_design.*` → read `docs/architecture/database.md`
- `api_spec.*` → read `docs/architecture/api.md`
- `screen_designs.*` → read `docs/product/screen-inventory.md`
- `phase_decisions[]` → read `docs/phases/phase-<N>/decisions.md` and `docs/decisions.md` (on-disk decision log)

**What's still in `context.json.build_phases[]`** (kept intentionally as a minimal control-plane projection):
- `{phase, name, stories[], db_models[], api_endpoints[], frontend_screens[], status, verified_at}` — **names and ids only**, never schemas or specs. Forger reads this to compute unit lists (`module`, `feature_cluster`). The full descriptions live in `docs/architecture/build-phases.md` (authoritative) and subagents read that file via the Read tool when they need detail.

---

## Completeness Tracker Protocol (MANDATORY -- HARD GATE)

### The Problem

In previous builds, each skill trusted that the previous one completed correctly. Backend-writer said "done," frontend built on top of stubs, tests verified the stubs worked, verifier approved. Every skill INDIVIDUALLY looked correct. The system COLLECTIVELY was broken because nobody tracked individual acceptance criteria end-to-end.

### The Solution: docs/phases/phase-<N>/tracker.md

At the start of each phase, the forger generates a COMPLETENESS TRACKER from the user stories. This is a table with one row per acceptance criterion. Every skill that touches the phase MUST fill its columns before handoff.

### Tracker Format

```markdown
# Completeness Tracker -- Phase N

| Story   | AC# | Acceptance Criterion              | Backend Evidence                | Frontend Evidence               | Test Evidence                  | Verified |
|---------|-----|-----------------------------------|---------------------------------|---------------------------------|--------------------------------|----------|
| STORY-X | 1   | Auto-save on focus-out per field  | PATCH /resources/:id/draft  | useAutoSave() hook, 60s interval| auto-save.spec.ts: fill+reload | PASS     |
| STORY-X | 2   | Character limit per text field    | max_length field on model    | z.string().max(charLimit)       | char-limit.spec.ts: type 2001  | PASS     |
| STORY-X | 3   | Submit disabled without required  | 400 on missing required fields | zodResolver + disabled={!valid} | submit.spec.ts: empty submit   | PASS     |
```

### Who Fills What

| Skill | Column |
|---|---|
| forger (at phase start) | Story, AC#, Acceptance Criterion -- extracted from docs/product/user-stories.md |
| backend-writer | Backend Evidence -- endpoint path, DB constraint, or "N/A (frontend only)" |
| design-tw-frontend-engineer / ui-builder | Frontend Evidence -- component, hook, schema, or "N/A (backend only)" |
| test-writer | Test Evidence -- test file::test name, or "MANUAL: [description]" |
| phase-verifier | Verified -- PASS/FAIL/UNTESTED with specific evidence |

### Enforcement Rules

1. **Before accepting backend-writer handoff:** Every row must have Backend Evidence filled (or "N/A" with reason). 100% required.
2. **Before accepting frontend handoff:** Every row must have Frontend Evidence filled. 100% required.
3. **Before accepting test-writer handoff:** Every row must have Test Evidence filled. "MANUAL" acceptable for max 10% of rows.
4. **Before accepting phase-verifier verdict:** Every row must have Verified filled. 0 FAIL rows required for phase PASS.

If ANY column is unfilled at handoff time, the handoff is BLOCKED. The forger sends the skill back with the specific unfilled rows listed.

### Tracker State in context.json

The markdown tracker is the human-readable artifact; `context.json` mirrors its state so downstream skills can read tracker progress programmatically (not just by re-parsing markdown).

- **forger (at phase start):** writes `completeness_tracker.phase`, `.path`, and `.rows_total` when it generates `docs/phases/phase-<N>/tracker.md`. Until then `rows_total` stays `null`.
- **Each downstream skill:** after filling its column, increments `completeness_tracker.filled_by.<skill_name>` to the count of rows it has filled (equal to `rows_total` when the skill's pass is complete).
- **Handoff enforcement:**
  - If `rows_total === null`: the forger refuses handoff because the tracker has not yet been generated. (Guards against a silent bypass where `0 < 0` would trivially satisfy the inequality.)
  - Otherwise: handoff is blocked while `filled_by.<current_skill> < rows_total`. Any unfilled rows are pushed onto `blocked_reasons` with the form `"STORY-X AC#N: unfilled by <skill>"` so the block is explicit.
- **Clearing `blocked_reasons`:** when the forger accepts a re-handoff that resolves prior blocks, it removes the matching entries from `blocked_reasons` before advancing. Only currently-unresolved blocks persist. `blocked_reasons` is a live signal, not an audit log — the markdown tracker carries the historical record.
- **Phase reset:** on phase boundary, `completeness_tracker` is reinitialised for the new phase (`rows_total` back to `null`, all counters to `0`, `blocked_reasons` cleared). Old state is persisted in the per-phase markdown file only.

### UNGREPPABLE Flag (Advisory)

Story-writer owns the canonical `UNGREPPABLE` tag (see `story-writer/SKILL.md`). When the forger generates the tracker from `docs/product/user-stories.md`, it:

1. Copies any `UNGREPPABLE` tag on an AC straight into the tracker's Status hint column so phase-verifier Stage 0.5 can honour it.
2. Emits advisory warnings for ACs that look like they should be tagged but aren't. Trigger phrases: `smooth`, `animation`, `visual polish`, `timing`, `analytics event`, `pixel-perfect`, `fade`, `transition`. Example:

   ```
   HINT: STORY-X AC-3 contains "smooth animation" but is not UNGREPPABLE-tagged. Consider updating docs/product/user-stories.md.
   ```

3. **Never rewrites the story.** Warnings are surfaced during the tracker-approval step for human review. The story remains the single source of truth.

This keeps authority where it belongs (at story authoring time, behind a human approval gate) while giving the forger a safety net for untagged candidates.

### Depth-First Build Order

To prevent the "breadth over depth" failure (9 screens partially built instead of fewer fully complete):

1. The forger assigns stories to builder skills ONE AT A TIME, not all at once
2. Each story must have ALL its ACs implemented (backend + frontend + tests) before the next story begins
3. Exception: shared infrastructure (auth, layout, API client) can be built across stories first

Build order within a phase:
1. Shared infrastructure -- auth store, API client, layout shells (ONE pass)
2. Story 1: backend -> frontend -> tests (ALL ACs complete, tracker fully filled)
3. Story 2: backend -> frontend -> tests (ALL ACs complete)
4. Story N: ALL ACs complete
5. Phase verification (all stories together)

### Tracker Slicing (for Subagent Isolation)

When a skill is invoked as a subagent per-unit (e.g., backend-writer per module), each subagent writes its slice of the tracker:

```
docs/phases/phase-<N>/tracker-slices/<skill>-<unit>.md
```

Forger merges slices into the canonical `docs/phases/phase-<N>/tracker.md` before handing off to phase-verifier. Merge rules:

1. Each slice contains only rows for stories/ACs that belong to that unit.
2. On merge, forger concatenates rows preserving original order.
3. Duplicate AC rows across slices = **fail the merge** (means two units claim the same AC — control-plane bug).
4. Any AC from the phase's user stories missing from all slices = **fail the merge** (means no unit owned it).

### Context Window Management

Legacy (single-session) mode: for phases with many ACs (>40), process in batches of 3-5 stories. This still applies if forger runs in-thread.

Subagent mode (preferred): each unit runs in its own fresh 1M-token Task subagent. Forger's parent thread never holds more than `context.json` + per-unit return summaries. See **Subagent Invocation Protocol** below.

---

## Approval Gates

Every pipeline artifact must be approved before the next stage begins. This skill owns the approval process — individual skills no longer hand off to a separate review step.

### Approval Format

When a skill finishes its output, present it for review using this structure:

---

**REVIEW GATE: [Stage Name]**
**Artifact:** [What this is]
**Produced by:** [Which skill generated it]
**Required before:** [What comes next]

[Present the artifact clearly — use tables, bullet points, headers as appropriate]

---

**Delivery:** Always use `AskUserQuestion` (single-select) with these options:
- Label: "Approve", Description: "Move to next stage as-is"
- Label: "Approve with changes", Description: "I'll list changes, then you update before proceeding"
- Label: "Reject", Description: "I'll explain what's wrong, then you redo this artifact"

### Approval Rules

1. **Never skip this step.** Even if the output looks obviously correct, always present it for review.
2. **Wait for explicit response.** Do not proceed until the user picks an option.
3. **If "Approve with changes":** Apply changes, show the updated artifact, and ask for re-confirmation before proceeding.
4. **If "Reject":** Ask one clarifying question to understand what went wrong, then redo.
5. **Record the decision** by updating `approvals` in `context.json` and persisting to disk.

### What to Highlight for the User

When presenting for review, call out:
- **Decisions baked in** — assumptions Claude made that the user should know about
- **Downstream impact** — what changes if they reject or modify this artifact
- **Open questions** — anything Claude wasn't sure about and made a best-guess on

Keep it concise. The user is reviewing, not reading an essay. Lead with the artifact, not with explanation.

---

## Branch-Based Project Tracking

Every project lives on its own git branch (`proj/<project-name>`). The branch IS the project context — no symlinks or run folders needed.

### Project Directory Structure

See `.claude/skills/_shared/artifact-taxonomy.md` for the authoritative layout. Summary:

```
talent-forge/                              # on proj/<project-name> branch
  boilerplate/                             # UNTOUCHED template — never modify
    frontend/
    backend/
  frontend/                                # copied from boilerplate/frontend/ at project start
  backend/                                 # copied from boilerplate/backend/ at project start
  docs/
    product/                               # WHAT — discovery + UX intent
      market-research.md
      domain-doc.md
      personas.md
      user-stories.md
      stories/<STORY-ID>.md
      screen-inventory.md
    architecture/                          # HOW — system shape
      system.md                            # architect Pass 1
      database.md                          # db-architect
      api.md                               # api-architect
      build-phases.md                      # architect Pass 2
      deployment.md                        # deploy-setup plan
    quality/                               # cross-phase quality specs
      qa-test-plan.md
      perf-test-spec.md
    phases/
      phase-<N>/
        plans/                             # pre-build specs (backend.md, frontend.md, tests.md)
        build/<skill>/                     # per-unit code-writer outputs (<unit>.md + <unit>.return.json)
        verify/                            # stage-0..3.md, report.md, qa-audit.md, summary.md
        tracker.md                         # merged completeness tracker
        tracker-slices/                    # per-unit slices
        decisions.md                       # phase-scoped decision log
    decisions.md                           # project-wide / cross-phase decisions
  designs/
    screens/                               # legacy HTML prototypes only
  deploy/                                  # deployment configuration
  context.json                             # pointers + approvals + tracker indices only
```

### Project Creation

Project branches are **created at pipeline start**, before domain-researcher begins:

1. Ask the user for a project name.
2. Create branch: `git checkout -b proj/<project-name>`.
3. Copy boilerplate to repo root (idempotent — safe to re-run):
   ```bash
   rm -rf frontend backend
   cp -R boilerplate/frontend frontend
   cp -R boilerplate/backend backend
   mkdir -p docs/product/stories docs/architecture docs/quality docs/phases designs/screens deploy
   touch docs/decisions.md
   ```
4. Force-track `.env` (root `.gitignore` `*.env` blocks it after copy):
   ```bash
   git add -f frontend/.env
   ```
5. Verify critical files landed:
   ```bash
   test -f frontend/package.json && test -f frontend/.env && test -f frontend/vite.config.ts \
     && test -f backend/pyproject.toml && test -f backend/alembic.ini \
     && echo "Copy OK" || { echo "ERROR: missing files"; exit 1; }
   ```
6. **Theme System Preflight (MANDATORY).** Verify the just-copied `frontend/` against the checklist in [`.claude/skills/_shared/theme-system-preflight.md`](../_shared/theme-system-preflight.md). If any item is missing or broken, halt, patch `boilerplate/frontend/`, re-copy, and re-verify. Do not proceed to dependency install with a broken theme system.

7. Install dependencies (subshells prevent directory escape):
   ```bash
   (cd frontend && pnpm install)
   (cd backend && uv sync)
   ```
8. Initialize `context.json` at repo root with the empty `PM_CONTEXT` template above, filling in `project.name` and `project.branch`.

### Resume Capability

When the user says "resume", "continue", or "pick up where I left off":

1. Check the current branch: `git branch --show-current`.
2. If on `main`: list available project branches (`git branch --list 'proj/*'`) and ask the user which to resume. Switch to it: `git checkout proj/<name>`.
3. If already on a `proj/*` branch: proceed.
4. Load `context.json` from the repo root.
5. Check which artifacts exist to determine the last completed stage:
   - `docs/product/market-research.md` exists and `approvals.market_research == true` → market research done
   - `docs/product/domain-doc.md` exists and `approvals.domain_doc == true` → domain doc done
   - `docs/product/user-stories.md` exists and `approvals.user_stories == true` → stories done
   - `docs/product/screen-inventory.md` exists and `approvals.screen_designs == true` → screen designs done (React mock screens from design-tw-ux-designer)
   - `docs/architecture/system.md` exists and `approvals.architecture == true` → architect Pass 1 done
   - `docs/architecture/database.md` exists and `approvals.db_design == true` → db design done
   - `docs/architecture/api.md` exists and `approvals.api_spec == true` → api spec done
   - `docs/architecture/build-phases.md` exists and `approvals.build_phases == true` → architect Pass 2 done (build phase plan)
   - `backend/app/services/` has custom modules and `approvals.backend == true` → backend done
   - `frontend/src/pages/` has custom pages and `approvals.ui == true` → UI done
   - `deploy/` has config files and `approvals.deployment == true` → deployment done
6. Set `project.phase` to the next incomplete stage.
7. Tell the user where they are and what's next.

---

## When Injecting Context into Downstream Skills

Each skill receives **only paths it needs**. Never inline artifact content. Forger injects paths; skills call Read. This is the injection map:

| Target Skill              | Inject These Paths                                                                                             |
|---------------------------|----------------------------------------------------------------------------------------------------------------|
| **story-writer**          | `docs/product/market-research.md`, `docs/product/domain-doc.md`, `docs/product/personas.md`                    |
| **design-tw-ux-designer**     | `docs/product/market-research.md`, `docs/product/domain-doc.md`, `docs/product/user-stories.md`, `docs/product/personas.md` |
| **architect (Pass 1)**    | `frontend/src/` (React mocks), `docs/product/user-stories.md`, `docs/product/personas.md`, `docs/product/domain-doc.md` |
| **db-architect**          | `frontend/src/` (mocks), `docs/product/user-stories.md`, `docs/product/domain-doc.md`, `docs/architecture/system.md` |
| **api-architect**         | `frontend/src/` (mocks), `docs/product/user-stories.md`, `docs/product/domain-doc.md`, `docs/architecture/database.md` |
| **architect (Pass 2)**    | `docs/architecture/database.md`, `docs/architecture/api.md`, `docs/product/user-stories.md`, `docs/product/screen-inventory.md` |
| **backend-writer**        | `docs/architecture/system.md`, `docs/architecture/database.md`, `docs/architecture/api.md`, `docs/architecture/build-phases.md`, per-phase story slices from `docs/product/stories/` |
| **ui-builder**            | `frontend/src/` (mocks), `docs/architecture/system.md`, `docs/architecture/api.md`, `docs/product/personas.md`, per-phase story slices |
| **deploy-setup**          | `docs/architecture/system.md`, `context.json#project.integrations`, `context.json#project.compliance`          |

### Pipeline Stage -> Required Approved Artifacts

| Stage                     | Required Approved Artifacts Before Entry                                              |
|---------------------------|---------------------------------------------------------------------------------------|
| domain-researcher         | _(none — entry point)_                                                                 |
| story-writer              | `market_research`, `domain_doc`                                                        |
| design-tw-ux-designer         | `market_research`, `domain_doc`, `user_stories`                                        |
| architect (Pass 1)        | `screen_designs`, `user_stories`                                                       |
| db-architect              | `screen_designs`, `user_stories`, `architecture`                                       |
| api-architect             | `screen_designs`, `user_stories`, `architecture`, `db_design`                          |
| architect (Pass 2)        | `architecture`, `db_design`, `api_spec`                                                |
| backend-writer (plan)     | `architecture`, `db_design`, `api_spec`, `build_phases`                                |
| backend-writer (build)    | all above + `backend_plan_phase_<N>`                                                   |
| ui-builder (plan)         | `architecture`, `db_design`, `api_spec`, `build_phases`, `screen_designs`              |
| ui-builder (build)        | all above + `frontend_plan_phase_<N>`                                                  |
| test-writer               | per-phase `build/backend/*.md` summaries + `docs/architecture/api.md` + story slices   |
| deploy-setup              | `architecture`, all phase `summary.md` files                                           |

---

## Execution Model: Inline Skills vs Subagent Skills

Not every skill runs as a Task subagent. The decision depends on three factors per skill: token burn, need for mid-run user interactivity, and whether inputs are self-contained on disk.

**Inline (parent-thread) skills** — run in the forger conversation, not via Task:

| Skill | Why inline |
|---|---|
| `domain-researcher` | Runs an interactive discovery interview — fundamentally the wrong shape for a subagent. |
| `story-writer` | Produces a batch backlog but routinely asks scope-clarification questions; batching is an internal pacing rule, not a dispatch boundary. |
| `architect` (both passes) | Small design-doc output; frequently asks user to pick stack/scope options mid-run. |
| `db-architect` | Same — single schema doc, may ask edge-case clarifications. |
| `api-architect` | Same — single spec doc, maps screens interactively. |

Design-phase total context cost is ~50-150k tokens, which stays well under budget even without isolation. Their decisions are appended directly to `docs/decisions.md` (or the phase-scoped log once a phase has started) by forger without a return-contract round-trip.

**Subagent (Task-dispatched) skills** — run in fresh 1M-token contexts, one unit of work per invocation:

| Skill | unit_type | Rationale |
|---|---|---|
| `design-tw-ux-designer` | one_shot | Heavy producer — full frontend mock set. |
| `quality-assurance` | stage | Three stages: `test-plan`, `backend-audit` (per phase), `regression`. |
| `backend-writer` | module | Token-heavy code generation; per-module isolation. |
| `ui-builder` | feature_cluster | Token-heavy; per-cluster isolation. |
| `design-tw-frontend-engineer` | feature_cluster | Same contract as ui-builder (see `SUBAGENT.md`). |
| `test-writer` | module | Token-heavy; per-module isolation. |
| `phase-verifier` | stage | Four stages: gate-tests, backend, frontend, integrated. |
| `perf-test-writer` | one_shot | Runs once per project after all phases — full API surface. |
| `deploy-setup` | one_shot | Runs once at end of pipeline. |

Every subagent skill declares a Context Manifest at the top of its SKILL.md — see `.claude/skills/_shared/manifest-format.md`.

---

## Phased Build Orchestration (Subagent Mode)

After the architect Pass 2 is approved (build phase plan), implementation proceeds in phases. The architect outputs a `build_phases` array in `context.json` with dependency-ordered phases. Forger orchestrates each phase by spawning fresh-context Task subagents per unit of work — never running heavy *producer* skills in its own thread. Design-phase skills (architect family, story-writer, domain-researcher) are the only heavy skills that run inline; see the "Execution Model" section above.

This is the mechanism that keeps the parent thread small (<200k tokens across an entire project) while every unit gets its own 1M-token window.

Shared contracts used throughout this section:
- Manifest format: `.claude/skills/_shared/manifest-format.md`
- Return contract: `.claude/skills/_shared/return-contract.md`

### Phase Lifecycle

Each phase goes through these states:

```
pending -> building_be -> building_fe -> testing -> verifying -> verified (or issues)
```

### Phase Build Loop

For each phase in `docs/architecture/build-phases.md`:

1. **Initialize phase folders.** Create `docs/phases/phase-<N>/{plans,build/backend,build/frontend,build/tests,verify,tracker-slices}`. Create empty `docs/phases/phase-<N>/decisions.md`.
2. Set `current_build_phase` to the phase index. Persist `context.json.artifacts.phase_<N>` pointers. Set status to `building_be_plan`.

3. **Backend plan mini-gate.**
   - Invoke `backend-writer` with `MODE: plan` in a one-shot subagent. It produces `docs/phases/phase-<N>/plans/backend.md` (no code).
   - Present the plan to the user via `AskUserQuestion`: Approve / Approve with changes / Reject.
   - On approve: set `approvals.backend_plan_phase_<N> = true`.
   - On changes: pass the change list as `CHANGES REQUESTED:` and re-spawn plan mode.
   - On reject: ask one clarifying question, then re-spawn plan mode.
4. **Backend build.** Set status to `building_be`. Run `backend-writer` with `MODE: build` per-module orchestration loop (see Per-Unit Orchestration below).
4b. Run **quality-assurance** (stage: `backend-audit`) to catch stubs before the frontend is built. P0 bugs route fixes back to backend-writer (re-run affected modules); re-audit before advancing. P1/P2 bugs logged, do not block.

5. **Frontend plan mini-gate.**
   - Invoke `ui-builder` (or `design-tw-frontend-engineer`) with `MODE: plan` → `docs/phases/phase-<N>/plans/frontend.md`.
   - Present via `AskUserQuestion`. On approve: `approvals.frontend_plan_phase_<N> = true`.
6. **Frontend build.** Set status to `building_fe`. Run the builder with `MODE: build` per-feature-cluster orchestration loop.

7. Set status to `testing`. Run **test-writer** per-module orchestration loop. No plan gate.
8. Set status to `verifying`. Run **phase-verifier** per-stage orchestration loop. Stage 3 writes `docs/phases/phase-<N>/verify/summary.md` (2000-word hard cap).
9. **Merge tracker slices** from `docs/phases/phase-<N>/tracker-slices/*.md` into `docs/phases/phase-<N>/tracker.md`.
10. Review verification returns:
    - All stages complete and verifier reports PASS: set status to `verified`, present phase approval gate.
    - Any stage blocked with issues: set status to `issues`, route fixes to the responsible writer skill, re-run affected stages only.
11. **Phase approval gate.** `AskUserQuestion` with "Approve phase N, proceed to next" / "Approve with changes" / "Reject".
12. On approve: advance `current_build_phase`.

Each phase gets fresh `decisions.md`. Global-scoped decisions persist in `docs/decisions.md` and are visible to all future phases.

### Phase Deliverables Checklist

Each skill invoked during a phase MUST produce these artifacts before handoff:

| Skill | Required Deliverables |
|---|---|
| **backend-writer** | Models, services, routes, migration, seed script (`seed_phase_N()`), router registration in `main.py`, model registration in `__init__.py`, per-unit return JSON, summary markdown, tracker slice |
| **ui-builder** | Pages, components, hooks, API client functions, i18n keys (EN + ES), route registration in `routeTree`, per-unit return JSON, summary markdown, tracker slice |
| **test-writer** | E2E smoke script (`run_phase_N()`), pytest service tests, Vitest component tests, per-unit return JSON, summary markdown, tracker slice Test Evidence column filled |
| **phase-verifier** | Per-stage verification reports (`docs/phases/phase-<N>/verify/stage-<K>.md`), `docs/phases/phase-<N>/verify/report.md`, handoff card, `docs/phases/phase-<N>/verify/summary.md` (Stage 3, <2000 words) |

Before setting a phase to `verifying`, the forger checks that all deliverables exist. Missing deliverables = send back to the responsible skill.

### Subagent Invocation Protocol

Every heavy skill runs in a **fresh Task subagent**. Forger is the only caller of the Task tool — subagents never spawn further subagents.

When invoking a skill via Task, the prompt follows this fixed template:

```
SKILL: <skill-name>
UNIT: <unit-identifier>
PHASE: <N or n/a>
MODE: <plan | build | n/a>                       # code-writers only

LOAD THESE FILES (paths only — use Read to fetch content):
  <required_inputs from manifest>
  <per_unit_inputs from manifest, substituted for this unit>

DO NOT READ:
  <forbidden_paths from manifest>

CONDITIONAL LOADS (only if triggered):
  <conditional_loads from manifest>

PRIOR DECISIONS (read from disk, do not inline content):
  docs/phases/phase-<N>/decisions.md
  docs/decisions.md

ARTIFACTS TO PRODUCE (from manifest `artifacts` block):
  pre_build_plan:   <path or n/a>
  summary:          <path>
  return_contract:  <path>
  tracker_slice:    <path or n/a>

CONTEXT BUDGET: <budget_tokens from manifest>

CHANGES REQUESTED (only on re-invocation):
  <user's change list verbatim>

RETURN:
  1. Respect MODE:
     - plan: write ONLY the pre_build_plan markdown. No code changes.
     - build: write code to `outputs` paths, plus summary, tracker_slice, return_contract.
  2. Write summary markdown per the section structure in .claude/skills/_shared/artifact-taxonomy.md.
  3. Write completeness-tracker slice if applicable.
  4. Write JSON return contract at: <return_contract path from manifest>
     Schema: .claude/skills/_shared/return-contract.md

The skill's full instructions are in .claude/skills/<skill-name>/SKILL.md — or SUBAGENT.md when the skill provides a dedicated subagent-contract file (e.g., design-tw-frontend-engineer). Read whichever exists; if both exist, SUBAGENT.md takes precedence for invocation details.
```

Fill rules:
- Paths only, never file contents. The subagent uses its own Read tool to fetch content.
- `PRIOR DECISIONS` is a list of **paths**, not inlined content. The subagent reads the files itself.
- `MODE` is set per-invocation for code-writers. Absent for other skills.
- `CHANGES REQUESTED` appears only on re-invocation after a user rejection. Forger spawns a brand-new Task — never reuses a subagent.
- Use `subagent_type: general-purpose`.

### Per-Unit Orchestration

For every skill invocation, forger executes this loop:

1. Read the skill's `## Context Manifest` YAML block from its SKILL.md.
2. Compute the unit list:
   - `unit_type: module` — read `build_phases[current].db_models` and `api_endpoints`, group by module.
   - `unit_type: feature_cluster` — read `build_phases[current].frontend_screens`, group related screens (2-4 per cluster by feature domain).
   - `unit_type: stage` — fixed list from the skill body (phase-verifier: gate-tests, backend, frontend, integrated, critical-journey).
   - `unit_type: batch` — split input into groups of 3-5.
   - `unit_type: one_shot` — single unit named `"one_shot"`.
3. Persist to `context.json.current_skill_units[]` and set `current_unit_index: 0`.
4. For each unit: build Task prompt from the template, inject PRIOR DECISIONS, call Task tool, read return JSON, validate against return contract, handle status.
5. After final unit: merge tracker slices into the canonical phase tracker. Clear `current_skill_units[]`.

### Blocked-Unit Handling

A subagent returns `status: blocked` for one of three reasons:

| `blocked_reason` pattern | Forger action |
|---|---|
| `manifest missing X` | Manifest bug. Escalate to user. Do NOT retry silently. |
| `unit too large — suggest splitting into A, B, C` | Split the unit: prepend A, B, C to `current_skill_units[]`, re-invoke on A. |
| `clarification needed: <question>` | Ask user via AskUserQuestion, append answer to `docs/phases/phase-<N>/decisions.md` as a `scope: clarification` entry, re-invoke same unit (the subagent re-reads the log). |

For `status: error` or malformed return JSON: one retry with a RETURN CONTRACT REMINDER block; a second failure escalates to the user with the raw return attached.

### Decision Log — On-Disk, Append-Only

Cross-unit memory lives on disk, not in `context.json`. When a unit makes a decision that sibling units must respect, it returns `decisions[]` in its return JSON. Forger appends each to the appropriate log file.

Files:
- `docs/phases/phase-<N>/decisions.md` — phase-scoped log (fresh per phase)
- `docs/decisions.md` — project-wide log (never pruned; persists across phases)

Forger's append rule:
- Every entry is appended to `docs/phases/phase-<N>/decisions.md`.
- Entries with `scope: global`, `scope: auth`, or `scope: data` are additionally appended to `docs/decisions.md`.
- User clarifications (via AskUserQuestion) are stored with `scope: "clarification"` and `source_unit: "user"`.

Row format (fixed — see `_shared/artifact-taxonomy.md`):
```
## [phase-<N> | <skill>:<unit> | <ISO-timestamp>]
- scope: <module:<name> | feature:<name> | global | auth | data | clarification>
- decision: <single sentence>
- rationale: <single sentence>
- source_unit: <unit_id>
```

Subagent prompts reference the log by path only; no inlined content. The PRIOR DECISIONS block in Task prompts contains the two file paths and nothing else. Subagents call Read to fetch content themselves. No eviction, no overflow — disk is the durable store.

### Approval Gate Flow for Subagents

Approval gates happen at **phase boundaries only** — never per-unit. Per-unit failures are forger-internal (one auto-retry, then escalate).

After all units of the phase's final skill (phase-verifier) return with all stages complete:

1. Forger reads each unit's summary markdown.
2. Concatenates them into a phase-level overview.
3. Presents to user via `AskUserQuestion`: Approve / Approve with changes / Reject.
4. On **Approve with changes**: collect change list, spawn a **new** Task per affected unit with a `CHANGES REQUESTED:` block. Fresh window, same manifest.
5. On **Reject**: ask one clarifying question, append to `docs/phases/phase-<N>/decisions.md` as a `scope: clarification` entry, re-run the full skill from scratch.

Subagents never call AskUserQuestion — all user-facing prompts go through forger's parent thread.

### Phase Summary Protocol

At the end of each phase (after phase-verifier Stage 3 passes), `docs/phases/phase-<N>/verify/summary.md` must exist. This file replaces all per-unit summaries for downstream consumers.

- Writer: phase-verifier's Stage 3 subagent.
- Hard cap: 2000 words. Forger runs `wc -w` on the file before accepting the phase as verified; over-cap rejects the Stage 3 return as blocked.
- Contents (five canonical sections in order):
  1. What was built — per module, 1-2 sentences (aggregated from `build/backend/*.md` and `build/frontend/*.md`).
  2. Key decisions — top rows from `docs/phases/phase-<N>/decisions.md`.
  3. Files touched — aggregated counts from all unit return JSONs (`files_written` + `files_modified`).
  4. Open issues — aggregated from all unit `open_issues[]`.
  5. Integration notes for the next phase.
- Use: On the next phase or on resume, forger loads only `verify/summary.md` plus `context.json` — never the raw per-unit summaries or source trees.

### Subagent Audit Checklist

Before calling the Task tool for any unit, forger verifies:
- [ ] Skill has a Context Manifest that parses as YAML.
- [ ] All `required_inputs` paths exist on disk (for files that should be pre-existing).
- [ ] `budget_tokens` is set.
- [ ] `artifacts.return_contract` is declared; all `artifacts.*` paths are under `docs/` (not in source trees).
- [ ] For code-writers: `mode:` is set to `plan` or `build`, matching forger's intent for this invocation.
- [ ] `PRIOR DECISIONS` block contains exactly two paths (`docs/phases/phase-<N>/decisions.md` + `docs/decisions.md`) and no inlined content.
- [ ] This unit has not already returned successfully (check for existing `artifacts.return_contract` file).

### Artifact Lint Resolution Rules

When stat-ing `artifacts.*` paths after a skill returns, forger resolves two patterns before checking existence:

- **Stage-keyed maps** (`artifacts.summary` or `artifacts.return_contract` declared as `{stage-name: path}`): look up the entry whose key matches the stage identifier injected into this invocation's Task prompt. Lint only that path; the other stages' paths are checked on their own invocations.
- **Pass-scoped keys** (`artifacts.build_phases_plan`): lint only after the skill's Pass 2 invocation. Pass 1 ignores this key — it is not expected to exist yet. Architect is the only skill that uses this today.

Any key the manifest does not declare is not linted. Adding a new canonical artifact key requires extending `_shared/manifest-format.md` first.

### Handoff Screen Reconciliation (MANDATORY)

**Before accepting handoff from design-tw-frontend-engineer (or ui-builder), the forger MUST verify the screen count matches the spec.**

1. Read `build_phases[N].frontend_screens` from context.json — count the expected screens
2. Read the skill's completion summary — count the screens reported as built
3. If the counts don't match, **do not accept the handoff**. List the missing screens and send back.

**Example:**
```
Phase 2 spec:  9 screens (CycleSetupWizard, CycleDashboard, SelfReflection...)
Skill reports: 6 screens built
MISMATCH: 3 screens missing — send back to design-tw-frontend-engineer
```

This check specifically prevents the case where the most complex screen (e.g., a multi-step wizard) is silently dropped. The forger is the gatekeeper — if the spec says 9 screens and only 6 were built, that's a 33% shortfall that must be addressed before verification begins.

**The forger should also verify that the skill provided a delivery reconciliation table** (as required by the design-tw-frontend-engineer skill's Section 15). If no reconciliation table was provided, ask for one before accepting.

### When All Phases Are Verified

Once all phases have `status: "verified"`:
1. Set `approvals.backend = true` and `approvals.ui = true`
2. Set `project.phase = "deploy-setup"`
3. Present final approval gate before proceeding to deployment

### Context Injection Per Phase

When invoking skills for a specific phase, inject:
- **backend-writer:** Full architecture + db design + api spec + only the stories in this phase + domain doc business rules
- **ui-builder:** Stories in this phase + architecture + api spec + screen designs (relevant persona screens only)
- **test-writer:** Stories in this phase + architecture (endpoints from api-spec) + domain doc (business rules)
- **phase-verifier:** Phase stories + architecture + api spec + screen design reference

### Phase Resumption

If a session ends mid-phase, on resume:
1. Read `current_build_phase`, `build_phases[current].status`, `current_skill_units[]`, and `current_unit_index` from context.json.
2. Check for existing `.return.json` files under `docs/phases/phase-<N>/build/<skill>/<unit>.return.json` (for code-writers and tests) and `docs/phases/phase-<N>/verify/stage-<K>.return.json` (for phase-verifier) — any unit with a successful return JSON is done; skip it.
3. Re-invoke the current skill's orchestration loop starting from the first unit without a return JSON. PRIOR DECISIONS is always a pair of file paths (`docs/phases/phase-<N>/decisions.md` + `docs/decisions.md`); the subagent reads both on demand.
4. Do NOT reload prior phase artifacts. Forger's parent thread loads only `context.json` + latest `docs/phases/phase-<N>/verify/summary.md` + whatever the next subagent's manifest requires. Everything else stays on disk.
5. If `status: issues`: present the open issues from the last phase-verifier return and ask the user whether to fix, override, or roll back.

---

## How to Use This Skill

### Starting a New Project

```
User: "Let's build a [product type] product"
→ forger asks for project name
→ Creates branch proj/<name>, copies boilerplate, initializes PM_CONTEXT
→ Hands off to domain-researcher
```

### Passing Context Forward

```
User: "Stories are approved, move to screen design"
→ forger sets approvals.user_stories = true
→ Saves context.json
→ Injects (market_research + user_stories.mvp + personas + domain doc) into design-tw-ux-designer
```

### Architecture Pipeline Flow

```
User: "Screen designs are approved, design the architecture"
→ forger sets approvals.screen_designs = true
→ Invokes architect (Pass 1) with screens + stories + personas + domain doc
→ After approval: sets approvals.architecture = true
→ Invokes db-architect with screens + stories + domain doc + architecture
→ After approval: sets approvals.db_design = true
→ Invokes api-architect with screens + stories + domain doc + db design
→ After approval: sets approvals.api_spec = true
→ Invokes architect (Pass 2) with db design + api spec + stories + screens
→ After approval: sets approvals.build_phases = true
→ Begins phased build loop
```

### Resuming

```
User: "Resume" / "Continue" / "Where was I?"
→ forger checks current git branch
→ If on main, lists proj/* branches and asks user to pick
→ Loads context.json
→ Checks artifacts + approvals
→ Reports status and next step
```

### Checking Status

```
User: "What's been approved?"
→ forger reads approvals map
→ Reports which stages are complete and which are pending
```

---

## Interactive Transitions

Use `AskUserQuestion` for all user-facing decision points:

**New project vs resume:**
- Single-select: "Start a new project" / "Resume an existing project"

**Project name (for new projects):**
- Ask as a follow-up text question after the user chooses "Start a new project"

**Stage transition ("Shall I proceed?"):**
- Single-select: "Proceed to [next stage name]" / "Review this stage again" / "Stop here for now"

**Missing upstream artifact:**
- Single-select: "Run [missing skill] now" / "Skip and proceed anyway" / "Stop and ask the user"

Never ask the user to type "yes", "proceed", "A", or "B" — always provide clickable options.

---

## Rules

1. **Never skip the approval gate.** Every artifact must be approved before the next stage begins.
2. **Always persist to `context.json`** after any mutation to `PM_CONTEXT`.
3. **Only inject what the target skill needs** — follow the injection map above.
4. **On resume, always re-read from disk** — do not rely on in-memory state from a previous session.
5. **Never modify anything under `boilerplate/`** — all code and artifacts go in root-level directories.
