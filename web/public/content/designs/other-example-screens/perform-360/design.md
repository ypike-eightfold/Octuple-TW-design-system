# Perform 360

Performance review app spanning every level of the org — IC, manager, manager-of-managers, and CHRO. Built against the [PRD](https://claude.ai/code/artifact/26728884-35ed-4ba0-8aaa-bda38bfe2339).

## Personas (Demo as)

A "Demo as" switcher in the top right lets you flip through every role without signing in fresh. The role-aware shell swaps the sidebar and lands you on that persona's home screen.

- **IC** — your self-review, peers, inbox, upward review of your manager
- **Manager** — your team list, direct-report review form (with AI peer themes alongside), calibration board
- **Skip-level** — collapsible org tree 2–3 levels deep, read-only person summaries, "Flag for follow-up"
- **CHRO** — completion rate + trust rate as headline KPIs, distribution, function/level heatmap, AI-surfaced themes, outlier flags

## Phase 1 — IC end-to-end

- **Home** — cycle progress + four cards keyed to each flow
- **Self-review** (Flow A) — sectioned form, 4-point behavior ratings, read-only goals from Talent Management, AI starter that drafts goal-status from your OKRs
- **Peer requester** (Flow B) — typeahead search over the org, shortlist chips, optional context note, send. Status board for sent invites
- **Inbox + peer review form** (Flow C) — incoming requests with the requester's note inline. Three-section peer template. Attributed default, anonymous toggle gated by cycle setting
- **Upward review** — same primitives, anonymous-by-default; identity banner surfaces *before* the form

## Phase 2 — Manager loop

- **My team** — list of directs with per-stage completion (self / peers / manager)
- **Direct-report review form** (Flow D) — manager template with behavior ratings, growth areas, overall rating, promotion-readiness. **AI peer-themes panel** alongside, summarising submitted peer reviews so the manager can read patterns while writing
- **Calibration board** — read-only side-by-side of ratings across the team. Sanity check before submitting

## Phase 3 — Leadership

- **Skip-level org tree** (Flow E) — collapsible tree of reports' directs. Click any person → read-only summary (overall rating, promo, peer themes). "Flag for follow-up" button pings the direct manager
- **CHRO dashboard** (Flow F) — completion rate + trust rate as headline numbers (per PRD), rating histogram, function × level heatmap, AI-surfaced themes, outlier flags with severity colors

## Locked decisions

All ten decisions from the [PRD's Requirements section](https://claude.ai/code/artifact/26728884-35ed-4ba0-8aaa-bda38bfe2339) are wired in:

- **Rating scale** — 4-point descriptive (Below · Meets · Exceeds · Far exceeds), stored 1–4
- **Peer feedback** — attributed by default, anonymous toggle per cycle setting
- **Upward feedback** — anonymous by default; identity surfaced before the form
- **Goals** — read-only pull from Talent Management
- **AI assist** — three placements only: self-review starter, manager peer-themes panel, CHRO themes/outliers
- **Calibration** — read-only side-by-side board, no multi-manager meeting flow
- **Skip-level** — read-only with Flag for follow-up
- **Peer-list governance** — manager-approval gate optional, off by default
- **CHRO headline metrics** — completion rate (now) + trust rate (% surviving calibration without rewrite)
- **Cycle cadence** — twice a year (current cycle = H1 2026, opened May 15, due Jul 15)

## Tech

Vite + React 19 + TypeScript. Real Octuple components for primitives. Hash routing (`#home`, `#my-team`, `#direct-review/<id>`, `#calibration`, `#org`, `#dashboard`) so the gallery's flow strip can deep-link any screen. State held in a single useReducer over the reviews list — edits and submissions persist for the session.
