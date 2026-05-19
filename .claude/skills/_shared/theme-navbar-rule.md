# Navbar Theming Rule (shared)

Canonical rule consumed by every UI skill (`design-tw-ux-designer`, `ui-builder`, `design-tw-frontend-engineer`) and enforced by `forger`'s Theme System Preflight at project init.

## Rule

Any top-bar, side-nav, app shell header, or nav drawer surface **must** use the navbar token family on the container *and* on its interactive children (icon buttons, tab text, hover states, product name, avatar caret, mobile drawer):

| Role | Tailwind utility | CSS variable |
|---|---|---|
| Nav surface background | `bg-navbar-bg` | `var(--navbar-bg)` |
| Nav surface foreground | `text-navbar-fg` | `var(--navbar-fg)` |
| Nav hover background | `bg-navbar-bg-hover` | `var(--navbar-bg-hover)` |
| Nav hover foreground | `text-navbar-fg-hover` | `var(--navbar-fg-hover)` |

## Why

The ThemeSwitcher NAVBAR section drives these four tokens exclusively. Using surface/foreground tokens (`bg-background`, `bg-muted`, `text-foreground`) or raw greys on nav surfaces silently breaks the live theme preview — a user dragging a NAVBAR slider sees no change.

## Scope

- **Applies to**: top bar, side nav, app shell header, mobile nav drawer, nav-owned icon buttons, nav tabs, nav menu links.
- **Does NOT apply to**: popover surfaces spawned from nav (avatar dropdown menu, tab dropdown menu) — those keep `--popover` tokens. Dividers keep neutral border tokens.

## Mount invariant

`<ThemeSwitcher />` is mounted in `boilerplate/frontend/src/App.tsx` and must stay mounted through every skill's output. Production safety comes from `VITE_ENABLE_THEME_PANEL=false`, not from unmounting. `ui-builder` explicitly preserves this mount during Phase 0 dev-toolbar removal.

## Handoff gate

`pnpm run theme:audit` must exit 0 before handoff. Its regex catches hardcoded greys, branded accents, and arbitrary hex — the navbar rule above ensures nav surfaces pass.
