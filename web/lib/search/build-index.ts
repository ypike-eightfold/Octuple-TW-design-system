/**
 * Server-side index builder. Called from the /api/search-index route
 * handler and cached by Next.js' fetch / revalidate machinery.
 *
 * Walks every content source listed in docs/SEARCH-PLAN.md and emits
 * a flat SearchableItem[] ready to feed into Fuse on the client.
 */

import fs from "node:fs";
import path from "node:path";
import { getAllDesigns } from "@/lib/designs";
import { CATEGORIES } from "@/lib/categories";
import {
  SHADCN_COMPONENTS,
  TOKEN_SECTIONS,
  DOCUMENT_PAGES,
  STATIC_CATALOG_PAGES,
  WORKFLOW_SECTIONS,
  componentSlug,
} from "./catalog-meta";
import type {
  ComponentItem,
  DesignItem,
  DocHeadingItem,
  DocumentItem,
  SearchIndex,
  SearchableItem,
  TokenSectionItem,
  WorkflowSectionItem,
} from "./types";

const REPO_ROOT = path.resolve(process.cwd(), "..");

const DOCUMENT_SOURCES: Record<string, string[]> = {
  "content-design-standards": [".claude", "skills", "_content", "content-design-standards.md"],
  "terms-list": [".claude", "skills", "_content", "terms-list.md"],
  "response-confidence-score": ["gems", "response-confidence-score.md"],
  "guidance-layer": ["gems", "guidance-layer.md"],
  "oh-prompt-instructions": ["gems", "OH", "prompt-instructions.md"],
  "oh-content-quality-framework": ["gems", "OH", "content-quality-framework.md"],
};

/** GitHub-style slug — same algo as the catalog uses for in-page headings. */
function slugifyHeading(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Extract h2/h3 lines from a markdown source. Plain-enough for our docs;
 *  ignores fenced code blocks so a "## comment" inside a snippet doesn't
 *  pollute the index. */
function extractDocHeadings(source: string): { text: string; depth: 2 | 3 }[] {
  const out: { text: string; depth: 2 | 3 }[] = [];
  let inFence = false;
  for (const line of source.split("\n")) {
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (!m) continue;
    const depth = m[1].length as 2 | 3;
    out.push({ text: m[2].trim(), depth });
  }
  return out;
}

function safeReadFile(parts: string[]): string | null {
  try {
    return fs.readFileSync(path.join(REPO_ROOT, ...parts), "utf8");
  } catch {
    return null;
  }
}

function buildDesignItems(): DesignItem[] {
  const categoryNameBySlug = new Map(CATEGORIES.map((c) => [c.slug, c.name] as const));
  return getAllDesigns().map((d) => {
    const categoryName = categoryNameBySlug.get(d.category) ?? d.category;
    return {
      id: `design:${d.category}:${d.slug}`,
      kind: "design",
      title: d.title,
      description: d.description,
      href: `/gallery/${d.category}/${d.slug}`,
      breadcrumb: `Gallery › ${categoryName}`,
      category: categoryName,
      author: d.author,
    } satisfies DesignItem;
  });
}

function buildTokenItems(): TokenSectionItem[] {
  return TOKEN_SECTIONS.map((s) => ({
    id: `token:${s.id}`,
    kind: "token-section",
    title: s.label,
    description: `Token reference — ${s.label.toLowerCase()}.`,
    href: `/components#${s.id}`,
    breadcrumb: "Octuple › Tokens",
    sectionId: s.id,
  }));
}

function buildComponentItems(): ComponentItem[] {
  const dynamic = SHADCN_COMPONENTS.map<ComponentItem>((label) => {
    const id = `ui-${componentSlug(label)}`;
    return {
      id: `component:${id}`,
      kind: "component",
      title: label,
      description: `${label} component — live examples and props.`,
      href: `/components#${id}`,
      breadcrumb: "Octuple › Components",
      pageId: id,
    };
  });
  const stat = STATIC_CATALOG_PAGES.map<ComponentItem>((p) => ({
    id: `component:${p.id}`,
    kind: "component",
    title: p.label,
    description: p.description,
    href: `/components#${p.id}`,
    breadcrumb: "Octuple › Components",
    pageId: p.id,
  }));
  return [...stat, ...dynamic];
}

function buildDocumentItems(): (DocumentItem | DocHeadingItem)[] {
  const out: (DocumentItem | DocHeadingItem)[] = [];
  for (const doc of DOCUMENT_PAGES) {
    out.push({
      id: `document:${doc.id}`,
      kind: "document",
      title: doc.label,
      description: `${doc.label} — Octuple documentation.`,
      href: `/components#${doc.id}`,
      breadcrumb: "Octuple › Documents",
      pageId: doc.id,
    });
    const filePath = DOCUMENT_SOURCES[doc.id];
    if (!filePath) continue;
    const src = safeReadFile(filePath);
    if (!src) continue;
    for (const h of extractDocHeadings(src)) {
      const anchor = slugifyHeading(h.text);
      out.push({
        id: `doc-heading:${doc.id}:${anchor}`,
        kind: "doc-heading",
        title: h.text,
        description: `${doc.label} — ${h.text}`,
        href: `/components#${doc.id}`,
        breadcrumb: `Octuple › Documents › ${doc.label}`,
        pageId: doc.id,
        anchor,
        depth: h.depth,
      });
    }
  }
  return out;
}

function buildWorkflowItems(): WorkflowSectionItem[] {
  return WORKFLOW_SECTIONS.map((s) => ({
    id: `workflow:${s.id}`,
    kind: "workflow-section",
    title: s.label,
    description: "Claude setup workflow.",
    href: `/docs/workflow#${s.id}`,
    breadcrumb: "Claude setup",
    anchor: s.id,
  }));
}

export function buildSearchIndex(): SearchIndex {
  const items: SearchableItem[] = [
    ...buildDesignItems(),
    ...buildTokenItems(),
    ...buildComponentItems(),
    ...buildDocumentItems(),
    ...buildWorkflowItems(),
  ];
  return {
    builtAt: new Date().toISOString(),
    items,
  };
}
