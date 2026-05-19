# Frontend UI Engineer — Subagent Contract

This skill is invoked by **forger** as a Task-tool subagent. The manifest and return protocol are:

- Manifest format: `.claude/skills/_shared/manifest-format.md`
- Return contract: `.claude/skills/_shared/return-contract.md`

## Context Manifest

```yaml
unit_type: feature_cluster
mode: build          # forger overrides to `plan` for pre-build plan invocations
required_inputs:
  - docs/architecture/system.md
  - context.json#build_phases[current]
per_unit_inputs:
  - docs/architecture/api.md#<unit>
  - docs/product/stories/<story-ids-in-cluster>
  - frontend/src/features/<unit>/
forbidden_paths:
  - docs/product/market-research.md
  - docs/product/user-stories.md
  - backend/
conditional_loads:
  - path: .claude/skills/ui-builder/references/retro-lessons.md
    when: unit_touches(auth|dev-toolbar|async-forms|trailing-slashes)
budget_tokens: 900000
outputs:
  - frontend/src/features/<unit>/
artifacts:
  pre_build_plan:   docs/phases/phase-<N>/plans/frontend.md    # MODE: plan only
  summary:          docs/phases/phase-<N>/build/frontend/<unit>.md
  return_contract:  docs/phases/phase-<N>/build/frontend/<unit>.return.json
  tracker_slice:    docs/phases/phase-<N>/tracker-slices/frontend-<unit>.md
```

## MODE Convention

Forger sets `MODE: plan` or `MODE: build` in the Task prompt. **The Task-prompt `MODE:` header always takes precedence over the manifest's `mode:` default** (see `_shared/manifest-format.md` §MODE Convention → Precedence).

### MODE: plan
Write ONLY the pre-build plan at `artifacts.pre_build_plan` (see manifest). No code changes. No writes to `outputs:` paths. No summary, tracker slice, or return contract.

The plan must contain these seven required section headers:
1. Header · 2. Feature Cluster Grouping · 3. Per-Cluster Detail · 4. Global Frontend Changes · 5. Design Deviations from Mocks · 6. Out of Scope · 7. Open Questions for User

Target length ~600–800 words. This is what the user reviews at the **plan mini-gate** before any code is written.

On completion return `status: complete` with `artifact_paths.pre_build_plan` set and the other `artifact_paths.*` null.

### MODE: build
Read the approved plan from `artifacts.pre_build_plan` — forger guarantees it exists and was approved at the plan mini-gate. Then:
1. Write code to the paths declared in `outputs:` (manifest).
2. Write the per-unit summary at `artifacts.summary` (≤300 words) with these 10 headers: Unit ID + status, Files Created, Files Modified, Routes Added, API Hooks Wired, Forms + Zod Schemas, Zustand State, Deviations, Known UI Issues, Testing Notes.
3. Write the tracker slice at `artifacts.tracker_slice`.
4. Write the JSON return contract at `artifacts.return_contract` per `_shared/return-contract.md`.

Never write code in `MODE: plan`. Never overwrite the pre-build plan in `MODE: build` — it is already approved and immutable for this phase.

## Running as a Subagent

One **feature cluster** per invocation. Write:
- Source files under `frontend/src/features/<unit>/`
- Summary: `docs/phases/phase-<N>/build/frontend/<unit>.md` (<300 words)
- Tracker slice: `docs/phases/phase-<N>/tracker-slices/frontend-<unit>.md`
- Return JSON: at the `artifacts.return_contract` path declared in the manifest

Do NOT call AskUserQuestion. Use `status: blocked` in the return JSON if you need user clarification — forger will resolve and re-invoke.
