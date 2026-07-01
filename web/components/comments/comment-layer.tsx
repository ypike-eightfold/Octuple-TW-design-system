"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ClientSideSuspense, useThreads } from "@liveblocks/react/suspense";
import { Composer, Thread } from "@liveblocks/react-ui";
import type { ThreadData } from "@liveblocks/client";
import "@liveblocks/react-ui/styles.css";

/** Stable identity for the iframe's current screen — `pathname + search`
 *  with no origin, no hash. We use this as a thread-metadata field so
 *  pins stay attached to the screen they were left on, even when the
 *  iframe gets retargeted via the flow canvas. Trade-offs:
 *  - Drop origin: pins survive moving the gallery between hostnames
 *    (local vs Vercel).
 *  - Drop hash: pin position is already captured via scroll metadata;
 *    a hash change isn't a different screen.
 *  - Keep search: routes that differentiate by query are different
 *    screens (e.g., ?role=manager). */
export function screenKeyFromUrl(url: string): string {
  try {
    const u = new URL(url, "http://placeholder.invalid");
    return u.pathname + u.search;
  } catch {
    return url;
  }
}

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
        /* Pin fill is InVision pink (#FF3366) — picked specifically
           because it never blends into product UI the way blues do.
           Active/open pins invert (white fill, pink ring, dark number)
           so the selected pin pops AND its number stays high-contrast. */
        "flex h-7 w-7 items-center justify-center rounded-full rounded-bl-none border-2 text-xs font-semibold shadow-md transition-transform " +
        (active
          ? "scale-110 border-[#FF3366] bg-white text-[#1f2937]"
          : resolved
            ? "border-white bg-[#94a3b8] text-white opacity-70 hover:opacity-100 hover:scale-110"
            : "border-white bg-[#FF3366] text-white hover:scale-110")
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
  currentScreen,
  protoStateJson,
  focusThreadId,
  onFocusHandled,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  /** The screen the iframe is showing right now — key match for thread metadata. */
  currentScreen: string;
  /** JSON descriptor of the prototype's current state, captured into new
   *  threads so the list can restore the flow later. Undefined for
   *  prototypes that don't opt into the state bridge. */
  protoStateJson?: string;
  /** When set (from the comments list), open this thread's popover once
   *  it's present on the current screen, and restore its scroll. */
  focusThreadId?: string | null;
  onFocusHandled?: () => void;
}) {
  const { threads: allThreads } = useThreads();
  /* Three eras of metadata, all must keep working:

     1. NO `metadata.screen` — created before any per-screen filter
        existed. Render on every screen so legacy pins don't disappear.

     2. URL-ONLY string (no `#`) — created during the first iteration of
        this PR, when the screen key was just `screenKeyFromUrl(iframeSrc)`.
        Match against the URL portion of the current screen key so these
        pins still appear on the route they were dropped on (across any
        h1 within that route).

     3. COMPOSITE `<url>#<h1>` (has `#`) — current schema. Strict
        equality match against currentScreen, which is also composite.

     Without era 2 handling, mid-rollout pins fall into a gap (their
     URL-only string never equals a composite key with a `#` in it),
     so they vanish from every screen. That's what happened to comment
     8 earlier today; this filter restores it. */
  /* currentScreen is `<urlKey>#<h1>` (or just `<urlKey>` if h1 is
     unknown). Split on `#` to get the URL portion for era-2 matching;
     URL parsing would also work but split is robust to any character
     in the h1 (e.g., `?` or another `#`). */
  const currentUrlKey = currentScreen.split("#")[0];
  const threads = useMemo(
    () =>
      allThreads.filter((t) => {
        const stored = t.metadata.screen;
        if (typeof stored !== "string") return true; // era 1
        if (!stored.includes("#")) return stored === currentUrlKey; // era 2
        return stored === currentScreen; // era 3
      }),
    [allThreads, currentScreen, currentUrlKey],
  );
  const [openThreadId, setOpenThreadId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftPin | null>(null);

  /* Focus-from-list: when the comments list asks to open a thread, wait
     until that thread is actually present on the current screen (the
     iframe may still be navigating), then open its popover + restore
     scroll. Depending on `threads` re-runs this as screens settle. */
  useEffect(() => {
    if (!focusThreadId) return;
    const target = threads.find((t) => t.id === focusThreadId);
    if (!target) return;
    setDraft(null);
    setOpenThreadId(focusThreadId);
    try {
      iframeRef.current?.contentWindow?.scrollTo(
        target.metadata.scrollX ?? 0,
        target.metadata.scrollY ?? 0,
      );
    } catch {
      /* cross-origin/detached — pin stays frame-anchored */
    }
    onFocusHandled?.();
  }, [focusThreadId, threads, iframeRef, onFocusHandled]);

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
              /* `screen` ties this pin to the iframe's current route so
                 it only re-appears on the same screen later. See
                 screenKeyFromUrl for the normalization rule. */
              metadata={{
                ...draft,
                ...currentScroll(),
                screen: currentScreen,
                /* Capture the prototype's current state so the list can
                   restore the exact flow. Only set when the prototype
                   opted into the bridge (otherwise omit — metadata values
                   can't be undefined). */
                ...(protoStateJson ? { state: protoStateJson } : {}),
              }}
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
  currentScreen,
  protoStateJson,
  focusThreadId,
  onFocusHandled,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  /** The screen the iframe is currently showing — used to filter which
   *  pins render and to tag new threads with their screen. Pass the
   *  output of `screenKeyFromUrl(iframeSrc)`. */
  currentScreen: string;
  /** JSON of the prototype's current state, captured into new threads. */
  protoStateJson?: string;
  /** Thread to open programmatically (from the comments list). */
  focusThreadId?: string | null;
  onFocusHandled?: () => void;
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
        <Pins
          containerRef={containerRef}
          iframeRef={iframeRef}
          currentScreen={currentScreen}
          protoStateJson={protoStateJson}
          focusThreadId={focusThreadId}
          onFocusHandled={onFocusHandled}
        />
      </ClientSideSuspense>
    </div>
  );
}

/** Plain-text snippet of a thread's first comment, for the list. Walks
 *  the Liveblocks comment body (paragraphs → inline nodes) collecting
 *  text; mentions/links contribute their visible text where present. */
export function firstCommentText(thread: ThreadData): string {
  const body = thread.comments?.[0]?.body as
    | { content?: Array<{ children?: Array<Record<string, unknown>> }> }
    | undefined;
  if (!body?.content) return "";
  const parts: string[] = [];
  for (const block of body.content) {
    for (const node of block.children ?? []) {
      if (typeof node.text === "string") parts.push(node.text);
      else if (typeof node.id === "string") parts.push(`@${node.id}`);
    }
  }
  return parts.join("").trim();
}

/** The navigable URL portion of a thread's screen key (drops the `#h1`
 *  suffix). Empty for legacy threads with no screen. */
export function threadScreenUrl(thread: ThreadData): string {
  const screen = thread.metadata.screen;
  return typeof screen === "string" ? screen.split("#")[0] : "";
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

/** Open-thread count grouped by screen key. Used by the flow canvas to
 *  badge each screen card with how many comments live on it, so a
 *  designer can see at a glance "screen X has discussion". The render
 *  prop receives a Record<screenKey, number>; missing keys = 0.
 *
 *  Legacy threads (no `metadata.screen`) are intentionally NOT counted
 *  per-screen — they render on every screen via the Pins filter, so
 *  attributing them to one card would over-count. The global
 *  `ThreadCount` badge still includes them, which is the right surface
 *  for "this design has discussion overall." */
export function ThreadCountsByScreen({
  render,
}: {
  render: (countsByScreen: Record<string, number>) => React.ReactNode;
}) {
  return (
    <ClientSideSuspense fallback={render({})}>
      <ThreadCountsByScreenInner render={render} />
    </ClientSideSuspense>
  );
}

function ThreadCountsByScreenInner({
  render,
}: {
  render: (countsByScreen: Record<string, number>) => React.ReactNode;
}) {
  const { threads } = useThreads();
  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const t of threads) {
      if (t.resolved) continue;
      const stored = t.metadata.screen;
      /* Skip era-1 (no key) and era-2 (URL-only) threads — both appear
         on multiple screens via the Pins filter above, so attributing
         them to a single flow card would mislead. The global
         ThreadCount badge still includes them. Only composite-keyed
         threads (era 3) get per-screen counts. */
      if (typeof stored !== "string") continue;
      if (!stored.includes("#")) continue;
      out[stored] = (out[stored] ?? 0) + 1;
    }
    return out;
  }, [threads]);
  return <>{render(counts)}</>;
}
