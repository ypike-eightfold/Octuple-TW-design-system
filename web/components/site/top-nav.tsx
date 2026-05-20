"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

interface Props {
  session: Session | null;
  /** True when Google OAuth is configured AND not explicitly bypassed. */
  authEnabled: boolean;
  signOutAction: () => Promise<void>;
}

const TABS = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/components", label: "Components", match: (p: string) => p.startsWith("/components") },
  { href: "/gallery", label: "Gallery", match: (p: string) => p.startsWith("/gallery") },
  { href: "/docs/workflow", label: "How to use", match: (p: string) => p.startsWith("/docs") },
] as const;

export function TopNav({ session, authEnabled, signOutAction }: Props) {
  const pathname = usePathname();
  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          {/* Octuple logo (PNG; the brand version with the full-color gradient).
              Sits next to the wordmark; clicking either returns home. */}
          <img
            src="/octuple-logo.png"
            alt=""
            aria-hidden
            className="h-7 w-7 shrink-0 object-contain"
          />
          <span className="font-semibold whitespace-nowrap">EF Design System</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {TABS.map((tab) => {
            const active = tab.match(pathname);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={
                  "rounded-md px-3 py-1.5 transition " +
                  (active
                    ? "bg-[var(--primary)]/10 font-medium text-[var(--primary)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)]")
                }
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
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
