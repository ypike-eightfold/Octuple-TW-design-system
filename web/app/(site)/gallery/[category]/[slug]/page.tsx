import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_SLUGS, getCategory, type CategorySlug } from "@/lib/categories";
import { getAllDesigns, getDesign } from "@/lib/designs";
import { CommentsRoom } from "@/components/comments/comments-room";
import { getFlow } from "@/lib/flows";
import { PrototypeFullscreen } from "./PrototypeFullscreen";

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

      {/* Comment threads are scoped per design via the Liveblocks room id. */}
      <CommentsRoom roomId={`gallery:${category}/${slug}`}>
        <PrototypeFullscreen
          previewUrl={design.previewUrl}
          title={design.title}
          slug={design.slug}
          flow={getFlow(design)}
        />
      </CommentsRoom>
      <p className="mt-2 text-xs text-[var(--muted-foreground)]">
        <a className="underline" href={design.previewUrl} target="_blank" rel="noopener noreferrer">
          Open prototype in a new tab ↗
        </a>
      </p>
    </div>
  );
}
