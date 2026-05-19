import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { CATEGORY_SLUGS, type CategorySlug } from "./categories";

export type DesignVersion = "tailwind" | "og";

export interface DesignMeta {
  title: string;
  description: string;
  category: CategorySlug;
  version: DesignVersion;
  slug: string;
  author?: string;
  createdAt?: string;
}

export interface Design extends DesignMeta {
  /** Public URL to the design's index.html (iframe src) */
  previewUrl: string;
  /** Public URL to the design's thumbnail.png */
  thumbnailUrl: string;
}

const DESIGNS_ROOT = path.join(process.cwd(), "public", "content", "designs");

function isCategorySlug(s: string): s is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(s);
}

function safeReadDir(p: string): string[] {
  try {
    return fs.readdirSync(p, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }
}

function parseMeta(metaPath: string): DesignMeta | null {
  try {
    const raw = fs.readFileSync(metaPath, "utf8");
    const obj = JSON.parse(raw) as Partial<DesignMeta>;
    if (
      typeof obj.title !== "string" ||
      typeof obj.description !== "string" ||
      typeof obj.slug !== "string" ||
      typeof obj.category !== "string" ||
      !isCategorySlug(obj.category) ||
      (obj.version !== "tailwind" && obj.version !== "og")
    ) {
      return null;
    }
    return obj as DesignMeta;
  } catch {
    return null;
  }
}

/**
 * Scans public/content/designs/**\/meta.json once per render pass and returns
 * all designs. React's `cache` dedupes within a single request; revalidate
 * controls cross-request freshness (set on each page).
 */
export const getAllDesigns = cache((): Design[] => {
  const designs: Design[] = [];
  for (const category of safeReadDir(DESIGNS_ROOT)) {
    if (!isCategorySlug(category)) continue;
    const categoryDir = path.join(DESIGNS_ROOT, category);
    for (const slug of safeReadDir(categoryDir)) {
      const metaPath = path.join(categoryDir, slug, "meta.json");
      const meta = parseMeta(metaPath);
      if (!meta) continue;
      // Defensive: trust the directory layout, not the meta.json fields, for routing.
      designs.push({
        ...meta,
        category,
        slug,
        previewUrl: `/content/designs/${category}/${slug}/index.html`,
        thumbnailUrl: `/content/designs/${category}/${slug}/thumbnail.png`,
      });
    }
  }
  // Newest first when createdAt is present, otherwise stable by slug.
  designs.sort((a, b) => {
    if (a.createdAt && b.createdAt) return b.createdAt.localeCompare(a.createdAt);
    if (a.createdAt) return -1;
    if (b.createdAt) return 1;
    return a.slug.localeCompare(b.slug);
  });
  return designs;
});

export function getDesignsByCategory(category: CategorySlug): Design[] {
  return getAllDesigns().filter((d) => d.category === category);
}

export function getDesign(category: CategorySlug, slug: string): Design | undefined {
  return getAllDesigns().find((d) => d.category === category && d.slug === slug);
}
