---
name: api-architect
description: >
  Designs a complete REST API specification from screen designs, user stories, and approved database schema.
  Analyses each page of the React prototype page by page, maps every UI interaction to a REST endpoint, and
  produces a structured API spec in docs/architecture/api.md with per-module sections, per-page subsections, and
  per-endpoint input/output/method definitions with sample data. Use this skill when the user wants to define
  the API, spec out endpoints, map screens to REST calls, or produce an API contract before backend implementation.
  Always trigger after screen designs, user stories, and db-design are approved. Never produce an API spec
  without all three artifacts — check forger first.
---

# API Designer

## Context Manifest

```yaml
unit_type: one_shot
required_inputs:
  - docs/product/user-stories.md
  - docs/product/domain-doc.md
  - docs/architecture/database.md
  - docs/architecture/system.md
  - docs/product/screen-inventory.md
  - frontend/src/
forbidden_paths:
  - docs/product/market-research.md
budget_tokens: 400000
artifacts:
  summary:          docs/architecture/api.md
outputs:
  - docs/architecture/api.md
```

Inline skill. Maps every page in `frontend/src/routes/` to a REST endpoint.

Produces a production-ready REST API specification by walking the React screen prototype page by page, understanding what each screen does, and designing the minimum correct set of endpoints to power it as a React SPA. All endpoints follow REST best practices and are prefixed with `/api/v1/`.

This skill is domain-agnostic. Every endpoint, field name, and resource is derived from what is visible in the screens and stated in the user stories — never from assumptions or domain knowledge.

This skill runs inline in the forger parent thread (not as a Task subagent) — the output is a single spec doc and the skill may ask clarifying questions mid-run.

---

## Pre-conditions

Before proceeding, verify:
- Approved screen designs exist (React mock screens in `frontend/src/` from design-tw-ux-designer)
- Approved user stories exist (`docs/product/user-stories.md`)
- Domain doc exists (`docs/product/domain-doc.md`)
- Approved database design exists (`docs/architecture/database.md` from db-architect)
- Approved architecture exists (`docs/architecture/system.md` — tech stack and modules from architect Pass 1)

If any are missing, stop and tell the user which input is needed first.

### Using the Approved Database Schema

Before designing endpoints, read `docs/architecture/database.md` to understand:
- **Table/model names** — use these as resource names in endpoint paths (e.g., if the model is `ReviewCycle`, the resource path is `/review-cycles`)
- **Relationships** — understand which entities are related and how, to design nested vs flat endpoints
- **Enums and status fields** — use the exact enum values from the schema in request/response bodies
- **JSON columns** — non-queryable data stored as JSON should be passed through as-is in responses

Align response body field names with the SQLModel column names from `docs/architecture/database.md` (snake_case). This prevents translation bugs between API and database layers.

---

## React SPA Design Principle

The frontend is a React Single Page Application. This has direct consequences for API design:

- **Page load = one or more parallel fetches.** When a route renders, it fires all data fetches it needs simultaneously. Design endpoints to return everything a page needs in one call — avoid multi-hop fetches for a single screen.
- **No server-side rendering.** All data comes from JSON APIs. There are no HTML-rendering endpoints.
- **Client-side routing.** Navigation between pages does not reload the page. The API only handles data, not navigation.
- **Optimistic mutations.** Write endpoints return the updated resource immediately so the client can update the UI without a follow-up GET.
- **Cursor/keyset pagination.** All list endpoints support pagination via `?cursor=<opaque_token>&limit=<n>` (default 20, max 100). Do not use offset pagination — it breaks under concurrent inserts.

---

## Delivery Order

Work in five sequential phases. Present each phase in chat, get confirmation via `AskUserQuestion`, then proceed to the next.

---

## Phase 1 — Screen Inventory

### Step 1a: Parse the prototype

Read the React mock screens in `frontend/src/`. Identify every distinct page or view in the prototype. A "page" is any screen that:
- Has its own URL/route
- Displays a meaningfully different set of data
- Is accessible via navigation

Do not count modals, drawers, or inline forms as separate pages — they belong to the page that contains them and are covered under that page's endpoints.

Present the screen inventory as a table:

| Page ID | Page name | Persona(s) who see it | Purpose in one line |
|---|---|---|---|

### Step 1b: Module grouping

Group pages into modules. A module is a set of pages that share a primary resource (e.g., all goal-related pages form the Goals module). Name each module after the primary resource, not after a feature area.

For each module, list:
- Module name
- Pages it contains (by Page ID)
- Primary resource (the DB table or domain entity it revolves around)

**Use AskUserQuestion** to confirm the screen inventory and module grouping before proceeding.

---

## Phase 2 — Page-by-Page Endpoint Discovery

For each page, in module order:

### Per-page analysis

1. **Identify every data element on the page.** List every field, table column, counter, badge, or chart the page renders. This drives the GET endpoint response shape.

2. **Identify every user action on the page.** List every button, form, toggle, drag-drop, or inline edit. Each distinct write action becomes a POST/PUT/PATCH/DELETE endpoint (or part of one if they share the same resource mutation).

3. **Identify filters, search, and sorting.** Every filter panel, search bar, or sort control becomes a query parameter on the list endpoint for that page.

4. **Identify modals and drawers.** Their data requirements roll up into the parent page's endpoints. If a modal needs additional data not on the parent page (e.g., a user-picker that fetches all users), add a secondary GET endpoint for that data.

5. **Apply the SPA rule.** If a page needs multiple independent data sets (e.g., a dashboard showing both goals and feedback), design separate focused endpoints for each data set rather than one large endpoint. They will be fetched in parallel by the client.

Present a summary per page before moving to endpoint specification:

```
Page: [Page name] (Page ID)
Module: [Module name]
Data on page: [bullet list of data elements]
User actions: [bullet list of actions]
Filters/sort: [list or "none"]
Endpoints needed: [count]
```

**Use AskUserQuestion** after every module to confirm before specifying endpoints for the next module.

---

## Phase 3 — Endpoint Specification

For each confirmed module, produce the full endpoint specification.

### Endpoint format

Every endpoint is documented in this exact structure:

```
#### [METHOD] [path]

**Purpose:** [one sentence — what this endpoint does and why]
**Auth:** Required. Roles: [comma-separated list, or "all authenticated users"]
**Scope:** [what data the caller can see — e.g., "IC sees own data only; Manager sees own + direct reports"]

**Path parameters:**
| Param | Type | Description |
|---|---|---|
| id | UUID | The resource identifier |

**Query parameters (GET only):**
| Param | Type | Required | Default | Description |
|---|---|---|---|---|
| cursor | string | No | — | Opaque pagination cursor |
| limit | integer | No | 20 | Max records to return (max 100) |
| status | string | No | — | Filter by status |

**Request body (POST/PUT/PATCH only):**
```json
{
  "field_name": "value",
  "another_field": 123
}
```

**Response body:**
```json
{
  "data": { ... },
  "meta": { "cursor": "...", "has_more": true }
}
```

**Errors:**
| Code | Condition |
|---|---|
| 400 | Invalid input — [specific reason] |
| 403 | Caller does not have required role |
| 404 | Resource not found or not visible to caller |
| 409 | [Conflict condition, e.g. already submitted] |
```

### REST rules to apply for every endpoint

1. **Resource nouns, not verbs** — `/goals`, not `/getGoals` or `/goalsList`.
2. **HTTP methods carry semantic meaning:**
   - `GET` — read, never mutates state
   - `POST` — create a new resource
   - `PUT` — full replacement of a resource
   - `PATCH` — partial update or state transition (e.g., submit, approve, lock)
   - `DELETE` — soft-delete (never hard delete)
3. **State transitions use PATCH with a sub-resource** — `PATCH /cycles/:id/launch`, not `POST /launchCycle`.
4. **Nested resources only one level deep** — `/cycles/:id/participants` is fine; `/cycles/:id/participants/:pid/responses/:rid` is not. Flatten deep nesting.
5. **List endpoints always paginate** — No endpoint returns an unbounded list.
6. **Consistent envelope:**
   - Single resource: `{ "data": { ... } }`
   - Collection: `{ "data": [ ... ], "meta": { "cursor": "...", "has_more": true, "total": 120 } }`
   - Mutation response: return the updated resource in `{ "data": { ... } }`
7. **Idempotent PUTs** — Calling PUT twice with the same body produces the same result and no error.
8. **Idempotent DELETEs** — Deleting an already-deleted resource returns 204, not 404.
9. **No action verbs in paths except for non-CRUD state transitions** — and then only as a sub-resource on the affected entity.
10. **Error responses** always include `{ "error": { "code": "SNAKE_CASE_CODE", "message": "Human readable" } }`.

### Naming conventions

| Convention | Rule |
|---|---|
| Path segments | lowercase, hyphenated — `/review-cycles`, not `/reviewCycles` |
| Query params | snake_case — `?start_date=`, `?cycle_id=` |
| JSON body fields | snake_case — `"assigned_to"`, not `"assignedTo"` |
| UUID fields | always suffix with `_id` — `"owner_id"`, `"cycle_id"` |
| Boolean fields | prefix with `is_` or `has_` — `"is_active"`, `"has_submitted"` |
| Timestamp fields | suffix with `_at` — `"created_at"`, `"submitted_at"` |
| Enum values | SCREAMING_SNAKE_CASE strings — `"PENDING_APPROVAL"`, `"IN_PROGRESS"` |

---

## Phase 4 — RBAC Matrix

After all endpoints are specified, produce a single RBAC matrix covering all modules:

| Endpoint group | [Persona A] | [Persona B] | [Persona C] | [Persona D] |
|---|---|---|---|---|
| [Module] — list | R | R | R/W | -- |
| [Module] — create | -- | W | W | -- |
| ...| | | | |

Notation:
- `R` — can call GET endpoints in this group
- `W` — can call POST/PUT/PATCH/DELETE endpoints in this group
- `R/W` — can call all endpoints in this group
- `--` — no access (403 returned)

Derive personas and access rules entirely from the screen designs and user stories — do not invent roles.

**Use AskUserQuestion** to confirm the RBAC matrix before writing the output file.

---

## Phase 5 — Output File

Write `docs/architecture/api.md` using this exact structure:

```markdown
# API Specification

> Base URL: `/api/v1`
> Auth: All endpoints require a valid JWT bearer token unless noted.
> Envelope: Single resource → `{ "data": {} }` | Collection → `{ "data": [], "meta": {} }`
> Pagination: Cursor-based — `?cursor=<token>&limit=<n>` (default 20, max 100)
> Errors: `{ "error": { "code": "CODE", "message": "..." } }`

---

## RBAC Matrix
[table]

---

## Module: [Module Name]

> Pages covered: [list of page names from the prototype]
> Primary resource: [entity name]

### Page: [Page Name]

> Route: `[frontend route path, e.g. /goals]`
> Persona(s): [who sees this page]

#### GET /[path]
[full endpoint spec]

#### POST /[path]
[full endpoint spec]

---

### Page: [Next Page Name]
...

---

## Module: [Next Module Name]
...
```

---

## Interactive Delivery Rules

Use `AskUserQuestion` at every gate:

| Gate | Question type |
|---|---|
| Phase 1 — screen inventory and module grouping | Open multi-select: confirm pages, adjust module assignments |
| Phase 2 — per-module page analysis | Single-select per module: "Approve analysis", "Adjust" |
| Phase 3 — endpoint spec per module | Single-select per module: "Approve endpoints", "Request changes" |
| Phase 4 — RBAC matrix | Single-select: "Approve matrix", "Adjust permissions" |
| Phase 5 — file write | Single-select: "Write api-spec.md", "Make final adjustments" |

Never ask the user to type confirmations — always use clickable options.

---

## Cross-Cutting Rules

1. **Derive, never invent** — Every endpoint must trace back to a visible UI element (a field, button, table, chart) or a stated user story step. If no screen or story calls for it, do not add it.
2. **SPA-first** — Design for parallel fetches. A page that renders three independent widgets needs three independent endpoints, not one large aggregate endpoint.
3. **Scope enforcement on every list endpoint** — Every GET that returns a collection must enforce caller-role scoping server-side. Document the scoping rule on the endpoint.
4. **Soft-delete only** — DELETE endpoints never remove records from the database. They set a `deleted_at` timestamp. Document this in the endpoint purpose.
5. **Pagination on every list** — No list endpoint may return an unbounded set of records. If a screen shows "all" records, the client handles infinite scroll — the API still paginates.
6. **No chatty APIs** — If a page needs 10 fields from 3 different tables, design one endpoint that joins them, not 3 separate endpoints the client calls sequentially. Sequential fetches are a SPA performance anti-pattern.
7. **Mutation responses return the full updated resource** — PATCH/PUT/POST always return the updated object in `{ "data": {} }`. The client should not need a follow-up GET.
8. **Consistent error codes** — Use a closed set of SCREAMING_SNAKE_CASE error codes. Define them once in the spec preamble and reuse across endpoints.
9. **No breaking changes within a version** — All endpoints live under `/api/v1/`. Adding fields to responses is safe. Removing or renaming fields requires a new version.
10. **No emoji in the output file** — Use plain text only.

---

## After Writing the File

1. Confirm `docs/architecture/api.md` is written
2. Print the full module list with endpoint counts as a summary table:

| Module | Pages | GET endpoints | Write endpoints | Total |
|---|---|---|---|---|

3. Hand off to forger for approval
4. After approval, update forger with the confirmed API spec
5. Notify the user that the **architect** will be re-invoked (Pass 2) to produce the build phase plan using the approved db-design and api-spec
