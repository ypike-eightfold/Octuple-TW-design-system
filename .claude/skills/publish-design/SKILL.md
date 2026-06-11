---
name: publish-design
description: >
  Publishes a finished design into the ef-design-system gallery via a pull request. Use this skill after a designer has built and reviewed a mock screen (with design-tw-ux-designer or design-og-ux-designer) and is ready to share it with the team.
  Creates the gallery file layout (index.html, meta.json, thumbnail.png) under web/public/content/designs/<category>/<slug>/, opens a feature branch, commits, pushes, and opens a PR using the design pull-request template.
  Trigger when the user says "publish this design", "submit my design", "open a PR for this design", "add this to the gallery", or "I want to share this with the team".
---

# Publish Design

> ## ⛔ Read before publishing
>
> For **live React prototypes** (anything built as a route under `web/app/(prototype)/...`), the gallery `index.html` is a small redirect to the live route — NOT a duplicated static HTML mock. Full conventions for scaffolding the prototype itself, including the dev FAB, localStorage persistence, glassmorphic sticky nav, and the dynamic navbar overflow pattern, live in [`../_shared/prototype-scaffolding.md`](../_shared/prototype-scaffolding.md). Read that before scaffolding any new prototype.
>
> The gallery detail page automatically provides: viewport switcher (Desktop / Tablet landscape 1024 / Tablet portrait 800 / Mobile 420), Take screenshot (PNG download via `html-to-image`), Full screen (browser Fullscreen API), and chrome-hiding on prototype routes. You do not — and must not — reimplement any of those at the prototype level.

Takes a finished design — built with either the Tailwind (`design-tw-*`) or OG Octuple (`design-og-*`) skill set — and lands it in the gallery via a pull request that other designers and engineers can review and merge. Once merged, the design appears at the gallery's category page.

The gallery is **PR-merge-driven**: designs only appear in the gallery after a PR merges into `main`. This skill never bypasses that. It assumes:

- `gh` CLI is installed and authenticated against the eightfold-ai GitHub org
- The working directory is a clone of `ypike-eightfold/Octuple-TW-design-system`
- The designer has write access to the repo (branch-on-main-repo workflow, not fork-and-PR)

If any of those are not met, the skill reports the missing prerequisite and stops.

---

## Inputs the skill collects

Before making any filesystem or git changes, ask the user for the following — one prompt with multiple questions via `AskUserQuestion`:

| Field | Type | Notes |
|---|---|---|
| `version` | choice | `tailwind` or `og`. This is the version of the design system the design was built against. Drives a `version` field in `meta.json` and a label on the PR. |
| `category` | choice | One of the 11 product categories. Slug values are listed below. |
| `slug` | text | The design's short URL-safe name. Lowercase, hyphen-separated, ≤ 40 chars. e.g. `manager-1on1-dashboard`. |
| `title` | text | Human title for the gallery card. e.g. "Manager 1:1 Dashboard". |
| `description` | text | 1–2 sentence summary for the gallery card. |
| `source_path` | path | The path on disk to the design's HTML or React route output. The skill copies this in. |
| `thumbnail_path` | path | The path on disk to a thumbnail image (PNG, ≥ 800×500). |

**Flows (MANDATORY for multi-screen prototypes):** before opening the PR, author `flow.json` + per-screen `flow/*.png` thumbnails in the design folder so the gallery's Prototype | Flows toggle shows the real screen map. Schema, capture steps, and self-checks: [`../_shared/prototype-scaffolding.md`](../_shared/prototype-scaffolding.md) § "Flows view". Single-screen designs skip this — the gallery synthesizes a one-node flow automatically.

### Allowed category slugs

```
talent-management
talent-acquisition
octuple
talent-forge
workforce-exchange
personal-career-site
resource-management
talent-flex
job-intelligence-engine
admin-console
analytics
other-example-screens
```

Reject any other category — the gallery's index only renders these.

---

## Procedure

Execute in this exact order. Stop and report on any failure; do not push half-baked branches.

### 1. Pre-flight

```bash
gh auth status          # must succeed
git status              # working tree must be clean (no uncommitted changes outside the design files)
git rev-parse --abbrev-ref HEAD   # must be on main or a fresh branch
```

If the working tree has unrelated dirty files, ask the user to stash or commit them first. Never run `git stash` or `git reset` unprompted.

### 2. Branch

```bash
git checkout main
git pull --ff-only origin main
git checkout -b design/<category>/<slug>
```

If a branch with that name already exists locally or remotely, append `-2`, `-3`, … until unique.

### 3. Scaffold gallery files

```
web/public/content/designs/<category>/<slug>/
  index.html           # iframe entry — static HTML mock OR redirect to a live React route
  meta.json            # see schema below
  thumbnail.png        # 1440×900 PNG, used only on the category grid card
```

There are two valid shapes for `index.html`:

**a) Static HTML mock** — a self-contained `.html` file. Use when the design is a snapshot, not a clickable prototype. Copy from `source_path`. Preserve relative asset paths if `source_path` is a directory.

**b) Redirect to a live React route** — use when the prototype is built under `web/app/(prototype)/<product>/`. The `index.html` is a 30-line file with `<meta http-equiv="refresh">` + a `window.location.replace()` fallback that retargets the iframe at the live route. See `careerhub-continuous-sync/index.html` for the canonical template, and `../_shared/prototype-scaffolding.md` § "The gallery contract" for the why.

For (b), the gallery automatically provides viewport switcher, Take screenshot, Full screen, and chrome-hiding on prototype routes — don't reimplement those at the prototype level.

### 3.5. Capture the thumbnail

```bash
# 1440×900 — same dimensions as the existing gallery thumbnails.
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,900 \
  --screenshot="<path>/thumbnail.png" \
  "http://localhost:3000/<live-route>"
```

For live React prototypes, point Chrome at the live `/<product>/<route>` URL (not the gallery `index.html`, since that's just a redirect page).

`meta.json` schema:

```json
{
  "title": "<title>",
  "description": "<description>",
  "category": "<category-slug>",
  "version": "tailwind" | "og",
  "slug": "<slug>",
  "author": "<git user.name from `git config user.name`>",
  "createdAt": "<ISO 8601 UTC, e.g. 2026-05-18T17:00:00Z>"
}
```

Write `meta.json` last so any partial copy can be detected.

### 3.6. Accessibility self-check (WCAG 2.2 AA)

Before committing, walk the design against the ten-category checklist in
`.github/PULL_REQUEST_TEMPLATE/design.md` § Accessibility — it mirrors the
Figma Include plugin checklist the design team uses, so Figma annotation
and PR review check the same boxes: landmarks, headings, reading & focus
order, alternative text, contrast, color, text resizing, responsive
reflow, touch target, complex gestures.

Two of them have one-click tooling in the gallery:

- **Responsive reflow** — open the design in the gallery and switch the
  viewport to "Responsive reflow" (320px). No horizontal scroll allowed.
- **Complex gestures** — if the prototype has any drag interaction,
  verify a click or keyboard alternative exists before publishing.

Tick the boxes honestly in the PR body. An unticked box with a one-line
reason ("needs browser verification at 200% zoom") is acceptable; a
silently ticked box that fails review is not.

### 4. Commit

```bash
git add web/public/content/designs/<category>/<slug>/
git commit -m "design(<category>): <title>"
```

The commit message MUST start with `design(<category>):` so the gallery's CI ingest job (a future addition) can detect design commits by message convention.

### 5. Push

```bash
git push -u origin design/<category>/<slug>
```

### 6. Open PR

```bash
gh pr create \
  --base main \
  --head design/<category>/<slug> \
  --title "design(<category>): <title>" \
  --template design.md \
  --body "$(generate body from inputs — see below)"
```

PR body (rendered into the design.md template's `## Summary` section):

```
**Category:** <category>
**Version:** <version>
**Slug:** <slug>

<description>

Built with: <design-tw-ux-designer | design-og-ux-designer>
Thumbnail: ![thumbnail](../../web/public/content/designs/<category>/<slug>/thumbnail.png)
```

### 7. Report

Print to the user:
- The PR URL (capture from `gh pr create` output)
- The path the design was written to
- Reminder that the design will appear in the gallery only after the PR is merged

Do **not** auto-merge. Reviewers approve and merge.

---

## Error handling

| Situation | Action |
|---|---|
| Working tree dirty (files outside the design) | Stop, list the files, ask the user to commit/stash. |
| Branch already exists remotely | Suffix `-2`, `-3`, … and try again. |
| `gh auth status` fails | Stop. Tell the user to run `gh auth login` and re-invoke. |
| `category` not in allow-list | Stop. List allowed categories. |
| `thumbnail_path` smaller than 800×500 | Warn but proceed. Note it in the PR body. |
| `source_path` doesn't exist | Stop. Re-ask for the path. |

Never use `--force` flags. Never amend commits on shared branches. Never delete branches that aren't yours.

---

## What this skill does NOT do

- It does not generate the design itself. That's `design-tw-ux-designer` or `design-og-ux-designer`.
- It does not generate the thumbnail. The designer captures it manually (screenshot of the rendered design).
- It does not modify the gallery's index, routing, or styling. The Next.js gallery app reads the filesystem at build time.
- It does not merge the PR. Reviewers do.
- It does not edit any file outside `web/public/content/designs/<category>/<slug>/` plus the resulting git/branch state.

---

## Related

- `design-tw-ux-designer` — builds tailwind-version designs
- `design-og-ux-designer` — builds OG Octuple designs
- `../_content/content-design-standards.md` — review copy against this before publishing
- `../_content/terms-list.md` — verify all terminology
- `.github/PULL_REQUEST_TEMPLATE/design.md` — the template this skill writes against
