import { NextResponse } from "next/server";
import { buildSearchIndex } from "@/lib/search/build-index";

// The corpus changes only when content under /public/content/designs or
// the catalog metadata module changes. Cache aggressively — Next will
// regenerate per its revalidate window, and the client fetch picks up
// new builds automatically on the next modal open after revalidation.
export const revalidate = 60;

export async function GET() {
  const index = buildSearchIndex();
  return NextResponse.json(index, {
    headers: {
      "cache-control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
