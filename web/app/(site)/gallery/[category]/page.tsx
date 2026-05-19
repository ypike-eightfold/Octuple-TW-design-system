import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, CATEGORY_SLUGS, getCategory, type CategorySlug } from "@/lib/categories";
import { getDesignsByCategory } from "@/lib/designs";

export const revalidate = 60;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

type Params = Promise<{ category: string }>;

export default async function CategoryPage({ params }: { params: Params }) {
  const { category: raw } = await params;
  if (!(CATEGORY_SLUGS as readonly string[]).includes(raw)) notFound();
  const category = raw as CategorySlug;
  const meta = getCategory(category)!;
  const designs = getDesignsByCategory(category);

  return (
    <div>
      <nav className="mb-6 text-sm text-[var(--muted-foreground)]">
        <Link href="/gallery" className="hover:underline">All categories</Link>
        <span aria-hidden> / </span>
        <span>{meta.name}</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight">{meta.name}</h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">{meta.blurb}</p>

      {designs.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--muted-foreground)]">
          No designs yet. Submit one via the <code>publish-design</code> skill.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((d) => (
            <Link
              key={d.slug}
              href={`/gallery/${d.category}/${d.slug}`}
              className="group overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] transition hover:border-[var(--primary)]"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[var(--background)]">
                {/* Next/image with unoptimized:true; using <img> for simplicity */}
                <img
                  src={d.thumbnailUrl}
                  alt=""
                  className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-medium group-hover:text-[var(--primary)]">{d.title}</h2>
                  <span className="shrink-0 rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]">
                    {d.version}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-[var(--muted-foreground)]">{d.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
