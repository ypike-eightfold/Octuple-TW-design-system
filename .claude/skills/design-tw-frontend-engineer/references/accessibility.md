# Accessibility Guidelines

**Purpose:** Ensure ef-design-system applications are accessible to all users
**Status:** Complete
**Last Updated:** May 22, 2026
**Stack:** React 19 + TypeScript + ef-design-system + shadcn/ui + Radix UI + Tailwind CSS 4
**Standards:** WCAG 2.1 Level AA + WCAG 2.2 net-new criteria
**Source:** Mirrors `design-og-frontend-engineer/references/accessibility.md`, rewritten for the Tailwind stack

---

## 🎯 Overview

### Why Accessibility Matters

**Legal Requirements:**
- **ADA (Americans with Disabilities Act):** Requires accessible digital experiences
- **Section 508:** Federal accessibility standards
- **WCAG 2.1/2.2:** International web accessibility guidelines
- **EAA (European Accessibility Act):** Effective June 2025 for EU-facing products

**Business Benefits:**
- **Larger Audience:** 15% of the global population has disabilities
- **Better UX:** Accessible design benefits all users (low-vision, low-bandwidth, mobile, keyboard power-users)
- **SEO:** Better semantic HTML improves search rankings
- **Brand Reputation:** Demonstrates social responsibility
- **Lower Support Cost:** Clearer error messages and predictable flows reduce ticket volume

**Ethical Responsibility:**
- Everyone deserves equal access to information and services
- Inclusive design creates a better world

---

### WCAG 2.1/2.2 Principles (POUR)

#### 1. **Perceivable**
Information and UI components must be presentable to users in ways they can perceive.

**Key Requirements:**
- Text alternatives for non-text content
- Captions and alternatives for multimedia
- Content can be presented in different ways
- Distinguishable content (color contrast, text sizing)

#### 2. **Operable**
UI components and navigation must be operable.

**Key Requirements:**
- All functionality available from the keyboard
- Users have enough time to read and use content
- Content doesn't cause seizures (no rapid flashing)
- Users can navigate and find content
- Touch targets are large enough (WCAG 2.2 §2.5.8)

#### 3. **Understandable**
Information and UI operation must be understandable.

**Key Requirements:**
- Text is readable and understandable
- Content appears and operates predictably
- Users are helped to avoid and correct mistakes
- Authentication doesn't depend on cognitive function tests (WCAG 2.2 §3.3.8)

#### 4. **Robust**
Content must be robust enough to work with assistive technologies.

**Key Requirements:**
- Compatible with current and future technologies
- Valid, parseable HTML
- Proper ARIA usage — prefer native semantics first, ARIA only when needed

---

### Why this stack is *mostly* a free win

ef-design-system components are built on **Radix UI primitives** (Dialog, DropdownMenu, Select, Tabs, NavigationMenu, Accordion, Tooltip, Popover, Switch, Checkbox, RadioGroup) and **shadcn/ui** wrappers. Radix ships with:

- Correct roles (`role="dialog"`, `role="menu"`, `role="combobox"`, `role="tablist"`, etc.)
- Focus traps on overlays, focus return on close
- Escape-to-close on dismissible overlays
- Roving tabindex on composite widgets (tabs, menus)
- `aria-expanded`, `aria-haspopup`, `aria-controls`, `aria-selected`, `aria-checked` wired by default
- `aria-modal`, `aria-labelledby`, `aria-describedby` plumbing

**You still have to:**
- Provide accessible names (`aria-label` on icon-only Buttons, labels on every Input, titles on every Dialog)
- Use semantic Tailwind tokens (`bg-primary`, `text-foreground`, …) so theming preserves contrast
- Test color contrast for the *active* theme via `pnpm run theme:audit`
- Build screen reader live regions for asynchronous status (toasts, optimistic mutations)
- Pick the right ef-ds variant — Tag with `color="red"` is **not** a substitute for an error message

When in doubt, grep the source. The ef-ds components live at `src/components/<Name>/<Name>.tsx`; the Radix wrappers ship under `src/components/ui/`.

---

## ⌨️ Keyboard Navigation

### Universal Keyboard Shortcuts

| Key | Action | WCAG Criterion |
|-----|--------|----------------|
| **Tab** | Move focus forward | 2.1.1 Keyboard |
| **Shift+Tab** | Move focus backward | 2.1.1 Keyboard |
| **Enter** | Activate button/link | 2.1.1 Keyboard |
| **Space** | Activate button/checkbox | 2.1.1 Keyboard |
| **Escape** | Close Dialog / Sheet / DropdownMenu / Popover | 2.1.2 No Keyboard Trap |
| **Arrow keys** | Navigate within composite widget (Tabs, Menu, Select) | 2.1.1 Keyboard |
| **Home** | Move to first item in widget | 2.1.1 Keyboard |
| **End** | Move to last item in widget | 2.1.1 Keyboard |

---

### Focus Management

#### Visual Focus Indicators

**WCAG Requirement:** 2.4.7 Focus Visible (Level AA)

ef-design-system and shadcn primitives use a CSS variable–driven focus ring (`ring-ring`, `ring-2`, `ring-offset-2`) that respects `:focus-visible`. The token resolves at runtime against the active theme, so the focus indicator always meets 3:1 against its surface.

```tsx
// Already wired in every ef-ds primitive. Do not override.
<Button>Submit</Button>  // focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2

// If composing a custom focusable element, mirror the same pattern
<div
  tabIndex={0}
  role="button"
  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
>
  Custom focusable
</div>
```

**Requirements:**
- Ring width ≥ 2px
- 3:1 contrast against adjacent surfaces (auto-satisfied by `ring-ring` when the theme is contrast-checked)
- Visible on every interactive element
- Never `outline: none` without a replacement

**Forbidden:**
```tsx
// ❌ WRONG — kills the focus ring with no replacement
<Button className="focus-visible:ring-0 focus-visible:outline-none">Submit</Button>
```

---

#### Focus Order (Tab Order)

**WCAG Requirement:** 2.4.3 Focus Order (Level A)

**Logical Tab Order:**
```
1. Skip to main content link (optional but recommended)
2. Navbar / Top navigation
3. Main content area (left to right, top to bottom)
4. Sidebar content (if present)
5. Footer navigation / links
```

**DO's:**
- Follow visual reading order (LTR top-to-bottom)
- Use semantic HTML and TanStack Router `<Link>` for natural order
- Test tab order regularly

**DON'Ts:**
- Don't use positive `tabIndex` values (`tabIndex={1}`, `tabIndex={2}`, …)
- Don't reorder visually with `flex-direction: row-reverse` or CSS `order` without also reordering the DOM
- Don't hide focusable elements off-screen unless they also have `tabIndex={-1}` or `hidden`

**Example:**
```tsx
// ✅ Good: Natural DOM order — TanStack Router + semantic layout
import { Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/ef-design-system";

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar tabs={navTabs} user={currentUser} avatarMenuItems={avatarMenu} />
      <main id="main" className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
      <footer role="contentinfo" className="border-t border-border py-6">
        ...
      </footer>
    </div>
  );
}

// ❌ Bad: Positive tabIndex breaks the natural flow
<Button tabIndex={3}>Third</Button>
<Button tabIndex={1}>First</Button>
```

---

#### Focus Trapping (Dialog, Sheet, Panel)

**WCAG Requirement:** 2.1.2 No Keyboard Trap (Level A)

Radix Dialog (which ef-ds Dialog wraps) **traps focus inside the overlay automatically** when `open=true`, returns focus to the trigger on close, and supports Escape to close.

```tsx
// ef-design-system Dialog — focus trap + return are automatic
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from "@/components/ef-design-system";
import { useState } from "react";

export function ConfirmDeleteDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete account
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm account deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

**Behind the scenes (don't re-implement this):**
- `role="dialog"` and `aria-modal="true"` set automatically
- `DialogTitle` becomes `aria-labelledby`
- `DialogDescription` becomes `aria-describedby`
- Focus is trapped on open
- Focus returns to the original trigger on close
- `Escape` closes the dialog
- Body scroll is locked
- Outside-the-dialog content is `inert` / `aria-hidden`

**Same goes for:**
- `Panel` (ef-ds slide-over)
- `Sheet` (shadcn — uses Radix Dialog under the hood)
- `DropdownMenu`, `Select`, `Popover`, `Tooltip` (Radix Popover/Menu primitives)

**Custom focus return** (rare — only when you need to override Radix's default trigger-return logic):

```tsx
import { useRef, useEffect } from "react";

const triggerRef = useRef<HTMLButtonElement>(null);

const handleOpen = () => {
  triggerRef.current = document.activeElement as HTMLButtonElement;
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
  // Manual return to a non-default element
  requestAnimationFrame(() => {
    triggerRef.current?.focus();
  });
};
```

---

### Component-Specific Keyboard Patterns

#### Button (ef-ds)

**WCAG Criterion:** 2.1.1 Keyboard

| Key | Action |
|-----|--------|
| **Enter** | Activate button |
| **Space** | Activate button |

```tsx
import { Button } from "@/components/ef-design-system";

<Button onClick={handleSubmit}>Submit</Button>
// Native <button> semantics — keyboard handled by the browser
```

---

#### DropdownMenu (ef-ds)

**ARIA Pattern:** [Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/)

| Key | Action |
|-----|--------|
| **Arrow Down** | Open menu / next item |
| **Arrow Up** | Previous item |
| **Home** | First item |
| **End** | Last item |
| **Enter** | Select item |
| **Space** | Select item |
| **Escape** | Close menu, return focus to trigger |
| **Tab** | Close menu, move to next element |

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Button,
} from "@/components/ef-design-system";
import { MoreVertical, Edit, Copy, Trash2 } from "lucide-react";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon-sm" aria-label="Row actions">
      <MoreVertical aria-hidden className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onSelect={handleEdit}>
      <Edit aria-hidden className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={handleDuplicate}>
      <Copy aria-hidden className="mr-2 h-4 w-4" />
      Duplicate
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
      <Trash2 aria-hidden className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

#### Tabs (ef-ds)

**ARIA Pattern:** [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/)

| Key | Action |
|-----|--------|
| **Arrow Left** | Previous tab |
| **Arrow Right** | Next tab |
| **Home** | First tab |
| **End** | Last tab |
| **Tab** | Move focus to tab panel |

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ef-design-system";

<Tabs defaultValue="profile" aria-label="Profile sections">
  <TabsList>
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
    <TabsTrigger value="notifications" badge={3}>Notifications</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">Profile content (focusable with Tab)</TabsContent>
  <TabsContent value="security">Security settings</TabsContent>
  <TabsContent value="notifications">Notification preferences</TabsContent>
</Tabs>
```

`TabsTrigger` and `TabsContent` get correct roles, `aria-selected`, `aria-controls`, `id`, and `tabindex` for free via Radix's Tabs primitive.

---

#### Form Fields (Input)

**WCAG Criterion:** 2.1.1 Keyboard, 3.3.2 Labels or Instructions

| Key | Action |
|-----|--------|
| **Tab** | Next field |
| **Shift+Tab** | Previous field |
| **Enter** | Submit form (when in text input, last field) |

```tsx
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input, Button } from "@/components/ef-design-system";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

type FormValues = z.infer<typeof schema>;

export function NameForm() {
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input id="name" {...form.register("name")} state={form.formState.errors.name ? "error" : "default"} />
        <FieldError>{form.formState.errors.name?.message}</FieldError>
      </Field>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

---

#### DataTable (ef-ds)

**ARIA Pattern:** [Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) — but most ef-ds DataTable usage is a *content table*, which uses standard `<table>` semantics, not the grid pattern.

| Key | Action |
|-----|--------|
| **Tab** | Move into / out of the table to row actions |
| **Arrow keys** | (When grid pattern is needed) Navigate cells |
| **Enter** | Activate row (when `DataTableRow` has `onClick`) |

```tsx
import {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableHead,
  DataTableCell,
  Button,
} from "@/components/ef-design-system";

<DataTable bordered aria-label="User management">
  <DataTableHeader>
    <DataTableRow>
      <DataTableHead>Name</DataTableHead>
      <DataTableHead>Email</DataTableHead>
      <DataTableHead>Status</DataTableHead>
      <DataTableHead align="end">Actions</DataTableHead>
    </DataTableRow>
  </DataTableHeader>
  <DataTableBody>
    {users.map((user) => (
      <DataTableRow key={user.id} onClick={() => navigate({ to: "/users/$id", params: { id: user.id } })}>
        <DataTableCell>{user.name}</DataTableCell>
        <DataTableCell>{user.email}</DataTableCell>
        <DataTableCell>
          <Tag color={user.status === "active" ? "green" : "grey"}>{user.status}</Tag>
        </DataTableCell>
        <DataTableCell align="end">
          <Button variant="ghost" size="sm" aria-label={`Edit ${user.name}`} onClick={(e) => { e.stopPropagation(); handleEdit(user); }}>
            Edit
          </Button>
        </DataTableCell>
      </DataTableRow>
    ))}
  </DataTableBody>
</DataTable>
```

---

#### Select / Combobox (ef-ds)

**ARIA Pattern:** [Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

| Key | Action |
|-----|--------|
| **Arrow Down** | Open dropdown / next option |
| **Arrow Up** | Previous option |
| **Enter** | Select option |
| **Escape** | Close, return focus to trigger |
| **Type** | Type-ahead search (first-letter jump) |

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ef-design-system";

<Select value={selected} onValueChange={setSelected}>
  <SelectTrigger aria-label="Department">
    <SelectValue placeholder="Select a department" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="engineering">Engineering</SelectItem>
    <SelectItem value="sales">Sales</SelectItem>
    <SelectItem value="hr">Human Resources</SelectItem>
  </SelectContent>
</Select>
```

For free-text search inside a long list, compose **Input + DropdownMenu** or use the shadcn `Command` primitive — ef-ds doesn't ship a Combobox.

---

## 📢 Screen Reader Support

### ARIA Landmarks

**WCAG Requirement:** 2.4.1 Bypass Blocks (Level A), 1.3.1 Info and Relationships (Level A)

#### Required Page Landmarks

Use semantic HTML5 elements — they map to landmarks automatically. Avoid `role="banner"`/`role="main"` redundancy.

```tsx
// ✅ App shell with implicit landmarks
import { Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/ef-design-system";

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <header>
        <Navbar tabs={navTabs} user={currentUser} />
      </header>
      <main id="main" tabIndex={-1} className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
      <aside aria-label="Filters" className="hidden lg:block">
        ...
      </aside>
      <footer className="border-t border-border py-6">
        <p>&copy; 2026 Eightfold AI</p>
      </footer>
    </div>
  );
}
```

`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` map to `banner`, `navigation`, `main`, `complementary`, `contentinfo` respectively. ef-ds `Navbar` already renders a semantic `<nav>` element.

---

### Component-Specific ARIA

#### Button

**WCAG Criterion:** 4.1.2 Name, Role, Value (Level A)

```tsx
import { Button } from "@/components/ef-design-system";
import { X, Plus, ChevronDown } from "lucide-react";

// Text button — text provides the accessible name, no ARIA needed
<Button onClick={handleSave}>Save changes</Button>

// Icon-only button — REQUIRES aria-label
<Button
  variant="ghost"
  size="icon-sm"
  aria-label="Close dialog"
  onClick={handleClose}
>
  <X aria-hidden className="h-4 w-4" />
</Button>

// Button with leading icon + text — aria-hidden the icon
<Button leadingIcon={<Plus aria-hidden className="h-4 w-4" />} onClick={handleCreate}>
  Create cycle
</Button>

// Toggle button — add aria-pressed
<Button
  variant={isMuted ? "primary" : "outline"}
  aria-pressed={isMuted}
  onClick={toggleMute}
>
  Mute
</Button>

// Button that opens a menu — Radix DropdownMenuTrigger wires aria-haspopup + aria-expanded
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button trailingIcon={<ChevronDown aria-hidden className="h-4 w-4" />}>
      Options
    </Button>
  </DropdownMenuTrigger>
  ...
</DropdownMenu>
```

**Common Mistakes:**
```tsx
// ❌ Icon-only Button without label — screen reader announces nothing useful
<Button variant="ghost" size="icon-sm">
  <X className="h-4 w-4" />
</Button>

// ✅ Correct
<Button variant="ghost" size="icon-sm" aria-label="Close">
  <X aria-hidden className="h-4 w-4" />
</Button>

// ❌ aria-label that duplicates visible text — clutters screen reader output
<Button aria-label="Save changes" onClick={handleSave}>Save changes</Button>

// ✅ Visible text alone is the accessible name
<Button onClick={handleSave}>Save changes</Button>
```

---

#### Form Fields

**WCAG Criterion:** 3.3.2 Labels or Instructions (Level A), 1.3.1 Info and Relationships (Level A)

The shadcn `Field` family (`Field`, `FieldLabel`, `FieldDescription`, `FieldError`) handles label association, `aria-describedby` for hints/errors, and `aria-invalid` automatically when paired with React Hook Form.

```tsx
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ef-design-system";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address (e.g., name@example.com)"),
});

type FormValues = z.infer<typeof schema>;

export function EmailForm() {
  const form = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onBlur" });
  const error = form.formState.errors.email;
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="email" required>
          Email address
        </FieldLabel>
        <FieldDescription>We'll never share your email.</FieldDescription>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          state={error ? "error" : "default"}
          aria-describedby={error ? "email-error" : "email-description"}
          {...form.register("email")}
        />
        <FieldError id="email-error">{error?.message}</FieldError>
      </Field>
      <Button type="submit">Continue</Button>
    </form>
  );
}
```

**Manual ARIA (when not using Field):**

```tsx
<label htmlFor="email-input" className="text-sm font-medium text-foreground">
  Email address <span aria-hidden className="text-destructive">*</span>
  <span className="sr-only"> (required)</span>
</label>
<Input
  id="email-input"
  type="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <div id="email-error" role="alert" className="mt-1 text-sm text-destructive">
    Please enter a valid email address.
  </div>
)}
```

**Required Field Indicators:**

```tsx
// Visual asterisk + screen reader text + aria-required on input
<FieldLabel htmlFor="email" required>
  Email address
</FieldLabel>
<Input id="email" aria-required="true" {...form.register("email")} />
```

Or add a once-per-form legend:

```tsx
<p className="text-sm text-muted-foreground">
  Fields marked with <span aria-hidden className="text-destructive">*</span> are required.
</p>
```

---

#### Navigation (Navbar / Sidebar)

**WCAG Criterion:** 4.1.2 Name, Role, Value (Level A)

```tsx
import { Navbar } from "@/components/ef-design-system";
import { Home, User, Settings } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

const navTabs = [
  { label: "Home", href: "/", leadingIcon: <Home aria-hidden className="h-4 w-4" /> },
  { label: "Profile", href: "/profile", leadingIcon: <User aria-hidden className="h-4 w-4" /> },
  { label: "Settings", href: "/settings", leadingIcon: <Settings aria-hidden className="h-4 w-4" /> },
];

const { location } = useRouterState();

<nav aria-label="Main navigation">
  <Navbar
    tabs={navTabs}
    user={currentUser}
    avatarMenuItems={avatarMenu}
    activePath={location.pathname}
    LinkComponent={Link}
  />
</nav>
```

**Indicating current page**:

```tsx
// TanStack Router <Link> exposes activeProps — wire aria-current
<Link
  to="/profile"
  activeProps={{ "aria-current": "page" }}
>
  Profile
</Link>
```

For multiple nav regions (top + sidebar + footer), give each `<nav>` a unique `aria-label` (`Main navigation`, `Sidebar navigation`, `Footer navigation`).

---

#### Tabs

**WCAG Criterion:** 4.1.2 Name, Role, Value (Level A)

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ef-design-system";

<Tabs defaultValue="profile">
  <TabsList aria-label="Profile sections">
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
    <TabsTrigger value="notifications" badge={3}>Notifications</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">
    {/* role="tabpanel", aria-labelledby, id all wired by Radix */}
    Profile content
  </TabsContent>
  <TabsContent value="security">Security settings</TabsContent>
  <TabsContent value="notifications">Notification preferences</TabsContent>
</Tabs>
```

Radix Tabs handles:
- `role="tablist"` on `TabsList`
- `role="tab"`, `aria-selected`, `aria-controls`, unique `id` on each `TabsTrigger`
- `role="tabpanel"`, `aria-labelledby`, `tabIndex={0}` on each `TabsContent`

Add `aria-label` on `TabsList` to describe the tab group.

---

#### Dialog

**WCAG Criterion:** 2.1.2 No Keyboard Trap (Level A), 4.1.2 Name, Role, Value (Level A)

```tsx
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
  Button,
} from "@/components/ef-design-system";

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm account deletion</DialogTitle>
      <DialogDescription>
        This action cannot be undone. Are you sure you want to delete your account?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="destructive" onClick={handleDelete}>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

`DialogTitle` is *required* — Radix throws a runtime warning otherwise. If the dialog truly has no visible title, wrap one in `VisuallyHidden`:

```tsx
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

<DialogContent>
  <DialogHeader>
    <VisuallyHidden>
      <DialogTitle>Image preview</DialogTitle>
    </VisuallyHidden>
  </DialogHeader>
  <img src={url} alt={altText} />
</DialogContent>
```

`Panel` (ef-ds slide-over) and `Sheet` (shadcn) follow the same pattern — title + description are required for the screen reader announcement.

---

#### DataTable

**WCAG Criterion:** 1.3.1 Info and Relationships (Level A)

```tsx
import {
  DataTable, DataTableHeader, DataTableBody, DataTableRow, DataTableHead, DataTableCell,
  Tag, Button,
} from "@/components/ef-design-system";

<DataTable bordered aria-label="Users">
  <caption className="sr-only">List of users in your organization</caption>
  <DataTableHeader>
    <DataTableRow>
      <DataTableHead scope="col">Name</DataTableHead>
      <DataTableHead scope="col">Email</DataTableHead>
      <DataTableHead scope="col">Status</DataTableHead>
      <DataTableHead scope="col" align="end">Actions</DataTableHead>
    </DataTableRow>
  </DataTableHeader>
  <DataTableBody>
    {users.map((u) => (
      <DataTableRow key={u.id}>
        <DataTableCell>{u.name}</DataTableCell>
        <DataTableCell>{u.email}</DataTableCell>
        <DataTableCell>
          <Tag color={u.status === "active" ? "green" : "grey"} aria-label={`Status: ${u.status}`}>
            {u.status}
          </Tag>
        </DataTableCell>
        <DataTableCell align="end">
          <Button variant="ghost" size="sm" aria-label={`Edit ${u.name}`} onClick={() => handleEdit(u)}>
            Edit
          </Button>
        </DataTableCell>
      </DataTableRow>
    ))}
  </DataTableBody>
</DataTable>
```

`DataTable` renders semantic `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`. Add `scope="col"` on column headers, `scope="row"` on first-column row headers if the row is identified by that cell.

**For sortable columns:** wire `aria-sort` on the active sort header.

```tsx
<DataTableHead
  scope="col"
  aria-sort={sortBy === "name" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => toggleSort("name")}
    aria-label={`Sort by name, currently ${sortBy === "name" ? sortDir : "unsorted"}`}
  >
    Name
    {sortBy === "name" && (sortDir === "asc" ? <ChevronUp aria-hidden className="ml-1 h-4 w-4" /> : <ChevronDown aria-hidden className="ml-1 h-4 w-4" />)}
  </Button>
</DataTableHead>
```

---

### Live Regions (Dynamic Content)

**WCAG Criterion:** 4.1.3 Status Messages (Level AA)

#### Polite Announcements (Non-Urgent)

```tsx
// Inline status update
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {savedMessage}
</div>

// Loading state — wire aria-busy
<div role="status" aria-live="polite" aria-busy={isLoading}>
  {isLoading ? "Loading…" : "Content loaded"}
</div>
```

**ef-ds Snackbar + Sonner toasts** already announce content via Radix's Toast primitive with `aria-live="polite"`:

```tsx
import { toast } from "sonner";

toast.success("Profile updated successfully");
toast.error("Failed to save changes", {
  description: "Check your connection and try again.",
});
```

#### Assertive Announcements (Urgent)

```tsx
// Form-level errors and time-sensitive alerts
<div role="alert" aria-live="assertive" className="rounded-md border border-destructive bg-destructive/10 p-4 text-destructive">
  {errorMessage}
</div>

// Mutation error
{mutation.isError && (
  <div role="alert" className="mt-2 text-sm text-destructive">
    {mutation.error.message}
  </div>
)}
```

Use `assertive` sparingly — it interrupts whatever the screen reader is currently saying. For most async UI (toasts, "saved" indicators), `polite` is correct.

#### Visually Hidden Screen Reader Text

Tailwind has a built-in `sr-only` utility (and a paired `not-sr-only` for skip links):

```tsx
// Visible icon + screen-reader-only label
<Button variant="ghost" size="icon-sm">
  <Trash2 aria-hidden className="h-4 w-4" />
  <span className="sr-only">Delete this item — this action cannot be undone</span>
</Button>

// Loading indicator
<div className="flex items-center gap-2">
  <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
  <span className="sr-only">Loading content, please wait</span>
</div>
```

---

## 🎨 Color & Contrast

### WCAG 2.1 Level AA Contrast Requirements

**WCAG Criterion:** 1.4.3 Contrast (Minimum) (Level AA), 1.4.11 Non-text Contrast (Level AA)

| Content Type | Minimum Ratio | Compliance Level |
|--------------|---------------|------------------|
| **Normal text** (< 18pt) | **4.5:1** | AA |
| **Large text** (≥ 18pt or 14pt bold) | **3:1** | AA |
| **UI components** (button borders, input borders, focus ring) | **3:1** | AA |
| **Graphical objects** (icons, chart elements) | **3:1** | AA |
| **States** (active, hover, focus, disabled) | **3:1** | AA (disabled exempt per WCAG) |

---

### ef-design-system Semantic Tokens

The Tailwind theming contract (see `SKILL.md` §18.12) means contrast is **determined by the active theme**, not by hardcoded hex. The token roles are:

| Role | Tailwind utility | Pair (text on fill) |
|---|---|---|
| Primary action | `bg-primary` | `text-primary-foreground` |
| Positive / complete | `bg-success` | `text-success-foreground` |
| Caution / pending | `bg-warning` | `text-warning-foreground` |
| Destructive / error | `bg-destructive` | `text-destructive-foreground` |
| Informational | `bg-info` | `text-info-foreground` |
| Page surface | `bg-background` | `text-foreground` |
| Card surface | `bg-card` | `text-card-foreground` |
| Subtle text | n/a | `text-muted-foreground` |
| Border | `border-border`, `border-input` | n/a |
| Focus ring | `ring-ring` | n/a |

**Each `*-foreground` token is pre-paired with its fill to clear 4.5:1** under the default theme. When a theme is swapped, the audit (`pnpm run theme:audit`) re-validates the pairs.

**Examples:**

```tsx
// ✅ CORRECT — themeable, contrast-safe
<Button variant="primary">Submit</Button>
// Resolves to bg-primary text-primary-foreground — 4.5:1+ under every shipped theme

<div className="rounded-md bg-success/10 p-4 text-success">
  Profile updated successfully
</div>

// ✅ CORRECT — muted body copy, still ≥ 4.5:1
<p className="text-sm text-muted-foreground">Last updated 3 days ago</p>

// ❌ WRONG — bypasses the theme, contrast not validated
<Button className="bg-blue-500 text-white">Submit</Button>

// ❌ WRONG — text-white never updates with the theme; can fail on light fills
<div className="bg-primary text-white">Submit</div>

// ✅ CORRECT
<div className="bg-primary text-primary-foreground">Submit</div>
```

#### Verify contrast for a custom theme

```bash
# Runs on prebuild, can also run on demand
pnpm run theme:audit
```

The audit fails the build if any rendered surface drops below 4.5:1 for normal text or 3:1 for UI/large text under any of the shipped themes.

---

### Don't Rely on Color Alone

**WCAG Criterion:** 1.4.1 Use of Color (Level A)

#### ❌ WRONG: Color Only

```tsx
// Border color is the only "error" signal — fails for color-blind users
<Input className={hasError ? "border-destructive" : "border-input"} />
<p className="text-destructive">Invalid email</p>
```

#### ✅ CORRECT: Color + Icon + Text + ARIA

```tsx
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ef-design-system";

<Field>
  <FieldLabel htmlFor="email">Email address</FieldLabel>
  <Input
    id="email"
    state={hasError ? "error" : "default"}
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : undefined}
    {...form.register("email")}
  />
  {hasError && (
    <FieldError id="email-error" className="flex items-center gap-1">
      <AlertCircle aria-hidden className="h-3.5 w-3.5" />
      <span>Please enter a valid email address (e.g., name@example.com)</span>
    </FieldError>
  )}
</Field>
```

`Input state="error"` already adds the destructive border *and* sets `aria-invalid`, so combining it with an icon + text and `aria-describedby` covers color, shape, text, and the AT layer.

---

### Semantic Status + Icon

| State | Token family | Lucide icon | Use for |
|-------|--------------|-------------|---------|
| **Success** | `success` | `<CheckCircle2 />` | Success messages, completion |
| **Error** | `destructive` | `<AlertCircle />` | Errors, validation failures |
| **Warning** | `warning` | `<TriangleAlert />` (a.k.a. `AlertTriangle`) | Caution, pending review |
| **Info** | `info` | `<Info />` | Information, help, FYI |
| **Primary** | `primary` | depends on action | Selected, active |

```tsx
import { CheckCircle2, AlertCircle, TriangleAlert, Info } from "lucide-react";
import { MessageBar, InfoBar } from "@/components/ef-design-system";

// MessageBar — full-width page banner
<MessageBar
  variant="success"
  title="Cycle published"
  description="All assigned reviewers have been notified."
  actionLabel="View details"
  onAction={handleView}
/>

// InfoBar — inline section banner
<InfoBar
  variant="warning"
  message="3 questions are still missing required answers."
  actionLabel="Jump to first"
  onAction={handleJump}
/>

// Manual pattern using Tag + icon + text
<div role="status" className="flex items-center gap-2 rounded-md bg-success/10 p-3 text-success">
  <CheckCircle2 aria-hidden className="h-5 w-5" />
  <span>Profile updated successfully</span>
</div>
```

ef-ds `Tag`, `Pill`, `Badge`, `MessageBar`, `InfoBar`, `Snackbar` all expose semantic variants (`success`, `warning`, `destructive`, `info`) so the color + icon + label triad is enforced at the component layer.

---

### Testing Color Contrast

**Tools:**
1. **`pnpm run theme:audit`** — built-in, hard-fails the build on contrast violations
2. **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
3. **Chrome DevTools:** Inspect > Accessibility panel
4. **axe DevTools:** Browser extension
5. **WAVE:** Browser extension
6. **`@axe-core/react`** — runtime checker for dev mode (see Automated Testing below)

**Quick manual test:**
```
1. Take a screenshot of your UI
2. Convert to grayscale (macOS: Cmd+Shift+5 → Markup → Filters)
3. Can you still distinguish different elements (states, actions, statuses)?
4. If no, add icons, borders, or text labels until you can
```

---

## 📝 Text & Content

### Reading Level

**WCAG Criterion:** 3.1.5 Reading Level (Level AAA — recommended)

**Guidelines:**
- Target: 8th–9th grade reading level
- Short sentences (15–20 words)
- Common words, no jargon
- Define technical terms on first use
- Follow `_content/content-design-standards.md` for tone

**Examples:**

❌ Complex:
```
"Utilize the aforementioned functionality to facilitate expeditious data transmission."
```

✅ Clear:
```
"Use this feature to send data faster."
```

---

### Text Sizing & Resizing

**WCAG Criterion:** 1.4.4 Resize Text (Level AA), 1.4.10 Reflow (Level AA)

**Requirements:**
- Minimum body text: 14px (ef-ds default for `text-sm`)
- Allow zoom up to 200% without horizontal scrolling
- Reflow at 400% (= 320 CSS px viewport) without losing functionality
- Use `rem` / Tailwind text utilities; never fixed `px` heights on text containers

**Implementation:**
```tsx
// ✅ CORRECT — Tailwind text utilities scale with the user's root font size
<h1 className="text-2xl font-semibold">Page title</h1>
<p className="text-sm text-foreground">Body text</p>
<span className="text-xs text-muted-foreground">Caption</span>

// ✅ CORRECT — buttons sized by padding, not fixed height
<Button size="default">Save</Button>

// ❌ WRONG — fixed pixel height; text gets clipped at 200%
<button style={{ height: 32 }}>Save</button>

// ❌ WRONG — viewport blocks zoom
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

// ✅ CORRECT — allow zoom
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

**Testing:**
```
1. Zoom browser to 200% (Cmd/Ctrl + +)
2. Verify all text is readable
3. Verify nothing is cut off, no horizontal scroll
4. Zoom to 400% — content should reflow into a single column
```

---

### Link Text

**WCAG Criterion:** 2.4.4 Link Purpose (In Context) (Level A)

#### ❌ WRONG: Generic Link Text

```tsx
<a href="/docs">Click here</a> for documentation.
<Link to="/contact">More information</Link>
```

Screen reader users often navigate by listing all links — "Click here" and "More information" carry no context out of that list.

#### ✅ CORRECT: Descriptive Link Text

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/docs">Read the documentation</Link>
<Link to="/contact">Contact our support team</Link>

// Programmatic navigation via Button
<Button variant="link" onClick={() => navigate({ to: "/settings/profile" })}>
  View profile settings
</Button>
```

If the link label *must* be generic for layout reasons, supplement with `aria-label`:

```tsx
<Link to="/users/$id" params={{ id: user.id }} aria-label={`View ${user.name}'s profile`}>
  View
</Link>
```

---

### Headings Hierarchy

**WCAG Criterion:** 1.3.1 Info and Relationships (Level A), 2.4.6 Headings and Labels (Level AA)

**Rules:**
- Exactly one `<h1>` per page (the page title)
- Don't skip levels (`h1` → `h2` → `h3`, NOT `h1` → `h3`)
- Use headings for structure, not styling
- Tabs / wizard steps don't change the heading hierarchy of the page

**Correct structure:**
```tsx
<main>
  <h1 className="text-2xl font-semibold">Cycles</h1>

  <section aria-labelledby="active-cycles">
    <h2 id="active-cycles" className="text-xl font-semibold">Active cycles</h2>
    {/* ... */}

    <h3 className="text-lg font-semibold">Q4 performance review</h3>
    {/* ... */}
  </section>

  <section aria-labelledby="archived-cycles">
    <h2 id="archived-cycles" className="text-xl font-semibold">Archived cycles</h2>
    {/* ... */}
  </section>
</main>
```

**Don't use headings purely for styling:**
```tsx
// ❌ Wrong — h3 used because it looks right, not because it's a section heading
<h3 className="text-sm font-normal">Not a heading, just styled text</h3>

// ✅ Correct — keep the semantic, style with utilities
<p className="text-sm font-medium text-foreground">Emphasized text</p>
```

---

## 🖼️ Images & Media

### Alternative Text

**WCAG Criterion:** 1.1.1 Non-text Content (Level A)

#### Informative Images

```tsx
// Chart / graph
<img src="/sales-chart.png" alt="Bar chart showing 40% sales increase in Q3 2026" />

// Logo
<img src="/eightfold-logo.svg" alt="Eightfold AI" />

// Avatar paired with user info
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src={user.photoUrl} alt={`${user.name}'s profile photo`} />
  <AvatarFallback aria-label={user.name}>
    {user.initials}
  </AvatarFallback>
</Avatar>
```

#### Decorative Images

```tsx
// Decorative background — empty alt + role to skip
<img src="/decorative.svg" alt="" role="presentation" />

// Decorative Lucide icon next to text
<div className="flex items-center gap-2">
  <Star aria-hidden className="h-4 w-4 text-warning" />
  <span>Featured item</span>
</div>

// ef-ds EmptyIllustration — already aria-hidden under the hood
<EmptyIllustration variant="no-data" size="md" />
```

#### Lucide Icons

- **With text:** add `aria-hidden` on the icon — the visible text is the accessible name
- **Icon-only:** put the label on the parent Button/Link with `aria-label`

```tsx
// With text
<Button leadingIcon={<Home aria-hidden className="h-4 w-4" />}>Home</Button>

// Icon-only
<Button variant="ghost" size="icon-sm" aria-label="Close dialog">
  <X aria-hidden className="h-4 w-4" />
</Button>
```

#### Complex Images / Charts

When the image conveys a complex relationship, pair short alt text with a longer description via `aria-describedby`:

```tsx
<figure>
  <img
    src="/architecture-diagram.png"
    alt="Three-tier system architecture diagram"
    aria-describedby="diagram-description"
  />
  <figcaption id="diagram-description" className="mt-2 text-sm text-muted-foreground">
    The diagram shows a three-tier architecture:
    1. Frontend (React 19 + TanStack Router).
    2. API layer (FastAPI).
    3. Database layer (PostgreSQL).
    Arrows indicate data flow from frontend through the API to the database.
  </figcaption>
</figure>
```

For Recharts charts, provide a screen-reader-only data table fallback:

```tsx
<div role="img" aria-label="Sales by quarter">
  <BarChart data={data}>...</BarChart>
</div>
<table className="sr-only">
  <caption>Quarterly sales (USD)</caption>
  <thead>
    <tr><th scope="col">Quarter</th><th scope="col">Sales</th></tr>
  </thead>
  <tbody>
    {data.map((row) => (
      <tr key={row.quarter}>
        <th scope="row">{row.quarter}</th>
        <td>{row.sales.toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
      </tr>
    ))}
  </tbody>
</table>
```

---

### Video & Audio

**WCAG Criterion:** 1.2.2 Captions (Prerecorded) (Level A), 1.2.3 Audio Description or Media Alternative (Level A)

**Requirements:**
- Captions for all video with audio
- Transcripts for audio-only content
- Audio descriptions for video-only content
- Native `<video controls>` (keyboard accessible by default)

```tsx
<video controls aria-label="Product demo video" className="w-full rounded-lg">
  <source src="/demo.mp4" type="video/mp4" />
  <track kind="captions" src="/demo-en.vtt" srcLang="en" label="English" default />
  <track kind="descriptions" src="/demo-desc.vtt" srcLang="en" label="English descriptions" />
</video>

<p className="mt-2 text-sm">
  <a href="/demo-transcript.txt" className="text-primary underline">
    Read the demo transcript
  </a>
</p>
```

---

## 📋 Forms

### Form Labels

**WCAG Criterion:** 3.3.2 Labels or Instructions (Level A), 1.3.1 Info and Relationships (Level A)

**Every input MUST have a visible label.** Placeholders are not labels — they vanish on focus.

```tsx
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ef-design-system";

// ✅ shadcn Field — label association automatic
<Field>
  <FieldLabel htmlFor="email">Email address</FieldLabel>
  <Input id="email" type="email" {...form.register("email")} />
</Field>

// ✅ Explicit <label htmlFor>
<label htmlFor="email-input" className="text-sm font-medium text-foreground">
  Email address
</label>
<Input id="email-input" type="email" />

// ✅ aria-label when a visible label is intentionally omitted (e.g. inline search)
<Input
  aria-label="Search users"
  placeholder="Search…"
  leadingIcon={<Search aria-hidden className="h-4 w-4" />}
/>

// ❌ WRONG — placeholder masquerading as label
<Input placeholder="Email" />
```

**Placeholder vs. Label:**
- **Label** — always visible, programmatically associated with the field
- **Placeholder** — hint about the format (`"name@example.com"`), disappears on focus, NOT a replacement for a label

---

### Error Messages

**WCAG Criterion:** 3.3.1 Error Identification (Level A), 3.3.3 Error Suggestion (Level AA)

**Requirements:**
- Identify fields in error state (`aria-invalid`, `state="error"`, destructive border)
- Provide a clear, specific error message
- Suggest the fix when possible
- Announce errors to screen readers (`role="alert"` or via `aria-describedby` on the input)

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input, Button } from "@/components/ef-design-system";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address (e.g., name@example.com)"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain a number"),
});

type FormValues = z.infer<typeof schema>;

export function SignUpForm() {
  const form = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onBlur" });
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="email">Email address</FieldLabel>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          state={form.formState.errors.email ? "error" : "default"}
          aria-invalid={Boolean(form.formState.errors.email)}
          aria-describedby={form.formState.errors.email ? "email-error" : undefined}
          {...form.register("email")}
        />
        <FieldError id="email-error">{form.formState.errors.email?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          state={form.formState.errors.password ? "error" : "default"}
          aria-invalid={Boolean(form.formState.errors.password)}
          aria-describedby={form.formState.errors.password ? "password-error" : undefined}
          {...form.register("password")}
        />
        <FieldError id="password-error">{form.formState.errors.password?.message}</FieldError>
      </Field>

      <Button type="submit">Continue</Button>
    </form>
  );
}
```

---

### Required Fields

**WCAG Criterion:** 3.3.2 Labels or Instructions (Level A)

```tsx
<Field>
  <FieldLabel htmlFor="email" required>
    Email address
  </FieldLabel>
  <Input id="email" aria-required="true" {...form.register("email")} />
</Field>
```

`FieldLabel required` renders a visible asterisk *and* `<span className="sr-only"> (required)</span>` so the screen reader announces the requirement; the input itself gets `aria-required="true"` via `register`.

If you can't use Field, render the asterisk manually with the SR hint:

```tsx
<label htmlFor="email" className="text-sm font-medium text-foreground">
  Email address
  <span aria-hidden className="ml-1 text-destructive">*</span>
  <span className="sr-only"> (required)</span>
</label>
```

Or use a once-per-form legend so the form layout stays clean:

```tsx
<p className="text-sm text-muted-foreground">
  Fields marked with <span aria-hidden className="text-destructive">*</span> are required.
</p>
```

---

### Form Validation Timing

**WCAG Criterion:** 3.3.4 Error Prevention (Level AA)

**Best Practices:**
- Inline validation on **blur** (`mode: "onBlur"`), not on every keystroke
- Summary of errors at top of form on submit failure
- Confirmation dialog for destructive or irreversible submits
- Allow review-then-submit for legal / financial / data flows

```tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function RegistrationForm() {
  const form = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onBlur" });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const errors = form.formState.errors;

  const onSubmit = async (values: FormValues) => {
    try {
      await registerUser(values);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Registration failed.");
      // Focus the first invalid field
      const firstError = Object.keys(errors)[0] as keyof FormValues | undefined;
      if (firstError) {
        form.setFocus(firstError);
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {submitError && (
        <Alert variant="destructive" role="alert">
          <AlertCircle aria-hidden className="h-4 w-4" />
          <AlertTitle>Registration failed</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {Object.keys(errors).length > 0 && form.formState.isSubmitted && (
        <Alert variant="destructive" role="alert">
          <AlertTitle>Please correct the following:</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>
                  <a
                    href={`#${field}`}
                    onClick={(e) => {
                      e.preventDefault();
                      form.setFocus(field as keyof FormValues);
                    }}
                  >
                    {error?.message}
                  </a>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Fields */}
      <Field>
        <FieldLabel htmlFor="email" required>Email address</FieldLabel>
        <Input id="email" type="email" {...form.register("email")} />
        <FieldError>{errors.email?.message}</FieldError>
      </Field>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Registering…" : "Register"}
      </Button>
    </form>
  );
}
```

---

## ✅ Testing Procedures

### 1. Keyboard Testing

**Goal:** Every interaction is reachable and operable from the keyboard alone.

**Test Checklist:**

- [ ] **Tab through the page**
  - Start at top of page
  - Tab through every interactive element
  - Logical order (matches reading order)
  - No elements skipped

- [ ] **Visible focus**
  - Focus indicator visible on every focusable element
  - `ring-ring` ≥ 2px outline
  - 3:1 contrast with adjacent surface (verified by `pnpm run theme:audit`)
  - Never completely invisible

- [ ] **Keyboard shortcuts**
  - Enter/Space activate buttons
  - Arrow keys navigate Tabs / DropdownMenu / Select
  - Escape closes Dialog / Sheet / DropdownMenu / Popover
  - Type-ahead works on Select / Combobox
  - No custom shortcuts conflict with browser / AT shortcuts

- [ ] **No keyboard traps**
  - Can Tab into and out of every component
  - Modal traps focus intentionally; Escape exits
  - No infinite loops

- [ ] **Skip link**
  - "Skip to main content" appears on first Tab press, jumps to `<main>`

**Process:**
```
1. Disconnect mouse / trackpad
2. Navigate the entire page using only the keyboard
3. Complete every task (form submission, navigation, sort, filter, etc.)
4. Note any unreachable elements or surprising focus jumps
```

---

### 2. Screen Reader Testing

**Goal:** Content is properly announced and operable.

**Screen Readers to Test:**
- **Windows:** NVDA (free) or JAWS
- **Mac:** VoiceOver (built-in, `Cmd+F5`)
- **Mobile:** VoiceOver (iOS), TalkBack (Android)

**Test Checklist:**

- [ ] **Page structure**
  - Landmarks announced (banner, navigation, main, complementary, contentinfo)
  - Heading hierarchy makes sense (`H` key in NVDA cycles through headings)
  - Page `<title>` is descriptive and unique

- [ ] **Navigation**
  - Can navigate by headings (`H`)
  - Can navigate by landmarks (`D`)
  - Can list all links (`Insert+F7` NVDA, `VO+U` VoiceOver)
  - Current page indicated with `aria-current="page"`

- [ ] **Forms**
  - Every input announces its label
  - Required fields announce "required"
  - Errors announce on blur and on submit
  - Field types announced (text, email, checkbox, select)

- [ ] **Interactive elements**
  - Buttons announced as buttons
  - Links announced as links
  - State announced (pressed, checked, selected, expanded)
  - Icon-only buttons have accessible names

- [ ] **Dynamic content**
  - Loading states announced via `aria-busy` / `role="status"`
  - Success / error messages announced via toast (Sonner) or `role="alert"`
  - Live regions (`aria-live`) work

- [ ] **Images**
  - Informative images have meaningful alt text
  - Decorative images hidden (`alt=""` or `aria-hidden`)

**NVDA Quick Keys:**
- `Insert+Down` Read next item
- `H` Next heading
- `D` Next landmark
- `B` Next button
- `F` Next form field
- `L` Next list
- `Insert+F7` Elements list

**VoiceOver Quick Keys (Mac):**
- `VO+Right Arrow` Next item
- `VO+Command+H` Next heading
- `VO+U` Rotor (elements list)
- `VO+Space` Activate item

---

### 3. Color Contrast Testing

**Goal:** Sufficient contrast for every text and UI element under the active theme.

**Tools:**
1. **`pnpm run theme:audit`** — built-in, runs in CI on `prebuild`
2. **axe DevTools** (browser extension) — automated contrast check
3. **WAVE** (browser extension) — visual overlay of contrast issues
4. **Chrome DevTools** — Inspect → Accessibility panel shows ratio
5. **WebAIM Contrast Checker** — https://webaim.org/resources/contrastchecker/ for manual checks

**Test Checklist:**

- [ ] **Body text** ≥ 4.5:1 (AA)
- [ ] **Large text** (≥ 18pt or 14pt bold) ≥ 3:1 (AA)
- [ ] **UI components** (button borders, input borders, focus ring) ≥ 3:1
- [ ] **Icons** that convey information ≥ 3:1
- [ ] **Disabled states** — exempt from contrast, but should still be distinguishable
- [ ] **Custom themes** pass `theme:audit` under every theme variant

---

### 4. Zoom & Reflow Testing

**WCAG Criterion:** 1.4.4 Resize Text (Level AA), 1.4.10 Reflow (Level AA)

**Goal:** Content remains usable at 200% and 400% zoom.

**Test Checklist:**

- [ ] **200% zoom**
  - All text readable
  - No content cut off
  - No horizontal scrolling (vertical OK)
  - All functionality works

- [ ] **400% zoom** (= 320 CSS-px viewport equivalent)
  - Content reflows (no horizontal scrolling)
  - Mobile-like layout
  - All functionality remains operable

- [ ] **Text-only zoom** (Firefox: View > Zoom > Zoom Text Only)
  - Layout adapts; no overflow

**Process:**
```
1. Open page in Chrome
2. Zoom to 200% (Cmd/Ctrl + +)
3. Scroll vertically — verify no horizontal scrollbar
4. Test every interactive element
5. Zoom to 400%
6. Verify content collapses to a single column
```

---

### 5. Automated Testing

**Goal:** Catch common a11y issues early in dev and CI.

#### axe DevTools (Browser Extension)
```
1. Install axe DevTools for Chrome/Firefox
2. Open the page
3. Open DevTools → axe DevTools tab
4. "Scan All of My Page"
5. Review issues by severity (Critical / Serious / Moderate / Minor)
6. Fix → re-scan
```

#### `@axe-core/react` (dev runtime)

Add to `frontend/src/main.tsx` so axe runs in dev only and logs violations to the console:

```tsx
if (import.meta.env.DEV) {
  import("@axe-core/react").then(({ default: axe }) => {
    void axe(React, ReactDOM, 1000);
  });
}
```

#### Vitest + jest-axe (unit / component)

```tsx
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ef-design-system";

expect.extend(toHaveNoViolations);

it("Dialog has no a11y violations", async () => {
  const { container } = render(
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm</DialogTitle>
          <DialogDescription>Are you sure?</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### Playwright + `@axe-core/playwright` (E2E)

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page has no detectable a11y violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

#### Lighthouse (Chrome DevTools)
```
1. DevTools → Lighthouse
2. Categories → Accessibility only
3. Generate report
4. Aim for 100; investigate every yellow / red item
```

#### Storybook + `@storybook/addon-a11y`

Add the a11y addon — every story gets an a11y panel with axe results.

---

### 6. Manual Testing Workflow

**Complete accessibility test (30–45 min per page):**

```
Phase 1: Automated scan (5 min)
├─ axe DevTools
├─ WAVE
├─ Lighthouse
└─ Fix critical issues

Phase 2: Keyboard test (10 min)
├─ Disconnect mouse
├─ Tab through entire page
├─ Test every interaction
├─ Verify focus indicators
└─ Test modals / dropdowns / wizard steps

Phase 3: Screen reader test (15 min)
├─ Turn on NVDA / VoiceOver
├─ Navigate by headings
├─ Navigate by landmarks
├─ Test forms
├─ Test dynamic content (toasts, async)
└─ Verify announcements

Phase 4: Visual test (10 min)
├─ pnpm run theme:audit (passes)
├─ Zoom to 200% then 400%
├─ Test in grayscale (Cmd+Shift+5 → Markup → Filters)
└─ Verify responsive behavior (320 → 1440 px)

Phase 5: Documentation (5 min)
├─ Document issues found
├─ Prioritize fixes
├─ Create tickets
└─ Retest after fix
```

---

## 🚫 Common Accessibility Pitfalls

### 1. ❌ Icon-Only Button Without Label

**Problem:** Screen readers can't describe the button.

```tsx
// ❌ WRONG
<Button variant="ghost" size="icon-sm" onClick={handleClose}>
  <X className="h-4 w-4" />
</Button>
```

**Fix:**
```tsx
// ✅ CORRECT
<Button variant="ghost" size="icon-sm" aria-label="Close dialog" onClick={handleClose}>
  <X aria-hidden className="h-4 w-4" />
</Button>
```

---

### 2. ❌ Missing Form Labels

**Problem:** Screen readers don't announce field purpose; placeholder disappears on focus.

```tsx
// ❌ WRONG
<Input placeholder="Email" />
```

**Fix:**
```tsx
// ✅ CORRECT
<Field>
  <FieldLabel htmlFor="email">Email address</FieldLabel>
  <Input id="email" type="email" placeholder="name@example.com" {...form.register("email")} />
</Field>
```

---

### 3. ❌ Raw Tailwind Color Scales (Theming + Contrast Risk)

**Problem:** `text-white`, `bg-slate-500`, `text-blue-600` etc. don't change with the active theme. Contrast can silently fail when a customer enables their own theme. Also caught by `pnpm run theme:audit` (it hard-fails the build).

```tsx
// ❌ WRONG
<Button className="bg-blue-500 text-white">Submit</Button>
<p className="text-slate-500">Subtitle</p>
<div className="border-gray-300 bg-white">Card</div>
```

**Fix:**
```tsx
// ✅ CORRECT — semantic tokens
<Button variant="primary">Submit</Button>
<p className="text-muted-foreground">Subtitle</p>
<div className="border-border bg-card">Card</div>
```

---

### 4. ❌ Keyboard Trap (Custom Modal)

**Problem:** Rolling your own modal with `<div>`s skips focus trap / focus return / Escape handling.

```tsx
// ❌ WRONG
{isOpen && (
  <div className="fixed inset-0 bg-background/80">
    <div className="rounded-lg bg-card p-6">
      Custom modal — no focus trap, no Escape, no aria-modal
    </div>
  </div>
)}
```

**Fix:**
```tsx
// ✅ CORRECT — use ef-ds Dialog (Radix Dialog under the hood)
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* ... */}
  </DialogContent>
</Dialog>
```

---

### 5. ❌ Missing Alt Text on Avatar / Image

**Problem:** Screen readers can't describe the image.

```tsx
// ❌ WRONG
<img src="/chart.png" />
<Avatar>
  <AvatarImage src={user.photoUrl} />
  <AvatarFallback>{user.initials}</AvatarFallback>
</Avatar>
```

**Fix:**
```tsx
// ✅ CORRECT
<img src="/chart.png" alt="Sales growth chart showing 40% increase" />
<Avatar>
  <AvatarImage src={user.photoUrl} alt={`${user.name}'s profile photo`} />
  <AvatarFallback aria-label={user.name}>{user.initials}</AvatarFallback>
</Avatar>

// Decorative
<img src="/decorative.svg" alt="" role="presentation" />
```

---

### 6. ❌ Div/Span as Button

**Problem:** Not keyboard accessible, not announced as a button.

```tsx
// ❌ WRONG
<div onClick={handleClick} className="cursor-pointer">
  Click me
</div>
```

**Fix:**
```tsx
// ✅ CORRECT
<Button onClick={handleClick}>Click me</Button>
```

If the visual must look like a link or text, use `Button variant="link"` or `Button variant="ghost"`.

---

### 7. ❌ Placeholder as Label

**Problem:** Placeholder disappears on focus, not announced as a label.

```tsx
// ❌ WRONG
<Input placeholder="Enter your email address" />
```

**Fix:**
```tsx
// ✅ CORRECT
<Field>
  <FieldLabel htmlFor="email">Email address</FieldLabel>
  <Input id="email" placeholder="name@example.com" {...form.register("email")} />
</Field>
```

---

### 8. ❌ Killing the Focus Ring

**Problem:** Keyboard users can't see where focus is.

```tsx
// ❌ WRONG
<Button className="focus-visible:outline-none focus-visible:ring-0">
  Action
</Button>

/* or in CSS */
*:focus { outline: none; }
```

**Fix:**
```tsx
// ✅ CORRECT — default focus ring is preserved
<Button>Action</Button>

/* If you need a custom focus style on a custom element */
.custom {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
}
```

---

### 9. ❌ Auto-Dismissing Notification With No User Control

**Problem:** Notification disappears before the user can read it.

```tsx
// ❌ WRONG
useEffect(() => {
  const t = setTimeout(() => setNotification(null), 3000);
  return () => clearTimeout(t);
}, [notification]);
```

**Fix:**
```tsx
// ✅ CORRECT — Sonner toast with a default 8s timer, dismissible, and `aria-live`
import { toast } from "sonner";

toast.success("Profile updated successfully", {
  duration: 8000,
  // Sonner respects prefers-reduced-motion and gives users dismiss buttons
});

// For critical alerts, use a persistent banner with explicit dismiss
<MessageBar
  variant="error"
  title="Connection lost"
  description="We couldn't save your changes."
  actionLabel="Retry"
  onAction={retry}
  onClose={dismiss}
/>
```

---

### 10. ❌ Color-Only Error / Status Indication

**Problem:** Color-blind users can't identify errors or distinguish statuses.

```tsx
// ❌ WRONG — border color is the only signal
<Input className={hasError ? "border-destructive" : "border-input"} />

// ❌ WRONG — status differentiated only by color
<span className="bg-success/10 text-success">Active</span>
<span className="bg-warning/10 text-warning">Pending</span>
<span className="bg-destructive/10 text-destructive">Overdue</span>
```

**Fix:**
```tsx
// ✅ CORRECT — semantic state on Input + icon + text in the error message
<Input state="error" aria-invalid aria-describedby="email-error" />
<FieldError id="email-error" className="flex items-center gap-1">
  <AlertCircle aria-hidden className="h-3.5 w-3.5" />
  <span>Enter a valid email address</span>
</FieldError>

// ✅ CORRECT — ef-ds Tag with icon-coded variants
<Tag color="green" leadingIcon={<CheckCircle2 aria-hidden className="h-3.5 w-3.5" />}>
  Active
</Tag>
<Tag color="orange" leadingIcon={<Clock aria-hidden className="h-3.5 w-3.5" />}>
  Pending
</Tag>
<Tag color="red" leadingIcon={<AlertCircle aria-hidden className="h-3.5 w-3.5" />}>
  Overdue
</Tag>
```

---

### 11. ❌ `text-white` on Solid Fills

**Problem:** White literal doesn't respond to theme; can fail contrast under light fills.

```tsx
// ❌ WRONG
<Button className="bg-primary text-white">Submit</Button>
<div className="bg-success text-white">Done</div>
```

**Fix:**
```tsx
// ✅ CORRECT — pair each fill with its foreground token
<Button variant="primary">Submit</Button>  {/* bg-primary text-primary-foreground */}
<div className="bg-success text-success-foreground">Done</div>
```

---

### 12. ❌ Forgetting `data-state` ARIA on Radix-Driven Custom Triggers

**Problem:** When you build a custom trigger for a Radix component via `asChild`, you can accidentally drop the wiring (`data-state`, `aria-expanded`, etc.).

```tsx
// ❌ WRONG — wraps trigger in a plain div, breaking ARIA + data-state
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <div className="cursor-pointer">
      <ChevronDown />
    </div>
  </DropdownMenuTrigger>
</DropdownMenu>
```

**Fix:**
```tsx
// ✅ CORRECT — asChild on a Button (which forwards refs and props)
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon-sm" aria-label="Row actions">
      <MoreVertical aria-hidden className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
</DropdownMenu>
```

Radix uses `data-state="open"|"closed"` and `aria-expanded` on the trigger. Use it for styling open states (`data-[state=open]:bg-muted`) instead of tracking the open state in React.

---

## 🎓 Accessibility Best Practices

### DO ✅

1. **Use semantic HTML and ef-ds primitives**
   - Use `Button`, not `<div onClick>`
   - Use TanStack Router `<Link>`, not `<Button onClick={navigate}>`
   - Use `<h1>`–`<h6>` for structure
2. **Provide text alternatives**
   - `alt` on every `<img>`
   - `aria-label` on icon-only Buttons
   - Captions / transcripts for video / audio
3. **Ensure keyboard access**
   - Every interactive element reachable with Tab
   - Logical tab order matches reading order
   - Visible focus indicators (`ring-ring`)
4. **Maintain color contrast**
   - Run `pnpm run theme:audit`
   - 4.5:1 for body, 3:1 for large text / UI / icons
   - Never `text-white` on themed surfaces — use `text-*-foreground`
5. **Test with assistive technologies**
   - NVDA or VoiceOver
   - Keyboard only
   - 200% / 400% zoom
6. **Use ARIA only when semantic HTML / Radix isn't enough**
   - First rule of ARIA: don't use ARIA
   - Follow ARIA Authoring Practices
7. **Handle errors gracefully**
   - Clear, specific messages
   - Associate errors with fields via `aria-describedby`
   - Suggest the fix
8. **Support text resize**
   - Tailwind text utilities (`text-sm`, `text-base`, `text-lg`)
   - Avoid fixed pixel heights on text containers

### DON'T ❌

1. **Don't remove focus indicators** — `outline: none` / `focus:ring-0` without replacement
2. **Don't use color alone** — pair with icon, text, or state
3. **Don't rely on mouse** — every action keyboard-operable
4. **Don't use placeholder as label** — placeholders disappear on focus
5. **Don't block zoom** — never `maximum-scale=1` or `user-scalable=no`
6. **Don't auto-play media** — provide controls, allow user to start
7. **Don't create keyboard traps** — except modals (Escape to close)
8. **Don't use `<div>` as a button** — use `Button`
9. **Don't use raw Tailwind color scales** — use the semantic token contract (see `SKILL.md` §18.12)
10. **Don't render unsanitized user HTML** — XSS + a11y risk

---

## 📚 Resources

### Official Standards
- **WCAG 2.2 Quick Reference:** https://www.w3.org/WAI/WCAG22/quickref/
- **WCAG 2.1 Quick Reference:** https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices (APG):** https://www.w3.org/WAI/ARIA/apg/
- **Section 508:** https://www.section508.gov/

### Stack-Specific Docs
- **Radix UI accessibility notes:** https://www.radix-ui.com/primitives/docs/overview/accessibility
- **shadcn/ui (built on Radix):** https://ui.shadcn.com/
- **TanStack Router accessibility:** https://tanstack.com/router/latest/docs/framework/react/guide/router-context (focus management on navigation)
- **React Hook Form accessibility:** https://react-hook-form.com/get-started#TypeScript
- **Lucide React (icon set):** https://lucide.dev/

### Testing Tools
- **axe DevTools:** https://www.deque.com/axe/devtools/
- **WAVE:** https://wave.webaim.org/extension/
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Lighthouse:** Built into Chrome DevTools
- **`@axe-core/react`:** https://github.com/dequelabs/axe-core-npm/tree/develop/packages/react
- **`@axe-core/playwright`:** https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright
- **`jest-axe`:** https://github.com/nickcolley/jest-axe

### Screen Readers
- **NVDA (Windows, free):** https://www.nvaccess.org/download/
- **JAWS (Windows):** https://www.freedomscientific.com/products/software/jaws/
- **VoiceOver (Mac):** Built-in (`Cmd+F5`)
- **TalkBack (Android):** Built-in

### Learning
- **WebAIM:** https://webaim.org/
- **A11y Project:** https://www.a11yproject.com/
- **MDN Accessibility:** https://developer.mozilla.org/en-US/docs/Web/Accessibility

### ef-design-system Resources
- **Component source:** `src/components/<Name>/<Name>.tsx` at repo root
- **Boilerplate:** `frontend/src/components/ef-design-system/`
- **Theming contract:** `SKILL.md` §18.12
- **Navbar a11y rule:** `.claude/skills/_shared/theme-navbar-rule.md`
- **Anti-pattern scan:** `references/anti-pattern-scan.md`

---

## 📋 Accessibility Checklist

### Quick Pre-Launch Checklist

**Page structure:**
- [ ] Proper heading hierarchy (one `<h1>`, no skipped levels)
- [ ] Landmarks present (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`)
- [ ] Skip-to-main-content link
- [ ] Page `<title>` is descriptive

**Keyboard:**
- [ ] All interactive elements keyboard accessible
- [ ] Logical tab order
- [ ] Visible focus indicators (`ring-ring`)
- [ ] No keyboard traps
- [ ] Modals trap focus with Escape to exit

**Screen readers:**
- [ ] All images have alt text (or `alt=""` if decorative)
- [ ] All Buttons have accessible names (visible text or `aria-label`)
- [ ] All form fields have labels (`Field` + `FieldLabel`)
- [ ] Error messages announced (`role="alert"` or `aria-describedby`)
- [ ] Dynamic content changes announced (Sonner toasts, `aria-live`)

**Color & contrast:**
- [ ] `pnpm run theme:audit` passes
- [ ] Text contrast ≥ 4.5:1
- [ ] Large text ≥ 3:1
- [ ] UI components ≥ 3:1
- [ ] Color not used as the only indicator (always pair with icon + text)
- [ ] No `text-white` / `bg-slate-*` / raw hex anywhere outside `src/components/dev/**`

**Forms:**
- [ ] All fields have labels
- [ ] Required fields indicated (`*` + `aria-required`)
- [ ] Error messages clear and specific
- [ ] Errors linked to fields (`aria-describedby`)
- [ ] Validation runs on blur, not every keystroke

**Zoom & reflow:**
- [ ] Usable at 200% zoom
- [ ] No horizontal scrolling at 200%
- [ ] Reflows at 400% zoom

**Testing:**
- [ ] Automated scan (axe DevTools, WAVE)
- [ ] Keyboard test (mouse disconnected)
- [ ] Screen reader test (NVDA / VoiceOver)
- [ ] Zoom test (200% / 400%)
- [ ] `pnpm run theme:audit` clean
- [ ] `vitest` axe component tests pass

---

## WCAG 2.2 — New Success Criteria

WCAG 2.2 (W3C Recommendation, October 2023) added six net-new success criteria on top of WCAG 2.1. ef-design-system applications targeting WCAG 2.2 AA must satisfy all six.

### 2.4.11 Focus Not Obscured (Minimum) — Level AA

**Goal:** When an element receives focus, no part of it should be hidden by author-created content (sticky headers, fixed footers, cookie banners, persistent toasts).

**Anti-pattern:**
```tsx
// ❌ Sticky header — focused element scrolls behind it
<header className="fixed top-0 h-16 w-full bg-navbar-bg">…</header>
<main>
  {/* When you Tab to an input near the top, the header covers it */}
  <Input id="name" {...form.register("name")} />
</main>
```

**Fix — scroll-margin on focusable elements:**
```tsx
// Tailwind class scroll-mt-20 applies scroll-margin-top so the focus scroll lands below the header
<main className="pt-16">
  <Input id="name" className="scroll-mt-20" {...form.register("name")} />
</main>

// Or globally for all focusables under a sticky header
<style>
  {`
    .has-sticky-header :focus-visible {
      scroll-margin-top: 5rem;
    }
  `}
</style>
```

**Fix — auto-collapse / move sticky elements out of the way:**
```tsx
import { useEffect, useRef } from "react";

function useDismissOnFocus<T extends HTMLElement>(ref: React.RefObject<T>) {
  useEffect(() => {
    const handler = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !ref.current) return;
      const headerRect = ref.current.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      if (targetRect.top < headerRect.bottom) {
        ref.current.style.transform = "translateY(-100%)";
      }
    };
    document.addEventListener("focusin", handler);
    return () => document.removeEventListener("focusin", handler);
  }, [ref]);
}
```

**Quick test:** Tab through the page. The currently focused element must be fully visible at all times.

---

### 2.5.7 Dragging Movements — Level AA

**Goal:** Any drag-and-drop action must have a single-pointer (click / tap) or keyboard alternative.

**Anti-pattern:**
```tsx
// ❌ Drag-only reorder using react-beautiful-dnd / dnd-kit with no keyboard fallback
<DragDropContext onDragEnd={handleReorder}>
  <Droppable droppableId="goals">
    {(provided) => (
      <ul ref={provided.innerRef} {...provided.droppableProps}>
        {goals.map((g, i) => (
          <Draggable key={g.id} draggableId={g.id} index={i}>
            {(prov) => (
              <li ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                {g.title}
              </li>
            )}
          </Draggable>
        ))}
      </ul>
    )}
  </Droppable>
</DragDropContext>
```

**Fix — add up/down buttons alongside the drag handle:**
```tsx
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ef-design-system";

function ReorderableGoal({ goal, index, onMoveUp, onMoveDown, isFirst, isLast }: Props) {
  return (
    <li className="flex items-center gap-2 rounded-md border border-border p-3">
      <GripVertical aria-hidden className="h-4 w-4 text-muted-foreground" />
      <span className="flex-1">{goal.title}</span>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Move "${goal.title}" up`}
        disabled={isFirst}
        onClick={() => onMoveUp(index)}
      >
        <ChevronUp aria-hidden className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Move "${goal.title}" down`}
        disabled={isLast}
        onClick={() => onMoveDown(index)}
      >
        <ChevronDown aria-hidden className="h-4 w-4" />
      </Button>
    </li>
  );
}
```

For `dnd-kit`, also enable the built-in keyboard sensor:
```tsx
import { useSensor, useSensors, KeyboardSensor, PointerSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
);
```

**Quick test:** Disconnect your mouse. Can you reorder, move, or pan every drag interaction with keyboard alone?

---

### 2.5.8 Target Size (Minimum) — Level AA

**Goal:** Pointer targets at least **24×24 CSS px** (ef-ds aims for 44×44 wherever practical, matching iOS HIG / Material).

**Anti-pattern:**
```tsx
// ❌ 16x16 icon button, tap target too small on mobile
<button onClick={handleRemove} className="h-4 w-4">
  <X />
</button>
```

**Fix:**
```tsx
// ✅ Use ef-ds Button icon-sm (32x32) or icon (40x40)
<Button variant="ghost" size="icon-sm" aria-label="Remove tag">
  <X aria-hidden className="h-4 w-4" />
</Button>

// ✅ For 16px icons that must be tappable, expand the hit area with pseudo-element padding
<button
  type="button"
  aria-label="Remove tag"
  className="relative inline-flex h-4 w-4 items-center justify-center before:absolute before:-inset-2 before:content-['']"
>
  <X aria-hidden className="h-4 w-4" />
</button>
```

**ef-design-system Button size matrix:**

| Size | Min target | Use for |
|---|---|---|
| `xs` | ~28×28 | dense table row actions |
| `sm` | ~32×32 | secondary controls |
| `default` | ~40×40 | primary CTAs |
| `lg` | ~48×48 | mobile-primary CTAs |
| `icon-xs` | 28×28 | dense icon buttons (table rows) |
| `icon-sm` | 32×32 | toolbar icons — meets 24×24 |
| `icon` | 40×40 | nav icons |
| `icon-lg` | 48×48 | mobile icons |

**Exceptions allowed by WCAG 2.2:**
- Inline text links (within a sentence)
- Equivalent target available elsewhere on the page
- Browser- or user-agent-controlled targets

**Quick test:** Use Chrome DevTools → Toggle device toolbar → Mobile (iPhone). Tap every interactive element. Anything < 24×24 fails.

---

### 3.2.6 Consistent Help — Level A

**Goal:** Help mechanisms (contact link, chat widget, help center link, support email) appear in the same relative location across pages.

**Anti-pattern:**
```tsx
// ❌ Help link in nav on home, in footer on settings, missing on dashboard
```

**Fix — put help in your AppShell:**
```tsx
import { Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/ef-design-system";
import { HelpCircle } from "lucide-react";

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <header>
        <Navbar
          tabs={navTabs}
          user={currentUser}
          avatarMenuItems={[
            ...avatarMenu,
            { label: "Help", href: "/help", leadingIcon: <HelpCircle aria-hidden className="h-4 w-4" /> },
          ]}
        />
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6">
        <a href="/help" className="text-sm text-muted-foreground hover:text-foreground">
          Help & Support
        </a>
      </footer>
    </div>
  );
}
```

Pick **one** location (avatar menu, footer link, or persistent help button) and keep it there. If you use a floating Help button, give it a stable position across every route.

---

### 3.3.7 Redundant Entry — Level A

**Goal:** Don't ask the user to re-enter information they already provided in the same process.

**Anti-pattern:**
```tsx
// ❌ Multi-step wizard re-asks the same email on step 4 that was captured on step 1
function Step4() {
  const { register } = useForm<{ email: string }>();
  return <Input {...register("email")} placeholder="Email" />;
}
```

**Fix — persist wizard state in a Zustand store, hydrate fields:**
```tsx
import { create } from "zustand";

interface WizardState {
  email: string;
  fullName: string;
  setEmail: (v: string) => void;
  setFullName: (v: string) => void;
}

const useWizardStore = create<WizardState>((set) => ({
  email: "",
  fullName: "",
  setEmail: (email) => set({ email }),
  setFullName: (fullName) => set({ fullName }),
}));

function Step4() {
  const { email, setEmail } = useWizardStore();
  return (
    <Field>
      <FieldLabel htmlFor="email">Email address</FieldLabel>
      <Input
        id="email"
        type="email"
        value={email}
        readOnly
        aria-describedby="email-prefill-hint"
      />
      <FieldDescription id="email-prefill-hint">
        We saved your email from the first step. <a href="#" onClick={resetEmail}>Edit</a>
      </FieldDescription>
    </Field>
  );
}
```

**Use HTML autofill tokens** so the browser can pre-fill known values:
```tsx
<Input id="email" type="email" autoComplete="email" {...form.register("email")} />
<Input id="given-name" autoComplete="given-name" {...form.register("firstName")} />
<Input id="family-name" autoComplete="family-name" {...form.register("lastName")} />
<Input id="address-line1" autoComplete="street-address" {...form.register("street")} />
```

**Exceptions:** security-sensitive re-entry (confirm password, confirm payment) is allowed.

---

### 3.3.8 Accessible Authentication (Minimum) — Level AA

**Goal:** No authentication step depends on a cognitive function test (memorize-then-type, transcribe-from-audio, solve a puzzle).

**Anti-patterns:**
- Distorted-text CAPTCHA with no alternative
- "Type the third character of your password" (memory test)
- Math puzzles ("What's 7 + 9?") as the only spam gate
- Disabling paste on password fields (forces memorize-then-type)

**Fix — allow paste on password fields:**
```tsx
// ✅ Default: paste is allowed. Don't override.
<Input id="password" type="password" autoComplete="current-password" {...form.register("password")} />

// ❌ NEVER do this
<Input
  type="password"
  onPaste={(e) => e.preventDefault()}
  {...form.register("password")}
/>
```

**Fix — SSO / OAuth as the primary path:**
```tsx
import { Button } from "@/components/ef-design-system";
import { Chrome } from "lucide-react";

<div className="space-y-3">
  <Button variant="outline" size="lg" className="w-full" onClick={signInWithGoogle}>
    <Chrome aria-hidden className="mr-2 h-4 w-4" />
    Continue with Google
  </Button>
  <Button variant="outline" size="lg" className="w-full" onClick={signInWithMicrosoft}>
    Continue with Microsoft
  </Button>
</div>
```

SSO satisfies 3.3.8 because the cognitive function test is delegated to the identity provider, which is required to be accessible itself.

**Fix — CAPTCHA with a non-cognitive fallback:**
```tsx
// ✅ Use a CAPTCHA that includes alternative verification methods
//   (Google reCAPTCHA v3 / hCaptcha both expose audio + accessibility cookies)
<div className="g-recaptcha" data-sitekey={siteKey} data-callback={onVerify} />
```

**Fix — passkeys (WebAuthn):**
```tsx
// ✅ WebAuthn / passkeys are explicitly recognized as 3.3.8-compliant
const credential = await navigator.credentials.get({
  publicKey: { challenge, allowCredentials, userVerification: "required" },
});
```

**Quick test:** Sign in to your app using only your password manager's autofill (no typing). If paste is blocked or copy-from-manager is broken, you fail 3.3.8.

---

### Summary table — WCAG 2.2 net-new criteria

| Criterion | Level | One-line gate |
|---|---|---|
| 2.4.11 Focus Not Obscured (Minimum) | AA | Sticky / fixed elements never hide a focused element. Use `scroll-margin-top` or auto-collapse on focus. |
| 2.5.7 Dragging Movements | AA | Every drag interaction has a button / keyboard alternative. |
| 2.5.8 Target Size (Minimum) | AA | Pointer targets ≥ 24×24 CSS px. Use ef-ds `Button` sizes `sm`+ or `icon-sm`+. |
| 3.2.6 Consistent Help | A | Help / contact link lives in the same relative location on every page (AppShell). |
| 3.3.7 Redundant Entry | A | Don't re-ask data already provided in the same flow. Use wizard state, autofill tokens. |
| 3.3.8 Accessible Authentication (Minimum) | AA | No cognitive tests. Allow paste on password fields. SSO / passkeys are first-class. |

**Last Updated:** May 22, 2026
**Status:** Complete — WCAG 2.1 Level AA + WCAG 2.2 AA net-new

**For questions or contributions, open an issue against `ef-design-system` or PR this file.**
