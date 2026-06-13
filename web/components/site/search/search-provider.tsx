"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface SearchCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
}

const Ctx = createContext<SearchCtx | null>(null);

/**
 * Holds the global "is the search modal open?" state. Mounted once at the
 * root site layout so both `<SearchTrigger />` (in TopNav) and
 * `<SearchDialog />` (rendered alongside it) can share it without prop
 * drilling.
 *
 * Also owns the global Cmd+K / Ctrl+K / `/` shortcuts so the modal can be
 * opened from any route without each consumer wiring its own key listener.
 */
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // `/` opens the modal — but only when the user isn't already typing
      // somewhere else. Skip if focus is on an input, textarea, or any
      // contentEditable element.
      if (e.key === "/" && !meta) {
        const t = e.target as HTMLElement | null;
        const tag = t?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || t?.isContentEditable) return;
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <Ctx.Provider value={{ open, setOpen, toggle }}>{children}</Ctx.Provider>;
}

export function useSearch(): SearchCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSearch must be used inside <SearchProvider />");
  return v;
}
