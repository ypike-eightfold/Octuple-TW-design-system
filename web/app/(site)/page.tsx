import { CATEGORIES } from "@/lib/categories";
import { getAllDesigns } from "@/lib/designs";
import { HomePageView } from "@/components/site/home-page-view";

export const revalidate = 60;

// Thin server wrapper: read the filesystem-backed design index, hand the
// numbers off to the client view (which uses ef-design-system components
// that require browser-only React features like useState/useLayoutEffect).
export default function HomePage() {
  const all = getAllDesigns();
  return <HomePageView totalDesigns={all.length} categoryCount={CATEGORIES.length} />;
}
