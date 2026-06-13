# Site search — plan

Status: proposal · scope owner: gallery site

## Goal

One keyboard shortcut (`Cmd/Ctrl + K`) opens a modal that takes you straight
to anything published on the site:

- a design in the gallery
- a token, component, or example in the Octuple catalog
- a heading inside the "Claude setup" workflow page or any Document under
  `/components`

Today the only way to find these is to remember which top-level tab they
live under and then scroll. As the gallery has grown past ~50 designs and
the catalog past ~30 component pages, that's starting to bite.

## Non-goals (for this PR)

- AI copilot / chat answers over the corpus. Out of scope — but the index
  this plan builds is the same corpus a copilot would retrieve from, so
  Phase 2 is a thin chat panel on top, not a rewrite.
- Server-side search (Algolia, Typesense). The corpus is small (~150 items,
  <100 KB JSON) and changes only when the site rebuilds — client-side
  fuzzy search is the right tool.
- Full-text search inside design prototypes (the iframed apps). Those are
  black boxes; we only index their metadata.

## Content sources

| Section | Source on disk | Items today |
|---|---|---|
| Designs | `web/lib/designs.ts` → `getAllDesigns()` | ~50 |
| Octuple — Tokens | `TOKEN_SECTIONS` in `web/app/components/App.tsx` | 8 |
| Octuple — Components | `SIDEBAR_GROUPS[Components]` (Navbar, Header, + SHADCN_COMPONENTS) | ~30 |
| Octuple — Documents | `DOCUMENT_SOURCES` in `web/app/components/page.tsx` | 6 markdown files |
| Doc headings (h2/h3) | `extractHeadings()` reused | ~40 across all docs |
| "Claude setup" workflow | `web/app/(site)/docs/workflow/page.tsx` | 1 page, ~12 sections |

Everything except the workflow page is already enumerated in code we own.
The workflow page is a single TSX file with hand-authored sections — we
either annotate it with stable section ids (preferred) or extract `<h2>`
text by regex at build time.

## UX

- **Trigger.** A small button in `TopNav` between `HeroSwitcher` and
  `ThemeSwitcher`: an Octuple secondary icon button with a `search` Material
  Symbol and a faint `⌘K` chip beside it on `sm:` and up. `Cmd+K` /
  `Ctrl+K` opens the modal from anywhere on the site. `/` also opens it
  (matches GitHub, Linear, Vercel).
- **Modal.** `cmdk` dialog, centered, ~640 px wide, max-h `70vh`. Uses
  Octuple's `--card`, `--border`, `--foreground` tokens so it themes
  light/dark automatically.
- **Results.** Grouped by section: _Designs_, _Octuple_, _Docs_. Up to 8
  rows per group, then "Show more in <section>" → routes to the section.
  Each row: title (semibold), 1-line snippet from description, breadcrumb
  on the right (e.g. `Gallery › Talent management`).
- **Empty query.** Shows recents (last 5 visited, localStorage-backed)
  + a small "Try: tokens, table, mara" hint.
- **Empty result.** Single line: "No matches for _query_. Tabs above still
  work."
- **Keyboard.** Arrow keys + Enter to navigate; `Esc` closes; result rows
  are real `<Link>`s so right-click/middle-click open in a new tab.

## Tech

Build-time index → client-side fuzzy search → cmdk modal.

```
web/lib/search/build-index.ts     // node-only; reads designs.ts + catalog metadata
web/lib/search/index.json         // generated; committed (small, ~80 KB)
web/lib/search/types.ts           // shared SearchableItem types
web/components/site/search/
  search-trigger.tsx              // TopNav button
  search-dialog.tsx               // cmdk modal
  use-search.ts                   // wraps Fuse, debounced input
```

Dependencies (~12 KB minified+gzipped, all):

- `fuse.js` — fuzzy matcher. Weighted fields: title 0.6, description 0.3,
  category 0.1. Threshold 0.35 (favors precision over recall).
- `cmdk` — accessible command-palette primitive (Vercel/Linear/Raycast use
  it).

Index build is a one-shot node script run during `next build` (or
`prebuild`), so the JSON is static and cached by the browser like any
other asset. No runtime cost beyond fetching the JSON (lazy: only when
the user opens the modal the first time).

## File-level changes (planned)

| File | Change |
|---|---|
| `web/lib/search/types.ts` | New. `SearchableItem` union (design/token/component/doc-section/workflow-section). |
| `web/lib/search/build-index.ts` | New. Reads `getAllDesigns()` + walks `SIDEBAR_GROUPS` + extracts doc + workflow headings → writes `index.json`. |
| `web/lib/search/index.json` | Generated. Committed so prod doesn't need a build step we don't already run. |
| `web/components/site/search/*` | New. Trigger button + cmdk modal + Fuse hook. |
| `web/components/site/top-nav.tsx` | Add `<SearchTrigger />` between `HeroSwitcher` and `ThemeSwitcher`. |
| `web/app/(site)/layout.tsx` (or root) | Mount `<SearchDialog />` once at the root so the keyboard shortcut is global. |
| `package.json` | Add `fuse.js`, `cmdk`. |
| `web/scripts/build-search-index.ts` | New. Invoked from `prebuild` npm script. |
| `web/app/(site)/docs/workflow/page.tsx` | Add stable `id` attributes to the existing `<h2>` sections so deep-links work. |

## Phasing

**Phase 1 — this PR series.** Ship search end-to-end with the corpus
above. No copilot, no server-side. ~2 days of work behind the plan.

**Phase 2 — copilot (later, not now).** The same `SearchableItem[]`
becomes the retrieval corpus for a small RAG chat panel. Add a thin
`/api/search?q=…` endpoint that returns the JSON results (Fuse runs
server-side for the copilot's tool call) and a chat composer that uses
Octuple's `Input shape="pill"` + AI agent `InfoBar`. The plan deliberately
puts the index behind a stable boundary so Phase 2 is purely additive.

## Open questions

1. **Workflow page headings: annotate vs extract?** Adding `id="…"` to the
   `<h2>`s in `workflow/page.tsx` is one line of edit and gives us stable
   deep-links forever. Regex-extracting them at build is more fragile but
   needs no edit. Recommend annotation.
2. **Recents storage key.** Suggest `ef-gallery:search-recents` matching
   the existing `ef-gallery:hero` and theme keys.
3. **Should `/` open the modal?** GitHub does; Linear doesn't. Soft yes —
   it's a single keydown listener and easy to remove.

## Out of scope, but worth noting

- The MARA / Career Hub / employee-growth-hub prototypes have their own
  internal screens. We do **not** index those — when someone searches
  "mara", they land on the gallery entry for MARA and pick a screen from
  the flow strip. Indexing screens individually would mean each prototype
  has to register its flow with the search builder, which is more coupling
  than the upside justifies right now.
