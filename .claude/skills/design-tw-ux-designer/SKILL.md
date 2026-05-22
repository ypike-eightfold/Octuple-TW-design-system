---
name: design-tw-ux-designer
description: >
  Designs fully interactive React mock screens for all personas using ef-design-system components, TanStack Router, and Tailwind CSS 4.
  Outputs production-stack React components with mock data, dev tooling (PersonaSwitcher, StateDebugBar), and file-based routes under frontend/src/.
  Use this skill when the user wants to design screens, wireframes, mockups, user flows, or UI specifications before wiring up real APIs.
  Always trigger after story-writer produces approved user stories and before architect begins system architecture — screen designs inform what data model and modules the architecture needs.
  Also triggers when the user says "design the screens", "show me the UI flow", "wireframe the review cycle",
  "what should the manager dashboard look like", "design the user experience", or "mockup the screens".
---

# React UX Designer

Designs complete, interactive React mock screens — **real components with the production tech stack** — for the entire system. All personas, all screens, all data states are built as working React code with mock data using ef-design-system components. Two dev-only toolbars (PersonaSwitcher and StateDebugBar) let reviewers flip between personas and app states instantly in the browser.

## Context Manifest

```yaml
unit_type: one_shot
required_inputs:
  - docs/product/domain-doc.md
  - docs/product/user-stories.md
  - docs/product/personas.md
  - frontend/
forbidden_paths:
  - docs/product/market-research.md
  - backend/
budget_tokens: 900000
outputs:
  - frontend/src/routes/
  - frontend/src/features/
  - frontend/src/components/dev/PersonaSwitcher.tsx
  - frontend/src/components/dev/StateDebugBar.tsx
artifacts:
  summary:          docs/product/screen-inventory.md
  return_contract:  docs/product/.design-tw-ux-designer.return.json
```

Forger invokes as a single Task subagent (one_shot — the mock screen set shares routing, AppShell, and dev toolbars; splitting per-persona risks inconsistency). Return JSON contract: see `.claude/skills/_shared/return-contract.md`. Do NOT call AskUserQuestion; forger owns the approval gate.

---

## Position in Pipeline

```
domain-researcher → story-writer → ★ design-tw-ux-designer ★ → architect → backend-writer → ui-builder → deploy-setup
```

This skill sits **after user stories** (so we know what the system should do) and **before architecture** (so the data model and modules are shaped by what the screens actually need).

**Key value**: The React components this skill produces carry forward directly into production. The ui-builder skill later upgrades them (swapping mock data for API hooks, adding validation, wiring auth) — no rebuild from scratch.

## Pre-conditions

Confirm via forger:
- ✅ Domain doc approved
- ✅ User stories approved (MVP + Phase 2 scope known)
- ✅ Personas confirmed
- ✅ `frontend/` exists with dependencies installed (boilerplate copied at project start)

If any are missing, stop and ask the user to complete the prior stage first.

---

## Supporting Files (Read Before Building)

This skill ships with detail docs for specific concerns. Read the relevant one before you start building the kind of UI it covers — they contain enforced rules, not suggestions.

| File | Covers |
|---|---|
| [`information-architecture.md`](information-architecture.md) | Navigation pattern (top-nav default), persona scoping, eliminating redundant views |
| [`component-selection.md`](component-selection.md) | **Read for every screen** — complete ef-design-system component inventory (40+ components), decision table, all forbidden substitutions, button/status/alert/modal/navigation/data display patterns with copy-ready code |
| [`enterprise-patterns.md`](enterprise-patterns.md) | Action-oriented metrics, column pickers, depth selectors, inline editing, peer/multi-source data |
| [`react-prototype-patterns.md`](react-prototype-patterns.md) | Copy-ready code patterns: AppShell, page components, all ef-design-system components (SkillTag, Panel, Snackbar, Timeline, Charts, Uploader, EmptyIllustration, Chip, Pill, Progress, SegmentedProgress), mock data |
| [`responsive-design.md`](responsive-design.md) | Required viewport tests (mobile/tablet/desktop), breakpoint reference, common pitfalls |
| [`localization.md`](localization.md) | Date / number / currency formatting; no hardcoded locale strings |
| [`references/accessibility.md`](references/accessibility.md) | **Design-stage a11y.** Color & contrast targets, don't-rely-on-color rules, heading hierarchy, focus order, form labels & error format, touch target sizing (WCAG 2.2 §2.5.8), 320 px reflow, reduced motion, accessibility annotation patterns, WCAG 2.2 designer-stage criteria (consistent help, redundant entry, accessible authentication). The engineer skill is the authority on ARIA / keyboard / screen reader implementation. |
| [`../design-tw-frontend-engineer/references/accessibility.md`](../design-tw-frontend-engineer/references/accessibility.md) | Cross-skill: the engineer's implementation-side a11y reference. Read this when you're unsure how a design decision translates into code (e.g. how a status badge becomes both visible state + screen reader output). |
| [`../_content/content-design-standards.md`](../_content/content-design-standards.md) | Eightfold writing voice/tone, grammar rules, UI copy patterns (buttons, errors, empty states, tooltips), accessibility writing requirements. **Shared between Tailwind and OG versions** — single source of truth. |
| [`../_content/terms-list.md`](../_content/terms-list.md) | Authoritative Eightfold product terminology — branded terms, approved usage, do-not-use alternatives. **GREP this file** for specific terms — 4,000+ lines, not meant to be read end-to-end. Shared between Tailwind and OG. |
| [`../../../gems/response-confidence-score.md`](../../../gems/response-confidence-score.md) | Rubric for response confidence scoring — apply when generating AI-mediated UI copy (chat responses, recommendations) that needs to signal uncertainty. |
| [`../../../gems/guidance-layer.md`](../../../gems/guidance-layer.md) | Guidance-layer guardrails — how to express limitations, when to defer to a human, what to surface alongside an AI response. Shapes copy for AI features. |
| [`../../../gems/OH/prompt-instructions.md`](../../../gems/OH/prompt-instructions.md) | The OH Gem's persona, scope, allowed topics, and response format. Use as a reference when designing screens that interact with OH. |
| [`../../../gems/OH/content-quality-framework.md`](../../../gems/OH/content-quality-framework.md) | The content-quality rubric the OH Gem uses to evaluate, draft, and refine responses. Apply the same rubric to copy on screens that present OH outputs. |

---

## Core Principle — Production Stack, Mock Data

Everything is built with the **real frontend stack** (React 19, TypeScript, ef-design-system, TanStack Router, Tailwind CSS 4). The only difference from production code is:

1. **Mock data** instead of API calls — imported from `src/mocks/data.ts`
2. **Dev tooling** instead of real auth — `PersonaSwitcher` and `StateDebugBar` components
3. **No form validation** — placeholder forms without React Hook Form / Zod
4. **No business logic** — no optimistic updates, cache invalidation, or error retries

### Why React Instead of HTML Prototypes

- **Zero translation loss** — no HTML→React rebuild step, no visual drift
- **Production fidelity** — real ef-design-system components, real Tailwind classes, real routing
- **Code carries forward** — ui-builder upgrades in place, doesn't start over
- **Instant preview** — Vite dev server with HMR, same as production development
- **Design system compliance** — ef-design-system components and tokens consumed the production way from day one

---

## Tech Stack (Matches Production)

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript 5.9 (strict) |
| Build | Vite 7 |
| UI Components | ef-design-system (primary) + shadcn/ui + Radix UI |
| Styling | Tailwind CSS 4 + ef-design-system tokens |
| Routing | TanStack Router (file-based routes in `src/routes/`) |
| Icons | Lucide React |
| State (dev only) | React Context for persona/state switching |

**NOT used at this stage** (left for ui-builder):
- TanStack Query (no real API calls yet)
- Zustand (no production state stores yet)
- React Hook Form + Zod (no form validation yet)
- axios (no HTTP client yet)

---

## Output Structure

All code is written under `frontend/src/`. The skill creates/modifies these paths:

```
frontend/src/
  mocks/
    data.ts                          # All mock data: employees, goals, reviews, etc.
    types.ts                         # TypeScript types for mock data shapes

  components/
    layout/
      AppShell.tsx                   # Main layout wrapper (sidebar/topnav + content area)
      Sidebar.tsx                    # Left sidebar navigation (for power-user personas)
      TopNav.tsx                     # Top navigation bar (for simpler personas)
    shared/
      StatusBadge.tsx                # Colored status pill (used across all personas)
      EmptyState.tsx                 # Empty state placeholder with icon + CTA
      LoadingSkeleton.tsx            # Skeleton loading placeholders
      ErrorBanner.tsx                # Error state with retry action
      ProgressBar.tsx                # Progress bar with semantic colors
      StatCard.tsx                   # Metric card for dashboards

  features/
    {feature-name}/                  # One directory per feature cluster
      components/                    # Feature-scoped components
        {ComponentName}.tsx
      pages/                         # Page-level components (compose feature components)
        {PageName}.tsx

  routes/                            # TanStack Router file-based routes
    __root.tsx                       # Root layout with DevToolbarProvider + AppShell
    index.tsx                        # Redirect to default persona's dashboard
    {persona}/                       # Persona-scoped routes
      index.tsx                      # Persona dashboard
      {screen}.tsx                   # Individual screens
```

---

## Dev Tooling Components

The boilerplate includes pre-built dev tooling at `src/components/dev/`. These are **dev-only** — ui-builder removes them when wiring real auth.

```tsx
import { DevToolbarProvider, useDevToolbar, PersonaSwitcher, StateDebugBar } from '@/components/dev'
```

| Component | What It Does |
|-----------|-------------|
| **DevToolbarProvider** | React context — wraps the app, provides `currentPersona`, `setPersona`, `currentState`, `setState`, and `personas` |
| **PersonaSwitcher** | Fixed bar at the top showing all personas as tabs. Clicking switches the active persona and navigates to their default route |
| **StateDebugBar** | Second fixed bar below PersonaSwitcher. Toggles data state: **Populated** (default), **Empty**, **Loading**, **Error** |

```
┌─────────────────────────────────────────────────────────┐
│  [ Sarah Chen · IC ]  [ David Park · Manager ]  [ ... ] │  ← PersonaSwitcher
├─────────────────────────────────────────────────────────┤
│  [ Populated ]  [ Empty ]  [ Loading ]  [ Error ]       │  ← StateDebugBar
├─────────────────────────────────────────────────────────┤
│                                                         │
│  React app content (layout + routes)                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Page components use `useDevToolbar()` to read the current persona and data state. Populate `DevToolbarProvider` with the approved personas from the domain doc — see `react-prototype-patterns.md` for the root layout wiring pattern.

---

## Design System — ef-design-system

The boilerplate ships a complete design system at `src/styles/ef-design-system/` that is **already imported** via `tailwind.css`. No manual CSS setup is needed — all tokens and component styles are available globally when the boilerplate is copied.

### Priority Order for Styling

1. **ef-design-system React components** — import from `@/components/ef-design-system` (pre-styled, preferred)
2. **Tailwind semantic classes** — `bg-primary`, `text-foreground`, `bg-card`, `border-border`, `bg-destructive`, `bg-muted`, `text-muted-foreground` (from shadcn.css compatibility layer)
3. **Tailwind utility classes** — standard spacing, layout, flex, grid
4. **CSS variable references** — only as last resort for custom styling not covered above

### Component Import — Always Use ef-design-system First

```tsx
// ✅ CORRECT — import pre-styled components
import { Button, Badge, StatCard, Input, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ef-design-system'

// ✅ CORRECT — Tailwind semantic classes for layout/custom elements
className="bg-card text-foreground border-border"
className="bg-primary text-primary-foreground"
className="bg-destructive text-destructive-foreground"
className="text-muted-foreground"

// ❌ WRONG — raw hex values
className="bg-[#b0f3fe]"

// ❌ WRONG — old Octuple token names
className="bg-[var(--button-primary-background-color)]"
```

### Available ef-design-system Components

Import all from `@/components/ef-design-system`:

| Component | Key Props | Use For |
|-----------|-----------|---------|
| **Button** | `variant` (primary/secondary/destructive/outline/ghost), `size` (xs/sm/default/lg), `leadingIcon`, `trailingIcon`, `badge` | All buttons and CTAs |
| **Input** | `size` (small/medium/large), `shape` (rounded/pill), `state` (default/error/warning/success), `leadingIcon`, `trailingIcon` | Form inputs |
| **Badge** | `variant` (default/primary/secondary/destructive/outline/ghost), `size` (24/30/44), `leadingIcon` | Status labels, counts |
| **Tag** / **TagGroup** | `variant` (default/selected/disabled), `size` (24/30/44), `onRemove`, `leadingIcon` | Filters, selections |
| **Pill** | `variant`, `size` | Compact labels |
| **StatCard** | `label`, `value`, `pct`, `icon` (Material Symbol name), `color` (green/grey/red/teal/blue/dark), `size` (lg/md/sm), `variant` (outlined/filled/ghost) | Dashboard metrics |
| **Progress** | `value`, `labelVariant` (none/scale/complete-left) | Progress bars |
| **Tabs** / **TabsList** / **TabsTrigger** / **TabsContent** | `variant` (default/line), `leadingIcon`, `badge` | Tab navigation |
| **Navbar** | `tabs`, `user`, `avatarMenuItems`, `actionButtons`, `LinkComponent` | Top navigation bar |
| **Dialog** / **DialogContent** / **DialogHeader** / **DialogBody** / **DialogFooter** | `steps`, `currentStep`, `showCloseButton` | Modals, multi-step dialogs |
| **Select** / **SelectTrigger** / **SelectContent** / **SelectItem** | `size` (sm/default), `variant` | Dropdown selects |
| **Stepper** / **StepperList** / **StepperItem** / **StepperIndicator** | `value`, `onValueChange`, `size` (default/sm) | Multi-step flows |
| **DataTable** / **DataTableHeader** / **DataTableBody** / **DataTableRow** / **DataTableHead** / **DataTableCell** | `bordered`, `numeric`, `metric`, `shrink` | Data tables |
| **Breadcrumb** | Standard Breadcrumb parts | Navigation breadcrumbs |
| **NumberBadge** | `color`, `size` | Notification counts |

### Typography

Use the `--typography-*` CSS variables via Tailwind arbitrary values for text styling:

```tsx
className="font-[var(--typography-header3)]"    // 600 24px/1.33 Gilroy
className="font-[var(--typography-body2)]"       // 500 16px/1.5 Gilroy
className="font-[var(--typography-caption)]"     // 400 12px/1.33 Gilroy
className="font-[var(--typography-button2)]"     // 600 16px/1.25 Gilroy
```

**Font weight rules — CRITICAL:**

| Weight | Tailwind class | When to use |
|--------|---------------|-------------|
| Regular (400) | `font-normal` | Body text, descriptions, secondary labels |
| Medium (500) | `font-medium` | Labels, table column headers, subtle emphasis |
| Semibold (600) | `font-semibold` | Headings, page titles, strong emphasis, button text |

**`font-bold` (700), `font-extrabold` (800), and `font-black` (900) are NEVER used.** Octuple uses Semibold (600) wherever other systems use Bold. If you think bold is needed, use `font-semibold`.

```tsx
// ✅ CORRECT
<h1 className="text-xl font-semibold">Candidate profile</h1>
<p className="text-sm font-normal text-muted-foreground">Last updated 3 days ago</p>
<span className="text-xs font-medium text-foreground">Match score</span>

// ❌ WRONG
<h1 className="text-xl font-bold">Candidate profile</h1>
<p className="font-extrabold">Never</p>
```

### Spacing

Use standard Tailwind spacing utilities. The design system uses a 4px base unit:

| Token | Value | Tailwind Class |
|-------|-------|----------------|
| `--spacing-2` | 4px | `p-1`, `gap-1` |
| `--spacing-4` | 8px | `p-2`, `gap-2` |
| `--spacing-6` | 12px | `p-3`, `gap-3` |
| `--spacing-8` | 16px | `p-4`, `gap-4` |
| `--spacing-10` | 20px | `p-5`, `gap-5` |
| `--spacing-12` | 24px | `p-6`, `gap-6` |
| `--spacing-16` | 32px | `p-8`, `gap-8` |
| `--spacing-20` | 40px | `p-10`, `gap-10` |
| `--spacing-24` | 48px | `p-12`, `gap-12` |

### Border Radius

| Token | Value | Tailwind Class |
|-------|-------|----------------|
| `--radius-1` | 4px | `rounded` |
| `--radius-2` | 6px | `rounded-md` |
| `--radius-3` | 8px | `rounded-lg` |
| `--radius-5` | 12px | `rounded-xl` |
| `--radius-7` | 20px | `rounded-2xl` |
| `--radius-8` | 24px | `rounded-3xl` |
| `--radius-full` | 9999px | `rounded-full` |

### Disabled States

```tsx
className="opacity-30 cursor-not-allowed pointer-events-none"
```

Opacity is **0.3** (not 0.5).

Refer to `react-prototype-patterns.md` (in this skill's directory) for complete code patterns.

---

## Design Scope — Derive Everything from User Stories

### Step 1: Determine Personas

Read the approved personas from forger. The personas come from the domain doc — **do not assume a fixed set**. Each persona becomes a tab in PersonaSwitcher and a set of routes in the router.

### Step 2: Collect Screens from User Stories

For each persona, read the **Screen Inventory tables (Section 3)** and **Permissions tables (Section 7)** from approved user stories. Stories now provide explicit screen tables — **read them directly instead of inferring from prose.**

Process:
1. Collect all Screen Inventory tables across all stories
2. Group screens by persona (using the Persona(s) column)
3. Deduplicate — multiple stories may reference the same screen (one defines it, others mark it "[Modified]")
4. Group into navigation sections based on route path prefixes
5. Identify screens that are entry points (dashboard, home) vs. detail/action screens
6. Map the navigation flow — what leads to what
7. **Eliminate redundancy** — if a view is reachable from a dashboard card, do NOT create a separate nav tab for it. See `information-architecture.md`.
8. **Cross-check** — scan every User Journey (Section 2) to verify every screen mentioned in the journey appears in a Screen Inventory table. If a journey mentions a screen with no inventory entry, flag it as a gap before building.
9. **Read Permissions (Section 7)** to determine persona access per screen:
   - Personas with "None" access → no route under their namespace for this screen
   - Personas with "Read-only" → screen exists but edit controls are disabled
   - Personas with "Limited" → same screen, data scoped to their department/team
   - Personas with "Self only" → same screen, data scoped to own records

Present the collected screen inventory to the user for confirmation before building.

### Step 3: Choose Navigation Pattern Per Persona

**Default: top navigation for every persona.** See [`information-architecture.md`](information-architecture.md#navigation-pattern-default-top-nav) for the rule and the rare sidebar exception.

| Pattern | When to use | Example |
|---|---|---|
| **Top navbar + content** ★ DEFAULT | All personas, all screen counts | Notion, Linear, GitHub |
| **Left sidebar + content** | Only when ≥7 peer destinations AND user explicitly requests it during IA approval | Gmail, Jira (justified — many parallel inboxes/projects) |
| **Dashboard hub with drill-down** | Executive/analytics-heavy personas — overlays the chosen nav pattern, not a replacement | Tableau, Looker |
| **Card grid / kanban** | Visual/status-heavy task views (calibration, queue) — usually nested inside a page, not the shell | Trello, Monday |

**All personas in a project should use the same shell.** Mixing sidebar + topnav across personas creates a layout flash on persona switch and doubles maintenance.

Before building, present a **persona → nav items → home sections** table to the user. Get explicit approval on the IA before writing any components. See [`information-architecture.md`](information-architecture.md) for detailed rules.

### Step 4: Build React Components

Build all components feature-by-feature within personas.

**For each screen, read these story sections before building:**
- **Field Inventory (Section 4)** → exact fields, types, validation rules, defaults for every input and table column
- **Filters, Sort & Search (Section 10)** → exact filter dropdowns, default sort order, search fields, pagination defaults for list screens
- **Screen States (Section 8)** → exact empty/loading/error state content for StateDebugBar
- **Status Enums (Section 9)** → exact status values and transitions for badge mappings

Every action that would navigate to another screen uses TanStack Router `<Link>` or `useNavigate()`:

```tsx
// ✅ CORRECT — TanStack Router navigation
<Link to="/ic/review-results">View My Review</Link>

// ✅ CORRECT — programmatic navigation
const navigate = useNavigate()
navigate({ to: '/ic/goals/$goalId', params: { goalId } })
```

### Shared Components vs. Persona-Specific Components

When multiple personas need a conceptually similar component (e.g. "goal list"), build a **shared component** with persona-appropriate props. A manager's goal view shows approve/reject controls; an IC's shows only their own goals.

---

## Mock Data

All mock data lives in `src/mocks/data.ts` with corresponding types in `src/mocks/types.ts`.

### Deriving Types from Field Inventory

Read the **Field Inventory tables (Section 4)** from user stories to build TypeScript interfaces in `src/mocks/types.ts`. Each field's Type column maps to a TypeScript type:

| Story Field Type | TypeScript Type | Notes |
|---|---|---|
| text input, textarea, textarea (rich text) | `string` | |
| number, read-only number | `number` | |
| date picker | `string` | ISO 8601 format |
| select (N options) | union type | e.g., `'full_review' \| 'manager_only' \| '360'` from the options in the story |
| multi-select | array of union | e.g., `('engineering' \| 'sales' \| 'hr')[]` |
| toggle, checkbox | `boolean` | |
| radio (N options) | union type | same as select |
| badge | enum from **Status Enums (Section 9)** | e.g., `'DRAFT' \| 'ACTIVE' \| 'CLOSED'` |
| table column | depends on column data type | derive from context |
| progress bar | `number` | 0-100 percentage |

If a story has no Field Inventory for a screen, fall back to inferring from the User Journey. But flag this as a story quality gap.

### Deriving Badge Variants from Status Enums

Read **Status Enums & Transitions (Section 9)** from user stories. Map each status to a Badge variant:

| Status Category | Badge Variant | Examples |
|---|---|---|
| Active / completed / approved | `default` (green) | ACTIVE, COMPLETED, APPROVED |
| Pending / draft / scheduled | `secondary` (amber) | DRAFT, SCHEDULED, PENDING, IN_PROGRESS |
| Error / overdue / cancelled | `destructive` (red) | OVERDUE, CANCELLED, REJECTED, FAILED |
| Neutral / inactive / archived | `outline` (gray) | INACTIVE, ARCHIVED, NOT_STARTED |

### Rules

1. **Realistic data** — real-sounding employee names, team names, goal descriptions. No lorem ipsum.
2. **Consistent across personas** — the same "Sarah Chen" who appears as an IC also appears in the Manager's team view as a direct report.
3. **Domain-aware** — data reflects the domain doc's methodology (OKRs, 360, competencies, etc.)
4. **Typed** — every mock object has a TypeScript interface in `types.ts`, derived from Field Inventory tables
5. **Plausible dates** — use dates relative to "now" that make sense for the domain (review cycles, deadlines, etc.)

### Data State Pattern

Page components use the `useDevState()` hook from DevToolbarProvider to determine which data to render:

```tsx
import { useDevToolbar } from '@/components/dev/DevToolbarProvider'
import { mockGoals } from '@/mocks/data'

function GoalsPage(): ReactElement {
  const { currentState } = useDevToolbar()

  if (currentState === 'loading') return <GoalsLoadingSkeleton />
  if (currentState === 'error') return <ErrorBanner message="Failed to load goals" onRetry={() => {}} />
  if (currentState === 'empty') return <EmptyState icon={<Target />} title="No goals yet" description="Create your first goal to get started." action={<Button>Create Goal</Button>} />

  return <GoalsList goals={mockGoals} />
}
```

This pattern mirrors exactly how ui-builder will later replace it with TanStack Query:

```tsx
// ui-builder replaces mock state check with real query state:
const { data, isLoading, isError, error } = useGoals()
if (isLoading) return <GoalsLoadingSkeleton />
if (isError) return <ErrorBanner message={error.message} onRetry={() => refetch()} />
if (!data?.length) return <EmptyState ... />
return <GoalsList goals={data} />
```

---

## Edge Cases & States

Every screen must include designs for these states (toggled by StateDebugBar).

### Data States — Read from Story Section 8

**Read the Screen States tables (Section 8) from user stories for each screen.** Stories now provide explicit descriptions for all 4 states. Use story-defined content instead of inventing generic placeholders.

| State | Source | Fallback if story lacks Section 8 |
|---|---|---|
| **Empty** | Story Section 8 → Empty row: use the exact illustration hint, message text, and CTA text | Generic: `<EmptyState title="No data yet" description="Get started by creating your first item." />` |
| **Loading** | Story Section 8 → Loading row: skeletonize exactly what the story specifies | Skeleton placeholders matching the layout shape |
| **Populated** | User Journey (Section 2) describes the normal state with data | Realistic mock data (default) |
| **Error** | Story Section 8 → Error row: use the exact error message text and retry action | `<ErrorBanner message="Something went wrong. Please try again." onRetry={...} />` |

**Always prefer story-defined content.** If a screen has no Section 8 entry, use the fallback and flag it as a story quality gap.

### Edge Cases — Read from Story Section 6

**Read the Edge Cases & Validation table (Section 6)** for UI-relevant edge cases:
- **Empty state** rows → inform the EmptyState component content
- **Boundary** rows → inform disabled states, max-count messages, inline warnings
- **Permission denied** rows → inform unauthorized state and hidden/disabled controls
- **Mid-workflow** rows → inform draft preservation and "unsaved changes" dialogs

### Permission & Access States (via mock role from PersonaSwitcher)

**Read Permissions (Section 7)** to determine what each persona sees:

| Permission Level | What to Show |
|---|---|
| **None** | Route does not exist for this persona. If navigated to directly, show "You don't have access" with redirect. |
| **Read-only** | Show data but disable all edit controls (buttons hidden or disabled, form fields read-only) |
| **Limited** | Same UI as Full, but data filtered. Show a scope indicator: "Showing: Engineering Department" |
| **Self only** | Same UI, scoped to own data. No other records visible. |
| **Full** | All controls enabled, all data visible |

### Form States (placeholder — no real validation yet)
| State | What to Show |
|---|---|
| **Default** | Form with placeholder inputs, submit button |
| **Draft indicator** | "Draft saved" text near form actions |

---

## Design Principles

1. **Progressive disclosure** — Don't overwhelm. Show summary first, details on demand (expand, drill-down, modal).
2. **Context over navigation** — Minimise page hops. Use inline editing, slide-over panels, and contextual modals.
3. **Role-appropriate density** — IC screens are spacious and task-focused. HR Admin screens are data-dense with tables and filters.
4. **Guide the next action** — Every screen should make it obvious what the user should do next (CTA button, status indicator, empty-state prompt).
5. **Accessibility baseline** — Sufficient color contrast, keyboard-navigable controls, ARIA labels on interactive elements, focus indicators.
6. **Mobile-aware** — IC and Manager screens must be responsive. HR Admin and Executive screens are desktop-primary but shouldn't break on tablet.
7. **Design system fidelity** — Use ef-design-system components and Tailwind semantic classes. Never invent custom colors or radii.
8. **Information architecture first** — Design nav structure before screens. No redundant views. See `information-architecture.md`.
9. **Component selection discipline** — One primary button per context, slide-overs for table drill-down, max 2 chips per card. See `component-selection.md`.
10. **Action-oriented data** — Every metric drills down, every table has a column picker, human-readable labels. See `enterprise-patterns.md`.

---

## Routing Convention

Use TanStack Router file-based routing. Routes are organized by persona:

```
src/routes/
  __root.tsx                    # Root layout: DevToolbarProvider + AppShell
  index.tsx                     # Redirect to current persona's dashboard
  ic/
    index.tsx                   # IC Dashboard
    goals.tsx                   # My Goals
    goals.$goalId.tsx           # Goal Detail
    feedback.tsx                # Give/Request Feedback
    reviews.tsx                 # My Reviews
    pip.tsx                     # My PIP
  manager/
    index.tsx                   # Team Dashboard
    team.goals.tsx              # Team Goals
    team.reviews.tsx            # Review My Team
    team.reviews.$employeeId.tsx # Write Review for Employee
    calibration.tsx             # Calibration
    pip.tsx                     # PIP Management
  admin/
    index.tsx                   # Admin Dashboard
    cycles.tsx                  # Cycle Management
    users.tsx                   # User Management
    forms.tsx                   # Form Builder
  ...
```

Route guards use the dev persona context (not real auth):

```tsx
export const Route = createFileRoute('/admin/')({
  beforeLoad: () => {
    const persona = getCurrentPersona() // reads from DevToolbarProvider
    if (persona !== 'hr-admin') {
      throw redirect({ to: '/' })
    }
  },
  component: AdminDashboard,
})
```

---

## Execution Order

Build personas in priority order based on the domain doc and user stories:

1. **Foundation first**: Dev tooling (PersonaSwitcher, StateDebugBar, DevToolbarProvider), shared components (StatusBadge, EmptyState, LoadingSkeleton, ErrorBanner), layout shell (AppShell, Sidebar, TopNav), mock data file, root route. Note: ef-design-system tokens and components are already set up in the boilerplate — no CSS setup needed.
2. Start with the **most common persona** — the one with the most user stories and highest daily usage
3. Then the persona who **interacts with them most** — approvals, reviews, etc.
4. Then **admin/configuration** personas
5. Then **oversight/analytics** personas
6. Finally **read-only/dashboard** personas

If unsure about priority, ask the user.

Build **all screens for one persona** before moving to the next. After each persona is complete, preview it for the user.

---

## Interactive Delivery

Use `AskUserQuestion` for all design decision points:

**Screen inventory confirmation** (after deriving screens from stories):
- Single-select per persona: "Approve this screen list" / "Add screens" / "Remove screens" / "Reorganize"

**Navigation pattern choice** (per persona):
- Single-select: present 2-3 navigation patterns as options with descriptions citing reference products

**Per-screen feedback** (after previewing each screen):
- Single-select: "Looks good, next screen" / "Needs changes" / "Scrap and redesign"

**State review** (after showing all states for a screen):
- Single-select: "All states look good" / "Empty state needs work" / "Error state needs work" / "Loading state needs work"

Never ask the user to type feedback — always provide clickable options first. The user can select "Other" to type detailed feedback when needed.

---

## Preview in Chat

After building each set of screens, display them in the Claude Preview panel so the user can see them inline.

### Steps

1. Start or reuse the dev server: call `preview_start("dev-server")` (uses the frontend Vite dev server from `.claude/launch.json`)
2. Navigate to a specific persona screen: call `preview_eval(serverId, "window.location.href = '/ic/goals'")`
3. Capture and display inline: call `preview_screenshot(serverId)`

### Showing Different Personas

```
// Switch persona via URL (PersonaSwitcher also works via click)
preview_eval(serverId, "window.location.href = '/manager'")
preview_screenshot(serverId)

// Show empty state via StateDebugBar
preview_eval(serverId, "document.querySelector('[data-state=\"empty\"]')?.click()")
preview_screenshot(serverId)
```

Always show screenshots after building each persona. Demonstrate the persona switcher by showing at least 2 personas.

---

## Theming Contract (MANDATORY — semantic tokens only)

Every mock screen must use semantic design-token utilities — never raw Tailwind color scales, hex codes, or named brand colors. The boilerplate ships a runtime theme panel; mocks must already be themeable so `ui-builder` doesn't have to rewrite them.

**Allowed color utilities**:

- Surfaces: `bg-background`, `bg-card`, `bg-muted`, `bg-surface`, `bg-popover`
- Text: `text-foreground`, `text-muted-foreground`, `text-card-foreground`
- Borders / focus: `border-border`, `border-input`, `ring-ring`, `divide-border`
- Active / selected: `bg-primary`, `text-primary`, `border-primary`, `ring-primary`, `text-primary-foreground`
- Positive / complete: `bg-success`, `text-success`, `border-success`, `text-success-foreground`
- Caution / pending: `bg-warning`, `text-warning`, `border-warning`, `text-warning-foreground`
- Destructive / overdue / error: `bg-destructive`, `text-destructive`, `border-destructive`, `text-destructive-foreground`
- Informational: `bg-info`, `text-info`, `border-info`, `text-info-foreground`
- Top navigation: `bg-navbar-bg`, `text-navbar-fg`, `bg-navbar-bg-hover`, `text-navbar-fg-hover`
- Chart series: `getChartColors()` from `@/lib/chartColors` (resolves `--chart-1..6` at render time)

**Banned** (never emit): `text-slate-*`, `bg-slate-*`, `border-slate-*`, `ring-slate-*`, `divide-slate-*` (and the same for `gray`/`zinc`/`neutral`/`stone`); any branded accent (`indigo`/`violet`/`blue`/`purple`/`sky`/`cyan`/`teal`/`emerald`/`green`/`amber`/`orange`/`yellow`/`red`/`rose`/`pink`/`fuchsia` with any suffix); `bg-white`, `text-white`, `bg-black`, `text-black`; arbitrary `text-[#...]`, `bg-[#...]`, `border-[#...]`.

**Status-word → token mapping** — choose by semantic meaning, not aesthetic:

| Status word | Token family |
|---|---|
| Complete / Approved / On track / Passed / Achieved | success |
| Pending / In review / Due soon / At risk / Draft | warning |
| Overdue / Rejected / Failed / Blocked / Escalated | destructive |
| Info / Tip / FYI / New / Beta | info |
| Selected / Active / Current | primary |

**Navbar theming (mandatory).** Follow [`.claude/skills/_shared/theme-navbar-rule.md`](../_shared/theme-navbar-rule.md) — the canonical rule for nav-surface tokens and the `<ThemeSwitcher />` mount invariant.

Before handoff, run `pnpm run theme:audit` — it must exit 0. This guarantees `ui-builder` receives a themeable mock and doesn't have to back-migrate colors.

---

## After Building All Screens

1. Present a **full inventory table** — all personas, all screens, screen counts, route paths
2. For each persona, show the **navigation pattern** chosen and why
3. List **cross-persona touchpoints** — where data flows between personas
4. Highlight **key UX decisions** and rationale
5. List any **open questions** that need stakeholder input
6. Hand off to **forger** for approval
7. After approval, update **forger** with approved designs
8. Next stage: **architect** uses React mock screens + stories to define the data model, modules, and tech stack

---

## What Carries Forward to ui-builder

When ui-builder runs after this skill, it does NOT rebuild from scratch. Instead it upgrades:

| This Skill Produces | ui-builder Upgrades To |
|---------------------|----------------------|
| `src/mocks/data.ts` (mock data) | `src/features/*/api.ts` (TanStack Query hooks) |
| `src/components/dev/PersonaSwitcher` | `src/store/auth.ts` (real JWT auth store) |
| `src/components/dev/StateDebugBar` | _(removed — states driven by real isLoading/isError)_ |
| `src/components/dev/DevToolbarProvider` | _(removed — replaced by real auth context)_ |
| `src/routes/` (mock route guards) | `src/routes/` (real `beforeLoad` guards with JWT) |
| `src/components/shared/` (StatusBadge, etc.) | `src/components/shared/` (unchanged — already production-ready) |
| `src/features/*/components/` (with mock data) | `src/features/*/components/` (consuming real API hooks) |
| Placeholder forms (no validation) | React Hook Form + Zod schemas |
| `src/mocks/types.ts` (mock types) | `src/types/` (real API response types from backend schema) |
