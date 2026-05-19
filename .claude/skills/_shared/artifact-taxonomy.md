# Artifact Taxonomy — Canonical Reference

Every skill in the Forge pipeline writes artifacts to a fixed location. Downstream skills read those artifacts from disk — never from injected context. `context.json` carries only pointers + approval state + tracker indices.

This file is the authoritative reference for what lives where. When in doubt, grep this file — don't invent a new path.

---

## Six Artifact Tiers

| Tier | Name | Location | Producer | Review Point |
|---|---|---|---|---|
| **A** | Global Design Artifacts | `docs/product/*.md`, `docs/architecture/*.md`, `docs/quality/*.md` | design-phase skills (one_shot) | design-phase approval gate |
| **B** | Per-Phase Pre-Build Plans | `docs/phases/phase-<N>/plans/*.md` | code-writers in `MODE: plan` | plan mini-gate (before build) |
| **C** | Per-Unit Return Contracts | `docs/phases/phase-<N>/build/<skill>/<unit>.return.json` | code-writers in `MODE: build` | machine-only |
| **D** | Per-Unit Build Summaries | `docs/phases/phase-<N>/build/<skill>/<unit>.md` | code-writers in `MODE: build` | phase-boundary gate, ≤300 words |
| **E** | Verification Artifacts | `docs/phases/phase-<N>/verify/*.md` | phase-verifier + quality-assurance | phase-boundary gate |
| **F** | Decision Logs | `docs/phases/phase-<N>/decisions.md`, `docs/decisions.md` | forger (append-only from return JSONs) | durable cross-unit memory |

---

## Directory Layout

```
docs/
  product/                              # WHAT we're building (discovery + UX intent)
    market-research.md                  # domain-researcher
    domain-doc.md                       # domain-researcher
    personas.md                         # domain-researcher
    user-stories.md                     # story-writer
    stories/<STORY-ID>.md               # story-writer (per-story slices)
    screen-inventory.md                 # design-tw-ux-designer (inventory + annotations)

  architecture/                         # HOW the system is shaped
    system.md                           # architect Pass 1 — stack + modules
    database.md                         # db-architect
    api.md                              # api-architect
    build-phases.md                     # architect Pass 2 — dependency order
    deployment.md                       # deploy-setup plan

  quality/                              # Cross-phase quality specs
    qa-test-plan.md                     # quality-assurance (test-plan stage)
    perf-test-spec.md                   # perf-test-writer (plan)

  phases/
    phase-<N>/
      plans/                            # Tier B — reviewed at plan mini-gate
        backend.md                      # backend-writer (MODE: plan)
        frontend.md                     # ui-builder / design-tw-frontend-engineer (MODE: plan)
        tests.md                        # test-writer (optional)

      build/                            # Tier C + D — per-unit outputs, grouped by producer
        backend/
          <module>.md                   # human summary, ≤300 words
          <module>.return.json          # machine return contract
        frontend/
          <cluster>.md
          <cluster>.return.json
        tests/
          <module>.md
          <module>.return.json

      verify/                           # Tier E — verification + QA
        stage-0.md                      # phase-verifier gate-tests log
        stage-1.md                      # phase-verifier backend log
        stage-2.md                      # phase-verifier frontend log
        stage-3.md                      # phase-verifier integration log
        report.md                       # full verification report
        qa-audit.md                     # quality-assurance audit
        summary.md                      # 2000-word hard-capped phase summary

      tracker.md                        # merged completeness tracker for the phase
      tracker-slices/                   # per-unit slices, forger merges into tracker.md
        <skill>-<unit>.md
      decisions.md                      # phase-scoped decision log (append-only)

  decisions.md                          # project-wide / cross-phase decisions

designs/
  screens/                              # legacy HTML prototypes only; React mocks live in frontend/src/

context.json                            # pointers + approvals + tracker indices only
```

---

## File-Name Conventions

- **No `.spec.md` or `.summary.md` suffixes.** The folder disambiguates: `plans/backend.md` is a plan; `build/backend/goals.md` is a summary.
- **Kebab-case module and cluster names.** `goals.md`, `cycle-config.md`, `manager-review.md`.
- **`<unit>` is stable across artifacts.** The same unit name appears in `plans/backend.md` Module Inventory, `build/backend/<unit>.md`, `build/backend/<unit>.return.json`, and `tracker-slices/backend-<unit>.md`.
- **`unit_id` format:** `<skill>:<unit>:phase-<N>` (e.g., `backend-writer:goals:phase-2`). Used inside artifacts and return JSONs.

---

## What Goes in `context.json`

Only pointers + state. No content.

```jsonc
{
  "project": { "name": "...", "branch": "...", "phase": "..." },
  "approvals": {
    "market_research": false, "domain_doc": false, "user_stories": false,
    "screen_designs": false, "architecture": false, "db_design": false,
    "api_spec": false, "build_phases": false,
    "backend_plan_phase_<N>": false, "frontend_plan_phase_<N>": false
  },
  "current_build_phase": 2,
  "current_skill_units": [],
  "current_unit_index": 0,
  "artifacts": {
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
    "phase_<N>": {
      "backend_plan":   "docs/phases/phase-<N>/plans/backend.md",
      "frontend_plan":  "docs/phases/phase-<N>/plans/frontend.md",
      "decisions":      "docs/phases/phase-<N>/decisions.md",
      "tracker":        "docs/phases/phase-<N>/tracker.md",
      "summary":        "docs/phases/phase-<N>/verify/summary.md"
    }
  },
  "completeness_tracker": { /* per-phase indices, see forger/SKILL.md */ }
}
```

What's **not** in `context.json` anymore: `market_research`, `user_stories`, `architecture`, `db_design`, `api_spec`, `screen_designs`, `build_phases` **nested objects**. These were inlined in the old layout; they now live only at the paths above, and skills read them with the Read tool.

---

## Decision Log Rules

All cross-unit memory lives on disk.

- **Phase-scoped:** `docs/phases/phase-<N>/decisions.md` — append-only; every unit's `decisions[]` (from its return JSON) gets appended by forger.
- **Project-wide:** `docs/decisions.md` — entries with `scope: global | auth | data` are duplicated here (never evicted).
- **Subagent prompt `PRIOR DECISIONS` block** now reads: *"Read `docs/phases/phase-<N>/decisions.md` and `docs/decisions.md`."* — paths only, no inlined content.

### Row Format (required)

```
## [phase-<N> | <skill>:<unit> | <ISO-timestamp>]
- scope: <module:<name> | feature:<name> | global | auth | data | clarification>
- decision: <single sentence>
- rationale: <single sentence>
- source_unit: <unit_id>
```

---

## Content-Structure Contracts

Each artifact has a required section order. The full headers are listed inline in each producing skill's SKILL.md/SUBAGENT.md; the counts below are what forger validates:

| Artifact | Required sections (count) |
|---|---|
| `plans/backend.md` | 9 |
| `plans/frontend.md` | 7 |
| `plans/tests.md` | 3 (optional) |
| `build/backend/<module>.md` | 10 |
| `build/frontend/<cluster>.md` | 10 |
| `build/tests/<module>.md` | 7 |
| `verify/stage-0.md … stage-3.md` | stage-specific |
| `verify/report.md` | aggregated |
| `verify/qa-audit.md` | P0/P1/P2 bug list + regression |
| `verify/summary.md` | 5 canonical sections, `wc -w < 2000` |
| `decisions.md` rows | 4 fields (scope, decision, rationale, source_unit) |
| `tracker.md` columns | 8 (story_id, AC row, BE, FE, Tests, Verified, Owner unit, Notes) |

---

## Rules

1. **Every skill writes artifacts before it talks.** If it isn't on disk at a known path, it didn't happen. Chat output is ephemeral; artifacts on disk are the contract.
2. **Code-writing skills have two modes.** `MODE: plan` produces only the pre-build plan (Tier B). `MODE: build` produces code + Tier C + Tier D. Forger gates the build mode behind the plan approval gate.
3. **Paths over content.** Forger injects paths into subagent prompts; subagents call Read to fetch content. No inlined artifact content ever enters a prompt.
4. **Section headers are required.** Missing a required header = malformed artifact = forger blocks the handoff.
5. **No artifacts at `docs/` root** except `docs/decisions.md`. Everything else belongs under `docs/product/`, `docs/architecture/`, `docs/quality/`, or `docs/phases/`.
