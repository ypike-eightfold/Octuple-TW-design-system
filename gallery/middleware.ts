import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

// Routes always allowed (no auth):
const PUBLIC_PATHS = [
  "/signin",
  "/api/auth", // Auth.js handlers
  "/_next",    // Next internals
  "/favicon.ico",
];

const bypassAuth = process.env.NEXT_PUBLIC_AUTH_BYPASS === "true";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (bypassAuth) return NextResponse.next();
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
  // Match everything except static assets we want anonymous (none, for now —
  // even thumbnails are gated behind auth so the gallery is fully private).
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
