"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useTheme } from "next-themes";
import { Button } from "@tonyh-2-eightfold/ef-design-system";
import { commentsEnabled } from "@/components/comments/comments-room";
import {
  CommentLayer,
  ThreadCountsByScreen,
  screenKeyFromUrl,
  threadScreenUrl,
} from "@/components/comments/comment-layer";
import { CommentsControl } from "@/components/comments/comments-list";
import {
  PROTO_STATE,
  PROTO_STATE_RESTORE,
  PROTO_STATE_REQUEST,
  parseState,
  stringifyState,
} from "@/components/comments/proto-state";
import type { ThreadData } from "@liveblocks/client";
import { FlowCanvas } from "@/components/flows/flow-canvas";
import type { Flow } from "@/lib/flows";

/* Iframe + viewport-size switcher + Take screenshot + Full screen.

   Fullscreen target is the entire <section> (not just the iframe), so
   the viewport switcher / Take screenshot / Full screen controls stay
   reachable while fullscreen. In fullscreen the section flips to a
   flex column with the control bar pinned to the top and the iframe
   filling the rest via CSS that keys on the `:fullscreen` state.

   The Take screenshot button uses html-to-image against the iframe's
   contentDocument.body. Works because the iframe is same-origin (it
   loads /content/designs/<slug>/index.html from the host app), and
   sandbox="allow-same-origin allow-scripts" preserves that access. */

type Viewport = "desktop" | "tablet-landscape" | "tablet-portrait" | "mobile" | "reflow";

const VIEWPORTS: { id: Viewport; label: string; width: number | null; icon: string }[] = [
  { id: "desktop", label: "Desktop", width: null, icon: "desktop_windows" },
  { id: "tablet-landscape", label: "Tablet landscape", width: 1024, icon: "tablet" },
  { id: "tablet-portrait", label: "Tablet portrait", width: 800, icon: "tablet_android" },
  { id: "mobile", label: "Mobile", width: 420, icon: "smartphone" },
  /* WCAG 2.2 § 1.4.10 Reflow: content must work at 320 CSS px with no
     horizontal scrolling. One click here replaces the manual check.
     Named to match the "Responsive reflow" item in the Figma Include
     plugin checklist designers already use. */
  { id: "reflow", label: "Responsive reflow", width: 320, icon: "crop_portrait" },
];

export function PrototypeFullscreen({
  previewUrl,
  title,
  slug,
  flow,
}: {
  previewUrl: string;
  title: string;
  slug: string;
  flow: Flow;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [capturing, setCapturing] = useState(false);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [commentsOn, setCommentsOn] = useState(false);
  const [view, setView] = useState<"prototype" | "flows">("prototype");
  const [linkCopied, setLinkCopied] = useState(false);
  const { resolvedTheme } = useTheme();
  /* The iframe's current screen. Starts at the design's entry point;
     clicking a screen on the flow canvas retargets it. */
  const [iframeSrc, setIframeSrc] = useState(previewUrl);

  /** Push the gallery's resolved theme (light | dark) into the iframe so
   *  prototypes that opt in can flip their own surfaces to match. Posts
   *  on iframe load, when the user toggles the gallery theme, and on
   *  request from the iframe (handshake for SPAs that mount after the
   *  load event fires). Prototypes opt in by listening for
   *  `{ type: 'gallery-theme', theme }` messages — anything that
   *  ignores them just keeps rendering its default styling. */
  useEffect(() => {
    const post = () => {
      const win = iframeRef.current?.contentWindow;
      if (!win || !resolvedTheme) return;
      win.postMessage({ type: "gallery-theme", theme: resolvedTheme }, "*");
    };

    const onIframeLoad = () => post();
    const onMessage = (e: MessageEvent) => {
      if (e?.data?.type === "gallery-theme-request") post();
    };

    iframeRef.current?.addEventListener("load", onIframeLoad);
    window.addEventListener("message", onMessage);
    // Initial post (covers the case where the iframe finished loading
    // before this effect attached).
    post();

    return () => {
      iframeRef.current?.removeEventListener("load", onIframeLoad);
      window.removeEventListener("message", onMessage);
    };
  }, [resolvedTheme, iframeSrc]);

  function openScreenFromFlow(href: string) {
    setIframeSrc(href);
    setView("prototype");
  }

  /* ── Comments: prototype state bridge + jump-to-comment ──────────────
     Comments capture the prototype's state (persona/flow) via a generic
     postMessage bridge, and the comments list can jump back to a
     comment's screen + state. See components/comments/proto-state.ts. */

  // Latest state descriptor the prototype has announced, as JSON — stamped
  // into new comments so the list can restore the flow later.
  const [protoStateJson, setProtoStateJson] = useState<string | undefined>(undefined);
  // Thread the list asked to open; handed to CommentLayer, cleared once opened.
  const [focusThreadId, setFocusThreadId] = useState<string | null>(null);
  // A jump awaiting the target screen to be ready (set during navigation).
  const pendingJumpRef = useRef<{ threadId: string; state: Record<string, unknown> | null } | null>(null);

  function postToIframe(message: unknown) {
    iframeRef.current?.contentWindow?.postMessage(message, "*");
  }

  const applyPendingJump = useCallback(() => {
    const j = pendingJumpRef.current;
    if (!j) return;
    if (j.state) postToIframe({ type: PROTO_STATE_RESTORE, state: j.state });
    setFocusThreadId(j.threadId);
    pendingJumpRef.current = null;
  }, []);

  function jumpToThread(thread: ThreadData) {
    setView("prototype");
    setCommentsOn(true);
    const url = threadScreenUrl(thread);
    const needNav = !!url && screenKeyFromUrl(iframeSrc) !== url;
    pendingJumpRef.current = {
      threadId: thread.id,
      state: parseState(thread.metadata.state),
    };
    if (needNav) {
      // Reload the iframe at the comment's screen; the bridge/load effect
      // applies the jump once the new screen is ready.
      setIframeSrc(url);
    } else {
      // Same screen — the prototype is already mounted and listening.
      applyPendingJump();
    }
  }

  /* State bridge: keep the latest descriptor for capture, and complete a
     pending jump once the (possibly just-navigated) prototype is ready. */
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const d = e?.data;
      if (!d || typeof d !== "object") return;
      if (d.type === PROTO_STATE) {
        setProtoStateJson(stringifyState(d.state));
        // A prototype announcing its state = it's mounted + listening, so
        // now is the safe moment to push a pending restore.
        if (pendingJumpRef.current) applyPendingJump();
      }
    }
    function onLoad() {
      // Ask the (new) prototype for its state — doubles as readiness ping.
      postToIframe({ type: PROTO_STATE_REQUEST });
      // Fallback for prototypes that don't opt into the bridge: still open
      // the thread + restore scroll shortly after load.
      window.setTimeout(() => {
        if (pendingJumpRef.current) applyPendingJump();
      }, 500);
    }
    const iframe = iframeRef.current;
    window.addEventListener("message", onMessage);
    iframe?.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("message", onMessage);
      iframe?.removeEventListener("load", onLoad);
    };
  }, [iframeSrc, applyPendingJump]);

  const active = VIEWPORTS.find((v) => v.id === viewport) ?? VIEWPORTS[0];

  /* Per-screen key for comment scoping. Two sources, in priority order:
     1. `screen-change` postMessage from the iframe — explicit opt-in
        for prototypes that want full control over their key.
     2. The iframe's first <h1> text — automatic detection for SPA-style
        prototypes that don't post explicit screen-change events (e.g.,
        Perform 360 changes content via in-iframe React state, so the
        URL stays the same but the h1 always changes per screen).
     3. Falls back to just the URL key if neither signal is present.
     The composite key (`<url>#<h1>`) keeps screens distinct in both
     multi-route prototypes (URL varies, h1 may not — e.g., Career Hub
     Continuous Sync) and single-route SPA prototypes (URL constant,
     h1 varies — e.g., Perform 360). */
  const [explicitScreen, setExplicitScreen] = useState<string | null>(null);
  const [observedH1, setObservedH1] = useState<string | null>(null);
  const currentScreen = explicitScreen
    ?? `${screenKeyFromUrl(iframeSrc)}#${observedH1 ?? ""}`;

  /* Wire both sources. Reset on iframeSrc change so a flow-canvas jump
     to a new screen doesn't carry the previous screen's key forward
     before the new iframe content has signalled. */
  useEffect(() => {
    setExplicitScreen(null);
    setObservedH1(null);

    function onMessage(e: MessageEvent) {
      if (
        e?.data?.type === "screen-change" &&
        typeof e.data.screen === "string" &&
        e.data.screen.length > 0
      ) {
        setExplicitScreen(e.data.screen);
      }
    }
    window.addEventListener("message", onMessage);

    let observer: MutationObserver | null = null;
    function updateFromH1(doc: Document) {
      const h1 = doc.querySelector("h1");
      const text = h1?.textContent?.trim();
      setObservedH1(text && text.length > 0 ? text : null);
    }
    function attachObserver() {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      observer?.disconnect();
      updateFromH1(doc);
      observer = new MutationObserver(() => updateFromH1(doc));
      observer.observe(doc.body ?? doc.documentElement, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    const iframe = iframeRef.current;
    iframe?.addEventListener("load", attachObserver);
    /* Try once immediately for the case where the iframe has already
       loaded before this effect attached (e.g., StrictMode double-run). */
    attachObserver();

    return () => {
      window.removeEventListener("message", onMessage);
      iframe?.removeEventListener("load", attachObserver);
      observer?.disconnect();
    };
  }, [iframeSrc]);

  /* Track fullscreen state so we can update layout (button bar pinned
     to top + iframe fills the rest). The browser also auto-applies the
     :fullscreen pseudo-class, which the CSS below uses for layout. */
  useEffect(() => {
    function onChange() {
      setIsFullscreen(document.fullscreenElement === sectionRef.current);
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function enterFullscreen() {
    const el = sectionRef.current;
    if (!el) return;
    el.requestFullscreen?.().catch(() => {
      window.open(previewUrl, "_blank", "noopener,noreferrer");
    });
  }

  function exitFullscreen() {
    document.exitFullscreen?.().catch(() => {});
  }

  /** Copy the current gallery page URL so a teammate can open the same
   *  prototype (with any deep link to a screen via the iframe hash). */
  async function copyShareLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for browsers without clipboard API or insecure contexts.
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* give up silently */ }
      ta.remove();
    }
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 1600);
  }

  async function takeScreenshot() {
    const el = iframeRef.current;
    if (!el) return;
    const doc = el.contentDocument;
    const node = doc?.body;
    if (!node) {
      window.open(previewUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setCapturing(true);
    try {
      const width = doc?.documentElement?.scrollWidth ?? node.scrollWidth;
      const height = doc?.documentElement?.scrollHeight ?? node.scrollHeight;
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        width,
        height,
        backgroundColor: "#ffffff",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${slug}-${viewport}-screenshot.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      window.open(previewUrl, "_blank", "noopener,noreferrer");
    } finally {
      setCapturing(false);
    }
  }

  return (
    <section
      ref={sectionRef}
      /* In fullscreen: full-screen flex column with a small inner padding
         + bg, so the control bar reads against the page colour instead
         of the dark default fullscreen backdrop. CSS in globals.css ties
         the iframe height to fill the remaining space. */
      className={
        "mt-8 [&:fullscreen]:mt-0 [&:fullscreen]:flex [&:fullscreen]:flex-col " +
        "[&:fullscreen]:bg-background [&:fullscreen]:p-4 [&:fullscreen]:gap-3"
      }
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 [section:fullscreen_&]:mb-0">
        {/* Prototype | Flows toggle — same visual language as the
            viewport switcher on the right. */}
        <div
          role="radiogroup"
          aria-label="View"
          className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--card)] p-0.5"
        >
          {(
            [
              { id: "prototype", label: "Prototype", icon: "play_circle" },
              { id: "flows", label: "Flows", icon: "account_tree" },
            ] as const
          ).map((v) => {
            const isActive = view === v.id;
            return (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setView(v.id)}
                className={
                  "inline-flex h-7 items-center justify-center gap-1.5 rounded px-3 text-xs font-medium transition-colors " +
                  (isActive
                    ? "bg-[#B0F3FE] text-[#054D7B]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]")
                }
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16 }}
                  aria-hidden
                >
                  {v.icon}
                </span>
                {v.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Viewport switcher — prototype view only; sizes don't apply
              to the flow canvas. */}
          {view === "prototype" && (
          <div
            role="radiogroup"
            aria-label="Viewport size"
            className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--card)] p-0.5"
          >
            {VIEWPORTS.map((v) => {
              const isActive = v.id === viewport;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={v.label}
                  title={`${v.label}${v.width ? ` (${v.width}px)` : ""}`}
                  onClick={() => setViewport(v.id)}
                  className={
                    "inline-flex h-7 items-center justify-center rounded px-2.5 text-xs font-medium transition-colors " +
                    (isActive
                      ? "bg-[#B0F3FE] text-[#054D7B]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]")
                  }
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                    aria-hidden
                  >
                    {v.icon}
                  </span>
                </button>
              );
            })}
          </div>
          )}

          {view === "prototype" && commentsEnabled() && (
            <CommentsControl
              commentsOn={commentsOn}
              onCommentsOnChange={setCommentsOn}
              onJump={jumpToThread}
            />
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={copyShareLink}
            aria-live="polite"
            leadingIcon={
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 14 }}
                aria-hidden
              >
                {linkCopied ? "check" : "link"}
              </span>
            }
          >
            {linkCopied ? "Copied" : "Share link"}
          </Button>

          {view === "prototype" && (
          <Button
            variant="secondary"
            size="sm"
            onClick={takeScreenshot}
            disabled={capturing}
            leadingIcon={
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 14 }}
                aria-hidden
              >
                photo_camera
              </span>
            }
          >
            {capturing ? "Capturing…" : "Take screenshot"}
          </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={isFullscreen ? exitFullscreen : enterFullscreen}
            leadingIcon={
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 14 }}
                aria-hidden
              >
                {isFullscreen ? "fullscreen_exit" : "fullscreen"}
              </span>
            }
          >
            {isFullscreen ? "Exit full screen" : "Full screen"}
          </Button>
        </div>
      </div>

      {view === "flows" ? (
        /* Flows view — the zoomable canvas takes the iframe's box.
           Same height + fullscreen behavior as the prototype frame.
           Wrapped in ThreadCountsByScreen so each screen card can show
           a comment-count badge — the "where are the comments?" map. */
        <div className="h-[900px] overflow-hidden rounded-lg border border-[var(--border)] [section:fullscreen_&]:h-auto [section:fullscreen_&]:flex-1 [section:fullscreen_&]:min-h-0">
          {commentsEnabled() ? (
            <ThreadCountsByScreen
              render={(counts) => (
                <FlowCanvas
                  flow={flow}
                  onOpenScreen={openScreenFromFlow}
                  commentCounts={counts}
                />
              )}
            />
          ) : (
            <FlowCanvas flow={flow} onOpenScreen={openScreenFromFlow} />
          )}
        </div>
      ) : (
      /* Iframe wrapper. Default state: fixed 900px iframe (with min-w
          for desktop layout). Fullscreen state: wrapper grows to fill
          remaining space; iframe height keyed off CSS variable below. */
      <div
        className={
          "rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 " +
          (active.width == null ? "overflow-x-auto overflow-y-hidden" : "overflow-hidden") +
          " [section:fullscreen_&]:flex-1 [section:fullscreen_&]:min-h-0"
        }
      >
        <div
          className={
            (active.width == null ? "w-full" : "mx-auto") +
            " h-full relative"
          }
          style={active.width != null ? { width: active.width, maxWidth: "100%" } : undefined}
        >
          <iframe
            ref={iframeRef}
            key={`${viewport}-${iframeSrc}`}
            src={iframeSrc}
            title={`Prototype: ${title}`}
            /* Default 900px tall; in fullscreen the section gives this
               iframe the rest of the viewport via the
               .prototype-iframe in globals.css rule. */
            className={
              "prototype-iframe block h-[900px] [section:fullscreen_&]:h-full " +
              (active.width == null ? "w-full min-w-[1440px]" : "w-full")
            }
            sandbox="allow-same-origin allow-scripts allow-forms"
            allowFullScreen
          />
          {/* Comment overlay — sits inside the same positioned box as the
              iframe, so pins track the frame exactly (including the
              horizontal scroll at desktop width). While ON, the overlay
              captures clicks and the prototype underneath is inert. */}
          {commentsEnabled() && commentsOn && (
            <CommentLayer
              iframeRef={iframeRef}
              currentScreen={currentScreen}
              protoStateJson={protoStateJson}
              focusThreadId={focusThreadId}
              onFocusHandled={() => setFocusThreadId(null)}
            />
          )}
        </div>
      </div>
      )}
    </section>
  );
}
