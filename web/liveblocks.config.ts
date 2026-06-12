/**
 * Global Liveblocks type augmentation for the gallery comment feature.
 *
 * Each comment thread is pinned to a point on the prototype frame:
 * - x / y: percentage coordinates (0–100) relative to the prototype
 *   viewport box, so pins survive responsive resizes.
 * - scrollX / scrollY: the iframe's interior scroll offset at the moment
 *   the comment was created. Clicking a pin restores this scroll so the
 *   pin points at what the commenter was actually looking at.
 */
declare global {
  interface Liveblocks {
    ThreadMetadata: {
      x: number;
      y: number;
      scrollX: number;
      scrollY: number;
    };
  }
}

export {};
