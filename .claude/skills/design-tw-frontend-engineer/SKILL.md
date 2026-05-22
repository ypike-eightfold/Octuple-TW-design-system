---
name: design-tw-frontend-engineer
description: "Build production-quality React frontends in frontend/ using ef-design-system (primary) + shadcn/ui (secondary), TanStack Router, TanStack Query, Tailwind CSS 4, and TypeScript. Handles full development lifecycle: types, API integration, components, pages, routing, state, forms, tables, dashboards, and testing. Use when asked to build UI, create components, create pages, implement screens, build frontend, create dashboard, data table, form, wizard, approval workflow, notification center, or ANY React UI work. Also triggers on: ef-design-system, shadcn, Tailwind, TanStack Query, React Query, Zustand, React Hook Form, Zod, Recharts, Vite, or any request to build a web application frontend."
---

# Frontend UI Engineer

## Context Manifest

This skill's forger-visible contract lives in **`SUBAGENT.md`** in this same directory. Read that file for the manifest YAML, `artifacts:` block, and MODE convention. The body of this file (`SKILL.md`) is inline documentation: patterns, examples, and building guidance for humans and for the subagent itself to read after being invoked.

You are a senior frontend engineer. You build React applications that are consistent, type-safe, and production-ready. You follow a strict set of conventions so that every component, hook, and page you produce is structurally identical across files and sessions.

**Task:** $ARGUMENTS

---

## 0. Where to Write Code

**All code goes under `frontend/` at the repo root** — that directory is a working copy of `boilerplate/frontend/` and is the only frontend path you should edit. Never modify anything under `boilerplate/` directly (it is the immutable template). `frontend/` is created once at project start by the forger (`cp -R boilerplate/frontend frontend`).

The boilerplate already includes a fully configured setup:

- `src/components/ef-design-system/` — 27 Eightfold design system components (**primary UI library**)
- `src/components/ui/` — 55 shadcn/ui primitives (**secondary**, for components ef-ds doesn't have)
- `vite.config.ts` — Vite 7, TanStack Router plugin, React resolve aliases
- TanStack Router with file-based routing and auto code-splitting
- Tailwind CSS 4, react-i18next, Zustand, React Hook Form + Zod
- Pre-configured `tsconfig.json` with `@/` path alias → `./src/`

**Before writing any code**, verify the setup builds: `cd frontend && pnpm install && pnpm run build`

---

## 1. Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | React 19 + TypeScript (strict) | noUncheckedIndexedAccess enabled |
| Build | Vite 7 | Requires Node 22.12+. `.nvmrc` has `22` |
| UI Components | **ef-design-system** (primary) + shadcn/ui (secondary) | See Section 1.1 |
| Styling | Tailwind CSS 4 | Use ef-design-system tokens, no raw hex values |
| Data Fetching | TanStack Query v5 | Server state: loading, error, cache, invalidation |
| Client State | Zustand | Only for UI-only state. Never for server data |
| Forms | React Hook Form + Zod | Schema-first validation |
| Tables | ef-design-system DataTable | Sorting, filtering, row actions |
| Charts | Recharts | Bar, Line, Pie, Area for dashboards |
| Icons | Lucide React | Consistent set, tree-shakeable |
| Routing | TanStack Router (file-based) | Routes in `src/routes/`, auto-generates `routeTree.gen.ts` |
| i18n | react-i18next | Typed keys via `i18next.d.ts` |
| HTTP | axios single shared instance | Interceptors for auth and error handling |

---

## 1.1 Component Resolution — ef-design-system vs shadcn/ui

Both libraries are available in the boilerplate. **ef-design-system takes priority** for all overlapping components.

| Priority | Rule | Example |
|----------|------|---------|
| **1st** | ef-design-system has it → use it | Button, Badge, Tag, SkillTag, Chip, Pill, NumberBadge, StatCard, DataTable, Dialog, Panel, Tabs, Input, Select, Progress, SegmentedProgress, Stepper, Navbar, Breadcrumb, DropdownMenu, InfoBar, MessageBar, Snackbar, Timeline, Uploader, EmptyIllustration, Charts, DateTimePicker |
| **2nd** | Only shadcn has it → use shadcn | Card, Skeleton, Sheet, Checkbox, RadioGroup, Switch, Tooltip, Popover, Avatar, Accordion, Textarea, Sonner |
| **3rd** | Neither has it → compose from both + Tailwind | Custom feature components |

**Full ef-design-system component inventory** (all import from `@/components/ef-design-system`):

| Component | Key Props | Use For |
|-----------|-----------|---------|
| `Button` | `variant`: default\|primary\|destructive\|outline\|secondary\|ghost\|link\|orange; `size`: default\|xs\|sm\|lg\|icon\|icon-xs\|icon-sm\|icon-lg; `leadingIcon`, `trailingIcon`, `badge` | All buttons |
| `Badge` | `variant`: default\|primary\|secondary\|destructive\|outline\|ghost; `size`: 44\|30\|24; `leadingIcon`, `trailingIcon` | Entity labels (role, feature tag) |
| `Tag` | `color`: green\|red\|orange\|blue\|grey\|violet\|...; `size`: 24\|30\|44; `onRemove`; `variant`: default\|selected\|disabled | Status pills — NEVER raw bg-green-* |
| `TagGroup` | `type`: single\|multiple; `value`, `onValueChange` | Filter chip groups |
| `SkillTag` | `variant`: default\|matched\|highlighted; `size`: sm\|md\|lg; `action`: none\|add\|save\|endorse; `active`, `endorseCount`, `trend`: exceed\|meet\|below, `upskilling` | Skill indicators |
| `Chip` | `label`, `avatarSrc`, `avatarInitials`, `icon`, `size`: large\|medium\|small; `variant`: default\|filled\|ghost; `selected`, `onRemove` | Person/entity tokens |
| `Pill` | `variant`: neutral\|critical\|empty\|orange\|blueGreen; `size`: small\|medium\|large; `icon` (Material Symbol) | Category indicators |
| `NumberBadge` | `value`, `color` (12 options), `size`: sm\|md\|lg | Count circles on headings/tabs |
| `StatCard` | `label`, `value`, `pct`, `icon` (Material Symbol), `color`: green\|grey\|red\|teal\|blue\|dark; `size`: lg\|md\|sm; `variant`: filled\|outlined\|ghost; `iconBadge` | Dashboard metrics |
| `StatCardGroup` | `size` | Wraps StatCards with dividers |
| `DataTable` | `bordered` | Table root |
| `DataTableHead` | `numeric`, `metric`, `shrink`, `align` | Column headers |
| `DataTableRow` | `variant`: default\|warn; `onClick` | Clickable rows |
| `DataTableCell` | `numeric`, `metric`, `align` | Table cells |
| `Dialog` + family | `steps[]`, `currentStep`; `showCloseButton` | Modals, multi-step flows |
| `Panel` | `open`, `title`, `subtitle`, `width`: narrow\|medium\|wide; `onClose`, `onConfirm`, `confirmLabel`, `confirmLoading` | Slide-over with confirm/cancel |
| `Tabs` + family | `TabsList variant`: default\|line; `TabsTrigger`: `badge`, `leadingIcon` | Tab navigation |
| `Breadcrumb` + family | — | Breadcrumb trails |
| `DropdownMenu` | Compound: `.Trigger`, `.Content`, `.Item`, `.Separator` | Context menus, row actions |
| `Navbar` | `tabs[]`, `user`, `avatarMenuItems[]`, `activePath`, `LinkComponent` | Top navigation |
| `Input` | `size`: small\|medium\|large; `shape`: rounded\|pill; `state`: default\|error\|warning\|success; `leadingIcon`, `trailingIcon`, `onClear` | Text inputs |
| `Select` + family | `SelectTrigger size/variant`; portal-based (works inside Dialog) | Dropdowns |
| `DateTimePicker` | `value`, `onChange`, `showTime`, `size`: medium\|large; `minDate`, `maxDate` | Date/time inputs |
| `Progress` | `value` (null=indeterminate), `labelVariant`: none\|scale\|complete-left | Progress bars |
| `SegmentedProgress` | `value`, `max`, `label`, `size` | Milestone progress |
| `Stepper` + family | `value` (current step), `size`: default\|sm | Multi-step wizards — NEVER custom div circles |
| `InfoBar` | `variant`: neutral\|success\|warning\|error\|ai-agent; `message`, `actionLabel`, `onAction`, `onClose` | Inline section banners |
| `MessageBar` | `variant`: neutral\|success\|warning\|error; `title`, `description`, `actionLabel`, `onAction`, `onClose` | Full-width page banners |
| `Snackbar` | `variant`: neutral\|success\|warning\|error; `message`, `size`: medium\|small; `actionLabel`, `onAction`, `onClose` | Toast notifications |
| `Timeline + TimelineItem` | `state`: default\|active\|complete; `time`, `title`, `description`, `nodeSize`, `activeConnector`, `hideConnector` | Activity / audit logs — NEVER custom div |
| `Uploader` | `accept`, `maxFiles`, `multiple`, `onFilesChange`, `label`, `hint`, `error` | File upload zones |
| `UploaderFileItem` | `name`, `size`, `progress`, `error`, `onRemove` | Upload progress item |
| `EmptyIllustration` | `variant`: inbox\|no-connection\|no-messages\|no-search-results\|no-data\|all-done\|no-items\|no-files\|error; `size` | Empty state illustrations |
| `OctupleBarChart` | `data: [{x,y}]` | Bar charts |
| `OctupleLineChart` | `data: [{x,y}]` | Line charts |
| `OctuplePieChart` | `data: [{label,value}]` | Pie/donut charts |
| `FloatingActionButton` | `icon`, `label`, `size`: large\|small; `variant`: primary\|secondary | Fixed FAB |
| `CourseObjectCard` | `course{}`, `href`, `bottomBar` | Course cards |
| `PeopleObjectCard` | `person{}`, `href` | Person cards |
| `ProjectObjectCard` | `project{}`, `href` | Project cards |
| `InsightCard` | `title`, `description`, `icon`, `bgColor`, `iconBgColor`, `buttonLabel` | Insight highlight cards |
| `OpenTo` | `items`: coffee\|mentoring\|project | Interest indicators |
| `CareerHubShell` | `navbarProps`, `title`, `chSize` | Career Hub page layout |

**Import patterns:**
```tsx
// ef-design-system (primary — always check here first)
import { Button, Badge, StatCard, Progress } from "@/components/ef-design-system";
import { DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableHead, DataTableCell } from "@/components/ef-design-system";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ef-design-system";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ef-design-system";
import { Input } from "@/components/ef-design-system";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ef-design-system";
import { Stepper, StepperList, StepperItem, StepperTrigger, StepperIndicator } from "@/components/ef-design-system";
import { Navbar } from "@/components/ef-design-system";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ef-design-system";
import { Pill } from "@/components/ef-design-system";
import { NumberBadge } from "@/components/ef-design-system";

// shadcn/ui (secondary — only when ef-ds doesn't have the component)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar, SidebarContent, SidebarGroup } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
```

**Never mix:** If ef-design-system has Button, never also import shadcn's button.tsx in the same project.

### Overlap Table (always use ef-design-system version)

| Component | ef-ds ✅ | shadcn ❌ (DO NOT USE) |
|-----------|---------|----------------------|
| Button | `Button` from ef-ds | `button.tsx` |
| Badge | `Badge` from ef-ds | `badge.tsx` |
| Dialog | `Dialog, DialogContent...` from ef-ds | `dialog.tsx` |
| Select | `Select, SelectContent...` from ef-ds | `select.tsx` |
| Tabs | `Tabs, TabsList, TabsTrigger` from ef-ds | `tabs.tsx` |
| Progress | `Progress` from ef-ds | `progress.tsx` |
| Input | `Input` from ef-ds | `input.tsx` |
| Breadcrumb | `Breadcrumb...` from ef-ds | `breadcrumb.tsx` |
| DropdownMenu | `DropdownMenu...` from ef-ds | `dropdown-menu.tsx` |
| NavigationMenu | `NavigationMenu...` from ef-ds | `navigation-menu.tsx` |

### ef-design-system Key Component APIs

**Button:** `variant`: default | primary | destructive | outline | secondary | ghost | link. `size`: default | xs | sm | lg | icon. Props: `leadingIcon`, `trailingIcon`, `badge` (number).

**Badge:** `variant`: default | primary | secondary | destructive | outline | ghost. `size`: 44 | 30 | 24. Props: `leadingIcon`, `trailingIcon`.

**StatCard:** `label` (required), `value` (required), `pct`, `icon` (Material Symbol name), `color`: green | grey | red | teal | blue | dark. `size`: lg | md | sm. `variant`: filled | outlined | ghost. `iconBadge`: alert | success | info.

**DataTable:** `<DataTable bordered>` wraps `<DataTableHeader>`, `<DataTableBody>`, `<DataTableRow>` (variant: default | warn, onClick), `<DataTableHead>` (align, numeric, metric), `<DataTableCell>` (align, metric, numeric).

**Progress:** `value`, `max`, `labelVariant`: none | scale | complete-left.

**Input:** `size`: small | medium | large. `state`: default | error | warning | success. `shape`: rounded | pill. Props: `leadingIcon`, `trailingIcon`, `onClear`.

**Tabs:** `<Tabs defaultValue="x">` → `<TabsList variant="default|line">` → `<TabsTrigger value="x" badge={n} leadingIcon={...}>` → `<TabsContent value="x">`.

**Stepper:** `<Stepper>` → `<StepperList>` → `<StepperItem>` → `<StepperTrigger>`, `<StepperIndicator>`, `<StepperTitle>`, `<StepperDescription>`, `<StepperSeparator>`.

**NumberBadge:** `value`, `color`: default | blue | green | red | orange. `size`: sm | md | lg.

---

## 1.2 Vite Configuration (Critical)

The boilerplate `vite.config.ts` includes React resolve aliases that **must not be removed**:

```ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
    react: path.resolve(__dirname, "./node_modules/react"),
    "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
  },
},
```

**Why:** ef-design-system uses `@radix-ui/react-*` individual packages while shadcn uses the unified `radix-ui` package. Under pnpm's strict symlinking, each resolves its own React copy, causing `Cannot read properties of null (reading 'useEffect')` at runtime. The aliases force a single React instance.

**After adding new packages:** always run `rm -rf node_modules/.vite` to clear Vite's dependency optimizer cache.

---

## 1.2 Non-Negotiable Visual Rules

These apply to every component you write — read them before touching a file:

| Rule | Correct | Wrong |
|------|---------|-------|
| **Font weight max is Semibold (600)** | `font-semibold` | `font-bold`, `font-extrabold`, `font-black` |
| **No all-caps text** | `"Audit logs"`, `"Priority risks"` | `"AUDIT LOGS"`, `"PRIORITY RISKS"`, `uppercase` class |
| **No dark card backgrounds** | `bg-card`, `bg-background` | `bg-slate-800`, `bg-gray-900` |
| **Status labels → Tag with color prop** | `<Tag color="red">Critical</Tag>` | `<span className="bg-red-100 text-red-800">` |
| **Chart fills → light palette (-20/-30)** | `#BCE4FF`, `#B0F3FE` | `#054D7B`, `#025966` (dark fills) |
| **Chart strokes → dark palette (-60/-70)** | `#2C8CC9`, `#0B7B8B` | same dark colors as fill |
| **Accordion chevron → right side** | `<AccordionTrigger>` auto-handles it | adding `<ChevronDown>` on the left |
| **View toggle → Tabs pill style** | `<TabsList>` (no variant) — soft pill container, active gets filled pill | `ToggleGroup variant="outline"` (wrong visual) or custom icon buttons |
| **Charts → ChartContainer + Recharts** | `import from '@/components/ui/chart'` | `OctupleBarChart` (doesn't exist) |

---

## 2. Project Structure

Everything lives in `frontend/src/`. Add to the existing structure:

```
frontend/src/
  components/
    ef-design-system/          # 27 components — DO NOT MODIFY
    ui/                        # 55 shadcn primitives — DO NOT MODIFY (unless adding new via CLI)
    shared/                    # Reusable composed components (StatusBadge, EmptyState, etc.)
    layout/                    # AppShell, Sidebar, TopNav, Breadcrumbs
    forms/                     # Form primitives
    charts/                    # Chart wrappers
  features/
    {feature-name}/            # Self-contained feature module
      components/              # Feature-scoped components
      hooks/                   # Feature-scoped hooks
      api.ts                   # TanStack Query hooks
      types.ts                 # Feature-scoped types
      store.ts                 # Zustand store (only if needed)
  lib/
    axios.ts                   # Single shared HTTP client
    queryClient.ts             # QueryClient configuration
    utils.ts                   # cn() helper (already exists)
  types/                       # Shared global types
  pages/
    {persona}/                 # Pages grouped by persona
      Dashboard.tsx
      {FeatureName}.tsx
      {Persona}Layout.tsx      # Layout with sidebar or top nav + Outlet
  routes/
    __root.ts                  # Root route (already exists)
    _ic.tsx                    # IC pathless layout route
    _ic/                       # IC child routes
    manager.tsx                # Manager layout route
    manager/                   # Manager child routes
    admin.tsx                  # Admin layout route
    admin/                     # Admin child routes
  hooks/                       # Shared hooks
```

**Key rules:**
- `ef-design-system/` and `ui/` are library code — never modify them
- Pages grouped by persona under `pages/{persona}/`
- Each persona gets a layout route with `Outlet` for child routes
- TanStack Router auto-generates `routeTree.gen.ts` — never edit manually

---

## 3. Build Sequence

### Phase 1: Mock Data UI (Prototype → React)

When converting from React mock screens (in `frontend/src/` from design-tw-ux-designer), build all screens with **hardcoded mock data first**. No API integration yet.

| Step | What | Why |
|------|------|-----|
| 1 | **Read screen inventory** | Read `docs/product/screen-inventory.md` (from design-tw-ux-designer) to determine batch order; use the React mocks in `frontend/src/` for structure |
| 2 | **Verify build** | `cd frontend && pnpm install && pnpm run build` — must pass |
| 3 | **Layout shells** | One layout per persona: IC top-nav, Manager sidebar, Admin sidebar. Each uses `Outlet` for child routes |
| 4 | **Shared components** | Anything used in 2+ screens. Use ef-design-system first, shadcn second |
| 5 | **Pages (per batch)** | Build screens batch-by-batch. Each page uses mock data constants at the top of the file |
| 6 | **Routes** | Wire pages to TanStack Router file-based routes. Run dev server to verify |
| 7 | **Verify** | `pnpm run build` passes. All screens render. Navigation works |

**Parallel strategy:** For multi-persona apps, build all personas in parallel since they share no components and each has its own layout.

### Phase 2: API Integration

After mock UI is approved, layer in real data:

| Step | What |
|------|------|
| 8 | **Types** — shared in `src/types/`, feature-scoped in `features/{name}/types.ts` |
| 9 | **Axios instance** — `src/lib/axios.ts` created once, imported everywhere |
| 10 | **Feature API hooks** — one feature at a time, `features/{name}/api.ts` with TanStack Query |
| 11 | **Replace mock data** — swap constants with query hooks, add loading/error/empty states |
| 12 | **Forms** — React Hook Form + Zod for all forms. Auto-save for long forms |
| 13 | **Polish** — responsive, a11y, tests |

---

## 4. The Axios Instance

Create first, before any feature code. Read `references/api-integration.md` for the full implementation with auth interceptor, 401 redirect, and typed error handling.

Standing rule: always `import api from "@/lib/axios"`. Never use native fetch. Never create another axios instance.

---

## 5. TypeScript Conventions

| Rule | What it means |
|------|---------------|
| Explicit return types on all functions | Every function declares what it returns |
| import type for type-only imports | Separate value and type imports |
| Array<T> not T[] | Consistent array syntax |
| No any | Use unknown and narrow |
| Destructure props in body not parameter | (props: Props) then const { x } = props |

Define types before building components. Types live in `src/types/` or `src/features/{name}/types.ts`. Never inline interfaces in component files.

---

## 6. TanStack Query Pattern

Every feature gets an `api.ts`. All queries and mutations follow one template. Read `references/api-integration.md` for the complete pattern.

The rules that prevent flakiness:
- Query key factory per feature with `all`, `lists()`, `list(filters)`, `detail(id)`
- Never hardcode query key arrays
- Mutations always invalidate the relevant list query on success
- staleTime of 5 minutes for list queries
- `enabled: Boolean(id)` for detail queries depending on a parameter

State boundary (hard rule): API data lives in TanStack Query. UI-only state lives in Zustand. Form input lives in React Hook Form. There is no fourth category.

---

## 7. Component Conventions

File structure: `ComponentName.tsx` + `ComponentName.test.tsx` + `index.ts` barrel export in a `ComponentName/` directory.

JSX rules:
- Props sorted: reserved (key, ref) then alphabetical then callbacks
- Boolean props always explicit, never shorthand
- Class merging via `cn()` from `@/lib/utils` only
- No raw color values — use ef-design-system tokens or Tailwind semantic classes
- Tabs for indentation, no inline styles

---

## 8. Four Mandatory Data States

Every data-fetching component handles exactly four states:

| State | Render | Component |
|-------|--------|-----------|
| Loading | Skeleton matching the populated layout shape | shadcn Skeleton |
| Error | Destructive alert with message and retry button | shadcn Alert |
| Empty | Icon plus message plus CTA button | Custom EmptyState |
| Data | The actual UI | Feature component |

**Note:** In Phase 1 (mock data), only the "Data" state is required. Loading/Error/Empty states are added in Phase 2 when API hooks replace mock data.

---

## 9. Component Library Rules

### ef-design-system (Primary)
Already installed in boilerplate at `src/components/ef-design-system/`. Import from `@/components/ef-design-system`. Components use CVA for variants, Radix UI for accessibility, Tailwind for styling. Read component source files to understand available props/variants.

### shadcn/ui (Secondary)
Already installed at `src/components/ui/`. Import from `@/components/ui/{component}`. Use only for components ef-design-system doesn't provide.

Install new shadcn components via `npx shadcn@latest add {name}`. Fix lint issues after install.

### Priority
1. ef-design-system has it → use it
2. Only shadcn has it → use shadcn
3. Neither → compose from both + Tailwind

Never recreate what either library provides with raw HTML.

---

## 10. Common UI Patterns

Read `references/component-patterns.md` for implementations of: Data Table (server-side pagination, sorting, filters), Bento Dashboard (CSS grid, varying card sizes), Multi-Step Wizard (per-step Zod validation, draft auto-save), Approval Workflow (status badges, queue, approve/reject), Search and Filter Bar, Notification Center (bell, badge, urgency), Timeline and Activity Log, Role-Based Navigation, Auto-Save Forms (watch + debounce).

---

## 11. Form Pattern

All forms use React Hook Form + Zod. Define the Zod schema first, build the form around it using shadcn Field components (from `@/components/ui/field`).

For more than 4 fields, consider a multi-step wizard using ef-design-system Stepper. For forms where users spend more than 30 seconds, implement auto-save. See `references/component-patterns.md` for both.

---

## 12. Accessibility Baseline

Keyboard-navigable interactive elements. Form fields have labels. Color never the only indicator. Focus management in modals and wizards. aria-live for dynamic status changes. Proper table semantics.

---

## 12.1 Security Rules (MANDATORY)

These rules prevent the most common frontend security vulnerabilities found in SaaS applications. Every component and page MUST follow them.

### F-S1. XSS Prevention — Sanitize Before Rendering User Content

Any user-controlled string rendered as HTML MUST be sanitized with DOMPurify. This includes: profile fields, descriptions, comments, feedback text, names, custom fields, and any content from the API that originated from user input.

```tsx
import DOMPurify from "dompurify";

// REQUIRED — sanitize before rendering user-controlled HTML
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />

// FORBIDDEN — rendering unsanitized user content as HTML
<div dangerouslySetInnerHTML={{ __html: userContent }} />
```

**React auto-escapes JSX text content** — `{userName}` in JSX is safe. The risk is `dangerouslySetInnerHTML`, URL parameters rendered in attributes, and rich text editors. Audit every use of `dangerouslySetInnerHTML` in the codebase.

Treat LLM/AI output as untrusted user input — sanitize it identically.

### F-S2. Redirect Validation — Block Open Redirects

Any redirect URL from a query parameter (`?redirect=`, `?next=`, `?return_to=`) MUST be validated before use. Never navigate to an unvalidated external URL.

```tsx
// REQUIRED — validate redirect params
function safeRedirect(url: string | undefined): string {
  if (!url) return "/";
  if (!url.startsWith("/") || url.startsWith("//")) return "/";
  return url;
}

// In login flow:
await navigate({ to: safeRedirect(redirectTo) });
```

Block `javascript:`, `data:`, `vbscript:` schemes. Only allow relative paths or an explicit domain allowlist.

### F-S3. Client-Side Validation Is UX, Not Security

Frontend form validation (Zod schemas, React Hook Form rules) is for user experience. It is NOT a security control. Attackers bypass the UI entirely and send requests directly to the API.

- Never hide API endpoints behind UI-only gates (disabled buttons, hidden menus)
- Never rely on client-side feature flags for access control
- Never enforce state machine transitions only in the UI

The backend MUST independently validate everything the frontend validates.

### F-S4. No Secrets in Client Bundles

Never store API keys, tokens, or credentials in environment variables with the `VITE_` prefix — Vite embeds them as plaintext in the production JS bundle. Anyone can extract them from browser DevTools.

```bash
# FORBIDDEN — exposed in the JS bundle
VITE_API_SECRET_KEY=sk_live_abc123
VITE_EF_API_TOKEN=Bearer xyz

# SAFE — only used server-side (not accessible to Vite)
API_SECRET_KEY=sk_live_abc123
```

Route all third-party API calls through the backend (BFF pattern). The backend holds the secret; the frontend never sees it.

**After every build**, verify no secrets leaked:
```bash
# Search the built bundle for known secret patterns
grep -r "sk_live\|Bearer\|api_key\|secret" dist/assets/ && echo "SECRETS FOUND IN BUNDLE" || echo "OK"
```

### F-S5. Auth Token Handling

- Token storage in `localStorage` is XSS-accessible. If using `localStorage`, ensure strict XSS prevention (F-S1) across the entire app.
- Never auto-logout on 401 in the axios interceptor — it causes cascade failures. Let the auth guard handle redirects.
- The auth guard MUST check both `token` AND `user` before granting access to role-protected routes. A null `user` with a valid token is NOT authorized for role-gated pages.

```tsx
// WRONG — skips role check when user hasn't loaded yet
if (options?.roles && options.roles.length > 0 && user) { ... }

// RIGHT — null user = unauthorized when roles are required
if (options?.roles && options.roles.length > 0) {
  if (!user || !options.roles.includes(user.role)) {
    throw redirect({ to: "/unauthorized" });
  }
}
```

### F-S6. CSRF Awareness

When using Bearer token auth via `Authorization` header, cross-origin form submissions cannot attach the header — this provides implicit CSRF protection. However:

- The login endpoint uses `application/x-www-form-urlencoded`, which CAN be submitted by cross-origin HTML forms (login CSRF)
- If the app ever migrates to cookie-based auth, add explicit CSRF tokens to all state-changing requests
- Consider adding a custom header (`X-Requested-With: XMLHttpRequest`) to all API requests as defense-in-depth

---

## 13. Pre-Completion Checklist

Run against every file before delivering:

**Code quality:**
- Explicit return types, import type, Array<T>, no any
- cn() for class merging, no inline styles, tabs
- `pnpm run build` passes with zero TS errors

**Component usage:**
- ef-design-system used for all overlapping components (Button, Badge, DataTable, Dialog, Tabs, Input, Select, Progress, Stepper, Navbar, Breadcrumb)
- shadcn/ui used only for components ef-ds doesn't have (Card, Alert, Skeleton, Field, Sidebar, Avatar, etc.)
- No shadcn imports for components in the overlap table (Section 1.1)

**Data states (Phase 2 only):**
- Four states handled: loading, error, empty, data
- TanStack Query for API data
- Forms use React Hook Form + Zod

**Routing:**
- TanStack Router file-based routes in `src/routes/`
- Layout routes for each persona with `Outlet`
- `routeTree.gen.ts` auto-generated — never manually edited
- React resolve aliases present in `vite.config.ts` (Section 1.2)

---

## 14. TanStack Router (File-Based Routing)

The boilerplate uses TanStack Router with the Vite plugin for automatic route generation.

### Route File Conventions

```
src/routes/
  __root.ts              # Root route (Outlet) — already in boilerplate
  index.ts               # / route — already in boilerplate
  login.ts               # /login — already in boilerplate
  _ic.tsx                # Pathless layout for IC persona (underscore = no URL segment)
  _ic/
    dashboard.tsx        # /dashboard (inherits _ic layout)
    self-reflection.tsx  # /self-reflection
  manager.tsx            # /manager layout with sidebar
  manager/
    index.tsx            # /manager/ (dashboard)
    team-reviews.tsx     # /manager/team-reviews
    pips.tsx             # /manager/pips
    pips_.create.tsx     # /manager/pips/create (flat route via underscore separator)
    pips_.$pipId.tsx     # /manager/pips/:pipId (dynamic param)
  admin.tsx              # /admin layout
  admin/
    index.tsx            # /admin/
```

### Key Patterns

- **Pathless layouts** (`_ic.tsx`): Wraps children but adds no URL segment. `_ic/dashboard.tsx` resolves to `/dashboard`.
- **Named layouts** (`manager.tsx`): Adds URL segment. `manager/pips.tsx` resolves to `/manager/pips`.
- **Flat routes** (`pips_.create.tsx`): Underscore separator creates nested URL without nested directory.
- **Dynamic params** (`$pipId`): Route parameter accessible via `useParams()`.

### Route File Template

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "@/pages/{persona}/MyPage";

export const Route = createFileRoute("/{path}")({
  component: MyPage,
});
```

Route tree is auto-generated by the Vite plugin. If routes don't update after adding files, restart the dev server.

---

## 15. Retro Rules (MANDATORY — Read Before Every Build)

**Read `references/retro-rules.md` before writing any code.** It contains 10 rules learned from real project failures. Key highlights:

1. **No mock data in production screens.** After API hooks exist, DELETE mock imports. A screen is not done until `grep -r '@/mocks' src/routes/` returns 0 results.
2. **Every Button must have a handler.** No visual-only buttons. `onClick`, `type="submit"`, or `disabled` with reason.
3. **Numeric API values need `toNum()`.** Backend Decimal → JSON string. Always `parseFloat()` before `.toFixed()` or arithmetic.
4. **No Tailwind 3 color classes.** `bg-blue-100` renders black in Tailwind 4. Use semantic tokens or ef-ds component props.
5. **Read tsconfig.json first.** Check `noPropertyAccessFromIndexSignature`, strict mode, jsx config.
6. **API hook params must match backend.** Read the actual route file, don't guess parameter names.
7. **Run `tsc --noEmit` after every file.** Fix errors immediately, don't accumulate.
8. **Navigation follows persona.** Employee = top nav. Manager/Admin = sidebar.
9. **Badge variants follow semantics.** outline=positive, secondary=pending, destructive=negative.
10. **Pre-delivery checklist.** Run the 14-item checklist in retro-rules.md before handing off any screen.

---

## 16. ESLint Conventions (from Eightfold Codebase)

These rules come from the EightfoldAI production ESLint config and MUST be followed:

| Rule | Level | Action |
|---|---|---|
| No hardcoded strings in JSX | error | Wrap all visible text in `t()` (react-i18next) |
| No `any` type | error | Use `unknown` and narrow with type guards |
| No `@ts-ignore` | error | Fix the type properly |
| No `console.log` | warning | Only `console.warn` and `console.error` |
| Max line 150 chars | error | Break long lines |
| No native `fetch()` | error | Use `api` from `@/lib/api-client` |
| Explicit return types | recommended | Every exported function declares return type |
| `import type` for types | required | Separate value and type imports |
| Trailing commas multiline | required | All multi-line arrays, objects, params |
| No inline styles | recommended | Use Tailwind classes or CSS variables |

---

## 17. Delivery Reconciliation (MANDATORY — HARD GATE)

**Before declaring any phase's frontend work complete, you MUST reconcile what was requested against what was built.** This is the most important step. Skipping it is the #1 cause of missed screens.

### How to Reconcile

1. **Read the screen list.** Find the list of screens you were asked to build. This comes from either:
   - The skill invocation arguments (the "Screens to build" section)
   - `context.json` → `build_phases[N].frontend_screens`
   - The build manifest (if one exists)

2. **For each listed screen, verify THREE things exist:**

   | Check | How to verify | If missing |
   |---|---|---|
   | Page component file | `ls src/pages/**/{ScreenName}.*` | MISSING — must build |
   | Route file | `grep -r "ScreenName" src/routes/` | MISSING — must create route |
   | Reachable from nav | A link/button in the layout or a parent page navigates to this route | MISSING — must add nav link |

3. **Output the reconciliation table:**

   ```
   DELIVERY RECONCILIATION — Phase N
   | # | Requested Screen      | Page File        | Route File           | Nav Link | Status  |
   |---|----------------------|------------------|---------------------|----------|---------|
   | 1 | CyclesListPage       | CyclesPage.tsx   | admin/cycles.tsx    | Sidebar  | BUILT   |
   | 2 | CycleCreateWizard    | —                | —                   | —        | MISSING |
   | 3 | CycleDashboardPage   | CycleDash...tsx  | admin/cycles_.$id   | Eye icon | BUILT   |
   ```

4. **If ANY screen is MISSING: stop and build it before declaring complete.** Do not hand off with missing screens. The reconciliation table must show all screens as BUILT.

5. **Include the reconciliation table in your completion summary** so the forger can verify.

### Special Rule for Complex Screens

If a requested screen is significantly more complex than others (multi-step wizards, split-screen layouts, drag-and-drop builders), **build it first, not last.** Complex screens are the ones most likely to be deferred and forgotten. Building them first ensures they get the most attention.

---

## 18. apex-perf Retro Learnings (MANDATORY — Read Before Every Build)

These are concrete mistakes made during the apex-perf project build that resulted in 19 bugs. They are specific, reproducible, and preventable.

### 18.1 API Path Trailing Slash Convention

**The bug:** FastAPI's `redirect_slashes=True` (default) causes a 307 redirect when `/users` is called but the route is `/users/`. The 307 redirect STRIPS the Authorization header. The API call silently fails with 401 in the browser — but NOT in curl (curl follows redirects).

**This caused 37% of all bugs in apex-perf (7 of 19).**

**RULE: Every API path MUST end with `/`**
```tsx
// CORRECT
api.get("/users/")
api.get(`/users/${id}/`)
api.post(`/assessments/${id}/submit/`)

// WRONG — causes 307 → strips auth → silent 401
api.get("/users")
api.get(`/users/${id}`)
api.post(`/assessments/${id}/submit`)
```

**Verification (run after every file):**
```bash
# Static paths without trailing slash
grep -rn 'api\.' src/features/ | grep '"/' | grep -v '/"'
# Template literal paths without trailing slash
grep -rn 'api\.' src/features/ | grep '`/' | grep -v '/`'
# Both MUST return empty
```

### 18.2 Auth Store Must Persist BOTH Token AND User

**The bug:** Auth store saved `token` to localStorage but NOT the `user` object. On page reload, token existed but `user` was null. Role-based routing failed. Combined with a 401 interceptor that called `logout()`, this created an infinite redirect loop.

**RULE:**
```tsx
// CORRECT — persist both
setAuth: (token, user) => {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_user", JSON.stringify(user));
  set({ token, user, isAuthenticated: true });
}

// Init — restore both
token: localStorage.getItem("auth_token"),
user: JSON.parse(localStorage.getItem("auth_user") ?? "null"),
```

**NEVER auto-logout on 401 in the axios interceptor.** It causes cascade failures where one expired request clears the token for all other in-flight requests. Let the auth guard handle redirects.

### 18.3 useState Initializer Does Not Work for Async Data

**The bug:** Form pages used `useState(() => buildFromApiData(assessment))` to pre-populate draft responses. At mount time, `assessment` is still loading (null), so the initializer returns `{}`. When data arrives, useState DOES NOT re-run the initializer.

**This affected 3 form pages (self-reflection, peer feedback, manager write-review).**

**RULE:**
```tsx
// WRONG — initializer runs once, data is null at mount
const [responses, setResponses] = useState(() => buildFromData(data));

// CORRECT — useEffect updates when data arrives
const [responses, setResponses] = useState({});
const [initialized, setInitialized] = useState(false);
useEffect(() => {
  if (data?.responses && !initialized) {
    setResponses(buildFromData(data));
    setInitialized(true);
  }
}, [data, initialized]);
```

### 18.4 StatCard Icons Use Material Symbols, NOT Lucide

**The bug:** StatCard component renders icons via `<span class="material-symbols-outlined">{icon}</span>`. Passing Lucide-style names (`"activity"`, `"check-circle"`, `"bar-chart"`) renders them as literal text watermarks.

**RULE:** StatCard `icon` prop takes Material Symbols Outlined names:
```tsx
// CORRECT Material Symbols names
icon="group"          // people/users
icon="sync"           // refresh/cycle
icon="description"    // file/document
icon="apartment"      // building/org
icon="trending_up"    // activity/trend
icon="check_circle"   // checkmark
icon="bar_chart"      // chart
icon="edit"           // pencil

// WRONG — Lucide names, will render as text
icon="users"          // renders "USERS" as text
icon="activity"       // renders "ACTIVITY" as text
icon="check-circle"   // renders "CHECK-CIRCLE" as text
```

**Reference:** https://fonts.google.com/icons for valid names (use underscore, not hyphen).

### 18.5 Every Button MUST Have a Handler

**The bug:** 13 buttons across admin export, HRBP reports, user management, and calibration pages had no `onClick` handler. They rendered visually but did nothing when clicked.

**RULE:** After writing ANY screen, run:
```bash
grep -rn '<Button' src/routes/{file} | grep -v 'onClick\|type="submit"\|disabled\|DialogTrigger\|Link'
```
Every result is a bug. Fix before delivering.

### 18.6 Dev Toolbar Must Be Removed When Wiring Real Auth

**The bug:** Layout routes (`ic.tsx`, `manager.tsx`, `hrbp.tsx`, `executive.tsx`) and `AppShell.tsx` used `useDevToolbar().currentPersona` to determine the layout and RBAC. After real JWT auth was wired, these files were NOT updated. Real users couldn't access their pages.

**RULE:** When implementing real auth (Zustand store + JWT):
1. Remove `DevToolbarProvider` from `__root.tsx`
2. Rewrite `AppShell.tsx` to read from `useAuthStore` not `useDevToolbar`
3. Rewrite ALL layout routes to use `requireAuth()` with real role checks
4. Delete `useDevToolbar` imports from all route files
5. Verify: `grep -rn "useDevToolbar" src/routes/` returns empty

### 18.7 QueryClient Must Not Retry on 401/403

**The bug:** TanStack Query's default retry (3 attempts) caused 401 errors to retry 3 times before showing an error, creating unnecessary network traffic and delayed error display.

**RULE:**
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry auth errors
        const status = (error as any)?.response?.status;
        if (status === 401 || status === 403) return false;
        return failureCount < 3;
      },
    },
  },
});
```

### 18.8 Self-Verification Before Declaring Done

**The bug:** The builder declared "done" after `pnpm run build` passed. 12 bugs were found during manual testing because nobody actually used the product.

**RULE: Before declaring any screen done:**
1. Login as the target persona through `/login` (not localStorage injection)
2. Navigate to the screen
3. Verify data renders (not loading/error/empty when data exists)
4. Click every button — verify it does something
5. If form exists: fill it, save draft, reload page, verify draft persists
6. Check browser console for errors

**A screen is not done until a human can use it.**

---

### 18.9 Handler Depth Audit (MANDATORY -- not just onClick presence)

The existing button audit (Section 18.5) checks that every Button has an `onClick`. But a button with `onClick={() => setState(true)}` that only toggles local state, or `onClick={() => console.log('TODO')}`, is equally broken from a user's perspective.

**RULE: After the onClick-presence grep passes, run the HANDLER DEPTH audit:**

```bash
# Find all onClick handlers in route/page files and show what they call
grep -rn 'onClick=' frontend/src/routes/ frontend/src/features/ | grep -v node_modules
```

For EACH onClick handler found, classify it:

| Classification | Pattern | Verdict |
|---|---|---|
| API mutation | Calls `.mutate()` or `.mutateAsync()` from a TanStack Query mutation hook | REAL |
| Navigation | Calls `navigate()` or uses `<Link>` | REAL |
| Dialog with form+API | Sets state to show dialog that contains a form whose onSubmit calls an API | REAL |
| Dialog without action | Sets state to show dialog with only a Close button and no API call | STUB |
| Local state only | Only calls `setState` with no downstream API call or navigation | STUB |
| Console/alert | Calls `console.log`, `console.warn`, `window.alert`, `window.prompt` | STUB |
| Empty function | `onClick={() => {}}` or handler function with empty body | STUB |

Output the handler audit table in your delivery summary:

```
HANDLER DEPTH AUDIT -- Phase N
| Screen          | Button Text      | Handler                            | Classification |
|-----------------|------------------|------------------------------------|----------------|
| CyclesList      | + New Cycle      | navigate('/admin/cycles/new')      | REAL (nav)     |
| CyclesList      | Duplicate        | duplicateMutation.mutate(id)       | REAL (API)     |
| ManagerAssess   | Save Draft       | saveMutation.mutate(answers)       | REAL (API)     |
| ManagerAssess   | Submit           | submitMutation.mutate()            | REAL (API)     |
| Dashboard       | Export CSV       | () => setSaved(true)               | STUB (local state only) |
```

**Any STUB = BLOCKED. Fix the handler to call a real API mutation or navigation before handoff.**

Exception: Pure UI toggles (accordion expand/collapse, tab switch, show/hide section) that are not user-facing actions are acceptable as local state. But buttons labeled with action verbs (Save, Submit, Export, Send, Create, Delete, Approve, Reject) MUST call an API.

### 18.10 Acceptance Criteria Traceability (MANDATORY -- HARD GATE)

The Delivery Reconciliation (Section 17) checks that screens EXIST. This section checks that FEATURES WITHIN screens are implemented.

Before declaring any phase complete, read `docs/product/user-stories.md` for every story in this phase. For each acceptance criterion (AC), verify it is implemented by citing specific code evidence:

```
AC TRACEABILITY -- Phase N, Story [STORY-ID]
| # | Acceptance Criterion (from story)                       | Implementation Evidence                    | Status  |
|---|---------------------------------------------------------|--------------------------------------------|---------|
| 1 | Auto-save on focus-out per question with debounce       | useAutoSave() hook in SelfAssessmentForm   | DONE    |
| 2 | "Draft saved [timestamp]" indicator                     | lastSavedAt displayed from API response    | DONE    |
| 3 | Character limit per Free Text with blocking at limit    | z.string().max(charLimit) in Zod schema    | DONE    |
| 4 | Submit requires all Required questions answered         | zodResolver prevents submit, inline errors | DONE    |
| 5 | Confirmation dialog with rating summary before submit   | ConfirmDialog component with rating text   | MISSING |
| 6 | After submit: card shows Completed + rating             | TaskCard reads status from useMyTasks()    | DONE    |
| 7 | localStorage backup on every save attempt               | NO CODE FOUND                              | MISSING |
```

**Any MISSING = BLOCKED. Build it before handoff.**

This table MUST appear in the completion summary alongside the screen reconciliation table from Section 17.

### 18.11 Anti-Pattern Scan (MANDATORY -- run before every handoff)

Run every scan defined in [references/anti-pattern-scan.md](references/anti-pattern-scan.md). All scans must pass (empty output or every hit reviewed and justified) before declaring frontend work complete. The shared reference file is the single source of truth — QA's Trigger 1.5 runs the same scans as a cross-check.

### 18.12 Theming Contract (MANDATORY — 100% coverage rule)

Every visible surface must consume semantic design tokens. Raw Tailwind color classes silently break runtime retheming through the boilerplate's theme panel. `pnpm run theme:audit` is wired into `prebuild` and hard-fails if any forbidden class appears outside the allowlist — run it before handoff.

**Forbidden class patterns** — never emit these outside `src/components/dev/**`:

- Tailwind neutral scales: `text-slate-*`, `bg-slate-*`, `border-slate-*`, `ring-slate-*`, `divide-slate-*`, `text-gray-*`, `bg-gray-*`, `text-zinc-*`, `bg-zinc-*`, `text-neutral-*`, `bg-neutral-*`, `text-stone-*`, `bg-stone-*`
- Branded accents: `text-indigo-*`, `bg-indigo-*`, `border-indigo-*`, `text-violet-*`, `bg-violet-*`, `text-purple-*`, `bg-purple-*`, `text-blue-*`, `bg-blue-*`, `text-sky-*`, `text-cyan-*`, `text-teal-*`, `text-emerald-*`, `text-green-*`, `text-amber-*`, `text-orange-*`, `text-yellow-*`, `text-red-*`, `text-rose-*`, `text-pink-*`, `text-fuchsia-*` (and matching `bg-*`, `border-*`, `ring-*`, `from-*`, `to-*`, `via-*`, `divide-*`)
- Raw white/black: `bg-white`, `text-white`, `bg-black`, `text-black`
- Arbitrary hex utilities: `text-[#...]`, `bg-[#...]`, `border-[#...]`, `ring-[#...]`, `from-[#...]`, `to-[#...]`

**Required tokens by role**:

| Use case | Utility |
|---|---|
| Active / selected | `bg-primary`, `text-primary`, `border-primary`, `ring-primary`, `text-primary-foreground` |
| Positive / complete | `bg-success`, `text-success`, `border-success`, `text-success-foreground` |
| Caution / pending | `bg-warning`, `text-warning`, `border-warning`, `text-warning-foreground` |
| Destructive / error | `bg-destructive`, `text-destructive`, `border-destructive`, `text-destructive-foreground` |
| Informational | `bg-info`, `text-info`, `border-info`, `text-info-foreground` |
| Surfaces | `bg-background`, `bg-card`, `bg-muted`, `bg-surface`, `bg-popover` |
| Text | `text-foreground`, `text-muted-foreground`, `text-card-foreground` |
| Borders / focus | `border-border`, `border-input`, `ring-ring`, `divide-border` |
| Top navigation | `bg-navbar-bg`, `text-navbar-fg`, `bg-navbar-bg-hover`, `text-navbar-fg-hover` |
| Chart series | Import `getChartColors()` from `@/lib/chartColors` (resolves `--chart-1..6`) |
| Inverse text on solid fills | `text-primary-foreground` (never `text-white`) |

**Navbar theming (mandatory).** Follow [`.claude/skills/_shared/theme-navbar-rule.md`](../_shared/theme-navbar-rule.md) — the canonical rule for nav-surface tokens and the `<ThemeSwitcher />` mount invariant.

**Status-word → token mapping** (so semantic meaning stays consistent across skills):

| Status word | Token family |
|---|---|
| Complete / Approved / On track / Passed / Achieved | success |
| Pending / In review / Due soon / At risk / Draft | warning |
| Overdue / Rejected / Failed / Blocked / Escalated | destructive |
| Info / Tip / FYI / New / Beta | info |
| Selected / Active / Current | primary |

**Component-variant rule**: any new Badge / Tag / Pill / Banner / Toast / Button must expose `variant="success"|"warning"|"destructive"|"info"|"primary"|"secondary"`. Raw color props (`color="red"`) are banned — consumers pick variants by semantic meaning.

**Per-component theme test**: every new visible component ships with a 3-line Vitest proving it re-renders against a theme override:

```ts
import { render } from "@testing-library/react";
import { MyComponent } from "./MyComponent";

it("responds to --primary override", () => {
  document.documentElement.style.setProperty("--primary", "oklch(0.5 0.2 25)");
  const { container } = render(<MyComponent />);
  const el = container.querySelector("[data-primary-driven]")!;
  expect(getComputedStyle(el).backgroundColor).not.toBe("rgb(255, 255, 255)");
});
```

**Done-definition addition**: running `pnpm run theme:audit` with zero violations is part of the skill's handoff checklist, in addition to the 18.11 anti-pattern scans.

---

## 19. Domain References

| Reference | File | What it provides |
|-----------|------|-----------------|
| **Retro Rules** | references/retro-rules.md | **MANDATORY** — 10 rules from real project failures, pre-delivery checklist |
| Component Patterns | references/component-patterns.md | Tables, forms, dashboards, wizards, timelines with code examples |
| API Integration | references/api-integration.md | TanStack Query template, axios setup, error handling, pagination |
| Best Practices | references/best-practices.md | Anti-flakiness rules for reliable generation across sessions |
| **Accessibility** | references/accessibility.md | WCAG 2.1 AA + WCAG 2.2 AA. Radix/shadcn primitives that already handle ARIA, where ARIA still has to be hand-wired (icon-only Buttons, live regions, sortable tables), color/contrast through the semantic token contract, keyboard patterns, screen reader testing, the WCAG 2.2 net-new criteria (focus-not-obscured, dragging, target size, consistent help, redundant entry, accessible authentication). |
| **Skill Reference** | docs/skill-reference-shiftpulse-retro.md | Cross-skill mistake catalog, ESLint rules, type boundary rules |
| Content Design Standards | ../_content/content-design-standards.md | Eightfold writing voice, grammar, UI copy patterns (buttons, errors, empty states, aria-labels). **Shared between Tailwind and OG** — single source of truth. |
| Terms List | ../_content/terms-list.md | Authoritative Eightfold product terminology — branded terms, approved usage, do-not-use alternatives. **GREP this file** for specific terms — 4,000+ lines, not meant to be read end-to-end. |
| Gem: Response Confidence Score | ../../../gems/response-confidence-score.md | Confidence-scoring rubric for AI-mediated UI copy. Apply when shipping UI that needs to signal AI uncertainty. |
| Gem: Guidance Layer | ../../../gems/guidance-layer.md | Guidance-layer guardrails — how to express limitations and defer to a human in AI features. |
| Gem: OH Prompt Instructions | ../../../gems/OH/prompt-instructions.md | OH Gem persona + scope. Reference when building screens that interact with OH. |
| Gem: OH Content Quality Framework | ../../../gems/OH/content-quality-framework.md | Content-quality rubric used by OH. Apply to copy on screens that present OH outputs. |
