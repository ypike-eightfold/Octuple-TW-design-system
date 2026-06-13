/**
 * Section-page hero banner. Full-bleed across the viewport, bleeding
 * under the sticky top nav. Pages typically wrap their content in a
 * max-w wrapper that would normally constrain the hero — the
 * `w-screen` + `left-1/2 -translate-x-1/2` shift makes the hero pop
 * out to the viewport edges regardless of parent width.
 */
export function PageHero({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    <div
      className={
        // -mt-16 bleeds under the 64px sticky top nav.
        // relative + left-1/2 + -translate-x-1/2 + w-screen escapes any
        // mx-auto / max-w-N wrapper the parent page applied, so the
        // banner always spans the full viewport width.
        "relative left-1/2 -ml-[50vw] w-screen -mt-16 mb-8 " +
        "h-[260px] overflow-hidden"
      }
    >
      <img
        src={src}
        alt={alt}
        aria-hidden={alt === ""}
        className="absolute top-0 left-0 w-full pointer-events-none select-none"
      />
    </div>
  );
}
