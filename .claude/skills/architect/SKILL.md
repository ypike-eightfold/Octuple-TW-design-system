---
name: architect
description: >
  Generates the system architecture foundation — tech stack, module breakdown, boilerplate integration notes, and
  migration concerns — based on approved user stories, screen designs, and domain doc. After db-architect and
  api-architect produce their artifacts, the architect is re-invoked to produce the dependency-ordered build phase
  plan. Use this skill when the user wants to design the system, choose a tech stack, define the module structure,
  or plan build phases. Always trigger after screen designs are approved. Never produce architecture without approved
  stories and screen designs — always check forger first. Also triggers when the user says "design the system",
  "what's the tech stack", "define the modules", or "plan the build phases".
---

# Architect

## Context Manifest

```yaml
unit_type: one_shot
required_inputs:
  - docs/product/user-stories.md
  - docs/product/personas.md
  - docs/product/domain-doc.md
  - docs/product/screen-inventory.md
  - frontend/src/                                   # react mock screens
  - docs/architecture/database.md                   # Pass 2 only
  - docs/architecture/api.md                        # Pass 2 only
forbidden_paths:
  - docs/product/market-research.md
budget_tokens: 400000
artifacts:
  # Pass 1 writes docs/architecture/system.md (tech stack, modules, boilerplate notes)
  # Pass 2 writes docs/architecture/build-phases.md (dependency-ordered phase plan)
  summary:            docs/architecture/system.md       # Pass 1 output
  build_phases_plan:  docs/architecture/build-phases.md # Pass 2 output — forger lints only after Pass 2 runs
outputs:
  - docs/architecture/system.md
  - docs/architecture/build-phases.md
```

Inline skill, runs in two passes. Pass 1 is invoked before db-architect / api-architect; Pass 2 is invoked after their outputs are approved.

Produces the system architecture foundation and, after database and API design are complete, the build phase plan. This skill runs in two passes orchestrated by the forger, inline in the forger parent thread.

**Pass 1** (after screen designs are approved): Tech stack, module breakdown, boilerplate integration notes, migration concerns.

**Pass 2** (after db-design and api-spec are approved): Dependency-ordered build phase plan referencing actual models, endpoints, and screens.

---

## Pre-conditions

### Pass 1

Confirm via forger:
- Domain doc approved
- MVP user stories approved
- Screen designs approved (React mock screens from design-tw-ux-designer in `frontend/src/`)

Theme system readiness is verified by `forger` during project init (step 6 of Project Creation) — architect does not re-check.

### Pass 2

Confirm via forger:
- All Pass 1 pre-conditions met and Pass 1 approved
- DB design approved (`docs/architecture/database.md` from db-architect)
- API spec approved (`docs/architecture/api.md` from api-architect)

If any are missing, stop and flag which upstream artifact needs approval first.

---

## Pass 1 Output: Four Sections

Produce all four in one pass, then hand to forger for approval.

---

### Section 1 — Tech Stack Recommendation

Present a recommended stack with rationale, then ask for confirmation before proceeding to modules.

#### Default Recommended Stack (Enterprise SaaS)

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Vite + React 19 + TypeScript | Fast dev experience, strong ecosystem, SPA suitable for dashboards |
| Routing | TanStack Router (file-based) | Type-safe routing, code splitting, file-based convention |
| UI Library | Shadcn/Radix UI + Tailwind CSS 4 | Accessible components, utility-first styling, highly customisable |
| State | TanStack Query + Zustand | Server state caching + lightweight client state |
| Backend | FastAPI (Python 3.10+) | High-performance async API, auto-generated OpenAPI docs |
| ORM | SQLModel / SQLAlchemy | Type-safe models, powerful query builder, mature ecosystem |
| Database | PostgreSQL | Relational data, strong for reporting queries, enterprise-proven |
| Migrations | Alembic | Reliable schema versioning, auto-generation from models |
| Auth | JWT (HS256) via PyJWT + Argon2 (pwdlib) | Stateless auth, secure password hashing |
| Background jobs | Celery + Redis (or ARQ for async) | Task queue for notifications, scheduled jobs |
| File storage | S3-compatible | Document attachments |
| Search | PostgreSQL full-text or Elasticsearch | Search, entity lookup |
| Hosting | AWS / GCP / Azure (user's preference) | Enterprise compliance |
| CI/CD | GitHub Actions | Standard, well-supported |

*Adjust based on any constraints captured in domain doc.*

---

### Section 2 — Module Breakdown

Define the major backend modules. Derive module names from the screen designs and user stories — do not assume a fixed set of modules.

All architecture artifacts are written to `docs/architecture/system.md`. Code is structured under `backend/app/` following FastAPI conventions.

For each module discovered in the screens/stories, document:
- **Module name** — named after the primary resource
- **Route file** — `backend/app/api/routes/<module>.py`
- **Model file** — `backend/app/models/<module>.py`
- **Service file** — `backend/app/services/<module>.py`
- **Schema file** — `backend/app/schemas/<module>.py`
- **Purpose** — one-line description derived from screens

Present the module list as a directory tree:

```
backend/app/
├── api/
│   ├── main.py                # Router registration
│   ├── deps.py                # Dependency injection (SessionDep, CurrentUser, etc.)
│   └── routes/
│       ├── auth.py            # [derived from screens]
│       ├── <module_a>.py      # [derived from screens]
│       ├── <module_b>.py      # [derived from screens]
│       └── ...
├── models/
│   ├── base.py
│   ├── <module_a>.py
│   └── ...
├── schemas/
│   ├── <module_a>.py
│   └── ...
├── services/
│   ├── <module_a>.py
│   └── ...
├── core/
│   ├── config.py              # Pydantic Settings
│   ├── security.py            # JWT + password hashing
│   └── db.py                  # Database engine + session
├── utils/
└── alembic/
    └── versions/
```

---

### Section 3 — Boilerplate Integration Notes

This project extends an existing boilerplate. The architect MUST document what already exists and where new code interacts with it, so downstream skills (db-architect, api-architect, backend-writer) don't introduce conflicts.

**Before writing this section, read the actual boilerplate files:**
- `backend/app/models/user.py` — current User model fields and enums
- `backend/app/schemas/user.py` — current schemas
- `backend/app/api/deps.py` — dependency injection, auth dependencies
- `backend/app/core/db.py` — init_db(), engine setup
- `backend/app/core/security.py` — JWT token generation, password hashing
- `backend/app/api/main.py` — current router registrations
- `backend/app/core/config.py` — Pydantic Settings fields

For each module, note: what exists in the boilerplate, what is being extended vs created new, and integration risks.

Key areas to always document:
- **User Model**: current fields, current enum values, `init_db()` superuser creation, `is_superuser` field behavior
- **Auth/RBAC**: existing `get_current_active_superuser`, `OAuth2PasswordBearer` tokenUrl, how new role-based RBAC bridges with `is_superuser`
- **Migrations**: existing Alembic history, enum changes that autogenerate misses, FK ordering for new tables
- **API Router**: how new routes register in `app/api/main.py`

---

### Section 4 — Migration Concerns

For EACH model that extends an existing boilerplate model, document what the current DB state looks like and what the migration must handle. Flag:
- Enum changes (Alembic autogenerate misses these — require manual migration steps)
- New FKs to new tables (ordering: referenced table must be created before the FK)
- Default value changes on existing columns
- Column renames or type changes

---

## Interactive Delivery (Pass 1)

Use `AskUserQuestion` for all architecture decisions:

**Tech stack confirmation:**
- Single-select: "Approve recommended stack" / "Customize stack" / "Use a different stack entirely"
- If "Customize": follow up with per-layer questions

**Module scope confirmation** (after presenting module breakdown):
- Multi-select: list each module, user confirms which are in scope

**Boilerplate + migration review:**
- Single-select: "Approve integration notes" / "Request changes" / "Need to discuss specific concerns"

Never ask the user to "confirm" by typing — always use clickable options.

---

## After Pass 1

Write the architecture document to `docs/architecture/system.md` containing Sections 1-4.

1. Show **Section 1** (tech stack) first and ask for quick confirmation
2. Then show **Section 2** (modules)
3. Then show **Section 3** (boilerplate notes) and **Section 4** (migration concerns) together
4. Write `docs/architecture/system.md` with all four sections
5. Hand off to **forger** for approval gate
6. After approval, forger proceeds to **db-architect**, then **api-architect**

---

## Pass 2 Output: Build Phase Plan

After db-design (`docs/architecture/database.md`) and api-spec (`docs/architecture/api.md`) are both approved, the forger re-invokes the architect for Pass 2.

### Inputs for Pass 2

Read these approved artifacts:
- `docs/architecture/system.md` — tech stack, modules (from Pass 1)
- `docs/architecture/database.md` — table inventory, SQLModel definitions, relationships
- `docs/architecture/api.md` — endpoint specs per module, RBAC matrix
- `docs/product/user-stories.md` — MVP stories
- Screen designs in `frontend/src/` — screen inventory

### Phase Design Rules

1. **Dependency order** — a phase can only reference data models and APIs from its own phase or earlier phases
2. **End-to-end slices** — each phase should produce something demoable (a screen that works with real data)
3. **Foundation first** — auth, user management, and base config must be in Phase 1
4. **3-5 stories per phase** — enough to be meaningful, small enough to verify
5. **Cross-cutting setup** — DB migrations, base models, shared middleware go in Phase 1

### Phase Plan Format

For each phase, specify:

```markdown
### Phase N: [Name]
**Stories:** [List of story IDs]
**DB Models:** [Specific SQLModel classes from db-design.md]
**API Endpoints:** [Specific endpoint paths from api-spec.md]
**Frontend Screens:** [Specific screen/route names, by persona]
**Depends on:** [Previous phase number, or "none" for Phase 1]
**Verification focus:** [What the phase-verifier should specifically check]
```

### Example Phase Structure

For a system with ~15 MVP stories, expect 4-5 phases:

| Phase | Focus | Why This Order |
|---|---|---|
| 1 | Foundation | Auth + user management — everything else depends on users existing |
| 2 | Core workflow | The primary product loop — uses foundation models |
| 3 | Supporting features | Features that feed into the core workflow |
| 4 | Manager/admin flow | Needs data from phases 2-3 |
| 5 | Enterprise features | Aggregates data from all prior phases |

*Actual phase names and groupings are derived from the project's stories and modules — not from a template.*

---

## Interactive Delivery (Pass 2)

**Build phase plan review:**
- Present phases one at a time with stories, models, endpoints, and screens listed
- Single-select per phase: "Approve phase" / "Adjust stories/scope" / "Reorder"
- After all phases confirmed: "Approve full phase plan" / "Revisit a specific phase"

---

## After Pass 2

1. Write the build phase plan to **`docs/architecture/build-phases.md`** as a new standalone file (canonical per `.claude/skills/_shared/artifact-taxonomy.md`). Do **not** append to `system.md` — Pass 1 and Pass 2 produce two separate artifacts.
2. Populate `context.json.build_phases[]` with the **minimal projection** — one entry per phase with `{phase, name, stories[], db_models[], api_endpoints[], frontend_screens[], status: "pending", verified_at: null}`. Names/ids only; descriptions and specs live in the markdown above.
3. Set `current_build_phase` to 0 (index of first phase) in `context.json`.
4. Hand off to **forger** for the `approvals.build_phases` gate.
5. After approval, forger begins the **phased build loop** — Phase 1 backend-writer **plan-gate** first (MODE: plan), then build, then frontend plan-gate, then frontend build.

---

## Cross-Cutting Rules

1. **Domain-agnostic** — All module names, model references, and endpoint references must be derived from the project's screen designs and user stories. Never hardcode domain-specific entities (e.g., "Goal", "ReviewCycle") in this skill.
2. **Incremental delivery** — Present work unit by unit inline in the conversation. Get user feedback before proceeding to the next unit. Don't batch everything and dump file paths.
3. **Research awareness** — Check for the market research brief (`docs/product/market-research.md`) before starting. Use competitor insights and UX patterns from it to inform your output.
4. **Enterprise depth** — All outputs should be spec-level, not summary-level. Think about what an enterprise customer at a 5,000-person company would need.
5. **No emoji in production artifacts** — Use text labels and SVG icons, not emoji, in any artifacts that will be used downstream.
6. **Trailing slashes** — All route paths use trailing slashes (`/users/` not `/users`). Set `redirect_slashes=False` on the FastAPI app to avoid 307 redirects that strip auth headers.
