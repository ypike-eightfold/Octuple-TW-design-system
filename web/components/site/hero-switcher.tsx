"use client";

import { useEffect, useRef, useState } from "react";
import { useHero } from "./hero-provider";

/** Small icon-only trigger in the top nav that opens a popover with
 *  thumbnails of every hero in the registry. Picking one updates the
 *  HeroProvider; the home page re-renders with the chosen artwork. */
export function HeroSwitcher() {
  const { heroes, heroId, setHeroId } = useHero();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click + Escape so the popover behaves like a menu.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change hero illustration"
        aria-haspopup="menu"
        aria-expanded={open}
        className={
          "inline-flex h-7 w-7 items-center justify-center rounded transition " +
          (open
            ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]")
        }
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>
          image
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Hero illustrations"
          className="absolute right-0 top-9 z-50 w-72 rounded-md border border-[var(--border)] bg-[var(--card)] p-2 shadow-lg"
        >
          <div className="px-2 pt-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Hero illustration
          </div>
          <ul className="flex flex-col gap-1">
            {heroes.map((h) => {
              const active = h.id === heroId;
              return (
                <li key={h.id}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => {
                      setHeroId(h.id);
                      setOpen(false);
                    }}
                    className={
                      "flex w-full items-center gap-3 rounded p-2 text-left transition " +
                      (active
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                        : "text-[var(--foreground)] hover:bg-[var(--muted)]")
                    }
                  >
                    <img
                      src={h.src.light}
                      alt=""
                      aria-hidden
                      className="h-10 w-16 shrink-0 rounded border border-[var(--border)] bg-white object-cover"
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{h.label}</div>
                      <div className="truncate text-xs text-[var(--muted-foreground)]">
                        {h.description}
                      </div>
                    </div>
                    {active && (
                      <span
                        className="material-symbols-outlined ml-auto shrink-0"
                        style={{ fontSize: 18 }}
                        aria-hidden
                      >
                        check
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
