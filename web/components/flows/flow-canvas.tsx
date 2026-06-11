"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Flow } from "@/lib/flows";

/* Zoomable, pannable flow canvas for the gallery's Flows view —
 * InVision-board style. Lanes render as horizontal bands, sections as
 * columns separated by dashed dividers, screens as thumbnail cards.
 *
 * Interactions:
 * - Drag anywhere on the canvas background to pan.
 * - Mouse wheel / trackpad scroll zooms toward the cursor.
 * - +/− buttons and a "Fit" reset in the bottom-right corner.
 * - Click a screen card → onOpenScreen(href): the parent flips back to
 *   Prototype view with the iframe at that screen.
 *
 * Implementation: one inner div carrying translate+scale; no canvas/2D
 * context, no graph library — we don't need edges or drag-rearrange.
 */

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2.5;
const FIT_PADDING = 48;

export function FlowCanvas({
  flow,
  onOpenScreen,
}: {
  flow: Flow;
  onOpenScreen: (href: string) => void;
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState({ x: FIT_PADDING, y: FIT_PADDING, z: 0.6 });
  const drag = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  /* Fit the whole flow into the viewport. */
  const fit = useCallback(() => {
    const vp = viewportRef.current;
    const content = contentRef.current;
    if (!vp || !content) return;
    const vw = vp.clientWidth - FIT_PADDING * 2;
    const vh = vp.clientHeight - FIT_PADDING * 2;
    // content's natural (unscaled) size
    const cw = content.scrollWidth;
    const ch = content.scrollHeight;
    if (cw === 0 || ch === 0) return;
    const z = Math.min(Math.max(Math.min(vw / cw, vh / ch), MIN_ZOOM), 1);
    setTransform({
      x: (vp.clientWidth - cw * z) / 2,
      y: (vp.clientHeight - ch * z) / 2,
      z,
    });
  }, []);

  // Fit on mount (after thumbnails get their layout box).
  useEffect(() => {
    const t = setTimeout(fit, 50);
    return () => clearTimeout(t);
  }, [fit]);

  const zoomAt = useCallback(
    (clientX: number, clientY: number, factor: number) => {
      const vp = viewportRef.current;
      if (!vp) return;
      const rect = vp.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      setTransform((t) => {
        const z = Math.min(Math.max(t.z * factor, MIN_ZOOM), MAX_ZOOM);
        const scale = z / t.z;
        return {
          z,
          x: px - (px - t.x) * scale,
          y: py - (py - t.y) * scale,
        };
      });
    },
    [],
  );

  /* Wheel zoom — non-passive listener so preventDefault stops the page
     from scrolling underneath the canvas. */
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0015);
      zoomAt(e.clientX, e.clientY, factor);
    }
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  function onPointerDown(e: React.PointerEvent) {
    // Left button / touch only; let screen-card clicks through.
    if (e.button !== 0) return;
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: transform.x,
      baseY: transform.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!dragging && Math.hypot(dx, dy) > 4) setDragging(true);
    /* Compute the next position eagerly — the updater must not read
       drag.current, which onPointerUp nulls before React (possibly)
       runs the queued updater during the next render. */
    const x = d.baseX + dx;
    const y = d.baseY + dy;
    setTransform((t) => ({ ...t, x, y }));
  }

  function onPointerUp() {
    drag.current = null;
    // Delay clearing so the click handler on cards can check it.
    setTimeout(() => setDragging(false), 0);
  }

  function openScreen(href: string) {
    if (dragging) return; // it was a pan, not a click
    onOpenScreen(href);
  }

  return (
    <div
      ref={viewportRef}
      className="relative h-full w-full overflow-hidden bg-[#1e2530] select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="application"
      aria-label="Flow canvas — drag to pan, scroll to zoom, click a screen to open it in the prototype"
      style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
    >
      <div
        ref={contentRef}
        className="absolute left-0 top-0 w-max origin-top-left"
        style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.z})` }}
      >
        {flow.lanes.map((lane, li) => (
          <div
            key={`${lane.title}-${li}`}
            className={li > 0 ? "border-t border-white/10" : undefined}
          >
            {/* Lane band header */}
            <div className="bg-white/5 px-6 py-2 text-xs font-medium uppercase tracking-wider text-white/60">
              {lane.title}
            </div>
            <div className="flex items-start px-6 py-8">
              {lane.sections.map((section, si) => (
                <div
                  key={`${section.title}-${si}`}
                  className={
                    "min-w-[280px] px-6 " +
                    (si > 0 ? "border-l border-dashed border-white/20" : "")
                  }
                >
                  <h3 className="mb-5 text-lg font-semibold text-white">
                    {section.title}
                  </h3>
                  <div className="flex flex-wrap gap-6">
                    {section.screens.map((screen) => (
                      <figure key={screen.id} className="w-[240px]">
                        <figcaption className="mb-1.5 truncate text-xs text-white/70">
                          {screen.caption}
                        </figcaption>
                        <button
                          type="button"
                          onClick={() => openScreen(screen.href)}
                          aria-label={`Open "${screen.caption}" in the prototype`}
                          className="block w-full cursor-pointer overflow-hidden rounded-md border border-white/15 bg-white shadow-lg transition hover:border-[#B0F3FE] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0F3FE]"
                        >
                          <img
                            src={screen.thumbnailUrl}
                            alt=""
                            draggable={false}
                            className="block aspect-[16/10] w-full object-cover object-top"
                          />
                        </button>
                      </figure>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-md border border-white/15 bg-[#0f141b]/90 p-1 shadow-lg backdrop-blur">
        <button
          type="button"
          aria-label="Zoom out"
          onClick={(e) => {
            e.stopPropagation();
            const vp = viewportRef.current!.getBoundingClientRect();
            zoomAt(vp.left + vp.width / 2, vp.top + vp.height / 2, 1 / 1.25);
          }}
          className="flex h-8 w-8 items-center justify-center rounded text-white/80 hover:bg-white/10 hover:text-white"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>remove</span>
        </button>
        <span className="min-w-12 text-center text-xs tabular-nums text-white/70">
          {Math.round(transform.z * 100)}%
        </span>
        <button
          type="button"
          aria-label="Zoom in"
          onClick={(e) => {
            e.stopPropagation();
            const vp = viewportRef.current!.getBoundingClientRect();
            zoomAt(vp.left + vp.width / 2, vp.top + vp.height / 2, 1.25);
          }}
          className="flex h-8 w-8 items-center justify-center rounded text-white/80 hover:bg-white/10 hover:text-white"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>add</span>
        </button>
        <div className="mx-0.5 h-5 w-px bg-white/15" aria-hidden />
        <button
          type="button"
          aria-label="Fit flow to view"
          onClick={(e) => {
            e.stopPropagation();
            fit();
          }}
          className="flex h-8 items-center justify-center rounded px-2 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white"
        >
          Fit
        </button>
      </div>
    </div>
  );
}
