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
      /** Screen the comment was left on: `<pathname+search>#<h1>` (see
       *  screenKeyFromUrl). Scopes which pins render per screen and lets
       *  the comments list jump back to the right screen. Optional —
       *  legacy threads predate it. */
      screen?: string;
      /** Opaque, prototype-defined state descriptor (JSON string) captured
       *  when the comment was made — e.g. `{"persona":"sam"}`. Posted back
       *  into the prototype on jump so it restores the exact flow. The
       *  gallery never interprets it; see components/comments/proto-state.ts. */
      state?: string;
    };
  }
}

export {};
