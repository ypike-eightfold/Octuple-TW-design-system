"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ClientSideSuspense, useThreads } from "@liveblocks/react/suspense";
import { Composer, Thread } from "@liveblocks/react-ui";
import type { ThreadData } from "@liveblocks/client";
import "@liveblocks/react-ui/styles.css";

/* Click-anywhere comment overlay for gallery prototypes.
 *
 * Mounted over the prototype iframe while comment mode is ON. The
 * overlay captures clicks (the prototype underneath is intentionally
 * inert during commenting), drops a pin at the click point, and opens
 * a Liveblocks Composer to start a thread. Existing threads render as
 * numbered pins; clicking one opens the full Thread (replies, edit,
 * delete own comments — all built into @liveblocks/react-ui).
 *
 * Pin anchoring model:
 * - Coordinates are stored as PERCENTAGES of the prototype frame box,
 *   so pins keep their relative position across viewport widths.
 * - The iframe's interior scroll offset is stored alongside. Pins are
 *   anchored to the frame, not the scrolled content — so opening a pin
 *   first restores the iframe scroll the commenter had. This keeps v1
 *   simple while making pins land on what was actually commented.
 */

type DraftPin = { x: number; y: number };

function PinBadge({
  n,
  active,
  resolved = false,
}: {
  n: number;
  active: boolean;
  resolved?: boolean;
}) {
  return (
    <span
      className={
        "flex h-7 w-7 items-center justify-center rounded-full rounded-bl-none border-2 text-xs font-semibold shadow-md transition-transform " +
        (active
          ? "scale-110 border-[var(--primary)] bg-[var(--primary)] text-white"
          : resolved
            ? "border-white bg-[#94a3b8] text-white opacity-70 hover:opacity-100 hover:scale-110"
            : "border-white bg-[#054D7B] text-white hover:scale-110")
      }
    >
      {/* Resolved threads show a check instead of their number — done is
          done; the number only matters while the thread needs attention. */}
      {resolved ? "✓" : n}
    </span>
  );
}

function Pins({
  containerRef,
  iframeRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}) {
  const { threads } = useThreads();
  const [openThreadId, setOpenThreadId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftPin | null>(null);

  // Escape closes whichever popover is open.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDraft(null);
        setOpenThreadId(null);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only direct clicks on the backdrop start a new draft — clicks
      // inside an open popover or on a pin shouldn't.
      if (e.target !== e.currentTarget) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setOpenThreadId(null);
      setDraft({ x, y });
    },
    [],
  );

  function currentScroll(): { scrollX: number; scrollY: number } {
    try {
      const win = iframeRef.current?.contentWindow;
      return { scrollX: win?.scrollX ?? 0, scrollY: win?.scrollY ?? 0 };
    } catch {
      return { scrollX: 0, scrollY: 0 };
    }
  }

  function restoreScroll(thread: ThreadData) {
    try {
      const meta = thread.metadata;
      iframeRef.current?.contentWindow?.scrollTo(
        meta.scrollX ?? 0,
        meta.scrollY ?? 0,
      );
    } catch {
      /* cross-origin or detached iframe — pin stays frame-anchored */
    }
  }

  /* Popovers flip to stay inside the frame: anchored left when the pin
     sits in the left 60% of the frame, otherwise anchored right; same
     idea vertically. */
  function popoverPosition(x: number, y: number): React.CSSProperties {
    const style: React.CSSProperties = { position: "absolute" };
    if (x <= 60) style.left = `${x}%`;
    else style.right = `${100 - x}%`;
    if (y <= 55) style.top = `${y}%`;
    else style.bottom = `${100 - y}%`;
    return style;
  }

  return (
    <div
      className="absolute inset-0 z-20 cursor-crosshair"
      onClick={handleOverlayClick}
      role="application"
      aria-label="Comment layer — click anywhere to leave a comment"
    >
      {/* Existing thread pins — resolved ones render dimmed with a check
          so "done" reads at a glance, but stay clickable for reference
          (and to un-resolve from the thread header). */}
      {threads.map((thread, i) => {
        const { x, y } = thread.metadata;
        if (typeof x !== "number" || typeof y !== "number") return null;
        const isOpen = openThreadId === thread.id;
        const resolved = thread.resolved;
        return (
          <div
            key={thread.id}
            className="absolute -translate-y-full"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <button
              type="button"
              aria-label={`Comment thread ${i + 1}${resolved ? " (resolved)" : ""}${isOpen ? " (open)" : ""}`}
              aria-expanded={isOpen}
              title={resolved ? "Resolved thread" : undefined}
              onClick={(e) => {
                e.stopPropagation();
                setDraft(null);
                if (!isOpen) restoreScroll(thread);
                setOpenThreadId(isOpen ? null : thread.id);
              }}
              className="block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] rounded-full"
            >
              <PinBadge n={i + 1} active={isOpen} resolved={resolved} />
            </button>
          </div>
        );
      })}

      {/* Open thread popover */}
      {threads.map((thread) => {
        if (openThreadId !== thread.id) return null;
        const { x, y } = thread.metadata;
        return (
          <div
            key={`popover-${thread.id}`}
            style={popoverPosition(x, y)}
            className="z-30 mt-2 w-[360px] max-w-[90vw] overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[420px] overflow-y-auto">
              <Thread thread={thread} />
            </div>
          </div>
        );
      })}

      {/* Draft pin + composer for a brand-new thread */}
      {draft && (
        <>
          <div
            className="absolute -translate-y-full"
            style={{ left: `${draft.x}%`, top: `${draft.y}%` }}
            aria-hidden
          >
            <PinBadge n={threads.length + 1} active />
          </div>
          <div
            style={popoverPosition(draft.x, draft.y)}
            className="z-30 mt-2 w-[360px] max-w-[90vw] overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Composer
              autoFocus
              metadata={{ ...draft, ...currentScroll() }}
              onComposerSubmit={() => setDraft(null)}
            />
          </div>
        </>
      )}
    </div>
  );
}

export function CommentLayer({
  iframeRef,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  return (
    <div ref={containerRef} className="absolute inset-0 z-20">
      <ClientSideSuspense
        fallback={
          <div className="absolute inset-x-0 top-3 z-20 mx-auto w-fit rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs text-[var(--muted-foreground)] shadow-sm">
            Loading comments…
          </div>
        }
      >
        <Pins containerRef={containerRef} iframeRef={iframeRef} />
      </ClientSideSuspense>
    </div>
  );
}

/** Thread-count badge for the Comments toggle button. Rendered inside
 *  the room (needs useThreads), so the button itself stays outside. */
export function ThreadCount({
  render,
}: {
  render: (count: number) => React.ReactNode;
}) {
  return (
    <ClientSideSuspense fallback={render(0)}>
      <ThreadCountInner render={render} />
    </ClientSideSuspense>
  );
}

function ThreadCountInner({
  render,
}: {
  render: (count: number) => React.ReactNode;
}) {
  const { threads } = useThreads();
  // The badge is "things needing attention" — resolved threads drop out.
  const open = threads.filter((t) => !t.resolved).length;
  return <>{render(open)}</>;
}
