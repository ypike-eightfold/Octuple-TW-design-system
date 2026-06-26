"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Pill } from "@tonyh-2-eightfold/ef-design-system";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { ActivityEntry, ActivityArea, CommitType } from "@/lib/github-activity";
import {
  AREA_LABELS,
  AREA_PILL_VARIANT,
  TYPE_PILL_VARIANT,
  DATE_GROUP_ORDER,
  dateGroupFor,
} from "./activity-format";

/* "See all" slide-over for a home-dashboard activity feed. Opens a
 * right-side Sheet, lazy-fetches the deeper list (~50) from
 * /api/activity on first open, and offers search + filter chips +
 * date-grouped sections. Two instances exist: feed="octuple" (type
 * chips only) and feed="team" (area + type chips). */

type Feed = "octuple" | "team";

const TYPE_ORDER: CommitType[] = ["feat", "fix", "refactor", "perf", "chore", "docs", "style", "test"];
const AREA_ORDER: ActivityArea[] = ["gallery", "docs", "skills"];

export function ActivityPanel({ feed, title }: { feed: Feed; title: string }) {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<ActivityEntry[] | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [query, setQuery] = useState("");
  const [activeAreas, setActiveAreas] = useState<Set<ActivityArea>>(new Set());
  const [activeTypes, setActiveTypes] = useState<Set<CommitType>>(new Set());

  // Lazy-load once, the first time the panel opens.
  function onOpenChange(next: boolean) {
    setOpen(next);
    if (next && entries === null && status !== "loading") {
      setStatus("loading");
      fetch(`/api/activity?feed=${feed}`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((data: { entries: ActivityEntry[] }) => {
          setEntries(data.entries ?? []);
          setStatus("idle");
        })
        .catch(() => setStatus("error"));
    }
  }

  function toggle<T>(set: Set<T>, value: T): Set<T> {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  }

  // Which chips to show — only types/areas that actually appear in the data.
  const presentTypes = useMemo(() => {
    const seen = new Set((entries ?? []).map((e) => e.type).filter(Boolean) as CommitType[]);
    return TYPE_ORDER.filter((t) => seen.has(t));
  }, [entries]);
  const presentAreas = useMemo(() => {
    const seen = new Set((entries ?? []).map((e) => e.area));
    return AREA_ORDER.filter((a) => seen.has(a));
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (entries ?? []).filter((e) => {
      if (activeAreas.size && !activeAreas.has(e.area)) return false;
      if (activeTypes.size && !(e.type && activeTypes.has(e.type))) return false;
      if (q && !(`${e.rawHeadline} ${e.author}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [entries, query, activeAreas, activeTypes]);

  // Group the filtered list into date buckets, preserving newest-first order.
  const grouped = useMemo(() => {
    const now = new Date();
    const buckets = new Map<string, ActivityEntry[]>();
    for (const e of filtered) {
      const g = e.date ? dateGroupFor(e.date, now) : "Earlier";
      const list = buckets.get(g) ?? [];
      list.push(e);
      buckets.set(g, list);
    }
    return DATE_GROUP_ORDER.map((g) => [g, buckets.get(g) ?? []] as const).filter(
      ([, list]) => list.length > 0,
    );
  }, [filtered]);

  const authorCount = useMemo(
    () => new Set((entries ?? []).map((e) => e.author)).size,
    [entries],
  );

  const showAreaChips = feed === "team" && presentAreas.length > 1;
  const showTypeChips = presentTypes.length > 1;
  const hasFilters = activeAreas.size > 0 || activeTypes.size > 0 || query.trim().length > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]">
        See all
        <ArrowRight aria-hidden className="h-4 w-4" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full gap-0 p-0 data-[side=right]:sm:max-w-xl"
      >
        <SheetHeader className="border-b border-[var(--border)]">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            {entries === null
              ? "Loading recent activity…"
              : entries.length === 0
                ? "No activity to show right now."
                : `${entries.length} change${entries.length === 1 ? "" : "s"} from ${authorCount} ${authorCount === 1 ? "person" : "people"}, newest first.`}
          </SheetDescription>
        </SheetHeader>

        {/* Controls: search + filter chips. Hidden until data is loaded. */}
        {entries && entries.length > 0 && (
          <div className="space-y-3 border-b border-[var(--border)] p-6 pt-4">
            <div className="relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search message or author"
                aria-label="Search activity"
                className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 text-sm outline-none focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]/40"
              />
            </div>

            {(showAreaChips || showTypeChips) && (
              <div className="flex flex-wrap items-center gap-1.5">
                {showAreaChips &&
                  presentAreas.map((a) => {
                    const on = activeAreas.has(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setActiveAreas((s) => toggle(s, a))}
                        className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                      >
                        <Pill variant={on ? AREA_PILL_VARIANT[a] : "empty"} size="small">
                          {AREA_LABELS[a]}
                        </Pill>
                      </button>
                    );
                  })}
                {showAreaChips && showTypeChips && (
                  <span className="mx-0.5 h-4 w-px bg-[var(--border)]" aria-hidden />
                )}
                {showTypeChips &&
                  presentTypes.map((t) => {
                    const on = activeTypes.has(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setActiveTypes((s) => toggle(s, t))}
                        className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                      >
                        <Pill variant={on ? TYPE_PILL_VARIANT[t] : "empty"} size="small">
                          {t}
                        </Pill>
                      </button>
                    );
                  })}
                {hasFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAreas(new Set());
                      setActiveTypes(new Set());
                      setQuery("");
                    }}
                    className="ml-1 text-xs font-medium text-[var(--muted-foreground)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Scrollable, date-grouped list */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-4">
          {status === "loading" && (
            <p className="text-sm text-[var(--muted-foreground)]">Loading…</p>
          )}
          {status === "error" && (
            <p className="text-sm text-[var(--muted-foreground)]">
              Couldn&apos;t load activity. The GitHub API may be rate-limited — try again shortly.
            </p>
          )}
          {status === "idle" && entries && filtered.length === 0 && (
            <p className="text-sm text-[var(--muted-foreground)]">
              {hasFilters ? "No changes match these filters." : "Nothing to show."}
            </p>
          )}
          {status === "idle" &&
            grouped.map(([group, list]) => (
              <section key={group} className="mb-6 last:mb-0">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  {group}
                </h3>
                <ul className="divide-y divide-[var(--border)]">
                  {list.map((e) => (
                    <li key={e.sha} className="flex items-start gap-3 py-3 first:pt-0">
                      <div className="shrink-0 pt-0.5">
                        <Pill variant={AREA_PILL_VARIANT[e.area]} size="small">
                          {AREA_LABELS[e.area]}
                        </Pill>
                      </div>
                      <div className="min-w-0 flex-1">
                        {(e.type || e.scope) && (
                          <div className="mb-1 flex flex-wrap items-center gap-1.5">
                            {e.type && (
                              <Pill variant={TYPE_PILL_VARIANT[e.type]} size="small">
                                {e.type}
                              </Pill>
                            )}
                            {e.scope && (
                              <Pill variant="empty" size="small">
                                {e.scope}
                              </Pill>
                            )}
                          </div>
                        )}
                        <a
                          href={e.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={e.rawHeadline}
                          className="block text-sm font-medium hover:text-[var(--primary)] hover:underline"
                        >
                          {e.headline}
                        </a>
                        <div className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                          {e.author} · <time dateTime={e.date}>{e.dateLabel}</time>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
