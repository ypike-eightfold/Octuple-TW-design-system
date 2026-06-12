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
  src: { light: string; dark: string };
}

export const HEROES: Hero[] = [
  {
    id: "comic-rocks",
    label: "Comic rocks",
    description: "Angular pink → purple geometry. Works in light and dark.",
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
    src: {
      light: "/heroes/gradient-light.svg",
      dark: "/heroes/gradient-dark.svg",
    },
  },
];

export const DEFAULT_HERO_ID = "comic-rocks";

export function getHeroById(id: string | null | undefined): Hero {
  return HEROES.find((h) => h.id === id) ?? HEROES[0];
}
