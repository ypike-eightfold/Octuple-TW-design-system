"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { Tabs, TabsList, TabsTrigger } from "@tonyh-2-eightfold/ef-design-system";
import { ThemeSwitcher } from "./theme-switcher";
import { HeroSwitcher } from "./hero-switcher";

interface Props {
  session: Session | null;
  authEnabled: boolean;
  signOutAction: () => Promise<void>;
}

const TABS = [
  { value: "/", label: "Home" },
  { value: "/components", label: "Octuple" },
  { value: "/gallery", label: "Gallery" },
  { value: "/docs/workflow", label: "Claude setup" },
] as const;

/** Map the current URL to one of the four tab values. Prefix-matched
    so e.g. /gallery/talent-management still highlights "Gallery". */
function activeTabFor(pathname: string): string {
  if (pathname.startsWith("/components")) return "/components";
  if (pathname.startsWith("/gallery")) return "/gallery";
  if (pathname.startsWith("/docs")) return "/docs/workflow";
  return "/";
}

export function TopNav({ session, authEnabled, signOutAction }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const active = activeTabFor(pathname);

  /* Hide the site chrome on prototype routes — these are sandboxed
     experiences (also rendered inside the gallery's iframe) and have
     their own product navbar. Showing both at once doubles up the
     header. */
  if (pathname.startsWith("/careerhub")) return null;

  return (
    <header
      className={
        "sticky top-0 z-50 h-16 backdrop-blur-xl " +
        // Glass tint as a vertical gradient — dense at the top where the
        // logo / tabs need a stable backdrop, fading to fully transparent
        // at the bottom so the nav dissolves into the hero illustration
        // below instead of cutting it off with a hard band.
        "bg-gradient-to-b from-white/40 to-transparent " +
        "dark:from-[var(--background)]/60 dark:to-transparent"
      }
    >
      {/* Glassmorphism: translucent gradient fill + backdrop-blur so the
          hero illustration on / shows through the nav. backdrop-blur
          stays uniform across the band; only the tint fades. */}
      <div className="flex h-full w-full items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/octuple-logo.png"
            alt=""
            aria-hidden
            className="h-7 w-7 shrink-0 object-contain"
          />
          <span className="font-semibold whitespace-nowrap">Design at Eightfold AI</span>
        </Link>

        {/* Design system's Tabs primitive (line variant). Bottom-aligned
            so the trigger's underline (rendered at bottom:-5px) touches
            the header's border-b instead of floating above it. */}
        <div className="flex h-full items-end">
          <Tabs value={active} onValueChange={(v) => router.push(v)}>
            <TabsList variant="line">
              {TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
          <HeroSwitcher />
          <ThemeSwitcher />
          {!authEnabled ? null : session?.user ? (
            <>
              <span className="hidden sm:inline">{session.user.email}</span>
              <form action={signOutAction}>
                <button className="rounded border border-[var(--border)] px-3 py-1 text-xs hover:bg-[var(--background)]">
                  Sign out
                </button>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
