import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { getAllDesigns } from "@/lib/designs";

export const revalidate = 60;

export default function HomePage() {
  const all = getAllDesigns();
  const countsByCategory = new Map<string, number>();
  for (const d of all) {
    countsByCategory.set(d.category, (countsByCategory.get(d.category) ?? 0) + 1);
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Browse by product</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {all.length} {all.length === 1 ? "design" : "designs"} across {CATEGORIES.length} product areas.
          Designs are submitted via pull request and appear here once merged.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => {
          const count = countsByCategory.get(c.slug) ?? 0;
          return (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="group rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 transition hover:border-[var(--color-accent)]"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-medium group-hover:text-[var(--color-accent)]">{c.name}</h2>
                <span className="text-xs text-[var(--color-muted)]">{count}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{c.blurb}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
