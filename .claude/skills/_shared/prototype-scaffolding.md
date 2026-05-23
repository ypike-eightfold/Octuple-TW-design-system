# Prototype scaffolding & gallery contract

How to build a clickable React prototype in this repo so it shows up in the gallery looking like every other approved prototype. Read this **before** scaffolding any new product prototype — the conventions here are not negotiable; they're what makes prototypes interchangeable in the gallery iframe view.

The reference implementation is **Career Hub Continuous Sync** (`web/app/(prototype)/careerhub/...` + `web/public/content/designs/talent-management/careerhub-continuous-sync/`). Copy its shape.

---

## Where the prototype lives

```
web/app/(prototype)/
  <product>/                                  # e.g. careerhub, talent-acquisition, ...
    layout.tsx                                # wraps PrototypeProvider + ScreensFAB
    page.tsx                                  # redirects to the default route
    _lib/
      types.ts                                # shape of mock data + persona/state types
      mock-data.ts                            # the single source of fixtures
      PrototypeContext.tsx                    # persona, dataState, all toggles; persists to localStorage
      avatar-colors.ts                        # deterministic per-identity palette
      useFittedTabs.ts                        # if the product navbar needs dynamic overflow
      subject.ts                              # subject-id resolution helpers (if drill-down routes exist)
      format.ts                               # date/number helpers — keep dependency-free
    _components/
      PrototypeShell.tsx                      # thin wrapper around product's *Shell with the real navbar tabs
      ScreensFAB.tsx                          # bottom-left dev FAB (persona + state)
      PersonAvatar.tsx                        # Avatar primitive + avatar-colors
      <ProductScreenLayout>.tsx               # per-product layout that wires the shell + sub-tab nav
      <SubTabsNav>.tsx                        # sub-tab nav using Tabs variant="line"
    _features/                                # extracted screen bodies, each takes a subject/id prop
      <Screen1>.tsx
      <Screen2>.tsx
      ...
    <route>/page.tsx                          # thin route page → picks subject, renders feature
    <route>/<segment>/page.tsx                # nested routes for sub-tabs
```

**URL slug**: `lowercase-with-hyphens`. The product name in display copy (`"Career Hub"`) is two words per the terms list; the URL slug (`careerhub`) is one word for compactness — never user-visible.

---

## Required dev tooling

Every prototype ships with two pieces of dev tooling. Both come out at production time (the `ui-builder` skill removes them) — but during the prototype phase they're mandatory.

### 1. `PrototypeContext` — persona, data state, and feature toggles

A React context that owns:
- `persona`: which user is signed in (`'alex' | 'sam' | ...`)
- `dataState`: one of `'populated' | 'empty' | 'loading' | 'error'`
- Any cross-page state the prototype needs (agenda items added, action items checked, AI-loading flags, peer-feedback sent flags, draft tone, timeframe, etc.)

**Persist to localStorage** under a single namespaced key (e.g. `careerhub-prototype:v1`). The product navbar's chevron sub-menu items trigger full-page navigations; without persistence the persona resets to the default every time.

Gate any persona-dependent redirects on a `hydrated` flag — without it, the page renders against the default persona on first paint, fires the redirect, and only then loads the persisted persona. The result is a flash of the wrong view + an unwanted route change.

```tsx
useEffect(() => {
  if (hydrated && persona === 'alex') router.replace('/...')
}, [hydrated, persona, router])
if (!hydrated || persona === 'alex') return null
```

### 2. `ScreensFAB` — bottom-left floating action button

Use the design system's `FloatingActionButton` (`variant="primary"`, extended with a `label="Screens"`). Position `fixed bottom-6 left-6 z-[9998]`.

Click opens a **nested popover**: persona column on the left, state column on the right (shown when a persona is hovered/clicked). No top dev bars — the goal is for the prototype area to read as production UI; the FAB is the only persistent dev affordance.

A click outside the popover closes it. Persona / state changes persist via the context (so the FAB also acts as the persistence trigger).

### What NOT to do

- ❌ Do not add a top "PERSONA / STATE" bar above the product chrome — it pushes the real UI down and breaks the illusion the gallery is going for.
- ❌ Do not use raw HTML `<button>` for the FAB — use `FloatingActionButton` from `@tonyh-2-eightfold/ef-design-system`.
- ❌ Do not store persona/state in URL query params — chevron sub-menu items use absolute paths that won't carry params forward.

---

## The product chrome — use what's there

The prototype's navbar is the **real product navbar**, not a hand-rolled one. For Career Hub: import `EMPLOYEE_NON_MANAGER_TABS` / `MANAGER_TABS` / `CAREER_HUB_CHRO_TABS` / `CAREER_HUB_HRBP_TABS` from `@tonyh-2-eightfold/ef-design-system` and render through `<CareerHubShell>` (which composes `Navbar` + `Header` + `ProductBackground`).

If your prototype's screens need a place in the navbar, **don't invent a new top-level tab**. Either:
1. Hang the screens under an existing tab (`People`, `My team`, etc.) as sub-tabs (`Tabs variant="line"`).
2. Add a single new tab whose chevron dropdown reveals the screens as sub-items.
3. Reach them via deep-link from a list page that already lives somewhere in the navbar.

When in doubt, **ask the user where the screens go in the existing IA**. See `must-use-components.md` § IA discipline.

### Glassmorphic hero treatment

Career Hub prototypes use the chevron `ProductBackground` bleeding up under a translucent navbar. The technique:

```css
/* Container class on the wrapper that holds CareerHubShell. */
.prototype-careerhub-shell {
  position: relative;
}

/* Sticky the wrapper containing the navbar — NOT the navbar itself.
   The navbar's immediate parent is only as tall as the navbar, so
   position:sticky on .navbar loses its containing block and scrolls
   with the page. Putting sticky on the wrapper keeps the nav pinned. */
.prototype-careerhub-shell > .career-hub-shell:first-child {
  position: sticky;
  top: 0;
  z-index: 20;
}

/* Translucent + heavy blur so the chevron art reads through the nav.
   Calibrated at 0.25 opacity + 24px blur + 160% saturate — anything
   more opaque kills the glass effect; anything more transparent fails
   AA contrast on the navbar text. */
.prototype-careerhub-shell .navbar {
  background: rgba(255, 255, 255, 0.25) !important;
  backdrop-filter: blur(24px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(160%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
}

/* Pull the ProductBackground up behind the navbar (negative margin)
   and pad the Header back down inside it so the layout reads correctly. */
.prototype-careerhub-shell > .career-hub-shell:first-child + * {
  margin-top: calc(-1 * var(--navbar-height, 60px));
  padding-top: var(--navbar-height, 60px);
}
```

The container class goes on the outer wrapper inside `PrototypeShell` alongside `.header-assembled-ch-shell` (the design system's in-flow override).

### Dynamic nav overflow ("More")

When the navbar tabs exceed the available width but the viewport is still wider than the design system's hamburger breakpoint (1280px), collapse trailing items into a "More" chevron dropdown. The `useFittedTabs` hook in [`web/app/(prototype)/careerhub/_lib/useFittedTabs.ts`](../../../web/app/(prototype)/careerhub/_lib/useFittedTabs.ts) is the reference implementation:

- Estimate each tab's width from label characters × font-width + padding (+ chevron if present).
- Subtract a fixed budget for the non-tab navbar regions (logo, search, actions, avatar — ~730px for Career Hub).
- Greedy fit from the document-order list; trailing items go into a new `{ id: 'more', label: 'More', chevron: true, subItems: [...] }` tab.
- Pin tabs that must always show (e.g., `Home`, the prototype's host tab) so they never overflow.
- Below the hamburger breakpoint, just return the original list — let the design system drawer handle it.
- When nothing overflows, return the original list unchanged (no empty "More" tab).

---

## The gallery contract

Every prototype publishes to `web/public/content/designs/<category>/<slug>/` with three files. The gallery scans this tree at build time and renders the iframe view automatically — there's no per-prototype gallery code to write.

```
web/public/content/designs/<category>/<slug>/
  index.html       # iframe entry — either static OR a redirect to the live React route
  meta.json        # title, description, category, version, slug, author, createdAt
  thumbnail.png    # 1440×900 PNG — only shown on the category grid card
```

### Live React prototypes use a redirect index.html

Don't duplicate the React prototype as static HTML. Instead, write a small `index.html` that retargets the iframe at the live route:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><Product> <Feature> · Eightfold</title>
  <meta http-equiv="refresh" content="0; url=/<product>/<default-route>" />
  <link rel="canonical" href="/<product>/<default-route>" />
  <script>window.location.replace('/<product>/<default-route>');</script>
</head>
<body><!-- minimal loading state — see careerhub-continuous-sync for reference --></body>
</html>
```

The meta-refresh handles JS-disabled environments; the inline script handles sandboxed iframes where meta-refresh is sometimes delayed.

### What the gallery automatically provides

The gallery's detail page (`web/app/(site)/gallery/[category]/[slug]/page.tsx`) renders the iframe with the `PrototypeFullscreen` client component, which ships:

- **Viewport switcher** — Desktop (full / min-w-[1440px]) / Tablet landscape (1024px) / Tablet portrait (800px) / Mobile (420px). The iframe re-mounts on viewport change via a `key={viewport}` prop so the prototype recomputes its responsive layout from scratch.
- **Take screenshot** — uses `html-to-image` against the iframe's `contentDocument.body`. Works because the iframe is same-origin (loads from the host app's `/content/designs/...` path) and `sandbox="allow-same-origin allow-scripts"` preserves that access. Downloads as `<slug>-<viewport>-screenshot.png`.
- **Full screen** — `iframe.requestFullscreen()` with `allowFullScreen` on the iframe element.
- **Sticky product nav inside the iframe** — handled by the prototype's own CSS (see § Glassmorphic hero treatment), not by the gallery shell.
- **No site chrome inside the iframe** — the site `TopNav` + footer hide on prototype routes via a `pathname.startsWith("/<product>")` check in both client components.

**You inherit all of this for free.** Don't try to reimplement viewport switching, fullscreen, or screenshot at the prototype level.

### Gallery container width

The gallery layout is `max-w-screen-2xl` (1536px) — wide enough that prototype iframes with `min-w-[1440px]` render their desktop layout without triggering the navbar's hamburger collapse. Don't shrink the gallery container; don't widen the prototype's `min-w-[1440px]` floor (anything wider means the iframe horizontally scrolls on common laptop screens).

---

## Deploy: Vercel buildCommand must be `npm run build`

`web/vercel.json` MUST have `"buildCommand": "npm run build"`, not `"next build"`. The repo's `web/package.json` declares a `prebuild` script that runs `copy-public-to-web.mjs` — which copies the Eightfold logo, product logos, fonts, and object-card illustrations from `/public/` into `web/public/`. Those assets are `.gitignore`d (canonical source is the repo root `/public/`).

If you bypass the npm script hooks by setting `buildCommand: "next build"`, the copy never runs and `/eightfold-logo.svg` + `/product-logos/*.svg` 404 in production. The dev server works fine because `predev` runs the same copy locally.

---

## Self-check before declaring a prototype done

- [ ] Lives under `web/app/(prototype)/<product>/`.
- [ ] Has a `_lib/PrototypeContext.tsx` that persists `persona` + `dataState` (and any cross-page toggles) to localStorage under a versioned key.
- [ ] Has a `ScreensFAB` (or named equivalent) wired into the prototype's layout — no top dev bar.
- [ ] Renders the **real** product navbar tabs from `@tonyh-2-eightfold/ef-design-system` (`EMPLOYEE_NON_MANAGER_TABS`, `MANAGER_TABS`, etc.) — not a hand-rolled `<header>`.
- [ ] If the navbar might overflow, uses `useFittedTabs` (or a hook with the same contract) so overflow collapses into a "More" dropdown and disappears when everything fits.
- [ ] Site `TopNav` + footer are hidden on the prototype's routes (`pathname.startsWith("/<product>")` check).
- [ ] Gallery entry's `index.html` is a redirect to the live route (not a static HTML duplicate).
- [ ] `meta.json` follows the schema: `{ title, description, category, version, slug, author, createdAt }`.
- [ ] `thumbnail.png` is 1440×900.
- [ ] `web/vercel.json` has `"buildCommand": "npm run build"`.
- [ ] Verified the prototype reads correctly at all 4 viewports via the gallery's switcher (Desktop / Tablet landscape / Tablet portrait / Mobile).
- [ ] Verified the navbar stays sticky when scrolling inside the gallery iframe.
- [ ] Ran the `must-use-components.md` self-check greps — zero raw-Tailwind buttons / chip spans / native selects / native inputs.
