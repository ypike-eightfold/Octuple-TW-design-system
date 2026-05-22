# Accessibility for Designers — ef-design-system (Tailwind)

**Purpose:** What a designer is responsible for at the design stage so the engineer can implement to WCAG 2.1/2.2 Level AA.
**Status:** Complete
**Last Updated:** May 22, 2026
**Companion file:** [`../../design-tw-frontend-engineer/references/accessibility.md`](../../design-tw-frontend-engineer/references/accessibility.md) — the engineer skill is the authority on ARIA, keyboard handling, focus management, and screen reader implementation. **Designers don't need to specify those.** This file covers the decisions you have to make in Figma / mocks before the engineer can build to spec.

---

## What you own vs. what the engineer owns

| You own (design stage) | Engineer owns (build stage) |
|---|---|
| Color choice & contrast targets in mockups | Semantic token mapping (`bg-primary`, `text-foreground`, …) |
| Don't-rely-on-color decisions (pairing color + icon + text) | `aria-invalid`, `aria-describedby`, `aria-live` plumbing |
| Heading hierarchy in mocks | `<h1>`–`<h6>` element selection, landmark structure |
| Focus order (visual reading order) | `tabindex`, focus trap, focus return |
| Form layout — visible labels, required indicators, error placement | Programmatic label association, validation timing, screen reader announcements |
| Touch / click target sizing | Component size variants, hit-area padding |
| Responsive behavior at 320 px | Media-query / container-query implementation |
| Motion intent (when to animate) | `prefers-reduced-motion` implementation |
| Accessibility annotations on the mock | Component / role selection, ARIA attributes |

Anything in the "Engineer owns" column the engineer can derive from a well-annotated mock. The role of this file is to make sure your mock is well-annotated.

---

## Color & Contrast

### WCAG Criteria You're Designing Against

| Criterion | Level | What it means for your mock |
|---|---|---|
| **1.4.3 Contrast (Minimum)** | AA | Body text 4.5:1, large text (≥18pt or 14pt bold) 3:1 |
| **1.4.11 Non-text Contrast** | AA | UI components (button borders, input borders, icons that carry meaning) 3:1 |
| **1.4.1 Use of Color** | A | Color alone never communicates state |

### How to check contrast at design time

1. **Figma plugin: Stark, A11y or Contrast** — sits in your sidebar, gives you the ratio in real time.
2. **Manual: WebAIM Contrast Checker** — https://webaim.org/resources/contrastchecker/
3. **Test in grayscale** — duplicate your frame, desaturate it. Can you still tell:
   - Primary from secondary buttons?
   - Active from inactive tabs?
   - Status badges from each other?
   - Required from optional fields?
4. **At handoff:** the engineer will run `pnpm run theme:audit`. If your mock uses an off-token color, the audit fails the build, and you'll be asked to re-pick a token.

### Use ef-design-system tokens, not hex

Your Figma library should be wired to the same semantic tokens the engineer ships:

| Role | Token | Use for |
|---|---|---|
| Primary action | `--primary` / `text-primary-foreground` | Submit, Save, Create, Continue, primary CTAs |
| Success / complete | `--success` / `text-success-foreground` | Approved, Complete, On track, Passed |
| Warning / pending | `--warning` / `text-warning-foreground` | In review, Due soon, Draft, At risk |
| Destructive / error | `--destructive` / `text-destructive-foreground` | Overdue, Rejected, Failed, Delete actions |
| Info | `--info` / `text-info-foreground` | Tip, FYI, New, Beta |
| Page surface | `--background` | Page body |
| Card surface | `--card` / `text-card-foreground` | Card / Panel backgrounds |
| Subtle text | `text-muted-foreground` | Captions, secondary copy, last-updated timestamps |
| Border | `--border` / `--input` | Card borders, input borders |

**Do not pick a color and ask the engineer to match it.** Pick a token. If the token doesn't exist for what you need, talk to the design-system team about adding one — never inline a hex.

**Banned in mocks** (the engineer will refuse the handoff):
- Raw Tailwind colors: `text-slate-500`, `bg-blue-100`, `text-emerald-700`, etc.
- `bg-white`, `text-white`, `bg-black`, `text-black` — these don't change with the theme
- Arbitrary hex: `text-[#0066cc]`, `bg-[#fef3c7]`

### Status colors must be themable

If the customer enables a dark or branded theme, your green status badge needs to still mean "complete" and still meet 3:1. Use ef-ds component variants — never hand-roll status colors.

```
✅ Correct in your mock annotation: "Status pill — Tag color='green' size=24"
❌ Wrong: "Status pill — #d1fae5 background, #065f46 text"
```

---

## Don't Rely on Color Alone

**WCAG Criterion:** 1.4.1 Use of Color (Level A)
**Sibling:** 1.3.3 Sensory Characteristics — never write copy like "click the red button"

### The rule

Every state that is communicated by color must *also* be communicated by:
- a shape / icon, OR
- a text label, OR
- a position / layout difference

### Examples in mocks

**Errors:**
- ❌ Red border on the field, red text underneath. (Color only.)
- ✅ Red border + alert icon + red text "Enter a valid email address". (Color + shape + text.)

**Status badges:**
- ❌ Green pill, amber pill, red pill — same shape, different colors.
- ✅ Tag with a leading icon (`check_circle` for complete, `clock` for pending, `error` for overdue) AND a text label.

**Required fields:**
- ❌ Asterisk in red, asterisk in red, asterisk in red — color used to indicate "required."
- ✅ Asterisk (any color) + a "(required)" cue accessible to screen readers + a once-per-form legend "Fields marked with * are required."

**Chart series:**
- ❌ Five lines on a chart in five different colors.
- ✅ Five lines in five colors AND five different stroke patterns (solid / dashed / dotted) or markers, AND a legend with text labels.

**Copy review — search your mock for these:**

| Forbidden phrase | Replace with |
|---|---|
| "Click the red button" | "Click the **Delete** button" |
| "Items in green are complete" | "Items marked **Complete** have a check icon" |
| "The blue indicator means selected" | "**Selected** items have a check icon and a filled background" |
| "See the colored bar at the top" | "See the **status bar** at the top" |

---

## Heading Hierarchy

**WCAG Criteria:** 1.3.1 Info and Relationships (Level A), 2.4.6 Headings and Labels (Level AA)

### Rules to follow in mocks

1. **One `<h1>` per page.** That's the page title (usually the largest text in the page header).
2. **Don't skip levels.** `h1` → `h2` → `h3`. Never `h1` → `h3`.
3. **Headings describe structure, not styling.** If you need text that *looks* like a heading but isn't a section, label it as a paragraph in your annotation.

### Annotate heading levels in your mocks

In Figma, put a `H1` / `H2` / `H3` badge next to each heading-styled text element. This tells the engineer exactly what semantic level to render.

Example annotation:

```
[H1] "Cycles"                              ← page title
  [H2] "Active cycles"                     ← section
    [H3] "Q4 performance review"           ← cycle card heading
    [H3] "Mid-year check-in"
  [H2] "Archived cycles"
    [H3] "Q2 performance review"
```

Wizard steps, tabs, and dialog titles don't change the page heading hierarchy. A dialog's title is an `<h2>` or `<h3>` *inside* the dialog, but the page's `<h1>` stays the page title.

### A typography hierarchy that doesn't follow heading levels is a smell

If your largest text on the page is the user's name in a card, and the actual page title is smaller and gray above it — the engineer has to pick which one is `<h1>`. Talk to the engineer; one of:
- Re-style: make the actual `<h1>` the largest text.
- Restructure: the user's name becomes the page title.
- Override: use ARIA to label the landmark; the engineer can do this but it's a code smell.

---

## Focus Order

**WCAG Criterion:** 2.4.3 Focus Order (Level A)

### Rule

Tab order should match the visual reading order: top to bottom, left to right (or right to left for RTL languages).

### What you control as a designer

- **Layout decides focus order.** If you arrange three CTAs in a row, the engineer will tab through them left-to-right. If you put the primary CTA last on the right (typical) and a "Cancel" link on the left, Cancel gets focus first. That might be the wrong default.
- **Card grids tab row-by-row, not column-by-column.** Don't design a 4×4 grid where the intended scan order is vertical — the keyboard user will jump horizontally.
- **Modals should focus the primary action by default.** In your annotation, mark which element gets focus on open.

### Annotate the focus entry point

For every dialog, panel, drawer, or wizard step, mark the element that should receive focus on open:

```
[FOCUS-ON-OPEN] "Save" button
```

For destructive dialogs ("Delete cycle?"), focus should land on the **safe** action (Cancel), not Delete.

### Anti-patterns to avoid

- **Skip-around layouts.** A sidebar on the right, main content in the middle, secondary nav on the far left — the visual sequence is unclear. Keyboard users will get confused.
- **Floating action button (FAB) before main content.** The FAB will get focus first when the user tabs in. Either accept that (the FAB is the primary action) or place it after the main content semantically (and use `position: fixed` for visual placement).
- **Hidden elements that still receive focus.** Don't design "off-canvas" navigation that the keyboard can still reach when it's visually hidden.

---

## Forms

**WCAG Criteria:**
- **3.3.1 Error Identification** (Level A) — errors are clearly identified
- **3.3.2 Labels or Instructions** (Level A) — every input has a label
- **3.3.3 Error Suggestion** (Level AA) — when known, suggest the fix
- **3.3.7 Redundant Entry** (Level A, WCAG 2.2) — don't ask for data the user already gave

### Visible labels — always

**Every input has a visible label above (or to the left of) the field.** Placeholders are not labels.

❌ Anti-pattern:
```
┌─────────────────────┐
│ Email               │
└─────────────────────┘
```
*(Placeholder text inside the input. Disappears on focus.)*

✅ Correct:
```
Email address
┌─────────────────────┐
│ name@example.com    │
└─────────────────────┘
```
*(Label above, placeholder shows format hint.)*

### Required fields

Mark required fields **both visually and accessibly**:

1. Visible asterisk (`*`) next to the label
2. Once-per-form legend: "Fields marked with * are required."

If your form has 5 fields and 4 are required, flip it — mark the *optional* one: "Phone number (optional)".

```
[Required] Email address *
[Optional] Phone number (optional)
```

### Error message format

For every form field, annotate the error message format in your mock. The engineer needs three things per error:

1. **Where it appears** — below the field (default) or summary at top
2. **What it says** — specific and actionable, never generic
3. **When it appears** — on blur (recommended), on submit, or on every keystroke

**Format rules:**
- Start with what's wrong, not how to fix.
- Suggest the fix when known.
- Use sentence case, end with a period.

| Bad | Good |
|---|---|
| "Invalid." | "Enter a valid email address (e.g., name@example.com)." |
| "Required." | "Email address is required." |
| "Error" | "Password must be at least 8 characters and include a number." |
| "Field has a problem" | "We couldn't find this email in our records. Try a different email or [Sign up]." |

### Don't ask for the same data twice (WCAG 2.2 §3.3.7)

If the user already entered their name on step 1 of a wizard, don't ask again on step 3. Mark fields that should be pre-filled from earlier steps:

```
[PREFILL from step 1] Email address: name@example.com
```

Same for any field the browser can autofill via standard HTML autofill tokens (`email`, `name`, `street-address`, etc.) — annotate which token to use so the engineer wires it.

### Inline help / hints

Hint text goes **below** the label, **above** the field, in `text-muted-foreground`. Not inside the input.

```
Email address
We'll never share your email.
┌─────────────────────┐
│ name@example.com    │
└─────────────────────┘
```

---

## Touch / Click Target Size

**WCAG Criterion:** 2.5.8 Target Size (Minimum) (Level AA, WCAG 2.2)

### Targets

- **Minimum:** 24 × 24 CSS px
- **Recommended:** 44 × 44 CSS px (iOS HIG / Material standard)
- **Ideal on mobile:** 48 × 48 CSS px

### How this maps to ef-ds Button sizes

| Button size | Target | Use for |
|---|---|---|
| `xs` / `icon-xs` | ~28×28 | Dense table row actions, secondary toolbars |
| `sm` / `icon-sm` | ~32×32 | Secondary controls — meets WCAG 2.2 minimum |
| `default` / `icon` | ~40×40 | Primary CTAs |
| `lg` / `icon-lg` | ~48×48 | Mobile-primary CTAs |

### Designing for tap targets

- Default to `default` Button size for primary actions; `sm` is fine for secondary actions in dense contexts.
- Icon-only Buttons (close, more, delete row) need at least `icon-sm` (32×32).
- A 16-px Lucide icon inside a `sm` Button still meets the target because the **button**, not the icon, is the tappable region. Don't shrink the button to fit the icon.
- Touch-area expansion via padding or a pseudo-element is allowed *if* visual constraints require a small visible icon. Annotate "hit area: 24×24" so the engineer adds the right padding.

### Spacing between targets

Minimum **8 px** of gap between adjacent tappable elements. ef-ds DataTable rows already exceed this. Watch dense toolbars, chip groups, and quick-action menus.

---

## Reflow / Responsive

**WCAG Criterion:** 1.4.10 Reflow (Level AA)

### Rule

Your design must work at **320 CSS px wide** (smallest common mobile viewport) without horizontal scrolling — except for content that "by nature" needs 2D space (charts, large data tables, maps).

### Designing for 320 px

For every screen, design three viewports:

| Viewport | Size | Layout |
|---|---|---|
| Mobile | 320 × 568 px | Single column, stacked nav, full-width inputs |
| Tablet | 768 × 1024 px | Two-column where it makes sense, persistent nav |
| Desktop | 1440 × 900 px | Multi-column dashboards, side panels, fixed sidebars |

**Mobile rules:**
- Stack everything vertically
- Full-width Inputs and Buttons (`w-full`)
- Hide secondary actions behind a `MoreVertical` menu
- Replace persistent sidebars with a hamburger / Sheet
- Make Dialogs full-screen below 640 px

**For data tables**, design three variants:
1. **Desktop:** full DataTable
2. **Tablet:** condensed columns, hide secondary columns
3. **Mobile:** stacked card list (one card per row, label + value pairs)

### Annotate the responsive breakpoints

Show the engineer your three viewports side-by-side. If you only design desktop, the engineer has to guess — and they'll guess wrong.

---

## Reduced Motion

**Sibling WCAG criterion:** 2.3.3 Animation from Interactions (Level AAA — not required, but good practice)
**Stack-level rule:** the `prefers-reduced-motion` media query

### Rule

If the user has set "Reduce motion" in their OS settings, your animations must respect that.

### What's safe (no need to respect prefers-reduced-motion):
- Fade transitions ≤ 200 ms
- Color transitions
- Border / outline changes
- Cursor changes

### What needs a reduced variant:
- Movement (slide-in, slide-up, parallax)
- Rotation (spinners — must be paused or replaced with a static "Loading…" label)
- Scale (zoom on hover, "explode" animations)
- Auto-playing video, GIFs, Lottie

### Annotate motion intent

For every animation in your mock, note:

```
[ANIMATION] Slide-in panel from right; respects prefers-reduced-motion (fades in only when reduced)
[ANIMATION] Spinner — replace with static "Loading…" text when reduced
```

Don't ask for elaborate hero animations on landing pages without specifying the reduced-motion fallback. The engineer should not have to invent one.

---

## Heading Labels and Landmarks (Designer's Mental Model)

The engineer renders your page like this:

```
<header>      ← page header / Navbar
  <nav>       ← main navigation
<main>        ← the content of this page
  <h1>        ← the page title
  <section>
    <h2>      ← section heading
<aside>       ← sidebar (filters, related content)
<footer>      ← page footer
```

You don't need to design `<header>` / `<nav>` / `<main>` boundaries explicitly, but you should be able to **point at any region of your mock and say which one it is**. If you can't, the engineer can't either.

For mocks where the page is composed of multiple discrete regions (a dashboard with 6 widgets), annotate each region with its heading and brief role:

```
[SECTION "Active cycles"] H2
  [CARD] Q4 review — H3
[SECTION "Pending approvals"] H2
  [LIST] 8 items
```

---

## Accessibility Annotation Patterns

When you hand off a mock, the engineer reads your annotations and translates them to code. The more specific you are, the less the engineer has to guess.

### Standard annotation tags

| Tag | What it tells the engineer |
|---|---|
| `[H1]` / `[H2]` / `[H3]` | Heading level for this text |
| `[REQUIRED]` | This field is required |
| `[OPTIONAL]` | This field is optional |
| `[PREFILL from step N]` | Pre-fill from earlier in the flow (WCAG 2.2 §3.3.7) |
| `[AUTOCOMPLETE: email]` | Use HTML autofill token |
| `[FOCUS-ON-OPEN]` | Element receives focus when the dialog/panel opens |
| `[ARIA-LABEL: "…"]` | Use this accessible name (for icon-only buttons) |
| `[ROLE: alert]` | This banner is urgent — `role="alert"` |
| `[ROLE: status]` | This banner is informational — `role="status"` |
| `[LIVE: polite]` | Updates here should be announced politely |
| `[LIVE: assertive]` | Updates here are urgent |
| `[DECORATIVE]` | This image / icon is decorative, hide from screen readers |
| `[ANIMATION: <name>]` | Spec the animation + reduced-motion fallback |
| `[HIT AREA: 44×44]` | Tap target must meet this size (use padding if visual is smaller) |
| `[HELP-LOCATION]` | This is the help link — must be in the same spot on every page (WCAG 2.2 §3.2.6) |

### Example: well-annotated dialog mock

```
[DIALOG: Confirm account deletion]
  [H2] "Confirm account deletion"
  [DESCRIPTION] "This action cannot be undone. Are you sure you want to delete your account?"

  [FOOTER, left-to-right tab order]
    [FOCUS-ON-OPEN] [BUTTON variant="outline"] "Cancel"
    [BUTTON variant="destructive"] "Delete account"

  [CLOSE BUTTON top-right]
    [ARIA-LABEL: "Close dialog"]
    [ICON: X, decorative]
```

The engineer now knows:
- It's a Dialog, focus traps automatically.
- Title is `<h2>` (becomes `aria-labelledby`).
- Description is the body (becomes `aria-describedby`).
- Focus lands on Cancel, not Delete (safe-default).
- The close icon-button has an `aria-label`.
- The X icon itself is `aria-hidden`.

That's it. No ARIA to write.

---

## Accessible Authentication (WCAG 2.2 §3.3.8)

If your design includes a sign-in page, follow these design rules:

1. **Allow paste on password fields.** No `onPaste` blocking. Password managers must work.
2. **Offer SSO / OAuth as the primary path.** "Continue with Google", "Continue with Microsoft" buttons above the email-password form.
3. **No CAPTCHA without an alternative.** If you must include CAPTCHA, use one with an audio fallback (Google reCAPTCHA, hCaptcha) and annotate that.
4. **No memory tests.** "Type the 3rd character of your password" is forbidden.
5. **Passkeys / WebAuthn.** If your stack supports them, prefer them — they're explicitly recognized as 3.3.8-compliant.

---

## Consistent Help (WCAG 2.2 §3.2.6)

If your design includes a help mechanism (chat widget, contact link, support email, help center), it must appear in the **same relative location** on every page.

Pick one and stick with it:

| Pattern | Where it lives |
|---|---|
| Help link in avatar menu | Bottom of the avatar dropdown, every page |
| Help button in footer | Always-present footer link |
| Floating help button | Fixed bottom-right, same position every page |

Annotate `[HELP-LOCATION]` on the canonical help element. The engineer will mirror that placement on every route via the AppShell.

---

## Sensory Characteristics (WCAG 1.3.3)

**Don't write copy that relies on color, shape, position, or sound** as the only way to identify content.

Bad:
- "Click the button below" (which button? — fails on RTL, mobile reflow)
- "The red icon shows errors" (fails for color-blind users)
- "Use the arrow on the right" (fails when layout flips to single-column)

Good:
- "Click **Continue**"
- "Icons labeled **Error** show validation failures"
- "Use the **Next** button"

Always name the thing the user is interacting with, not its position or color.

---

## Designer's Pre-Handoff Checklist

Before sending a mock to the engineer:

### Color & contrast
- [ ] Every text-on-fill combination passes 4.5:1 (3:1 for ≥18pt or 14pt bold)
- [ ] Every UI element border / icon passes 3:1
- [ ] No raw hex / Tailwind color scale anywhere — only ef-ds tokens
- [ ] No `text-white` / `bg-white` references — only `text-*-foreground` and surface tokens
- [ ] Grayscale check: every state distinguishable without color

### Don't-rely-on-color
- [ ] No copy that says "click the red button" / "items in green"
- [ ] Every error state has an icon, not just a red border
- [ ] Every status pill has an icon, not just a colored background
- [ ] Charts use line patterns / markers, not just color

### Hierarchy
- [ ] Exactly one `<h1>` per page, annotated
- [ ] Heading levels don't skip (no `h1` → `h3`)
- [ ] Largest text on the page is the `<h1>` (or the discrepancy is justified)

### Focus order
- [ ] Visual order matches the reading order
- [ ] Primary action positioned where the user's eye lands last (typical: bottom-right)
- [ ] `[FOCUS-ON-OPEN]` annotated for every dialog / panel
- [ ] Destructive dialogs focus the safe action by default

### Forms
- [ ] Every input has a visible label above the field
- [ ] No placeholder-only labels
- [ ] Required fields marked with `*` AND a once-per-form legend
- [ ] Each error message annotated with location, content, and timing
- [ ] WCAG 2.2 §3.3.7: prefilled fields marked `[PREFILL from step N]`
- [ ] HTML autofill tokens annotated for known field types (email, name, address)

### Touch targets (WCAG 2.2 §2.5.8)
- [ ] All buttons / icon-buttons meet 24×24 minimum (ef-ds `sm`+ or `icon-sm`+)
- [ ] Primary CTAs are `default` size or larger
- [ ] At least 8 px gap between adjacent tappable elements

### Responsive
- [ ] Designed at 320, 768, 1440 px
- [ ] Mobile uses single-column, full-width inputs
- [ ] Data tables have a card-list mobile variant
- [ ] Dialogs full-screen on mobile

### Motion
- [ ] Every animation has a `[ANIMATION]` annotation
- [ ] Movement / rotation / scale animations have a reduced-motion fallback specified

### Authentication (if applicable)
- [ ] Password field allows paste
- [ ] SSO / OAuth offered as primary path
- [ ] No CAPTCHA without an alt-method
- [ ] No memory tests

### Consistent help (WCAG 2.2 §3.2.6)
- [ ] Help / contact mechanism placed in the same location on every screen
- [ ] `[HELP-LOCATION]` annotated on the canonical element

### Cross-skill
- [ ] Read [`../../design-tw-frontend-engineer/references/accessibility.md`](../../design-tw-frontend-engineer/references/accessibility.md) if you're unsure how a design decision becomes code
- [ ] Read [`../../_content/content-design-standards.md`](../../_content/content-design-standards.md) for tone, error message phrasing, and inclusive language

---

## What the engineer will catch (and bounce back to you)

If you ship a mock missing any of the above, the engineer's pre-delivery checks will catch it:

| Engineer check | What you fix |
|---|---|
| `pnpm run theme:audit` fails | Replace hex / Tailwind color scales with ef-ds tokens |
| axe DevTools "color contrast" violation | Re-pick a token pair |
| axe DevTools "form labels" violation | Add visible labels |
| Lighthouse score < 100 | Resolve the specific finding |
| Keyboard test reveals trapped / skipped element | Re-order the layout |
| Mobile screenshot shows horizontal scroll | Design the 320-px viewport |

The cheapest place to fix any of these is in the mock. The most expensive is after the engineer has implemented and someone files an a11y bug.

---

## Quick reference: the 12 most common designer-side a11y misses

1. **Placeholder used as a label** — add a visible label above the input.
2. **Required fields marked only with red asterisks** — add a legend, ensure shape + text + color.
3. **Status badges differentiated only by color** — add a leading icon to every Tag.
4. **"Click the red Submit button" copy** — name the button, drop the color reference.
5. **Body text in `text-muted-foreground` on a `bg-muted` surface** — fails contrast; check before handing off.
6. **Light gray placeholder text against white** — contrast often fails 3:1 at design time.
7. **16-px icon-only Buttons** — bump to `icon-sm` (32×32) minimum.
8. **Modals that focus the destructive action** — flip the default to the safe action.
9. **Charts with no legend, no markers, no patterns** — add at least one non-color differentiator.
10. **Mobile design absent** — design 320-px alongside desktop, not after.
11. **Sticky headers that hide focused inputs** — design the scroll behavior (`scroll-mt-20`).
12. **No motion fallback** — annotate the `prefers-reduced-motion` variant for every animation.

---

**Last Updated:** May 22, 2026
**Status:** Complete — covers WCAG 2.1 Level AA + WCAG 2.2 designer-stage criteria

For the implementation-side companion, see [`../../design-tw-frontend-engineer/references/accessibility.md`](../../design-tw-frontend-engineer/references/accessibility.md).
