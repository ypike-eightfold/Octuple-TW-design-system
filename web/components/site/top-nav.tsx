"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { Tabs, TabsList, TabsTrigger } from "@tonyh-2-eightfold/ef-design-system";

interface Props {
  session: Session | null;
  authEnabled: boolean;
  signOutAction: () => Promise<void>;
}

const TABS = [
  { value: "/", label: "Home" },
  { value: "/components", label: "Octuple" },
  { value: "/gallery", label: "Gallery" },
  { value: "/docs/workflow", label: "How to use" },
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

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-white/30 bg-white/40 backdrop-blur-xl supports-[backdrop-filter]:bg-white/30">
      {/* Glassmorphism: translucent fill + backdrop-blur so the hero
          illustration on /  shows through the nav. On routes without
          a hero behind it, the card-color underlay still reads as a
          clean header thanks to the body background. */}
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

        {/* Design system's Tabs primitive (line variant). Wrapped in a
            bottom-aligned flex container with pb-[5px] so the underline
            indicator — which TabsTrigger renders at bottom:-5px relative
            to the button — coincides exactly with the header's bottom
            border (otherwise it floats mid-header). */}
        <div className="flex h-full items-end pb-[5px]">
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
