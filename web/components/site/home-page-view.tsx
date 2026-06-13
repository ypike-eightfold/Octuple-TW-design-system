"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@tonyh-2-eightfold/ef-design-system";
import { useHero } from "@/components/site/hero-provider";
import type { ActivityEntry } from "@/lib/github-activity";

export interface LatestDesign {
  title: string;
  href: string;
  thumbnailUrl: string;
  categoryName: string;
}

interface Props {
  totalDesigns: number;
  categoryCount: number;
  latestDesigns: LatestDesign[];
  octupleUpdates: ActivityEntry[];
  teamActivity: ActivityEntry[];
}

const AREA_LABELS: Record<ActivityEntry["area"], string> = {
  octuple: "Octuple",
  gallery: "Gallery",
  docs: "Docs",
  skills: "Skills",
};

export function HomePageView({
  totalDesigns,
  categoryCount,
  latestDesigns,
  octupleUpdates,
  teamActivity,
}: Props) {
  // Hero illustration is user-selectable from the top nav. The provider
  // hands us back the active hero record; we pick the light or dark src
  // based on the resolved theme. resolvedTheme can be undefined on first
  // render — fall back to the light variant.
  const { hero } = useHero();
  const { resolvedTheme } = useTheme();
  const heroSrc = resolvedTheme === "dark" ? hero.src.dark : hero.src.light;

  return (
    <div>
      {/* SLIM HERO ---------------------------------------------------------
          The illustration sits BEHIND the sticky top nav; its backdrop-blur
          turns the top edge into a frosted glass band. Kept short — the
          page is a dashboard now, and the feeds below are the point. */}
      <section className="relative -mt-16">
        {/* Hero illustration as an <img> rather than a CSS background.
            CSS background-image is always clipped to its element's box
            (there's no overflow:visible equivalent), which kept cutting
            the bottom of the SVG. An <img> with absolute positioning
            renders at its full natural aspect at any width and is free
            to extend beyond the section — pointer-events:none so it
            doesn't block clicks on content layered above it. */}
        <img
          src={heroSrc}
          alt=""
          aria-hidden
          className="absolute top-0 left-0 w-full -z-10 pointer-events-none select-none opacity-80"
        />
        {/* Same wrapper pattern as PageHero on /gallery, /docs/workflow:
            max-w-6xl + px-6 + max-w-3xl inner, so the title block
            starts at the same x-coordinate across every top-level
            surface. Was previously `<div px-6><div max-w-6xl>` which
            put the title block 24px further left than the section
            pages — visible misalignment between Home and the rest. */}
        <div className="mx-auto max-w-6xl px-6 pt-28 pb-14">
          <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)]">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16 }}
                  aria-hidden
                >
                  auto_awesome
                </span>
                For everyone designing for Eightfold AI
              </div>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
                Design at Eightfold&nbsp;AI
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--foreground)]">
                The design system, the approved designs, and what the team shipped
                lately &mdash; {totalDesigns} {totalDesigns === 1 ? "design" : "designs"} across{" "}
                {categoryCount} product areas and counting.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/components">
                    <span>Explore the components</span>
                    <ArrowRight aria-hidden className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                {/* Glassmorphic secondary CTAs — translucent + backdrop
                    blur so they stay legible against any hero artwork.
                    Plain anchors so we don't fight Octuple's btn--outline. */}
                <Link
                  href="/gallery"
                  className="inline-flex h-11 items-center rounded-full border border-white/50 bg-white/40 px-5 text-base font-semibold text-[var(--foreground)] backdrop-blur-md transition hover:bg-white/60 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/15"
                >
                  Browse the gallery
                </Link>
                <Link
                  href="/docs/workflow"
                  className="inline-flex h-11 items-center rounded-full border border-white/50 bg-white/40 px-5 text-base font-semibold text-[var(--foreground)] backdrop-blur-md transition hover:bg-white/60 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/15"
                >
                  How to use
                </Link>
              </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        {/* Latest designs — fed by the same filesystem index as the stats,
            so every merged design PR updates this strip with no manual
            upkeep. Hidden entirely while the gallery is empty. */}
        {latestDesigns.length > 0 && (
          <section className="mt-8">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">New in the gallery</h2>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline"
              >
                View all designs
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latestDesigns.map((d) => (
                <li key={d.href}>
                  <Link
                    href={d.href}
                    className="group block overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition hover:border-[var(--primary)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                  >
                    {/* Decorative: the title below names the design. */}
                    <img
                      src={d.thumbnailUrl}
                      alt=""
                      loading="lazy"
                      className="block aspect-[16/10] w-full border-b border-[var(--border)] object-cover object-top"
                    />
                    <div className="p-4">
                      <div className="truncate font-medium group-hover:text-[var(--primary)]">
                        {d.title}
                      </div>
                      <div className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                        {d.categoryName}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Activity feeds — commit history via the GitHub API, refreshed
            every few minutes. Both modules render an honest empty state
            when the API is unreachable rather than disappearing. */}
        <section className="mt-14 mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ActivityCard
            title="What's new in Octuple"
            subtitle="Recent changes to the component library."
            entries={octupleUpdates}
            footerHref="/components"
            footerLabel="Open the component catalog"
            showArea={false}
          />
          <ActivityCard
            title="Recent team activity"
            subtitle="Designs, docs, and skills — everyone's updates. A personal view arrives with sign-in."
            entries={teamActivity}
            footerHref="/docs/workflow"
            footerLabel="See how to contribute"
            showArea
          />
        </section>
      </div>
    </div>
  );
}

function ActivityCard({
  title,
  subtitle,
  entries,
  footerHref,
  footerLabel,
  showArea,
}: {
  title: string;
  subtitle: string;
  entries: ActivityEntry[];
  footerHref: string;
  footerLabel: string;
  showArea: boolean;
}) {
  return (
    <section className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{subtitle}</p>
      {entries.length === 0 ? (
        <p className="mt-6 flex-1 text-sm text-[var(--muted-foreground)]">
          Nothing recent to show. Updates appear here as soon as changes land.
        </p>
      ) : (
        <ul className="mt-5 flex-1 divide-y divide-[var(--border)]">
          {entries.map((e) => (
            <li key={e.sha} className="flex items-baseline gap-3 py-2.5 first:pt-0">
              {showArea && (
                <span className="shrink-0 rounded border border-[var(--border)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--muted-foreground)]">
                  {AREA_LABELS[e.area]}
                </span>
              )}
              <div className="min-w-0">
                <a
                  href={e.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-sm font-medium hover:text-[var(--primary)] hover:underline"
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
      )}
      <div className="mt-5 border-t border-[var(--border)] pt-4">
        <Link
          href={footerHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline"
        >
          {footerLabel}
          <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
