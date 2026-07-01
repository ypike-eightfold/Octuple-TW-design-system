/* Generic prototype ⇄ gallery state bridge (postMessage).
 *
 * Lets a comment restore the exact flow it was left in. A prototype
 * OPTS IN by:
 *   - posting  { type: PROTO_STATE, state }  to window.parent whenever
 *     its restorable state changes, and in reply to PROTO_STATE_REQUEST;
 *   - listening for  { type: PROTO_STATE_RESTORE, state }  and applying it.
 *
 * The gallery stores the opaque `state` (JSON) in each comment thread's
 * metadata, and posts it back when a designer opens that comment from the
 * list — so the prototype returns to the persona / data state / internal
 * screen the comment was made in.
 *
 * The descriptor is entirely prototype-defined; the gallery never reads
 * into it. Prototypes that don't opt in still get screen + scroll restore.
 * Mirrors the existing `gallery-theme` handshake in PrototypeFullscreen. */

export const PROTO_STATE = "proto-state";
export const PROTO_STATE_RESTORE = "proto-state-restore";
export const PROTO_STATE_REQUEST = "proto-state-request";

export type ProtoStateDescriptor = Record<string, unknown>;

/** Serialize a descriptor for thread metadata. Returns undefined for
 *  empty/undefined so we never write a meaningless `"{}"`. */
export function stringifyState(
  state: ProtoStateDescriptor | null | undefined,
): string | undefined {
  if (!state || Object.keys(state).length === 0) return undefined;
  try {
    return JSON.stringify(state);
  } catch {
    return undefined;
  }
}

export function parseState(json: string | null | undefined): ProtoStateDescriptor | null {
  if (!json) return null;
  try {
    const v = JSON.parse(json);
    return v && typeof v === "object" ? (v as ProtoStateDescriptor) : null;
  } catch {
    return null;
  }
}
