---
name: ui-builder
description: >
  Upgrades React mock screens (produced by design-tw-ux-designer) into production-ready frontend code.
  Replaces mock data with TanStack Query API hooks, adds form validation (React Hook Form + Zod),
  wires real JWT authentication, removes dev tooling, and adds unit tests.
  Use this skill when the user wants to build the production UI, wire up APIs, implement the frontend,
  add form validation, or connect the React screens to the backend.
  Always trigger after architect produces an approved architecture (including API spec) and after
  design-tw-ux-designer produces approved mock screens.
  Also triggers when the user says "build the UI", "wire up the APIs", "implement the frontend",
  "connect to the backend", "add validation", or "make it production-ready".

---

## Context Manifest

```yaml
unit_type: feature_cluster
mode: build          # forger overrides to `plan` for pre-build plan invocations
required_inputs:
  - docs/architecture/system.md
  - context.json#build_phases[current]
per_unit_inputs:
  - docs/architecture/api.md#<unit>
  - docs/product/stories/<story-ids-in-cluster>
  - frontend/src/features/<unit>/
forbidden_paths:
  - docs/product/market-research.md
  - docs/product/user-stories.md
  - backend/
conditional_loads:
  - path: .claude/skills/ui-builder/references/retro-lessons.md
    when: unit_touches(auth|dev-toolbar|async-forms|trailing-slashes)
budget_tokens: 900000
outputs:
  - frontend/src/features/<unit>/api.ts
  - frontend/src/features/<unit>/index.ts   # barrel file; concrete components/pages filenames vary per cluster and are reported in files_written
artifacts:
  pre_build_plan:   docs/phases/phase-<N>/plans/frontend.md    # MODE: plan only
  summary:          docs/phases/phase-<N>/build/frontend/<unit>.md
  return_contract:  docs/phases/phase-<N>/build/frontend/<unit>.return.json
  tracker_slice:    docs/phases/phase-<N>/tracker-slices/frontend-<unit>.md
```

## MODE Convention

Forger sets `MODE: plan` or `MODE: build` in the Task prompt. **The Task-prompt `MODE:` header always takes precedence over the manifest's `mode:` default** (see `_shared/manifest-format.md` §MODE Convention → Precedence).

### MODE: plan
Write ONLY the pre-build plan at `artifacts.pre_build_plan` (see manifest). No code changes. No writes to `outputs:` paths. No summary, tracker slice, or return contract.

The plan must contain these seven required section headers:
1. Header · 2. Feature Cluster Grouping · 3. Per-Cluster Detail · 4. Global Frontend Changes · 5. Design Deviations from Mocks · 6. Out of Scope · 7. Open Questions for User

Target length ~600–800 words. This is what the user reviews at the **plan mini-gate** before any code is written.

On completion return `status: complete` with `artifact_paths.pre_build_plan` set and the other `artifact_paths.*` null.

### MODE: build
Read the approved plan from `artifacts.pre_build_plan` — forger guarantees it exists and was approved at the plan mini-gate. Then:
1. Write code to the paths declared in `outputs:` (manifest).
2. Write the per-unit summary at `artifacts.summary` (≤300 words) with these 10 headers: Unit ID + status, Files Created, Files Modified, Routes Added, API Hooks Wired, Forms + Zod Schemas, Zustand State, Deviations, Known UI Issues, Testing Notes.
3. Write the tracker slice at `artifacts.tracker_slice`.
4. Write the JSON return contract at `artifacts.return_contract` per `_shared/return-contract.md`.

Never write code in `MODE: plan`. Never overwrite the pre-build plan in `MODE: build` — it is already approved and immutable for this phase.

## Running as a Subagent

This skill is invoked by **forger** as a Task-tool subagent, one **feature cluster** (2-4 related screens) per invocation. You receive:
- A `UNIT:` identifier (e.g., `goals`, `reviews`, `calibration`)
- A `LOAD THESE FILES:` list of paths (read them yourself using Read — do NOT expect their content in the prompt)
- A `PRIOR DECISIONS:` block containing decisions made by sibling subagents in the same phase
- A `CONTEXT BUDGET:` ceiling you must stay under

When finished:
1. Write all source files to disk under the paths declared in `outputs`.
2. Write a <300-word summary markdown at `docs/phases/phase-<N>/build/frontend/<unit>.md`.
3. Write a completeness-tracker slice at `docs/phases/phase-<N>/tracker-slices/frontend-<unit>.md`.
4. Write the JSON return contract (schema at `.claude/skills/_shared/return-contract.md`) at the `artifacts.return_contract` path declared in the manifest.
5. Do NOT call AskUserQuestion — forger owns all user-facing gates. Use `status: blocked` in the return JSON if you need clarification.

## Critical Conventions (inline — always loaded)

These are the hard rules. If your unit involves auth, dev toolbar, async form state, or API paths — **also load `references/retro-lessons.md`** for the full apex-perf retro (cause + example fixes).

1. **API trailing slashes are mandatory.** Every call ends in `/`. Verify before return: `grep -rn 'api\.' src/features/<unit>/ | grep '"/' | grep -v '/"'`
2. **Auth: persist BOTH token and user to localStorage.** Not one without the other. Causes infinite redirect loops.
3. **Dev toolbar removal belongs to Phase 0, not Phase 5.** If your unit IS Phase 0, you own the removal. Otherwise assume it's gone.
4. **Never `useState(() => fromApi(...))` for async data.** Use `useEffect` + an `initialized` sentinel. Initializer runs once and won't update when the API resolves.
5. **Every `<Button>` must have an onClick or be a submit/disabled/DialogTrigger.** No placeholders, no `// TODO onClick`.
6. **Self-test before returning.** Login as the persona, navigate every screen in the cluster, click every button, save/reload a form if one exists.

---

# UI Builder (Upgrade Mode)

Upgrades existing React mock screens into production-ready frontend code. The mock screens — built by design-tw-ux-designer with shadcn/ui, TanStack Router, Tailwind, and Octuple tokens — already contain all layouts, navigation, shared components, and data states. This skill adds the production layer: real API integration, form validation, authentication, and tests.

## Pre-conditions

Confirm via forger:
- ✅ React mock screens approved (from design-tw-ux-designer — code exists in `frontend/src/`)
- ✅ API spec approved (from architect — endpoints, schemas, RBAC defined)
- ✅ Personas confirmed

If any are missing, stop and ask the user to complete the prior stage first.

---

## What Already Exists (from design-tw-ux-designer)

The mock screens provide a complete visual foundation:

| What Exists | Location |
|-------------|----------|
| Shared components (StatusBadge, EmptyState, ProgressBar, etc.) | `src/components/shared/` |
| Layout shell (AppShell, Sidebar, TopNav) | `src/components/layout/` |
| Dev tooling (PersonaSwitcher, StateDebugBar) | `src/components/dev/` |
| Feature components with mock data | `src/features/*/components/` |
| Feature pages with state handling | `src/features/*/pages/` |
| File-based routes | `src/routes/` |
| Mock data and types | `src/mocks/` |
| Octuple design tokens CSS | `src/styles/octuple-tokens.css` |

**Do NOT rebuild these from scratch.** Upgrade them in place.

---

## Output Path

All frontend code stays under `frontend/`. This skill modifies existing files and adds new ones (API hooks, stores, validation schemas, tests).

## Tech Stack

Same as mock screens, plus production additions:

| Layer | Choice | Status |
|-------|--------|--------|
| Framework | React 19 + TypeScript 5.9 (strict) | Already set up |
| Build | Vite 7 | Already set up |
| UI Components | shadcn/ui + Radix UI | Already in use |
| Styling | Tailwind CSS 4 + Octuple tokens | Already in use |
| Routing | TanStack Router (file-based) | Already in use |
| Icons | Lucide React | Already in use |
| **Data Fetching** | **TanStack Query v5** | **NEW — add now** |
| **Client State** | **Zustand** | **NEW — add now** |
| **Forms** | **React Hook Form + Zod** | **NEW — add now** |
| **HTTP Client** | **axios** | **NEW — add now** |
| **Charts** | **Recharts** | **NEW — add where needed** |

---

## Upgrade Sequence

### Phase 0: API Layer Foundation

Before upgrading any feature, set up the production infrastructure:

1. **Create axios instance** at `src/lib/axios.ts` — single shared instance with auth header injection
2. **Create QueryClient config** at `src/lib/queryClient.ts` — 5-minute staleTime default
3. **Create auth store** at `src/store/auth.ts` — Zustand store for JWT token + user profile
4. **Wire providers** — Add `QueryClientProvider` in `src/App.tsx` or root layout
5. **Create shared API types** at `src/types/api.ts` — response wrappers, pagination, error shapes (derived from architect's API spec)

```tsx
// src/lib/axios.ts
import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  // Read from store first, fall back to localStorage if store hasn't hydrated yet
  const token = useAuthStore.getState().token ?? localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// DO NOT auto-logout on 401 — causes cascade failures.
// Let auth guard handle redirects.
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
```

### Phase 1-N: Feature-by-Feature Upgrade

For each feature cluster (in the same order design-tw-ux-designer built them):

#### Step 1: Create API hooks

Create `src/features/{feature}/api.ts` with TanStack Query hooks:

```tsx
// src/features/goals/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { Goal, CreateGoalPayload } from './types'

export const goalKeys = {
  all: ['goals'] as const,
  lists: () => [...goalKeys.all, 'list'] as const,
  list: (filters: GoalFilters) => [...goalKeys.all, 'list', filters] as const,
  detail: (id: string) => [...goalKeys.all, 'detail', id] as const,
}

export function useGoals(filters: GoalFilters = {}) {
  return useQuery({
    queryKey: goalKeys.list(filters),
    queryFn: async (): Promise<Array<Goal>> => {
      const { data } = await api.get('/goals/', { params: filters })  // ALWAYS trailing slash
      return data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateGoalPayload): Promise<Goal> => {
      const { data } = await api.post('/goals/', payload)  // ALWAYS trailing slash
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() })
    },
  })
}
```

#### Step 2: Replace mock data imports in page components

Change each page from reading DevToolbarProvider state + mock data to using TanStack Query hooks:

**Before (mock):**
```tsx
const { currentState } = useDevToolbar()
if (currentState === 'loading') return <GoalsLoadingSkeleton />
if (currentState === 'error') return <ErrorBanner ... />
if (currentState === 'empty') return <EmptyState ... />
return <GoalsList goals={mockGoals.ic} />
```

**After (production):**
```tsx
const { data: goals, isLoading, isError, error, refetch } = useGoals()
if (isLoading) return <GoalsLoadingSkeleton />
if (isError) return <ErrorBanner message={error.message} onRetry={() => refetch()} />
if (!goals?.length) return <EmptyState ... />
return <GoalsList goals={goals} />
```

The skeleton, empty state, and error components are **already built** — just swap the data source.

#### Step 3: Add form validation

Replace placeholder forms with React Hook Form + Zod:

```tsx
// src/features/goals/components/GoalForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const goalSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Please provide more detail'),
  dueDate: z.string().min(1, 'Due date is required'),
})

type GoalFormValues = z.infer<typeof goalSchema>

export function GoalForm({ onSubmit }: { onSubmit: (data: GoalFormValues) => void }) {
  const form = useForm<GoalFormValues>({ resolver: zodResolver(goalSchema) })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {/* ... form fields with error display ... */}
    </form>
  )
}
```

#### Step 4: Wire real route guards

Replace mock persona-based guards with real JWT role checks:

**Before (mock):**
```tsx
beforeLoad: () => {
  const persona = getCurrentPersona()
  if (persona !== 'hr-admin') throw redirect({ to: '/' })
}
```

**After (production):**
```tsx
beforeLoad: () => {
  const user = useAuthStore.getState().user
  if (!user || user.role !== 'HR_ADMIN') throw redirect({ to: '/unauthorized' })
}
```

### Final Phase: Tests + Polish

After all features are upgraded:

1. **Add unit tests**: For shared components, API hooks, and critical feature components
2. **Run lint + type check**: `pnpm run lint && pnpm run build`
3. **Run button audit**: `grep -rn '<Button' src/routes/ | grep -v 'onClick\|type="submit"\|disabled\|DialogTrigger'`
4. **Run trailing slash audit**: `grep -rn 'api\.' src/features/ | grep '"/' | grep -v '/"'`
5. **Test each persona login → navigate → click → form persistence** through the UI

**NOTE: Dev toolbar removal and mock data cleanup happen in Phase 0, not here.**
**Dev toolbar was the #2 bug source in apex-perf because it was deferred to the last phase and never executed.**

---

## Build Order

Since layouts, shared components, and routes already exist, the build order focuses on **API wiring**:

| Phase | Name | What Happens |
|-------|------|-------------|
| 0 | **API Foundation + Auth + Cleanup** | API plumbing, auth store, RBAC, and dev-tooling cleanup — see tasks below |
| 1 | **Most-used persona features** | IC goals, IC dashboard — validate the API pattern works |
| 2 | **Cross-persona features** | Reviews, feedback — data flows between personas |
| 3 | **Admin features** | Cycle management, user admin — complex forms, CRUD |
| 4 | **Analytics/dashboards** | Charts, reports — read-only, last priority |
| 5 | **Cleanup** | Add tests, final visual polish |

Each phase should be approved before proceeding to the next.

### Phase 0 tasks

- axios instance + `QueryClient`, API type definitions, provider wiring.
- Auth store with `localStorage` persistence for **both** token and user.
- Real RBAC in every layout route; role-based redirect in `index.tsx`; logout button.
- **Remove** `DevToolbarProvider` from `__root.tsx`, `AppShell`, and every layout route.
- **Preserve** `<ThemeSwitcher />` in `src/App.tsx`. It's production-safe — `VITE_ENABLE_THEME_PANEL=false` is the kill switch for customer builds, not removal.

---

## Cross-Cutting Rules

1. **Incremental delivery** — Present work feature by feature. Get user feedback before proceeding to the next.
2. **Don't break what works** — The mock screens render correctly. Upgrades should preserve visual fidelity.
3. **Research awareness** — Check for the market research brief (`docs/product/market-research.md`) and use competitor insights to inform UX decisions.
4. **Enterprise depth** — All outputs should be production-grade for enterprise scale.
5. **No emoji in production artifacts** — Use text labels and SVG icons.
6. **State boundary (hard rule)** — API data in TanStack Query. UI-only state in Zustand. Form state in React Hook Form. No fourth category.
7. **Design system compliance** — All styling continues to use Octuple tokens via `var()` — never raw hex or `@theme` utilities.
8. **Token translation pass (MANDATORY)** — Before emitting production code, scan every upgraded file for hardcoded Tailwind color classes and rewrite them to semantic token utilities. Reject migration if any raw hex or Tailwind color scale survives. Mapping cheat-sheet:

   | From | To |
   |---|---|
   | `text-slate-*`, `text-gray-*`, `text-zinc-*`, `text-neutral-*` (700+) | `text-foreground` |
   | Same at 300–600 | `text-muted-foreground` |
   | `bg-white`, `bg-slate-50` | `bg-background` |
   | `bg-slate-100`, `bg-gray-100` | `bg-muted` |
   | `border-slate-*`, `border-gray-*` | `border-border` |
   | `text-indigo-*`, `text-violet-*`, `text-blue-*`, `text-purple-*` | `text-primary` |
   | `bg-indigo-*`, `bg-violet-*`, `bg-blue-*`, `bg-purple-*` | `bg-primary` |
   | `text-white` (on solid colored fill) | `text-primary-foreground` |
   | `text-emerald-*`, `text-green-*` | `text-success` |
   | `bg-emerald-*`, `bg-green-*` | `bg-success` |
   | `text-amber-*`, `text-orange-*`, `text-yellow-*` | `text-warning` |
   | `bg-amber-*`, `bg-orange-*`, `bg-yellow-*` | `bg-warning` |
   | `text-red-*`, `text-rose-*`, `text-pink-*` | `text-destructive` |
   | `bg-red-*`, `bg-rose-*`, `bg-pink-*` | `bg-destructive` |
   | `text-sky-*`, `text-cyan-*`, `text-teal-*` | `text-info` |
   | `bg-sky-*`, `bg-cyan-*`, `bg-teal-*` | `bg-info` |
   | Chart hardcoded hex | `getChartColors()` from `@/lib/chartColors` |
   | Top nav surfaces | `bg-navbar-bg`, `text-navbar-fg`, `bg-navbar-bg-hover`, `text-navbar-fg-hover` |

   **Navbar theming (mandatory).** Follow [`.claude/skills/_shared/theme-navbar-rule.md`](../_shared/theme-navbar-rule.md) — the canonical rule for nav-surface tokens and the `<ThemeSwitcher />` mount invariant.

   Run `pnpm run theme:audit` before handoff; it must exit 0.

---

## After Building UI

1. Present a screen inventory with route list
2. Show key API integration patterns
3. Highlight any UX decisions made during upgrade
4. Hand off to **forger** for approval
5. After approval, update **forger**
