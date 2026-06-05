# Screenshots for the Designer Workflow doc

Drop PNGs here at 1440×900 to populate the side-by-side screenshots
on /docs/workflow. The page checks for each file at build time — if
missing, it renders a labeled placeholder showing the expected filename.

## Captured (already here)

| Filename | Step in /docs/workflow |
|---|---|
| `step-02-install-claude-code.png` | One-time setup 2 — Install Claude Code |
| `step-03-install-nodejs.png` | One-time setup 3 — Install Node.js |
| `step-04-github-repo.png` | One-time setup 4 — Get added to the design-system repo |
| `step-day-01-clone-repo.png` | Day-to-day 1 — Open Claude Code and point it at the repo |
| `step-day-05-check-copy.png` | Day-to-day 4 — Check the copy |
| `step-day-05-check-a11y.png` | Day-to-day 5 — Check accessibility |
| `step-day-07-publish.png` | Day-to-day 6 — Publish |
| `step-13-design-in-gallery.png` | Day-to-day 7 — After the PR merges |

## Still pending (need to capture)

_None — every referenced slot has a real screenshot on disk._

## Steps that intentionally have no screenshot

These steps render text-only by design (no slot in the page):

- One-time setup 1 — Get added to the Eightfold GitHub org (just send an email)
- One-time setup 5 — The first time Claude talks to GitHub (OAuth prompt; no demo needed)
- Day-to-day 2 — Describe the design
- Day-to-day 3 — Iterate
- "Locally" (Browse the gallery offline)

## Capture conventions

- **Size**: 1440×900 (so they all share the same aspect ratio)
- **Format**: PNG, no shadow/border (the page wraps each one in a bordered figure)
- **Scope**: full browser/app window, no system chrome (Cmd+Shift+4+Space on Mac)
- **Privacy**: scrub any real customer names, employee names, or PII
