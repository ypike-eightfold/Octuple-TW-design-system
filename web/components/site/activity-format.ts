import type { PillVariant } from "@tonyh-2-eightfold/ef-design-system";
import type { ActivityEntry, CommitType } from "@/lib/github-activity";

/* Shared presentation maps for the activity feeds — used by both the
 * home dashboard cards (home-page-view) and the "See all" panel
 * (activity-panel), so the two always agree on labels and colors. */

export const AREA_LABELS: Record<ActivityEntry["area"], string> = {
  octuple: "Octuple",
  gallery: "Gallery",
  docs: "Docs",
  skills: "Skills",
};

/** Pill color per activity area — cool for design, warm for docs, red
 *  for skills, so the feed scans by color. Each value is in the
 *  Octuple-supported set. */
export const AREA_PILL_VARIANT: Record<ActivityEntry["area"], PillVariant> = {
  octuple: "blueGreen",
  gallery: "blueGreen",
  docs: "orange",
  skills: "critical",
};

/** Pill color per conventional-commit type — green for new work, red
 *  for fixes, neutral for housekeeping. */
export const TYPE_PILL_VARIANT: Record<CommitType, PillVariant> = {
  feat: "blueGreen",
  fix: "critical",
  refactor: "orange",
  perf: "orange",
  chore: "neutral",
  docs: "neutral",
  style: "neutral",
  test: "neutral",
};

/* Date bucketing for the panel's timeline-style sections. Computed on
 * the client at render time from each entry's ISO date — the panel is
 * lazy-rendered after a fetch (never SSR'd), so there's no hydration
 * concern with reading "now" here. */
export type DateGroup = "Today" | "This week" | "This month" | "Earlier";

export const DATE_GROUP_ORDER: readonly DateGroup[] = [
  "Today",
  "This week",
  "This month",
  "Earlier",
];

export function dateGroupFor(iso: string, now: Date): DateGroup {
  const then = new Date(iso);
  const days = Math.floor((now.getTime() - then.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days < 7) return "This week";
  if (days < 30) return "This month";
  return "Earlier";
}
