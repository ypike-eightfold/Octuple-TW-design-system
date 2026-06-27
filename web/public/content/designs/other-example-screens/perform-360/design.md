# Perform 360

Performance review app spanning every level of the org — IC, manager, manager-of-managers, and CHRO.

## What's shipped — Phase 1 (IC end-to-end)

A single user — Yair, an IC — walks through every interaction the cycle asks of them:

- **Home** — cycle progress + four cards keyed to each flow.
- **Self-review form** (Flow A) — sectioned form covering accomplishments, goal status (with read-only goals pulled from Talent Management), behaviors (4-point rating per behavior, per question #2 in the plan), and growth areas. AI starter button drafts from goals.
- **Peer requester** (Flow B) — search the org by name / title / team, shortlist colleagues, send invites with an optional context note. Status board tracks who's responded.
- **Inbox + peer review form** (Flow C) — colleagues asking for your feedback. Three-section peer review template with an anonymous-vs-attributed toggle the cycle setting unlocks.
- **Upward review** — same primitives as peer review, framed for your manager. Anonymous-by-default for this cycle (visibility surfaced *before* the form so you know how the submission reads).

## Picked the persona

A "Demo as" switcher in the top-right swaps between IC, Manager, Skip-level, and CHRO. Phase 1 only ships the IC screens — the other personas land on a "Coming up next" card that explains which phase covers them.

## Open questions, locked

- Anonymous peer feedback: **attributed by default, anonymous toggle per cycle** (peer reviews). Upward reviews default *to anonymous*.
- Rating scale: **4-point descriptive** (Below · Meets · Exceeds · Far exceeds), stored 1–4.
- Cycle cadence: **twice a year**; current cycle = H1 2026, opened 15 May, due 15 Jul.
- AI assist: opt-in starter from goals (in the self-review). Peer-theme summaries land in Phase 2.

## What's next

- **Phase 2** — Manager loop. My team list, direct-report review form (the old prototype's single screen, now part of the app), calibration board, peer-themes panel.
- **Phase 3** — Skip-level org browse and the CHRO dashboard.

## Tech

Vite + React 19 + TypeScript. Real Octuple components for the design-system primitives. Hash-based routing (`#home`, `#self-review`, `#peer-review/<id>`, etc.) so the gallery's flow strip can deep-link any screen. State held in a single useReducer over the reviews list — edits and submissions persist for the session.
