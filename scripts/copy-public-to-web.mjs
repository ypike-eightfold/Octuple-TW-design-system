#!/usr/bin/env node
/**
 * Copies the design system's runtime assets (fonts, logos, illustrations)
 * from the repo root's /public into web/public so Next.js serves them at
 * /fonts/*, /product-logos/*, etc. Mirrors what the Vite demo did via a
 * custom plugin.
 *
 * Run before `next dev` or `next build` (see web/package.json scripts).
 * The copied paths are gitignored in web/.gitignore.
 */
import { cp, mkdir, rm, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const src = join(repoRoot, "public");
const dst = join(repoRoot, "web", "public");

const ENTRIES = [
  "fonts",
  "product-logos",
  "object-card-backgrounds",
  "eightfold-logo.svg",
  "ai-agent.svg",
  "copilot.svg",
];

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

await mkdir(dst, { recursive: true });

for (const entry of ENTRIES) {
  const from = join(src, entry);
  const to = join(dst, entry);
  if (!(await exists(from))) {
    console.warn(`[copy-public] skip (not in source): ${entry}`);
    continue;
  }
  await rm(to, { recursive: true, force: true });
  await cp(from, to, { recursive: true });
  console.log(`[copy-public] ${entry}`);
}

console.log("[copy-public] done");
