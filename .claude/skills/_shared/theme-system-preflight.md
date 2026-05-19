# Theme System Preflight (shared)

Run by `forger` during project init (step 6 of Project Creation), after boilerplate is copied into `frontend/` and before dependencies are installed. The boilerplate must ship a complete, wired theme system — every downstream UI skill (`design-tw-ux-designer`, `ui-builder`, `design-tw-frontend-engineer`) depends on it.

If any item below is missing or broken in the just-copied `frontend/`, halt, patch the boilerplate source in `boilerplate/frontend/`, re-copy, and re-verify. Do not proceed to `pnpm install` with a broken theme system.

## Required artifacts

**Tokens**
- `src/tokens/shadcn.css` defines the full semantic catalog on `:root`: `--primary`, `--accent`, `--destructive`, `--success`, `--warning`, `--info`, `--background`, `--foreground`, `--muted`, `--card`, `--popover`, `--surface`, `--border`, `--input`, `--ring`, `--navbar-bg`, `--navbar-fg`, `--navbar-bg-hover`, `--navbar-fg-hover`, `--chart-1`..`--chart-6` (plus `-foreground` pairs where applicable). Dark mirrors in `.dark {}`.
- `src/styles/tailwind.css` `@theme inline` registers every token above as a `--color-*` alias so `bg-*`/`text-*`/`border-*` utilities resolve.
- `src/tokens/shadcn.css` rebinds Octuple palette tokens to shadcn tokens so ef-design-system components respond to overrides (`--color-button-primary-bg: var(--primary)` etc.).

**Theme panel**
- `src/components/theme/ThemeSwitcher.tsx` + `.css` + `index.ts` exist — self-contained floating FAB + panel, not dependent on `DevToolbarProvider`. FAB anchors to `fixed bottom-6 right-6`; panel opens at `bottom-20 right-6`.
- `src/App.tsx` **mounts `<ThemeSwitcher />`** inside `QueryClientProvider`. Without the mount the theme panel is orphan code.
- `src/store/theme.ts` exposes `useThemeStore` with persisted overrides (Zustand + `persist` middleware) and an `isPanelOpen` slice.

**Consumers**
- Navbar surfaces in `src/components/Navbar/Navbar.css` consume `var(--navbar-bg)` / `var(--navbar-fg)` / `var(--navbar-bg-hover)` / `var(--navbar-fg-hover)` on the top bar, icon buttons, tab text + hover, product name, avatar caret, and mobile drawer. Popover rules (avatar/tab dropdown) stay on `--popover` tokens. Raw hex or Octuple greys on navbar-surface rules are a failure. See [`theme-navbar-rule.md`](theme-navbar-rule.md) for the full navbar contract.
- `src/lib/cssVarToHex.ts` exports `cssVarToHex(cssVar)`; `src/lib/chartColors.ts` exports `getChartColors()` built on it.

**Env + tooling**
- `.env.example` declares `VITE_APP_MODE` (default `prototype`) and `VITE_ENABLE_THEME_PANEL` (default `true`); `src/environment.d.ts` types both.
- `scripts/theme-audit.mjs` exists and `package.json` has `"theme:audit"` + `"prebuild": "pnpm run theme:audit"` wired.
