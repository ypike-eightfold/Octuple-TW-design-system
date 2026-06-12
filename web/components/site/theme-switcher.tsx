"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/** Three-way Light / Dark / System segmented control. Mounted in the
 *  TopNav next to the auth area. Renders nothing until mounted so the
 *  first-paint theme (resolved from localStorage / system) matches what
 *  next-themes ends up applying — otherwise the control would briefly
 *  show "system" when the user has explicitly picked dark. */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const options = [
    { id: "light",  label: "Light",  icon: "light_mode" },
    { id: "dark",   label: "Dark",   icon: "dark_mode" },
    { id: "system", label: "System", icon: "computer" },
  ] as const;

  const active = mounted ? (theme ?? "system") : null;

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--card)] p-0.5"
    >
      {options.map(o => {
        const isActive = active === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={o.label}
            title={o.label}
            onClick={() => setTheme(o.id)}
            className={
              "inline-flex h-7 w-7 items-center justify-center rounded transition " +
              (isActive
                ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]")
            }
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden>
              {o.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
}
