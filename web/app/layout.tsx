import type { Metadata } from "next";
import "./globals.css";
import { auth, signOut } from "@/auth";
import { TopNav } from "@/components/site/top-nav";

export const metadata: Metadata = {
  title: "Design at Eightfold AI",
  description:
    "The design system, patterns, content guidelines, and gallery of approved designs for Eightfold AI products.",
  robots: { index: false, follow: false },
};

// Auth is OFF by default — see middleware.ts for the rationale. Auth only
// activates when Google OAuth credentials are configured in env vars.
const hasOAuthCredentials = !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
const explicitBypass = process.env.NEXT_PUBLIC_AUTH_BYPASS === "true";
const authEnabled = hasOAuthCredentials && !explicitBypass;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = authEnabled ? await auth() : null;

  return (
    <html lang="en">
      <head>
        {/* Material Symbols Outlined — ef-design-system's Pill, InsightCard,
            StatCard, etc. render icons via <span class="material-symbols-outlined">.
            Without this stylesheet the icon names fall back to literal text. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body>
        <TopNav
          session={session}
          authEnabled={authEnabled}
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
            <code className="rounded bg-[var(--card)] px-1 py-0.5">ypike-eightfold/Octuple-TW-design-system</code>.
          </div>
        </footer>
      </body>
    </html>
  );
}
