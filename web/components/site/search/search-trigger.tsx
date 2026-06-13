"use client";

import { useEffect, useState } from "react";
import { useSearch } from "./search-provider";

/** Pill-style search trigger that sits in the top nav, left of the
 *  HeroSwitcher. Shows the keyboard shortcut so the affordance is
 *  obvious — collapses to icon-only on mobile. */
export function SearchTrigger() {
  const { setOpen } = useSearch();
  // The keyboard shortcut chip is platform-dependent — show ⌘K on macOS
  // and Ctrl K everywhere else. Compute after mount to avoid an
  // SSR/CSR mismatch.
  const [shortcut, setShortcut] = useState<string | null>(null);
  useEffect(() => {
    const mac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
    setShortcut(mac ? "⌘K" : "Ctrl K");
  }, []);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Search the site"
      title="Search (Cmd+K)"
      className={
        "inline-flex h-7 items-center gap-2 rounded-md border border-[var(--border)] " +
        "bg-[var(--card)] px-2 text-sm text-[var(--muted-foreground)] " +
        "transition hover:text-[var(--foreground)] hover:bg-[var(--muted)] " +
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
      }
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>
        search
      </span>
      <span className="hidden sm:inline">Search…</span>
      {shortcut && (
        <kbd className="hidden sm:inline rounded border border-[var(--border)] bg-[var(--background)] px-1 py-px text-[10px] font-medium text-[var(--muted-foreground)]">
          {shortcut}
        </kbd>
      )}
    </button>
  );
}
