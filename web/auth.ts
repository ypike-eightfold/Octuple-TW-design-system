import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const allowedDomains = (process.env.AUTH_ALLOWED_DOMAINS ?? "eightfold.ai")
  .split(",")
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean);

const bypassAuth = process.env.NEXT_PUBLIC_AUTH_BYPASS === "true";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // hd is a Google hint that pre-filters at the OAuth screen. We still
      // enforce domain in the signIn callback below — that's the real gate.
      authorization: {
        params: { hd: allowedDomains[0] ?? "eightfold.ai", prompt: "select_account" },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (bypassAuth) return true;
      const email = profile?.email?.toLowerCase();
      if (!email) return false;
      const domain = email.split("@")[1];
      return allowedDomains.includes(domain);
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
