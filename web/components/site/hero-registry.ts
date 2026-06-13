/**
 * Catalog of brand-art hero THEMES.
 *
 * A hero theme is a set of illustrations (one per page) in a shared
 * visual language. Picking a theme in the HeroSwitcher swaps every
 * page's hero at once — the home, gallery, docs, and Octuple catalog
 * surfaces each pull their SVG from the active theme's `pages` map.
 *
 * Adding a new theme:
 *   1. Drop the SVG(s) under web/public/heroes/.
 *   2. Append a Hero entry below with a `pages` map covering all four
 *      surfaces. Single-mode SVGs use the same path for light + dark.
 *   3. The HeroSwitcher in the top nav picks it up automatically.
 */

/** The four top-level surfaces that ship a hero banner. */
export type HeroPage = "home" | "gallery" | "docs" | "components";

interface HeroImage {
  light: string;
  dark: string;
}

export interface Hero {
  id: string;
  label: string;
  description: string;
  /** Material Symbols icon name shown in the segmented switcher. */
  icon: string;
  /** Per-page SVGs. */
  pages: Record<HeroPage, HeroImage>;
}

// Gradient theme uses the same SVG pair on every page for now — per-page
// gradient variants can be authored later and dropped into this slot.
const GRADIENT_PAIR: HeroImage = {
  light: "/heroes/gradient-light.svg",
  dark: "/heroes/gradient-dark.svg",
};

export const HEROES: Hero[] = [
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    description: "Angular geometry on warm pink → purple gradients.",
    icon: "diamond",
    pages: {
      home: {
        light: "/heroes/comic-rocks.svg",
        dark: "/heroes/comic-rocks.svg",
      },
      gallery: {
        light: "/heroes/burning-lands.svg",
        dark: "/heroes/burning-lands.svg",
      },
      docs: {
        light: "/heroes/ocean-waves.svg",
        dark: "/heroes/ocean-waves.svg",
      },
      components: {
        light: "/heroes/octuple.svg",
        dark: "/heroes/octuple.svg",
      },
    },
  },
  {
    id: "gradient",
    label: "Gradient",
    description:
      "The original Octuple gradient hero. Same SVG on every page for now; per-page gradient variants can ship later.",
    icon: "gradient",
    pages: {
      home: GRADIENT_PAIR,
      gallery: GRADIENT_PAIR,
      docs: GRADIENT_PAIR,
      components: GRADIENT_PAIR,
    },
  },
];

export const DEFAULT_HERO_ID = "cyberpunk";

export function getHeroById(id: string | null | undefined): Hero {
  return HEROES.find((h) => h.id === id) ?? HEROES[0];
}

/** Resolve the SVG path for a given page within a hero theme. */
export function srcFor(hero: Hero, page: HeroPage, resolvedTheme: string | undefined): string {
  const img = hero.pages[page];
  return resolvedTheme === "dark" ? img.dark : img.light;
}
