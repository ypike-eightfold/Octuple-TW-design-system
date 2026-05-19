---
name: db-architect
description: >
  Designs a PostgreSQL database schema from screen designs and user stories using SQLModel Python syntax.
  Identifies tables, relationships, constraints, and indexes. Asks clarifying questions about edge cases,
  then produces a complete schema doc with SQLModel definitions and a Mermaid ER diagram. Use this skill
  when the user wants to design the database, create an ER diagram, define the schema, plan the data model,
  or spec out database tables. Always trigger after screen designs, user stories, and architect Pass 1 are
  approved. Never produce a schema without all three artifacts available — check forger first.
---

# DB Architect

## Context Manifest

```yaml
unit_type: one_shot
required_inputs:
  - docs/product/user-stories.md
  - docs/product/domain-doc.md
  - docs/architecture/system.md
  - docs/product/screen-inventory.md
  - frontend/src/
forbidden_paths:
  - docs/product/market-research.md
budget_tokens: 400000
artifacts:
  summary:          docs/architecture/database.md
outputs:
  - docs/architecture/database.md
  - designs/db-er-diagram.md                       # standalone Mermaid ER
```

Inline skill.

Produces a production-ready PostgreSQL database design: table inventory, full SQLModel definitions with constraints, index strategy, and a Mermaid ER diagram. Targets PostgreSQL 15+.

This skill is domain-agnostic. All table names, column names, and relationships are derived entirely from the project's screen designs and user stories — never from assumptions or domain knowledge.

This skill runs inline in the forger parent thread (not as a Task subagent) — the output is a single design doc and the skill often asks clarifying questions mid-run.

---

## Pre-conditions

Before proceeding, verify:
- Approved screen designs exist (React mock screens in `frontend/src/` from design-tw-ux-designer)
- Approved user stories exist (`docs/product/user-stories.md`)
- Approved architecture exists (`docs/architecture/system.md` — tech stack and module breakdown from architect Pass 1)

If any are missing, stop and tell the user which input is needed first.

---

## Delivery Order

Work in six sequential phases. Present each phase in chat, get confirmation via `AskUserQuestion`, then proceed to the next.

---

## Phase 1 — Table Inventory

### Step 1a: Scan inputs

Read the React mock screens in `frontend/src/` and `docs/product/user-stories.md`. Extract every noun that represents a distinct piece of data the system stores. Do not invent tables; derive every table from something visible in the screens or stated in a story.

Also read `docs/architecture/system.md` Section 2 (Module Breakdown) to align table groupings with the approved module structure.

Organise discovered tables into three tiers:

| Tier | Description |
|---|---|
| Core | Central business objects the application revolves around |
| Transactional | Records of events, state changes, or user actions |
| Support | Lookup data, configuration, and audit trails |

Present the table inventory as a table:

| Table name | Tier | Source (screen or story ID) | One-line purpose |
|---|---|---|---|

### Step 1b: Table consolidation check

The default position is fewer tables. Every candidate table must justify its existence before being added to the schema. Apply these rules in order:

**Rule 1 — Eliminate thin tables.**
If a candidate entity has 3 or fewer meaningful columns (excluding id, timestamps, and deleted_at), do not give it its own table. Fold those columns into the parent entity. This applies regardless of whether the data is queryable or not — if the entity is small and has exactly one parent, it belongs on the parent row. A separate table is only warranted when the entity has its own lifecycle, is referenced from more than one parent table, or appears independently on a screen.

**Rule 2 — Fold non-queryable child data into the parent.**
If a candidate child table exists only to store data that will never be queried via WHERE, JOIN, or ORDER BY, and the child always has a single parent row, do not create the table. Store the child data as a `JSON` column on the parent instead (PostgreSQL native JSON support). A separate table for non-queryable data adds joins and complexity with no benefit.

**Rule 3 — Consolidate structurally similar entities with a type column.**
When two or more candidate tables share the same structure — same parent FK, same status lifecycle, same core columns — merge them into one table and add a `type` column (Python `enum.Enum`) to distinguish the variants. Add columns needed by only one variant as nullable columns on the shared table; document which columns apply to which type in a comment. The goal is one table that covers both use cases, not two tables that look almost identical.

**Rule 4 — Only split when the difference is structural, not cosmetic.**
Separate tables are justified only when:
- The two entities have substantially different columns (more than half the columns differ)
- One entity has FK relationships the other does not
- Queries never mix both types in the same result set

For each consolidation applied, state: "Merged [A] and [B] into [merged_name] with a `type` column. Extra columns added: [list]. Reason: [what in the screens or stories supports this]."

**Use AskUserQuestion** to confirm all consolidation decisions before finalising the table list.

### Step 1c: Surface ambiguities

Before writing any model definitions, identify every relationship or cardinality question that cannot be answered from the inputs alone. Derive these questions from the actual screens and stories — do not ask generic questions.

Format each question as:
- "[Entity A] and [Entity B] appear related on [screen name / story ID]. Can one [A] have many [B], or is it always one-to-one?"

**Use AskUserQuestion** to present all Phase 1 questions in one pass before continuing.

---

## Phase 2 — Relationships & Cardinality

After answers are received, map every relationship found in the screens and stories:

```
Table A  <relationship>  Table B  |  FK placement  |  ON DELETE behaviour
```

Relationship notation:
- `1:1` — one-to-one
- `1:N` — one-to-many (FK lives on the N side)
- `M:N` — many-to-many (junction table required; name it `<table_a>_<table_b>`)

### ON DELETE rules

**All tables use soft-delete.** No row is ever physically deleted. Set `deleted_at` to the current timestamp instead of issuing a `DELETE` statement.

| Scenario | FK rule |
|---|---|
| Child record is meaningless without parent | `CASCADE` (soft-delete propagates via application) |
| Child record must survive parent deletion | `SET NULL` (FK nullable) |
| Deletion must be blocked while children exist | `RESTRICT` |

Because every row is soft-deleted, `ON DELETE` rules on FK constraints apply only if the parent is also physically deleted (which never happens). Declare `RESTRICT` as the default FK rule unless the relationship explicitly requires otherwise.

---

## Phase 3 — SQLModel Definitions

Produce complete SQLModel class definitions for every table. Follow these rules:

### Column conventions

| Attribute | SQLModel Pattern |
|---|---|
| Primary key | `id: UUID = Field(default_factory=uuid4, primary_key=True)` |
| Timestamps | `created_at: datetime = Field(default_factory=datetime.utcnow)` |
| Updated at | `updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})` |
| Soft delete | `deleted_at: datetime \| None = Field(default=None)` |
| Enums | Python `enum.Enum` subclass + `Field()` — e.g., `status: MyStatus = Field(default=MyStatus.DRAFT)` |
| Text length | `str` with `Field(max_length=255)` for names/titles; `Field(max_length=2000)` for descriptions; `sa_column=Column(Text)` for open-ended |
| Booleans | `bool = Field(default=False)` |
| Money | `Decimal = Field(max_digits=15, decimal_places=4)` — never float |
| JSON bucket | `dict \| None = Field(default=None, sa_column=Column(JSON))` for non-queryable attribute groups |
| Foreign keys | `parent_id: UUID = Field(foreign_key="parent_table.id")` |

### Enum definition pattern

```python
import enum

class MyStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
```

### SQLModel class pattern

```python
from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship

class MyEntity(SQLModel, table=True):
    """One-sentence purpose derived from screens/stories."""

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Entity-specific columns derived from screens and stories
    name: str = Field(max_length=255)
    status: MyStatus = Field(default=MyStatus.DRAFT)
    parent_id: UUID = Field(foreign_key="parent_table.id")

    # JSON bucket for non-queryable attributes
    metadata_: dict | None = Field(default=None, sa_column=Column(JSON))

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: datetime | None = Field(default=None)

    # Relationships
    parent: "ParentEntity" = Relationship(back_populates="children")
```

### JSON vs individual columns

Before adding each column, apply this test:

| Question | If yes | If no |
|---|---|---|
| Will this column ever appear in a WHERE clause? | Individual column | JSON bucket |
| Will this column ever appear in a JOIN condition? | Individual column | JSON bucket |
| Will this column ever appear in an ORDER BY or GROUP BY? | Individual column | JSON bucket |
| Is this column referenced by a foreign key? | Individual column | JSON bucket |

If all four answers are "no", store it inside a `dict` JSON column (e.g., `metadata_`, `config`, `settings`) rather than adding a dedicated column. Name the JSON column after the category of data it holds and document its expected keys in the class docstring.

---

### Roles and permissions pattern

When the screens or stories show any concept of roles, access control, or restricted actions, model it using this three-layer pattern. Do not deviate from this structure.

**Layer 1 — Permissions** are plain strings that name a specific action on a specific resource. They are stored as rows in a `Permission` model, not as columns or enum values. Format: `<resource>:<action>` (e.g., `reports:view`, `users:edit`, `cycle:launch`). Derive the permission strings directly from what the screens allow or block per role — do not invent generic permissions.

**Layer 2 — Roles** are named groupings of permissions. A `Role` model holds the role definitions. A `RolePermission` junction model assigns permissions to roles. This is a M:N relationship.

**Layer 3 — User role assignment** links users to roles. A `UserRoleAssignment` junction model assigns roles to users. Include `assigned_at` and `assigned_by` columns. Optionally include `expires_at` if the screens show time-limited role grants.

The three entities and their relationships:

```
User  M:N  Role       (via UserRoleAssignment)
Role  M:N  Permission (via RolePermission)
```

At runtime, a user's full permission set is the union of permissions across all their assigned roles.

**When to apply this pattern:**
- Apply it only if the screens or stories explicitly show different users seeing or doing different things based on their role.
- If every user has the same access, do not add these tables.
- If the screens show only 2-3 hard-coded roles with no dynamic assignment, a simple `role` enum column on the User model is sufficient — skip the full pattern.

**Consolidation rule:** `RolePermission` and `UserRoleAssignment` are junction models. Do not merge them with any other model.

---

### Mandatory entities

Every schema must include the following entity regardless of the project domain. Generate its SQLModel definition using the same column conventions as all other models.

**`AuditLog`** — append-only record of every write operation across all tables.

Core attributes to capture:
- Which table was affected (`table_name: str`)
- Which record (by ID) was affected (`record_id: UUID`)
- The action taken: insert, update, or soft-delete (`action: AuditAction` enum)
- Who made the change (`changed_by: UUID`, FK to User)
- When the change occurred (`changed_at: datetime`)
- The before state of the record (`old_values: dict | None`, JSON)
- The after state of the record (`new_values: dict | None`, JSON)

Constraints:
- Append-only — no `updated_at` or `deleted_at` columns. Rows are immutable once written.
- Index on (table_name + record_id) to support looking up the history of a specific record.
- Index on changed_at to support time-range queries.

---

### Constraint conventions

Since SQLModel/SQLAlchemy handles constraint naming, document these in comments:
- Every FK is declared via `Field(foreign_key="table.column")`
- Unique constraints use `Field(unique=True)` or table-level `UniqueConstraint`
- Check constraints use SQLAlchemy `CheckConstraint` in `__table_args__`

---

## Phase 4 — Index Strategy

For every table, define indexes based on the query patterns implied by the user stories and screen designs. Derive each index from a specific screen or story — do not add speculative indexes.

For each proposed index, state:
- The model and column(s)
- The query pattern it supports (e.g., "list screen filters by status + owner_id")
- The index type (regular, unique, full-text, composite, partial)

### Index decision tree

For each table:
1. **List queries** — Which columns appear in WHERE or ORDER BY on list/search screens?
2. **Lookup queries** — Which columns are used to fetch a single row (besides PK)?
3. **Join columns** — Every FK queried from the child side needs an index.
4. **Soft-delete filter** — If queries always include `deleted_at IS NULL`, consider partial indexes: `Index(..., postgresql_where=text("deleted_at IS NULL"))`
5. **Full-text search** — Any column searched with text? Use PostgreSQL `GIN` index with `tsvector`.

### Index specification format

Document indexes using SQLAlchemy table args:

```python
class MyEntity(SQLModel, table=True):
    __table_args__ = (
        Index("ix_myentity_status_owner", "status", "owner_id"),
        Index("ix_myentity_active", "status", postgresql_where=text("deleted_at IS NULL")),
    )
```

### Index naming

- Regular: `ix_<table>_<cols>`
- Unique: `uq_<table>_<cols>`
- Full-text (GIN): `gin_<table>_<col>`
- Partial: `ix_<table>_<cols>_active` (suffix indicates the WHERE condition)

### Index budget guideline

| Expected row volume | Max indexes |
|---|---|
| Low (< 100k rows) | 6 |
| Medium (100k - 1M rows) | 8 |
| High (> 1M rows, write-heavy) | 4 — every extra index slows writes |

---

## Phase 5 — Mermaid ER Diagram

After SQLModel definitions are approved, generate a Mermaid `erDiagram` block covering all tables. Rules:

- Include every table derived from the project, no more.
- Show primary key and foreign key columns per table only — not all columns.
- Label each relationship line with the FK column name.
- Group tables by tier using comments: `%% Core`, `%% Transactional`, `%% Support`.
- Use Mermaid cardinality notation:
  - `||--o{` one to many
  - `||--||` one to one
  - `}o--o{` many to many (shown via junction table)

Example notation (structure only — actual table names come from the project):

```
erDiagram
  %% Core
  entity_a {
    uuid id PK
    varchar name
    uuid entity_b_id FK
  }
  entity_b {
    uuid id PK
    varchar code
  }
  entity_a }o--|| entity_b : "entity_b_id"
```

---

## Output Files

Write two files after all phases are approved:

### `docs/architecture/database.md`

```markdown
# Database Design

## 1. Table Inventory
[Tier table — derived from screens and stories]

## 2. Relationship Map
[Relationship table with FK placement and ON DELETE rules]

## 3. SQLModel Definitions
[Full SQLModel class definitions, grouped by tier, with imports and enum definitions]

## 4. Index Definitions
[Per-model index list with the query pattern each index supports]

## 5. ER Diagram
[Mermaid erDiagram block]
```

### `designs/db-er-diagram.md`

Contains only the Mermaid ER diagram block, suitable for rendering in GitHub or Notion.

---

## Interactive Delivery Rules

Use `AskUserQuestion` at every gate:

| Gate | Question type | Options |
|---|---|---|
| Phase 1 clarifications | Multi-part open text | One question per ambiguity found |
| Phase 2 cardinality review | Single-select | "Approve all", "Change a specific relationship" |
| Phase 3 SQLModel review | Single-select per model group | "Approve", "Request changes" |
| Phase 4 index review | Single-select | "Approve index plan", "Adjust" |
| Phase 5 ER diagram review | Single-select | "Approve and write files", "Adjust diagram" |

Never ask the user to type confirmations — always use clickable options.

---

## Cross-Cutting Rules

1. **Derive, never assume** — Every table, column, and relationship must trace back to something in the screen designs or user stories. If a concept is not in the inputs, do not add it.
2. **Always soft-delete** — No row is ever physically deleted from any table. Every model must have `deleted_at: datetime | None = Field(default=None)`. Queries filter `WHERE deleted_at IS NULL`. There are no exceptions.
3. **Always create an audit model** — Every schema must include a single `AuditLog` model regardless of domain. It captures every INSERT, UPDATE, and soft-delete across all tables. This model is append-only and is never soft-deleted.
4. **Fewer tables by default** — Do not create a model for an entity with 3 or fewer meaningful columns; fold it into the parent. Merge structurally similar entities into one model with a `type` column rather than creating separate models. A new model must justify its existence. (See Step 1b for the full consolidation rules.)
5. **PostgreSQL 15+ only** — Use full-text search with `tsvector`/`GIN`, `JSONB` columns, partial indexes, CTEs, and window functions freely.
6. **No application-enforced-only constraints** — Every business rule that can be expressed as a DB constraint should be. Don't rely on the application layer alone. Use SQLAlchemy `CheckConstraint` in `__table_args__`.
7. **Pagination-friendly PKs** — UUID PKs are the default (matching boilerplate). For tables requiring cursor-based pagination by insertion order, add a sequential `seq` integer column as secondary index.
8. **No silent truncation** — Size `Field(max_length=...)` to the maximum expected input, not the smallest passing value.
9. **Document every model** — Every SQLModel class must include a docstring describing its purpose in one sentence, derived from the domain the project is building.
10. **No emoji in output files** — Use plain text markers only.
11. **Match boilerplate patterns** — Read the existing User model in `backend/app/models/user.py` before writing any models. Follow the same import style, Field patterns, and relationship patterns used in the boilerplate.

---

## After Writing Files

1. Confirm both files are written: `docs/architecture/database.md` and `designs/db-er-diagram.md`
2. Present the ER diagram inline in chat using a fenced `mermaid` block
3. Hand off to forger for approval
4. After approval, update forger with confirmed schema
5. Notify the user that **api-architect** runs next to design the REST API based on this schema
