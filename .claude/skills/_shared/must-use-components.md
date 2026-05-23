# MUST USE COMPONENTS — not raw Tailwind / HTML

**Hard rule for every skill that builds UI in this repo.** Tailwind utilities are for **layout and spacing only** — flex, grid, gap, padding, max-width. The moment you reach for `bg-primary text-primary-foreground rounded-md px-3 py-1.5` to make a "button", **stop and import `<Button>` from the design system instead**. Same for every interactive element listed below.

The two design systems in scope:

- **Tailwind / new** — `@tonyh-2-eightfold/ef-design-system` (this repo, web/ app). Used by `design-tw-*` skills.
- **OG Octuple** — `@eightfold.ai/octuple`. Used by `design-og-*` skills.

The two are NOT interoperable. Pick the one matching the current skill family and use it for every element below.

---

## The discipline (do this before writing any UI element)

1. **Open the design system's index export file** and grep for the element you're about to build (`button`, `tag`, `pill`, `select`, etc.).
2. If a component exists, **import it**. Do not rebuild it.
3. Only fall back to raw Tailwind for layout primitives (flex/grid/spacing) or for elements the design system genuinely doesn't ship (e.g., custom marketing illustrations).
4. **`<button className="bg-primary ..."` is the canonical failure mode**. If you typed it, you skipped step 1.

---

## Component → "what to use" map

These are the most common substitutions agents have gotten wrong. **MUST USE** the listed component:

| You're about to build… | Use this component | NEVER build with |
|---|---|---|
| Any clickable button (primary/secondary/destructive/ghost/link) | `<Button variant="..." size="...">` | `<button className="bg-primary rounded-md px-3 py-1.5">` |
| A "chip" / keyword / status label / category tag | `<Tag color="..." size="...">` (Octuple uses **Tag** where other systems call them chips) | `<span className="rounded-full bg-muted px-2 py-0.5">` |
| A status pill with an icon (Connected / Live / On track) | `<Pill variant="..." icon="...">` | `<span className="inline-flex items-center gap-1 rounded-full bg-success/10 text-success">` |
| A dropdown select | `<Select><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem/></SelectContent></Select>` | `<select className="rounded-md border border-input">` (native HTML select) |
| The Career Hub page chrome (logo + tabs + product wash + header) | `<CareerHubShell title=... navbarProps=...>` (composes `Navbar` + `Header` + `ProductBackground`) | A hand-rolled `<header>` with anchor tags and a custom logo div |
| A toast / inline confirmation after an action | `<Snackbar variant="success" message="...">` | A hand-styled green `<div>` with a check icon |
| A vertical timeline (1-on-1s, activity history, audit log) | `<Timeline><TimelineItem ... /></Timeline>` | A custom `<ol>` with absolutely-positioned dots |
| Multi-select chips/filters | `<TagGroup>` + `<Tag>` | Multiple custom `<span>` filters |
| A counter or numeric notification | `<NumberBadge>` / `<Badge>` | `<span className="rounded-full bg-foreground">` |
| Top navigation tabs | `<Tabs variant="line">` + `<TabsList>` + `<TabsTrigger>` | Custom `<a>` link strip with active styles |
| Data tables | `<DataTable>` + `<DataTableRow>` + `<DataTableCell>` | A `<table>` with Tailwind classes |
| Modals / dialogs | `<Dialog>` + `<DialogContent>` + `<DialogHeader>` + `<DialogBody>` + `<DialogFooter>` | A fixed-position `<div>` overlay |
| Multi-step flow indicator | `<Stepper>` + `<StepperList>` + `<StepperItem>` | A flex row of numbered circles |
| Progress bar | `<Progress>` / `<SegmentedProgress>` | A `<div>` with a background-color stripe |
| Empty state illustration | `<EmptyIllustration>` (TW) or product equivalent | A Material Symbol icon + h2 |

---

## Form controls — never native HTML

Checkboxes, radio buttons, and switches are **always wrong as native HTML elements**. They look different on every browser/OS and don't pick up Octuple's color tokens. **Always use the design system's component.** In this repo (TW):

| Form control | Use this | NEVER use |
|---|---|---|
| Checkbox | `<Checkbox checked={…} onCheckedChange={…} />` from `@/components/ui/checkbox` | `<input type="checkbox">` |
| Switch / toggle | `<Switch checked={…} onCheckedChange={…} size="sm \| default" />` from `@/components/ui/switch` | A `peer-checked:bg-primary` styled `<input type="checkbox">` |
| Radio group | `<RadioGroup>` + `<RadioGroupItem>` from `@/components/ui/radio-group` | `<input type="radio">` |
| Text input | `<Input>` from `@tonyh-2-eightfold/ef-design-system` | `<input type="text">` |

(For OG Octuple, the equivalents are `Checkbox`, `Toggle`/`SwitchSelector`, `RadioGroup` from `@eightfold.ai/octuple`.)

These rules have been reiterated multiple times. The web/components/ui/{checkbox,switch}.tsx files carry comments citing Octuple v2.5 SVG color tokens — they're the canonical Octuple-styled primitives. Use them.

---

## Avatars — vary the fill color per identity

A list of avatars all showing the same fill color reads as a wall of identical circles — the eye can't distinguish people at a glance. **Use a deterministic per-identity color** so each person gets a recognizable fill.

Pattern: hash the person's stable id (or full name) to one of Octuple's `-70` shade colors, pair with the matching `-10` foreground for legible contrast:

```ts
const PALETTE = [
  { bg: 'var(--color-blue-70)', fg: 'var(--color-blue-10)' },
  { bg: 'var(--color-violet-70)', fg: 'var(--color-violet-10)' },
  { bg: 'var(--color-red-70)', fg: 'var(--color-red-10)' },
  { bg: 'var(--color-orange-70)', fg: 'var(--color-orange-10)' },
  { bg: 'var(--color-green-70)', fg: 'var(--color-green-10)' },
  { bg: 'var(--color-blue-green-70)', fg: 'var(--color-blue-green-10)' },
  { bg: 'var(--color-grey-70)', fg: 'var(--color-grey-10)' },
]
function avatarColor(key: string) {
  let h = 0
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) | 0
  return PALETTE[Math.abs(h) % PALETTE.length]
}
```

Use the `<Avatar><AvatarFallback>{initials}</AvatarFallback></Avatar>` primitive (from `@/components/ui/avatar`) and apply the color via an inline `style` on the fallback. **Never** hard-code `bg-primary` on every avatar.

---

## Button variant rules — no `variant="link"`, no transparent backgrounds, secondary for icon-only

Two additional rules that keep coming back as feedback:

**(1) Don't use `variant="link"` buttons.** Links rendered as text-only blue lines blur the line between actual navigation links and action buttons, and they're the lowest-confidence affordance. For low-emphasis actions ("View all", "Open team view", "Manage…"), use `variant="secondary"` or `variant="ghost"`. Reserve `variant="link"` only for places where you really do want anchor-tag styling (e.g., inline within prose).

**(2) Icon-only buttons use `variant="secondary"` (or `default`), not `ghost`.** A ghost icon-only button reads as a link — there's no chip / pill / outline to communicate "this is interactive." Use `secondary` (or `default`) so the button has a visible affordance.

```tsx
// ❌ WRONG — looks like a link
<Button variant="ghost" size="icon-xs" aria-label="Pin to notes">…</Button>

// ✅ CORRECT
<Button variant="secondary" size="icon-xs" aria-label="Pin to notes">…</Button>
```

**(3) Select triggers and other buttons over hero/glass backgrounds need a solid (or glass) background.** The outline Select trigger ships with `bg-transparent` — that's fine over a plain page but reads as faint over chevron art. Override with `className="bg-white"` (or apply the same translucent + backdrop-blur treatment the navbar uses) so the control reads as solid against the hero.

```tsx
<SelectTrigger variant="outline" className="bg-white">…</SelectTrigger>
```

---

## Color discipline — reserved colors and the semantic palette

Octuple's blue-green family (`Pill variant="blueGreen"`, `Tag color="blue-green"` and `color="blue-violet"`) is **reserved** — it sits too close to the primary button color. **Do not use `blueGreen` / `blue-green` for routine status indicators.** Use the semantic palette instead:

| Status meaning | Use this color |
|---|---|
| Active / live / on / online / connected | **green** |
| Pending / at risk / due soon / draft / attention | **orange** |
| Error / overdue / blocked / failed | **red** |
| Completion / done / informational milestone / new badge | **blue** |
| AI / generated content / experimental | **violet** |
| Neutral / generic label / count / category | **grey** (default for "anything else") |

Examples:

- "All integrations connected" — these are **active** integrations → `<Tag color="green">`
- "Live canvas" / "Recording" — **active** → `<Tag color="green">` (not red — red is for error)
- "AI-drafted from 12 weeks of 1-on-1s" — **AI-generated content** → `<Tag color="violet">`
- "PR Merged" — **completion** → `<Tag color="green">` (or `color="blue"` if you prefer "done")
- "Q2 goal completed" — **completion milestone** → `<Tag color="blue">`
- A pending action item — **draft / pending** → `<Tag color="orange">`
- A keyword chip ("OAuth2", "Tech Debt") — **neutral category** → `<Tag color="grey">`

The Pill component's `blueGreen` variant is reserved too. If you need a colored Pill for status but Pill doesn't ship the semantic color you need (Pill only exports `neutral | critical | empty | orange | blueGreen`), use a `<Tag>` with the appropriate `color` — Tag supports the full semantic palette including blue / green / violet.

---

## Information architecture — never ad-hoc-extend the product navbar

**The CareerHub navbar (and any product's primary navbar) is canonical.** It is consistent across every page of the product. Do not invent new top-level tabs to host the screens you're designing. The navbar comes from authoritative tab-set exports in `@tonyh-2-eightfold/ef-design-system`:

- `EMPLOYEE_NON_MANAGER_TABS`
- `MANAGER_TABS`
- `CAREER_HUB_CHRO_TABS`
- `CAREER_HUB_HRBP_TABS`
- (and the Talent Acquisition equivalents)

**Always ASK the user** where new screens should land in the existing IA before producing them. Don't assume the answer is "a new top-level tab" — most of the time new screens belong:

- **Under an existing tab as sub-tabs** (e.g., adding `/team/{sync, meeting, review}` as sub-tabs under the existing "Team" tab via Tabs `variant="line"`)
- **As a chevron-revealed sub-menu** on an existing tab (e.g., a "Team" tab with `chevron: true` and `subItems` for "My manager" / "My team")
- **As a deep-link from a list page** (e.g., `/team/members/[id]/sync` reached by clicking a team member card on `/team`)

If the user genuinely wants a new top-level tab, get that confirmation explicitly. Don't silently add an entry to the tabs array because it makes routing easier.

---

## Page chrome — the hero header goes UNDER the navbar

The CareerHub product has a chevron hero (`<ProductBackground variant="career-hub">`) and a glassmorphic navbar that **bleeds together visually**: chevrons extend up to the top of the viewport, and the navbar floats above them with a translucent + backdrop-blur background. This is the canonical "hero header" treatment.

If you're using `CareerHubShell`, the in-flow override (`.header-assembled-ch-shell`) renders the navbar below the chevrons by default. To get the glassmorphism + bleed-up look:

```css
/* Pull the ProductBackground up under the navbar, then pad it back down
   so the Header inside renders in the right place. */
.your-shell-scope > .career-hub-shell:first-child + * {
  margin-top: calc(-1 * var(--navbar-height, 60px));
  padding-top: var(--navbar-height, 60px);
}
/* And make the navbar background translucent so chevrons show through: */
.your-shell-scope .navbar {
  background: rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(18px) saturate(140%) !important;
}
```

Reference: the site's TopNav at `web/components/site/top-nav.tsx` uses the same pattern (`bg-white/40 backdrop-blur-xl supports-[backdrop-filter]:bg-white/30`). Apply this treatment everywhere a product page has a hero header.

---

## Card hierarchy — avoid double borders

When a card sits inside another card, **drop the inner card's border**. Stacked `border border-border` produces visible double-lines that read as noise. Patterns:

- Outer container: `rounded-xl border border-border bg-card p-5`
- Inner items (rows, sub-cards, timeline entries, list items): `rounded-lg bg-background p-4` — **no `border`**

Use `bg-background` (or `bg-muted` for a slight tonal contrast) instead of a border to define the inner card's edge. Reserve borders for top-level containers and for items the user truly needs to perceive as separate from their parent.

---

## Button hierarchy — one primary per page

Each page (and each contained workflow area) should have **at most one primary button** — the lead action the user is most likely to take next. Everything else uses lower-emphasis variants:

| Variant | Use for |
|---|---|
| `primary` | Single lead action on the page (e.g., "Submit for review", "End & save") |
| `secondary` | Important supporting actions (e.g., "Generate", "Regenerate", "Pull recent PRs") |
| `outline` | Equal-weight alternatives or destructive-adjacent ("Cancel", "Manage integrations") |
| `ghost` | Low-emphasis inline actions ("Adjust tone", "Accept draft", icon-only buttons) |
| `link` | Tertiary navigation ("View all", "Open team view") |
| `destructive` | Destructive confirmation ("Delete", "Discard draft") |

If you have two primary buttons in view, **one of them is wrong**. Identify the page's lead action and demote the others. In nested card UIs, count primaries per visible card, not per page — but never more than one primary at any focus level.

---

## The 6 mistakes from the CareerHub Continuous Sync prototype (May 2026)

These are the **canonical failures**. If your output resembles any of these, you've violated this rule. Cite this section by name in self-review.

1. **Tone / Regenerate buttons** were `<button className="rounded-md bg-primary ... px-2.5 py-1.5 text-xs">` — should have been `<Button variant="primary" size="sm" leadingIcon={...}>`.
2. **Accept draft / Submit for review buttons** were `<button className="rounded-md bg-foreground text-background ...">` — should have been `<Button variant="outline">` and `<Button variant="primary">`.
3. **"AI-DRAFTED FROM 12 WEEKS OF 1-ON-1S" chip** was a custom `<div className="rounded-full border-primary/20 bg-primary/10 ...">` — should have been `<Pill variant="blueGreen" icon="auto_awesome">` (or `<Tag>` — Octuple uses Tag where other systems use Chip).
4. **CareerHub header / nav** was a hand-rolled `<header>` with anchor tags styled in Tailwind — should have been `<CareerHubShell>` (composes Navbar + Header + ProductBackground, with `LinkComponent` slot for Next.js Link).
5. **Send feedback request buttons** were custom `<button>` elements — should have been `<Button variant="primary" leadingIcon={<send/>}>`.
6. **Timeframe dropdown** was a native `<select>` — should have been `<Select>` + `<SelectTrigger>` + `<SelectContent>` + `<SelectItem>` for the Octuple-styled dropdown.

---

## Allowed Tailwind territory

Tailwind utilities **are** the right tool for:

- Page layout — `mx-auto max-w-7xl px-6 py-8`, `grid gap-6 lg:grid-cols-[1.5fr_1fr]`
- Spacing between design-system components — `space-y-6`, `mt-3`, `gap-2`
- Card containers — `rounded-xl border border-border bg-card p-5 shadow-sm`
- Responsive show/hide — `hidden lg:block`, `sm:grid-cols-2`
- Semantic color **on text and surfaces** — `text-foreground`, `text-muted-foreground`, `bg-background`, `bg-card`, `border-border` (these are theme tokens, not visual styling)

The line: **Tailwind decides where things sit and how they breathe; the design system decides what they look like.**

---

## Self-check before handoff

Run this grep against your written code before declaring done:

```bash
# Should return zero hits — if any match, you built a button by hand.
grep -nE '<button[^>]*className="[^"]*bg-(primary|foreground|background|muted|destructive|success|warning|info)' <files>

# Should return zero hits — if any match, you wrote a custom chip.
grep -nE '<span[^>]*className="[^"]*rounded-full[^"]*bg-' <files>

# Should return zero hits — native select where Select belongs.
grep -nE '<select\b' <files>
```

If any hit comes back, replace it with the design-system component before reporting completion.
