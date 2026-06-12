import fs from "node:fs";
import path from "node:path";
import App from "./App";
import { PageHero } from "@/components/site/page-hero";

export const metadata = {
  title: "Octuple — Eightfold Design System",
};

/** Strip leading YAML frontmatter (--- ... ---) and any HTML comments
    (editorial notes from the PDF extraction) so they don't show as plain
    text above or inside the rendered markdown. */
function cleanMarkdown(md: string): string {
  return md
    .replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

/** GitHub-style slug: lowercase, drop non-word/hyphen/space, then spaces → hyphens.
    Used in BOTH the heading-extraction below and the markdown component
    override that attaches ids to <h2>/<h3>, so sidebar sub-items and the
    rendered headings point at the same anchors. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export interface HeadingItem {
  id: string;
  label: string;
  depth: 2 | 3;
}

/** Pull h2 headings out of the markdown so the sidebar can render expandable
    sub-items. Restricted to h2 to keep the sidebar readable — h3 and below
    would be too dense (e.g. the terms list has hundreds of glossary entries). */
function extractHeadings(md: string): HeadingItem[] {
  const out: HeadingItem[] = [];
  for (const line of md.split("\n")) {
    const m = line.match(/^(##) (.+?)\s*$/);
    if (!m) continue;
    const text = m[2].replace(/<a\s+[^>]*>.*?<\/a>/g, "").trim(); // strip inline anchors
    if (!text) continue;
    out.push({ id: slugify(text), label: text, depth: 2 });
  }
  return out;
}

/** Every markdown document the catalog's Documents section serves.
    The first two are the shared content guidelines; the rest are the
    Gem instruction docs auto-synced from Google Docs (see
    docs/CONTENT-SYNC.md). Ids must match DOCUMENT_PAGES in App.tsx. */
const DOCUMENT_SOURCES: { id: string; file: string[] }[] = [
  { id: "content-design-standards", file: [".claude", "skills", "_content", "content-design-standards.md"] },
  { id: "terms-list", file: [".claude", "skills", "_content", "terms-list.md"] },
  { id: "response-confidence-score", file: ["gems", "response-confidence-score.md"] },
  { id: "guidance-layer", file: ["gems", "guidance-layer.md"] },
  { id: "oh-prompt-instructions", file: ["gems", "OH", "prompt-instructions.md"] },
  { id: "oh-content-quality-framework", file: ["gems", "OH", "content-quality-framework.md"] },
];

export interface CatalogDocument {
  source: string;
  headings: HeadingItem[];
}

function readDocuments(): Record<string, CatalogDocument> {
  const repoRoot = path.resolve(process.cwd(), "..");
  const out: Record<string, CatalogDocument> = {};
  for (const doc of DOCUMENT_SOURCES) {
    const source = cleanMarkdown(fs.readFileSync(path.join(repoRoot, ...doc.file), "utf8"));
    out[doc.id] = { source, headings: extractHeadings(source) };
  }
  return out;
}

// Renders the catalog full-width. The route is outside the (site) route group,
// so it isn't constrained by the max-w-6xl wrapper that landing/gallery use.
export default function ComponentsPage() {
  return (
    <>
      <PageHero src="/heroes/cloudy-wind.svg" />
      <App documents={readDocuments()} />
    </>
  );
}
