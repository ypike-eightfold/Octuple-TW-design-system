/**
 * Catalog of brand-art hero illustrations available for the home page.
 *
 * Each entry has a stable id, a human label for the picker UI, and the
 * SVG src for light + dark modes. Heroes that don't ship a dark variant
 * point both keys at the same file — the comic-rocks SVG is transparent
 * outside its colored panels so the same artwork reads on either page
 * background.
 *
 * Adding a new hero:
 *   1. Drop the SVG(s) under web/public/heroes/.
 *   2. Append an entry below.
 *   3. The HeroSwitcher in the top nav picks it up automatically.
 */
export interface Hero {
  id: string;
  label: string;
  description: string;
  /** Material Symbols icon name shown in the segmented switcher. */
  icon: string;
  src: { light: string; dark: string };
}

// Heroes available for the HOME PAGE picker. Section pages (Octuple,
// Gallery, How to use) have their own assigned hero banners rendered
// via <PageHero src="..." /> with files committed under public/heroes/
// (cloudy-wind / burning-lands / ocean-waves respectively) — they are
// intentionally NOT in this registry so the home switcher stays scoped
// to home-screen choices.
export const HEROES: Hero[] = [
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    description: "Angular geometry on warm pink → purple gradients. Home-screen default.",
    icon: "diamond",
    src: {
      light: "/heroes/comic-rocks.svg",
      dark: "/heroes/comic-rocks.svg",
    },
  },
  {
    id: "gradient",
    label: "Gradient",
    description:
      "The original Octuple gradient hero. Ships a dedicated dark variant.",
    icon: "gradient",
    src: {
      light: "/heroes/gradient-light.svg",
      dark: "/heroes/gradient-dark.svg",
    },
  },
];

export const DEFAULT_HERO_ID = "cyberpunk";

export function getHeroById(id: string | null | undefined): Hero {
  return HEROES.find((h) => h.id === id) ?? HEROES[0];
}
