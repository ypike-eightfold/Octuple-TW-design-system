# Content sync — Google Docs → skill files

Some of the Markdown files under `.claude/skills/_content/` (plus the `gems/` tree) are **owned by Google Docs**, not by this repo. They sync into the repo via a small Google Apps Script bound to each doc. When a doc owner clicks **Eightfold → Sync to repo** in the doc's menu bar, the doc is exported as Markdown and committed to `main`.

This file documents:

- Which files in this repo are auto-synced from a doc
- How to set up the sync for a new doc
- Whether the Apps Script writes to **upstream** or to a **fork** (and how the two repos stay in parity)
- How to rotate the GitHub tokens
- What to do when an `.md` and a doc drift apart

> **Where the sync actually runs:** Google Apps Script, bound to each doc, writes to a target repo via the GitHub Contents API. Two complementary GitHub Actions (`sync-from-upstream.yml` and `mirror-fork-to-upstream.yml`) keep the upstream and the fork at parity, regardless of which one the Apps Script chooses to write to.

---

## Doc → file map

| # | Google Doc (canonical source) | Target file in this repo | `COMMIT_PREFIX` |
|---|---|---|---|
| 1 | Content Design Standards | `.claude/skills/_content/content-design-standards.md` | `content: sync "Content Design Standards"` |
| 2 | Terms list | `.claude/skills/_content/terms-list.md` | `content: sync "Terms List"` |
| 3 | response_confidence_score instructions for custom Gem | `gems/response-confidence-score.md` | `gems: sync "Response Confidence Score"` |
| 4 | Guidance layer instructions | `gems/guidance-layer.md` | `gems: sync "Guidance Layer"` |
| 5 | Gem OH prompt instructions | `gems/OH/prompt-instructions.md` | `gems(OH): sync "Prompt Instructions"` |
| 6 | Content quality framework for Gem OH | `gems/OH/content-quality-framework.md` | `gems(OH): sync "Content Quality Framework"` |

Docs 1+2 are shared content read by every design skill. Docs 3+4 are generic Gem instructions (used by any custom Gem). Docs 5+6 are specific to the OH Gem. When you add a new synced doc, update this table.

> **Canonical doc IDs (record them when you know them).** Nothing in the *mechanism* pins a doc by ID — the Apps Script is bound to whatever doc it lives in (see "Swapping the source doc"). But recording the canonical ID here prevents binding the script to the wrong doc:
>
> | File | Canonical Google Doc ID |
> |---|---|
> | `content-design-standards.md` | `1iH3BWI1ocmjB269ahoelXilebuvJGX4BkuDutba8plE` — the doc `terms-list.md` cross-links to throughout |
>
> A retired earlier draft (`1WcFOgOOLiB7caOExcA8I_k6dCe-9uamzTaNAiA4gvI0`) was the original sync source for content design standards. If its Apps Script still has a trigger, remove it (see "Swapping the source doc") so it can't overwrite the file with stale content.

> **Heads up on docs 3–6:** the placeholder files exist with the right frontmatter + AUTO-SYNCED banner. The first run of each doc's Apps Script will replace the "Awaiting first sync" body with the actual content. See [`gems/README.md`](../gems/README.md) for the gem-tree layout.

---

## Direction of truth

- The **doc is canonical.** Edit there.
- The **`.md` file is a generated mirror.** Direct edits will be **overwritten on the next sync.**
- Both files in `.claude/skills/_content/` carry a `<!-- AUTO-SYNCED FROM A GOOGLE DOC -->` banner near the top to remind editors.
- If you absolutely need to hand-edit an `.md` (e.g. emergency fix while a doc owner is OOO), edit the **doc** to match afterwards, or the next sync will revert you.

---

## Where the Apps Script writes

There are two coherent setups. Pattern C is what this repo uses.

### Pattern C — Apps Script writes to fork. Upstream is infrastructure-only. (Recommended)

```
Tony's upstream ──▶ Your fork  (sync-from-upstream every 15 min — code, skills, workflows)
                        ▲
                        │  Apps Script writes here (content updates)
                        │
                   Vercel deploys from here
```

- `TARGET_REPO` in each Apps Script = the **fork** (e.g. `ypike-eightfold/Octuple-TW-design-system`).
- One GitHub PAT only: `GITHUB_PAT` in each Apps Script's properties, fine-grained, scoped to the **fork**, contents: read-write. Generated under your own account.
- `sync-from-upstream.yml` still runs on the fork — pulls infrastructure changes (skills, workflows, gallery code) downward from upstream when Tony pushes them.
- Content updates **don't flow back to upstream.** That's by design: upstream is the framework, your fork is where the live content lives, and your designers + your Vercel deploy from the fork. Nobody reads content from upstream.
- Zero coordination with upstream owner needed. No second PAT, no second action.

### Pattern A — Apps Script writes to upstream

Use this if you want upstream to be canonical for both code AND content.

```
Google Doc ──▶ Apps Script ──▶ upstream
                                  │
                                  ▼ sync-from-upstream.yml
                              your fork
                                  │
                                  ▼
                               Vercel
```

- `TARGET_REPO` = upstream.
- One PAT, but it needs write access to upstream. **Requires the PAT to be generated by someone who can own the resource** — i.e. fine-grained PATs can only be created when the resource owner is your own account or an org you belong to. If upstream is owned by another personal GitHub user, you'd need either a classic PAT (broader scope) or for the upstream owner to generate the PAT for you.

### What about a fork-to-upstream mirror?

A bidirectional setup (Apps Script writes to fork, an Action mirrors back to upstream) was considered. It only works if you can generate a fine-grained PAT scoped to the upstream repo from your own account. When the upstream is owned by another personal user, you can't — fine-grained PATs require the resource owner to be your account or an org you belong to. **For that case, Pattern C is the right answer.**

---

## What syncs and what doesn't

The Apps Script exports the doc as **Markdown** using Google Drive's native `text/markdown` export. That means:

| Sync handles cleanly | Sync handles poorly |
|---|---|
| Headings (H1–H6) | Comments and suggested edits (stripped — only accepted text is exported) |
| Paragraphs, bold, italic, code formatting | Embedded images (not pulled — paths break) |
| Bulleted + numbered lists (nested too) | Complex multi-column layouts |
| Hyperlinks | Drawings and embedded diagrams |
| Simple tables | Tables with merged cells (formatting may flatten) |
| Footnotes | Page breaks, headers / footers |

If a doc relies heavily on the "poorly handled" column, the synced `.md` will need a cleanup pass after the first sync. That's a one-time cost — the cleanup goes back into the doc as a structural improvement so future syncs come out clean.

---

## Swapping the source doc (re-pointing a file at a different doc)

Use this when a file should start syncing from a **different** Google Doc — e.g. the original doc was a stale draft and the canonical doc is somewhere else.

The thing to internalize: **the repo never names the source doc by ID.** The Apps Script is *bound to the doc* and exports whatever doc it lives in (`DocumentApp.getActiveDocument()`). The repo file only records the source URL in its `AUTO-SYNCED` banner, and that line is regenerated on every sync. So there is **no repo edit** that re-points a file — the swap happens entirely on the Google side, and the file self-heals (content **and** banner URL) the first time the new doc syncs.

1. **Set up the sync on the new doc** — follow "Setting up the sync for a new doc" below, using the **same `TARGET_PATH`** as the file you're re-pointing (the PAT already exists — reuse it, don't make a new one).
2. **Run `syncToRepo` once from the new doc.** The repo file's body and its banner `Source:` URL now point at the new doc. Confirm the commit landed.
3. **Decommission the old doc's sync — this is the step that actually stops the swap from being undone.** Because both docs push to the same `TARGET_PATH`, *the last sync wins*; an old doc left running will clobber the new content on its next trigger.
   - Open the **old** doc → Extensions → Apps Script → **Triggers** (clock icon) → delete every `syncToRepo` trigger.
   - Then, to be foolproof, delete the bound script project too (Apps Script editor → Project Settings → or just remove the `onOpen`/`syncToRepo` code) so nobody can click **Eightfold → Sync to repo** on the old doc by accident.

> If you skip step 3 and the old doc has a time-based trigger, the file will silently revert to stale content on the old doc's schedule — the single most confusing failure mode here.

---

## Setting up the sync for a new doc

> Time: ~15 minutes the first time, ~3 minutes per additional doc.

### 1. Generate a GitHub token (one token covers all docs)

If the org already has a token (`apps-script-content-sync`), skip to step 2.

1. GitHub → **Settings (avatar) → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. **Name:** `apps-script-content-sync`
3. **Expiration:** 1 year. Set a calendar reminder to rotate.
4. **Resource owner:** your GitHub account (`ypike-eightfold`) — the account that owns the fork the script writes to.
5. **Repository access:** *Only select repositories* → `Octuple-TW-design-system`.
6. **Repository permissions** → **Contents** → **Read and write**. (That's the only permission needed. Leave everything else at "No access.")
7. **Generate token.** Copy the token string somewhere safe — you'll need to paste it once per doc in step 4.

### 2. Open the doc → Extensions → Apps Script

A new tab opens with the Apps Script editor.

### 3. Replace `Code.gs` with this script

```javascript
// ─── Per-doc config — CHANGE THESE TWO LINES ─────────────────
const TARGET_PATH   = '.claude/skills/_content/your-target-file.md';
const COMMIT_PREFIX = 'content: sync "Doc Name Here"';
// ─────────────────────────────────────────────────────────────

// Pattern C (recommended): set this to your fork. Apps Script writes
// to the fork, upstream is for infrastructure flow only (downward via
// sync-from-upstream.yml). See "Where the Apps Script writes" above.
const TARGET_REPO   = 'ypike-eightfold/Octuple-TW-design-system';
const TARGET_BRANCH = 'main';

function getPat_() {
  const pat = PropertiesService.getScriptProperties().getProperty('GITHUB_PAT');
  if (!pat) throw new Error('Set GITHUB_PAT in Project Settings → Script properties.');
  return pat;
}

function exportAsMarkdown_() {
  const docId = DocumentApp.getActiveDocument().getId();
  const url = 'https://www.googleapis.com/drive/v3/files/' + docId +
              '/export?mimeType=text/markdown';
  const res = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Markdown export failed: ' + res.getContentText());
  }
  return res.getContentText();
}

function fetchExisting_() {
  const url = 'https://api.github.com/repos/' + TARGET_REPO +
              '/contents/' + TARGET_PATH + '?ref=' + TARGET_BRANCH;
  const res = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: 'token ' + getPat_(),
      Accept: 'application/vnd.github+json',
    },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() === 404) return null;
  if (res.getResponseCode() !== 200) {
    throw new Error('GET failed: ' + res.getContentText());
  }
  const json = JSON.parse(res.getContentText());
  const content = Utilities.newBlob(
    Utilities.base64Decode(json.content)
  ).getDataAsString();
  return { content: content, sha: json.sha };
}

/** Pulls the YAML frontmatter (--- ... ---) from the existing file
    so we can keep it intact on every sync. The doc itself shouldn't
    contain the frontmatter; it lives only in the repo file. */
function extractFrontmatter_(existingContent) {
  if (!existingContent) return '';
  const m = existingContent.match(/^---\n[\s\S]*?\n---\n/);
  return m ? m[0] + '\n' : '';
}

function pushToGitHub_(markdown) {
  const existing = fetchExisting_();
  const frontmatter = extractFrontmatter_(existing && existing.content);

  const doc = DocumentApp.getActiveDocument();
  const banner =
    '<!--\n' +
    '  AUTO-SYNCED FROM A GOOGLE DOC — DO NOT EDIT THIS FILE DIRECTLY.\n' +
    '  Source: ' + doc.getUrl() + '\n' +
    '  Last sync: ' + new Date().toISOString() + '\n' +
    '-->\n\n';

  const fullContent = frontmatter + banner + markdown;

  const body = {
    message: COMMIT_PREFIX + ' (' + new Date().toISOString().slice(0, 10) + ')',
    content: Utilities.base64Encode(fullContent, Utilities.Charset.UTF_8),
    branch: TARGET_BRANCH,
  };
  if (existing) body.sha = existing.sha;

  const url = 'https://api.github.com/repos/' + TARGET_REPO +
              '/contents/' + TARGET_PATH;
  const res = UrlFetchApp.fetch(url, {
    method: 'put',
    headers: {
      Authorization: 'token ' + getPat_(),
      Accept: 'application/vnd.github+json',
    },
    contentType: 'application/json',
    payload: JSON.stringify(body),
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() >= 300) {
    throw new Error('PUT failed: ' + res.getContentText());
  }
  return JSON.parse(res.getContentText());
}

function syncToRepo() {
  const ui = DocumentApp.getUi();
  try {
    const md = exportAsMarkdown_();
    const result = pushToGitHub_(md);
    ui.alert(
      'Synced',
      'Committed to ' + TARGET_REPO + '@' + TARGET_BRANCH + ':' + TARGET_PATH +
      '\n\n' + result.commit.html_url,
      ui.ButtonSet.OK
    );
  } catch (e) {
    ui.alert('Sync failed', String(e), ui.ButtonSet.OK);
  }
}

function onOpen() {
  DocumentApp.getUi()
    .createMenu('Eightfold')
    .addItem('Sync to repo', 'syncToRepo')
    .addToUi();
}
```

### 4. Change the two config lines at the top

- `TARGET_PATH` — the exact repo path this doc should publish to (see the doc → file map above).
- `COMMIT_PREFIX` — what shows up in `git log`. Keep it short.

### 4.5. Declare the OAuth scopes in the manifest (`appsscript.json`)

**Don't skip this — it's the step that bites on the first run.** `exportAsMarkdown_` calls the Drive REST export endpoint with `ScriptApp.getOAuthToken()`. That token only carries a Drive permission if a Drive scope is declared in the project manifest. Apps Script auto-detects scopes for recognized calls (`DocumentApp`, `UrlFetchApp`, the menu UI), but it does **not** infer a Drive scope from a raw `UrlFetchApp` call to `googleapis.com` — so without this, the first run fails with a 403 on export. (This was the original "why won't it sync" issue.)

1. **Project Settings** (gear icon) → tick **"Show 'appsscript.json' manifest file in the editor."**
2. Open `appsscript.json` and set its `oauthScopes`:

```json
{
  "timeZone": "America/Los_Angeles",
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/documents.currentonly",
    "https://www.googleapis.com/auth/script.container.ui",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/drive.readonly"
  ]
}
```

Declaring `oauthScopes` **replaces** auto-detection, so all four must be present: documents (read the bound doc), container UI (the Eightfold menu + alerts), external request (`UrlFetchApp` → GitHub + Drive), and Drive (the markdown export). `drive.readonly` is enough — export is a read; the broader `.../auth/drive` scope also works.

You do **not** need to enable the Drive **advanced service** (Services → Drive). That's only required when code calls `Drive.Files.export(...)` directly; this script uses the REST endpoint via `UrlFetchApp`, so the scope above is all it needs.

> **Copying a working doc's setup?** Fastest path: open a working doc's Apps Script, reveal its `appsscript.json`, and paste it verbatim into the new doc. The manifest is part of "the same things" — `Code.gs` alone isn't enough.

### 5. Store the GitHub token in Script properties

The token never goes in the code. Apps Script encrypts script properties at rest.

1. In the Apps Script editor: **Project Settings** (gear icon in the left sidebar).
2. Scroll to **Script properties → Add script property**.
3. Property: `GITHUB_PAT`. Value: the token from step 1.
4. **Save script properties.**

### 6. Save the project and authorize

1. Save (`Cmd+S`). Name the project, e.g. *"Sync to ef-design-system"*.
2. In the function dropdown at the top of the editor, select `syncToRepo` → click **Run**.
3. First run only: Google asks for permissions — Docs read, Drive export, External URL fetch. Approve.
4. The function runs. You'll see a "Synced" alert with a link to the GitHub commit, or an error you can read.

### 7. Reload the doc to pick up the menu

Close + reopen the doc. A new **Eightfold** menu appears next to **Help**. The **Sync to repo** option is what doc owners click going forward.

### 8. Update the doc → file map in this file

Add the new doc to the table at the top.

### 9. (Optional) Add a time-based trigger

If you'd rather not rely on doc owners remembering to click Sync:

1. Apps Script editor → **Triggers** (clock icon).
2. **Add Trigger.** Function: `syncToRepo`. Event source: **Time-driven** → **Hour timer** → every 6 hours (or whatever cadence).
3. Save.

The sync becomes a no-op when nothing changed (same content → same SHA → GitHub accepts but doesn't show a change). Safe to run on a clock.

---

## Rotating the GitHub token

The fine-grained PAT expires in 1 year. Calendar a reminder for ~11 months out.

1. Generate a new token following step 1 above.
2. For each doc's Apps Script project: **Project Settings → Script properties → edit `GITHUB_PAT` → paste the new token → Save.**
3. Test by running `syncToRepo` on one doc — verify the commit lands.
4. **Revoke the old token** in GitHub → Settings → Developer settings → Personal access tokens.

You don't need to touch the script code or re-authorize Google permissions — only the script property changes.

---

## When `.md` and doc drift

Direct edits to an auto-synced `.md` get wiped on the next sync. If a designer commits a hot fix and you want to keep it:

1. Copy the fix from the `.md` into the Google Doc.
2. Run **Eightfold → Sync to repo** on the doc.
3. The repo file now reflects the doc, which now reflects the fix.

If a doc and an `.md` disagree and you're not sure which is right, **trust the doc** — and update the `.md` by running Sync.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Apps Script alert: *"Set GITHUB_PAT in Project Settings → Script properties"* | Script property not set | Step 5 above |
| Apps Script alert: *"Markdown export failed: 403"* | Doc not accessible to the script's Google identity | Ensure the script is owned by an account that has Edit access to the doc |
| Apps Script alert: *"PUT failed: 401"* | Token wrong or expired | Rotate the token |
| Apps Script alert: *"PUT failed: 422"* | Stale SHA — the file was edited between read and write | Run Sync again; it'll fetch the latest SHA |
| Doc was edited but file in repo didn't update | Doc owner didn't click Sync | Click **Eightfold → Sync to repo** in the doc, or set up the hourly trigger |
| File frontmatter (`name:`, `description:`) disappeared | The frontmatter-preservation block in the script was modified or removed | Restore the `extractFrontmatter_` function from the script template above |
