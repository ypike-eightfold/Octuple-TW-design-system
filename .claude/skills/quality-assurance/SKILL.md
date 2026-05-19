---
name: quality-assurance
description: >
  Product-level QA skill that creates test plans from user stories and executes holistic regression
  testing across multiple phases. Tests THROUGH THE UI, not just APIs. Clicks every button, fills
  every form, tests every persona login flow. Assigns P0/P1/P2 priorities to bugs. P0 bugs block
  the next phase.
triggers:
  - create test plan
  - run QA
  - QA check
  - regression test
  - test the product
  - quality check
  - full QA
  - product QA
---

# Quality Assurance

Product-level quality assurance. Tests the product holistically FROM THE USER'S PERSPECTIVE — through the actual browser UI, not just API endpoints.

## Context Manifest

```yaml
unit_type: stage
required_inputs:
  - docs/product/user-stories.md
  - docs/product/personas.md
per_unit_inputs:
  # Stage 1 (test-plan): pre-build, from stories only — no phase context needed
  # Stage 2 (backend-audit): after backend-writer for phase N — loads backend/app/services/
  #   and backend/app/api/routes/ plus docs/architecture/api.md and context.json#build_phases[N]
  # Stage 3 (regression): after all phases verified — loads frontend/src/ and context.json
  - stage-specific (see "Trigger Points" section below)
forbidden_paths:
  - docs/product/market-research.md
  - docs/product/domain-doc.md
budget_tokens: 900000
outputs:
  # Stage 1 (test-plan, pre-build)
  - docs/quality/qa-test-plan.md
  # Stage 2 (backend-audit, per build phase)
  - docs/phases/phase-<N>/verify/qa-audit.md
  # Stage 3 (regression, post-build)
  - docs/quality/qa-regression-report.md
artifacts:
  # Stage-keyed maps: forger picks the path for the active stage before linting.
  # See _shared/manifest-format.md §Stage-Conditional Paths.
  summary:
    test-plan:     docs/quality/qa-test-plan.md
    backend-audit: docs/phases/phase-<N>/verify/qa-audit.md
    regression:    docs/quality/qa-regression-report.md
  return_contract:
    test-plan:     docs/quality/.qa-test-plan.return.json
    backend-audit: docs/phases/phase-<N>/verify/qa-audit.return.json
    regression:    docs/quality/.qa-regression.return.json
```

Forger invokes as a Task subagent, one stage per invocation. Stages: `test-plan` (pre-build, after stories finalized), `backend-audit` (inside each Phase Build Loop, after backend-writer completes, before ui-builder), `regression` (after all phases verified). Return JSON contract: see `.claude/skills/_shared/return-contract.md`. Do NOT call AskUserQuestion; forger owns the approval gate.

---

## When QA Runs (Three Trigger Points)

### Trigger 1: After User Stories Are Finalized (Pre-Build)

**When:** After `docs/product/user-stories.md` is complete and before Phase 1 build begins.

**Action:** Generate `docs/quality/qa-test-plan.md` containing:
1. **Per-story acceptance criteria test cases** — one test case per acceptance criterion, not per story
2. **Per-persona end-to-end journeys** — complete walkthrough for each persona from login to logout
3. **Cross-story integration tests** — workflows that span multiple stories
4. **Button inventory** — list every button/action expected per screen with expected behavior
5. **Negative tests** — unauthorized access, invalid inputs, edge cases
6. **State tests** — empty state, loading state, error state, partial data, full data for each screen
7. Priority assignment (P0/P1/P2) for each test case

### Trigger 1.5: After Backend-Writer Handoff, Before Frontend Build (NEW)

**When:** After backend-writer declares a phase complete, BEFORE ui-builder/design-tw-frontend-engineer starts.

**Purpose:** Catch stubs and incomplete implementations BEFORE the frontend is built on top of them. In previous builds, the frontend was built on top of stub APIs (e.g., endpoints returning hardcoded status strings for all records), and both sides "worked" independently while the integrated product was broken.

**Action:** Run the BACKEND COMPLETENESS AUDIT:

```bash
# 1. STUB SCAN -- no pass/ellipsis/NotImplementedError in service methods (portable ERE)
grep -rEn "^\s*pass$|^\s*\.\.\.\s*$|raise NotImplementedError|# TODO|# FIXME|# PLACEHOLDER" backend/app/services/ backend/app/api/routes/

# 2. HARDCODED RETURN SCAN -- flag routes returning literal status strings (portable ERE, escaped braces)
grep -rEn '="NOT_STARTED"|="PENDING"|="NOT_SHARED"|return \[\]|return \{\}' backend/app/services/ backend/app/api/routes/

# 3. ENDPOINT DATA VERIFICATION -- hit every new endpoint with seeded data
python scripts/e2e_smoke.py --phase N
# All checks MUST pass.

# 4. SEED DATA MATCH -- verify seed creates data for every model in this phase
python scripts/seed.py --phase N
```

**Gate:** If ANY of checks 1-4 fail, the backend is NOT READY. Send back to backend-writer.

### Trigger 2: After Every Build Phase (MANDATORY)

**When:** After each build phase is verified by phase-verifier. QA runs after EVERY phase, not batched.

**Action:** Execute the test plan through the UI:
1. **Login through the actual login page** for each persona (NEVER use localStorage injection)
2. **Navigate to every screen** in the persona's section
3. **Click every button** on every screen and verify it does something
4. **Fill and submit every form** and verify data persists
5. **Reload the page** and verify data is still there
6. Record PASS/FAIL with screenshot evidence
7. Generate `docs/phases/phase-<N>/verify/qa-audit.md`

### Trigger 3: After ALL Build Phases Complete (Final QA — MANDATORY)

Full regression across the entire product. HARD GATE before deployment.

---

## THE UI TESTING PROTOCOL (MANDATORY)

This is the PRIMARY testing method. It MUST be executed before any QA verdict is issued.

### Step 1: Pre-flight Checks

Before any UI testing, run these automated checks:

```bash
# 1. Zero mock imports in route files
grep -r "from.*@/mocks" frontend/src/routes/
# MUST return empty. Any result = P0.

# 2. Zero buttons without handlers
grep -rn '<Button' frontend/src/routes/ | grep -v 'onClick\|type="submit"\|disabled\|DialogTrigger\|Link'
# Review each result. Buttons without handlers = P0.

# 3. Zero useDevToolbar in route files
grep -rn "useDevToolbar" frontend/src/routes/
# MUST return empty. Any result = P0.

# 4. API trailing slash consistency
grep -rn 'api\.' frontend/src/features/ | grep '"/' | grep -v '/"' | grep -v node_modules
grep -rn 'api\.' frontend/src/features/ | grep '`/' | grep -v '/`' | grep -v node_modules
# MUST return empty. Any API path without trailing slash = P0.

# 5. Build passes
cd frontend && pnpm run build
# MUST succeed with 0 errors.
```

### Extended Pre-flight Checks (checks 6-9, added to existing 5)

**First, run the shared React anti-pattern scan** defined in [../design-tw-frontend-engineer/references/anti-pattern-scan.md](../design-tw-frontend-engineer/references/anti-pattern-scan.md). That file is the single source of truth for the 5-point useState/mock-import/placeholder/form-validation scan; design-tw-frontend-engineer runs it as a self-check before handoff, and QA re-runs it here as a cross-check. Any unreviewed hit from those scans blocks QA sign-off.

Then run the QA-specific checks 6–9 below:

```bash
# 6. No useState initializer with async data (the #1 recurring React bug) — portable ERE
grep -rEn "useState.*=>.*data\.|useState.*=>.*build.*data" frontend/src/routes/ frontend/src/features/
# Review each hit. If initializer references useQuery data, it is a P0 bug.

# 7. Every mutation hook defined in frontend/src/features/ is actually called from a page.
# Portable ERE version (no PCRE2 dependency — many Linux ripgrep builds ship without it,
# which would make `rg --pcre2` exit non-zero and silently bypass the gate).
# Searches all of features/ (api.ts, index.ts, hooks.ts, barrel files, etc.) so mutations
# exported from non-standard filenames are not missed.
for hook in $(grep -rEho "export (function |const )(use[A-Za-z]+Mutation[A-Za-z]*)" frontend/src/features/ \
  | grep -Eo "use[A-Za-z]+Mutation[A-Za-z]*" \
  | sort -u); do
  count=$(grep -rEn "\b$hook\b" frontend/src/routes/ frontend/src/features/*/components/ 2>/dev/null | wc -l | tr -d ' ')
  if [ "$count" -eq "0" ]; then
    echo "UNUSED MUTATION: $hook -- defined but never called"
  fi
done
# Any unused mutation = P1 (feature likely not wired to UI)

# 8. Every form with a submit handler has a visible validation schema or a sibling schema.ts.
# Priority: P1 (NOT P0). The detector cannot see schemas imported from non-sibling paths
# or `react-hook-form`'s `validate` option, so every hit is a manual-verify, not auto-block.
for f in $(grep -rln "onSubmit\|handleSubmit" frontend/src/routes/ frontend/src/features/); do
  if ! grep -q "zodResolver\|z\.\|zod" "$f" && ! [ -f "$(dirname "$f")/schema.ts" ]; then
    echo "FORM LACKS VISIBLE ZOD INTEGRATION (verify manually): $f"
  fi
done

# 9. No window.alert or window.prompt in production code
grep -rEn "window\.alert|window\.prompt|window\.confirm" frontend/src/routes/ frontend/src/features/
# Any hit = P1 (should use proper Dialog/Modal components)
```

**If ANY pre-flight check fails, STOP. Fix before proceeding to UI testing.**

### Step 2: Per-Persona UI Walkthrough

For EACH persona involved in the current phases:

1. **Clear browser state**: `localStorage.clear()`, clear all caches
2. **Navigate to /login**
3. **Fill email field** using `preview_fill` with the persona's email from the seed script
4. **Fill password field** using `preview_fill`
5. **Click the Login/Submit button** using `preview_click`
6. **Verify redirect**: Check `window.location.pathname` matches the expected landing page for this role. Example mappings (adjust per project):
   - Employee/IC → the employee dashboard route
   - Manager → the manager dashboard route
   - Admin → the admin dashboard route
   - Other roles → their respective landing pages as defined in the route config
7. **Take a screenshot** of the landing page
8. **Verify the layout**: Sidebar or top nav is present with correct items for this role
9. **Verify user identity**: User's name appears in the navigation/sidebar

Then for each screen in this persona's section:

10. **Navigate to the screen** by clicking the sidebar link or tab (NOT by direct URL)
11. **Wait for data to load** (no loading skeletons should remain after 5 seconds)
12. **Take a screenshot**
13. **Verify real data renders** (not empty, not error, not placeholder)
14. **Click every button** on the screen:
    - Create/Add buttons → verify dialog opens or navigation works
    - Edit buttons → verify form opens with pre-filled data
    - Delete buttons → verify confirmation dialog
    - Export buttons → verify download triggers
    - Submit buttons → verify form submission works
    - Approve/Reject buttons → verify state changes
15. **If the screen has a form**: fill it, save draft, reload, verify draft persists, then submit
16. **Check browser console** for errors after each screen

### Step 3: Cross-Persona Tests

After testing each persona individually, test workflows that span personas:

1. **IC submits self-reflection → Manager sees it in write-review context panel**
2. **IC nominates peer → Manager approves/rejects → IC sees updated status**
3. **Manager writes review → HR BP sees it in calibration**
4. **Manager shares review → IC sees it in My Review with rating**
5. **IC acknowledges review → Manager sees acknowledgment timestamp**

### Step 4: Auth Edge Cases

1. **Page reload on every screen** — verify token persists and page re-renders correctly
2. **Navigate between persona sections** — verify RBAC blocks unauthorized access (e.g., IC visiting /admin shows block message, not crash)
3. **Logout from every persona** — verify redirect to login, verify cannot access pages after logout
4. **Expired/invalid token** — clear auth_user but keep auth_token → verify graceful redirect to login (no infinite loop)

---

## WHAT QA MUST NEVER DO

1. **NEVER declare PASS based solely on API endpoint tests.** curl tests miss trailing slash 307 redirects, auth header issues, and browser-specific behavior.
2. **NEVER use `localStorage.setItem` to inject auth tokens.** Always login through the login page.
3. **NEVER skip a persona.** If the product has 5 personas, test all 5.
4. **NEVER skip clicking buttons.** A button that exists but does nothing is a P0.
5. **NEVER test only the happy path.** Test reload, empty state, error state, and unauthorized access.
6. **NEVER trust "build passes" as evidence of quality.** TypeScript compilation ≠ working product.

---

## P0 / P1 / P2 Priority System

### Priority Definitions

| Priority | Definition | Examples | Gate Effect |
|---|---|---|---|
| **P0** | Feature is broken or fundamentally wrong. User cannot complete a core workflow. | Button does nothing, API returns error, data not displayed, crash on navigation, RBAC bypass, form doesn't persist, login loop, page inaccessible | **BLOCKS next phase.** Must fix before proceeding. |
| **P1** | Feature works but has significant issues. User notices but can work around it. | Wrong data format, missing empty state, UI overlap, badge wrong color, stale data after mutation, missing loading state, icon not rendering | **Evaluated per phase.** Fix now if < 3 total, defer if justified. |
| **P2** | Minor polish issue. User unlikely to notice or not impacted. | Spacing slightly off, animation missing, tooltip text could be better | **Noted.** Fix in polish phase. |

### P0 Classification Rules (EXPANDED from retro)

**P0 if ANY of these are true:**
- A button/action in a user story does nothing when clicked
- An API endpoint returns 4xx/5xx when accessed through the browser (not just curl)
- A screen shows mock data when real API data is available
- Navigation to a core screen is broken or redirects to wrong page
- RBAC allows unauthorized access OR blocks authorized access
- Data submitted via form does not persist on page reload
- A core workflow from user stories cannot be completed end-to-end
- Login flow fails, loops, or redirects incorrectly for any persona
- Layout shell (sidebar/topnav) is missing or shows wrong items for a persona
- User's name/identity not shown in the navigation
- Dev toolbar or mock persona switcher is visible in the UI
- API calls fail due to trailing slash mismatch (307 redirect stripping auth)
- Draft save appears to work but data is lost on reload

---

## 10-Point Screen Check (EXPANDED)

For EVERY screen in the product, verify through the UI:

| # | Check | How to Verify | Priority if Fails |
|---|---|---|---|
| 1 | **Data source**: No mock imports | `grep "@/mocks" <file>` | P0 |
| 2 | **Data renders**: Real data visible, not loading/error/empty when data exists | Screenshot after 5s wait | P0 |
| 3 | **Every button works**: Click each button, verify handler fires | Click in preview, check result | P0 |
| 4 | **Navigation works**: All links route correctly | Click each link, verify URL | P0 |
| 5 | **RBAC enforced**: Only authorized personas can access | Login as wrong persona, verify block | P0 |
| 6 | **Form persistence**: Fill form, reload, verify data survives | Fill → save → reload → check | P0 |
| 7 | **Loading state**: Skeleton/spinner shown while loading | Navigate to page, screenshot immediately | P1 |
| 8 | **Error state**: Error banner shown when API fails | Disconnect backend, reload page | P1 |
| 9 | **Empty state**: Helpful message when no data exists | Test with empty DB or new user | P1 |
| 10 | **Layout present**: Sidebar or topnav with correct items for this persona | Screenshot, verify nav items | P0 (was P1, upgraded after retro) |

**Note: Items 3, 6, and 10 were upgraded to P0 based on the retro. In apex-perf, non-functional buttons (13 found), missing draft persistence (3 pages affected), and wrong layout (4 persona routes) were the most impactful bugs.**

---

## Gate Rules

| Condition | Verdict | Action |
|---|---|---|
| **P0 > 0** | FAIL / BLOCK | Next phase CANNOT start. Fix all P0 bugs first. |
| **P0 = 0, P1 > 3** | CONDITIONAL | Evaluate each P1. Fix critical ones now. |
| **P0 = 0, P1 <= 3** | PASS | Proceed. P1 bugs tracked. |

---

## Test Plan Format (`docs/quality/qa-test-plan.md`)

```markdown
# QA Test Plan
**Project:** [Name]
**Stories:** [List]

## Pre-flight Automated Checks
- [ ] Zero mock imports in routes
- [ ] Zero buttons without handlers
- [ ] Zero useDevToolbar in routes
- [ ] All API paths have trailing slashes
- [ ] Frontend build passes

## Persona Walkthroughs (UI-BASED)

### [Persona Name] ([email])
| # | Action (what to click/type) | Expected Result | Story | Priority |
|---|---|---|---|---|
| P1-1 | Navigate to /login, fill email, fill password, click Login | Redirect to /[persona-section] | AUTH | P0 |
| P1-2 | Verify sidebar has [N] items: [list] | All items visible and correct | LAYOUT | P0 |
| P1-3 | Click "[First nav item]" | Navigate to [route], data renders | [STORY-ID] | P0 |
| P1-4 | Click "[Create X]" button | Dialog opens with form fields | [STORY-ID] | P0 |
| P1-5 | Fill form, click Save | Success message, data appears in list | [STORY-ID] | P0 |
| ... | | | | |

### Button Inventory
| Screen | Button Text | Expected Behavior | Story |
|---|---|---|---|
| /admin/users | Add User | Opens create user dialog | ADMIN-001 |
| /admin/users | Export CSV | Downloads CSV file | ADMIN-001 |
| /admin/users | Bulk Import CSV | Opens import dialog/wizard | ADMIN-001 |
| ... | | | |

## Cross-Persona Integration Tests
| # | Steps (multi-persona) | Expected Result | Stories |
|---|---|---|---|
| X-1 | IC fills self-reflection → saves draft → reloads → verifies draft → submits | Status changes to Completed, manager can see it | STORY-X |
| X-2 | IC nominates peer → Manager approves → Peer gets feedback task | New assessment created for approved nominee | STORY-X, STORY-Y |
| ... | | | |

## Auth Edge Case Tests
| # | Test | Expected Result | Priority |
|---|---|---|---|
| A-1 | Clear auth_user, keep auth_token, navigate to / | Redirects to /login cleanly (no loop) | P0 |
| A-2 | IC navigates to /admin | Shows "not accessible" message | P0 |
| A-3 | Click Logout → try to access /admin directly | Redirected to /login | P0 |
| ... | | | |

## Screen-by-Screen 10-Point Checks
[Table for each screen with all 10 checks]
```

---

## QA Report Format (`docs/phases/phase-<N>/verify/qa-audit.md`)

Must include:
1. Pre-flight check results (all 5 checks)
2. Per-persona walkthrough results with screenshots
3. Button click results (every button tested)
4. Form persistence results (every form tested)
5. Cross-persona integration results
6. Auth edge case results
7. Bug list with P0/P1/P2
8. Gate decision

---

## Common Bugs QA Must Catch (from apex-perf retro)

These are the bugs that were missed in the apex-perf project. QA MUST specifically check for them:

### 1. Trailing Slash 307 Redirect
**How to detect:** API calls succeed via curl but fail in the browser with 401.
**Check:** Run pre-flight check #4 (grep for API paths without trailing slashes).
**Root cause:** FastAPI 307 redirect strips Authorization header.

### 2. Dev Toolbar Blocking Real Auth
**How to detect:** User can't access their persona's pages after login.
**Check:** Run pre-flight check #3 (grep for useDevToolbar).

### 3. Login Redirect Loop
**How to detect:** Page refreshes infinitely on /login.
**Check:** Auth edge case test A-1.

### 4. Form Data Lost on Reload
**How to detect:** Fill a form, save draft, reload — fields are empty.
**Check:** Screen check #6 for every form page.
**Root cause:** `useState` initializer runs before async data loads.

### 5. Buttons Without Handlers
**How to detect:** Clicking a button does nothing.
**Check:** Run pre-flight check #2 AND click every button in UI testing.

### 6. Icons Rendering as Text
**How to detect:** Large text like "USERS" or "BAR-CHART" appearing instead of icons.
**Check:** Visual inspection of stat cards and icon components.
**Root cause:** Wrong icon library names (Lucide vs Material Symbols).

---

## Rules

1. **P0 = 0 to proceed.** No exceptions.
2. **TEST THROUGH THE UI.** API-only testing is insufficient and has been proven to miss critical bugs.
3. **Click every button.** A button that exists but does nothing is a P0.
4. **Login through the login page.** Never inject tokens via localStorage.
5. **Test every persona.** Each one has different RBAC, layout, and workflows.
6. **Test form persistence.** Fill → save → reload → verify for every form.
7. **Run pre-flight checks first.** They catch 50% of bugs automatically.
8. **Evidence required.** Screenshots for every screen, every persona.
9. **Cross-persona workflows matter.** The worst bugs appear at persona boundaries.
10. **QA report is mandatory.** No verbal-only results.
11. **Regression is not optional.** Every QA run tests ALL implemented features.
12. **Don't trust "build passes."** TypeScript compilation does not mean the product works.
13. **Test page reload on every screen.** Auth persistence bugs only appear on reload.
14. **Test empty states.** Create a new user with no data and verify empty states render.
