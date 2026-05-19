---
name: story-writer
description: >
  Generates spec-level user stories with numbered workflow steps, acceptance criteria, and per-story UI breakdowns
  for any software domain. Supports two input modes: (1) greenfield — from an approved domain doc and market research
  brief; (2) restructure — from an existing raw stories file at `docs/product/user-stories-raw*.md` (primary) or `docs/user-stories-raw*.md` (legacy — any template),
  restructuring content into the 12-section template, filling foundation gaps, resolving inconsistencies, and
  trimming un-buildable prose. Uses a structural template to guarantee every story has the 12 sections that
  downstream skills (design-tw-ux-designer, architect, db-architect, api-architect, backend-writer,
  design-tw-frontend-engineer, phase-verifier, quality-assurance) require. Writes stories in batches of 3-5 with a
  verification gate between batches. Trigger whenever the user wants to define what the system should do, mentions
  user stories, acceptance criteria, product backlog, MVP scope, or feature list — OR when the user has a raw
  stories file they want restructured into the pipeline's template. Always check forger first for pre-conditions.
---

# Story Writer

## Context Manifest

```yaml
unit_type: one_shot
required_inputs:
  - docs/product/market-research.md
  - docs/product/domain-doc.md
  - docs/product/personas.md
forbidden_paths: []
conditional_loads:
  - path: docs/product/user-stories-raw*.md    # primary (new taxonomy)
    when: restructure_mode
  - path: docs/user-stories-raw*.md            # legacy fallback
    when: restructure_mode
budget_tokens: 400000
artifacts:
  summary:          docs/product/user-stories.md   # index + per-story files under docs/product/stories/
outputs:
  - docs/product/user-stories.md
  - docs/product/stories/<STORY-ID>.md
```


### Raw File Location Note

If the raw file is found only at the legacy location (`docs/user-stories-raw*.md`) and not at the primary (`docs/product/user-stories-raw*.md`), include a one-line note in the final output summary suggesting the user move it to `docs/product/` for consistency with the new taxonomy. Do not move the file yourself — it is user-owned.

This skill is **inline**. It may also read `docs/product/user-stories-raw*.md` (primary) or `docs/user-stories-raw*.md` (legacy) if operating in restructure mode.

Generates a prioritised user story backlog organised by workflow cluster and written in batches with verification gates. Works from either a domain doc (greenfield) or an existing raw stories file (restructure).

---

## Input Modes

Determine mode in this order:

1. If `story_writer_brief.detected_mode` is set in `context.json`, use it (resume path).
2. Otherwise run `ls docs/product/user-stories-raw*.md docs/user-stories-raw*.md 2>/dev/null`:
   - No match → **Greenfield Mode** (domain doc is source of truth).
   - Any match → ask via `AskUserQuestion` whether to enter **Restructure Mode** (raw file is source of truth) or continue in Greenfield and ignore the raw file.
3. Persist the chosen mode to `story_writer_brief.detected_mode` before any Phase 0 or Phase 1 work.

---

This skill runs inline in the forger parent thread (not as a Task subagent). Stories are written in batches of 3-5 (with a verification gate between batches) to prevent context-window quality degradation — batching is an internal pacing rule, not a subagent dispatch boundary. Forger presents the batch review gate between batches and handles approval; this skill may call AskUserQuestion to clarify scope decisions.

Per-story files (`docs/product/stories/<STORY-ID>.md`) are the source of truth for all downstream skills. `docs/product/user-stories.md` is a cumulative index (headline + one-line summary + link to per-story file), appended each batch.

---

## Pre-conditions

### Greenfield Mode

Before writing stories, confirm via forger:

- ✅ Domain doc is approved
- ✅ Market research is complete
- ✅ Personas are defined
- ✅ Methodology is confirmed (OKRs, 360, scheduling, etc.)

If any of these are missing, stop and ask the user to complete `domain-researcher` first.

### Restructure Mode

Before restructuring, confirm:

- ✅ raw stories file exists at `docs/product/user-stories-raw*.md` or `docs/user-stories-raw*.md` and is readable
- ✅ Personas are defined — if not, extract them from the raw file (persona names, role lines, Permissions tables) and persist to `context.json` for downstream skills
- ✅ Domain and methodology are implicit in the raw file — no separate domain doc required

Raw files are preserved untouched for traceability. The skill writes only to `docs/product/user-stories.md`.

---

## Story Structure

Every story is a **full functional spec**, not a backlog ticket. It must contain enough detail for the full skill pipeline (design-tw-ux-designer → architect → db-architect → api-architect → backend-writer → design-tw-frontend-engineer → phase-verifier → quality-assurance) to execute without ambiguity.

### Template-Driven Generation

**Before writing any story, read `references/story-template.md`.** This template defines exactly 12 sections (8 hard + 4 soft) that every story must contain. The template IS the structural contract between story-writer and all downstream skills.

**Do not free-write stories.** Fill in the template section by section. This prevents the most common failure mode: writing detailed user journeys but dropping structural sections (edge cases, permissions, screen states) as context grows.

### What the Template Contains (summary — read the actual file for details)

**Hard sections (8) — story fails verification if missing:**
1. Story Header (ID, persona, statement, priority, dependencies, research citation)
2. User Journey (step-by-step with fields, buttons, tables, actions)
3. Screen Inventory (table: screen name, route, persona, purpose)
4. Field Inventory (table per screen: field, type, required, validation, default)
5. Acceptance Criteria (minimum 8 testable checkboxes)
6. Edge Cases & Validation (minimum 5 rows: empty, boundary, permission, conflict, mid-workflow)
7. Permissions — Role + Scope (table: every persona with access level and scope)
8. Screen States (per screen: empty, loading, populated, error descriptions)

**Soft sections (4) — required but can be brief:**
9. Status Enums & Transitions (state machine for stateful entities)
10. Filters, Sort & Search (per list screen)
11. Configurability (what's admin-editable vs hardcoded)
12. Story Dependencies (depends on: story IDs)

### What is NOT in the template (owned by other skills)

These sections are deliberately excluded — they belong to downstream skills:
- ~~Data Model Hints~~ → owned by **db-architect** (extracts entities from screens + stories)
- ~~API Contract Hints~~ → owned by **api-architect** (designs endpoints from screens + stories)
- ~~Outbound Events~~ → owned by **architect** (defines event bus in architecture doc)
- ~~Cross-Product Touchpoints~~ → owned by **architect** (integration decisions are architecture)
- ~~Change Impact / Feeds Into~~ → owned by **architect** (analyzes cross-story dependencies in phase planning)

The rule: **stories define WHAT the product does and WHO can do it. Architecture defines HOW it's built and HOW things connect.**

### Competitive Benchmark (per story)

Before writing each story, check how top 3 competitors in the domain handle this workflow. Include the finding in the story header's **Research Citation** field.

Format: `[Competitor] — [one-line pattern adopted or gap flagged]`

If no relevant competitor pattern exists, write: "No direct competitor reference — novel workflow."

In Restructure Mode, extract citations from the raw file's "Competitive Benchmark" block where present, collapsing multi-paragraph commentary into a single-line citation.

### Cross-Cutting Concerns (Doc-Level)

Cross-cutting concerns (i18n, timezone, accessibility, multi-tenancy, audit, error handling, privacy, performance, mobile) are written ONCE at the top of `docs/product/user-stories.md` and apply to ALL stories. They are NOT repeated per story.

**See `references/story-template.md` → "Cross-Cutting Concerns" section** for the standard 10-item list to include at the doc level.

If a specific story has a notable EXCEPTION to any cross-cutting concern, add a one-line note in that story's Edge Cases table.

### UNGREPPABLE ACs

If an acceptance criterion has no greppable signature — visual polish, analytics events, timing / performance behaviour, pixel-perfect styling — suffix it with the literal tag `UNGREPPABLE` in uppercase parentheses. This signals downstream skills (forger, phase-verifier Stage 0.5) to verify the AC via visual walkthrough rather than the code-grep gate.

```markdown
AC-3: Transition from dashboard to detail renders with a smooth fade (UNGREPPABLE)
AC-4: Completion event is fired to the analytics bus (UNGREPPABLE)
AC-5: Submit button is disabled until all required fields filled       ← greppable, no tag
```

Rules:
- Tag belongs at the end of the AC text, in parentheses, uppercase: `(UNGREPPABLE)`.
- Only use when the behaviour genuinely cannot be detected via grep / code inspection. Server-side RBAC, character limits, validation rules, and data mutations ARE greppable — do not tag them.
- The forger will emit advisory warnings for ACs whose text contains phrases like `smooth`, `animation`, `visual polish`, `timing`, `analytics event`, `pixel-perfect`, `fade`, `transition` when they lack the tag. Review those warnings during tracker approval and either add the tag or clarify the AC.
- **Rollout:** stories written before this convention existed default to untagged. Retrofitting is out of scope for story-writer; such stories fall back to `FOUND` / `NOT FOUND` at Stage 0.5.

### Story Verification

**After each batch, read `references/story-criteria.md` and run the full checklist against every story in the batch.** The criteria file defines 8 hard criteria (batch blocks if any fails) and 5 soft criteria (flag but don't block).

Do not rely on memory — re-read the criteria file at the start of each verification pass. This compensates for quality drift as context grows.

---

## Restructure Workflow (Phase 0 — runs only in Restructure Mode)

Before the normal batch-based generation begins, Restructure Mode adds a six-step Phase 0. Complete all six steps and get user approval before entering Phase 1.

### Step 1: Ingest

Read every matching file under `docs/product/user-stories-raw*.md` (primary) and `docs/user-stories-raw*.md` (legacy fallback). Catalogue:

- Story IDs present (e.g., `REVIEW-001..011`)
- Persona names and role lines
- Entity names referenced (e.g., `review_cycles`, `peer_feedback`, `employees`)
- Status values mentioned (e.g., `DRAFT`, `SUBMITTED`, `ACKNOWLEDGED`)
- IDs referenced but not defined (e.g., a story mentions `CAL-001` but no `CAL-001` section exists)
- Raw sections present per story (to diff against the 12-section template)

If more than one file matches across `docs/product/user-stories-raw*.md` and `docs/user-stories-raw*.md`, ask the user via `AskUserQuestion` which is primary before proceeding.

### Step 2: Gap Analysis

Produce a structured diff showing which template sections are missing, partial, or present. Output a table like:

```
| Raw Section                  | Template Section          | Status           | Action                             |
|------------------------------|---------------------------|------------------|------------------------------------|
| Story Statement              | §1 Story Header           | Partial          | Add Research Citation              |
| User Journey                 | §2 User Journey           | ✅ Present        | Restructure into numbered steps    |
| —                            | §3 Screen Inventory       | Missing (prose)  | Extract from User Journey          |
| —                            | §4 Field Inventory        | Missing (prose)  | Extract fields into per-screen tables |
| —                            | §8 Screen States          | Missing          | Add 4 states per screen            |
| Cross-Product Touchpoints    | —                         | Drop             | Architect owns                     |
| Outbound Events              | —                         | Drop             | Architect owns                     |
| Prototype Gap Analysis       | —                         | Drop             | Noise                              |
```

### Step 3: Missing-Story Detection

For every ID referenced in the raw file but not defined, classify into one of:

- **`always-required-foundation`** — `AUTH-*`, `ADMIN-*` directory/role stories, `HOME-*` entry points. These block the entire product and MUST be added unless the user explicitly scopes them out.
- **`referenced-but-missing`** — other missing IDs (e.g., `CAL-001`, `NOTIF-001`, `REPORT-001`). These should either be added or explicitly deferred to Phase 2.
- **`phase-2-deferrable`** — features clearly marked Phase 2 / AI / ML / future in the raw file. Leave as-is; no new story.

Produce a prioritised list the user will choose from in Step 6.

### Step 4: Inconsistency Scan

Diff cross-story rules and enumerate contradictions. For each, propose a best-judgment resolution. Do not silently resolve — the user must approve the handling mode in Step 6.

### Step 5: Edge-Case Audit

The template requires at least one edge case per story across 5 categories (empty, boundary, permission, conflict, mid-workflow). Check each raw story for gaps, but **only surface edge cases the raw stories already hint at and underspecify** — e.g., raw mentions "overdue" but doesn't say what the UI does. Do NOT invent external edge cases (mid-cycle org change, GDPR deletion, mobile constraints, etc.) unless the raw file references them.

### Step 6: Present the Restructure Plan

Produce a single review gate with four parts:

1. **Stories to restructure** — the raw story list
2. **Stories to add** — foundation + referenced-but-missing, grouped by classification
3. **Inconsistency resolutions** — numbered list with proposed best-judgment decisions
4. **Batch grouping** — 3–5 stories per batch, ordered by dependency

Deliver via two `AskUserQuestion` calls:

**Q1 — Scope:**
- Full MVP (restructure + all foundation + referenced-but-missing)
- Raw + foundation only (restructure + AUTH/ADMIN/HOME; defer others to Phase 2)
- Restructure only (convert raw into template, no new stories; may leave dangling references)

**Q2 — Inconsistency handling:**
- Resolve inline with best-judgment (recommended) — each gets a `**Resolved:**` marker
- Pause per issue — ask user for each decision
- Leave as-is — carry raw inconsistencies into the final doc

Persist the confirmed plan to `context.json` under `story_writer_brief` before Phase 1:

```json
"story_writer_brief": {
  "detected_mode": "restructure",
  "scope": "full-mvp",
  "inconsistency_handling": "best-judgment",
  "batch_plan": [
    ["AUTH-001", "ADMIN-001", "ADMIN-002"],
    ["REVIEW-001", "REVIEW-002", "REVIEW-003"]
  ],
  "inconsistency_counter": 0,
  "current_batch": 0
}
```

---

## Drop / Add / Trim Rules (applied during restructure)

### DROP from raw stories

These sections belong to other skills or are noise; strip them from every restructured story:

- **Cross-Product Touchpoints** → owned by architect
- **Change Impact / Feeds Into** → owned by architect
- **Prototype Gap Analysis** → noise (skill produces screen inventory instead)
- **Outbound Events** → owned by architect (event bus design)
- **Telemetry / Analytics Events** → owned by architect
- **Cross-reference-index file links** → not part of the pipeline graph

### ADD by extraction (do not invent)

Extract from existing prose; never fabricate behaviour:

- **Research Citation** — one-line reference extracted from raw's "Competitive Benchmark" block; mark `"No direct competitor reference"` if absent. Never generate from memory.
- **Screen Inventory table** — route / persona / purpose per screen mentioned in the User Journey
- **Field Inventory per-screen tables** — field / type / required / validation / default, extracted from User Journey prose
- **Screen States** — 4 states per screen (Empty / Loading / Populated / Error)
- **Formalized Status Enums & Transitions** — extract state references from the prose and formalize as a state machine
- **Consolidated Filters / Sort / Search** per list screen
- **Doc-level 10 Cross-Cutting Concerns** at the top of `docs/product/user-stories.md`

### TRIM rule

If raw prose lacks enough detail to build with certainty, **delete it; never invent**. Specifically:

- Vague references to "AI-assisted drafting", "sentiment analysis", "ML suggestions" → drop or annotate as Phase 2 in a Note-on-scope block
- Features dependent on out-of-scope modules (Goals, OKR, Calibration when deferred) → stub with a Note-on-scope callout (see next section)
- Prose that names a table/event/integration but never specifies its behaviour → drop
- Phase-2 / Deferred features with no MVP thread → drop from the story; keep a one-line Phase-2 entry in the summary table if the user selected Full MVP scope

Phase-2 / deferred features must never appear as if they are MVP behaviour.

---

## Inconsistency Handling

Applies only when `inconsistency_handling` is `best-judgment` or `pause-per-issue`. Under `leave-as-is`, skip this section entirely.

When the raw file contains contradictions across stories, flag each one inline at the top of the affected story's body (below the Story Header, above User Journey):

```markdown
**Resolved:** [short decision statement] *(flagged for approval — inconsistency #N)*
```

`N` is sourced from `story_writer_brief.inconsistency_counter`: seeded to `0` at Step 6, post-incremented per marker (first marker is `#1`), and flushed to `context.json` at the end of every batch. It is a document-global sequence — do not reset across batches.

---

## Cross-Story Screen Convention

When a screen appears in multiple stories, ownership is resolved by `batch_plan` order:

- **First story** — full Screen Inventory row + Field Inventory table + Screen States (4 states).
- **Subsequent stories** — mark the row `[Modified]` and document only delta fields / added states.

---

## Note-on-Scope Callouts

When a raw story references a feature that depends on an out-of-scope module, do not drop it silently. Emit a **Note on scope:** block at the top of the restructured story (below Story Header, above User Journey) listing: the module/story the feature depends on, why it's out of scope, and how the integration point is stubbed.

Downstream skills (design-tw-ux-designer, api-architect, backend-writer) use these callouts to avoid over-building.

---

## Generation Workflow — Batch-Based

### Phase 1: Plan All Stories

- **Greenfield Mode** — plan from the domain doc. Produce the batch plan per the Greenfield rules below (read domain doc + market research, list IDs, cluster into batches of 3-5 by workflow, order by dependency). Present for approval via `AskUserQuestion`.
- **Restructure Mode** — use the batch plan already confirmed in the Restructure Workflow's Step 6. Skip re-planning; move straight to Phase 2.

#### Greenfield planning format

Before writing any story content:

1. **Read the domain doc and market research** — understand the full product scope
2. **List all story IDs with one-line summaries** — e.g., "REVIEW-001: Create and configure a review cycle"
3. **Group stories into batches of 3-5** by workflow cluster (not by persona). Related stories that share entities, permissions, and state machines go in the same batch.
4. **Order batches by dependency** — foundation stories first (auth, admin setup), core workflows second, analytics/reporting last

Present the batch plan to the user for approval before writing:

```
BATCH PLAN

Batch 1 — Foundation (3 stories)
  AUTH-001: User authentication and role-based access
  ADMIN-001: Employee management
  ADMIN-002: System configuration

Batch 2 — Core Workflow (4 stories)
  REVIEW-001: Create and configure review cycle
  REVIEW-002: Monitor and manage live cycle
  REVIEW-003: Employee completes self-assessment
  REVIEW-004: Employee nominates peers

Batch 3 — ...
```

### Why Workflow Clusters, Not Personas

Grouping by persona (all HR Admin stories, then all Manager stories) breaks cross-persona workflows. A review cycle involves HR Admin creating it, Employee completing self-assessment, Manager writing review — these share entities, status enums, and permissions. Writing them together keeps things consistent.

### Batch Size: 3-5 Stories

- **Under 3:** Too few stories to see cross-story patterns and consistency
- **Over 5:** Context window pressure causes quality degradation — this is the exact failure mode we're fixing
- **Sweet spot: 3-5** related stories per batch keeps total output under ~40k tokens

### Phase 2: Write Each Batch

For each batch:

1. **Read `references/story-template.md`** — re-read it at the start of EACH batch, not just the first one
2. **Write each story by filling in the template** — section by section, in order
3. **In Restructure Mode:** apply the Drop / Add / Trim rules and insert `**Resolved:**` markers for any inconsistency affecting stories in this batch
4. **After completing all stories in the batch, read `references/story-criteria.md`**
5. **Run the verification checklist against each story** — mark PASS/FAIL per criterion
6. **Fix all HARD FAIL items inline** — do not present the batch until all hard criteria pass
7. **Note any SOFT FAIL items** in a "Verification Notes" section
8. **Present the batch to the user** with the verification summary

### Phase 3: Cross-Cutting and Doc-Level

After ALL batches are complete:

1. **Write the cross-cutting concerns section** at the top of `docs/product/user-stories.md` (10 items from template)
2. **Write the summary table** — all stories with ID, persona, one-line description, priority, batch number
3. **Write the phasing summary** — Phase 1/2/3 story counts
4. **Final cross-batch consistency check:**
   - Shared entities use same names across all batches
   - Status enums are consistent
   - Permissions don't contradict
   - Dependency graph has no cycles

### Phase 4: Handoff

1. Present the complete `docs/product/user-stories.md` to the user
2. After approval, update forger context: set `approvals.user_stories = true` and record batch completion in `context.json`
3. Next skill in pipeline: **design-tw-ux-designer**

### Resume

After each approved batch, flush `current_batch`, `detected_mode`, and `inconsistency_counter` to `story_writer_brief`. On re-invocation, read these from `context.json` first and resume at the next un-written batch — do not re-present already-approved batches or re-run mode detection.

---

## Workflows to Cover

Generate stories for each workflow category defined in the domain doc (Greenfield) or referenced by the raw file (Restructure). The domain doc or raw file identifies the product's modules and their scope.

For each module:
1. **Identify the primary persona** who uses this module most
2. **Identify the core workflow** — the main sequence of actions
3. **Identify admin/setup stories** — configuration needed before the workflow works
4. **Identify reporting/analytics stories** — dashboards and exports for this module
5. **Identify edge-case stories** — compliance, audit, data export

### Always Include These Cross-Domain Workflows

Regardless of domain, every product needs:
- **Authentication & RBAC** — login, role-based access, session management
- **Administration** — user management, org hierarchy, system configuration
- **Notifications** — email + in-app for key events
- **Analytics/Reporting** — at least one dashboard per power-user persona + one data export

**In Restructure Mode**, these become **MUST ADD** entries in the Step-6 plan unless the user explicitly scopes them out. Missing them will block downstream skills (db-architect has no user table source; api-architect has no RBAC matrix source; phase-verifier can't close a cycle without notifications).

---

## Output Format

The final `docs/product/user-stories.md` is structured as:

### Doc Header
- Project name, version, date, status
- Cross-cutting concerns (10 items — written once, apply to all)

### Phasing Summary
| Phase | Focus | Story Count |
|---|---|---|

### Summary Table
| ID | Persona | Description | Priority | Batch | Depends On |
|---|---|---|---|---|---|

### Section 1 — Phase 1 (MVP)
Stories grouped by workflow cluster (matching batches), each following the template.

### Section 2 — Phase 2
Same structure.

### Section 3 — Phase 3 / Backlog
Same structure.

**In Restructure Mode**, the output is still a single consolidated `docs/product/user-stories.md`. The source raw file(s) under `docs/product/user-stories-raw*.md` or `docs/user-stories-raw*.md` are preserved untouched for traceability.

---

## Story Count Guidelines

| Product Scope | Expected MVP Story Count |
|---|---|
| Single module (e.g., just reviews) | 10–15 stories |
| Small product (3-4 modules) | 15–25 stories |
| Mid-size product (5-7 modules) | 25–40 stories |
| Large product (8+ modules) | 40–60 stories |
