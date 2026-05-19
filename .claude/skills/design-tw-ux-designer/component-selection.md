# Component Selection Rules

The complete decision guide for choosing ef-design-system components. All UI is built from the components listed here. When a component exists in ef-design-system, use it — never build a custom equivalent.

**Import path for all ef-design-system components:**
```tsx
import { Button, Badge, StatCard, ... } from '@/components/ef-design-system'
```

---

## Component Decision Table

Quick lookup: what to use for each UI need.

| UI Need | Component | Import |
|---------|-----------|--------|
| Status indicator (active/pending/etc.) | `Tag` with color class | ef-design-system |
| Count badge on button or tab | `NumberBadge` or Button `badge` prop | ef-design-system |
| Small label on entity | `Badge` | ef-design-system |
| Primary action | `Button variant="primary"` | ef-design-system |
| Secondary / cancel action | `Button variant="outline"` | ef-design-system |
| Destructive action | `Button variant="destructive"` | ef-design-system |
| Ghost / icon-only | `Button variant="ghost" size="icon"` | ef-design-system |
| Info / warning / error banner (page-level) | `InfoBar` | ef-design-system |
| Full-width section alert with title | `MessageBar` | ef-design-system |
| Toast / snackbar notification | `Snackbar` | ef-design-system |
| Confirmation / modal | `Dialog` | ef-design-system |
| Slide-over detail panel | `Panel` | ef-design-system |
| Slide-over filters / secondary content | `Sheet` | @/components/ui/sheet |
| Date picker | `DateTimePicker` | ef-design-system |
| Text input | `Input` | ef-design-system |
| Dropdown select | `Select + SelectTrigger + ...` | ef-design-system |
| Tab navigation | `Tabs + TabsList + TabsTrigger` | ef-design-system |
| Breadcrumb trail | `Breadcrumb + BreadcrumbItem + ...` | ef-design-system |
| Top navigation bar | `Navbar` | ef-design-system |
| Multi-step wizard indicator | `Stepper + StepperList + ...` | ef-design-system |
| Progress bar | `Progress` | ef-design-system |
| Milestone / step progress | `SegmentedProgress` | ef-design-system |
| Data table | `DataTable + DataTableHeader + ...` | ef-design-system |
| Dashboard metric | `StatCard` | ef-design-system |
| Metric group (row of stats) | `StatCardGroup` | ef-design-system |
| Activity / audit timeline | `Timeline + TimelineItem` | ef-design-system |
| Skill indicator | `SkillTag` | ef-design-system |
| Filter chip / selection tag | `Tag` / `TagGroup` | ef-design-system |
| Person/avatar chip | `Chip` | ef-design-system |
| Category pill | `Pill` | ef-design-system |
| Count number in small circle | `NumberBadge` | ef-design-system |
| File upload zone | `Uploader + UploaderFileItem` | ef-design-system |
| Empty state illustration | `EmptyIllustration` | ef-design-system |
| Bar chart | `OctupleBarChart` | ef-design-system |
| Line chart | `OctupleLineChart` | ef-design-system |
| Pie / donut chart | `OctuplePieChart` | ef-design-system |
| Career Hub page shell | `CareerHubShell` | ef-design-system |
| Floating add button | `FloatingActionButton` | ef-design-system |
| Dropdown menu | `DropdownMenu` | ef-design-system |
| Course card | `CourseObjectCard` | ef-design-system |
| Person card | `PeopleObjectCard` | ef-design-system |
| Project card | `ProjectObjectCard` | ef-design-system |
| Insight highlight card | `InsightCard` | ef-design-system |
| Mentor highlight card | `MentorInsightCard` | ef-design-system |
| "Open to" indicators | `OpenTo` | ef-design-system |
| Decorative page background | `ProductBackground` | ef-design-system |

---

## Forbidden Substitutions

**Never use these. Use the ef-design-system equivalent instead.**

| Forbidden | Reason | Use instead |
|-----------|--------|-------------|
| `Alert` from `@/components/ui/alert` | Unstyled shadcn, doesn't match DS | `InfoBar` |
| `Calendar` from `@/components/ui/calendar` | Raw shadcn calendar | `DateTimePicker` |
| `window.alert()` / `window.confirm()` | Breaks in React, OS-styled | `Dialog` |
| `window.prompt()` | Same | `Dialog` with `Input` |
| Custom `<div>` stepper with circles + lines | Inconsistent, not accessible | `Stepper` family |
| Custom timeline with absolute-positioned lines | Inconsistent | `Timeline + TimelineItem` |
| `<select>` native element | Renders behind modals | `Select` from ef-design-system |
| Raw `bg-green-*`, `bg-red-*` for status | Bypasses token system | `Tag` with color class |
| `OctupleBarChart` / `OctupleLineChart` / `OctuplePieChart` | These components do not exist | `ChartContainer` + Recharts primitives from `@/components/ui/chart` |
| Custom icon buttons for list/map/grid toggle | Inconsistent, not accessible | `Tabs + TabsList + TabsTrigger` (default pill style, no `variant="line"`) |
| `<ChevronDown>` on left of accordion label | DS positions chevron on the right | Let `AccordionTrigger` handle it — chevron is auto right-aligned |
| `font-bold`, `font-extrabold`, `font-black` | Not in Octuple type scale | `font-semibold` (600) for all strong emphasis |
| `text-transform: uppercase` / `uppercase` class | No all-caps in DS | Sentence case on all display strings |
| Dark fills on cards (`bg-slate-800`, `bg-gray-900`) | Breaks light DS aesthetic | `bg-card` or `bg-background` with `border` |

---

## 1. Alerts and Notifications

### InfoBar — Inline Banners (page/section level)
```tsx
import { InfoBar } from '@/components/ef-design-system'

<InfoBar variant="neutral"  message="Your draft was auto-saved." />
<InfoBar variant="success"  message="Review submitted successfully." />
<InfoBar variant="warning"  message="Deadline in 2 days. Complete your review." onClose={dismiss} />
<InfoBar variant="error"    message="We couldn't save your changes. Try again." onAction={retry} actionLabel="Retry" />
<InfoBar variant="ai-agent" message="AI matched 12 candidates to this role." />
```

### MessageBar — Full-Width Section Banners
```tsx
import { MessageBar } from '@/components/ef-design-system'

// Full-width rectangular banner for page-level system messages
<MessageBar variant="warning" title="Action required" description="Please review the updated policy before the deadline." />
<MessageBar variant="error" title="Sync failed" description="Could not connect to your HRIS." actionLabel="Retry" onAction={retry} onClose={dismiss} />
```

### Snackbar — Toast Notifications
```tsx
import { Snackbar } from '@/components/ef-design-system'

// Compact pill-shaped toast — for background operation results
<Snackbar variant="success" message="Profile updated." onClose={dismiss} />
<Snackbar variant="error" message="Failed to export." actionLabel="Retry" onAction={retry} size="small" />
```

**Decision guide:**

| Situation | Component |
|-----------|-----------|
| Inline context about a page/form section | `InfoBar` |
| Full-width system status bar (top of page) | `MessageBar` |
| Result of a user-triggered background action | `Snackbar` |

---

## 2. Buttons

### Variants and Their Roles
```tsx
import { Button } from '@/components/ef-design-system'

<Button variant="primary">Submit review</Button>       // main CTA — ONE per context
<Button variant="outline">Cancel</Button>              // secondary / cancel
<Button variant="secondary">Export</Button>            // neutral grey background
<Button variant="ghost">View details</Button>          // minimal, in tables/lists
<Button variant="destructive">Delete role</Button>     // irreversible actions
<Button variant="link">Learn more</Button>             // inline text link
<Button variant="default">Add skill</Button>           // light blue background

// Sizes
<Button size="lg">Get started</Button>                 // hero / landing CTAs
<Button size="default">Save changes</Button>           // standard
<Button size="sm">Approve</Button>                     // table row actions
<Button size="xs">+</Button>                           // compact UI

// Icon-only (always circular — do NOT add rounded-full manually)
<Button size="icon" variant="ghost"><MoreHorizontal /></Button>
<Button size="icon-sm" variant="ghost"><Edit /></Button>
<Button size="icon-lg" variant="outline"><Download /></Button>
```

### Button Hierarchy Rules
- **One `variant="primary"` per visible context** — the main CTA only
- Table row buttons: `variant="outline" size="sm"` or `variant="ghost" size="sm"` — never `primary`
- Modal footer: `variant="outline"` Cancel on the left, `variant="primary"` or `variant="destructive"` on the right
- Destructive actions use `variant="destructive"` — never style a delete action as `outline` or `ghost`

### Leading / Trailing Icons
```tsx
// Icons as props, not as children next to text
<Button leadingIcon={<Plus />}>Add role</Button>
<Button trailingIcon={<ChevronRight />}>View details</Button>

// Badge count (caps at 99+)
<Button badge={7} variant="outline">Messages</Button>
```

### Back Navigation
```tsx
// Always ChevronLeft — never ArrowLeft
<Button variant="ghost" onClick={() => router.history.back()}>
  <ChevronLeft className="h-4 w-4" />
  Back
</Button>
```

---

## 3. Status Labels

### Tag — Status Pills (ALWAYS use Tag, NEVER raw color classes)

```tsx
import { Tag } from '@/components/ef-design-system'

// Status color map — light bg + dark text (NEVER solid fills)
// green  → Active, Enabled, Completed, Matched, Approved
// red    → Alert, Overdue, Critical, Expired, Failed, Rejected
// orange → Warning, Pending, In Review, At Risk, Due Soon
// blue   → Complete, Submitted, Sent, Shortlisted
// grey   → Inactive, Draft, Archived, Deactivated

<Tag size="24" color="green">Active</Tag>
<Tag size="24" color="red">Overdue</Tag>
<Tag size="24" color="orange">In review</Tag>
<Tag size="24" color="blue">Submitted</Tag>
<Tag size="24" color="grey">Draft</Tag>

// ❌ WRONG — raw Tailwind color classes bypass the token system
<span className="bg-green-100 text-green-800">Active</span>
// ❌ WRONG — solid Badge for status (Badge destructive = delete actions only)
<Badge variant="destructive">Overdue</Badge>
```

Tag color prop mapping:
```tsx
const STATUS_TAG_COLORS: Record<string, string> = {
  active: 'green', enabled: 'green', matched: 'green', approved: 'green', completed: 'green', hired: 'green',
  overdue: 'red', failed: 'red', expired: 'red', rejected: 'red', blocked: 'red', critical: 'red',
  pending: 'orange', 'in review': 'orange', 'at risk': 'orange', 'due soon': 'orange', 'in progress': 'orange',
  submitted: 'blue', shortlisted: 'blue', sent: 'blue',
  draft: 'grey', inactive: 'grey', archived: 'grey', deactivated: 'grey',
}
```

Status text: **always sentence case** — `"Active"` not `"ACTIVE"`, `"In review"` not `"IN REVIEW"`.

### Badge — Entity Labels (NOT status)
```tsx
import { Badge } from '@/components/ef-design-system'

// Use Badge for entity-level labels, not status:
<Badge variant="primary">Manager</Badge>    // role indicator
<Badge variant="secondary">Beta</Badge>     // feature label
<Badge size="30">New</Badge>                // size variants: 24, 30, 44
```

### Pill — Category Indicators
```tsx
import { Pill } from '@/components/ef-design-system'

<Pill variant="neutral">Course</Pill>
<Pill variant="blueGreen">Skill</Pill>
<Pill variant="orange">Mentor</Pill>
<Pill variant="critical">Overdue</Pill>

// With Material Symbol icon:
<Pill variant="neutral" icon="menu_book">Course</Pill>
```

---

## 4. Skill Tags

```tsx
import { SkillTag } from '@/components/ef-design-system'

// Variants
<SkillTag>JavaScript</SkillTag>                              // default (white)
<SkillTag variant="matched">JavaScript</SkillTag>           // green (matched to JD)
<SkillTag variant="highlighted">JavaScript</SkillTag>       // amber (highlighted)

// Sizes
<SkillTag size="sm">React</SkillTag>
<SkillTag size="md">React</SkillTag>   // default
<SkillTag size="lg">React</SkillTag>

// Action buttons
<SkillTag action="add" onAction={addSkill}>Python</SkillTag>
<SkillTag action="save" active={saved} onAction={toggle}>Python</SkillTag>
<SkillTag action="endorse" endorseCount={12} active={endorsed} onAction={toggle}>Python</SkillTag>

// Trend indicators (performance vs expectations)
<SkillTag trend="exceed">Leadership</SkillTag>              // ↑ circle
<SkillTag trend="meet">Communication</SkillTag>             // — circle
<SkillTag trend="below">Data Analysis</SkillTag>            // ↓ circle
<SkillTag trend="exceed" upskilling>Agile</SkillTag>        // ↑ + trending_up
```

---

## 5. Modals and Panels

### Dialog — Confirmations and Forms
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
         DialogBody, DialogFooter, DialogClose } from '@/components/ef-design-system'

// Confirmation dialog
<Dialog>
  <DialogTrigger asChild><Button variant="destructive">Delete role</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Delete this role?</DialogTitle></DialogHeader>
    <DialogBody>
      <p className="text-sm text-muted-foreground">This is permanent and cannot be undone.</p>
    </DialogBody>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete role</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Multi-step dialog (built-in stepper)
<DialogContent
  steps={[{ label: 'Select reviewers' }, { label: 'Set timeline' }, { label: 'Confirm' }]}
  currentStep={step}
>
  ...
</DialogContent>
```

`DialogContent` ships with a close button (×) top-right. **Do not add your own close button** — you'll create two.

### Panel — Slide-Over Detail Views
```tsx
import { Panel } from '@/components/ef-design-system'

// Use Panel (not Sheet) for table drill-down with confirm/cancel actions
<Panel
  open={open}
  title="Edit profile"
  subtitle="Update your information"
  width="medium"          // 'narrow' (400px) | 'medium' (560px) | 'wide' (720px)
  onClose={() => setOpen(false)}
  onConfirm={save}
  confirmLabel="Save changes"
  confirmLoading={saving}
>
  <div className="space-y-4">
    <Input placeholder="Job title" />
  </div>
</Panel>
```

### When to use which:

| Scenario | Component |
|----------|-----------|
| Confirm / destroy action | `Dialog` |
| Multi-step creation flow | `Dialog` with steps prop |
| Table row detail + edit with save/cancel | `Panel` |
| Filters side panel | `Sheet` from shadcn/ui |

---

## 6. Forms and Inputs

### Input — Text Fields
```tsx
import { Input } from '@/components/ef-design-system'

// Shape and size
<Input placeholder="Search employees..." shape="pill" leadingIcon="search" onClear={clear} />
<Input placeholder="Goal title" size="large" />
<Input placeholder="Enter email" state="error" />
<Input placeholder="Confirmed" state="success" trailingIcon="check_circle" />

// Sizes: 'small' | 'medium' (default) | 'large'
// Shapes: 'rounded' (default) | 'pill'
// States: 'default' | 'error' | 'warning' | 'success'
// Icons: Material Symbol string name OR ReactNode
```

### Select — Dropdown
```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
         SelectGroup, SelectLabel, SelectSeparator } from '@/components/ef-design-system'

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select department" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="engineering">Engineering</SelectItem>
    <SelectItem value="design">Design</SelectItem>
    <SelectItem value="product">Product</SelectItem>
  </SelectContent>
</Select>

// Sizes: 'default' (36px) | 'sm' (32px) | 'lg'
// Variants: 'default' | 'primary' | 'secondary' | 'outline'
// ALWAYS use ef-design-system Select inside Dialog — it renders in a Radix portal above the overlay
```

### DateTimePicker
```tsx
import { DateTimePicker } from '@/components/ef-design-system'

<DateTimePicker value={date} onChange={setDate} />
<DateTimePicker value={date} onChange={setDate} showTime />      // with time columns
<DateTimePicker value={date} onChange={setDate} size="large" />  // 'medium' (default) | 'large'
```

### Uploader
```tsx
import { Uploader, UploaderFileItem } from '@/components/ef-design-system'

<Uploader
  accept=".pdf,.docx"
  maxFiles={3}
  onFilesChange={setFiles}
  label="Drop your resume here or click to upload"
  hint="PDF or Word, max 10MB"
>
  {files.map(f => (
    <UploaderFileItem
      key={f.name}
      name={f.name}
      size="2.4 MB"
      progress={uploadProgress[f.name]}
      onRemove={() => removeFile(f.name)}
    />
  ))}
</Uploader>
```

---

## 7. Navigation

### Tabs
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ef-design-system'

// variant="line" for inline content switching (most common)
<Tabs defaultValue="overview">
  <TabsList variant="line">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="feedback" badge={3}>Feedback</TabsTrigger>
    <TabsTrigger value="history" leadingIcon={<Clock />}>History</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="feedback">...</TabsContent>
  <TabsContent value="history">...</TabsContent>
</Tabs>

// variant="default" for pill-style tab switcher
<TabsList variant="default">...</TabsList>
```

### Breadcrumb
```tsx
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
         BreadcrumbSeparator, BreadcrumbPage } from '@/components/ef-design-system'

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink onClick={() => navigate('/roles')}>Roles</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink onClick={() => navigate('/roles/engineering')}>Engineering</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Senior Engineer</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### DropdownMenu
```tsx
import { DropdownMenu } from '@/components/ef-design-system'

<DropdownMenu>
  <DropdownMenu.Trigger asChild>
    <Button size="icon" variant="ghost"><MoreHorizontal /></Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item onClick={edit}>Edit</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onClick={del}>Delete</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>
```

---

## 8. Data Display

### DataTable
```tsx
import { DataTable, DataTableHeader, DataTableBody,
         DataTableRow, DataTableHead, DataTableCell } from '@/components/ef-design-system'

<DataTable bordered>
  <DataTableHeader>
    <tr>
      <DataTableHead>Name</DataTableHead>
      <DataTableHead>Role</DataTableHead>
      <DataTableHead numeric>Match score</DataTableHead>
      <DataTableHead metric>Progress</DataTableHead>
      <DataTableHead shrink>Actions</DataTableHead>
    </tr>
  </DataTableHeader>
  <DataTableBody>
    {rows.map(row => (
      <DataTableRow key={row.id} onClick={() => openDetail(row.id)}>
        <DataTableCell>{row.name}</DataTableCell>
        <DataTableCell>{row.role}</DataTableCell>
        <DataTableCell numeric>{row.matchScore}%</DataTableCell>
        <DataTableCell metric><Progress value={row.progress} /></DataTableCell>
        <DataTableCell>
          <Button size="icon-sm" variant="ghost"><MoreHorizontal /></Button>
        </DataTableCell>
      </DataTableRow>
    ))}
  </DataTableBody>
</DataTable>
```

Props: `DataTableHead`: `numeric` (right-align), `metric` (min-width for progress), `shrink` (collapse for actions)  
`DataTableRow`: `variant="warn"` for highlighted rows, `onClick` for clickable rows

### StatCard
```tsx
import { StatCard, StatCardGroup } from '@/components/ef-design-system'

// Always use StatCardGroup for rows of stats
<StatCardGroup>
  <StatCard label="Total roles" value={48}   icon="work"         color="blue"  variant="outlined" />
  <StatCard label="Matched"     value={36}   icon="check_circle" color="green" variant="outlined" />
  <StatCard label="At risk"     value={4}    icon="warning"      color="red"   variant="outlined" iconBadge="alert" />
  <StatCard label="Pending"     value={8}    icon="schedule"     color="grey"  variant="outlined" />
</StatCardGroup>

// Sizes: 'lg' | 'md' (default) | 'sm' — must be CONSISTENT within a row
// Variants: 'outlined' | 'filled' | 'ghost'
// Colors: 'blue' | 'green' | 'red' | 'teal' | 'grey' | 'dark'
// iconBadge: true (red dot) | 'alert' (red) | 'success' (green) | 'info' (blue)
```

### Progress
```tsx
import { Progress, SegmentedProgress } from '@/components/ef-design-system'

// Continuous bar
<Progress value={65} />
<Progress value={null} />                              // indeterminate (animated)
<Progress value={65} labelVariant="scale" scaleStartLabel="Beginner" scaleEndLabel="Expert" />
<Progress value={65} labelVariant="complete-left" />  // "65% complete"

// Milestone progress (steps completed vs total)
<SegmentedProgress value={3} max={5} label="3 of 5 steps complete" />
```

### Timeline — Activity and Audit Logs
```tsx
import { Timeline, TimelineItem } from '@/components/ef-design-system'

// ALWAYS use this — never build a custom div with absolute-positioned lines
<Timeline>
  <TimelineItem
    state="complete"
    time="March 5, 2025"
    title="Review submitted"
    description="Self-assessment submitted by Sarah Chen."
  />
  <TimelineItem
    state="active"
    time="March 8, 2025"
    title="Manager review in progress"
    activeConnector
  />
  <TimelineItem
    state="default"
    time="March 15, 2025"
    title="Calibration meeting"
    hideConnector
  />
</Timeline>

// States: 'default' | 'active' | 'complete'
// nodeSize: 'default' (28px) | 'large' (42px)
```

### Charts

Charts use `ChartContainer` from `@/components/ui/chart` (a thin Recharts wrapper) — NOT any `OctupleBarChart` / `OctupleLineChart` / `OctuplePieChart` wrapper (those do not exist).

**Color rules — non-negotiable:**
- **Fill colors** → always use the **light** palette (-20 or -30 scale) — these are soft, pastel fills
- **Stroke / border colors** → use the **dark** palette (-60 or -70 scale)
- **Never use dark colors as fills** — dark fills make charts illegible and break the DS visual language

| Series | Fill (light) | Stroke (dark) |
|--------|-------------|--------------|
| 1 | `var(--color-background2-blue)` `#BCE4FF` | `var(--color-tertiary-blue)` `#2C8CC9` |
| 2 | `var(--color-background2-blue-green)` `#B0F3FE` | `var(--color-secondary-blue-green)` `#0B7B8B` |
| 3 | `var(--color-blue-violet-20)` `#CACFFC` | `var(--color-blue-violet-60)` `#5962B7` |
| 4 | `var(--color-green-20)` `#B9F4E4` | `var(--color-green-60)` `#3D8F79` |
| 5 | `var(--color-violet-20)` `#EAD3E8` | `var(--color-violet-60)` `#975590` |

Donut charts: use `PieChart` + `Pie` with `innerRadius` prop — that creates the donut hole. See component-patterns.md for full code.

### View Toggle (list / map / grid switcher)

Use `Tabs` with `TabsList` (default pill style) — NOT `ToggleGroup variant="outline"`, NOT custom icon buttons.

The pill switcher looks like: soft rounded container, active tab gets a white/light filled pill, inactive is plain text. This is `TabsList` with no `variant` prop (or `variant="default"`).

```tsx
import { Tabs, TabsList, TabsTrigger } from '@/components/ef-design-system'

// Text labels (most common — matches the Map / List screenshot)
<Tabs value={view} onValueChange={(v) => setView(v as 'map' | 'list')}>
  <TabsList>
    <TabsTrigger value="map">Map</TabsTrigger>
    <TabsTrigger value="list">List</TabsTrigger>
  </TabsList>
</Tabs>

// With icons + labels
<Tabs value={view} onValueChange={(v) => setView(v as 'map' | 'list')}>
  <TabsList>
    <TabsTrigger value="map"><Map className="h-4 w-4" />Map</TabsTrigger>
    <TabsTrigger value="list"><LayoutList className="h-4 w-4" />List</TabsTrigger>
  </TabsList>
</Tabs>

// Icon-only (add aria-label for accessibility)
<Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'list')}>
  <TabsList>
    <TabsTrigger value="grid" aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
    <TabsTrigger value="list" aria-label="List view"><LayoutList className="h-4 w-4" /></TabsTrigger>
  </TabsList>
</Tabs>
```

**`TabsList` (no variant / variant="default")** = pill container with floating active pill — for view switchers  
**`TabsList variant="line"`** = underline indicator — for page-level content tabs (Overview / Activity / Settings)

---

## 9. Accordion — Collapsible Sections

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

// The chevron is ALWAYS on the RIGHT — AccordionTrigger renders it automatically via justify-between.
// NEVER add a chevron manually to the left of the label.

<Accordion type="single" collapsible>
  <AccordionItem value="access-controls">
    <AccordionTrigger>Access controls</AccordionTrigger>  {/* chevron auto right-aligned */}
    <AccordionContent>
      ...content...
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="audit-logs">
    <AccordionTrigger>Audit logs</AccordionTrigger>
    <AccordionContent>
      ...content...
    </AccordionContent>
  </AccordionItem>
</Accordion>

// Multiple open at once:
<Accordion type="multiple">...</Accordion>
```

**Rules:**
- Chevron is **right-aligned** — `AccordionTrigger` handles it. Never put a `<ChevronDown>` on the left.
- Use for: security categories, settings groups, FAQ sections, filter groups — any collapsible list
- Content inside `AccordionContent` is `px-4 pb-4` by default — do not re-add padding

---

## 10. Stepper — Multi-Step Flows

**ALWAYS use the Stepper family — never custom div circles with connector lines.**

```tsx
import { Stepper, StepperList, StepperItem, StepperIndicator, StepperTitle,
         StepperDescription, StepperSeparator, StepperTrigger } from '@/components/ef-design-system'

<Stepper value={currentStep}>
  <StepperList>
    <StepperItem>
      <StepperTrigger onClick={() => setStep(0)}>
        <StepperIndicator />
        <div>
          <StepperTitle>Select reviewers</StepperTitle>
          <StepperDescription>Choose who reviews this cycle</StepperDescription>
        </div>
      </StepperTrigger>
    </StepperItem>
    <StepperSeparator />
    <StepperItem>
      <StepperTrigger onClick={() => setStep(1)}>
        <StepperIndicator />
        <StepperTitle>Set timeline</StepperTitle>
      </StepperTrigger>
    </StepperItem>
    <StepperSeparator />
    <StepperItem>
      <StepperTrigger>
        <StepperIndicator />
        <StepperTitle>Confirm</StepperTitle>
      </StepperTrigger>
    </StepperItem>
  </StepperList>
</Stepper>

// size="sm" for compact Stepper inside a Dialog
<Stepper value={step} size="sm">...</Stepper>
```

---

## 10. Indicators

### NumberBadge — Counts
```tsx
import { NumberBadge } from '@/components/ef-design-system'

// On section headings
<h3 className="flex items-center gap-2">
  Pending reviews <NumberBadge value={12} size="sm" color="grey" />
</h3>

// Colors: 'red'|'orange'|'amber'|'yellow'|'lime'|'teal'|'mint'|'sky'|'blue'|'purple'|'pink'|'grey'
// Sizes: 'sm' | 'md' (default) | 'lg'

// ❌ WRONG — plain text count
<h3>Pending reviews (12)</h3>
```

### Chip — Person / Entity Tokens
```tsx
import { Chip } from '@/components/ef-design-system'

// Person chip with avatar
<Chip label="Sarah Chen" avatarSrc="/avatars/sc.jpg" onRemove={() => removeReviewer('sc')} />

// Person chip with initials
<Chip label="David Park" avatarInitials="DP" variant="filled" />

// Category chip
<Chip label="Engineering" icon={<Building2 />} size="medium" />

// Sizes: 'large' (32px) | 'medium' (24px) | 'small' (20px)
// Variants: 'default' | 'filled' | 'ghost'
```

### OpenTo — Interest Indicators
```tsx
import { OpenTo } from '@/components/ef-design-system'

// Shows icons for what the person is open to
<OpenTo items={['coffee', 'mentoring', 'project']} />
// Items: 'coffee' | 'mentoring' | 'project'
```

---

## 11. Object Cards

### CourseObjectCard
```tsx
import { CourseObjectCard } from '@/components/ef-design-system'

<CourseObjectCard
  course={{ title: 'Machine Learning Fundamentals', provider: 'Coursera', duration: '8 hours', skills: ['Python', 'ML', 'Statistics'] }}
  href="/courses/ml-fundamentals"
  bottomBar={{ type: 'openTo', items: ['project'] }}
/>
```

### PeopleObjectCard
```tsx
import { PeopleObjectCard } from '@/components/ef-design-system'

<PeopleObjectCard
  person={{ name: 'Sarah Chen', title: 'Senior Engineer', email: 'sarah@co.com', openTo: 'mentoring' }}
  href="/talent/sarah-chen"
/>
```

### ProjectObjectCard
```tsx
import { ProjectObjectCard } from '@/components/ef-design-system'

<ProjectObjectCard
  project={{ title: 'Data Platform Migration', status: 'active', skills: ['Spark', 'Airflow'] }}
  href="/projects/data-platform"
/>
```

---

## 12. Empty States

```tsx
import { EmptyIllustration } from '@/components/ef-design-system'

// Use EmptyIllustration for empty state views — pick the appropriate variant
<div className="flex flex-col items-center gap-4 py-16">
  <EmptyIllustration variant="no-search-results" size={200} />
  <h3 className="text-base font-semibold text-foreground">No results for "{query}"</h3>
  <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
</div>

// Variants: 'conversations' | 'no-data' | 'no-documents' | 'no-search-results'
//           'no-successor' | 'tasks-complete' | 'technical-error'
//           'unclaimed-profile' | 'alert'
// Legacy names still accepted (auto-mapped): 'inbox', 'no-connection',
//   'no-messages', 'all-done', 'no-items', 'no-files', 'error'
```

---

## 13. Filter Bar Pattern

```tsx
// Standard filter bar: Select dropdowns + "All filters" Panel
<div className="flex items-center gap-2">
  <Select value={status} onValueChange={setStatus}>
    <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="">All statuses</SelectItem>
      <SelectItem value="active">Active</SelectItem>
      <SelectItem value="pending">Pending</SelectItem>
    </SelectContent>
  </Select>

  {/* ChevronDown auto-rendered by SelectTrigger — never add ChevronsUpDown */}

  <Button variant="outline" size="sm" leadingIcon={<SlidersHorizontal />}
          onClick={() => setFiltersOpen(true)}>
    All filters
  </Button>
</div>

{/* "All filters" opens Sheet — NOT a dropdown, NOT "More filters" */}
<Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
  <SheetContent side="right" className="w-[360px]">...</SheetContent>
</Sheet>
```

**Rules:**
- Use `ChevronDown` in selects — **never** `ChevronsUpDown` or `⇅`
- The expand button says **"All filters"** — never "More filters"
- "All filters" opens a `Sheet`, never a dropdown or modal

---

## 14. Layout and Close Button Rules

### Sheet/Dialog — No Duplicate Close Buttons
Both `DialogContent` and `SheetContent` render their own close button. **Do not add a manual `<X />` button in your header.**

```tsx
// ✅ CORRECT — single close button from SheetContent
<SheetContent className="w-[380px] p-0">
  <div className="border-b p-4">
    <h2 className="text-sm font-semibold">Document details</h2>
  </div>
  ...
</SheetContent>

// ❌ WRONG — duplicate close
<SheetContent className="w-[380px] p-0">
  <div className="flex items-center justify-between border-b p-4">
    <h2>Document details</h2>
    <button onClick={onClose}><X /></button>  {/* ← duplicate */}
  </div>
</SheetContent>
```

### Table Drill-Down → Panel (not full page)
When a user works through a table sequentially, clicking a row opens `Panel` (slide-over) — not a full-page navigation. This preserves table context.

### Back button → `ChevronLeft` only
```tsx
// ✅
<Button variant="ghost"><ChevronLeft className="h-4 w-4" /> Back</Button>

// ❌
<Button variant="ghost"><ArrowLeft /> Back</Button>
```

---

## 16. Additional Rules

### Chip Overflow in Filter Rows
| Count | Pattern |
|-------|---------|
| 1–6 chips | Inline `TagGroup` |
| 7–12 chips | `overflow-x-auto` row with `flex-shrink-0` chips |
| 13+ | Group into multi-select dropdown |

Never `flex-wrap` chips on a desktop filter row.

### Select Inside Dialog
Always use ef-design-system `Select` (Radix portal) inside `Dialog`. Native `<select>` renders behind the modal overlay.

### No Emojis
Never use emoji in UI. Use Lucide icons or Material Symbols.

### Font Weights — NEVER use Bold

| Weight | Class | Use |
|--------|-------|-----|
| Regular (400) | `font-normal` | Body text, descriptions |
| Medium (500) | `font-medium` | Labels, table headers |
| Semibold (600) | `font-semibold` | Headings, strong emphasis |

**`font-bold`, `font-extrabold`, `font-black` are FORBIDDEN.** Octuple uses Semibold (600) where other systems use Bold. When in doubt, `font-semibold`.

### Text Casing — NEVER all caps
- All headings, labels, button text, badges, status tags: **sentence case**
- `"Active"` not `"ACTIVE"`, `"Global access"` not `"GLOBAL ACCESS"`, `"Audit logs"` not `"AUDIT LOGS"`, `"Recent alerts"` not `"RECENT ALERTS"`, `"Priority risks"` not `"PRIORITY RISKS"`
- **Never** `text-transform: uppercase`, `uppercase` Tailwind class, or `toUpperCase()` for display strings
- Acceptable ALL CAPS abbreviations only: `API`, `CSV`, `ID`, `HR`, `SSO`, `URL`, `NDA`

### Card and Progress Bar Colors

**Cards** — never use dark background fills:
```tsx
// ✅ CORRECT — light surface
<div className="rounded-lg border bg-card p-4">...</div>
<div className="rounded-lg border bg-background p-4">...</div>

// ❌ WRONG — dark fills break the light DS aesthetic
<div className="rounded-lg bg-slate-800 p-4">...</div>
<div className="rounded-lg bg-gray-900 p-4">...</div>
```

**Progress bar** — use semantic color props, not raw Tailwind color overrides:
```tsx
// ✅ CORRECT — Progress handles its own color via the token system
<Progress value={65} />
<Progress value={30} className="[&>div]:bg-[var(--color-tertiary-blue)]" />  // only if overriding for a specific semantic

// ❌ WRONG
<Progress value={65} className="[&>div]:bg-red-500" />   // raw color
<Progress value={65} className="[&>div]:bg-slate-700" /> // dark fill
```

### Numeric Counts → NumberBadge
Never `(3)` in parentheses after headings. Always use `<NumberBadge>`.

### StatCard Sizing
All `StatCard` in the same row must use the same `size` prop. Use `size="md"` by default.

### FloatingActionButton
```tsx
import { FloatingActionButton } from '@/components/ef-design-system'

// Primary FAB — fixed bottom-right of page
<FloatingActionButton icon={<Plus />} label="Add candidate" variant="primary" />

// Icon-only variant
<FloatingActionButton icon={<Plus />} variant="secondary" size="small" />
```

### Accessibility Minimums
- Body text on white: **4.5:1** contrast ratio minimum
- Large text / UI components: **3:1** minimum
- Status colors without a label are FORBIDDEN — always pair color with text or icon
- `text-green-600` on white fails AA for body text → use Tag's token system instead
