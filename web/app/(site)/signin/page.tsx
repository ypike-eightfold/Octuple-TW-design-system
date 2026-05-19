import { signIn } from "@/auth";

type Props = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const { callbackUrl, error } = await searchParams;

  if (process.env.NEXT_PUBLIC_AUTH_BYPASS === "true") {
    return (
      <div className="mx-auto mt-20 max-w-md rounded-lg border border-[var(--border)] bg-[var(--card)] p-8">
        <h1 className="text-xl font-semibold">Auth bypass is on</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          <code>NEXT_PUBLIC_AUTH_BYPASS=true</code> is set, so sign-in is skipped.
          Navigate to <a href="/" className="underline">the gallery</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 max-w-md rounded-lg border border-[var(--border)] bg-[var(--card)] p-8">
      <h1 className="text-xl font-semibold">Sign in to the design gallery</h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        Restricted to <code>@eightfold.ai</code> Google accounts.
      </p>
      {error && (
        <p className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-900">
          {error === "AccessDenied"
            ? "Your Google account isn't allowed to access this gallery. Sign in with an @eightfold.ai account."
            : `Sign-in error: ${error}`}
        </p>
      )}
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: callbackUrl ?? "/" });
        }}
        className="mt-6"
      >
        <button
          type="submit"
          className="w-full rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Continue with Google
        </button>
      </form>
    </div>
  );
}
