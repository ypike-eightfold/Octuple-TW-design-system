import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { CategorySlug } from "./categories";
import type { Design } from "./designs";

/**
 * Flow definitions for the gallery's Flows view (the zoomable canvas
 * that maps every screen in a prototype, InVision-board style).
 *
 * Each design MAY ship a flow.json next to its meta.json:
 *
 *   web/public/content/designs/<category>/<slug>/flow.json
 *
 * Schema (all thumbnails relative to the design folder):
 * {
 *   "lanes": [
 *     {
 *       "title": "Happy flow",
 *       "sections": [
 *         {
 *           "title": "Team tab",
 *           "screens": [
 *             {
 *               "id": "team",
 *               "caption": "Team overview",
 *               "thumbnail": "flow/team.png",
 *               "href": "/careerhub/team"
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 * `href` is what the prototype iframe loads when the screen is clicked
 * on the canvas — either a route (interactive prototypes) or a static
 * html path.
 *
 * Designs WITHOUT a flow.json get a synthesized one-node flow from
 * their meta (title + thumbnail + previewUrl), so the Flows toggle is
 * available on every design with zero authoring.
 */

export interface FlowScreen {
  id: string;
  caption: string;
  /** Public URL of the screen's thumbnail image. */
  thumbnailUrl: string;
  /** What the prototype iframe should load when this screen is opened. */
  href: string;
}

export interface FlowSection {
  title: string;
  screens: FlowScreen[];
}

export interface FlowLane {
  title: string;
  sections: FlowSection[];
}

export interface Flow {
  lanes: FlowLane[];
  /** True when this flow was synthesized from meta.json (single screen). */
  synthesized: boolean;
}

const DESIGNS_ROOT = path.join(process.cwd(), "public", "content", "designs");

interface RawScreen {
  id?: string;
  caption?: string;
  thumbnail?: string;
  href?: string;
}
interface RawSection {
  title?: string;
  screens?: RawScreen[];
}
interface RawLane {
  title?: string;
  sections?: RawSection[];
}
interface RawFlow {
  lanes?: RawLane[];
}

function publicUrlFor(category: string, slug: string, rel: string): string {
  return `/content/designs/${category}/${slug}/${rel.replace(/^\/+/, "")}`;
}

function parseFlow(
  raw: RawFlow,
  category: CategorySlug,
  slug: string,
): Flow | null {
  if (!Array.isArray(raw.lanes)) return null;
  const lanes: FlowLane[] = [];
  for (const rawLane of raw.lanes) {
    const sections: FlowSection[] = [];
    for (const rawSection of rawLane.sections ?? []) {
      const screens: FlowScreen[] = [];
      for (const s of rawSection.screens ?? []) {
        if (!s.id || !s.caption || !s.thumbnail || !s.href) continue;
        screens.push({
          id: s.id,
          caption: s.caption,
          thumbnailUrl: s.thumbnail.startsWith("/")
            ? s.thumbnail
            : publicUrlFor(category, slug, s.thumbnail),
          /* Same relative→absolute resolution as the thumbnail. Absolute
             routes (`/careerhub/team`, interactive prototypes) and full
             URLs pass through; a RELATIVE href (`index.html?as=ic#home`,
             self-contained static prototypes) resolves against the design
             folder. Without this a relative href is resolved by the
             browser against the GALLERY page URL when set as the iframe
             src — loading a non-existent site route (nested nav + 404).
             query + hash are preserved (publicUrlFor only prefixes). */
          href: /^(\/|https?:\/\/)/.test(s.href)
            ? s.href
            : publicUrlFor(category, slug, s.href),
        });
      }
      if (screens.length > 0) {
        sections.push({ title: rawSection.title ?? "", screens });
      }
    }
    if (sections.length > 0) {
      lanes.push({ title: rawLane.title ?? "", sections });
    }
  }
  if (lanes.length === 0) return null;
  return { lanes, synthesized: false };
}

/** Flow for a design: authored flow.json when present, otherwise a
 *  synthesized single-screen flow so the canvas works everywhere. */
export const getFlow = cache((design: Design): Flow => {
  const flowPath = path.join(
    DESIGNS_ROOT,
    design.category,
    design.slug,
    "flow.json",
  );
  try {
    const raw = JSON.parse(fs.readFileSync(flowPath, "utf8")) as RawFlow;
    const parsed = parseFlow(raw, design.category, design.slug);
    if (parsed) return parsed;
  } catch {
    /* no flow.json or invalid — fall through to synthesized */
  }
  return {
    synthesized: true,
    lanes: [
      {
        title: "Screens",
        sections: [
          {
            title: design.title,
            screens: [
              {
                id: "main",
                caption: design.title,
                thumbnailUrl: design.thumbnailUrl,
                href: design.previewUrl,
              },
            ],
          },
        ],
      },
    ],
  };
});
