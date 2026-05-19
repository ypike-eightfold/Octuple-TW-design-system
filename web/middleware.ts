import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

// Routes always allowed even when auth is enabled:
const PUBLIC_PATHS = [
  "/signin",
  "/api/auth", // Auth.js handlers
  "/_next",    // Next internals
  "/favicon.ico",
];

/**
 * Auth is OFF by default — the site is wide open until OAuth credentials are
 * configured. Auth only activates when BOTH:
 *   - AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET are set in the environment
 *   - NEXT_PUBLIC_AUTH_BYPASS is not "true"
 *
 * This means a fresh Vercel deployment with no env vars is browseable by
 * anyone. The day someone follows web/docs/google-oauth-setup.md and adds
 * the credentials in Vercel's env settings, the @eightfold.ai gate kicks in
 * automatically — no code change required.
 */
const hasOAuthCredentials = !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
const explicitBypass = process.env.NEXT_PUBLIC_AUTH_BYPASS === "true";
const authEnabled = hasOAuthCredentials && !explicitBypass;

export default async function middleware(req: NextRequest) {
  if (!authEnabled) return NextResponse.next();
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const session = await auth();
  if (!session) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
