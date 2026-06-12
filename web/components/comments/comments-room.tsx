"use client";

import { LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";
import { displayNameFor } from "./identity";

/**
 * Wraps a gallery design page in a Liveblocks room so comment threads
 * can attach to it. Room ids are namespaced per design:
 *
 *   gallery:<category>/<slug>
 *
 * Feature flag: when NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is not set the
 * wrapper renders children untouched — the comment feature stays dark
 * until Liveblocks is configured (locally via web/.env.local, on Vercel
 * via project env vars). Note the client authenticates through
 * /api/liveblocks-auth (token auth), not the public key itself; the env
 * var doubles as the "is commenting configured?" signal for the client
 * bundle.
 */

const COMMENTS_ENABLED = Boolean(process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY);

export function commentsEnabled(): boolean {
  return COMMENTS_ENABLED;
}

export function CommentsRoom({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) {
  if (!COMMENTS_ENABLED) return <>{children}</>;
  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      /* The free-plan "Powered by Liveblocks" badge is injected by their
         server (showBrand flag) and is removable only on a paid plan.
         Bottom-left keeps it clear of the flow canvas's zoom controls
         and the comment thread popovers, which live bottom-right. */
      badgeLocation="bottom-left"
      /* The Comments UI resolves author display names by userId via this
         callback (token userInfo is not used for comment authors). Our
         ids are self-describing — anon-<uuid> or an email — so no server
         lookup is needed. */
      resolveUsers={async ({ userIds }) =>
        userIds.map((id) => ({ name: displayNameFor(id) }))
      }
    >
      <RoomProvider id={roomId} initialPresence={{}}>
        {children}
      </RoomProvider>
    </LiveblocksProvider>
  );
}
