---
name: design-og-frontend-engineer
description: >
  Production-quality frontend engineering against the OG Octuple Design System — the pre-Tailwind, original Eightfold component library (`@eightfold.ai/octuple`).
  Use this skill ONLY when the design system in play is OG Octuple. For the new Tailwind ef-design-system, use design-tw-frontend-engineer instead — the two libraries have different package names, different prop conventions, and are not interoperable.
  Covers component verification (npm run check-props), correct import patterns, the 12 critical mistakes that have been made repeatedly (forced button dimensions, emojis instead of MDI icons, custom components for things Octuple already has, Row/Col flex gotchas, card max-width, etc.), TypeScript discipline, accessibility minimums, and how to record new learnings into the team's accumulated quirks file.
  Trigger when the user says "build this in Octuple", "use Octuple components", "wire up this Octuple screen", "make this production-ready in Octuple", or when working in a codebase that imports from `@eightfold.ai/octuple`.
---

# Design (OG) — Frontend Engineer

You are writing **production-quality React + TypeScript code** against the OG Octuple Design System. Octuple is Eightfold's original component library — it predates the new Tailwind-based `ef-design-system`. The two libraries are **not interoperable**; importing from one while working in the other will produce broken UI.

The single most expensive mistake on this codebase is **inventing component APIs**. Octuple has been built up over years and many of its prop names, enum values, and child-vs-array patterns are non-obvious. If you have not checked a component's actual TypeScript definition before using it, you have not done the job.

---

## Pre-conditions

Before writing any code:

1. The user has confirmed they want the **OG version** (not tailwind). If they haven't, ask.
2. `@eightfold.ai/octuple` is a dependency in `package.json`. If it isn't, this is the wrong skill — they probably want `design-tw-frontend-engineer`.
3. The Octuple CSS is imported once in the entry file: `import '@eightfold.ai/octuple/lib/octuple.css';`
4. You have read `references/learnings.md` — that file is the team's accumulated scar tissue. The rules there override anything in the official docs when they conflict (and they sometimes do, e.g. `SearchBox` is officially supported but team practice is to avoid it).

---

## Supporting Files (Read Before Building)

| File | When to read |
|---|---|
| [`references/session-rules.md`](references/session-rules.md) | **Read first.** Session-start checklist, the "remember this" learning loop, page-organization rules, and the documentation hierarchy. The original Cursor-rules file ported in verbatim. |
| [`references/critical-rules.md`](references/critical-rules.md) | **Read first.** The 12 critical mistakes that have been made repeatedly across projects, each with the wrong and correct code. |
| [`references/learnings.md`](references/learnings.md) | **Read first.** Accumulated quirks and gotchas. Update this file when you fix a new class of mistake. |
| [`references/workflow.md`](references/workflow.md) | The session workflow — what to do before generating code, how to verify, and when to update learnings. |
| [`references/quick-reference.md`](references/quick-reference.md) | Component decision trees and a "common problems → solution" lookup table. Reach for this when you're not sure which component to use. |
| [`references/design-system-overview.md`](references/design-system-overview.md) | Integrated reference for all 72 Octuple components in one file. Use when you want a single pass over the system; use per-component docs when you need depth on one. |
| [`references/component-patterns.md`](references/component-patterns.md) | Copy-ready patterns: forms, tables, layouts, dashboards, navigation, modals, person cards. |
| [`references/api-reference.md`](references/api-reference.md) | Authoritative component name + prop list. The source of truth when there's any doubt. |
| [`references/accessibility.md`](references/accessibility.md) | WCAG 2.1 AA requirements. Form labels, aria-label on icon-only buttons, focus management, color contrast. |
| `../design-og-component-reference/components/<Name>.md` | Per-component deep docs. Grep for the specific component you need. |
| `../_content/content-design-standards.md` | Voice, tone, and copy rules for every label, button, error, tooltip. |
| `../_content/terms-list.md` | Authoritative product terminology — grep for the specific term. |
| `../../../gems/response-confidence-score.md` | Confidence-scoring rubric for AI-mediated copy (chat responses, recommendations). Apply when shipping UI that needs to signal AI uncertainty. |
| `../../../gems/guidance-layer.md` | Guidance-layer guardrails — how to express limitations and defer to a human in AI features. |
| `../../../gems/OH/prompt-instructions.md` | OH Gem persona + scope. Reference when building screens that interact with OH. |
| `../../../gems/OH/content-quality-framework.md` | Content-quality rubric used by OH. Apply to copy on screens that present OH outputs. |

---

## The non-negotiable workflow

For every new component you haven't used in this session:

```
1. Check whether Octuple has it           → grep design-og-component-reference/components/
2. Look up the actual prop API            → npm run check-props ComponentName
                                            OR cat node_modules/@eightfold.ai/octuple/lib/components/<Name>/<Name>.types.d.ts
3. Find a verified pattern                → references/component-patterns.md
4. Check accumulated quirks               → references/learnings.md (does it have a quirk for this component?)
5. Write the code with the verified API
6. Test in browser
7. If anything broke, add a learning      → references/learnings.md
```

**Never guess props.** Octuple's prop names diverge from common conventions in many places: `text` instead of `children` on Button, `iconProps` instead of `icon`, `items` array on Menu instead of `<Menu.Item>` children, `<Tab>` children on Tabs instead of items array, string sizes (`"32px"`) on Avatar instead of enum sizes. Always verify.

---

## Forbidden — the things that have burned us

These are mistakes from real PRs that broke production or wasted reviewer time. They are forbidden, not "discouraged":

### 1. Custom CSS for things Octuple components do

```tsx
// ❌ FORBIDDEN
<div className="flex p-4 bg-blue-500">
<div className="d-flex justify-content-between">
<div style={{ width: '36px', height: '36px', borderRadius: '50%' }}>  // forced button dims

// ✅ Use Octuple's API
<Row justify="space-between">
<Button shape={ButtonShape.Round} size={ButtonSize.Small} />
```

No Tailwind. No Bootstrap. No Material-UI. No utility classes. No `className="flex"`. The single exception is **layout flexbox glue** between Octuple components where Row/Col is wrong for the case — see Mistake 10 in [`references/critical-rules.md`](references/critical-rules.md).

### 2. Emojis instead of MDI icons

```tsx
// ❌ FORBIDDEN
<span>🏠 Home</span>
<span>📍 Santa Clara</span>

// ✅ MDI icons from @mdi/js
import Icon from '@mdi/react';
import { mdiHome, mdiMapMarkerOutline } from '@mdi/js';
<Icon path={mdiHome} size={0.8} />
```

Icons come from https://pictogrammers.com/library/mdi/. Emojis render inconsistently across platforms and look unprofessional next to Octuple's polished components.

### 3. Raw HTML elements where an Octuple component exists

```tsx
// ❌ FORBIDDEN
<button onClick={fn}>Click me</button>
<input type="text" />
<select>...</select>

// ✅ Octuple
<Button text="Click me" onClick={fn} variant={ButtonVariant.Primary} />
<TextInput value={v} onChange={onChange} />
<Select options={opts} value={v} onChange={onChange} />
```

### 4. Default imports

```tsx
// ❌ FORBIDDEN
import Button from '@eightfold.ai/octuple/Button';

// ✅ Named imports
import { Button } from '@eightfold.ai/octuple';
```

### 5. Component name guesses

| Guess | Actual |
|---|---|
| `Input` | `TextInput` |
| `Input.TextArea` | `TextArea` |
| `Tag` | `Badge` or `Pill` |
| `Sider` | `Layout.Aside` |
| `Checkbox` | `CheckBox` |
| `Radio` | `RadioButton` |

When in doubt, see [`references/api-reference.md`](references/api-reference.md).

### 6. Row/Col without explicit flex

Octuple's `<Row>` doesn't display as flexbox by default. Columns stack vertically unless you add `display: 'flex'`. This has caused dozens of "evaluations panel renders below content instead of beside it" bugs.

```tsx
// ❌ Stacks vertically
<Row gutter={24}><Col span={16}>...</Col><Col span={8}>...</Col></Row>

// ✅ Side by side
<Row gutter={24} style={{ display: 'flex', flexWrap: 'nowrap' }}>
  <Col span={8} style={{ flex: '0 0 66.666%', maxWidth: '66.666%' }}>...</Col>
  <Col span={4} style={{ flex: '0 0 33.333%', maxWidth: '33.333%' }}>...</Col>
</Row>
```

**Octuple uses a 12-column grid, not 24-column.** Spans go 1–12.

### 7. Forced button dimensions

```tsx
// ❌ Breaks Octuple's internal sizing system
<Button style={{ width: '36px', height: '36px', borderRadius: '50%' }} />

// ✅ Use the size and shape props
<Button
  iconProps={{ path: mdiPencil as unknown as IconName }}
  size={ButtonSize.Medium}    // Small=28px, Medium=36px, Large=44px
  shape={ButtonShape.Round}
  ariaLabel="Edit"
/>
```

`ariaLabel` is **required** for icon-only buttons.

### 8. Custom components instead of Octuple's

| Need | Octuple component |
|---|---|
| Toggle switch | `<CheckBox toggle />` |
| Skill / tag chip | `<SkillTag label="…" />` |
| Tabs | `<Tabs>` + `<Tab>` children |
| Pill / badge | `<Pill>` or `<Badge>` |
| Stepper | `<Stepper>` |
| Search input | `<TextInput iconProps={{ path: mdiMagnify }} alignIcon={TextInputIconAlign.Left} clearable />` (NOT `SearchBox` — see learnings) |

### 9. Card max-width not overridden

Octuple Cards have internal max-width. If you need full-width cards, add this once to global CSS:

```css
[class*="card-module_card"] {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
}
```

### 10. Row/Col for grouped fields

If you have a search bar with two inputs and a button that should stay together at a fixed width — that's flexbox, not Row/Col. Row/Col is for **page-level responsive grid**, not in-line grouping.

```tsx
// ✅ Grouped — flexbox
<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
  <TextInput style={{ width: '280px' }} placeholder="Search" />
  <TextInput style={{ width: '280px' }} placeholder="Location" />
  <Button text="Go" />
</div>

// ❌ Spreads across the page
<Row gutter={16}>
  <Col md={4}><TextInput /></Col>
  <Col md={4}><TextInput /></Col>
  <Col md={4}><Button /></Col>
</Row>
```

### 11. SearchBox component

The SearchBox component has unresolved icon-alignment bugs. Use `<TextInput>` with `iconProps` and `alignIcon` instead. See [`references/learnings.md`](references/learnings.md) for the full pattern.

### 12. No `aria-label` on icon-only buttons

```tsx
// ❌ Screen readers say "button"
<Button iconProps={{ path: mdiPencil }} />

// ✅ Accessible
<Button iconProps={{ path: mdiPencil }} ariaLabel="Edit profile" />
```

---

## Quick code templates

### Form

```tsx
import { Form, TextInput, Button, ButtonVariant } from '@eightfold.ai/octuple';

const MyForm = () => {
  const [form] = Form.useForm();
  const handleSubmit = (values: { name: string }) => {
    // …
  };
  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item label="Name" name="name" rules={[{ required: true, message: "Enter a name" }]}>
        <TextInput placeholder="Enter name" />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" text="Save" variant={ButtonVariant.Primary} />
      </Form.Item>
    </Form>
  );
};
```

### Table

```tsx
import { Table, Button } from '@eightfold.ai/octuple';

type Row = { id: string; name: string; status: 'active' | 'archived' };

const cols = [
  { title: 'Name',   dataIndex: 'name', key: 'name' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  {
    title: 'Actions',
    key: 'actions',
    render: (_: unknown, r: Row) => <Button text="Open" onClick={() => open(r)} />,
  },
];

<Table dataSource={rows} columns={cols} rowKey="id" />
```

### Layout shell

```tsx
import { Layout } from '@eightfold.ai/octuple';
const { Header, Aside, Content, Footer } = Layout;

<Layout>
  <Aside width={240}>{/* nav */}</Aside>
  <Layout>
    <Header>{/* top bar */}</Header>
    <Content>{/* page */}</Content>
    <Footer>{/* footer */}</Footer>
  </Layout>
</Layout>
```

---

## Page organization (where your code lives)

When adding example pages, use the product-line folders:

```
src/pages/TalentManagement/      — Employee profiles, people search, org charts
src/pages/TalentAcquisition/     — Candidate details, job postings, applications
src/pages/PersonalCareerSite/    — Career pages, job search
src/pages/WorkforceExchange/     — Marketplace
src/pages/AIAgents/              — AI-powered features
src/pages/ResourceManagement/    — Resource allocation, staffing
```

If a category is missing, ask the user before creating a new top-level folder.

---

## TypeScript discipline

- Strict mode is on. No `any` in new code without an explanatory comment.
- Define prop interfaces alongside the component: `interface Props { … }` then `const Foo: React.FC<Props> = …`.
- Import enums (`ButtonVariant`, `ButtonSize`, `ButtonShape`, `TextInputIconAlign`, …) — don't pass raw strings unless the prop is typed `string`.
- `iconProps` accepts `{ path: string }` but the path needs the `as unknown as IconName` cast in older Octuple versions: `iconProps={{ path: mdiPencil as unknown as IconName }}`. The cast is a workaround for an Octuple type-export gap; do not "fix" by changing `IconName`.

---

## Accessibility minimums

Every screen ships with at least:

- Headings in a logical hierarchy (no skipped levels)
- Visible labels on form fields (Form.Item label, not just placeholder)
- `ariaLabel` on every icon-only button
- Color is not the sole conveyor of meaning (status pills also have text)
- Focus is visible on all interactive elements
- Keyboard navigation works for tabs, menus, modals

Full requirements: [`references/accessibility.md`](references/accessibility.md).

---

## When something breaks — the learning loop

When you make a new mistake or discover a quirk:

1. **Identify the root cause.** Why did Octuple behave that way?
2. **Add an entry to [`references/learnings.md`](references/learnings.md)** in the Lessons Learned section, at the top. Format:
   ```markdown
   ### [Brief Title]
   **Date:** YYYY-MM-DD
   **Context:** What you were trying to do
   **Problem:** What went wrong
   **Solution:** The correct approach
   **Code Example:** (if helpful)
   ```
3. **Promote to critical-rules** if this is a class of mistake likely to recur across projects, not a one-off.

This file is the team's accumulated knowledge. Treat updates to it as part of the task, not an afterthought.

---

## When you're stuck

| Step | Action |
|---|---|
| 1 | `npm run check-props ComponentName` — see the exact TypeScript interface |
| 2 | Grep `../design-og-component-reference/components/` for the component's reference doc |
| 3 | Grep [`references/component-patterns.md`](references/component-patterns.md) for a verified pattern |
| 4 | Read [`references/learnings.md`](references/learnings.md) — has someone hit this quirk before? |
| 5 | Test in `src/pages/ComponentPlayground.tsx` (or equivalent) before putting it in production code |
| 6 | Ask the user for clarification or for Confluence documentation |
| 7 | **Never** guess. **Never** fall back to raw HTML or another framework. |

---

## Quality checklist (before declaring done)

- [ ] All imports from `@eightfold.ai/octuple` (no other UI libraries)
- [ ] No raw HTML where an Octuple component exists
- [ ] No external CSS frameworks (Tailwind, Bootstrap, Material, …)
- [ ] No utility classes (`className="flex p-4"` and friends)
- [ ] No emojis in product UI — MDI icons only
- [ ] TypeScript strict-mode clean
- [ ] All icon-only buttons have `ariaLabel`
- [ ] All form fields have a visible label via Form.Item
- [ ] Row/Col layouts have explicit `display: flex` and Col flex sizing
- [ ] Card max-width override is in place if cards should be full-width
- [ ] All copy verified against [`../_content/terms-list.md`](../_content/terms-list.md)
- [ ] All copy follows [`../_content/content-design-standards.md`](../_content/content-design-standards.md)
- [ ] New quirks or mistakes documented in [`references/learnings.md`](references/learnings.md)

---

## Related skills

- `design-og-ux-designer` — produces the screen designs you implement from
- `design-og-component-reference` — per-component docs (Button, Card, Dialog, …) — grep on demand
- `publish-design` — once a screen is done and reviewed, this skill helps land it in the gallery via PR
