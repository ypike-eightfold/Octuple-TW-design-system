import { CATEGORIES, getCategory } from "@/lib/categories";
import { getAllDesigns } from "@/lib/designs";
import { getOctupleUpdates, getTeamActivity } from "@/lib/github-activity";
import { HomePageView, type LatestDesign } from "@/components/site/home-page-view";

export const revalidate = 60;

// Thin server wrapper: read the filesystem-backed design index and the
// GitHub commit feeds, hand plain data to the client view (which uses
// ef-design-system components that require browser-only React features).
// Activity date labels are computed server-side in github-activity.ts —
// recomputing "3 days ago" on the client would be a hydration mismatch.
export default async function HomePage() {
  const all = getAllDesigns();
  // getAllDesigns sorts newest-first by createdAt; the strip self-updates
  // with every merged design PR.
  const latest: LatestDesign[] = all.slice(0, 4).map((d) => ({
    title: d.title,
    href: `/gallery/${d.category}/${d.slug}`,
    thumbnailUrl: d.thumbnailUrl,
    categoryName: getCategory(d.category)?.name ?? d.category,
  }));
  const [octupleUpdates, teamActivity] = await Promise.all([
    getOctupleUpdates(5),
    getTeamActivity(8),
  ]);
  return (
    <HomePageView
      totalDesigns={all.length}
      categoryCount={CATEGORIES.length}
      latestDesigns={latest}
      octupleUpdates={octupleUpdates}
      teamActivity={teamActivity}
    />
  );
}
