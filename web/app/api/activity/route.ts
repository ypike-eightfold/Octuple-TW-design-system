import { NextResponse } from "next/server";
import { getOctupleUpdates, getTeamActivity } from "@/lib/github-activity";

/* Fuller activity feeds for the home dashboard's "See all" panels.
 * The dashboard cards render a short slice inline (server-rendered);
 * this route serves the deeper list, fetched lazily when a panel opens
 * so the initial page load stays light.
 *
 * The route is dynamic (it reads ?feed=), but the GitHub responses it
 * depends on are still cached 5 minutes via the fetch-level revalidate
 * inside github-activity.ts — so the data cache works without a
 * route-level `revalidate`, which would conflict with reading
 * searchParams. */

const PANEL_LIMIT = 50;

export async function GET(request: Request) {
  const feed = new URL(request.url).searchParams.get("feed");
  if (feed === "octuple") {
    return NextResponse.json({ entries: await getOctupleUpdates(PANEL_LIMIT) });
  }
  if (feed === "team") {
    return NextResponse.json({ entries: await getTeamActivity(PANEL_LIMIT) });
  }
  return NextResponse.json({ error: "unknown feed" }, { status: 400 });
}
