/**
 * Search index types — shared between the build-time indexer and the
 * client-side cmdk modal. See docs/SEARCH-PLAN.md for the rationale.
 *
 * Every entry in the index is a SearchableItem. Each kind carries the
 * fields Fuse needs to match (title, description, category) plus an
 * href the modal navigates to on Enter.
 */

export type SearchKind =
  | "design"
  | "token-section"
  | "component"
  | "document"
  | "doc-heading"
  | "workflow-section";

interface BaseItem {
  /** Stable id — `${kind}:${slug}` — used as the React key and the
   *  recents-list lookup key. */
  id: string;
  kind: SearchKind;
  /** Display title shown as the row's primary line. */
  title: string;
  /** One-line snippet shown under the title. Often the category blurb
   *  or the first sentence of a description. */
  description: string;
  /** Destination route — passed straight to next/link. May include a
   *  hash for in-page sections. */
  href: string;
  /** Breadcrumb chip on the right of the row, e.g. "Gallery › Talent
   *  management" or "Octuple › Tokens". */
  breadcrumb: string;
}

export interface DesignItem extends BaseItem {
  kind: "design";
  category: string;
  author?: string;
}

export interface TokenSectionItem extends BaseItem {
  kind: "token-section";
  /** TOKEN_SECTIONS id — typography / spacing / corner-radius / colors / etc. */
  sectionId: string;
}

export interface ComponentItem extends BaseItem {
  kind: "component";
  /** Sidebar entry id — `ui-button`, `navbar`, `header`, etc. */
  pageId: string;
}

export interface DocumentItem extends BaseItem {
  kind: "document";
  /** DOCUMENT_PAGES id — `content-design-standards`, `terms-list`, etc. */
  pageId: string;
}

export interface DocHeadingItem extends BaseItem {
  kind: "doc-heading";
  pageId: string;
  /** Slugified heading anchor — appended to href as `#${anchor}`. */
  anchor: string;
  depth: 2 | 3;
}

export interface WorkflowSectionItem extends BaseItem {
  kind: "workflow-section";
  anchor: string;
}

export type SearchableItem =
  | DesignItem
  | TokenSectionItem
  | ComponentItem
  | DocumentItem
  | DocHeadingItem
  | WorkflowSectionItem;

/** Shape of the JSON file emitted by `web/scripts/build-search-index.ts`
 *  and consumed by the client modal via `fetch("/search-index.json")`. */
export interface SearchIndex {
  /** ISO timestamp of the last build — surfaced in a tooltip so we can
   *  spot stale indexes during local dev. */
  builtAt: string;
  items: SearchableItem[];
}

/** Fuse.js config — kept here so the indexer and the runtime agree on
 *  the same field weights. Numbers chosen for precision over recall
 *  (threshold 0.35) since the corpus is small and false positives are
 *  more annoying than misses. Tune in one place. */
export const FUSE_OPTIONS = {
  keys: [
    { name: "title", weight: 0.6 },
    { name: "description", weight: 0.3 },
    { name: "breadcrumb", weight: 0.1 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
} as const;
