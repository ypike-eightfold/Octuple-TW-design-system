"use client";

import { useTheme } from "next-themes";
import { useHero } from "./hero-provider";
import { imageFor, srcFor, type HeroPage } from "./hero-registry";

/**
 * Section-page hero banner. Full-bleed across the viewport, bleeding
 * under the sticky top nav. Children (typically `<h1>` + intro `<p>`)
 * render on top of the illustration inside the same max-w-6xl reading
 * column the rest of the site uses — matching the home hero exactly.
 *
 * Takes a `page` id and reads the active hero theme from useHero() to
 * resolve the SVG, so picking a theme in the HeroSwitcher swaps every
 * page's hero at once.
 *
 * - Parent page-level max-w wrappers are escaped via
 *   `left-1/2 -ml-[50vw] w-screen` on the bleeding image so the SVG
 *   spans the viewport edges even when called from inside a
 *   max-w-N container.
 * - Children sit in a wrapper with `pt-28 pb-14`, scoped to `max-w-3xl`
 *   (same as the home title block) so titles + intros wrap at the
 *   same width across home / gallery / docs.
 */
export function PageHero({
  page,
  children,
}: {
  /** Which page this banner is for — drives the SVG lookup against
   *  the active hero theme. */
  page: HeroPage;
  /** Eyebrow, h1, intro paragraph(s) — rendered on top of the SVG. */
  children: React.ReactNode;
}) {
  const { hero } = useHero();
  const { resolvedTheme } = useTheme();
  const src = srcFor(hero, page, resolvedTheme);
  // flipY lives on the image record now — each theme can declare which
  // pages need their SVG flipped. Cyberpunk's gallery + docs SVGs flip;
  // Gradient's don't, even on the same surfaces.
  const flipY = imageFor(hero, page).flipY ?? false;

  return (
    <section className="relative -mt-16">
      {/* Full-bleed illustration, behind the children. -ml-[50vw] +
          w-screen escapes any mx-auto / max-w-N wrapper the parent
          page applied. No fixed height + no overflow-hidden so the
          SVG flows at its natural aspect and is never clipped. */}
      <img
        src={src}
        alt=""
        aria-hidden
        // key forces a remount when the user picks a different hero
        // theme so the browser swaps the SVG without a cached-paint flash.
        key={src}
        style={flipY ? { transform: "scaleY(-1)" } : undefined}
        // max-w-none is required: Tailwind's preflight resets img to
        // `max-width: 100%`, which caps w-screen to the parent's width
        // and breaks the viewport-breakout trick when PageHero is
        // called from inside a max-w-N wrapper.
        // opacity-80 softens the illustration so the foreground copy
        // stays legible without a translucent card behind it.
        className="absolute top-0 left-1/2 -ml-[50vw] w-screen max-w-none opacity-80 -z-10 pointer-events-none select-none block"
      />
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-14">
        <div className="max-w-3xl">{children}</div>
      </div>
    </section>
  );
}
