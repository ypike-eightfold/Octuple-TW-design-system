"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { Command } from "cmdk";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearch } from "./search-provider";
import {
  FUSE_OPTIONS,
  type SearchIndex,
  type SearchableItem,
} from "@/lib/search/types";

const RECENTS_KEY = "ef-gallery:search-recents";
const MAX_RECENTS = 5;
const PER_GROUP = 8;

/** Section ordering + display labels. Anything not in this list falls
 *  through to "Other" at the bottom. */
const GROUPS: { id: string; label: string; matches: (k: SearchableItem["kind"]) => boolean }[] = [
  { id: "designs", label: "Designs", matches: (k) => k === "category" || k === "design" },
  { id: "octuple", label: "Octuple", matches: (k) => k === "component" || k === "token-section" },
  { id: "docs", label: "Docs", matches: (k) => k === "document" || k === "doc-heading" || k === "workflow-section" },
];

/** Tokenize the query into words >= 2 chars, lowercase, deduped. Used
 *  by the post-Fuse re-rank to demote items that don't cover all
 *  query tokens. */
function tokenize(q: string): string[] {
  const seen = new Set<string>();
  for (const tok of q.toLowerCase().split(/\s+/)) {
    if (tok.length >= 2) seen.add(tok);
  }
  return Array.from(seen);
}

/** Re-rank a Fuse result set so that items containing query tokens as
 *  case-insensitive substrings in their indexed fields outrank fuzzy
 *  partial matches. This is what makes "talent management" surface the
 *  Talent Management category instead of "Talent Agent · Slack", and
 *  what keeps "workflow" pointing at the workflow page instead of
 *  fuzz-bait like "Workforce categories".
 *
 *  Ranking criteria (each higher beats the next):
 *  1. coverage         — # of query tokens present in any indexed field
 *  2. category bonus   — category items first when a category name matches
 *  3. title + crumb hits — strong signals over description-only matches
 *  4. Fuse fuzzy score — last resort tiebreak
 */
function rerank(
  hits: { item: SearchableItem; score?: number }[],
  query: string,
): SearchableItem[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return hits.map((h) => h.item);
  type Scored = {
    item: SearchableItem;
    coverage: number;
    kindBonus: number;
    strongHits: number;
    fuse: number;
  };
  const scored: Scored[] = hits.map(({ item, score }) => {
    const title = item.title.toLowerCase();
    const crumb = item.breadcrumb.toLowerCase();
    const desc = item.description.toLowerCase();
    let coverage = 0;
    let titleHits = 0;
    let crumbHits = 0;
    for (const t of tokens) {
      const inTitle = title.includes(t);
      const inCrumb = crumb.includes(t);
      const inDesc = desc.includes(t);
      if (inTitle) titleHits++;
      if (inCrumb) crumbHits++;
      if (inTitle || inCrumb || inDesc) coverage++;
    }
    // Category items get a bonus when their title fully matches the query
    // — so "talent acquisition" lands the category above "Talent Agent ·
    // Inside Talent Acquisition" even though both contain both tokens.
    const kindBonus = item.kind === "category" && titleHits === tokens.length ? 1 : 0;
    return { item, coverage, kindBonus, strongHits: titleHits + crumbHits, fuse: score ?? 1 };
  });
  scored.sort((a, b) => {
    if (a.coverage !== b.coverage) return b.coverage - a.coverage;
    if (a.kindBonus !== b.kindBonus) return b.kindBonus - a.kindBonus;
    if (a.strongHits !== b.strongHits) return b.strongHits - a.strongHits;
    return a.fuse - b.fuse;
  });
  return scored.map((s) => s.item);
}

function loadRecents(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENTS) : [];
  } catch {
    return [];
  }
}

function saveRecent(id: string) {
  if (typeof window === "undefined") return;
  try {
    const current = loadRecents().filter((x) => x !== id);
    const next = [id, ...current].slice(0, MAX_RECENTS);
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    // ignore — recents are convenience, not correctness
  }
}

/** Global Cmd+K modal. Lazily fetches /api/search-index on first open
 *  so the JSON download isn't paid on every page load — the modal
 *  isn't useful until the user opens it anyway. */
export function SearchDialog() {
  const { open, setOpen } = useSearch();
  const router = useRouter();
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [query, setQuery] = useState("");
  const [recents, setRecents] = useState<string[]>([]);
  const fetchStarted = useRef(false);

  // Lazy-load the index the first time the modal opens, then keep it
  // in memory for the rest of the session. Re-opens are instant.
  useEffect(() => {
    if (!open || index || fetchStarted.current) return;
    fetchStarted.current = true;
    fetch("/api/search-index")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: SearchIndex | null) => {
        if (data) setIndex(data);
      })
      .catch(() => {
        // Network errors leave index null; the modal renders an inline
        // error in that case. Resetting the started flag means a retry
        // on the next open.
        fetchStarted.current = false;
      });
  }, [open, index]);

  useEffect(() => {
    if (open) setRecents(loadRecents());
  }, [open]);

  // Clear the query when the dialog closes so the next open starts blank.
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const fuse = useMemo(() => {
    if (!index) return null;
    return new Fuse(index.items, FUSE_OPTIONS);
  }, [index]);

  const results = useMemo<SearchableItem[]>(() => {
    if (!index) return [];
    const trimmed = query.trim();
    if (!trimmed) {
      // Empty query: show the user's recents (resolved from the index).
      const byId = new Map(index.items.map((i) => [i.id, i] as const));
      return recents.map((id) => byId.get(id)).filter(Boolean) as SearchableItem[];
    }
    if (!fuse) return [];
    return rerank(fuse.search(trimmed), trimmed);
  }, [index, fuse, query, recents]);

  function handlePick(item: SearchableItem) {
    saveRecent(item.id);
    setOpen(false);
    router.push(item.href);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search the site"
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh]"
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <Command
        label="Site search"
        shouldFilter={false}
        loop
        className="relative z-[101] w-full max-w-[640px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl"
      >
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-4">
          <span className="material-symbols-outlined text-[var(--muted-foreground)]" style={{ fontSize: 20 }} aria-hidden>
            search
          </span>
          <Command.Input
            autoFocus
            value={query}
            onValueChange={setQuery}
            placeholder="Search designs, components, docs…"
            className="h-12 w-full bg-transparent text-base text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
          />
          <kbd className="hidden sm:inline rounded border border-[var(--border)] bg-[var(--background)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--muted-foreground)]">
            esc
          </kbd>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          {!index && (
            <div className="px-3 py-6 text-sm text-[var(--muted-foreground)]">Loading…</div>
          )}

          {index && results.length === 0 && (
            <Command.Empty className="px-3 py-6 text-sm text-[var(--muted-foreground)]">
              {query.trim()
                ? `No matches for "${query.trim()}". Tabs above still work.`
                : "Try: tokens, table, mara"}
            </Command.Empty>
          )}

          {index && !query.trim() && recents.length > 0 && (
            <Command.Group
              heading="Recent"
              className="px-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[var(--muted-foreground)]"
            >
              {results.map((item) => (
                <ResultRow key={item.id} item={item} onPick={handlePick} />
              ))}
            </Command.Group>
          )}

          {index && query.trim() && (
            <GroupedResults items={results} onPick={handlePick} />
          )}
        </Command.List>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] px-4 py-2 text-[11px] text-[var(--muted-foreground)]">
          <div className="flex items-center gap-3">
            <span><kbd className="rounded border border-[var(--border)] px-1">↑</kbd> <kbd className="rounded border border-[var(--border)] px-1">↓</kbd> navigate</span>
            <span><kbd className="rounded border border-[var(--border)] px-1">↵</kbd> open</span>
            <span><kbd className="rounded border border-[var(--border)] px-1">esc</kbd> close</span>
          </div>
          {index && (
            <span title={`Index built ${index.builtAt}`}>{index.items.length} items</span>
          )}
        </div>
      </Command>
    </div>
  );
}

function GroupedResults({
  items,
  onPick,
}: {
  items: SearchableItem[];
  onPick: (item: SearchableItem) => void;
}) {
  // Bucket results into the configured groups, preserving Fuse's relevance
  // order within each bucket and capping at PER_GROUP to keep the modal
  // scannable. Order GROUPS by the position of each bucket's best-scoring
  // item — so "button" surfaces the Octuple group first (Button is rank 0)
  // while "mara" surfaces Designs first.
  const buckets = GROUPS.map((g) => {
    const bucket = items.filter((i) => g.matches(i.kind));
    const firstRank = bucket.length === 0 ? Infinity : items.indexOf(bucket[0]);
    return { group: g, items: bucket.slice(0, PER_GROUP), firstRank };
  })
    .filter((b) => b.items.length > 0)
    .sort((a, b) => a.firstRank - b.firstRank);

  if (buckets.length === 0) return null;
  return (
    <>
      {buckets.map((b) => (
        <Command.Group
          key={b.group.id}
          heading={b.group.label}
          className="mt-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[var(--muted-foreground)]"
        >
          {b.items.map((item) => (
            <ResultRow key={item.id} item={item} onPick={onPick} />
          ))}
        </Command.Group>
      ))}
    </>
  );
}

function ResultRow({
  item,
  onPick,
}: {
  item: SearchableItem;
  onPick: (item: SearchableItem) => void;
}) {
  return (
    <Command.Item
      value={`${item.title} ${item.breadcrumb} ${item.id}`}
      onSelect={() => onPick(item)}
      className="group flex cursor-pointer items-start justify-between gap-3 rounded-md px-2 py-2 text-sm aria-selected:bg-[var(--accent)] aria-selected:text-[var(--accent-foreground)]"
    >
      <Link
        href={item.href}
        onClick={(e) => {
          // cmdk handles Enter via onSelect; intercept the click so we
          // can save the recent entry AND fall through to the link's
          // own navigation. Right-/middle-click bypass this and open
          // in new tabs natively, which is what we want.
          if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
          e.preventDefault();
          onPick(item);
        }}
        className="min-w-0 flex-1"
      >
        <div className="truncate font-medium">{item.title}</div>
        {item.description && (
          <div className="mt-0.5 truncate text-xs text-[var(--muted-foreground)] group-aria-selected:text-[var(--accent-foreground)]/80">
            {item.description}
          </div>
        )}
      </Link>
      <span className="shrink-0 text-[11px] text-[var(--muted-foreground)] group-aria-selected:text-[var(--accent-foreground)]/80">
        {item.breadcrumb}
      </span>
    </Command.Item>
  );
}
