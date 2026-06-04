import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { getAllDesigns, type Design } from "@/lib/designs";

export const revalidate = 60;

/** Newest-first by createdAt (ISO string compare is correct for ISO-8601),
    falling back to slug for stable ordering when createdAt is missing. */
function newestFirst(a: Design, b: Design): number {
  const da = a.createdAt ?? "";
  const db = b.createdAt ?? "";
  if (da !== db) return db.localeCompare(da);
  return a.slug.localeCompare(b.slug);
}

export default function HomePage() {
  const all = getAllDesigns();

  // Bucket designs by category, then keep up to 4 newest per bucket for the
  // card preview strip. The detail page (/gallery/<category>) still shows all.
  const byCategory = new Map<string, Design[]>();
  for (const d of all) {
    const list = byCategory.get(d.category) ?? [];
    list.push(d);
    byCategory.set(d.category, list);
  }
  for (const [cat, list] of byCategory) {
    list.sort(newestFirst);
    byCategory.set(cat, list);
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Browse by product</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          {all.length} {all.length === 1 ? "design" : "designs"} across {CATEGORIES.length} product areas.
          Designs are submitted via pull request and appear here once merged.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => {
          const designs = byCategory.get(c.slug) ?? [];
          const count = designs.length;
          const recent = designs.slice(0, 4);
          return (
            <Link
              key={c.slug}
              href={`/gallery/${c.slug}`}
              className="group flex flex-col rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--primary)]"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-medium group-hover:text-[var(--primary)]">{c.name}</h2>
                <span className="text-xs text-[var(--muted-foreground)]">{count}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{c.blurb}</p>

              {/* Recent thumbnails — up to 4 newest, 2x2 grid.
                  Empty categories skip the strip entirely so the cards
                  collapse to text-only and stay visually clean. */}
              {recent.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {recent.map((d) => (
                    <div
                      key={d.slug}
                      className="aspect-[16/10] overflow-hidden rounded-md border border-[var(--border)] bg-[var(--background)]"
                    >
                      <img
                        src={d.thumbnailUrl}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
