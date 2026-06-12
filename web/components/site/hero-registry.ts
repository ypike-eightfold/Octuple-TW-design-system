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
  // Cyberpunk theme — angular geometric illustrations on warm pink → purple
  // gradients with dark outlines. Same family aesthetic across all four
  // variants, so they're labelled as the home screen + three alternates.
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    description: "Angular geometry on warm pink → purple gradients. Home-screen default.",
    src: {
      light: "/heroes/comic-rocks.svg",
      dark: "/heroes/comic-rocks.svg",
    },
  },
  {
    id: "cyberpunk-ocean-waves",
    label: "Cyberpunk · Ocean waves",
    description: "Triangular wave geometry, same gradient palette.",
    src: {
      light: "/heroes/ocean-waves.svg",
      dark: "/heroes/ocean-waves.svg",
    },
  },
  {
    id: "cyberpunk-burning-lands",
    label: "Cyberpunk · Burning lands",
    description: "Mountainous geometry in the Cyberpunk gradient family.",
    src: {
      light: "/heroes/burning-lands.svg",
      dark: "/heroes/burning-lands.svg",
    },
  },
  {
    id: "cyberpunk-cloudy-wind",
    label: "Cyberpunk · Cloudy wind",
    description: "Layered cloud forms with a deeper burgundy palette.",
    src: {
      light: "/heroes/cloudy-wind.svg",
      dark: "/heroes/cloudy-wind.svg",
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

export const DEFAULT_HERO_ID = "cyberpunk";

export function getHeroById(id: string | null | undefined): Hero {
  return HEROES.find((h) => h.id === id) ?? HEROES[0];
}
