"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_HERO_ID, getHeroById, HEROES, type Hero } from "./hero-registry";

interface HeroContextValue {
  hero: Hero;
  heroId: string;
  setHeroId: (id: string) => void;
  heroes: Hero[];
}

const HeroContext = createContext<HeroContextValue | null>(null);

const STORAGE_KEY = "ef-gallery:hero";

export function HeroProvider({ children }: { children: React.ReactNode }) {
  // Default to the canonical hero on the server / first paint. Restoring
  // from localStorage happens in the effect below to avoid a hydration
  // mismatch — if the user picked a non-default hero, you may see one
  // frame of the default before it flips.
  const [heroId, setHeroIdInternal] = useState<string>(DEFAULT_HERO_ID);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && HEROES.some((h) => h.id === stored)) {
        setHeroIdInternal(stored);
      }
    } catch {
      /* localStorage unavailable; stick with default */
    }
  }, []);

  const setHeroId = useCallback((id: string) => {
    setHeroIdInternal(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  return (
    <HeroContext.Provider value={{ hero: getHeroById(heroId), heroId, setHeroId, heroes: HEROES }}>
      {children}
    </HeroContext.Provider>
  );
}

export function useHero(): HeroContextValue {
  const ctx = useContext(HeroContext);
  if (!ctx) {
    // Safe fallback for stories / tests that render outside the provider.
    return {
      hero: getHeroById(null),
      heroId: DEFAULT_HERO_ID,
      setHeroId: () => undefined,
      heroes: HEROES,
    };
  }
  return ctx;
}
