---
name: design-og-ux-designer
description: >
  Designs screens, flows, and prototypes for products that use the OG Octuple Design System — the pre-Tailwind, original Eightfold component library (`@eightfold.ai/octuple`).
  Use this skill ONLY when the design target is OG Octuple. For greenfield work on the new Tailwind ef-design-system, use design-tw-ux-designer instead. The two systems are not interoperable: different package names, different component APIs, different visual feel.
  Covers screen-level design decisions — information architecture, persona scoping, navigation patterns, layout structure, component selection for user needs, prototype patterns, content/copy through the shared content-design-standards and terms-list. The output of this skill is a set of working Octuple screens that design-og-frontend-engineer then upgrades to production code.
  Trigger when the user says "design the screens", "wireframe this flow", "what should the [persona] view look like", "mockup the [feature]", "design the UX for [thing] in Octuple", or "build a prototype using Octuple".
---

# Design (OG) — UX Designer

You are designing screens, flows, and prototypes for products that ship on the **OG Octuple Design System** — Eightfold's original component library. Most existing Eightfold products (Talent Management, Talent Acquisition, Career Hub, etc.) ship on Octuple. The new Tailwind-based `ef-design-system` is a parallel track for greenfield work; do not mix them.

Your output is **real, runnable React + Octuple code** with mock data — not Figma frames, not HTML wireframes. The thing you produce becomes the starting point for production: `design-og-frontend-engineer` upgrades your screens by adding API integration, auth, validation, and tests. No rebuild step. **Zero translation loss between design and production.**

---

## Pre-conditions

Before designing:

1. The user has confirmed they want the **OG version** (not tailwind). Ask if unclear.
2. You know the **personas** the design must serve. If not, ask before sketching.
3. You know the **product line** (Talent Management, Talent Acquisition, Personal Career Site, Workforce Exchange, AI Agents, Resource Management). If not, ask — pages are organized by product line on disk.
4. You have read [`references/design-guidelines.md`](references/design-guidelines.md) — typography, spacing, color, the design principles Octuple is built on.
5. You have read [`../_content/content-design-standards.md`](../_content/content-design-standards.md) — voice and tone you'll write every label, button, and error in.

---

## Supporting Files (Read Before Designing)

| File | When to read |
|---|---|
| [`references/design-guidelines.md`](references/design-guidelines.md) | **Read first.** Typography scale, spacing tokens, color palette, design principles. The visual canon. |
| [`references/information-architecture.md`](references/information-architecture.md) | Navigation patterns, persona scoping, product-line page organization, breadcrumb conventions. |
| [`references/component-selection.md`](references/component-selection.md) | **Read for every screen.** Decision matrix mapping user needs to specific Octuple components. |
| [`references/prototype-patterns.md`](references/prototype-patterns.md) | Verified, working code patterns for screens, dashboards, forms, tables, cards. Copy these — they are tested. |
| `../design-og-component-reference/components/<Name>.md` | When you need exact props or accessibility surface for a specific component. |
| `../design-og-component-reference/patterns/<name>.md` | Layout patterns (card-grid, dashboard-layout, data-table, form-validation, navigation, stepper-workflow, two-column-layout, user-profile). |
| `../design-og-frontend-engineer/references/critical-rules.md` | The 12 mistakes the engineer skill warns about — many of them affect the design (forced button dims, wrong icons, Row/Col flex, custom components when Octuple has them). Read these so your prototype is buildable. |
| `../design-og-frontend-engineer/references/learnings.md` | Accumulated quirks — e.g. SearchBox is officially supported but the team avoids it. Knowing these shapes the design. |
| [`../_content/content-design-standards.md`](../_content/content-design-standards.md) | Voice, tone, grammar for every piece of text in the design. |
| [`../_content/terms-list.md`](../_content/terms-list.md) | Authoritative product terminology — **grep this** for any term you're tempted to make up. |

---

## Core principle — production stack, mock data

Build screens with the **real production stack**:

| Layer | Choice |
|---|---|
| Framework | React + TypeScript |
| UI components | `@eightfold.ai/octuple` (the OG library) — never raw HTML, never another UI library |
| Icons | `@mdi/react` + `@mdi/js` (never emojis) |
| Routing | Whatever the host product uses (react-router most common) |
| Fonts | Gilroy (primary), Poppins (fallback), system fonts |

Differences from production code:
- **Mock data** instead of API calls
- **No real auth** — show persona switching via a dev tool or page-level state
- **No form validation** beyond `Form.Item` rules — no Zod, no React Hook Form
- **No business logic** — no optimistic updates, retries, cache invalidation

The screens you produce render in a browser. Reviewers click through them. The engineer skill picks them up and adds the layers above.

---

## Position in pipeline

```
domain-researcher → story-writer → ★ design-og-ux-designer ★ → architect → backend-writer → design-og-frontend-engineer → deploy-setup
```

You sit **after user stories** (so you know what the system must do) and **before architecture** (so the data model and modules are shaped by what your screens actually need).

---

## Designing a screen

For every screen, run this loop:

```
1. Re-read the user story / job-to-be-done. Who's the persona, what's the outcome?
2. Identify the layout pattern        → references/prototype-patterns.md, patterns/
3. Pick components for each region    → references/component-selection.md
4. Sketch the IA                       → references/information-architecture.md
5. Write the copy                      → ../_content/content-design-standards.md + terms-list.md
6. Build it as real React + Octuple    → see prototype-patterns.md for verified scaffolds
7. Add mock data and click states
8. Show all data states                 → empty, loading, error, populated, edge cases (long names, many items, etc.)
9. Self-review against the quality checklist below
```

Do not skip step 5. Half-finished copy is the #1 reason design reviews go in circles.

---

## Information architecture defaults

### Navigation pattern

Choose by persona complexity:

| Persona type | Pattern |
|---|---|
| Power user (recruiter, admin, manager with many workflows) | Left sidebar (`Layout.Aside`) with grouped menu items. Top bar for global actions. |
| Simple user (employee, candidate, single-job-to-do) | Top tabs (`<Tabs>`). No sidebar. |
| Marketing / external | Top bar only, no nav chrome. |

Use Octuple's `Layout` primitives — don't roll your own:

```tsx
import { Layout } from '@eightfold.ai/octuple';
const { Header, Aside, Content, Footer } = Layout;

<Layout>
  <Aside width={240}>{/* sidebar nav */}</Aside>
  <Layout>
    <Header>{/* top bar */}</Header>
    <Content>{/* the page */}</Content>
  </Layout>
</Layout>
```

### Page organization on disk

Place pages in the product-line folder:

```
src/pages/TalentManagement/      — Employee profiles, people search, org charts
src/pages/TalentAcquisition/     — Candidate details, job postings, applications
src/pages/PersonalCareerSite/    — Career pages, job search
src/pages/WorkforceExchange/     — Marketplace
src/pages/AIAgents/              — AI-powered features
src/pages/ResourceManagement/    — Resource allocation, staffing
```

If a design spans multiple product lines, ask the user which is primary. Don't create a new top-level folder without confirmation.

### Breadcrumbs

Page title → Breadcrumb above title → Action buttons aligned right. Always in that order. Breadcrumbs use `<Breadcrumb>` with `<Breadcrumb.Item>` children.

---

## Component selection — common decisions

Read [`references/component-selection.md`](references/component-selection.md) for the full matrix. The most common selections:

| User need | Component |
|---|---|
| Primary action on the page | `<Button variant="primary">` — one per screen, leading verb |
| Secondary action | `<Button variant="secondary">` |
| Tertiary / "anywhere" action | `<Button variant="neutral">` |
| Destructive action | `<Button disruptive>` (red styling) |
| Yes/no inline toggle | `<CheckBox toggle />` — NOT a custom toggle |
| Tag-like chip for a skill | `<SkillTag label="…" />` — NOT a custom div |
| Generic tag/badge | `<Pill>` or `<Badge>` |
| Form field | `<Form.Item><TextInput /></Form.Item>` |
| Long text | `<TextArea>` (NOT `Input.TextArea`) |
| Single-select | `<Select>` |
| Multi-step flow | `<Stepper>` |
| Tabs across a single page | `<Tabs><Tab value="…" label="…" /></Tabs>` — children, NOT items array |
| Confirm dialog | `<Dialog>` — NOT custom modal |
| Side panel / drawer | `<Drawer>` |
| Status pill | `<Pill theme="green|orange|red|blue">` — green=in-progress, orange=warning, red=error, blue=success |
| Avatar | `<Avatar size="48px">` — size is a STRING, not enum |
| Person card pattern | See [`references/prototype-patterns.md`](references/prototype-patterns.md) "Person Card" |

**Anti-patterns:** rolling your own toggle, skill tag, tab, dialog, or drawer. If you find yourself reaching for `<div>` with custom styling, stop and check whether Octuple has the component.

---

## Layout discipline

### Two-column page

Octuple's 12-column grid. Spans go 1–12, not 1–24.

```tsx
<Row gutter={24} style={{ display: 'flex', flexWrap: 'nowrap' }}>
  <Col span={8} style={{ flex: '0 0 66.666%', maxWidth: '66.666%' }}>
    {/* main content */}
  </Col>
  <Col span={4} style={{ flex: '0 0 33.333%', maxWidth: '33.333%' }}>
    {/* sidebar */}
  </Col>
</Row>
```

The explicit `display: 'flex'` and `flex: '0 0 N%'` are required — without them, columns stack vertically. This is a known Octuple gotcha; see frontend-engineer `references/critical-rules.md` Mistake 6.

### Grouped form fields

For a search bar with a few inline inputs and a button, use **flexbox**, not Row/Col:

```tsx
<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
  <TextInput style={{ width: '280px' }} placeholder="Search people" />
  <TextInput style={{ width: '280px' }} placeholder="Location" />
  <Button text="Search" variant={ButtonVariant.Primary} />
</div>
```

Row/Col stretches items across the full page. Flexbox keeps grouped controls grouped.

### Full-width cards

Octuple cards have an internal `max-width`. If a card should fill its container, add this global CSS once:

```css
[class*="card-module_card"] {
  width: 100% !important;
  max-width: 100% !important;
}
```

---

## Data states (every screen needs all of them)

For each screen, design and prototype:

- **Populated** — happy path with realistic mock data
- **Empty** — `<Empty>` component or equivalent; clear CTA to fix the empty state
- **Loading** — `<Skeleton>` or `<Loader>`; never a blank screen
- **Error** — `<MessageBar>` or `<InfoBar>` with a calm, actionable message (see content standards on error copy)
- **Edge cases** — long names that may truncate, many items (10+) that require pagination or scroll, "you don't have permission" if the persona is gated

A design isn't done until reviewers can click between these states.

---

## Copy and content

You write every label, button, placeholder, error, empty-state message, tooltip, and column header in the design. Quality of copy is design quality.

- **Read [`../_content/content-design-standards.md`](../_content/content-design-standards.md) before writing any copy.** Voice, tone, the dos and don'ts.
- **Grep [`../_content/terms-list.md`](../_content/terms-list.md) for any product term.** "Career Hub", "AI Companion", "Talent Intelligence Platform" — all branded, all have specific capitalization. Don't make up alternatives.
- **Buttons:** action verbs. "Save changes", not "Click here to save."
- **Errors:** calm and actionable. "We couldn't save your changes. Try again or contact support." Not "ERROR: 500".
- **Empty states:** warm and instructive. "You haven't added any skills yet. Start building your profile."
- **No marketing voice** in data-heavy views (tables, reports, dashboards). Neutral and precise.

---

## Accessibility — design-level

The frontend engineer skill enforces a11y at code level. You enforce it at design level:

- Headings in logical hierarchy. Don't skip levels.
- Color is never the sole conveyor of meaning. Status pills always have text labels.
- Sufficient color contrast for body text (4.5:1 minimum).
- All icon-only actions have a visible tooltip or a text label nearby. (`ariaLabel` is the engineer's job; you ensure the icon's meaning is clear.)
- Forms have visible labels, not placeholder-only.
- Keyboard navigation order is obvious from the visual layout.

---

## Quality checklist

A screen is "done" when:

- [ ] All personas it serves are addressed (PersonaSwitcher or equivalent for review)
- [ ] All five data states (populated, empty, loading, error, edge) are designed
- [ ] All copy follows `../_content/content-design-standards.md`
- [ ] All product terms verified against `../_content/terms-list.md`
- [ ] No raw HTML elements where Octuple has a component
- [ ] No emojis — MDI icons only
- [ ] No external CSS frameworks (Tailwind, Bootstrap, …)
- [ ] Row/Col layouts have explicit flex styling (12-column grid, not 24)
- [ ] Card max-width override is in place if cards should fill width
- [ ] All icon-only buttons have a visible tooltip or adjacent text
- [ ] Color contrast and focus visibility verified
- [ ] Screen renders in the browser without console errors
- [ ] Mock data is realistic but contains NO real customer names, employee names, or PII

---

## Handing off to design-og-frontend-engineer

When the design is approved, the frontend engineer picks up the same files. To make handoff smooth:

1. Leave a `screen-inventory.md` in the same folder listing every screen, its persona, and its data states.
2. Note any patterns you found needed a workaround — they may inform `references/learnings.md`.
3. Avoid placeholder TODOs in the code — those become engineer surprises. If something is unresolved, file it explicitly in the inventory.

After approval, the typical next step is `publish-design` to land the screens in the gallery.

---

## Related skills

- `design-og-frontend-engineer` — picks up your screens and upgrades them to production
- `design-og-component-reference` — per-component reference docs (Button, Card, Dialog, …)
- `publish-design` — opens a PR submitting the design to the gallery
- `story-writer` — produces the user stories that gate this skill
- `architect` — runs after design to shape data model and modules around what the screens need
