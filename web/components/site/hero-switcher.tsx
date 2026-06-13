"use client";

import { useHero } from "./hero-provider";

/** Segmented control listing every hero in the registry, styled to
 *  match the ThemeSwitcher sitting next to it in the TopNav. One icon
 *  button per hero — picking one updates the HeroProvider and the home
 *  page re-renders with the chosen artwork. */
export function HeroSwitcher() {
  const { heroes, heroId, setHeroId } = useHero();

  return (
    <div
      role="radiogroup"
      aria-label="Hero illustration"
      className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--card)] p-0.5"
    >
      {heroes.map(h => {
        const isActive = h.id === heroId;
        return (
          <button
            key={h.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={h.label}
            title={h.label}
            onClick={() => setHeroId(h.id)}
            className={
              "inline-flex h-7 w-7 items-center justify-center rounded transition " +
              (isActive
                ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]")
            }
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>
              {h.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
}
