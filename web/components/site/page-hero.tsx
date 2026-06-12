/**
 * Section-page hero banner. Renders one of the brand-art SVGs as a
 * full-width image bleeding under the sticky top nav, matching the home
 * hero's treatment. Each top-level section gets its own assigned hero
 * — see web/components/site/hero-registry.ts for the catalog.
 *
 * The page content stacks below; pages typically wrap their own header
 * in a div with `pt-N` so it overlaps the hero.
 */
export function PageHero({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    <div className="relative -mt-16 mb-8 h-[260px] overflow-hidden">
      <img
        src={src}
        alt={alt}
        aria-hidden={alt === ""}
        className="absolute top-0 left-0 w-full pointer-events-none select-none"
      />
    </div>
  );
}
