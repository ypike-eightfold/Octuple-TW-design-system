# Subagent Return Contract

Every subagent spawned by forger via the Task tool returns structured JSON. The JSON is written to disk at `artifacts.return_contract` declared in the skill's Context Manifest. Forger reads the JSON (not the prose summary) for control-flow decisions.

Markdown narrative returns get ignored in half of parent/child handoffs. JSON is mechanically checkable. The paired human-readable markdown summary lives at `artifacts.summary` and is what forger shows the user at the approval gate.

See `.claude/skills/_shared/manifest-format.md` for the full manifest schema and `.claude/skills/_shared/artifact-taxonomy.md` for the directory layout.

---

## Schema

```json
{
  "skill": "backend-writer",
  "unit": "goals",
  "phase": 2,
  "mode": "build",
  "status": "complete | blocked | error",
  "unit_id": "backend-writer:goals:phase-2",
  "artifact_paths": {
    "pre_build_plan":  "docs/phases/phase-2/plans/backend.md",
    "summary":         "docs/phases/phase-2/build/backend/goals.md",
    "return_contract": "docs/phases/phase-2/build/backend/goals.return.json",
    "tracker_slice":   "docs/phases/phase-2/tracker-slices/backend-goals.md"
  },
  "files_written": [
    "backend/app/models/goal.py",
    "backend/app/services/goal.py",
    "backend/app/api/routes/goal.py"
  ],
  "files_modified": [
    "backend/app/api/main.py",
    "backend/scripts/seed.py"
  ],
  "tracker_rows_filled": 12,
  "decisions": [
    {
      "scope": "module:goals",
      "decision": "Use soft-delete via status=archived; no hard DELETE endpoint",
      "rationale": "api-spec only defines PATCH /goals/{id} with status field; no DELETE route",
      "source_unit": "backend-writer:goals:phase-2"
    }
  ],
  "open_issues": [
    {
      "severity": "P2",
      "description": "...",
      "file": "...",
      "recommended_fix": "..."
    }
  ],
  "blocked_reason": null,
  "next_unit_hint": "reviews"
}
```

---

## Field Reference

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `skill` | string | yes | Name of the skill that ran (must match SKILL.md `name`). |
| `unit` | string | yes | Identifier for the unit of work (module name, feature cluster name, stage number, batch id, or `"one_shot"`). |
| `phase` | integer \| null | yes | Current build phase number; `null` for design-phase and project-wide skills. |
| `mode` | enum | yes for code-writers | `"plan"` \| `"build"`. Omit for skills without a MODE split. |
| `status` | enum | yes | `complete` = unit delivered successfully; `blocked` = manifest/unit problem, forger resolves; `error` = unexpected failure, forger retries once then escalates. |
| `unit_id` | string | yes | Stable identifier: `<skill>:<unit>:phase-<N>` (e.g., `backend-writer:goals:phase-2`). Indexed by the decision log. |
| `artifact_paths.pre_build_plan` | string \| null | yes for code-writers in `mode: plan` | Path to the pre-build plan reviewed at the plan mini-gate. Null for design skills and build-mode returns that merely reference the plan. |
| `artifact_paths.summary` | string | yes for `status: complete` | Path to the human-readable markdown summary (section structure per `_shared/artifact-taxonomy.md`). |
| `artifact_paths.return_contract` | string | yes | Path to this JSON file itself (self-reference). Lets forger and downstream tools trace back without guessing. |
| `artifact_paths.tracker_slice` | string | yes for skills that fill the completeness tracker | Path to this unit's slice of the phase's tracker. |
| `files_written` | string[] | yes | Code/asset paths created by this unit. Empty for `mode: plan`. |
| `files_modified` | string[] | yes | Code/asset paths changed (not newly created). Empty for `mode: plan`. |
| `tracker_rows_filled` | integer | yes when tracker_slice is present | Row count in the slice. Used for arithmetic reconciliation at phase end. |
| `decisions` | object[] | optional | Decisions made during this unit. Forger appends each to `docs/phases/phase-<N>/decisions.md` and (if scope is `global`/`auth`/`data`) to `docs/decisions.md`. Each entry: `{scope, decision, rationale, source_unit}`. |
| `open_issues` | object[] | optional | Known-but-deferred issues. Each: `{severity, description, file, recommended_fix}`. Forger surfaces at the approval gate. |
| `blocked_reason` | string \| null | yes when `status: blocked` | Human-readable reason. Examples: `"manifest missing docs/X.md"`, `"unit too large — suggest splitting into A, B, C"`, `"clarification needed: should we support Y?"`. |
| `next_unit_hint` | string | optional | Subagent's suggestion for the next unit. Non-binding; forger uses dependency order from `context.json`. |

---

## Summary Markdown Format

The file at `artifact_paths.summary` is what forger shows the user at the approval gate. The section structure is fixed per artifact type — see the producing skill's SKILL.md for the required headers. Example for `build/backend/<module>.md`:

```markdown
# backend-writer:goals:phase-2 — complete

## Files Created
- `backend/app/models/goal.py` — Goal SQLModel (status enum: draft/active/archived/completed)
- `backend/app/services/goal.py` — CRUD service with RBAC (IC = own goals; Manager = direct reports)
- `backend/app/api/routes/goal.py` — 5 endpoints
- `backend/app/schemas/goal.py` — Pydantic request/response shapes

## Files Modified
- `backend/app/api/main.py` — registered goal_router
- `backend/scripts/seed.py` — added `seed_phase_2_goals()` (3 sample goals across 2 personas)

## Endpoints Shipped
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET  | /goals/       | JWT | scoped by persona RBAC |
| POST | /goals/       | JWT |  |
| PATCH| /goals/{id}   | JWT | partial updates only |
| POST | /goals/{id}/archive | JWT | soft-delete |
| GET  | /goals/{id}   | JWT |  |

## Models & Columns
- Goal: id, owner_id (FK user), title, description, status enum, progress int 0-100, created_at, updated_at

## Business Rules Implemented
- [x] Progress 0-100 only (integer)
- [x] Status transitions: draft → active → (archived | completed)
- [x] Only owner or owner's manager can edit

## Deviations from Plan
- None

## Seed Data Added
`seed_phase_2_goals()` creates 3 goals for personas IC1 and MGR1.

## Open Issues / Follow-ups
- None

## Handoff Notes
- Frontend should use `useGoalQuery(id)` for the detail page and `useGoalListQuery({status})` for lists.
- `progress` is integer — no decimal input on the form.
```

Hard cap: **300 words.** Anything longer means you're rebuilding context in the summary.

---

## Rules

1. **JSON is the source of truth.** Forger makes all control-flow decisions from the JSON. The summary markdown is for human review only.
2. **Write the JSON last.** After all files are on disk and the summary markdown is written, write the JSON. A half-written JSON is a worst-case parser failure.
3. **`artifact_paths` must resolve on disk when `status: complete`.** Forger stats each path before accepting the return. Missing file = treat as `status: blocked, blocked_reason: "output missing: <path>"`.
4. **One retry on malformed JSON.** If forger can't parse the return file, it re-invokes the subagent with a "RETURN CONTRACT REMINDER" block. Second failure = show raw to user.
5. **`blocked` is not a failure — it's a control signal.** Use it when the unit is too large, a manifest file is missing, or you need user input to proceed. Forger handles all three.
6. **Never include raw artifact content in the JSON.** Paths only. Summary markdown can quote short snippets if essential, but even there — keep it tight.
7. **Decisions block is how cross-unit memory flows.** If your unit made a choice that affects a sibling unit, record it here. Forger appends to `docs/phases/phase-<N>/decisions.md`; global/auth/data scopes also append to `docs/decisions.md`. Subsequent subagents read the decision log files — never see inline decision content in their prompts.
