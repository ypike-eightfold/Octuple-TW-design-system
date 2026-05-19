# Context Manifest Format

Every skill in the Forge pipeline — inline and subagent alike — declares a **Context Manifest** at the top of its `SKILL.md`. Forger parses this block when constructing the Task-tool prompt (for subagents) or when wiring inputs (for inline skills) to decide exactly which files to point the skill at, what the unit of work looks like, and what artifacts it must produce.

The manifest is the contract between forger (the control plane) and the skill (the worker). It exists so that:

1. Forger can compute a unit list before spawning any subagent.
2. Skills receive only paths they need — no full artifact content is ever pasted into the prompt.
3. The manifest is enforceable: if a skill discovers a missing file, it must return `status: blocked, blocked_reason: "manifest missing X"` — a loud failure, not silent drift.
4. Every artifact a skill produces is declared in the `artifacts:` block, so forger can lint structure and downstream skills can locate outputs without guessing.

See `.claude/skills/_shared/artifact-taxonomy.md` for the canonical directory layout referenced by manifest paths.

---

## Manifest Location

Place the manifest immediately after the YAML frontmatter, in a fenced code block labelled `yaml`:

````markdown
---
name: backend-writer
description: ...
---

## Context Manifest

```yaml
unit_type: module
mode: plan | build
...
```

## [rest of skill content]
````

Forger parses the first ```yaml``` block after the frontmatter as the manifest.

---

## Field Reference

| Field | Required | Purpose |
|-------|----------|---------|
| `unit_type` | yes | One of: `module`, `feature_cluster`, `stage`, `batch`, `one_shot`. Determines how forger iterates. |
| `mode` | code-writers only | `plan` \| `build`. See **MODE Convention** below. Omit for skills without a pre-build plan. |
| `required_inputs` | yes | Paths loaded for every unit. Literal paths only, except `<N>` (current phase number) is permitted — forger substitutes from `context.json#current_build_phase` (the scalar int) before dispatch. No `<unit>` or `<story-id>` here. |
| `per_unit_inputs` | for iterative unit types | Paths templated per unit (use `<unit>`, `<story-id>`, `<N>`, `<K>` placeholders). |
| `forbidden_paths` | yes | Hard deny-list. Files the skill must NOT load even if referenced elsewhere. |
| `conditional_loads` | no | Paths loaded only when a trigger matches (e.g., "retro-lessons.md when unit touches auth"). |
| `budget_tokens` | no (default: 900000) | Soft ceiling for the skill's working context. Override only when a unit is unusually large or small. |
| `artifacts` | **yes** | Paths the skill writes for this unit. See **Artifacts Block** below. |
| `outputs` | yes | Code paths the skill writes on success (models, components, test files). Used for completeness checking. For design-phase skills, `outputs` matches `artifacts.summary`. |

`return_path` from the old format is now `artifacts.return_contract`.

---

## Artifacts Block

Every skill declares every artifact it produces here. Forger uses these paths to:
- Lint that the artifact exists after the skill returns.
- Point downstream skills at them via the injection map.
- Enforce the content-structure contracts in `_shared/artifact-taxonomy.md`.

```yaml
artifacts:
  pre_build_plan:   docs/phases/phase-<N>/plans/backend.md        # code-writers in MODE: plan only
  summary:          docs/phases/phase-<N>/build/backend/<unit>.md  # human summary (≤300 words)
  return_contract:  docs/phases/phase-<N>/build/backend/<unit>.return.json
  tracker_slice:    docs/phases/phase-<N>/tracker-slices/backend-<unit>.md
```

| Key | Who declares it | Notes |
|---|---|---|
| `pre_build_plan` | code-writers with `mode: plan` | Path to the pre-build plan reviewed at the plan mini-gate. Empty when `mode: build`. |
| `summary` | every skill | Human-readable markdown. Required section structure comes from the producing skill's SKILL.md. May be a single path or a stage-keyed map — see **Stage-Conditional Paths** below. |
| `return_contract` | subagent skills | JSON return file. Inline skills omit. May be a stage-keyed map when the skill runs in multiple stages (same form as `summary`). |
| `tracker_slice` | skills that fill the completeness tracker | Per-unit slice merged into `docs/phases/phase-<N>/tracker.md`. |
| `build_phases_plan` | architect Pass 2 only | Path to the dependency-ordered phase plan written by the architect's second invocation. Forger lints this only after Pass 2 runs — not Pass 1. |

Inline design skills declare `summary` for their primary output. The architect is a special case: it runs in two passes and additionally declares `build_phases_plan` for Pass 2's output.

### Stage-Conditional Paths

Some subagent skills run in multiple stages (e.g., `quality-assurance` has `test-plan`, `backend-audit`, and `regression`; different stages legitimately write to different directories). For these, `summary` and `return_contract` may be declared as a map keyed by stage name rather than a single path:

```yaml
artifacts:
  summary:
    test-plan:     docs/quality/qa-test-plan.md
    backend-audit: docs/phases/phase-<N>/verify/qa-audit.md
    regression:    docs/quality/qa-regression-report.md
  return_contract:
    test-plan:     docs/quality/.qa-test-plan.return.json
    backend-audit: docs/phases/phase-<N>/verify/qa-audit.return.json
    regression:    docs/quality/.qa-regression.return.json
```

Forger resolves the map using the stage identifier it passes in the Task prompt. Only the active stage's path is linted per invocation. Keys must match the stage names listed in the skill body. Skills that run in a single mode keep the scalar form.

---

## MODE Convention (code-writer skills)

`backend-writer`, `ui-builder`, `design-tw-frontend-engineer`, and `perf-test-writer` run in two modes:

- **`mode: plan`** — produce only the pre-build plan (`artifacts.pre_build_plan`). No code changes. Forger gates the user's approval of this plan before advancing.
- **`mode: build`** — produce code + `artifacts.summary` + `artifacts.return_contract` + `artifacts.tracker_slice`. One invocation per unit.

Forger sets `MODE` in the Task prompt for each invocation. Skills must honor it — writing code in `MODE: plan` is a contract violation and forger will reject the return.

**Precedence:** The `MODE:` header in forger's Task prompt always takes precedence over the manifest's `mode:` default field. The manifest default exists so the skill has sensible behavior if invoked directly (outside forger's orchestration); during normal pipeline runs forger sets `MODE` explicitly in every invocation.

Skills without a pre-build plan (`test-writer`) omit the `mode` field and always behave as if in build mode.

---


## Example — `backend-writer` (module, MODE split)

```yaml
unit_type: module
mode: build                                 # forger overrides to `plan` on the first pass
required_inputs:
  - docs/architecture/system.md
  - docs/architecture/build-phases.md
  - context.json#build_phases[current]
per_unit_inputs:
  - docs/architecture/api.md#<unit>
  - docs/architecture/database.md#<unit>
  - docs/product/stories/<story-id>.md
  - backend/app/                            # read existing code before writing (Step 0)
forbidden_paths:
  - docs/product/market-research.md
  - docs/product/user-stories.md            # load per-story slice instead
  - frontend/                               # backend-writer never reads frontend code
conditional_loads:
  - path: docs/architecture/system.md#migration-concerns
    when: unit_touches(existing_model_extension)
budget_tokens: 900000
artifacts:
  pre_build_plan:   docs/phases/phase-<N>/plans/backend.md
  summary:          docs/phases/phase-<N>/build/backend/<unit>.md
  return_contract:  docs/phases/phase-<N>/build/backend/<unit>.return.json
  tracker_slice:    docs/phases/phase-<N>/tracker-slices/backend-<unit>.md
outputs:
  - backend/app/services/<module>.py
  - backend/app/api/routes/<module>.py
  - backend/app/models/<module>.py          # if new table
  - backend/app/schemas/<module>.py
```

---

## Example — `ui-builder` (feature cluster, MODE split)

```yaml
unit_type: feature_cluster
mode: build
required_inputs:
  - docs/architecture/system.md
  - docs/architecture/api.md
  - context.json#build_phases[current]
per_unit_inputs:
  - docs/architecture/api.md#<unit>
  - docs/product/stories/<story-ids-in-cluster>
  - frontend/src/features/<unit>/           # the mock screens to upgrade
forbidden_paths:
  - docs/product/market-research.md
  - docs/product/user-stories.md
  - backend/
conditional_loads:
  - path: .claude/skills/ui-builder/references/retro-lessons.md
    when: unit_touches(auth|dev-toolbar|async-forms|trailing-slashes)
budget_tokens: 900000
artifacts:
  pre_build_plan:   docs/phases/phase-<N>/plans/frontend.md
  summary:          docs/phases/phase-<N>/build/frontend/<unit>.md
  return_contract:  docs/phases/phase-<N>/build/frontend/<unit>.return.json
  tracker_slice:    docs/phases/phase-<N>/tracker-slices/frontend-<unit>.md
outputs:
  - frontend/src/features/<unit>/api.ts
  - frontend/src/features/<unit>/components/*.tsx
  - frontend/src/features/<unit>/pages/*.tsx
```

---

## Example — `phase-verifier` (stage)

```yaml
unit_type: stage
required_inputs:
  - context.json#build_phases[current]
  - docs/phases/phase-<N>/tracker.md        # merged tracker (forger pre-merges slices)
per_unit_inputs:
  # Stage 0: gate tests only
  # Stage 1: backend source + openapi.json
  # Stage 2: frontend source + screen inventory
  # Stage 3: everything + all build/*/<unit>.md summaries + decisions.md
  - stage-specific (see skill body)
forbidden_paths:
  - docs/product/market-research.md
  - docs/product/stories/                   # stage verifies against tracker, not raw stories
budget_tokens: 900000
artifacts:
  summary:          docs/phases/phase-<N>/verify/stage-<K>.md
  return_contract:  docs/phases/phase-<N>/verify/stage-<K>.return.json
outputs:
  - docs/phases/phase-<N>/verify/stage-<K>.md
  - docs/phases/phase-<N>/verify/report.md  # Stage 3 only
  - docs/phases/phase-<N>/verify/summary.md # Stage 3 only, hard 2000-word cap
```

---

## Example — `design-tw-ux-designer` (one-shot)

```yaml
unit_type: one_shot
required_inputs:
  - docs/product/domain-doc.md
  - docs/product/user-stories.md            # acceptable here — one-shot has budget
  - docs/product/personas.md
  - frontend/                               # read boilerplate setup
forbidden_paths:
  - docs/product/market-research.md         # summary already in domain-doc
  - backend/
budget_tokens: 900000
artifacts:
  summary:          docs/product/screen-inventory.md
  return_contract:  docs/product/.design-tw-ux-designer.return.json
outputs:
  - frontend/src/routes/
  - frontend/src/features/
  - frontend/src/components/dev/PersonaSwitcher.tsx
  - frontend/src/components/dev/StateDebugBar.tsx
```

---

## Example — Inline Design Skill (`story-writer`)

Inline skills run in forger's thread, but declare a manifest so their artifacts are catalogued the same way.

```yaml
unit_type: one_shot
required_inputs:
  - docs/product/market-research.md
  - docs/product/domain-doc.md
  - docs/product/personas.md
budget_tokens: 300000
artifacts:
  summary: docs/product/user-stories.md
outputs:
  - docs/product/user-stories.md
  - docs/product/stories/<STORY-ID>.md      # per-story slices
```

No `return_contract` — inline skills update forger's state directly. No `pre_build_plan` — design skills present at their own approval gate.

---

## Unit Type Semantics

| unit_type | Who decides the unit list? | Typical count |
|-----------|----------------------------|---------------|
| `module` | forger reads `build_phases[current].db_models` + `api_endpoints` and groups by module | 3–8 per phase |
| `feature_cluster` | forger reads `build_phases[current].frontend_screens` and groups related screens | 3–6 per phase |
| `stage` | fixed list declared in skill body (e.g., phase-verifier has stages 0/1/2/3) | 4–5 per phase |
| `batch` | forger splits the input into groups of N (e.g., 3–5 stories per batch) | 4–12 total |
| `one_shot` | single invocation, no iteration | 1 |

---

## How Forger Uses the Manifest

1. **Before first invocation:** forger reads the skill's manifest, computes the unit list, and writes it to `context.json#current_skill_units[]`.
2. **For each unit:** forger builds a Task prompt (subagents) or wires inputs (inline), substituting `<unit>`, `<story-id>`, `<N>`, `<K>` placeholders. For code-writers, forger sets `MODE: plan` on the first pass and `MODE: build` after the plan-gate approval.
3. **After skill returns:** forger reads the return JSON at `artifacts.return_contract` (subagents) or accepts the summary update (inline), validates paths in `artifacts.*` exist on disk, validates content-structure against `_shared/artifact-taxonomy.md`, and moves on.
4. **On `status: blocked`:** forger inspects `blocked_reason`. If "manifest missing X", this is a manifest bug — forger escalates to the user rather than retrying.

---

## Rules

1. **Paths only, never content.** Forger pastes file paths into the skill prompt; the skill uses Read to fetch content itself.
2. **Forbidden paths are a hard deny-list.** The skill prompt includes a `DO NOT READ:` section enumerating these paths.
3. **Conditional loads require a trigger.** The `when:` expression is prose evaluated by the skill, not by forger.
4. **Budget is advisory.** The skill monitors its own context usage and returns `status: blocked, blocked_reason: "unit too large — suggest splitting"` if it will exceed budget.
5. **Outputs must be deterministic paths.** No `**/*.py` globs inside `artifacts` (globs acceptable in `outputs` for code directories).
6. **MODE is honored strictly.** `MODE: plan` must not write code. `MODE: build` must produce all declared artifacts. Violation = `status: error`.
7. **Every artifact in the `artifacts` block must exist on disk when the skill returns `status: complete`.** Forger lints this before accepting the return.
