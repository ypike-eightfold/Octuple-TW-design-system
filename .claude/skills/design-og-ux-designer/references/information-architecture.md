# Information Architecture (OG)

Information-architecture rules and conventions for designing OG Octuple screens. Apply these per-screen and per-flow.

---

## Navigation pattern by persona

Choose the navigation chrome by the persona's job complexity, not the page's content density.

| Persona type | Pattern | Rationale |
|---|---|---|
| Power user — recruiter, admin, manager with many parallel workflows | Left sidebar (`Layout.Aside`, width 240) with grouped menu items; top bar for global actions (search, account, notifications). | Many destinations; users return to known sections repeatedly. Sidebar wins. |
| Simple user — employee, candidate, single job-to-do | Top tabs (`<Tabs>`); no sidebar. | Few destinations; cognitive load matters more than density. |
| Marketing / external visitor | Top bar only; no nav chrome. | Linear content consumption, low complexity. |

**Never combine** a left sidebar AND top tabs unless one of them is contextual (e.g. tabs *inside* a page on a sidebar layout). Two persistent navigation systems compete and confuse.

---

## Page-level structure

Every page in this order, top to bottom:

```
Top bar (Layout.Header)
  — global search, persona switcher (in dev), account, notifications

Breadcrumb (Breadcrumb)
  — only if the page is not a top-level destination

Page title (h1)
  — short, noun-phrase, matches the sidebar/tab label exactly

Page actions (right-aligned, same row as title)
  — primary CTA + 0..2 secondary actions

Filters / search (if applicable)
  — flexbox row, not Row/Col

Main content
  — body. Tables, dashboards, forms, etc.
```

Pages diverge from this only with explicit reason — e.g. wizard pages put a `<Stepper>` above the title, login pages have no breadcrumb.

---

## Product-line organization (where pages live on disk)

```
src/pages/TalentManagement/      — Employee profiles, people search, org charts
src/pages/TalentAcquisition/     — Candidate details, job postings, applications
src/pages/PersonalCareerSite/    — Career pages, job search
src/pages/WorkforceExchange/     — Marketplace
src/pages/AIAgents/              — AI-powered features
src/pages/ResourceManagement/    — Resource allocation, staffing
src/pages/Admin/                 — Admin Console (if needed)
src/pages/Analytics/             — Analytics (if needed)
```

Rules:

- A new screen goes in the product-line folder it primarily serves.
- A flow that spans multiple product lines lives in the *primary* line; ask the user which is primary.
- Don't create a new top-level folder without confirmation.
- Mirror folder names in route paths: `src/pages/TalentManagement/People/PeoplePage.tsx` → `/talent-management/people`.

---

## Persona scoping

Every design must answer: **which personas see this screen?** and **does the screen look different per persona?**

Approach:

1. List the personas. Always be explicit — don't say "users".
2. For each persona, note what they should see (or not see) on this screen.
3. If two personas see substantially different views, consider whether they are actually different screens.
4. If they share most of a screen, gate the differences with persona-conditional rendering. Keep one route.

In prototypes, use a **PersonaSwitcher** dev tool or persona-prefixed routes (`/recruiter/dashboard`, `/manager/dashboard`) so reviewers can flip between personas without re-logging-in. Strip the dev tool when handing off to the engineer skill.

---

## Breadcrumb conventions

- Breadcrumbs reflect navigational hierarchy, not the click trail. "Home → Talent Management → People → Jane Doe" not "Home → Search Results → Jane Doe".
- The last breadcrumb item is the current page, not a link.
- Use Octuple's `<Breadcrumb>` with `<Breadcrumb.Item>` children. No custom breadcrumb.
- Place above the page title, not in the top bar.
- Omit breadcrumbs entirely on top-level destinations (the page is the breadcrumb root).

---

## Tabs vs sub-pages

| Decision | Use tabs | Use sub-pages |
|---|---|---|
| The data on each section is independent and the user often switches between them | ✅ Tabs | |
| Each section is a destination the user might bookmark or share a URL to | ✅ Tabs (if URL-state tabs) | ✅ Sub-pages |
| Sections share filters / search / state | ✅ Tabs | |
| Sections have distinct workflows that don't share state | | ✅ Sub-pages |
| There are more than 5 sections | | ✅ Sub-pages (tabs become noise) |

Either way, **never** put tabs inside tabs. Nesting tabs is always a sign of an IA problem upstream.

---

## Empty, error, and loading-state IA

Empty/error/loading states are part of the IA, not visual afterthoughts.

| State | What it should communicate |
|---|---|
| Empty | What this section is for, and what the user can do to populate it. Use `<Empty>` with a clear CTA. |
| Loading | "We're fetching X." Use `<Skeleton>` showing the page's structure, not a spinner over a blank page. |
| Error | "We couldn't load X. Here's what to try." Use `<MessageBar>` or `<InfoBar>` — calm and actionable. |
| No permission | "You don't have access to X. Ask Y for it." Be specific about who grants access. |
| Mid-action (saving, processing) | Disable the action, show a loading state in the button or section, don't lock the whole page. |

Design these states **before** the populated state is signed off — they often surface IA gaps in the populated design.

---

## Search and filtering

For a screen with searchable / filterable lists:

- Search input goes at the top of the list, **left-aligned, single field**.
- Filters go to the right of search OR in a `<Drawer>` for many filters.
- Active filters appear as `<Pill>` chips below the search row, each removable.
- "Clear all filters" link to the right of the active filter row.
- Result count above the list: "12 results" — not "Showing 1 of 12" (that goes in pagination).

Do not use Octuple's `SearchBox` component (known icon bugs — see `../design-og-frontend-engineer/references/learnings.md`). Use `<TextInput>` with `iconProps`.

---

## Tables and data display

For data-heavy screens:

- Default to `<Table>` with proper column definitions.
- Column priority: most-important leftmost. Identifying columns (name, ID) before metric columns.
- Right-align numeric columns; left-align text; center status badges.
- Row actions go in the rightmost column as icon-only buttons with tooltips.
- For 5+ rows, show pagination — Octuple's `<Pagination>`.
- For 50+ rows, virtualize the table; do not load everything at once.

For dashboards (mix of metrics, charts, tables):

- Top row: high-level metric cards (KPIs). 2-4 cards.
- Below: charts and/or tables that drill into the metrics.
- Don't over-pack — a dashboard with everything is a dashboard with nothing.

---

## Forms

For forms:

- One column for simple forms (<8 fields), two columns for dense forms (8+).
- Group related fields with a section heading or a `<Card>`.
- Required fields marked with an asterisk in the label (handled by `<Form.Item required>`).
- Primary action ("Save") on the right, secondary ("Cancel") to its left. Mirror this on RTL locales.
- Inline validation appears below the field, in red. Use `<Form.Item>`'s `rules`.
- Submit feedback: success message via `<Snackbar>` or `<MessageBar>`, error message in-context near the failed field plus a top-level `<InfoBar>`.

For wizards (multi-step flows):

- Use `<Stepper>` at the top to show progress.
- One step per screen. No deeply scrolling steps.
- Always allow back-navigation — never destroy data on back.
- The final step is "Review" before "Submit" — never go from input straight to submission.

---

## Anti-patterns

- "Action overload" in a single row — 4+ buttons squeezed together. Group into a `<Dropdown>` menu or move secondary actions into a kebab menu.
- Tabs inside tabs.
- Sidebar + top tabs (two persistent navs competing).
- Empty states with only "There's nothing here" — no instruction on what to do.
- Hiding destructive actions behind unlabeled icons. "Delete" needs a visible word, not just a trash icon.
- Inventing breadcrumbs that don't match the actual navigation hierarchy.
- Persona-conditional logic that branches the whole screen into two different layouts — that's two screens, not one.
