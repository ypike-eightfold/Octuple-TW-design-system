---
name: design-og-component-reference
description: >
  Per-component and per-pattern reference docs for the OG Octuple Design System (the pre-Tailwind, original Eightfold component library — NOT the new Tailwind ef-design-system).
  Contains 56 component docs (Accordion, Avatar, Button, Card, Dialog, Dropdown, Form, Modal, Panel, Table, Tabs, TextInput, Upload, etc.) and 9 layout patterns (card-grid, dashboard-layout, data-table, form-validation, navigation, stepper-workflow, two-column-layout, user-profile).
  Designed for on-demand grep, not full read. Use this skill when you need to look up exact props, slots, accessibility requirements, or correct usage of any specific OG Octuple component or layout pattern.
  Trigger when the user asks about a specific Octuple component ("how does the Dialog component work", "what props does SkillTag take") or a layout pattern, while working in the OG version of the design system.
---

# Design (OG) — Component Reference

This skill is a **lookup index** for the OG Octuple Design System. The docs live in two sibling folders:

- `components/<Name>.md` — one file per component (56 components)
- `patterns/<name>.md` — one file per layout pattern (9 patterns)

It is intentionally minimal as a SKILL.md. The real content is the individual reference files. Read the specific file you need; do not read this skill end-to-end as a substitute for the per-component docs.

---

## When to invoke

- A designer references a specific OG Octuple component by name (Button, Card, Dialog, Form, Panel, SkillTag, Stepper, Table, Tabs, Upload, etc.) and you need exact prop names, allowed values, or accessibility requirements.
- A designer is building a layout (dashboard, data table page, multi-step wizard, two-column form, user profile) and you want the verified pattern.
- The OG UX designer (`design-og-ux-designer`) or OG frontend engineer (`design-og-frontend-engineer`) needs to verify component usage details before producing code.

Do **not** invoke for Tailwind-version components — that's `design-tw-ux-designer` / `design-tw-frontend-engineer`. The OG Octuple library is a different package (`@eightfold/octuple`) with different prop names and accessibility surface area.

---

## How to use this skill

When the user (or another skill) names a component:

1. `cat .claude/skills/design-og-component-reference/components/<Name>.md`
   - Case matters: `Button.md`, not `button.md`. Files use the Octuple component's PascalCase name.
   - For dotted components: `Layout.md`, `Layout.Aside.md`.
2. If the component file references a layout pattern, follow it into `patterns/<name>.md`.
3. If the file is missing for a component the user mentioned, say so — do not invent props.

The per-component docs include props, slots, common pitfalls, and code examples. **Treat these as authoritative.** Do not synthesize props from general React knowledge — the OG Octuple library has specific prop names that often differ from common conventions.

---

## Component index

```
Accordion        DatePicker     Layout.Aside     Pill            Stack
Avatar           Dialog         Layout           Popup           Step
AvatarGroup      Dropdown       List             Progress        Stepper
Badge            Empty          Loader           RadioButton     Switch
Breadcrumb       FadeIn         MatchScore       RangePicker     Table
Button           Form           Menu             Row             Tabs
Card             Icon           MessageBar       SearchBox       TextArea
Carousel         InfoBar        Modal            Select          TextInput
CheckBox         Label          Pagination       Skeleton        TimePicker
Col                              Panel            SkillBlock      Timeline
ConfigProvider                                     SkillTag        ToggleButton
                                                   Slider          Tooltip
                                                   Snackbar        Upload
```

## Pattern index

```
card-grid               navigation              two-column-layout
dashboard-layout        stepper-workflow        user-profile
data-table              form-validation
```

(`patterns/README.md` contains the catalogue intro.)

---

## Related

- `design-og-ux-designer` — produces screen designs using these components
- `design-og-frontend-engineer` — production-quality engineering on top of OG Octuple
- `../_content/content-design-standards.md` — voice/tone for any UI copy in the components
- `../_content/terms-list.md` — terminology for labels, button copy, etc.
