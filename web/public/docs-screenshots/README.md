# Screenshots for the Designer Workflow doc

Drop PNGs here at 1440×900 to populate the side-by-side screenshots
on /docs/workflow. The page checks for each file at build time — if
missing, it renders a labeled placeholder showing the expected filename.

## Captured automatically (already here)

- `step-13-design-in-gallery.png` — gallery's product-grid (live site)
- `step-14-gallery-online.png` — same shot, used for the "Browse online" step
- `step-aux-components.png` — components catalog (not currently referenced)
- `step-aux-design-detail.png` — design detail view (not currently referenced)

## Still pending (need a designer to capture)

| Filename | What to show |
|---|---|
| `step-01-email-helpdesk.png` | An email composed to helpdesk@eightfold.ai asking for Eightfold GitHub org access |
| `step-02-install-claude-code.png` | The Claude Code download page at claude.com/claude-code |
| `step-03-install-nodejs.png` | The Node.js download page at nodejs.org with the LTS version highlighted |
| `step-04-github-repo.png` | The ypike-eightfold/Octuple-TW-design-system repository main page on GitHub |
| `step-05-gh-auth-login.png` | The GitHub OAuth authorization page that opens when Claude runs `gh auth login` |
| `step-day-01-clone-repo.png` | Claude Code conversation showing "Clone the ef-design-system repo to my Desktop" |
| `step-day-02-version-question.png` | Claude Code asking which design-system version (tw / og) |
| `step-day-03-design-prompt.png` | Claude Code producing a React mock from a design description |
| `step-day-04-iterate.png` | Claude Code accepting a change request and updating the design |
| `step-day-05-check-copy.png` | Claude scanning labels/copy against the terms list and reporting |
| `step-day-06-screenshot-tool.png` | macOS Cmd+Shift+4 selection screenshot |
| `step-day-07-publish.png` | Claude Code running publish-design (asking title, slug, opening PR) |
| `step-15-gallery-local.png` | The gallery running at http://localhost:3000 |

## Capture conventions

- **Size**: 1440×900 (so they all share the same aspect ratio)
- **Format**: PNG, no shadow/border (the page wraps each one in a bordered figure)
- **Scope**: full browser/app window, no system chrome (Cmd+Shift+4+space on Mac)
- **Privacy**: scrub any real customer names, employee names, or PII
