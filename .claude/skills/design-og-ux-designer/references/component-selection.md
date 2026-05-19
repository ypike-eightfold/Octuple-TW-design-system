# Component Selection (OG)

Decision matrix mapping **user needs** to the correct OG Octuple component. Use this every screen — the cost of selecting the wrong component is rework that the frontend engineer skill will reject.

Whenever a row says "see `<Name>`," check `../design-og-component-reference/components/<Name>.md` for the full prop API.

---

## Actions

| User need | Component | Notes |
|---|---|---|
| The single most important action on a screen | `<Button variant="primary">` | One per screen. Use the action verb in the label. |
| Second-tier action (cancel-but-still-important, "Save draft", "Preview") | `<Button variant="secondary">` | |
| Tertiary themed action | `<Button variant="default">` | |
| Subtle action ("Edit", "More", "Refresh") | `<Button variant="neutral">` | Light gray; safe to place anywhere. |
| Least-emphasized action over light backgrounds | `<Button variant="systemui">` | White background. Use sparingly. |
| Destructive action ("Delete", "Remove", "Revoke access") | `<Button disruptive>` | Red styling; always pair with a `<Dialog>` confirm. |
| Icon-only action | `<Button iconProps={{ path: mdiX }} ariaLabel="X">` | `ariaLabel` REQUIRED. |
| Round icon button (avatar-edit, etc.) | `<Button shape={ButtonShape.Round} size={ButtonSize.Small/Medium/Large}>` | NEVER force width/height via style. |
| Loading action | `<Button loading>` | Don't show separate spinners. |
| Action menu (3+ secondary actions) | `<Dropdown>` with `<Menu>` | Hide overflow actions behind a kebab. |

**Anti-patterns:**
- Raw `<button>` — never.
- Forced dimensions on buttons — breaks Octuple sizing.
- Three+ primary buttons on one screen — there's only one "primary".

---

## Inputs

| User need | Component |
|---|---|
| Single-line text | `<TextInput>` |
| Multi-line text | `<TextArea>` (NOT `Input.TextArea`) |
| Password | `<TextInput type="password">` |
| Search field | `<TextInput iconProps={{ path: mdiMagnify }} alignIcon={TextInputIconAlign.Left} clearable>` — NOT `SearchBox` (see learnings) |
| Single choice from a list | `<Select>` |
| Single choice, ≤4 options, visible at once | `<RadioButton>` group |
| Multiple choice, visible at once | `<CheckBox>` group |
| Toggle (on/off switch) | `<CheckBox toggle>` — NOT a custom toggle |
| Date | `<DatePicker>` |
| Date range | `<RangePicker>` |
| Time | `<TimePicker>` |
| Numeric slider | `<Slider>` |
| File upload | `<Upload>` |
| Inline edit | `<TextInput>` in a controlled state; commit on blur or Enter |

All inputs wrapped in `<Form.Item label="…">` with the label visible above (not placeholder-only).

---

## Display

| User need | Component |
|---|---|
| Status indicator next to a name | `<Pill theme="green|orange|red|blue">` — see semantic colors below |
| Count badge on an icon | `<Badge count={N}>` |
| Skill / tag chip | `<SkillTag label="…">` — NOT custom div |
| Generic tag | `<Pill>` |
| User avatar | `<Avatar size="48px">` — size is a STRING, not enum |
| Group of avatars | `<AvatarGroup>` |
| Profile/object card | `<Card>` with internal layout (see person-card pattern) |
| Metric / KPI card | `<Card>` with title + big number + delta |
| Match score | `<MatchScore>` |
| Progress | `<Progress>` |
| Stepper (steps in a flow) | `<Stepper>` with `<Step>` children |
| Empty state | `<Empty>` |
| Loading placeholder | `<Skeleton>` (matching the page's layout shape) |
| Spinner | `<Loader>` |
| Tooltip | `<Tooltip>` |
| Inline help | `<Tooltip>` triggered by an info icon |

### Pill semantic colors

| Theme | Meaning | Use for |
|---|---|---|
| `green` | Active / in progress | Live items, "Open", "Active" |
| `blue` | Success / complete | Finished items, "Complete", "Approved" |
| `orange` | Warning | Needs attention, "Pending", "At risk" |
| `red` | Error | Failed, "Error", "Critical" |
| `neutral` | Default / informational | Generic labels |

Don't invent new color meanings.

---

## Containers

| User need | Component |
|---|---|
| Page-level grid | `<Layout>` with `<Header>`, `<Aside>`, `<Content>`, `<Footer>` |
| Two-column page | `<Row gutter={24}>` with `<Col span={...}>` — explicit flex required (see IA) |
| Card container | `<Card>` |
| Accordion / collapsible | `<Accordion>` |
| Tabs across a single page | `<Tabs>` with `<Tab value="…" label="…">` children — NOT items array |
| Side panel | `<Drawer>` |
| Modal dialog | `<Dialog>` for confirm/short, `<Modal>` for complex |
| Popover | `<Popup>` |
| Top notification banner | `<MessageBar>` |
| In-page notification | `<InfoBar>` |
| Transient toast | `<Snackbar>` |

---

## Navigation

| User need | Component |
|---|---|
| Top app bar | `<Layout.Header>` |
| Sidebar nav | `<Layout.Aside>` with `<Menu>` |
| Breadcrumb | `<Breadcrumb>` with `<Breadcrumb.Item>` |
| Tabs (page-level) | `<Tabs>` |
| Pagination | `<Pagination>` |
| Page links / "Read more" | `<a>` styled to Octuple link conventions, or `<Button variant="neutral">` for action links |

---

## When Octuple doesn't have what you need

It almost always does. Before reaching for a custom component:

1. Grep `../design-og-component-reference/components/` — 56 components listed.
2. Check `../design-og-component-reference/patterns/` — 9 layout patterns.
3. Check `references/prototype-patterns.md` — verified-working code patterns.
4. Ask the user — sometimes the need is a sign the IA is wrong.

If after all of the above the component really doesn't exist:

- Compose from existing primitives (`<Row>`, `<Col>`, `<Card>`, `<Button>`, …).
- Style with the Octuple design tokens (Gilroy font, color palette, 4px spacing scale) — see `references/design-guidelines.md`.
- Never reach for Tailwind, Bootstrap, or another component library.
- Document the gap so it can be considered for upstream addition to Octuple.

---

## Verification step (before declaring the design done)

For every component used in the design, confirm:

- [ ] The component is imported from `@eightfold.ai/octuple`
- [ ] The component name matches one in `../design-og-component-reference/components/`
- [ ] The props you used appear in `references/prototype-patterns.md` or the component's reference doc
- [ ] You have not invented a prop or assumed a prop pattern from another library
- [ ] Icon-only buttons have `ariaLabel`
- [ ] Status pills have both color and text label
- [ ] Inputs are wrapped in `<Form.Item>` with a visible label

If any of these is uncertain, run `npm run check-props ComponentName` or read the `.types.d.ts` file directly. **Never guess.**
