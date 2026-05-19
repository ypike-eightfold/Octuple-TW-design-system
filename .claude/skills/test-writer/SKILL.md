---
name: test-writer
description: Writes unit tests, integration tests, and end-to-end test scripts based on approved user stories, acceptance criteria, API spec, and backend business logic. Use this skill when the user wants to write tests, verify business logic, check API behaviour, or validate end-to-end user flows. Always trigger after backend-writer and ui-builder produce approved outputs. Check forger for accepted stories and API spec before writing. Also triggers when the user says "write tests", "add test coverage", "verify the logic", "write acceptance tests", or "test the PIP workflow".
---

# Test Writer

Generates a full test suite — unit, integration, and E2E — from approved acceptance criteria and business logic.

## Context Manifest

```yaml
unit_type: module
required_inputs:
  - context.json#build_phases[current]
per_unit_inputs:
  - docs/architecture/api.md#<unit>
  - docs/product/stories/<story-id>.md
  - backend/app/services/<unit>.py
  - backend/app/api/routes/<unit>.py
  - backend/app/models/<unit>.py
  - docs/phases/phase-<N>/build/backend/<unit>.md      # what backend-writer actually built
  - docs/phases/phase-<N>/build/frontend/<unit>.md           # what ui-builder actually built (if exists)
forbidden_paths:
  - docs/product/market-research.md
  - docs/product/user-stories.md                                  # load per-story slice instead
  - docs/architecture/system.md                                  # not needed for tests
budget_tokens: 900000
outputs:
  - backend/tests/services/test_<unit>.py
  - backend/tests/api/test_<unit>.py
  - frontend/e2e/gates/phase-<N>-<unit>.spec.ts
artifacts:
  summary:          docs/phases/phase-<N>/build/tests/<unit>.md
  return_contract:  docs/phases/phase-<N>/build/tests/<unit>.return.json
  tracker_slice:    docs/phases/phase-<N>/tracker-slices/tests-<unit>.md
```

## Running as a Subagent

This skill is invoked by **forger** as a Task-tool subagent, one **module** per invocation (1:1 with backend-writer modules). You receive the standard Task prompt envelope (`UNIT:`, `LOAD THESE FILES:`, `PRIOR DECISIONS:`, `CONTEXT BUDGET:`).

When finished:
1. Write service-level pytest tests at `backend/tests/services/test_<unit>.py`.
2. Write API-level pytest tests at `backend/tests/api/test_<unit>.py`.
3. Write a Playwright phase-gate spec at `frontend/e2e/gates/phase-<N>-<unit>.spec.ts`.
4. Fill in the Test Evidence column of `docs/phases/phase-<N>/tracker-slices/tests-<unit>.md` for every row.
5. Run tests locally and capture coverage. If any fail, iterate until green before returning.
6. Write a <300-word summary at `docs/phases/phase-<N>/build/tests/<unit>.md` with these seven required sections: Unit ID + status · Test files created · AC rows covered · Coverage % · Fixtures · Flaky/skipped tests · Gate test selector.
7. Write the JSON return contract (schema at `.claude/skills/_shared/return-contract.md`) at the `artifacts.return_contract` path declared in the manifest.
8. Do NOT call AskUserQuestion. Use `status: blocked` in return JSON if endpoints in the module don't match the api-spec (common surprise).

Run discovery (`openapi.json`, model scan, role scan) against the actual `backend/` on disk — do not trust the summary markdown alone for endpoint shapes.

---

## Pre-conditions

Confirm via forger:
- User stories + acceptance criteria approved
- API spec approved
- Backend implementation approved

---

## Step 0: Discovery — Know What You Are Testing (MANDATORY)

Before writing ANY test, run these discovery steps. Do NOT skip them. Tests generated without discovery will have wrong imports, wrong endpoints, wrong field names, and wrong RBAC expectations.

### 0.1 Discover Backend API Surface

Scan the actual implemented endpoints — do NOT rely on templates or assumptions:

```bash
# If backend is running (preferred — most accurate)
cd backend && source .venv/bin/activate
curl -s http://localhost:8000/api/v1/openapi.json | python3 -c "
import json, sys
spec = json.load(sys.stdin)
print('=== ENDPOINTS ===')
for path, methods in spec['paths'].items():
    for method, detail in methods.items():
        tags = detail.get('tags', ['untagged'])
        sec = 'AUTH' if detail.get('security') else 'PUBLIC'
        print(f'{method.upper():7s} {path:50s} [{sec}] tags={tags}')
print()
print('=== SCHEMAS ===')
for name, schema in spec.get('components', {}).get('schemas', {}).items():
    fields = list(schema.get('properties', {}).keys())
    print(f'{name}: {fields}')
"
```

```bash
# If backend is NOT running — scan route files directly
grep -rn '@router\.' backend/app/api/routes/ | grep -E 'get|post|put|patch|delete'
```

Save the output. This is your **endpoint inventory** — every test must reference real endpoints from this list.

### 0.2 Discover Database Models

```bash
# List all SQLModel table classes
grep -rn "class.*SQLModel.*table=True" backend/app/models/
```

This tells you what entities exist (User, Item, ReviewCycle, Goal, etc.), their field names, and relationships. Tests must use real model names and field names.

### 0.3 Discover User Roles

```bash
# Find the UserRole enum
grep -A 20 "class UserRole" backend/app/schemas/user.py backend/app/models/user.py 2>/dev/null
```

This tells you what roles are available (user, admin, manager, hr_admin, etc.). Each role needs test fixtures and RBAC boundary tests.

### 0.4 Discover Frontend Routes

```bash
# TanStack Router file-based routes
ls -R frontend/src/routes/ 2>/dev/null

# Or grep for route definitions
grep -rn "createRoute\|createFileRoute\|path:" frontend/src/routes/ 2>/dev/null | head -30
```

This tells you what pages exist. Each route needs at least a smoke test and an RBAC test.

### 0.5 Discover Seed Data

```bash
# Check what test users are seeded
cat backend/scripts/seed.py 2>/dev/null
grep -A 5 "FIRST_SUPERUSER" backend/app/core/config.py 2>/dev/null
```

Use seeded credentials in E2E tests. Never hardcode credentials that don't exist in the seed script.

---

## Step 0.5: Cross-Reference — Ensure Full Coverage (MANDATORY)

After discovery, cross-reference against approved artifacts to find coverage gaps.

### Cross-Reference Matrix

Build this matrix BEFORE writing any tests:

```
For each user story in docs/product/user-stories.md:
  For each acceptance criterion (AC) in that story:
    → Which backend endpoint(s) implement this AC? (from Step 0.1)
    → Which frontend route(s) display this AC? (from Step 0.4)
    → What role(s) should access it? (from Step 0.3)
    → What should happen for unauthorized roles?
    → What edge cases exist? (empty state, max length, duplicate, concurrent)
```

### Output the Coverage Plan

Before writing tests, output a table like this for user approval:

```markdown
| Story | AC | Backend Test | Integration Test | E2E Test | Smoke | Gate |
|-------|----|-------------|-----------------|----------|-------|------|
| STORY-1 | AC1: Launch creates participants | test_review_cycle.py::test_launch_creates_participant_records | test_review_cycles_api.py::test_post_launch_201 | review-cycle.spec.ts::IC completes self-assessment | smoke.spec.ts::admin can see cycles | phase-2-<unit>.spec.ts |
| STORY-1 | AC2: Rejects non-DRAFT | test_review_cycle.py::test_launch_rejects_non_draft | test_review_cycles_api.py::test_post_launch_400_active | — | — | — |
| STORY-1 | AC3: Excludes inactive | test_review_cycle.py::test_launch_excludes_inactive | — | — | — | — |
| (uncovered) | — | — | — | — | — | — |
```

**If any AC has no test mapped, flag it.** Ask the user whether to add a test or document it as a manual test case.

### RBAC Coverage Matrix

For every endpoint discovered in Step 0.1, ensure tests exist for:

| Endpoint | Admin | Manager | Employee | Unauthenticated |
|----------|-------|---------|----------|-----------------|
| GET /review-cycles/ | 200 (list all) | 200 (own team) | 200 (own only) | 401 |
| POST /review-cycles/ | 201 | 403 | 403 | 401 |
| POST /review-cycles/{id}/launch/ | 200 | 403 | 403 | 401 |

**Every cell must have a test.** If a cell says 403, there must be a test asserting 403.

---

## Test Stack

| Test Type | Tool | Location |
|---|---|---|
| Backend unit tests | pytest + pytest-asyncio | `backend/tests/services/` |
| Backend integration tests | pytest + httpx (FastAPI TestClient) | `backend/tests/api/` |
| Frontend unit tests | Vitest + React Testing Library | `frontend/src/**/*.test.ts(x)` (co-located) |
| E2E tests | Playwright | `frontend/e2e/` |
| Test data / factories | pytest fixtures + factory functions | `backend/tests/conftest.py` |
| Backend coverage | pytest-cov | via `bash scripts/test.sh` |
| Frontend coverage | Vitest coverage (Istanbul) | via `pnpm run test:unit:coverage` |

---

## Step 0.6: UI-Through Test Mandate (MANDATORY)

### The Problem This Solves

In previous projects, all API tests passed but the product had critical bugs. Tests verified API status codes (200, 201, 403) which proves endpoints exist -- NOT that the UI renders data, forms save correctly, or buttons trigger real actions. This is "testing theater."

### Rule: For Every Form-Type AC, There MUST Be a Playwright Test

| AC Type | Example | Required Test |
|---|---|---|
| Data display | "Dashboard shows task count" | Playwright: verify text content |
| Form submission | "User submits a form" | Playwright: fill form + submit + verify status change |
| Draft persistence | "Auto-save on focus-out" | Playwright: fill + wait + reload + verify values persist |
| Button action | "Export CSV downloads file" | Playwright: click + verify download |
| State transition | "Status changes to Submitted" | Playwright: submit + verify badge text changes |
| Validation | "Required fields show error" | Playwright: submit empty + verify inline error messages |
| RBAC UI | "Employee cannot see admin nav" | Playwright: login as employee + verify nav items |

### Mandatory Test Ratio

For each phase, the test suite MUST contain:
- At minimum 1 Playwright E2E test per user story (covering the critical happy-path journey)
- At minimum 1 Playwright test per form page (fill + save + reload + verify persistence)
- At minimum 1 Playwright test per persona involved (login + verify correct landing page)

### Test Quality Gate: No Status-Code-Only Tests for UI Features

```bash
# Find test files that assert status_code but never assert response body content.
# Per-file check (not piped context filter): piping `grep -v` across `-B/-A` context lines
# drops legit status-code-only lines whenever a surrounding context line contains `json` or `data`.
for f in $(grep -rln "assert.*status_code\b" backend/tests/); do
  if ! grep -qE "assert.*\.json|assert.*\.data|assert.*\.body|assert.*\.content" "$f"; then
    echo "STATUS-CODE-ONLY TEST FILE: $f"
  fi
done
```

For each status-code-only test:
- If purely RBAC boundary (403/401): status-code-only is ACCEPTABLE
- If data creation/retrieval: MUST also assert response body content
- If form submission: there MUST be a corresponding Playwright test

### Output: Test Quality Matrix

```
TEST QUALITY MATRIX -- Phase N
| Story   | AC                       | API Test (pytest)            | UI Test (Playwright)           | Verdict |
|---------|--------------------------|------------------------------|--------------------------------|---------|
| STORY-X | Submit form                | test_submit_200 (status+body)| self-assess.spec.ts (fill+submit)| OK    |
| STORY-X | Auto-save on focus-out     | NONE                         | NONE                           | BLOCKED |
| STORY-X | Character limit N chars      | test_422 (status+msg)        | NONE                           | NEEDS UI test |
```

Any AC with NONE in BOTH columns = BLOCKED. Any form AC with no Playwright test = BLOCKED.

---

## Test Categories

### 1. Backend Unit Tests — Business Logic (pytest)

Focus on service layer methods. Test every business rule explicitly.

#### Review Cycle Tests

```python
# backend/tests/services/test_review_cycle.py
import pytest
from uuid import uuid4
from unittest.mock import AsyncMock, MagicMock
from app.services.review_cycle import ReviewCycleService
from app.models.review_cycle import CycleStatus

class TestReviewCycleService:

    @pytest.mark.asyncio
    async def test_launch_cycle_creates_participant_records(self, db_session, mock_employees):
        """Should create participant records for all active employees."""
        cycle = await create_test_cycle(db_session, status=CycleStatus.DRAFT)
        await ReviewCycleService.launch_cycle(db_session, cycle.id, admin_id)

        participants = await get_participants(db_session, cycle.id)
        assert len(participants) == len(mock_employees) * 2  # SELF + MANAGER per employee

    @pytest.mark.asyncio
    async def test_launch_cycle_rejects_non_draft(self, db_session):
        """Should throw if cycle is not in DRAFT status."""
        cycle = await create_test_cycle(db_session, status=CycleStatus.ACTIVE)
        with pytest.raises(ValueError, match="Cycle must be in DRAFT status"):
            await ReviewCycleService.launch_cycle(db_session, cycle.id, admin_id)

    @pytest.mark.asyncio
    async def test_launch_excludes_inactive_employees(self, db_session):
        """Should not create participants for inactive employees."""
        active = await create_test_user(db_session, is_active=True)
        inactive = await create_test_user(db_session, is_active=False)
        cycle = await create_test_cycle(db_session, status=CycleStatus.DRAFT)

        await ReviewCycleService.launch_cycle(db_session, cycle.id, admin_id)

        participants = await get_participants(db_session, cycle.id)
        reviewee_ids = [p.reviewee_id for p in participants]
        assert active.id in reviewee_ids
        assert inactive.id not in reviewee_ids
```

---

#### Calibration Tests

```python
# backend/tests/services/test_calibration.py
class TestCalibrationService:

    @pytest.mark.asyncio
    async def test_flags_distribution_violation(self, db_session):
        """Should flag when >20% rated Exceeds."""
        # Create 10 reviews, 3 with rating 5 (30% Exceeds)
        result = await CalibrationService.get_rating_distribution(db_session, dept_id, cycle_id)
        assert "EXCEEDS_ABOVE_THRESHOLD" in result["flags"]

    @pytest.mark.asyncio
    async def test_prevents_adjustment_after_lock(self, db_session):
        """Should prevent rating adjustment after session is locked."""
        session = await create_calibration_session(db_session, status="LOCKED")
        with pytest.raises(ValueError, match="Calibration session is locked"):
            await CalibrationService.adjust_rating(db_session, participant_id, 4, mgr_id, "reason")
```

---

#### Goal Alignment Tests

```python
# backend/tests/services/test_goal.py
class TestGoalService:

    @pytest.mark.asyncio
    async def test_ic_cannot_create_team_goals(self, db_session):
        """IC should only be able to create INDIVIDUAL goals."""
        with pytest.raises(ValueError, match="ICs can only create INDIVIDUAL goals"):
            await GoalService.create_goal(
                db_session,
                CreateGoalDto(level="TEAM", title="Team goal"),
                created_by_id=ic_user.id,
                role="IC",
            )

    @pytest.mark.asyncio
    async def test_ic_goals_set_to_pending_approval(self, db_session):
        """IC goals should start in PENDING_APPROVAL status."""
        goal = await GoalService.create_goal(
            db_session,
            CreateGoalDto(level="INDIVIDUAL", title="My goal"),
            created_by_id=ic_user.id,
            role="IC",
        )
        assert goal.status == "PENDING_APPROVAL"
```

---

#### PIP Workflow Tests

```python
# backend/tests/services/test_pip.py
class TestPIPService:

    @pytest.mark.asyncio
    async def test_pip_starts_as_draft(self, db_session):
        """PIP should require HR BP approval before going active."""
        pip = await PIPService.initiate_pip(db_session, dto, manager_id)
        assert pip.status == "DRAFT"

    @pytest.mark.asyncio
    async def test_only_direct_manager_can_initiate(self, db_session):
        """Only direct manager can initiate a PIP."""
        with pytest.raises(ValueError, match="only initiate PIPs for your direct reports"):
            await PIPService.initiate_pip(db_session, dto, other_manager_id)

    @pytest.mark.asyncio
    async def test_never_hard_deletes_pip(self, db_session):
        """Closing a PIP should archive it, not delete."""
        pip = await create_active_pip(db_session)
        closed = await PIPService.close_pip(db_session, pip.id, "SUCCESS", manager_id)
        assert closed.status == "COMPLETED_SUCCESS"
        # Verify record still exists in DB
        assert await get_pip(db_session, pip.id) is not None
```

---

### 2. Backend Integration Tests — API Endpoints (httpx + FastAPI TestClient)

Test each API route with a real test database:

```python
# backend/tests/api/test_goals.py
import pytest
from httpx import AsyncClient

class TestGoalsAPI:

    @pytest.mark.asyncio
    async def test_ic_cannot_create_team_goal(self, client: AsyncClient, ic_token: str):
        """POST /api/v1/goals should return 403 for IC creating TEAM goal."""
        res = await client.post(
            "/api/v1/goals",
            headers={"Authorization": f"Bearer {ic_token}"},
            json={"title": "Team goal", "level": "TEAM"},
        )
        assert res.status_code == 403

    @pytest.mark.asyncio
    async def test_ic_creates_individual_goal(self, client: AsyncClient, ic_token: str):
        """POST /api/v1/goals should return 201 with PENDING_APPROVAL status."""
        res = await client.post(
            "/api/v1/goals",
            headers={"Authorization": f"Bearer {ic_token}"},
            json={"title": "My goal", "level": "INDIVIDUAL"},
        )
        assert res.status_code == 201
        assert res.json()["status"] == "PENDING_APPROVAL"

    @pytest.mark.asyncio
    async def test_manager_approves_goal(self, client: AsyncClient, manager_token: str, pending_goal):
        """PATCH /api/v1/goals/:id/status should allow manager to approve."""
        res = await client.patch(
            f"/api/v1/goals/{pending_goal.id}/status",
            headers={"Authorization": f"Bearer {manager_token}"},
            json={"status": "ACTIVE"},
        )
        assert res.status_code == 200
        assert res.json()["status"] == "ACTIVE"
```

---

### 3. E2E Tests — Full User Journeys (Playwright)

Cover complete flows per persona:

```typescript
// frontend/e2e/review-cycle.spec.ts
import { test, expect } from '@playwright/test'
import { loginAs, seedCycle } from './helpers'

test.describe('Annual Review Cycle — Full Flow', () => {

  test('IC completes self-assessment', async ({ page }) => {
    await loginAs(page, 'ic@example.com')
    await page.goto('/reviews')
    await expect(page.getByText('Annual Review 2025')).toBeVisible()
    await page.getByRole('button', { name: 'Start Self Assessment' }).click()

    // Fill out form
    await page.getByLabel('Overall Rating').selectOption('4')
    await page.getByLabel('Key Strengths').fill('Delivered all Q3 OKRs...')
    await page.getByLabel('Areas for Development').fill('Want to improve...')
    await page.getByRole('button', { name: 'Submit Assessment' }).click()

    await expect(page.getByText('Assessment submitted')).toBeVisible()
    await expect(page.getByTestId('review-status')).toHaveText('Submitted')
  })

  test('Manager reviews team and submits', async ({ page }) => {
    await loginAs(page, 'manager@example.com')
    await page.goto('/team/reviews')
    await expect(page.getByText('2 pending reviews')).toBeVisible()

    await page.getByTestId('reviewee-card').first().click()
    await page.getByLabel('Overall Performance Rating').selectOption('4')
    await page.getByLabel('Key Strengths').fill('Consistently delivered...')
    await page.getByLabel('Areas for Development').fill('Should develop...')
    await page.getByRole('button', { name: 'Submit Review' }).click()

    await expect(page.getByText('Review submitted successfully')).toBeVisible()
  })

  test('HR Admin can view cycle completion rate', async ({ page }) => {
    await loginAs(page, 'hradmin@example.com')
    await page.goto('/admin/cycles')
    await expect(page.getByTestId('completion-rate')).toContainText('%')
  })
})
```

---

### 4. E2E Smoke Tests -- API Endpoint Coverage (stdlib only)

The phase-verifier requires `backend/scripts/e2e_smoke.py` with a `run_phase_N()` function per phase. These use **stdlib only** (urllib + json, no external deps) so they run without installing test dependencies.

#### Helpers

Provide reusable `_get`, `_post`, `_put`, `_patch`, `_login` functions using `urllib.request` and `urllib.error`. Each returns `(status_code, parsed_json_or_none)`. The `_login` function takes an email and password, POSTs to `/login/access-token`, and returns the token string.

#### Per-Endpoint Test Matrix

For EACH endpoint in the phase, test:

| Check | Method | Expected | Purpose |
|---|---|---|---|
| Happy path | Correct role + valid data | 200/201 | Feature works |
| No auth | No token | 401 | Auth enforced |
| Wrong role | Token for unauthorized role | 403 | RBAC enforced |
| Bad input | Invalid request body | 422 | Validation works |
| Bad state | Valid request but invalid business state | 400 | Business rules enforced |

#### Multi-Role Testing

Login as at least 3 roles per phase using credentials from the seed script:
- **HR_ADMIN** -- for admin endpoints
- **EMPLOYEE** -- for employee endpoints + 403 on admin
- **MANAGER** -- for team view endpoints

#### Output Format

```
[PASS] GET /review-cycles/ as HR_ADMIN -> 200
[PASS] GET /review-cycles/ as EMPLOYEE -> 403
[FAIL] POST /review-cycles/{id}/launch/ as HR_ADMIN -> expected 200, got 500
---
Phase 2: 35/37 checks passed
```

Exit 0 if all pass, exit 1 if any fail. The `main()` function routes `--phase N` to `run_phase_N()`.

---

### 4b. Security Tests — Authorization, Injection, and Data Exposure (MANDATORY)

Every phase MUST include security tests. ~60% of SaaS vulnerabilities are broken authorization — these tests catch them before deployment.

#### Authorization Tests (Covers Mistakes #1, #2)

For EVERY endpoint in the phase, test these access control scenarios:

```python
# backend/tests/security/test_authorization.py
import pytest
from httpx import AsyncClient

class TestAuthorizationEnforcement:

    @pytest.mark.asyncio
    async def test_unauthenticated_access_returns_401(self, client: AsyncClient):
        """Every protected endpoint must return 401 without a token."""
        protected_endpoints = [
            ("GET", "/api/v1/users/"),
            ("GET", "/api/v1/review-cycles/"),
            ("POST", "/api/v1/goals/"),
            # Add every endpoint in this phase
        ]
        for method, url in protected_endpoints:
            res = await client.request(method, url)
            assert res.status_code == 401, f"{method} {url} returned {res.status_code} without auth"

    @pytest.mark.asyncio
    async def test_wrong_role_returns_403(self, client: AsyncClient, ic_token: str):
        """Non-admin user must not access admin endpoints."""
        admin_endpoints = [
            ("POST", "/api/v1/review-cycles/"),
            ("GET", "/api/v1/admin/settings/"),
            # Add all admin-only endpoints
        ]
        for method, url in admin_endpoints:
            res = await client.request(
                method, url,
                headers={"Authorization": f"Bearer {ic_token}"},
            )
            assert res.status_code == 403, f"{method} {url} returned {res.status_code} for IC role"
```

#### Cross-Tenant / IDOR Tests (Covers Mistake #2)

Create resources as Org A / User A, then attempt to access them as Org B / User B:

```python
class TestTenantIsolation:

    @pytest.mark.asyncio
    async def test_user_cannot_access_other_orgs_resources(
        self, client: AsyncClient, org_a_token: str, org_b_resource_id: str
    ):
        """User from Org A must get 404 (not 403) when accessing Org B's resource."""
        res = await client.get(
            f"/api/v1/resources/{org_b_resource_id}/",
            headers={"Authorization": f"Bearer {org_a_token}"},
        )
        # 404, not 403 — don't leak existence of other orgs' resources
        assert res.status_code == 404

    @pytest.mark.asyncio
    async def test_manager_cannot_access_other_teams_reviews(
        self, client: AsyncClient, manager_a_token: str, manager_b_report_id: str
    ):
        """Manager A must not see Manager B's direct reports' reviews."""
        res = await client.get(
            f"/api/v1/reviews/{manager_b_report_id}/",
            headers={"Authorization": f"Bearer {manager_a_token}"},
        )
        assert res.status_code == 404
```

#### Data Exposure Tests (Covers Mistake #3)

Verify API responses do not leak sensitive fields:

```python
class TestDataExposure:

    @pytest.mark.asyncio
    async def test_user_list_excludes_password_hash(self, client: AsyncClient, admin_token: str):
        """User list must never include hashed_password."""
        res = await client.get(
            "/api/v1/users/",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        for user in res.json()["data"]:
            assert "hashed_password" not in user
            assert "password" not in user

    @pytest.mark.asyncio
    async def test_non_admin_cannot_see_pii(self, client: AsyncClient, ic_token: str):
        """Non-admin user should not see other users' email/phone in list responses."""
        res = await client.get(
            "/api/v1/team/members/",
            headers={"Authorization": f"Bearer {ic_token}"},
        )
        for member in res.json()["data"]:
            # IC should only see name and role, not email/phone
            assert "phone" not in member or member.get("phone") is None
```

#### Input Validation Tests (Covers Mistakes #5, #7)

Test that the API rejects malicious input server-side:

```python
class TestInputValidation:

    @pytest.mark.asyncio
    async def test_rejects_sql_injection_in_sort(self, client: AsyncClient, admin_token: str):
        """Sort parameter must be validated against allowlist."""
        res = await client.get(
            "/api/v1/users/?sort_by=name; DROP TABLE users;--",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert res.status_code in (400, 422)

    @pytest.mark.asyncio
    async def test_rejects_oversized_input(self, client: AsyncClient, ic_token: str):
        """API must enforce field length limits server-side."""
        res = await client.post(
            "/api/v1/goals/",
            headers={"Authorization": f"Bearer {ic_token}"},
            json={"title": "A" * 10000, "level": "INDIVIDUAL"},
        )
        assert res.status_code == 422

    @pytest.mark.asyncio
    async def test_rejects_html_in_text_fields(self, client: AsyncClient, ic_token: str):
        """Script tags in text fields must be sanitized or rejected."""
        xss_payload = '<script>alert("xss")</script>Normal text'
        res = await client.post(
            "/api/v1/feedback/",
            headers={"Authorization": f"Bearer {ic_token}"},
            json={"content": xss_payload, "recipient_id": "..."},
        )
        if res.status_code == 201:
            # If accepted, verify the stored content is sanitized
            assert "<script>" not in res.json().get("content", "")
```

#### Pagination Abuse Tests

```python
class TestPaginationLimits:

    @pytest.mark.asyncio
    async def test_rejects_excessive_page_size(self, client: AsyncClient, admin_token: str):
        """API must cap the limit parameter to prevent resource exhaustion."""
        res = await client.get(
            "/api/v1/users/?limit=999999",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        # Should either cap the limit or reject it
        if res.status_code == 200:
            assert len(res.json()["data"]) <= 1000  # reasonable max
```

#### E2E Smoke — Security Checks Per Endpoint

Extend the existing `e2e_smoke.py` per-endpoint matrix to ALWAYS include:

| Check | Method | Expected | Purpose |
|---|---|---|---|
| Happy path | Correct role + valid data | 200/201 | Feature works |
| No auth | No token | 401 | Auth enforced |
| Wrong role | Token for unauthorized role | 403 | RBAC enforced |
| Cross-tenant | Token from different org | 404 | Tenant isolation |
| Bad input | Invalid/malicious request body | 422 | Validation works |
| Oversized input | Extremely long field values | 422 | Length limits enforced |

---

## Test Coverage Targets

| Module | Unit | Integration | E2E | Security |
|---|---|---|---|---|
| Auth / RBAC | 95% | Yes | Yes | 401/403 on every endpoint |
| Goals | 90% | Yes | Yes | Cross-tenant, role escalation |
| Review Cycles | 95% | Yes | Yes | Cross-tenant, role escalation |
| Calibration | 90% | Yes | -- | Rating adjustment auth |
| PIP | 95% | Yes | Yes | Manager-only, HR-only gates |
| Notifications | 80% | Yes | -- | No cross-user notification access |
| Analytics | 70% | Yes | -- | Data scoping by role |
| E2E smoke (per phase) | -- | -- | All phase endpoints x 6+ checks, exit 0 | All 6 checks per endpoint |

---

## Test Data Factories (pytest fixtures)

```python
# backend/tests/conftest.py
import pytest
from uuid import uuid4
from datetime import datetime, timedelta
from sqlmodel import Session
from app.models.user import User, Role
from app.models.review_cycle import ReviewCycle, CycleType, CycleStatus

@pytest.fixture
def test_user(db_session: Session) -> User:
    user = User(
        id=uuid4(),
        email="test@example.com",
        name="Test User",
        hashed_password="hashed",
        role=Role.IC,
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    return user

@pytest.fixture
def test_cycle(db_session: Session, test_user: User) -> ReviewCycle:
    cycle = ReviewCycle(
        id=uuid4(),
        name="Test Cycle Q1 2025",
        type=CycleType.ANNUAL,
        status=CycleStatus.DRAFT,
        self_open_at=datetime.utcnow(),
        self_close_at=datetime.utcnow() + timedelta(days=14),
        manager_open_at=datetime.utcnow() + timedelta(days=15),
        manager_close_at=datetime.utcnow() + timedelta(days=30),
        created_by_id=test_user.id,
    )
    db_session.add(cycle)
    db_session.commit()
    return cycle
```

---

## Cross-Cutting Rules

1. **Incremental delivery** — Present work unit by unit inline in the conversation. Get user feedback before proceeding to the next unit. Don't batch everything and dump file paths.
2. **Research awareness** — Check for the market research brief (`docs/product/market-research.md`) before starting. Use competitor insights and UX patterns from it to inform your output.
3. **Enterprise depth** — All outputs should be spec-level, not summary-level. Think about what an enterprise customer at a 5,000-person company would need.
4. **No emoji in production artifacts** — Use text labels and SVG icons, not emoji, in any artifacts that will be used downstream.

---

## After Writing Tests — Verify and Fix (MANDATORY)

Do NOT hand off tests without running them first. Broken tests are worse than no tests.

### Step V1: Run Backend Tests

```bash
cd backend && source .venv/bin/activate
python app/initial_data.py  # re-seed if needed
pytest tests/ -v --tb=short 2>&1
```

**For each failure, determine the cause:**

| Cause | Action |
|-------|--------|
| Import error (module not found) | The service/model is not implemented yet. Add `skipif` import guard so the test skips cleanly. |
| Wrong field name / wrong endpoint path | Your discovery was wrong. Re-run Step 0.1, fix the test. |
| Assertion error (wrong status code) | Check if the endpoint exists and RBAC is correct. Fix the test expectation or flag as app bug. |
| Database error | Check migration state. Run `alembic upgrade head`. |
| SMTP / email error | Expected in local dev. Skip with `-k "not recovery_password"` or mock `send_email`. |

**Fix all test-code issues. Re-run until the only failures are genuine app bugs or intentional skips.**

### Step V2: Run E2E Smoke Tests (Backend Only)

```bash
cd backend && source .venv/bin/activate
python scripts/e2e_smoke.py --phase 1
```

If this fails, the API endpoints have issues. Fix before writing Playwright tests that depend on them.

### Step V3: Run Playwright E2E Tests

```bash
cd frontend
npx playwright install chromium  # if not installed
npx playwright test --project=chromium 2>&1
```

**Common Playwright failures and fixes:**

| Failure | Likely Cause | Fix |
|---------|-------------|-----|
| `page.waitForURL` timeout at `/login` | Login page not implemented yet | Add `test.skip` with reason, or check if route exists first |
| `getByLabel` not found | Form field label doesn't match | Inspect the actual rendered HTML, use correct label/role/testid |
| `getByText` not found | Text content is different from expected | Read the actual component, match the real text |
| `toHaveURL` fails | Route path is different | Check `frontend/src/routes/` for actual path |
| 401/403 on API call | RBAC doesn't match seeded user's role | Check seed script for correct credentials and role |

**Fix all test-code issues. Do NOT leave broken Playwright tests — they block the entire E2E suite via dependency chains.**

### Step V4: Output Coverage Summary

After all tests pass (or skip cleanly), output:

```markdown
## Test Execution Summary

### Backend (pytest)
| Status | Count | Details |
|--------|-------|---------|
| PASSED | 92 | Auth, RBAC, CRUD, validation |
| SKIPPED | 31 | Stub tests for unimplemented services |
| FAILED | 2 | SMTP not configured (known) |

### Frontend (Playwright)
| Status | Count | Details |
|--------|-------|---------|
| PASSED | 12 | Smoke, gate, RBAC |
| FAILED | 5 | Auth-setup (login page not built) |
| DID NOT RUN | 47 | Blocked by auth-setup |

### Coverage Gaps
| Story | AC | Gap | Recommendation |
|-------|----|-----|----------------|
| STORY-X | AC4 | No E2E test for manager override | Add after UI is built |
```

### Step V5: Generate Stub Tests for Unbuilt Features

For services/endpoints that don't exist yet, generate **stub tests** using the import guard pattern:

```python
try:
    from app.services.review_cycle import ReviewCycleService
    AVAILABLE = True
except ImportError:
    AVAILABLE = False

pytestmark = pytest.mark.skipif(not AVAILABLE, reason="service not yet implemented")
```

This ensures:
- Tests define the contract BEFORE implementation
- Tests auto-activate when the service is built
- Test suite always runs clean (skips, not errors)

### Step V6: Hand Off

1. Show the coverage summary (Step V4)
2. Show the cross-reference matrix (from Step 0.5) with coverage status
3. Highlight any ACs that couldn't be automated (document as manual test cases)
4. Generate phase gate test file (`frontend/e2e/gates/phase-<N>-<unit>.spec.ts`, one per module)
5. Hand off to **forger** for approval
6. After approval, update **forger** context

---

### 5. Frontend Smoke Tests -- Page Load and Data Rendering (Playwright)

**Purpose:** Catch bugs where a page "loads" but renders no real content -- missing layouts, placeholder forms, blank data areas, 403 errors on dependent API calls.

**Location:** `frontend/e2e/smoke/`

**Pattern:** Each test logs in through the actual login page, navigates to the target route, and asserts basic rendering:

```typescript
// frontend/e2e/smoke/ic-dashboard.smoke.spec.ts
import { test, expect } from '@playwright/test'
import { loginViaUI } from '../helpers'

test('IC dashboard loads with navigation and real data', async ({ page }) => {
  await loginViaUI(page, 'emily.nguyen@acme.corp', 'password123');
  await page.waitForURL('/');

  // Layout present
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByText('Emily Nguyen')).toBeVisible();

  // No errors
  await expect(page.getByText(/error|not found|403|500/i)).toHaveCount(0);

  // Real content (not blank)
  await expect(page.getByRole('main').locator('> *')).not.toHaveCount(0);

  // No persistent loading skeletons
  await page.waitForTimeout(3000);
  await expect(page.locator('[data-slot="skeleton"]')).toHaveCount(0);
});
```

**Standard checks for every smoke test:**
1. Login via the actual login page (use `loginViaUI` helper, NEVER localStorage)
2. Navigate to the target route
3. Assert: no error messages visible
4. Assert: main content area has child elements (not blank)
5. Assert: no loading skeletons after 5 seconds
6. Assert: navigation bar/sidebar is present
7. Assert: user name is displayed
8. For data pages: assert at least one real data element (table row, card, list item)
9. For form pages: assert form fields are present

---

### 6. Cross-Layer Integration Tests -- API-to-UI Data Flow (Playwright)

**Purpose:** Catch bugs where the backend works but the frontend cannot consume the data -- wrong RBAC on dependent endpoints, response shape mismatches, broken fetch chains.

**Location:** `frontend/e2e/integration/`

**Key test patterns:**

**Data fetch chain test:**
```typescript
// frontend/e2e/integration/assessment-data-flow.spec.ts
test('IC can load assessment form with real questions from template', async ({ page }) => {
  await loginViaUI(page, 'emily.nguyen@acme.corp', 'password123');

  // Navigate to self-reflection
  await page.getByText(/self-reflection/i).click();

  // Verify form sections render (from the template)
  await expect(page.locator('h3, [data-slot="card-title"]')).not.toHaveCount(0);

  // Verify form fields render
  const formFields = page.locator('textarea, input[type="text"], input[type="radio"], select');
  await expect(formFields.first()).toBeVisible();
});
```

**Auth persistence test:**
```typescript
test('User name persists after page reload', async ({ page }) => {
  await loginViaUI(page, 'emily.nguyen@acme.corp', 'password123');
  await expect(page.getByText('Emily Nguyen')).toBeVisible();

  await page.reload();
  await page.waitForTimeout(2000);

  // User should still be shown after reload (fetchUser on mount)
  await expect(page.getByText('Emily Nguyen')).toBeVisible();
});
```

**RBAC dependency chain test:**
```typescript
test('IC assessment form can fetch form template (indirect RBAC)', async ({ page }) => {
  await loginViaUI(page, 'emily.nguyen@acme.corp', 'password123');
  await page.getByText(/self-reflection/i).click();

  // Monitor network -- form-templates should return 200, not 403
  const response = page.waitForResponse(resp =>
    resp.url().includes('/form-templates/') && resp.status() === 200
  );
  await expect(response).resolves.toBeTruthy();
});
```

---

### 7. RBAC Frontend Tests -- Role Access from the UI (Playwright)

**Purpose:** Verify that each persona can access what they need and cannot access what they shouldn't -- from the UI's perspective, including indirect API dependencies.

**Location:** `frontend/e2e/rbac/`

**For each persona, define and test:**
- **Positive access:** Routes and screens the persona should see with real data
- **Negative access:** Routes the persona should NOT reach (redirect or unauthorized)
- **Indirect dependencies:** API calls the frontend makes that the persona needs (even if not listed as "their" endpoint)

**Example:**
```typescript
// frontend/e2e/rbac/ic-access.spec.ts
test('IC can access dashboard and assessment form', async ({ page }) => {
  await loginViaUI(page, 'alex.johnson@acme.corp', 'password123');
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('main')).toBeVisible();
});

test('IC cannot access admin pages', async ({ page }) => {
  await loginViaUI(page, 'alex.johnson@acme.corp', 'password123');
  await page.goto('/admin');
  // Should redirect to unauthorized or home
  await expect(page).not.toHaveURL('/admin');
});
```

**Indirect dependency tracing:** For each screen, identify ALL API calls it makes (via network tab or code reading), and verify RBAC allows each one for the intended persona. If an IC screen calls `GET /form-templates/{id}`, the RBAC test must verify ICs get 200 (not 403).

---

### 8. Form Submission E2E Tests -- Full Round-Trip (Playwright)

**Purpose:** Verify the core product flow -- filling out a form and persisting data -- works end to end.

**Location:** `frontend/e2e/flows/`

**Pattern:**
```typescript
// frontend/e2e/flows/assessment-submission.flow.spec.ts
test('IC completes self-reflection form end to end', async ({ page }) => {
  await loginViaUI(page, 'emily.nguyen@acme.corp', 'password123');

  // Navigate to self-reflection form
  await page.getByText(/continue|start/i).first().click();

  // Fill at least one field of each type
  // Free text
  await page.locator('textarea').first().fill('I achieved my goals this period.');

  // Rating scale (click a radio button)
  await page.locator('input[type="radio"]').first().check();

  // Save draft
  await page.getByRole('button', { name: /save draft/i }).click();
  await expect(page.getByText(/saved/i)).toBeVisible();

  // Reload and verify draft persisted
  await page.reload();
  await page.waitForTimeout(2000);
  await expect(page.locator('textarea').first()).toHaveValue('I achieved my goals this period.');

  // Fill remaining required fields and submit
  // ... (fill all required fields)
  await page.getByRole('button', { name: /submit/i }).click();

  // Confirm dialog
  await page.getByRole('button', { name: /ok|proceed|confirm/i }).click();

  // Verify submission
  await expect(page.getByText(/submitted/i)).toBeVisible();
});
```

---

### 9. Phase Gate Tests -- Automated Pre-Check for Phase Verifier (Playwright)

**Purpose:** Create an automated safety net that the phase-verifier runs BEFORE manual verification. Catches obvious structural bugs (missing layouts, broken forms, 403s) without needing human judgment.

**Location:** `frontend/e2e/gates/phase-<N>-<unit>.spec.ts` (one per module)

**Each phase gate test file covers:**
1. All persona logins work through the actual login page
2. All new screens load without errors
3. All new forms render their fields
4. Navigation bar/sidebar is present on every screen
5. Critical journey happy path can be started (first 3 steps)

**Example:**
```typescript
// frontend/e2e/gates/phase-2-<unit>.spec.ts
import { test, expect } from '@playwright/test'
import { loginViaUI } from '../helpers'

test.describe('@phase-2-gate', () => {
  test('IC can login and see dashboard with tasks', async ({ page }) => {
    await loginViaUI(page, 'emily.nguyen@acme.corp', 'password123');
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByText(/my tasks|dashboard/i)).toBeVisible();
  });

  test('IC can open assessment form and see real questions', async ({ page }) => {
    await loginViaUI(page, 'emily.nguyen@acme.corp', 'password123');
    await page.getByText(/continue|start/i).first().click();
    await page.waitForTimeout(3000);
    // Form must render actual fields, not placeholder
    const fields = page.locator('textarea, input[type="radio"], select');
    await expect(fields.first()).toBeVisible();
  });

  test('Manager can login and see review queue', async ({ page }) => {
    await loginViaUI(page, 'david.park@acme.corp', 'password123');
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByText(/review queue|team/i)).toBeVisible();
  });

  test('Admin can login and see cycles list', async ({ page }) => {
    await loginViaUI(page, 'admin@acme.corp', 'password123');
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByText(/review cycles/i)).toBeVisible();
  });
});
```

**The phase-verifier MUST run gate tests before manual verification:**
```bash
cd frontend && pnpm run test:e2e -- --grep @phase-N-gate
```

**If gate tests fail, the phase automatically FAILS** without needing manual walkthrough.

---

## Playwright Configuration Requirements

The `frontend/playwright.config.ts` MUST include:

```typescript
export default defineConfig({
  testDir: './e2e',
  baseURL: 'http://localhost:5173',
  webServer: [
    {
      command: 'cd ../backend && .venv/bin/fastapi run app/main.py --port 8000',
      port: 8000,
      reuseExistingServer: true,
    },
    {
      command: 'pnpm run dev',
      port: 5173,
      reuseExistingServer: true,
    },
  ],
});
```

### loginViaUI Helper (MANDATORY)

All E2E tests MUST use `loginViaUI` from `frontend/e2e/helpers.ts`. This helper MUST:
1. Navigate to `/login`
2. Fill the email input field
3. Fill the password input field
4. Click the Login/Submit button
5. Wait for redirect away from `/login`

**NEVER use `localStorage.setItem` or `page.evaluate` to inject tokens.** This hides auth bugs.

```typescript
// frontend/e2e/helpers.ts
import { expect, type Page } from '@playwright/test';

export async function loginViaUI(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in|login|submit/i }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
}
```

---

## Updated Test Coverage Targets

| Module | Unit | Integration | E2E | Smoke | Gate |
|---|---|---|---|---|---|
| Auth / RBAC | 95% | Yes | Yes | Login per persona | All logins |
| Review Cycles | 95% | Yes | Yes | Cycle list + dashboard load | Admin sees cycles |
| Assessments | 90% | Yes | Yes | Form renders questions | IC opens form with fields |
| Forms | 90% | Yes | Yes | Fill + save + submit | Fields render |
| Navigation / Layout | -- | -- | -- | Every persona has nav after login | Nav present |
| Phase gate | -- | -- | Yes | -- | All personas + all screens |
| Goals | 90% | Yes | Yes | -- | -- |
| Calibration | 90% | Yes | -- | -- | -- |
| PIP | 95% | Yes | Yes | -- | -- |
| Notifications | 80% | Yes | -- | -- | -- |
| Analytics | 70% | Yes | -- | -- | -- |