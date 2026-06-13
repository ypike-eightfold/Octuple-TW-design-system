/**
 * Section-page hero banner. Full-bleed across the viewport, bleeding
 * under the sticky top nav. Pages typically wrap their content in a
 * max-w wrapper that would normally constrain the hero — the
 * `w-screen` + `left-1/2 -translate-x-1/2` shift makes the hero pop
 * out to the viewport edges regardless of parent width.
 */
export function PageHero({
  src,
  alt = "",
  flipY = false,
}: {
  src: string;
  alt?: string;
  /** Flip the illustration upside-down. Useful for SVGs designed to
   *  sit at the BOTTOM of a hero (e.g. mountain silhouettes whose
   *  peaks point up) — flipping puts the dense shapes against the
   *  top of the band so the bottom edge fades into the page. */
  flipY?: boolean;
}) {
  return (
    <div
      className={
        // -mt-16 bleeds under the 64px sticky top nav.
        // relative + left-1/2 + -ml-[50vw] + w-screen escapes any
        // mx-auto / max-w-N wrapper the parent page applied, so the
        // banner spans the full viewport width.
        // No fixed height + no overflow-hidden: the <img> flows in
        // normal layout and sizes itself to its natural aspect ratio
        // at the current width, so the illustration is never clipped.
        "relative left-1/2 -ml-[50vw] w-screen -mt-16 mb-8"
      }
    >
      <img
        src={src}
        alt={alt}
        aria-hidden={alt === ""}
        // Inline transform (rather than a Tailwind class) because Tailwind v4's
        // arbitrary scale-y syntax can be flaky for negative values across builds.
        style={flipY ? { transform: "scaleY(-1)" } : undefined}
        className="block w-full pointer-events-none select-none"
      />
    </div>
  );
}
