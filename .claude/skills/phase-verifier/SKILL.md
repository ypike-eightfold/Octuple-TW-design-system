---
name: phase-verifier
description: >
  Strict quality gate that verifies a completed build phase across three stages: backend-only,
  frontend-only, and full-stack integrated. Uses weighted checklists for UI scoring (>90% required),
  automated seed scripts, E2E smoke tests, and mandatory fix-then-re-verify loops. Refuses to approve
  until everything works. Ends by leaving all services running and presenting a handoff card with
  URLs, credentials, and testing steps for the user.
triggers:
  - verify phase
  - check phase
  - test phase
  - does it work
  - compare to prototype
  - run verification
  - phase check
---

# Phase Verifier

The quality gate that decides whether a phase is done. Nothing passes without proof.

## Context Manifest

```yaml
unit_type: stage
required_inputs:
  - context.json#build_phases[current]
  - docs/phases/phase-<N>/tracker.md             # forger substitutes <N> (current phase number) before dispatch; merged tracker
  - docs/phases/phase-<N>/decisions.md           # phase-scoped decision log
  - docs/decisions.md                            # project-wide decision log
per_unit_inputs:
  # Stage 0 — automated gate tests
  - frontend/e2e/gates/
  # Stage 1 — backend verification
  - backend/app/
  - backend/scripts/seed.py
  # Stage 2 — frontend verification
  - frontend/src/pages/
  - frontend/src/features/
  # Stage 3 — integrated verification (fat stage)
  - docs/architecture/api.md
  - docs/phases/phase-<N>/build/                 # per-skill per-unit summaries (Stage 3 aggregates)
  # Subagent reads the subset relevant to the current stage; see skill body for per-stage guidance.
forbidden_paths:
  - docs/product/market-research.md
  - docs/product/stories/                        # stages verify against tracker, not raw stories
  - docs/product/domain-doc.md
budget_tokens: 900000
artifacts:
  summary:          docs/phases/phase-<N>/verify/stage-<K>.md
  return_contract:  docs/phases/phase-<N>/verify/stage-<K>.return.json
outputs:
  - docs/phases/phase-<N>/verify/stage-<K>.md
  - docs/phases/phase-<N>/verify/report.md       # Stage 3 only — full verification report (no word cap)
  - docs/phases/phase-<N>/verify/summary.md      # Stage 3 only — hard 2000-word cap
```

## Running as a Subagent

This skill is invoked by **forger** as a Task-tool subagent, one **stage** per invocation. Stages run in sequence (0 → 1 → 2 → 3 → critical-journey). Each stage is its own fresh context window.

- **Stage 0 — Automated Gate Tests.** Run `frontend/e2e/gates/phase-<N>-*.spec.ts`. Pure execution — minimal context needed.
- **Stage 1 — Backend Verification.** Seed DB, hit endpoints, compare responses to tracker's Backend Evidence column.
- **Stage 2 — Frontend Verification.** Screen inventory reconciliation (mandatory), visual fidelity score (>90% required).
- **Stage 3 — Full-Stack Integrated (the FAT STAGE).** This is the only stage that legitimately loads the phase summary drafts, all tracker slices, and api-spec together — it's the integration check. Still no raw user stories, no market research.

When finished (per stage):
1. Write `docs/phases/phase-<N>/verify/stage-<K>.md` with stage findings.
2. On Stage 3 only: write `docs/phases/phase-<N>/verify/summary.md` (2000 word hard cap — verified via `wc -w`). Contents: what was built, key decisions, files touched, open issues.
3. Write the JSON return contract (schema at `.claude/skills/_shared/return-contract.md`) at the `artifacts.return_contract` path declared in the manifest.
4. If any stage finds issues, `status: blocked` with `blocked_reason` listing the failing rows; forger routes the fix back to the responsible writer skill.
5. Do NOT call AskUserQuestion. Forger owns the phase-approval gate.

## Core Principles

1. **Real verification, not import checks.** The server must start, the DB must connect, endpoints must return correct data, the UI must match the design.
2. **>90% UI fidelity required.** Scored via weighted checklist against the HTML prototype. Subjective "looks close enough" is not acceptable.
3. **Zero deferred issues.** Every issue found in this phase is fixed in this phase. No carrying bugs forward.
4. **Fix-then-re-verify loop.** When issues are found, fix them, then re-run the FULL verification -- not just the broken part.
5. **User gets a working system.** After verification, all services stay running. The user gets a handoff card with every URL, credential, and testing step they need.
6. **Builder-bias compensation.** The verifier often runs in the same agent context as the builder. To compensate for confirmation bias:
   - Before scoring any screen, re-read the acceptance criteria from `docs/product/user-stories.md` for each story in this phase.
   - Check each acceptance criterion individually -- mark it PASS or FAIL with evidence (screenshot or API response).
   - If an acceptance criterion cannot be verified through the UI, it is NOT PASS -- it is UNTESTED.
   - The verification report MUST include a per-story acceptance criteria checklist with PASS/FAIL/UNTESTED for each item.
   - Ask yourself: "If a different person built this, would I approve it?" If you hesitate, investigate.

---

## Pre-conditions

Before running verification, confirm:
- `context.json` has the current phase listed in `build_phases[]`
- Backend code exists for the phase's API endpoints
- Frontend code exists for the phase's screens
- `backend/scripts/seed.py` exists and covers this phase's data
- Phase gate tests exist: `frontend/e2e/gates/phase-<N>-*.spec.ts` (one per module, produced by test-writer)

If any are missing, report what's incomplete and stop.

---

## Screen Inventory Check (MANDATORY — before any visual verification)

**Before starting Stage 2, the verifier MUST reconcile the expected screen list against what was actually built.** This catches missing screens that were in the spec but never implemented.

### How to Check

1. **Read the expected screen list** from `context.json` → `build_phases[N].frontend_screens`
2. **For each expected screen, verify it exists:**
   - Search for a page component file: `find src/pages -name "*ScreenName*"` or `grep -r "ScreenName" src/pages/`
   - Search for a route file: `grep -r "ScreenName" src/routes/`
   - If the screen has a "Create" or "New" action, verify the target route exists (not a dead link)
3. **Output the inventory table:**

```
SCREEN INVENTORY — Phase N
| # | Expected Screen       | Page File Exists | Route Exists | Status  |
|---|----------------------|-----------------|-------------|---------|
| 1 | CyclesListPage       | YES             | YES         | OK      |
| 2 | CycleCreateWizard    | NO              | NO          | MISSING |
| 3 | CycleDashboardPage   | YES             | YES         | OK      |
```

4. **Any MISSING screen = automatic FAIL.** The phase cannot pass verification if a screen from the spec was never built. Report the missing screens and return to the design-tw-frontend-engineer for fixes.

### Action Button Verification

After confirming all screens exist, **click every action button on every screen:**
- "Create X" buttons must navigate to a working page (not a 404 or dead link)
- "Edit" buttons must open a dialog or navigate to an edit form
- "Delete" / "Archive" / "Deactivate" buttons must show a confirmation
- "Export" buttons must trigger a download

**A button that links to a non-existent route is a BLOCKER.** This specifically catches the case where a "Create Cycle" button exists on the cycle list page but the target `/admin/cycles/new` route was never created.

---

## Phase Critical Journeys (MANDATORY)

Before starting any verification, identify the **critical user journey** for this phase. This is the single most important thing a user does in this phase, derived from the primary story's acceptance criteria.

### How to Identify the Critical Journey

1. Read `build_phases[N].stories` from context.json
2. For each story, read its acceptance criteria from `docs/product/user-stories.md`
3. Identify the primary persona action -- the one thing that, if it doesn't work, makes the entire phase worthless
4. Define the journey as a numbered sequence of UI actions

### Example Critical Journeys

| Phase | Primary Journey | Persona | Steps |
|---|---|---|---|
| 1 | Admin creates a user, creates a form template with questions | HR_ADMIN | Login via /login -> /admin -> Users -> Add User -> fill form -> submit -> verify in table -> Form Templates -> Create Template -> add section + questions -> submit -> verify in list |
| 2 | IC opens self-reflection, sees real questions from template, fills one, saves draft, submits | IC | Login via /login -> / (IC dashboard) -> verify nav bar + tasks listed -> click "Continue" on self-reflection -> verify form renders section headings + questions from template -> fill a text question -> click Save Draft -> reload page -> verify draft persisted -> fill remaining required fields -> click Submit -> confirm dialog -> verify status changes to Submitted |
| 2 | Manager views team review queue with real data | MANAGER | Login via /login -> /manager -> verify sidebar + team table -> verify direct reports listed with status columns |
| 3 | Manager shares review, employee acknowledges | MANAGER then IC | Login as manager -> share review -> login as IC -> view shared review -> acknowledge |

### Critical Journey Rule

**If the critical journey cannot be completed end-to-end through the UI, the phase is an automatic FAIL regardless of all other checks passing.** This is the highest-priority check -- do it first in Stage 3, before the rest of the walkthrough.

---

## Stage 0.5: Story Completeness Scan (MANDATORY -- before any server starts)

Before starting Stage 1, run a COLD SCAN of the codebase against story acceptance criteria. This catches stubs, missing features, and incomplete implementations WITHOUT needing the server running.

### Procedure

1. Read `docs/product/user-stories.md` for every story in this phase
2. For EACH acceptance criterion, search the codebase for implementation evidence. Note: grep ABSENCE is a RISK SIGNAL, not proof the feature is missing. Features can be implemented under different names (`handleBlur` instead of `autoSave`, a shared `MAX_CHARS` constant instead of literal `2000`, server-side RBAC with no client string). Every `NO MATCH` MUST be manually re-verified before escalating to `NOT FOUND`:

```bash
# Example: AC says "auto-save on focus-out" (use -E for portable alternation)
grep -rEn "auto.save|autoSave|auto_save|onBlur.*save|debounce.*save" frontend/src/ backend/app/
# If no results: manually inspect the form component for blur-driven PATCH calls before marking NOT FOUND.

# Example: AC says "character limit of N"
grep -rEn "max.*2000|maxLength.*2000|char_limit.*2000|\.max\(2000\)" frontend/src/ backend/app/
# If no results: check for shared constants or schema.ts siblings before marking NOT FOUND.

# Example: AC says "Submit requires all Required questions answered"
grep -rEn "required.*validation|zodResolver|disabled.*required|validate.*required" frontend/src/
# If no results: check sibling schema.ts or react-hook-form `validate` option before marking NOT FOUND.
```

3. Output the STORY COMPLETENESS SCAN. The Status column uses exactly three values:
   - `FOUND` — grep matched code evidence.
   - `NOT FOUND` — grep matched nothing AND manual re-verification confirmed the feature is absent. Only this status counts toward the gate.
   - `UNGREPPABLE` — AC has no greppable signature (visual polish, analytics events, timing behaviour). The AC must be tagged `UNGREPPABLE` in `docs/product/user-stories.md` **by the story-writer at authoring time** (see `story-writer/SKILL.md`); the forger surfaces the tag in the tracker. The phase-verifier never sets this status on its own — an untagged AC with no grep evidence defaults to `NOT FOUND`.

```
STORY COMPLETENESS SCAN -- Phase N
| Story   | AC# | Acceptance Criterion                    | Grep Pattern Used                    | Code Evidence Found          | Status      |
|---------|-----|-----------------------------------------|--------------------------------------|------------------------------|-------------|
| STORY-X | 1   | Auto-save on focus-out per field        | auto.save|autoSave|onBlur.*save     | useAutoSave hook found       | FOUND       |
| STORY-X | 2   | Character limit N chars                 | max.*2000|char_limit                 | MAX_CHARS constant in schema | FOUND       |
| STORY-X | 3   | Submit disabled without required        | disabled.*required|zodResolver       | MANUAL CHECK: no evidence    | NOT FOUND   |
| STORY-X | 4   | Loading spinner matches product style   | (visual polish — UNGREPPABLE-tagged) | N/A                          | UNGREPPABLE |
```

### Gate Rule (STRICT)

- If ANY AC is `NOT FOUND` (after manual re-check confirms absence): Phase is PREMATURE. Send back to the builder skill with the specific missing ACs listed.
- ACs with status `UNGREPPABLE` are excluded from this gate and MUST be verified visually in Stage 3 (they appear in the AC-table for that story with Verification Method = "visual walkthrough").
- If every AC is `FOUND` or `UNGREPPABLE`: Proceed to Stage 1.

---

## Stage 0: Automated Gate Tests (NEW)

Before any manual verification, run the phase gate tests produced by the test-writer:

```bash
cd frontend && pnpm run test:e2e -- --grep @phase-N-gate
```

Gate tests verify the minimum bar:
- All persona logins work through the actual login page
- All new screens load without errors
- All new forms render their fields
- Navigation bar/sidebar is present on every screen

**If gate tests fail, the phase automatically FAILS.** Report failures and return to the builder for fixes. Do NOT proceed to Stages 1-3.

If gate tests don't exist yet (test-writer hasn't produced them), note this in the report and proceed with extra vigilance in Stages 2-3.

---

## Stage 0.5: Security Verification (MANDATORY — before any functional verification)

Run the security checks before functional testing. Security bugs found later are more expensive to fix.

### 0.5.1 Authorization Enforcement Scan

For EVERY endpoint in the current phase, verify these three conditions. Use `curl` or the smoke test script.

| Check | How | Pass Condition |
|---|---|---|
| **Auth required** | `curl -s -o /dev/null -w '%{http_code}' -X GET http://localhost:8000/api/v1/{endpoint}/` (no token) | Returns 401 |
| **RBAC enforced** | `curl` with a token for a role that should NOT have access | Returns 403 |
| **Tenant isolated** | `curl` with User A's token to access User B's resource | Returns 404 (not 403) |

**Any endpoint that returns 200 without auth, or 200 for the wrong role, is an automatic FAIL.**

```bash
# Automated scan — add to e2e_smoke.py --phase N --security
# For each endpoint:
echo "Testing auth on /api/v1/goals/"
STATUS=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8000/api/v1/goals/)
[ "$STATUS" = "401" ] && echo "[PASS] No-auth -> 401" || echo "[FAIL] No-auth -> $STATUS"
```

### 0.5.2 Response Data Leak Scan

For EVERY endpoint that returns user or resource data, verify the response does NOT contain:

- `hashed_password` or `password`
- `api_key`, `secret_key`, `secret`
- Internal database auto-increment IDs (should be UUIDs)
- PII (email, phone) in responses where the caller should not see it

```bash
# Scan response bodies for leaked fields
curl -s -H "Authorization: Bearer $IC_TOKEN" http://localhost:8000/api/v1/users/ | \
  python3 -c "
import json, sys
data = json.load(sys.stdin)
BANNED = {'hashed_password', 'password', 'api_key', 'secret_key', 'secret'}
def check(obj, path=''):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in BANNED:
                print(f'[FAIL] Banned field \"{k}\" found at {path}.{k}')
            check(v, f'{path}.{k}')
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            check(v, f'{path}[{i}]')
check(data)
print('[DONE] Response scan complete')
"
```

### 0.5.3 Input Validation Spot-Check

For 3-5 POST/PUT endpoints in the phase, send deliberately malicious input:

| Payload | What It Tests | Expected |
|---|---|---|
| `{"title": "A" * 10000}` | Field length limits | 422 |
| `{"sort_by": "name; DROP TABLE users;--"}` | SQL injection via sort | 400 or 422 |
| `{"content": "<script>alert('xss')</script>"}` | XSS in text fields | 422, or 201 with sanitized content |
| `{"status": "NONEXISTENT_VALUE"}` | Enum validation | 422 |
| `{"email": "not-an-email"}` | Format validation | 422 |

**Any endpoint that accepts a SQL injection payload or returns unsanitized `<script>` tags is an automatic FAIL.**

### 0.5.4 Hardcoded Secrets Scan

```bash
# Scan backend code for hardcoded secrets
grep -rn "password\s*=\s*['\"]" backend/app/ --include="*.py" | grep -v "hashed_password\|get_password_hash\|verify_password\|_password:" | head -20
grep -rn "secret.*=.*['\"][a-zA-Z0-9]" backend/app/ --include="*.py" | grep -v "SECRET_KEY\|settings\.\|os\.environ\|config\." | head -20
grep -rn "verify\s*=\s*False" backend/app/ --include="*.py" | head -10

# Scan frontend build for leaked secrets
grep -rn "sk_live\|Bearer [a-zA-Z0-9]\|api_key.*=.*['\"]" frontend/dist/assets/ 2>/dev/null | head -10
```

Any matches require investigation. Hardcoded secrets = automatic FAIL.

### 0.5.5 Security Stage Verdict

ALL of these must be true:
- [ ] Every endpoint returns 401 without authentication
- [ ] Every endpoint returns 403 for unauthorized roles
- [ ] Cross-tenant resource access returns 404, not 200 or 403
- [ ] No `hashed_password`, `api_key`, or `secret_key` in any API response
- [ ] Malicious input (SQL injection, XSS, oversized) is rejected or sanitized
- [ ] No hardcoded secrets in backend source code
- [ ] No secrets in frontend production bundle

**If ANY fails: STOP. Fix the issue. Re-run Stage 0.5 from the beginning.**

---

## Stage 1: Backend Verification (BE Alone)

### 1.1 Infrastructure Setup

```bash
# 1. Ensure PostgreSQL is running
pg_isready -h localhost -p 5432 || brew services start postgresql@16

# 2. Run migrations
cd backend && source .venv/bin/activate
alembic upgrade head

# 3. Start the server
fastapi run --reload app/main.py --port 8000 &
# Wait for health check
curl -s --retry 5 --retry-delay 2 http://localhost:8000/api/v1/utils/health-check/
```

**FAIL conditions:** PostgreSQL won't start, migrations fail, server won't start, health check fails. Report error and STOP.

### 1.2 Database Verification

```bash
python -c "
from sqlmodel import inspect as sa_inspect
from app.core.db import engine
inspector = sa_inspect(engine)
tables = inspector.get_table_names()
print(f'Tables: {len(tables)}')
for t in sorted(tables): print(f'  {t}')
"
```

Check every table listed in `build_phases[N].models` from context.json exists. Missing table = FAIL.

### 1.3 Seed Sample Data

Run the seed script:
```bash
python scripts/seed.py
```

The seed script MUST:
- Be **idempotent** (safe to run multiple times)
- Use the **same sample data as the HTML prototype** (Sarah Chen, David Park, etc.)
- Create data for **all roles** (EMPLOYEE, MANAGER, HRBP, HR_ADMIN, EXECUTIVE)
- Create data that exercises **every model in the current phase**
- Print what it created/skipped

**FAIL condition:** Seed script errors or fails to create required data.

### 1.4 Test Every API Endpoint

Run the E2E smoke test:
```bash
python scripts/e2e_smoke.py --phase N
```

For EACH endpoint in the current phase, the smoke test MUST check:

| Check | What | Expected |
|---|---|---|
| **Happy path** | Correct auth + valid data | 200/201 + correct response shape |
| **No auth** | No token | 401 |
| **Wrong role** | Token for unauthorized role | 403 |
| **Bad data** | Invalid request body | 422 |

**FAIL condition:** Any endpoint fails any check.

### 1.5 Run Backend Test Suite

```bash
cd backend && bash scripts/test.sh
```

**FAIL condition:** Any test fails. Note: tests require a live PostgreSQL instance.

### 1.6 Stage 1 Verdict

ALL of these must be true:
- [ ] Server starts and responds to health check
- [ ] All phase tables exist in DB
- [ ] Seed script runs successfully
- [ ] E2E smoke test passes (all endpoints x all checks)
- [ ] Backend test suite passes

**If ANY fails: STOP. Fix the issue. Re-run Stage 1 from the beginning.**

---

## Stage 2: Frontend Verification (FE Alone, Against Prototype)

### 2.1 Build Check

```bash
cd frontend && pnpm run build
```

**FAIL condition:** Build has any errors (warnings are noted but don't fail).

### 2.2 Start Servers

```bash
# Frontend dev server
pnpm run dev &
# Prototype server for comparison
preview_start("prototype-server")
preview_start("frontend-dev")
```

### 2.3 Error Detection (MANDATORY -- before any scoring)

Before scoring ANY screen, run these checks. Any failure = automatic FAIL for that screen.

1. **Console errors:** Run `preview_console_logs` with `level: "error"`. Any unhandled errors = investigate before proceeding.
2. **Network failures:** Run `preview_network` with `filter: "failed"`. Any 4xx/5xx responses = investigate.
3. **Error text scan:** Use `preview_snapshot` or `preview_eval` to check for visible text containing "not found", "error", "404", "403", "500", "something went wrong", or "undefined".
4. **Blank content check:** Verify the main content area has child elements -- a page that renders only a layout shell with empty main area = FAIL.
5. **Loading skeleton check:** If skeletons/spinners are visible, wait 10 seconds and re-check. Still loading = FAIL (data should be available from seed).

**Any error indicator on any screen = automatic FAIL. Do not proceed to visual scoring until all screens are error-free.**

### 2.4 Visual Comparison via Weighted Checklist

For EACH screen in the current phase, generate a checklist from the prototype and score it.

#### How to Score

1. **Open the prototype HTML file** using the prototype server. Take a screenshot -- this is the **ground truth**. If the prototype server is not running, start it. If the prototype HTML doesn't exist for this screen, note "no prototype" and score based on user story acceptance criteria.
2. Open the built app screen. Take a screenshot.
3. **Both screenshots must appear in the verification report.** Scoring without prototype screenshots is prohibited.
4. Run through the checklist below. Each item is PASS (full points) or FAIL (0 points).

#### Per-Screen Checklist Template

Every screen is scored against this checklist. Items are weighted by visual importance.

| # | Check | Points | How to Verify |
|---|---|---|---|
| 0 | **Layout shell present** (nav bar, sidebar, or top nav with user info) | 15 | Every screen MUST be wrapped in the correct layout for its persona. Bare content without navigation = BLOCKER. |
| 1 | **Sidebar/nav items match** | 5 | Same items, same icons, same text |
| 2 | **Active nav highlighted** | 3 | Correct item visually active |
| 3 | **User info visible** | 5 | User name + role displayed in nav/sidebar |
| 4 | **Page title matches** | 5 | Correct heading text |
| 5 | **Page subtitle/description** | 3 | Same subtitle if prototype has one |
| 6 | **Primary action button** (e.g., Create, Add) | 5 | Same text, position, color |
| 7 | **Card/stat layout matches** | 10 | Same grid structure, same number of cards |
| 8 | **Card content matches** | 5 | Same labels, same data fields |
| 9 | **Table columns match** (if table screen) | 15 | Same columns in same order |
| 10 | **Table data renders** (not skeletons) | 10 | Real data visible, not loading placeholders |
| 11 | **Filter/search controls match** | 5 | Same filter dropdowns, search input |
| 12 | **Status badges/colors correct** | 5 | Correct colors for each status |
| 13 | **i18n renders real text** (not raw keys) | 5 | No `admin.dashboard.title` visible |
| 14 | **Form fields render** (if form screen) | 15 | All form sections + questions from template render. Placeholder or empty form = BLOCKER. |
| 15 | **Empty state matches** (if no data) | 5 | Same icon, message, CTA |
| 16 | **Overall spacing/padding consistent** | 4 | No cramped or overly spaced sections |
| | **TOTAL** | **125** | |

**Score = (points earned / total applicable points) x 100**

Not every check applies to every screen. Skip N/A items and adjust the denominator.

**Item #0 (Layout shell) and #14 (Form fields render) are BLOCKER-weight items.** Failing either one = automatic BLOCKER for the screen, regardless of the numeric score.

#### Scoring Thresholds

| Score | Label | Action |
|---|---|---|
| **>= 90%** | PASS | Screen approved |
| **75-89%** | NEEDS FIXES | List specific differences, fix, re-verify |
| **< 75%** | FAIL | Major redesign needed |

**The threshold is 90%. Below 90% = the screen does not pass.**

### 2.5 Severity Classification for Differences

When a checklist item fails, classify the issue:

| Severity | Definition | Examples | Effect |
|---|---|---|---|
| **BLOCKER** | Fundamental structure wrong or broken functionality | Missing layout/nav, page shows error, form doesn't render questions, raw i18n keys, page crashes, data not loading | Auto-FAIL for the screen |
| **CRITICAL** | Visible difference that a user would notice | Wrong columns, missing button, wrong colors, broken layout at desktop width | 2+ criticals on a screen = FAIL |
| **MINOR** | Small visual difference | Slightly different spacing, font weight, border radius, shadow | Noted but doesn't fail the screen |

**Rules:**
- Any BLOCKER on any screen = Phase FAILS
- 2+ CRITICALs on any single screen = That screen FAILS
- MINOR issues are noted in the report but don't block approval

### 2.6 Mandatory Fix Loop

When any screen scores < 90%:

1. **Catalog ALL issues** across ALL screens (don't stop at the first failing screen)
2. List each issue with: screen name, checklist item #, what the prototype shows, what the build shows
3. Hand the fix list to ui-builder
4. After fixes are applied:
   - Re-run `pnpm run build` (catch regressions)
   - Re-run `pnpm vitest run` (catch test regressions)
   - **Re-score ALL screens** (not just the fixed ones -- fixes can cause regressions)
5. Repeat until every screen scores >= 90%

### 2.7 Run Frontend Test Suite

```bash
cd frontend && pnpm run test:unit --run
```

**FAIL condition:** Any test fails (skipped tests are noted with reasons but don't fail).

### 2.8 Stage 2 Verdict

ALL of these must be true:
- [ ] Build passes with 0 errors
- [ ] No error indicators on any screen (2.3 passed)
- [ ] Every screen scores >= 90% on the weighted checklist
- [ ] Zero BLOCKER issues
- [ ] i18n translations render correctly (no raw keys)
- [ ] Navigation between screens works
- [ ] Frontend test suite passes

**If ANY fails: Fix, then re-run Stage 2 from 2.3 (not from scratch, but all screens).**

---

## Stage 3: Full-Stack Integration (FE + BE Together)

### 3.1 Both Servers Running

- Backend on :8000 with DB connected and seeded
- Frontend on :5173 with Vite proxy to :8000
- Verify the proxy works: `curl -s http://localhost:5173/api/v1/utils/health-check/`

### 3.2 Run E2E Smoke Test via Frontend

This is NOT the same as Stage 1's backend smoke test. This tests the full flow through the Vite proxy:

```bash
python scripts/e2e_smoke.py --phase N --via-proxy http://localhost:5173
```

This catches proxy issues (like the 307 trailing slash bug) that only appear when FE talks to BE through Vite.

### 3.3 Critical Journey Walkthrough (MANDATORY -- do this FIRST)

Before the general walkthrough, complete the phase's critical journey(s) identified in the "Phase Critical Journeys" section above.

For each critical journey:
1. Navigate to `http://localhost:5173/login` in the preview tool
2. Fill the email field using `preview_fill` (NOT localStorage or eval)
3. Fill the password field using `preview_fill`
4. Click the Login button using `preview_click`
5. Verify the redirect lands on the correct page for this persona
6. Verify the user's name appears in the navigation
7. Execute each step of the critical journey through the UI -- clicking real links and buttons
8. Take a screenshot after each significant step
9. At the end: verify the journey completed successfully (data persisted, status changed, etc.)

**If the critical journey cannot be completed, STOP. The phase FAILS.** Do not continue to the general walkthrough.

### 3.4 Form Verification Protocol

If the phase includes any forms (assessment forms, wizard forms, builder forms):

1. Navigate to the form through the UI (not by direct URL)
2. Verify all form sections render (check for section headings in the page)
3. Count the form fields -- must match the expected count from the template
4. Fill at least one field of each type present (text input, radio/rating, dropdown, checkbox)
5. Click "Save Draft" (if available) and verify save confirmation appears
6. **Reload the page** and verify the draft data persisted
7. If a submit button exists, verify it is present

**A form that shows placeholder text ("Coming soon", "Not yet implemented"), an empty container, or loading state when it should show questions = BLOCKER = automatic phase FAIL.**

### 3.5 Per-Persona UI Walkthrough (MANDATORY)

For EACH persona involved in the phase's stories (read the "As a..." from each story):

1. Navigate to `http://localhost:5173/login`
2. Enter the persona's credentials using `preview_fill` (from seed script)
3. Click Login using `preview_click`
4. **Verify landing page:** correct page for this role (IC sees dashboard, Admin sees admin hub, Manager sees review queue)
5. **Verify navigation:** nav bar or sidebar is present with expected links
6. **Verify identity:** user's name appears somewhere in the UI
7. Walk through every story action for this persona -- clicking links, opening dialogs, viewing data
8. Take a screenshot after each significant action
9. Verify real data from the database is displayed (not placeholder/mock)

**Rules for the walkthrough:**
- NEVER use `localStorage.setItem` or `preview_eval` to set auth tokens. Always login through the login page.
- NEVER skip a persona. If the phase has IC, Manager, and Admin stories, ALL THREE must be tested through the UI.
- NEVER approve a screen you haven't actually navigated to and seen render with real data.
- If clicking a link results in an error page, "not found", or unexpected redirect -- that is a BLOCKER. Investigate and fix.

### 3.6 Acceptance Criteria Verification (Structured Output)

After the walkthrough, read each story's acceptance criteria from `docs/product/user-stories.md` and verify each one using the AC-table format below. Free-form checkboxes are prohibited because they allow vague "PASS" markings without evidence.

```
AC VERIFICATION -- Phase N, Story STORY-X: Employee Completes Self-Reflection
| AC# | Criterion                                    | Verification Method               | Evidence                                                    | Verdict   |
|-----|----------------------------------------------|-----------------------------------|-------------------------------------------------------------|-----------|
| 1   | Notification with deadline and direct link   | N/A (notifications out of phase)  | Deferred to Phase M                                         | UNTESTED  |
| 2   | Landing page shows all my tasks and statuses | Navigate /ess after login         | Screenshot: IC dashboard lists 3 tasks with status badges   | PASS      |
| 3   | Form renders all 4 question types correctly  | Open form, inspect each field     | Screenshot: free-text, rating, select, multi-select visible | PASS      |
| 4   | Required field validation before submission  | Click Submit with empty required  | Inline errors render; Submit disabled                       | PASS      |
| 5   | Progress indicator (X of Y answered)         | Answer 2 of 5, inspect header     | Screenshot: "2 of 5 answered"                               | PASS      |
| 6   | Auto-save every 60 s + manual Save Draft     | Fill field, wait 60 s; then click | Network tab: PATCH /answers at 60 s; PATCH on click         | PASS      |
```

Rules:
- **Verification Method** must describe the SPECIFIC ACTION taken (not "checked" or "verified").
- **Evidence** must reference a screenshot, network call, or console output. Exact line/path preferred.
- **Verdict** is one of: `PASS`, `FAIL`, `UNTESTED`. `PASS (looked fine)` is NOT acceptable.
- `UNTESTED` is only acceptable for ACs that depend on later phases; always include the reason.
- `FAIL` must describe what actually happened vs. what was expected.

Include one AC-table per story in the verification report.

### 3.6b Acceptance Criteria Structured Output (replaces free-form checklist)

The AC verification MUST use this exact table format. Free-form checkboxes are prohibited because they allow vague "PASS" markings without evidence.

```
AC VERIFICATION -- Phase N, Story [STORY-ID]
| AC# | Criterion                             | Verification Method           | Evidence                                          | Verdict |
|-----|---------------------------------------|-------------------------------|---------------------------------------------------|---------|
| 1   | Auto-save on focus-out                | Fill field, blur, wait 2s     | Network tab shows PATCH /answers call after blur   | PASS    |
| 2   | Draft persists on reload              | Fill + save + reload page     | Fields show saved values after reload              | PASS    |
| 3   | Submit blocked without required       | Click Submit with empty fields| Submit button is disabled; inline errors visible   | FAIL    |
```

Rules:
- Verification Method must describe the SPECIFIC ACTION taken (not "checked" or "verified")
- Evidence must reference a screenshot, network call, or console output
- PASS requires evidence. "PASS (looked fine)" is NOT acceptable.
- FAIL must describe what actually happened vs. what was expected.

### 3.7 Cross-Phase Regression (Phase 2+)

For Phase 2 and later, re-run the E2E walkthrough from ALL prior phases:
- Phase 2: Re-test Phase 1 flows (user CRUD, template CRUD)
- Phase 3: Re-test Phase 1 + Phase 2 flows
- etc.

**FAIL condition:** Any prior-phase functionality is broken.

### 3.8 Stage 3 Verdict

ALL of these must be true:
- [ ] Critical journey completed end-to-end through the UI
- [ ] All personas tested through the login page (not localStorage)
- [ ] Every screen has a layout shell (nav bar/sidebar) with user identity
- [ ] Frontend displays real data from backend (no loading skeletons when data exists)
- [ ] No error pages, "not found", or blank content on any screen
- [ ] E2E smoke test passes via proxy
- [ ] Form verification passed (if applicable) -- fields render, draft saves, round-trip works
- [ ] Acceptance criteria individually checked per story
- [ ] Form submissions persist to database
- [ ] Cross-phase regression passes (Phase 2+)
- [ ] Browser console has no unhandled errors

---

## After ALL Stages Pass: Handoff

### Step 1: Ensure All Services Are Running

Verify and restart if needed:
- PostgreSQL on :5432
- Backend (FastAPI) on :8000
- Frontend (Vite) on :5173
- pgAdmin on :5050 (if Docker is available)
- Prototype server on :3456

### Step 2: Present Handoff Card

After verification passes, present this to the user. This is the FINAL output of the phase-verifier:

```
============================================================
  PHASE N: [NAME] -- VERIFIED
  Stories: [IDs]
  Date: [Date]
============================================================

SERVICES RUNNING
  Frontend:       http://localhost:5173
  Backend API:    http://localhost:8000
  API Docs:       http://localhost:8000/docs
  Prototype:      http://localhost:3456/app.html
  pgAdmin:        http://localhost:5050

LOGIN CREDENTIALS BY PERSONA
  HR Admin:     admin@performancehub.com / changethis
  Manager:      david.park@test.com / password123
  Employee:     sarah.chen@test.com / password123
  HRBP:         james.rodriguez@test.com / password123
  Executive:    michelle.torres@test.com / password123

DATABASE ACCESS
  pgAdmin:      http://localhost:5050
  pgAdmin login: admin@performancehub.com / admin123
  DB connection: host.docker.internal:5432
  Database:      performance_hub
  DB user:       postgres / changethis

WHAT TO TEST
  1. Login at http://localhost:5173/login with any persona above
  2. [Phase-specific test steps]
  3. [Phase-specific test steps]
  4. Open pgAdmin to browse tables and verify data

VERIFICATION SUMMARY
  Backend:   [X/Y] endpoint tests passed
  Frontend:  All screens >= 90% visual match
  Tests:     [X] passed, [Y] skipped, [Z] failed
  E2E:       [X/Y] integration steps passed
  Bugs fixed: [N] issues found and resolved

REPORT: docs/phases/phase-<N>/verify/report.md
============================================================
```

### Step 3: Write Verification Report (MANDATORY -- HARD GATE)

**You MUST write `docs/phases/phase-<N>/verify/report.md` before presenting the handoff card or updating context.json.** This is not optional. The phase is NOT verified until this file exists on disk. Use the Write tool to create it -- do not skip this step even if the user says "looks good" or approves early.

Write the full report using the Verification Report Format below. Include all Stage 0-3 results, checklist scores, issues found, fixes applied, and per-story acceptance criteria checklists.

### Step 3b: Write Stage Checkpoints (Resumability)

After completing EACH stage, append a checkpoint to `docs/phases/phase-<N>/verify/report.md` so work can resume if context is lost:

```markdown
## Checkpoint
- Stage 0: PASS (gate tests passed) or SKIP (no gate tests)
- Stage 0.5: PASS (12/12 auth checks, 0 data leaks, 0 injection accepts, 0 secrets)
- Stage 1: PASS (37/37 endpoint checks, 53/53 regression)
- Stage 2: PASS (5/5 screens >= 90%)
- Stage 3: IN_PROGRESS -- critical journey verified, form verified, manager walkthrough pending
```

On resume, read `docs/phases/phase-<N>/verify/report.md` to determine which stage to continue from. Do NOT re-run completed stages unless a fix was applied that could cause regression.

### Step 4: Update Context

Update `context.json`:
- Set `build_phases[N].status` to `"verified"`
- Set `build_phases[N].verified_at` to current date
- Clear `build_phases[N].issues` (all resolved)
- Increment `current_build_phase`

---

## Verification Report Format

```markdown
# Phase N Verification Report
**Phase:** [Name]
**Stories:** [IDs]
**Date:** [Date]
**Status:** PASS

## Stage 0: Gate Tests
- Result: PASS / SKIP (no gate tests) / FAIL
- Details: [N] tests passed

## Stage 0.5: Security Verification
- Auth enforcement: [X/Y] endpoints return 401 without token
- RBAC enforcement: [X/Y] endpoints return 403 for wrong role
- Tenant isolation: [X/Y] cross-tenant accesses return 404
- Data leak scan: [PASS/FAIL] — no sensitive fields in responses
- Input validation: [X/Y] malicious payloads rejected
- Secrets scan: [PASS/FAIL] — no hardcoded secrets in code or bundle

### Security Endpoint Matrix
| Endpoint | Method | No Auth → 401 | Wrong Role → 403 | Cross-Tenant → 404 | Injection → 4xx |
|---|---|---|---|---|---|
| /users/ | GET | PASS | PASS | N/A | N/A |
| /goals/ | POST | PASS | PASS | PASS | PASS |

## Stage 1: Backend
- Server startup: OK
- DB connection: OK ([X] tables)
- Seed script: OK ([X] records created)
- E2E smoke test: [X/Y] endpoints passed (all 4 checks each)
- Backend test suite: [X] passed, [Y] failed

### Endpoint Results
| Endpoint | Method | Happy | No Auth | Wrong Role | Bad Data | Status |
|---|---|---|---|---|---|---|
| /users/ | GET | 200 | 401 | 403 | N/A | PASS |

## Stage 2: Frontend
- Build: OK (0 errors)
- Error detection: OK (no console errors, no network failures, no error text)
- i18n: OK (no raw keys)
- Test suite: [X] passed, [Y] skipped

### Visual Checklist Scores
| Screen | Layout Shell | Score | BLOCKERs | CRITICALs | MINORs | Verdict |
|---|---|---|---|---|---|---|
| Dashboard | PASS | 95% | 0 | 0 | 2 | PASS |
| People | PASS | 93% | 0 | 0 | 1 | PASS |

### Fix Rounds
- Round 1: [X] issues found, [Y] fixed
- Round 2: [X] issues found, [Y] fixed (if needed)

## Stage 3: Integration
- Proxy health check: OK
- E2E smoke via proxy: [X/Y] passed
- Critical journey: COMPLETED (screenshot evidence below)
- Form verification: PASS (fields render, draft saves, round-trip works)
- Per-persona walkthrough: [N] personas tested through login page
- Console errors: None
- Cross-phase regression: [X/Y] passed (or N/A)

### Critical Journey Log
1. Navigate to /login: OK (screenshot)
2. Fill email "emily.nguyen@acme.corp": OK
3. Fill password: OK
4. Click Login: OK -> redirected to /
5. Verify nav bar: OK (screenshot) -- "Acme Perf", "My Tasks", user name visible
6. Click "Continue" on Self-Reflection: OK -> navigated to assessment form
7. Verify form renders: OK (screenshot) -- 2 sections, 5 questions visible
8. Fill text question: OK
9. Click Save Draft: OK -- "Saved" confirmation appeared
10. Reload page: OK -- draft persisted
11. Submit: OK -- status changed to Submitted

### Per-Persona Login Verification
| Persona | Email | Login | Landing Page | Nav Present | Name Visible |
|---|---|---|---|---|---|
| HR Admin | admin@... | OK | /admin | Sidebar with 6 items | Priya Sharma |
| IC | emily@... | OK | / (IC dashboard) | Top nav with 2 links | Emily Nguyen |
| Manager | david@... | OK | /manager | Sidebar with 3 items | David Park |

### Acceptance Criteria
Use the AC-table format defined in Section 3.6 — one table per story, verdict column = PASS / FAIL / UNTESTED, evidence mandatory. Free-form `- [x]` checkboxes are prohibited throughout the verification report.

## Issues Found and Resolved
| # | Issue | Severity | Screen/Endpoint | Fix Applied |
|---|---|---|---|---|
| 1 | Missing sidebar | BLOCKER | All screens | Created admin-layout.tsx |

## Handoff
[Full handoff card as shown above]
```

---

## Script Generation from Boilerplate Templates

The boilerplate provides two template scripts at `boilerplate/backend/scripts/`:
- `seed.py` -- framework with helpers and placeholder `seed_phase_N()` functions
- `e2e_smoke.py` -- framework with HTTP helpers and placeholder `run_phase_N()` functions

These are copied to the project at creation time. The phase-verifier generates the project-specific implementations inside them.

Before Stage 1 of each phase, the phase-verifier MUST:
1. Read `docs/architecture/api.md` for endpoint list and `docs/architecture/system.md` for boilerplate notes
2. Read the React mock screens in `frontend/src/` for sample data
3. Read `docs/product/domain-doc.md` for business rules
4. Generate `seed_phase_N()` with data matching the prototype
5. Generate `run_phase_N()` with tests for every endpoint
6. Run both scripts to verify they work

Seed rules: match prototype data, idempotent, Phase 2+ builds on Phase 1, print summary.
Smoke test rules: test every endpoint (happy/401/403/422), multi-role login, self-cleaning, --via-proxy support, exit 0/1.

---

## Preview Tool Reference

When using `preview_*` tools for visual verification, be aware of these limitations and workarounds:

### Known Limitations

| Tool | Limitation | Workaround |
|---|---|---|
| `preview_click` | Does not support `:has-text()` pseudo-selector | Use `preview_eval` with `document.querySelectorAll('button')` + `.find(b => b.textContent.includes('...'))` |
| `preview_eval` | Bare `return` is a SyntaxError (not inside a function) | Wrap in IIFE: `(function() { ... return result; })()` |
| `preview_eval` | `await` not allowed at top level | Use async IIFE: `(async () => { ... })()` |
| `preview_click` | May click wrong element if selector matches sidebar toggle | Close sidebar first, or use more specific selectors |
| `preview_screenshot` | Not reliable for verifying exact colors or font sizes | Use `preview_inspect` with specific CSS properties |

### Authentication in Verification -- MANDATORY LOGIN VIA UI

**For Stages 2 and 3, the verifier MUST authenticate by navigating to the login page and entering credentials through the UI.** This is non-negotiable.

**Prohibited:** Using `localStorage.setItem('auth_token', ...)` or `preview_eval` to inject tokens. These hacks bypass the auth flow, skip `fetchUser()` calls, skip layout mounting, and hide real bugs.

**Required login procedure for each persona:**
1. Navigate to `http://localhost:5173/login` (or equivalent preview URL)
2. Use `preview_fill` on the email input field with the persona's email
3. Use `preview_fill` on the password input field with the persona's password
4. Use `preview_click` on the Login/Submit button
5. Wait for redirect (use `preview_eval` to check `window.location.pathname`)
6. Verify: correct landing page for this role
7. Verify: user name displayed in navigation/header
8. Take a screenshot as evidence

**The only exception:** Stage 1 (backend-only) uses API-level token authentication via curl, which is correct for testing endpoints without a frontend.

---

## Rules

1. **Never approve without all stages passing.** No exceptions.
2. **>90% UI fidelity required.** Scored by weighted checklist, not subjective impression.
3. **Zero deferred issues.** Fix everything in this phase before moving on.
4. **Full re-verify after every fix.** Re-run ALL screens and ALL endpoints, not just the fixed item.
5. **Regression is mandatory for Phase 2+.** Re-test all prior phase flows.
6. **Real data required.** Loading skeletons when DB has data = FAIL.
7. **Screenshots are evidence.** Every visual claim must have a screenshot.
8. **Prototype is ground truth.** Built app must match it, not vice versa.
9. **The verifier owns the fix loop.** When issues are found: catalog all, hand to builder, re-verify after fix, repeat.
10. **Leave services running.** After verification, all services stay up for the user.
11. **End with handoff card.** Every verification ends with URLs, credentials, and testing steps for the user.
12. **Seed data matches prototype.** Same people, same departments, same templates as the HTML design.
13. **Verification report is mandatory.** Every phase ends with `docs/phases/phase-<N>/verify/report.md` written to disk. The file must exist before context.json is updated or the handoff card is presented. No exceptions -- this is the permanent record of what was verified.
14. **Login through the UI.** Stages 2 and 3 must test authentication by navigating to /login and entering credentials in the form. localStorage/eval-based auth is prohibited for verification.
15. **Error pages are automatic FAIL.** Any screen showing error content, "not found", 403, blank body, or unresolved loading state is an automatic FAIL for the phase. Investigate and fix before scoring.
16. **Every persona tested through UI.** For each persona involved in the phase's stories, login through the UI, verify the landing page, nav bar, and user identity, then walk through that persona's stories.
17. **Critical journey is mandatory.** The phase's critical user journey (derived from the primary story) must be completed end-to-end through the UI. If the journey cannot be completed, the phase FAILS.
18. **Acceptance criteria are individual checkpoints.** Each acceptance criterion from each story must be individually verified and marked PASS/FAIL/UNTESTED in the report. "The feature works" is not granular enough.
19. **Console errors checked.** Before any Stage 2 or Stage 3 screen is scored, check browser console for errors via `preview_console_logs`. Unhandled errors = investigate before scoring.
20. **Screen inventory checked.** Before Stage 2 visual scoring, read `build_phases[N].frontend_screens` from context.json and verify every listed screen has a page file, a route file, and is reachable. Missing screen = automatic FAIL.
21. **Every action button clicked.** On every screen, click every "Create", "Add", "Edit", "Delete", "Export" button and verify its target works (dialog opens, route loads, download triggers). A dead link or 404 = BLOCKER.
22. **Security verification is mandatory.** Stage 0.5 runs before any functional testing. An endpoint accessible without auth, leaking sensitive data, or accepting injection payloads is an automatic FAIL regardless of all other stages passing.
23. **No hardcoded secrets in code or bundle.** The verifier scans backend source and frontend dist for hardcoded credentials. Any match is investigated; confirmed secrets = automatic FAIL.

---

## What NEVER Counts as PASS

- "Imports work" -- not verification
- "It renders something" -- not verification
- "Tests pass" alone -- tests can be too permissive
- "Features exist" -- features must work correctly AND look right
- Describing screenshots without showing them -- show proof
- Scoring 8/10 on a screen missing its sidebar -- that's 4/10
- Deferring a bug to the next phase -- fix it now
- Manual curl tests without an automated script -- automate it
- Logging in via localStorage/eval instead of the login page -- not verification
- An error page, "not found" page, or blank page for any screen -- automatic FAIL
- A form that shows placeholder text instead of actual form fields/questions -- automatic FAIL
- Testing only one persona when the phase involves multiple personas -- not verification
- Clicking the wrong link and not investigating the result -- not verification
- A "Create X" button that links to a non-existent route -- automatic FAIL
- Reporting "Phase complete" when the screen inventory has MISSING items -- not verification
- Approving a screen without opening the corresponding prototype HTML for comparison -- not verification