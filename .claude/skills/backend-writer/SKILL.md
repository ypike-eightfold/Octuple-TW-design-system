---
name: backend-writer
description: >
  Writes backend business logic, service layer, and API route handlers based on approved API spec, database
  design, and domain doc. Use this skill when the user wants to implement backend code — business logic,
  service layer, route handlers, or any server-side rules. Always trigger after architect, db-architect, and
  api-architect produce approved artifacts. Never write backend code without approved architecture, db design,
  api spec, and build phases — check forger first. Also triggers when the user says "implement the backend",
  "write the service layer", "code the business logic", or "build the routes".
---

# Backend Writer

Implements backend service layer, business logic, and API route handlers from approved API spec and database schema.

## Context Manifest

```yaml
unit_type: module
mode: build          # forger overrides to `plan` for pre-build plan invocations
required_inputs:
  - docs/architecture/system.md
  - docs/architecture/build-phases.md
  - context.json#build_phases[current]
per_unit_inputs:
  - docs/architecture/api.md#<unit>
  - docs/architecture/database.md#<unit>
  - docs/product/stories/<story-id>.md
  - backend/app/                             # read existing code before writing (Step 0)
forbidden_paths:
  - docs/product/market-research.md
  - docs/product/user-stories.md
  - frontend/
conditional_loads:
  - path: docs/architecture/system.md#migration-concerns
    when: unit_touches(existing_model_extension)
budget_tokens: 900000
outputs:
  - backend/app/services/<module>.py
  - backend/app/api/routes/<module>.py
  - backend/app/models/<module>.py
  - backend/app/schemas/<module>.py
  # alembic revision file: generated at runtime with a timestamped filename; subagent reports the actual path in files_written (return JSON)
artifacts:
  pre_build_plan:   docs/phases/phase-<N>/plans/backend.md    # MODE: plan only
  summary:          docs/phases/phase-<N>/build/backend/<unit>.md
  return_contract:  docs/phases/phase-<N>/build/backend/<unit>.return.json
  tracker_slice:    docs/phases/phase-<N>/tracker-slices/backend-<unit>.md
```

## MODE Convention

Forger sets `MODE: plan` or `MODE: build` in the Task prompt. **The Task-prompt `MODE:` header always takes precedence over the manifest's `mode:` default** (see `_shared/manifest-format.md` §MODE Convention → Precedence).

### MODE: plan
Write ONLY the pre-build plan at `artifacts.pre_build_plan` (see manifest). No code changes. No writes to `outputs:` paths. No summary, tracker slice, or return contract.

The plan must contain these nine required section headers:
1. Header · 2. Module Inventory · 3. Endpoint Inventory · 4. Data Model Delta · 5. Business Rules · 6. Migration & Seed Plan · 7. Integration Points · 8. Out of Scope · 9. Open Questions for User

Target length ~600–800 words. This is what the user reviews at the **plan mini-gate** before any code is written.

On completion return `status: complete` with `artifact_paths.pre_build_plan` set and the other `artifact_paths.*` null.

### MODE: build
Read the approved plan from `artifacts.pre_build_plan` — forger guarantees it exists and was approved at the plan mini-gate. Then:
1. Write code to the paths declared in `outputs:` (manifest).
2. Write the per-unit summary at `artifacts.summary` (≤300 words) with these 10 headers: Unit ID + status, Files Created, Files Modified, Endpoints Shipped, Models & Columns, Business Rules Implemented, Deviations from Plan, Seed Data Added, Open Issues, Handoff Notes.
3. Write the tracker slice at `artifacts.tracker_slice`.
4. Write the JSON return contract at `artifacts.return_contract` per `_shared/return-contract.md`.

Never write code in `MODE: plan`. Never overwrite the pre-build plan in `MODE: build` — it is already approved and immutable for this phase.

## Running as a Subagent

This skill is invoked by **forger** as a Task-tool subagent, one **module** per invocation (e.g., `auth`, `users`, `goals`, `reviews`). You receive:
- A `UNIT:` identifier (the module name)
- A `LOAD THESE FILES:` list — read them yourself via Read; they are not pasted into the prompt
- A `PRIOR DECISIONS:` block with decisions from sibling backend-writer subagents in the same phase (e.g., "auth module uses Argon2id for hashing")
- A `CONTEXT BUDGET:` ceiling

When finished:
1. Write all source files (models, schemas, services, routes) to disk.
2. Register the router in `backend/app/api/main.py` and register the model in the relevant `__init__.py`.
3. Add or extend `seed_phase_<N>()` in `backend/scripts/seed.py`.
4. Generate the alembic migration: `alembic revision --autogenerate -m "phase <N>: <module>"`.
5. Write a <300-word summary at `docs/phases/phase-<N>/build/backend/<unit>.md`.
6. Write a completeness-tracker slice at `docs/phases/phase-<N>/tracker-slices/backend-<module>.md`.
7. Write the JSON return contract (schema at `.claude/skills/_shared/return-contract.md`) at the `artifacts.return_contract` path declared in the manifest.
8. Do NOT call AskUserQuestion — forger owns all user-facing gates. Use `status: blocked` in the return JSON if you need clarification.

---

## Pre-conditions

Confirm via forger:
- Domain doc approved
- User stories approved
- Architecture approved (`docs/architecture/system.md` — Sections 3 and 4: boilerplate integration notes + migration concerns)
- DB design approved (`docs/architecture/database.md` — SQLModel definitions, relationships, indexes from db-architect)
- API spec approved (`docs/architecture/api.md` — endpoint specs, RBAC matrix from api-architect)
- Build phases approved (from architect Pass 2)

---

## Step 0 — Read Before You Write (MANDATORY)

Before writing ANY code, the backend-writer MUST read and understand the existing codebase it is extending. This prevents the most common class of bugs: writing new code that conflicts with existing patterns.

### 0.1 Read and List Every File You Will Modify

For each file you plan to create or modify, read the current version first. Output a summary:

```
FILES I WILL MODIFY:
  app/models/user.py        -- Currently has: UserBase with role enum (values: USER), is_superuser field
  app/schemas/user.py       -- Currently has: UserRole enum, UserCreate, UserPublic schemas
  app/api/deps.py           -- Currently has: get_current_active_superuser using is_superuser
  app/core/db.py            -- Currently has: init_db() creates superuser with UserCreate defaults
  app/api/main.py           -- Currently has: login, users, items, utils, private routers

FILES I WILL CREATE:
  app/models/department.py  -- New model, FK from User
  app/core/rbac.py          -- New RBAC middleware
  ...
```

### 0.2 Trace All Code Paths for Modified Models

When changing a model (e.g., User), find EVERY file that imports or uses it:
- Where is it created? (init_db, seed scripts, test fixtures, route handlers)
- Where is it queried? (deps.py, service layer, other routes)
- What depends on its fields? (schemas, serializers, frontend types)

Update ALL of them, not just the model definition.

### 0.3 Read All Approved Design Artifacts

Read these files before writing any code:

1. **`docs/architecture/system.md`** — Section 3 (Boilerplate Integration Notes) and Section 4 (Migration Concerns). These flag known risks like enum changes, is_superuser bridging, and FK ordering.
2. **`docs/architecture/database.md`** — SQLModel definitions, table relationships, and index strategy from db-architect. Use these as the source of truth for model definitions — do not reinvent the schema.
3. **`docs/architecture/api.md`** — Endpoint specifications, request/response bodies, and RBAC matrix from api-architect. Use these as the source of truth for route handlers — match endpoint paths, methods, and response shapes exactly.

---

## Code Structure

All backend code is written under `backend/app/` following FastAPI conventions:

```
backend/app/
├── api/
│   ├── main.py                    # Router registration
│   ├── deps.py                    # Dependency injection (SessionDep, CurrentUser, etc.)
│   └── routes/
│       └── [module].py            # FastAPI route handlers
├── models/
│   └── [module].py                # SQLModel DB table models
├── schemas/
│   └── [module].py                # Pydantic request/response schemas
├── services/
│   └── [module].py                # Business logic
└── core/
    ├── config.py                  # Pydantic Settings
    ├── security.py                # JWT + password hashing
    └── db.py                      # Database engine + session

backend/tests/
├── api/
│   └── test_[module].py           # API route tests
└── services/
    └── test_[module].py           # Service unit tests
```

---

## Implementation Guide by Module

### 1. Review Cycle Service
The most complex module. Key business rules:

```python
# services/review_cycle.py
from uuid import UUID
from sqlmodel import Session, select
from app.models.review_cycle import ReviewCycle, ReviewParticipant, CycleStatus, ReviewType
from app.models.user import User

class ReviewCycleService:

    @staticmethod
    async def launch_cycle(session: Session, cycle_id: UUID, launched_by: UUID) -> ReviewCycle:
        """Launch a cycle: validate dates, create ReviewParticipant records for all eligible employees."""
        # 1. Validate cycle is in DRAFT status
        # 2. Validate date windows are logical (self close < manager open, etc.)
        # 3. Fetch all active employees in scope
        # 4. Create SELF review participant for each employee
        # 5. Create MANAGER review for each employee -> their manager
        # 6. If 360 in scope: create PEER nominations placeholder
        # 7. Update cycle status to ACTIVE
        # 8. Trigger notification task: notify all participants
        # 9. Log audit event
        ...

    @staticmethod
    async def check_self_assessment_deadline(session: Session, cycle_id: UUID) -> None:
        """Run as a scheduled job to auto-close self-assessment window."""
        # 1. Find cycles where self_close_at < now and status = ACTIVE
        # 2. Lock all PENDING self assessments
        # 3. Trigger manager window open notifications
        ...
```

---

### 2. Calibration Service
Core calibration logic with rating normalization:

```python
# services/calibration.py
from uuid import UUID
from sqlmodel import Session

class CalibrationService:

    @staticmethod
    async def get_rating_distribution(session: Session, scope_id: UUID, cycle_id: UUID) -> dict:
        """Get rating distribution for a team/department."""
        # 1. Fetch all submitted manager reviews in scope
        # 2. Group by rating value
        # 3. Calculate percentages
        # 4. Flag if distribution violates configured curve (e.g. >20% Exceeds)
        # 5. Return distribution + flags
        ...

    @staticmethod
    async def adjust_rating(
        session: Session,
        participant_id: UUID,
        new_rating: int,
        adjusted_by: UUID,
        reason: str,
    ) -> None:
        """Adjust a rating during calibration."""
        # 1. Verify calibration session is OPEN (not locked)
        # 2. Verify adjuster has calibration rights (MANAGER/HR_BP)
        # 3. Store previous rating in audit log
        # 4. Update rating
        # 5. Record calibration note with reason
        ...

    @staticmethod
    async def lock_session(session: Session, session_id: UUID, locked_by: UUID) -> None:
        """Lock calibration session — only HR_ADMIN can lock."""
        # 1. Only HR_ADMIN can lock
        # 2. Validate all participants have been reviewed
        # 3. Set session status to LOCKED
        # 4. Prevent further edits
        # 5. Trigger notifications to managers
        ...
```

---

### 3. Goal Alignment Service

```python
# services/goal.py
from uuid import UUID
from sqlmodel import Session
from app.models.goal import Goal, GoalLevel, GoalStatus
from app.schemas.goal import CreateGoalDto

class GoalService:

    @staticmethod
    async def create_goal(session: Session, dto: CreateGoalDto, created_by_id: UUID, role: str) -> Goal:
        """Validate goal alignment on creation."""
        # 1. If parent_goal_id provided, validate level hierarchy:
        #    COMPANY -> DEPARTMENT -> TEAM -> INDIVIDUAL
        # 2. IC can only create INDIVIDUAL goals
        # 3. MANAGER can create TEAM and INDIVIDUAL goals
        # 4. Validate due_date is within parent goal's due_date
        # 5. Set status to DRAFT for IC (pending approval), ACTIVE for manager-created
        # 6. If IC goal: trigger approval notification to manager
        ...

    @staticmethod
    async def get_goal_tree(session: Session, user_id: UUID) -> list[dict]:
        """Build goal tree for a user."""
        # 1. Fetch user's individual goals
        # 2. Traverse up to parent goals (team -> dept -> company)
        # 3. Return nested tree structure
        # 4. Include progress % at each level
        ...
```

---

### 4. PIP Workflow Service

```python
# services/pip.py
from uuid import UUID
from sqlmodel import Session
from app.models.pip import PIP, PIPStatus, PIPMilestone
from app.schemas.pip import CreatePIPDto

class PIPService:

    @staticmethod
    async def initiate_pip(session: Session, dto: CreatePIPDto, manager_id: UUID) -> PIP:
        """Initiate PIP — requires HR BP approval."""
        # 1. Validate manager is the employee's direct manager
        # 2. Create PIP in DRAFT status
        # 3. Add milestones with due dates
        # 4. Notify HR BP for review
        ...

    @staticmethod
    async def approve_pip(session: Session, pip_id: UUID, hr_bp_id: UUID) -> PIP:
        """HR BP approves a PIP."""
        # 1. Validate approver is HR_BP
        # 2. Update status to ACTIVE
        # 3. Notify employee (IC) — they must acknowledge
        # 4. Notify manager
        # 5. Log approval in audit trail
        ...

    @staticmethod
    async def record_check_in(
        session: Session, pip_id: UUID, manager_id: UUID, notes: str
    ) -> None:
        """Record a PIP check-in."""
        # 1. Validate PIP is ACTIVE
        # 2. Validate manager owns this PIP
        # 3. Record check-in with timestamp + notes
        # 4. Notify IC that check-in notes are available
        ...

    @staticmethod
    async def close_pip(
        session: Session, pip_id: UUID, outcome: str, closed_by: UUID
    ) -> PIP:
        """Close a PIP — never hard delete."""
        # 1. Requires both MANAGER and HR_BP sign-off
        # 2. Update status to COMPLETED_SUCCESS or COMPLETED_FAIL
        # 3. Archive PIP — never delete (legal requirement)
        # 4. Notify IC of outcome
        # 5. If FAIL: flag to HR_ADMIN for offboarding process
        ...
```

---

### 5. Notification Service

```python
# services/notification.py
from uuid import UUID

# All notification triggers — use Celery or ARQ for async processing
NOTIFICATION_EVENTS = {
    "CYCLE_LAUNCHED":           "Notify all participants cycle is open",
    "SELF_ASSESSMENT_DUE":      "Reminder 3 days before deadline",
    "MANAGER_REVIEW_OPEN":      "Notify managers self window closed",
    "REVIEW_SUBMITTED":         "Notify manager when IC submits self-assessment",
    "CALIBRATION_OPEN":         "Notify managers calibration session is ready",
    "PIP_CREATED":              "Notify HR BP of new PIP for approval",
    "PIP_APPROVED":             "Notify IC and manager PIP is active",
    "PIP_CHECKIN_DUE":          "Remind manager of upcoming check-in",
    "FEEDBACK_RECEIVED":        "Notify IC of new feedback",
    "GOAL_APPROVAL_REQUIRED":   "Notify manager of pending goal approval",
}

class NotificationService:

    @staticmethod
    async def queue_notification(
        event: str, recipient_ids: list[UUID], payload: dict
    ) -> None:
        """Push to Celery/ARQ queue. Worker handles email + in-app notification."""
        ...
```

---

### 6. RBAC — FastAPI Dependencies

```python
# api/deps.py
from typing import Annotated
from fastapi import Depends, HTTPException, status
from sqlmodel import Session
from app.core.security import verify_token
from app.models.user import User, Role

# Existing deps from boilerplate: SessionDep, CurrentUser, etc.
# Add role-based access control:

def require_role(*roles: Role):
    """FastAPI dependency that enforces role-based access."""
    async def _check(current_user: CurrentUser) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user
    return Depends(_check)

def scope_to_user(current_user: CurrentUser) -> dict:
    """Scope data to what the user is allowed to see."""
    match current_user.role:
        case Role.IC:
            return {"owner_id": current_user.id}
        case Role.MANAGER:
            report_ids = [r.id for r in current_user.reports]
            return {"owner_id__in": [current_user.id, *report_ids]}
        case Role.HR_BP:
            return {"department_id": current_user.department_id}
        case Role.HR_ADMIN | Role.EXECUTIVE:
            return {}  # no filter — sees all
```

---

## Implementation Order

Build modules in this sequence (each depends on the previous):

1. `auth` → RBAC dependencies
2. `users` → org hierarchy
3. `goals` → alignment logic
4. `review_cycles` → cycle orchestration
5. `assessments` → form submission
6. `feedback` → 360 flow
7. `calibration` → rating normalization
8. `pip` → approval workflow
9. `notifications` → async tasks
10. `analytics` → read-only aggregations

---

## Security Rules (MANDATORY)

Every endpoint and service method MUST follow these rules. ~60% of all SaaS vulnerabilities are some form of missing or broken authorization. These are not suggestions — violating them produces exploitable code.

### S1. Every Endpoint: Authentication AND Authorization

`@login_required` or `CurrentUser` dependency verifies identity. It does NOT verify permission. Every endpoint MUST also check the user's role and relationship to the resource.

```python
# WRONG — authentication only
@router.get("/settings/")
def get_settings(current_user: CurrentUser):
    return get_all_settings()

# RIGHT — authentication + authorization
@router.get("/settings/")
def get_settings(current_user: CurrentUser):
    if current_user.role not in (Role.HR_ADMIN, Role.EXECUTIVE):
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    return get_all_settings()
```

Use `require_role()` dependencies (from `api/deps.py`) on the router or individual endpoints. Centralize authorization so endpoints cannot forget it.

### S2. Scope All Queries to Tenant / Owner

Never load a resource by ID alone. Always include the tenant or ownership filter in the query. Return 404 (not 403) for cross-tenant misses — do not leak existence.

```python
# WRONG — any authenticated user can access any resource
resource = session.get(Resource, resource_id)

# RIGHT — scoped to the user's org
resource = session.exec(
    select(Resource).where(
        Resource.id == resource_id,
        Resource.org_id == current_user.org_id,
    )
).first()
if not resource:
    raise HTTPException(status_code=404)
```

### S3. Response Filtering — Never Return Too Much Data

API responses MUST be filtered by audience. Never serialize the full ORM model. Use role-aware Pydantic response schemas.

- Never return `hashed_password`, `api_key`, `secret_key`, or internal IDs to non-admin users
- Conditionally include PII (email, phone, name) based on caller's role/permission
- Admin endpoints may return more fields; public endpoints return the minimum

```python
# WRONG — dumps everything
return user.model_dump()

# RIGHT — audience-specific schema
class UserPublic(SQLModel):
    id: uuid.UUID
    full_name: str
    role: str
    # No email, no hashed_password, no internal fields
```

### S4. Server-Side Input Validation Is the Security Boundary

Frontend validation is UX convenience. The API is the security boundary. Every field accepted by an endpoint MUST be validated server-side:

- String length limits (`max_length` in Pydantic schemas)
- Enum values validated against allowed set
- State machine transitions checked server-side (e.g., cycle status can only go DRAFT → ACTIVE)
- Never trust client-side feature flags or permission payloads

### S5. No SQL String Interpolation — Ever

All queries go through SQLModel/SQLAlchemy ORM. If raw SQL is needed (analytics aggregations), use parameterized queries only.

```python
# FORBIDDEN — SQL injection
query = f"SELECT * FROM users WHERE email = '{email}'"
query = "SELECT * FROM users WHERE name = '%s'" % name

# REQUIRED — parameterized
stmt = select(User).where(User.email == email)
# Or for raw SQL:
session.exec(text("SELECT * FROM users WHERE email = :email"), {"email": email})
```

For sort columns (which cannot be parameterized), use an allowlist:

```python
ALLOWED_SORT_COLUMNS = {"created_at", "name", "email", "status"}
if sort_by not in ALLOWED_SORT_COLUMNS:
    raise HTTPException(status_code=400, detail="Invalid sort column")
```

### S6. Sanitize User Input That Will Be Rendered as HTML

Any free-text field that crosses a trust boundary (user-submitted content rendered to other users) MUST be sanitized server-side before storage. Use `bleach` or `lxml.html.clean.Cleaner`.

Fields to sanitize: descriptions, bios, comments, feedback text, names, titles, custom fields.

```python
import bleach

def sanitize_input(text: str) -> str:
    return bleach.clean(text, tags=[], attributes={}, strip=True)
```

### S7. SSRF Prevention for Server-Side URL Fetches

If any endpoint fetches a URL provided by the user (avatar URL, import URL, webhook URL, link preview), validate the URL before fetching:

```python
import ipaddress, socket
from urllib.parse import urlparse

BLOCKED_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("169.254.0.0/16"),  # AWS metadata
]

def validate_url_for_fetch(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise ValueError("Only http/https allowed")
    ip = ipaddress.ip_address(socket.gethostbyname(parsed.hostname))
    for network in BLOCKED_NETWORKS:
        if ip in network:
            raise ValueError("Internal URLs not allowed")
```

Do not follow redirects blindly — re-validate after each redirect.

### S8. No Dynamic Code Execution

Never use `eval()`, `exec()`, `pickle.loads()`, or `subprocess.run(..., shell=True)` with any user-controlled input. For template rendering, never let users control the template source — only pass user data as context variables.

### S9. No Hardcoded Secrets

All secrets (API keys, database passwords, JWT signing keys) MUST come from environment variables or a secrets manager. Never hardcode them in source code. Never set `verify=False` on TLS connections.

### S10. Session and Token Hygiene

- Invalidate all session/JWT tokens on password change
- Bind verification to the specific resource (`verified_email == requested_email`, not just `is_verified`)
- Rate-limit authentication endpoints by identity (email), not by cookie or IP alone
- Use UUIDs for external-facing resource identifiers — never expose auto-increment IDs

---

## Anti-Stub Protocol (MANDATORY -- HARD GATE)

Before declaring ANY service module complete, run the STUB SCAN. This is a HARD GATE -- handoff is blocked until all stubs are eliminated.

### What Counts as a Stub

Any of the following in a service method body is a STUB:
- `pass` as the only statement
- `...` (Ellipsis) as the only statement  
- `return []`, `return {}`, `return None`, `return 0`, or any hardcoded literal return that does not come from a database query
- `# TODO`, `# FIXME`, `# PLACEHOLDER`, `# IMPLEMENT`
- A method body that is entirely comments (numbered pseudocode steps with no real code)
- `raise NotImplementedError`
- A route handler that returns hardcoded status strings (e.g., `self_assessment_status="NOT_STARTED"`) instead of querying the database

### Mandatory Stub Scan (run after EVERY service file)

```bash
# Scan for stub patterns in all service files (use -E for portable alternation — BSD/macOS grep treats \| as literal)
grep -rEn "^\s*pass$|^\s*\.\.\.\s*$|raise NotImplementedError|# TODO|# FIXME|# PLACEHOLDER" backend/app/services/ backend/app/api/routes/
# MUST return empty. Any result = BLOCKED.

# Scan for hardcoded sentinel-status return values (review each hit manually).
# Note: `return []` / `return {}` matches require manual classification — legitimate
# when derived from a DB query that returned no rows; stub only if literally the
# method's sole statement. A static pattern cannot distinguish these cases.
grep -rEn 'return \[\]|return \{\}|="NOT_STARTED"|="PENDING"|="NOT_SHARED"' backend/app/services/ backend/app/api/routes/
# Review each result. If the return value is not derived from a DB query or computation, it is a stub.
```

### Method Completeness Proof

For EVERY service method you write, output a COMPLETENESS LINE in your delivery summary:

```
METHOD COMPLETENESS -- [module].py
  get_direct_reports()       -> REAL (queries Employee table, joins SelfAssessment/PeerFeedback/ManagerAssessment for status)
  launch_cycle()             -> REAL (validates DRAFT status, queries participants, transitions to ACTIVE)
  get_cycle_dashboard()      -> REAL (aggregates from CycleParticipant, SelfAssessment, ManagerAssessment)
  list_reminders()           -> STUB (returns empty list) <-- BLOCKED
```

If ANY method is marked STUB, you MUST implement it before handoff. The pseudocode comments in this skill file are DESIGN GUIDANCE, not implementation. The final code must replace every comment with working logic.

### Endpoint Data Verification

After implementing each route module, hit every endpoint at least once with seeded data:

```bash
# For each endpoint, verify it returns REAL data from the database:
TOKEN=$(curl -s -X POST .../login/access-token -d "username=...&password=..." | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

RESULT=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/v1/[endpoint])
# Verify: response is not [], not {}, not null, and contains data matching seeded records
```

Output the verification table:

```
ENDPOINT VERIFICATION -- Phase N
| Endpoint                          | Method | Status | Data Content              | Verdict |
|-----------------------------------|--------|--------|---------------------------|---------|
| /resources/                       | GET    | 200    | 3+ records with real data | REAL    |
| /resources/{id}/children          | GET    | 200    | N records with statuses from DB | REAL |
| /resources/{id}/dashboard         | GET    | 200    | stats aggregated from DB  | REAL    |
```

Any endpoint returning empty data when seed data exists, or returning hardcoded values = STUB = BLOCKED.

---

## Code Quality Rules

- All service methods must be **async** — use `async def` throughout
- All DB queries go through **SQLModel** — no raw SQL unless for analytics aggregations
- All writes must create an **audit log entry**
- All external calls (HRIS sync, email) must be **wrapped in try/except**
- **Never hard delete** any performance data — use `is_active: bool = False` or `archived_at: datetime | None`
- **mypy strict mode** enabled — proper type hints on all functions
- **ruff** for linting — no print statements, consistent imports

---

## Migration Rules (B3, B5, B6)

### After Running `alembic revision --autogenerate`:

1. **READ the generated migration file.** Do not blindly trust autogenerate.
2. **Check for enum changes.** Alembic autogenerate does NOT detect changes to PostgreSQL enum values. If you changed a `str, Enum` class (e.g., added new role values), you must MANUALLY add `ALTER TYPE` SQL to the migration:
   ```python
   # Autogenerate misses this -- add manually:
   op.execute('ALTER TABLE "user" ALTER COLUMN role DROP DEFAULT')
   op.execute("ALTER TYPE userrole RENAME TO userrole_old")
   op.execute("CREATE TYPE userrole AS ENUM ('EMPLOYEE', 'MANAGER', ...)")
   op.execute('ALTER TABLE "user" ALTER COLUMN role TYPE userrole USING ...')
   op.execute("DROP TYPE userrole_old")
   ```
3. **Check FK ordering.** If migration creates table A with a FK to table B, table B must be created first.
4. **Check default values.** If changing a column's default, the old default must be dropped before the type change.

### Before Declaring Backend Done:

The backend-writer's final step for each phase MUST be:

1. **Run migrations** against a real DB (not just generate them):
   ```bash
   alembic upgrade head
   ```
2. **Start the server** and hit the health check:
   ```bash
   fastapi run app/main.py --port 8000 &
   curl http://localhost:8000/api/v1/utils/health-check/
   ```
3. **Try one authenticated endpoint** to verify auth + RBAC works:
   ```bash
   TOKEN=$(curl -s -X POST .../login/access-token -d "username=...&password=...")
   curl -H "Authorization: Bearer $TOKEN" .../api/v1/users/
   ```

If any of these fail, fix the code before handing off. Do not hand off code that hasn't been runtime-verified.

---

## FastAPI Gotchas Checklist (B4)

Before handing off, verify none of these apply:

- [ ] **Trailing slash 307 redirects**: Routes defined with `/users/` will 307-redirect requests to `/users`, stripping the Authorization header. Either set `redirect_slashes=False` on FastAPI or ensure all clients use trailing slashes.
- [ ] **Alembic enum blindness**: `alembic revision --autogenerate` does not detect enum value changes. Always manually check.
- [ ] **init_db consistency**: If you changed the User model (new fields, new enum values), update `init_db()` in `app/core/db.py` to match. The superuser it creates must use the new schema.
- [ ] **is_superuser bridging**: If you added role-based RBAC, make sure `is_superuser=True` users bypass role checks. The boilerplate uses `is_superuser` for admin access.
- [ ] **Model registration**: New models must be imported in `app/models/__init__.py` for Alembic to detect them.
- [ ] **Router registration**: New route files must be added to `app/api/main.py` with `include_router()`.
- [ ] **Session commit ordering**: When creating records with FKs to other new records, use `session.flush()` between them to populate IDs before `session.commit()`.

## Security Checklist (MANDATORY — run before every handoff)

Before declaring any backend work complete, verify every item. These map to the 10 security rules above.

### Authorization (S1, S2)
- [ ] Every route handler has a `CurrentUser` dependency or router-level auth
- [ ] After loading a resource, the code verifies the user's permission to access it
- [ ] `org_id` / `tenant_id` is validated for cross-tenant isolation on every query
- [ ] Admin-only actions are checked with role/permission verification
- [ ] For object-level operations: code verifies ownership or access rights

### Input Handling (S4, S5, S6, S8)
- [ ] All SQL queries are parameterized (no f-strings, no `.format()`, no `%` with user input)
- [ ] User-controlled strings are sanitized before storage if they will be rendered as HTML
- [ ] Server-side validation present for every field accepted by every endpoint
- [ ] No `eval()`, `exec()`, `pickle.loads()`, or `shell=True` with user-controlled input
- [ ] Sort/order-by columns validated against an allowlist

### Output Handling (S3)
- [ ] API responses use audience-specific Pydantic schemas (not full model dumps)
- [ ] No `hashed_password`, `api_key`, `secret_key` in any response
- [ ] PII (email, phone, name) conditionally included based on caller's permissions
- [ ] External-facing IDs are UUIDs, not auto-increment integers

### Server-Side Requests (S7)
- [ ] Any server-side HTTP fetch of user-provided URLs validates scheme, host, and IP range
- [ ] Redirects are disabled or re-validated after following

### Secrets and Sessions (S9, S10)
- [ ] No hardcoded credentials, API keys, or secret keys in source code
- [ ] No `verify=False` on any TLS connection
- [ ] Password change invalidates existing sessions/tokens
- [ ] Authentication endpoints are rate-limited by identity, not cookie/IP

---

## Seed Script (Per Phase)

Each phase MUST produce a `seed_phase_N()` function in `backend/scripts/seed.py`. The seed script is a first-class deliverable, not an afterthought.

### Template

The boilerplate provides `boilerplate/backend/scripts/seed.py` with a ready-made framework: `PHASE_SEEDERS` dict, `_get_or_create()` helper, composable `seed()` function, and CLI with `--phase` argument. At project start this is copied to `backend/scripts/seed.py`. **Extend the existing template** -- add your `seed_phase_N()` function and register it in `PHASE_SEEDERS`. Do NOT rewrite the framework or create a separate seed file. The same applies to `backend/scripts/e2e_smoke.py` (extend `PHASE_RUNNERS`, don't rewrite).

### Rules

1. **Match prototype data** -- Use the same names, departments, and sample data from the React mock screens in `frontend/src/`. If the prototype shows "Sarah Chen" as an engineer, the seed creates Sarah Chen as an engineer.
2. **Idempotent** -- Safe to run multiple times. Check-before-create pattern: query for existing record by unique field (email, name), skip if found.
3. **Composable** -- Phase 2 seed calls Phase 1 seed first. Each phase function can assume prior phases' data exists.
4. **Cover all roles** -- Create at least one user per RBAC role (EMPLOYEE, MANAGER, HRBP, HR_ADMIN, EXECUTIVE) so smoke tests can authenticate as each.
5. **Exercise every new model** -- If this phase adds ReviewCycle and Assessment models, the seed must create instances of both with realistic relationships.
6. **Print summary** -- Output what was created vs. skipped so the verifier can confirm.
7. **Call from `__main__`** -- Update the `if __name__ == "__main__"` block to call `seed_phase_N()`.

### Pattern

```python
def seed_phase_2() -> None:
    """Seed Phase 2: Review cycles + assessments."""
    with Session(engine) as session:
        existing = session.exec(
            select(ReviewCycle).where(ReviewCycle.name == "Q1 2026 Review")
        ).first()
        if existing:
            print("Phase 2: already seeded (skipped)")  # noqa: T201
            return
        # Create cycle, participants, assessments...
        session.commit()
        print(f"Phase 2: created cycle with {n} participants")  # noqa: T201
```

---

## Cross-Cutting Rules

1. **Incremental delivery** -- Present work unit by unit inline in the conversation. Get user feedback before proceeding to the next unit. Don't batch everything and dump file paths.
2. **Research awareness** -- Check for the market research brief (`docs/product/market-research.md`) before starting. Use competitor insights and UX patterns from it to inform your output.
3. **Enterprise depth** -- All outputs should be spec-level, not summary-level. Think about what an enterprise customer at a 5,000-person company would need.
4. **No emoji in production artifacts** -- Use text labels and SVG icons, not emoji, in any artifacts that will be used downstream.

---

## After Writing Backend Code

1. Present a module-by-module summary of what was implemented
2. Highlight any business rule decisions that assumed defaults
3. **Verify seed script creates correct data**: run `python scripts/seed.py` and confirm output
4. Hand off to **forger** for approval
5. After approval, update **forger**
6. Flag any items for **test-writer** to cover
