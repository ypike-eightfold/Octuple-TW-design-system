import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_SLUGS, getCategory, type CategorySlug } from "@/lib/categories";
import { getAllDesigns, getDesign } from "@/lib/designs";

export const revalidate = 60;

export function generateStaticParams() {
  return getAllDesigns().map((d) => ({ category: d.category, slug: d.slug }));
}

type Params = Promise<{ category: string; slug: string }>;

export default async function DesignDetailPage({ params }: { params: Params }) {
  const { category: rawCategory, slug } = await params;
  if (!(CATEGORY_SLUGS as readonly string[]).includes(rawCategory)) notFound();
  const category = rawCategory as CategorySlug;
  const design = getDesign(category, slug);
  if (!design) notFound();
  const categoryMeta = getCategory(category)!;

  return (
    <div>
      <nav className="mb-6 text-sm text-[var(--muted-foreground)]">
        <Link href="/gallery" className="hover:underline">All categories</Link>
        <span aria-hidden> / </span>
        <Link href={`/gallery/${category}`} className="hover:underline">{categoryMeta.name}</Link>
        <span aria-hidden> / </span>
        <span>{design.title}</span>
      </nav>

      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{design.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">{design.description}</p>
        </div>
        <span className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1 text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
          {design.version === "tailwind" ? "Tailwind" : "OG Octuple"}
        </span>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
        <div>
          <dt className="text-[var(--muted-foreground)]">Category</dt>
          <dd className="mt-1 font-medium">{categoryMeta.name}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted-foreground)]">Version</dt>
          <dd className="mt-1 font-medium">{design.version}</dd>
        </div>
        {design.author && (
          <div>
            <dt className="text-[var(--muted-foreground)]">Author</dt>
            <dd className="mt-1 font-medium">{design.author}</dd>
          </div>
        )}
        {design.createdAt && (
          <div>
            <dt className="text-[var(--muted-foreground)]">Created</dt>
            <dd className="mt-1 font-medium">{new Date(design.createdAt).toLocaleDateString()}</dd>
          </div>
        )}
      </dl>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-medium text-[var(--muted-foreground)]">Prototype</h2>
        <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]">
          {/* Sandbox the iframe so the design can't navigate the parent. */}
          <iframe
            src={design.previewUrl}
            title={`Prototype: ${design.title}`}
            className="block h-[80vh] w-full"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">
          <a className="underline" href={design.previewUrl} target="_blank" rel="noopener noreferrer">
            Open prototype in a new tab ↗
          </a>
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-medium text-[var(--muted-foreground)]">Thumbnail</h2>
        <img
          src={design.thumbnailUrl}
          alt=""
          className="max-w-full rounded-lg border border-[var(--border)]"
        />
      </section>
    </div>
  );
}
