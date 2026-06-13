import type { Metadata } from "next";
import "./globals.css";
import { auth, signOut } from "@/auth";
import { TopNav } from "@/components/site/top-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { ThemeProvider } from "@/components/site/theme-provider";
import { HeroProvider } from "@/components/site/hero-provider";

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
    /* suppressHydrationWarning is required by next-themes: it sets the
       theme class on <html> before React hydrates, which would otherwise
       trip the hydration mismatch warning. */
    <html lang="en" suppressHydrationWarning>
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <HeroProvider>
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
            <SiteFooter />
          </HeroProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
