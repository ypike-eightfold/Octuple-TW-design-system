# gems/

This directory holds **AI configuration documents owned by Google Docs and synced into this repo** via Apps Script. They're not Claude Code skills — they're the source-of-truth instructions for internal Eightfold custom Gems (Google Gemini assistants), versioned here so the design system has a single canonical mirror.

## What's here

```
gems/
├── response-confidence-score.md   # Generic: scoring rubric for any Gem
├── guidance-layer.md              # Generic: guidance-layer guardrails
└── OH/                            # Gem-specific: the "OH" Gem
    ├── prompt-instructions.md     #   System prompt
    └── content-quality-framework.md  # Content rubric
```

Generic instructions that apply across Gems sit at `gems/` root. Gem-specific instructions live under `gems/<gem-name>/`. To add another Gem later, create a new subdirectory.

## How they sync

Each `.md` here is **auto-synced** from a Google Doc by an Apps Script bound to that doc. The doc owner clicks **Eightfold → Sync to repo** in the doc menu and the commit lands on `main`. See [`docs/CONTENT-SYNC.md`](../docs/CONTENT-SYNC.md) for the full setup, the doc-to-file map, and PAT rotation.

The YAML frontmatter in each file is preserved across syncs — only the body changes.

## Why Claude Code can reach these

Several Claude Code skills (`design-og-ux-designer`, `design-og-frontend-engineer`, `design-tw-ux-designer`, `design-tw-frontend-engineer`) reference these files in their Supporting Files tables. Designs Claude generates inside this repo follow the same content-quality and guidance rules the OH Gem uses, so output is consistent across both tools.

**Do not hand-edit these files** — edit the source Google Doc instead, then run Sync. Direct edits get overwritten on the next sync.
