/**
 * Shared identity helpers for the gallery comment feature.
 *
 * Used in two places that must agree:
 * - /api/liveblocks-auth (server) embeds the name in the access token.
 * - resolveUsers in CommentsRoom (client) supplies names to the
 *   Comments UI, which resolves authors by userId — without this the
 *   Thread component falls back to a literal "Anonymous".
 *
 * Anonymous ids are deterministic (cookie-stable per browser), so the
 * same id always maps to the same friendly name on every client.
 */

const ANON_NAMES = [
  "Anonymous Otter",
  "Anonymous Heron",
  "Anonymous Lynx",
  "Anonymous Ibex",
  "Anonymous Tern",
  "Anonymous Vole",
  "Anonymous Crane",
  "Anonymous Marten",
] as const;

export function anonName(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return ANON_NAMES[Math.abs(hash) % ANON_NAMES.length]!;
}

/** Display name for any comment author id this app issues:
 *  anon-<uuid> cookie identities, or an email once SSO is wired. */
export function displayNameFor(userId: string): string {
  if (userId.startsWith("anon-")) return anonName(userId);
  if (userId.includes("@")) {
    // jane.doe@eightfold.ai → "Jane Doe" — placeholder until a proper
    // directory lookup exists.
    const local = userId.split("@")[0]!;
    return local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  }
  return userId;
}
