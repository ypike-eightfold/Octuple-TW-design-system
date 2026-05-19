# Reusable Component Patterns

Production patterns for the most common SaaS UI components. Copy and adapt to your domain.

**All ef-design-system components import from the single barrel:**
```tsx
import { Button, Badge, Tag, StatCard, ... } from '@/components/ef-design-system'
```

---

## Forbidden Substitutions — Read First

Two shadcn/ui components are hidden and must never be used:

| Forbidden | Use instead |
|-----------|-------------|
| `Alert` from `@/components/ui/alert` | `InfoBar` from ef-design-system |
| `Calendar` from `@/components/ui/calendar` | `DateTimePicker` from ef-design-system |
| `window.alert()` / `window.confirm()` | `Dialog` from ef-design-system |
| Native `<select>` inside a `Dialog` | `Select` from ef-design-system (Radix portal) |
| Custom div stepper (circles + lines) | `Stepper` family from ef-design-system |
| Custom timeline div layout | `Timeline + TimelineItem` from ef-design-system |
| Raw `bg-green-*` / `bg-red-*` for status | `Tag` with `color` prop from ef-design-system |
| `OctupleBarChart` / `OctupleLineChart` / `OctuplePieChart` | These components do NOT exist — use `ChartContainer` + Recharts |
| Custom icon buttons for view toggle (list/map/grid) | `Tabs + TabsList + TabsTrigger` (default pill style, no `variant="line"`) |
| `<ChevronDown>` on left of accordion label | `AccordionTrigger` auto-renders it on the right |
| `font-bold`, `font-extrabold`, `font-black` | `font-semibold` — Octuple max weight is 600 (Semibold) |
| `uppercase` class / `text-transform: uppercase` | Sentence case on all display strings |
| Dark fills on cards (`bg-slate-800`, `bg-gray-900`) | `bg-card` or `bg-background` with `border` |

---

## Font Weights — ALWAYS enforce

| Weight | Tailwind class | When |
|--------|---------------|------|
| Regular 400 | `font-normal` | Body text, descriptions, helper text |
| Medium 500 | `font-medium` | Labels, table headers, secondary emphasis |
| Semibold 600 | `font-semibold` | Headings, page titles, strong emphasis |

**`font-bold` (700) and above are NEVER used in Octuple.** If you want something to feel bold, use `font-semibold`.

```tsx
// ✅ CORRECT
<h1 className="text-xl font-semibold">Security settings</h1>
<th className="text-xs font-medium text-muted-foreground">Match score</th>
<p className="text-sm font-normal text-muted-foreground">Last updated 3 days ago</p>

// ❌ WRONG — all of these violate the type scale
<h1 className="font-bold">...</h1>
<span className="font-extrabold">...</span>
<p className="font-black">...</p>
```

---

## Table of Contents

1. Data Table (server-side)
2. Status Badge (Tag)
3. Dashboard Metrics (StatCard)
4. Alerts and Notifications
5. Multi-Step Wizard (Stepper)
6. Auto-Save Form
7. Approval Workflow
8. Timeline / Activity Log
9. Role-Based Navigation
10. Skill Tags
11. Filter Bar
12. Empty States
13. Charts
14. Uploader
15. Notification Center

---

## 1. Data Table (Server-Side Paginated)

Use the ef-design-system DataTable for all list views.

```tsx
import {
  DataTable, DataTableHeader, DataTableBody,
  DataTableRow, DataTableHead, DataTableCell,
} from '@/components/ef-design-system'
import { Tag, Button } from '@/components/ef-design-system'
import { DropdownMenu } from '@/components/ef-design-system'
import { MoreHorizontal } from 'lucide-react'

function CandidateTable({ candidates }: { candidates: Candidate[] }): ReactElement {
  const { navigate } = useNavigate()
  return (
    <DataTable bordered>
      <DataTableHeader>
        <tr>
          <DataTableHead>Name</DataTableHead>
          <DataTableHead>Role</DataTableHead>
          <DataTableHead>Department</DataTableHead>
          <DataTableHead numeric>Match score</DataTableHead>
          <DataTableHead metric>Progress</DataTableHead>
          <DataTableHead shrink>Status</DataTableHead>
          <DataTableHead shrink>Actions</DataTableHead>
        </tr>
      </DataTableHeader>
      <DataTableBody>
        {candidates.map(c => (
          <DataTableRow key={c.id} onClick={() => navigate({ to: `/candidates/${c.id}` })}>
            <DataTableCell className="font-medium">{c.name}</DataTableCell>
            <DataTableCell>{c.role}</DataTableCell>
            <DataTableCell>{c.department}</DataTableCell>
            <DataTableCell numeric>{c.matchScore}%</DataTableCell>
            <DataTableCell metric>
              <Progress value={c.profileCompleteness} />
            </DataTableCell>
            <DataTableCell>
              <StatusTag status={c.status} />
            </DataTableCell>
            <DataTableCell>
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <Button size="icon-sm" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                  <DropdownMenu.Item onClick={() => navigate({ to: `/candidates/${c.id}` })}>View</DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => shortlist(c.id)}>Shortlist</DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item onClick={() => reject(c.id)}>Reject</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  )
}
```

**Column prop reference:**
- `numeric` — right-aligns text, applies `tabular-nums`
- `metric` — sets min-width for progress bar columns
- `shrink` — collapses width (for actions / status columns)
- `DataTableRow variant="warn"` — warning highlight on a row

**Every table must have:**
- Skeleton loading state (5 rows, matching column widths)
- `EmptyIllustration` when no results
- At least 1 sortable column
- Row click → `Panel` slide-over (not full-page navigation)

---

## 2. Status Badge (Tag)

**Always use `Tag` with a `color` prop. Never use raw Tailwind color classes.**

```tsx
import { Tag } from '@/components/ef-design-system'

// Status → color mapping
const STATUS_COLORS: Record<string, Tag['color']> = {
  // green: active, enabled, matched, approved, completed, hired
  active: 'green', enabled: 'green', matched: 'green', approved: 'green',
  completed: 'green', hired: 'green',
  // red: overdue, failed, expired, rejected, blocked, critical
  overdue: 'red', failed: 'red', expired: 'red', rejected: 'red',
  blocked: 'red', critical: 'red',
  // orange: pending, in_review, at_risk, due_soon, in_progress
  pending: 'orange', in_review: 'orange', at_risk: 'orange',
  due_soon: 'orange', in_progress: 'orange',
  // blue: submitted, shortlisted, sent
  submitted: 'blue', shortlisted: 'blue', sent: 'blue',
  // grey: draft, inactive, archived, deactivated
  draft: 'grey', inactive: 'grey', archived: 'grey', deactivated: 'grey',
} as const

function StatusTag({ status }: { status: string }): ReactElement {
  const color = STATUS_COLORS[status.toLowerCase()] ?? 'grey'
  // Convert snake_case to "Sentence case"
  const label = status.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())
  return <Tag size="24" color={color}>{label}</Tag>
}

// ❌ WRONG — these all fail at runtime theming
<span className="bg-green-100 text-green-800">Active</span>
<Badge variant="destructive">Overdue</Badge>    // Badge destructive = delete actions only
<Tag>ACTIVE</Tag>                               // never all-caps
```

---

## 3. Dashboard Metrics (StatCard)

```tsx
import { StatCard, StatCardGroup } from '@/components/ef-design-system'

// Always wrap in StatCardGroup — inserts dividers automatically
function TalentMetrics({ metrics }: { metrics: DashboardMetrics }): ReactElement {
  return (
    <StatCardGroup>
      <StatCard
        label="Total roles"
        value={metrics.totalRoles}
        icon="work"
        color="blue"
        variant="outlined"
        size="md"
      />
      <StatCard
        label="Matched candidates"
        value={metrics.matched}
        icon="check_circle"
        color="green"
        variant="outlined"
        size="md"
      />
      <StatCard
        label="At risk"
        value={metrics.atRisk}
        pct={`(${metrics.atRiskPct}%)`}
        icon="warning"
        color="red"
        variant="outlined"
        size="md"
        iconBadge="alert"
      />
      <StatCard
        label="Pending review"
        value={metrics.pending}
        icon="schedule"
        color="grey"
        variant="outlined"
        size="md"
      />
    </StatCardGroup>
  )
}
```

**Rules:**
- All `StatCard` in a group must use the same `size` — default `"md"`
- `iconBadge="alert"` shows a red dot (use for attention-required state)
- `variant="outlined"` for default dashboard use; `"filled"` for highlighted metrics
- Icon names are Material Symbol names (e.g., `"check_circle"`, `"warning"`, `"work"`)

---

## 4. Alerts and Notifications

```tsx
import { InfoBar, MessageBar, Snackbar } from '@/components/ef-design-system'

// InfoBar — inline context banner (section/form level)
<InfoBar variant="warning"
  message="This role hasn't been updated in 90 days."
  actionLabel="Update now"
  onAction={openEdit}
  onClose={dismiss}
/>

// MessageBar — full-width page banner
<MessageBar
  variant="error"
  title="Sync failed"
  description="Could not connect to your HRIS. Data may be out of date."
  actionLabel="Retry connection"
  onAction={retry}
  onClose={dismiss}
/>

// Snackbar — toast for background operation results
function showToast(): void {
  // Render in a portal/state; position fixed bottom-center
  setToast({ variant: 'success', message: 'Export ready.' })
}
<Snackbar
  variant="success"
  message="Export ready."
  onClose={() => setToast(null)}
/>
```

**Decision:**

| Situation | Component |
|-----------|-----------|
| Inline context in a form/section | `InfoBar` |
| System-level full-width banner | `MessageBar` |
| Background task result (async) | `Snackbar` |
| Critical destructive action | `Dialog` |

---

## 5. Multi-Step Wizard (Stepper)

**ALWAYS use the `Stepper` family — never build custom circles and connector lines.**

```tsx
import {
  Stepper, StepperList, StepperItem, StepperSeparator,
  StepperTrigger, StepperIndicator, StepperTitle, StepperDescription,
} from '@/components/ef-design-system'
import { Dialog, DialogContent, DialogHeader, DialogTitle,
         DialogBody, DialogFooter } from '@/components/ef-design-system'
import { Button } from '@/components/ef-design-system'

const STEPS = [
  { label: 'Basic info',    description: 'Name and department' },
  { label: 'Requirements', description: 'Skills and experience' },
  { label: 'Confirm',       description: 'Review and publish' },
]

function CreateRoleWizard(): ReactElement {
  const [step, setStep] = useState(0)
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>Add role</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new role</DialogTitle>
          </DialogHeader>

          {/* Compact stepper inside dialog */}
          <Stepper value={step} size="sm">
            <StepperList>
              {STEPS.map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <StepperSeparator />}
                  <StepperItem>
                    <StepperTrigger onClick={() => i < step && setStep(i)}>
                      <StepperIndicator />
                      <StepperTitle>{s.label}</StepperTitle>
                    </StepperTrigger>
                  </StepperItem>
                </React.Fragment>
              ))}
            </StepperList>
          </Stepper>

          <DialogBody>
            {step === 0 && <BasicInfoStep />}
            {step === 1 && <RequirementsStep />}
            {step === 2 && <ConfirmStep />}
          </DialogBody>

          <DialogFooter>
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>
            )}
            <Button
              variant={step < STEPS.length - 1 ? 'primary' : 'primary'}
              onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : submit()}
            >
              {step < STEPS.length - 1 ? 'Next' : 'Publish role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ❌ WRONG — never custom step indicators
<div className="flex items-center">
  <div className="w-8 h-8 rounded-full bg-primary">1</div>
  <div className="h-px flex-1 bg-border" />
  <div className="w-8 h-8 rounded-full bg-muted">2</div>
</div>
```

**Rules:**
- Each step validates on "Next", not on every keystroke
- "Back" preserves data (state in parent)
- Final step is a read-only review with the submit action
- Use `size="sm"` for Stepper inside Dialog

---

## 6. Auto-Save Form

```tsx
import { Input } from '@/components/ef-design-system'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { debounce } from 'lodash-es'

function AutoSaveForm(): ReactElement {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: draft })
  const saveDraft = useSaveDraft()

  // Watch all fields, debounce 2s, save
  useEffect(() => {
    const subscription = form.watch(
      debounce((values: FormValues): void => {
        saveDraft.mutate(values)
      }, 2000),
    )
    return (): void => subscription.unsubscribe()
  }, [form, saveDraft])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Goal title</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter goal title" state={form.formState.errors.title ? 'error' : 'default'} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Auto-save indicator */}
        <p className="text-xs text-muted-foreground">
          {saveDraft.isPending && 'Saving…'}
          {saveDraft.isSuccess && 'Draft saved.'}
          {saveDraft.isError && 'Failed to save. Retrying…'}
        </p>

        <Button type="submit" variant="primary">Submit</Button>
      </form>
    </Form>
  )
}
```

---

## 7. Approval Workflow

```tsx
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle,
         DialogBody, DialogFooter } from '@/components/ef-design-system'
import { Textarea } from '@/components/ui/textarea'

function ApprovalActions({ itemId }: { itemId: string }): ReactElement {
  const approve = useApproveItem()
  const reject = useRejectItem()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={approve.isPending}
        onClick={() => approve.mutate(itemId)}
      >
        Approve
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setRejectOpen(true)}>
        Reject
      </Button>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject this submission?</DialogTitle></DialogHeader>
          <DialogBody className="space-y-3">
            <p className="text-sm text-muted-foreground">The submitter will be notified with your reason.</p>
            <Textarea
              placeholder="Explain why this is being rejected…"
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={4}
            />
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={!reason.trim() || reject.isPending}
              onClick={() => reject.mutate({ itemId, reason })}
            >
              Reject submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
```

---

## 8. Timeline / Activity Log

**ALWAYS use ef-design-system `Timeline` — never build a custom div with absolute-positioned lines.**

```tsx
import { Timeline, TimelineItem } from '@/components/ef-design-system'

interface ActivityEntry {
  id: string
  state: 'default' | 'active' | 'complete'
  time: string
  title: string
  description?: string
}

function ActivityLog({ entries }: { entries: ActivityEntry[] }): ReactElement {
  return (
    <Timeline>
      {entries.map((entry, i) => (
        <TimelineItem
          key={entry.id}
          state={entry.state}
          time={entry.time}
          title={entry.title}
          description={entry.description}
          activeConnector={entry.state === 'active'}
          hideConnector={i === entries.length - 1}
        />
      ))}
    </Timeline>
  )
}

// ❌ WRONG — custom div timeline
<div className="relative">
  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
  ...
</div>
```

---

## 9. Role-Based Navigation

Top navigation is always the default. See `information-architecture.md` for when sidebar is justified.

```tsx
import { Navbar } from '@/components/ef-design-system'
import { Link, useRouterState } from '@tanstack/react-router'

// Top navigation — use Navbar from ef-design-system
function AppShell({ children }: { children: ReactNode }): ReactElement {
  const { currentPersona } = useDevToolbar()
  const config = PERSONA_NAV_CONFIG[currentPersona.id]
  const { location } = useRouterState()

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar
        tabs={config.tabs}
        user={{
          avatarType: 'initials',
          avatarInitials: currentPersona.name.split(' ').map(n => n[0]).join(''),
        }}
        avatarMenuItems={[
          { label: 'Profile', path: '/profile' },
          { label: 'Settings', path: '/settings' },
        ]}
        activePath={location.pathname}
        LinkComponent={Link}
        productName="TalentForge"
      />
      <main className="mx-auto max-w-7xl px-6 pt-16 pb-10">{children}</main>
    </div>
  )
}

// Role-filtered tabs config
const PERSONA_NAV_CONFIG = {
  ic: {
    tabs: [
      { id: 'home', label: 'Home', path: '/ic' },
      { id: 'skills', label: 'Skills', path: '/ic/skills' },
      { id: 'career', label: 'Career paths', path: '/ic/career' },
    ],
  },
  manager: {
    tabs: [
      { id: 'team', label: 'Team', path: '/manager/team' },
      { id: 'hiring', label: 'Hiring', path: '/manager/hiring' },
      { id: 'analytics', label: 'Analytics', path: '/manager/analytics' },
    ],
  },
  admin: {
    tabs: [
      { id: 'talent', label: 'Talent', path: '/admin/talent' },
      { id: 'roles', label: 'Roles', path: '/admin/roles' },
      { id: 'reports', label: 'Reports', path: '/admin/reports' },
      { id: 'settings', label: 'Settings', path: '/admin/settings' },
    ],
  },
}
```

---

## 10. Skill Tags

```tsx
import { SkillTag } from '@/components/ef-design-system'

// Skill list with add/remove
function SkillList({ skills, requiredSkills }: { skills: string[], requiredSkills: string[] }): ReactElement {
  const [saved, setSaved] = useState<Set<string>>(new Set())
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map(skill => (
        <SkillTag
          key={skill}
          variant={requiredSkills.includes(skill) ? 'matched' : 'default'}
          action="save"
          active={saved.has(skill)}
          onAction={() => setSaved(s => {
            const next = new Set(s)
            next.has(skill) ? next.delete(skill) : next.add(skill)
            return next
          })}
        >
          {skill}
        </SkillTag>
      ))}
    </div>
  )
}

// Skill gap display
function SkillGap({ skills }: { skills: Array<{ name: string; trend: 'exceed'|'meet'|'below' }> }): ReactElement {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map(s => (
        <SkillTag key={s.name} variant="matched" trend={s.trend}>{s.name}</SkillTag>
      ))}
    </div>
  )
}
```

---

## 11. Filter Bar

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
         Button } from '@/components/ef-design-system'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { SlidersHorizontal } from 'lucide-react'

function FilterBar({ filters, onChange }: FilterBarProps): ReactElement {
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Select value={filters.status} onValueChange={v => onChange({ ...filters, status: v })}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="expired">Expired</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.department} onValueChange={v => onChange({ ...filters, department: v })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All departments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All departments</SelectItem>
          <SelectItem value="engineering">Engineering</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="product">Product</SelectItem>
        </SelectContent>
      </Select>

      {/* Always "All filters" — never "More filters" — always opens Sheet */}
      <Button variant="outline" size="sm" leadingIcon={<SlidersHorizontal className="h-4 w-4" />}
              onClick={() => setFiltersOpen(true)}>
        All filters
      </Button>
    </div>

    {/* All filters panel — Sheet from shadcn/ui */}
    <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
      <SheetContent side="right" className="w-[360px]">
        <div className="space-y-6 p-6">
          <h2 className="text-base font-semibold">All filters</h2>
          {/* All filter controls */}
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

---

## 12. Accordion

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

// Chevron is ALWAYS on the RIGHT — AccordionTrigger renders it automatically.
// NEVER place a <ChevronDown> manually on the left of the label.

function SecuritySettings(): ReactElement {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="access-controls">
        <AccordionTrigger>Access controls</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {/* content */}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="audit-logs">
        <AccordionTrigger>Audit logs</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {/* content */}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="priority-risks">
        <AccordionTrigger>Priority risks</AccordionTrigger>
        <AccordionContent>
          {/* content */}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

// type="multiple" — allows multiple items open simultaneously
<Accordion type="multiple">...</Accordion>
```

**Rules:**
- Chevron is auto right-aligned by `AccordionTrigger` — do not override or duplicate it
- `AccordionContent` has `px-4 pb-4` built in — do not re-add padding
- Use `type="single" collapsible` for settings/categories, `type="multiple"` for FAQs or filter groups

---

## 12b. View Toggle (list / map / grid)

Use `Tabs` with `TabsList` (default pill style) — **NOT** `ToggleGroup variant="outline"`.

Visual: soft rounded container, active tab gets a white/light filled pill, inactive is plain text.
This is `TabsList` with no `variant` prop (the default). `variant="line"` is for page-level content tabs, not view switchers.

```tsx
import { Tabs, TabsList, TabsTrigger } from '@/components/ef-design-system'
import { LayoutList, Map, LayoutGrid } from 'lucide-react'
import { useState } from 'react'

type ViewMode = 'map' | 'list'

function MapListToggle(): ReactElement {
  const [view, setView] = useState<ViewMode>('map')

  return (
    <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
      <TabsList>
        <TabsTrigger value="map">Map</TabsTrigger>
        <TabsTrigger value="list">List</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

// With icons + labels
function GridListToggle(): ReactElement {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  return (
    <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'list')}>
      <TabsList>
        <TabsTrigger value="grid">
          <LayoutGrid className="h-4 w-4" />
          Grid
        </TabsTrigger>
        <TabsTrigger value="list">
          <LayoutList className="h-4 w-4" />
          List
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

// Icon-only (add aria-label for accessibility)
<Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
  <TabsList>
    <TabsTrigger value="grid" aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
    <TabsTrigger value="list" aria-label="List view"><LayoutList className="h-4 w-4" /></TabsTrigger>
  </TabsList>
</Tabs>
```

**Rules:**
- `TabsList` (no variant) = pill container with floating active pill — **always use this for view switchers**
- `TabsList variant="line"` = underline tabs — for page-level content tabs (Overview / Activity / Settings)
- Icon-only triggers must have `aria-label`

---

## 13. Empty States

```tsx
import { EmptyIllustration } from '@/components/ef-design-system'
import { Button } from '@/components/ef-design-system'

function EmptyRoles({ onAdd }: { onAdd: () => void }): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <EmptyIllustration variant="alert" size={200} />
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">No roles added yet</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Add roles to start matching candidates and building your talent pipeline.
        </p>
      </div>
      <Button variant="primary" onClick={onAdd}>Add role</Button>
    </div>
  )
}

function EmptySearchResults({ query }: { query: string }): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <EmptyIllustration variant="no-search-results" size={200} />
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">No results for "{query}"</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
      </div>
    </div>
  )
}

// Illustration variants:
// 'conversations' | 'no-data' | 'no-documents' | 'no-search-results'
// 'no-successor' | 'tasks-complete' | 'technical-error'
// 'unclaimed-profile' | 'alert'
// Legacy aliases auto-mapped: 'inbox'→'no-data', 'no-connection'→'technical-error',
//   'no-messages'→'conversations', 'all-done'→'tasks-complete',
//   'no-items'→'alert', 'no-files'→'no-documents', 'error'→'technical-error'
```

---

## 13. Charts

Charts use `ChartContainer` + `ChartTooltip` + `ChartLegend` from `@/components/ui/chart` (Recharts wrapper).
**`OctupleBarChart`, `OctupleLineChart`, `OctuplePieChart` do NOT exist — never use them.**

### Color rules — ALWAYS follow

| Usage | Color scale | Examples |
|-------|------------|---------|
| **Fill** (bar fill, pie slice, area) | **Light -20 / -30** | `#BCE4FF`, `#B0F3FE`, `#CACFFC`, `#B9F4E4`, `#EAD3E8` |
| **Stroke / border** | **Dark -60 / -70** | `#2C8CC9`, `#0B7B8B`, `#5962B7`, `#3D8F79`, `#975590` |

Dark colors are **only** for strokes. Never use `#054D7B`, `#025966`, `#2B3271` etc. as fills.

### Bar Chart

```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const chartConfig: ChartConfig = {
  engineering: { label: 'Engineering', color: '#BCE4FF' },   // light fill
  design:      { label: 'Design',      color: '#B0F3FE' },
}

const data = [
  { month: 'Jan', engineering: 23, design: 15 },
  { month: 'Feb', engineering: 28, design: 19 },
]

<ChartContainer config={chartConfig} className="h-64 w-full">
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-grey-20)" />
    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-grey-60)' }} />
    <YAxis tick={{ fontSize: 12, fill: 'var(--color-grey-60)' }} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="engineering" fill="#BCE4FF" stroke="#2C8CC9" strokeWidth={1} radius={[4, 4, 0, 0]} />
    <Bar dataKey="design"      fill="#B0F3FE" stroke="#0B7B8B" strokeWidth={1} radius={[4, 4, 0, 0]} />
  </BarChart>
</ChartContainer>
```

### Line Chart

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

const chartConfig: ChartConfig = {
  hires: { label: 'Hires', color: '#2C8CC9' },   // lines use stroke color, no fill
}

<ChartContainer config={chartConfig} className="h-64 w-full">
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-grey-20)" />
    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-grey-60)' }} />
    <YAxis tick={{ fontSize: 12, fill: 'var(--color-grey-60)' }} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Line type="monotone" dataKey="hires" stroke="#2C8CC9" strokeWidth={2} dot={{ fill: '#BCE4FF', stroke: '#2C8CC9', strokeWidth: 2 }} />
  </LineChart>
</ChartContainer>
```

### Donut Chart

```tsx
import { PieChart, Pie, Cell } from 'recharts'

// innerRadius creates the donut hole — always set it for donut charts
const data = [
  { name: 'Engineering', value: 45 },
  { name: 'Design',      value: 20 },
  { name: 'Product',     value: 35 },
]
const FILLS   = ['#BCE4FF', '#B0F3FE', '#CACFFC']  // light fills
const STROKES = ['#2C8CC9', '#0B7B8B', '#5962B7']  // dark strokes

const chartConfig: ChartConfig = {
  Engineering: { label: 'Engineering', color: '#BCE4FF' },
  Design:      { label: 'Design',      color: '#B0F3FE' },
  Product:     { label: 'Product',     color: '#CACFFC' },
}

<ChartContainer config={chartConfig} className="h-64 w-full">
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      innerRadius={60}   // ← this creates the donut hole
      outerRadius={90}
      paddingAngle={2}
      dataKey="value"
    >
      {data.map((_, i) => (
        <Cell key={i} fill={FILLS[i % FILLS.length]} stroke={STROKES[i % STROKES.length]} strokeWidth={1.5} />
      ))}
    </Pie>
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
  </PieChart>
</ChartContainer>
```

---

## 14. Uploader

```tsx
import { Uploader, UploaderFileItem } from '@/components/ef-design-system'

function ResumeUploader(): ReactElement {
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState<Record<string, number>>({})
  const upload = useUploadResume()

  const handleFiles = async (newFiles: File[]): Promise<void> => {
    setFiles(newFiles)
    for (const file of newFiles) {
      const formData = new FormData()
      formData.append('file', file)
      upload.mutate(formData, {
        onSuccess: () => setProgress(p => ({ ...p, [file.name]: 100 })),
      })
    }
  }

  return (
    <Uploader
      accept=".pdf,.docx"
      maxFiles={1}
      multiple={false}
      onFilesChange={handleFiles}
      label="Drop your resume here or click to upload"
      hint="PDF or Word, max 10 MB"
    >
      {files.map(file => (
        <UploaderFileItem
          key={file.name}
          name={file.name}
          size={`${(file.size / 1024 / 1024).toFixed(1)} MB`}
          progress={progress[file.name]}
          onRemove={() => setFiles(f => f.filter(x => x.name !== file.name))}
        />
      ))}
    </Uploader>
  )
}
```

---

## 15. Notification Center

Bell icon with dropdown panel. Notification colors use semantic tokens — never raw Tailwind color classes.

```tsx
import { Button, Snackbar } from '@/components/ef-design-system'
import { Bell } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// Urgency color classes — semantic tokens only
const URGENCY_CLASSES = {
  critical: 'text-destructive bg-destructive/10 border-l-destructive',
  warning:  'text-warning bg-warning/10 border-l-warning',
  info:     'text-info bg-info/10 border-l-info',
  success:  'text-success bg-success/10 border-l-success',
} as const

function NotificationCenter(): ReactElement {
  const { data: notifications } = useNotifications()
  const unreadCount = notifications?.filter(n => !n.read).length ?? 0
  const markAllRead = useMarkAllRead()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Notifications</h3>
          <Button variant="link" size="sm" onClick={() => markAllRead.mutate()}>
            Mark all read
          </Button>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications?.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No notifications</p>
          ) : (
            notifications?.map(n => (
              <div
                key={n.id}
                className={cn(
                  'border-b border-l-4 px-4 py-3 transition-colors cursor-pointer hover:bg-muted/50',
                  URGENCY_CLASSES[n.urgency],
                  !n.read && 'font-medium',
                )}
                onClick={() => { markRead(n.id); navigate(n.href) }}
              >
                <p className="text-sm">{n.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatRelativeDate(n.timestamp)}</p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

**Urgency → semantic token mapping:**

| Urgency | Token classes | When |
|---------|--------------|------|
| Critical | `text-destructive bg-destructive/10` | Overdue, failed, blocked |
| Warning | `text-warning bg-warning/10` | Due soon (48h), at risk |
| Info | `text-info bg-info/10` | New assignment, update |
| Success | `text-success bg-success/10` | Completed, approved |
