import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { auth, signOut } from "@/auth";

export const metadata: Metadata = {
  title: "Eightfold Design Gallery",
  description: "Internal gallery for approved Eightfold product designs.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = process.env.NEXT_PUBLIC_AUTH_BYPASS === "true" ? null : await auth();

  return (
    <html lang="en">
      <body>
        <header className="border-b border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="h-8 w-8 rounded bg-[var(--color-accent)]" aria-hidden />
              <span className="font-semibold">Eightfold Design Gallery</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
              {process.env.NEXT_PUBLIC_AUTH_BYPASS === "true" ? (
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100">
                  Auth bypass — local mode
                </span>
              ) : session?.user ? (
                <>
                  <span>{session.user.email}</span>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/signin" });
                    }}
                  >
                    <button className="rounded border border-[var(--color-border)] px-3 py-1 text-xs hover:bg-[var(--color-bg)]">
                      Sign out
                    </button>
                  </form>
                </>
              ) : null}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        <footer className="mt-16 border-t border-[var(--color-border)]">
          <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-[var(--color-muted)]">
            Internal. Designs added via PR to{" "}
            <code className="rounded bg-[var(--color-card)] px-1 py-0.5">tonyh-2-eightfold/ef-design-system</code>.
          </div>
        </footer>
      </body>
    </html>
  );
}
