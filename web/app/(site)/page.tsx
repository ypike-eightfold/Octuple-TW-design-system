import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { getAllDesigns } from "@/lib/designs";

export const revalidate = 60;

export default function HomePage() {
  const all = getAllDesigns();

  return (
    <div>
      <section className="py-10">
        <span className="inline-block rounded-full border border-[var(--border)] px-3 py-1 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
          For designers using Claude Code
        </span>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Eightfold Design System
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--muted-foreground)]">
          Components, approved designs, and the Claude Code skills designers use to ship UI for
          Eightfold products — in one place.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Link
          href="/components"
          className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--primary)]"
        >
          <div className="text-xs font-medium uppercase tracking-wider text-[var(--primary)]">
            Components
          </div>
          <h2 className="mt-3 text-xl font-semibold group-hover:text-[var(--primary)]">
            Browse the catalog
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Tokens, shadcn-style primitives, and Eightfold-specific components — with live examples
            for every one.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-[var(--primary)]">
            Open the catalog →
          </span>
        </Link>

        <Link
          href="/gallery"
          className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--primary)]"
        >
          <div className="text-xs font-medium uppercase tracking-wider text-[var(--primary)]">
            Gallery
          </div>
          <h2 className="mt-3 text-xl font-semibold group-hover:text-[var(--primary)]">
            See approved designs
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {all.length === 0
              ? "Designs the team has published, organized by product area."
              : `${all.length} ${all.length === 1 ? "design" : "designs"} across ${CATEGORIES.length} product areas.`}
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-[var(--primary)]">
            Browse designs →
          </span>
        </Link>

        <Link
          href="/docs/workflow"
          className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--primary)]"
        >
          <div className="text-xs font-medium uppercase tracking-wider text-[var(--primary)]">
            How to use
          </div>
          <h2 className="mt-3 text-xl font-semibold group-hover:text-[var(--primary)]">
            Start designing
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Step-by-step workflow for designers: install Claude Code once, then design and publish
            through conversation.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-[var(--primary)]">
            Open the workflow →
          </span>
        </Link>
      </section>

      <section className="mt-14 rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
        <h3 className="text-lg font-medium">Designers don't need a terminal</h3>
        <p className="mt-2 mx-auto max-w-2xl text-sm text-[var(--muted-foreground)]">
          You ask Claude in plain English; Claude clones the repo, runs the gallery, creates
          branches, opens pull requests. The{" "}
          <Link href="/docs/workflow" className="underline">workflow guide</Link> shows you exactly
          how.
        </p>
      </section>
    </div>
  );
}
