"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

interface Props {
  session: Session | null;
  bypass: boolean;
  signOutAction: () => Promise<void>;
}

const TABS = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/components", label: "Components", match: (p: string) => p.startsWith("/components") },
  { href: "/gallery", label: "Gallery", match: (p: string) => p.startsWith("/gallery") },
  { href: "/docs/workflow", label: "How to use", match: (p: string) => p.startsWith("/docs") },
] as const;

export function TopNav({ session, bypass, signOutAction }: Props) {
  const pathname = usePathname();
  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="h-7 w-7 rounded bg-[var(--primary)]" aria-hidden />
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
          {bypass ? (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100">
              Auth bypass
            </span>
          ) : session?.user ? (
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
