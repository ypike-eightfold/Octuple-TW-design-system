"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { Tabs, TabsList, TabsTrigger } from "@tonyh-2-eightfold/ef-design-system";
import { ThemeSwitcher } from "./theme-switcher";
import { HeroSwitcher } from "./hero-switcher";
import { SearchTrigger } from "./search/search-trigger";

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
    <header className="sticky top-0 z-50 h-16">
      {/* Fully transparent — no blur, no tint. The bg illustration
          passes through unmodified; the controls below get their own
          glassmorphic surfaces (logo wordmark, pill tabs, action
          chips) so they read on top of whatever's behind. */}
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

        {/* Pill-variant Tabs — the active item gets a filled chip so it
            reads as a clear nav affordance, not a thin underline that's
            easy to miss against the glass header backdrop. Vertically
            centered alongside the logo + right-side controls. */}
        <div className="flex h-full items-center">
          <Tabs value={active} onValueChange={(v) => router.push(v)}>
            <TabsList
              variant="default"
              // Glassmorphism on the track: translucent white +
              // backdrop blur + thin border so the pill group reads
              // as one frosted-glass capsule floating over the hero
              // illustration. Overrides Octuple's solid `bg-muted`.
              className="!bg-white/25 dark:!bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/15 shadow-sm"
            >
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  // Active pill is a denser glass than the track.
                  // Per theme: light mode → white/65 fill + blue-80
                  // text (≥6:1); dark mode → white/15 fill + white
                  // text (≥10:1, since white/15 over the dark page
                  // bg composites to a near-dark surface). Both pass
                  // AA cleanly. Border + backdrop-blur on the active
                  // pill keep the glass language consistent with the
                  // track.
                  className="data-[state=active]:!bg-white/65 data-[state=active]:!text-[var(--color-blue-80,#08537F)] dark:data-[state=active]:!bg-white/15 dark:data-[state=active]:!text-white data-[state=active]:backdrop-blur-sm data-[state=active]:!border-white/50 dark:data-[state=active]:!border-white/25"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
          <SearchTrigger />
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
