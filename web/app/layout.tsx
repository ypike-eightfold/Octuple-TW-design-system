import type { Metadata } from "next";
import "./globals.css";
import { auth, signOut } from "@/auth";
import { TopNav } from "@/components/site/top-nav";

export const metadata: Metadata = {
  title: "Eightfold Design System",
  description: "Components, designs, and Claude Code skills for Eightfold products.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = process.env.NEXT_PUBLIC_AUTH_BYPASS === "true" ? null : await auth();

  return (
    <html lang="en">
      <body>
        <TopNav
          session={session}
          bypass={process.env.NEXT_PUBLIC_AUTH_BYPASS === "true"}
          signOutAction={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        />
        {/* No width constraint here — the (site) route group constrains
            landing/gallery/docs/signin. /components is outside the group
            so it can render full-width (catalog has full-width Navbar examples). */}
        <main>{children}</main>
        <footer className="mt-16 border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-[var(--muted-foreground)]">
            Internal. Designs added via PR to{" "}
            <code className="rounded bg-[var(--card)] px-1 py-0.5">tonyh-2-eightfold/ef-design-system</code>.
          </div>
        </footer>
      </body>
    </html>
  );
}
