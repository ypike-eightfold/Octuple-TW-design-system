# Google OAuth setup for the design gallery

The gallery uses **Auth.js v5** (`next-auth@beta`) with Google as the only sign-in provider, restricted to `@eightfold.ai` email addresses.

Until you have credentials, the gallery runs fine in **bypass mode** — set `NEXT_PUBLIC_AUTH_BYPASS=true` in `.env.local`. Do NOT use bypass in production.

This document walks through creating the OAuth client and plugging it into Vercel.

---

## You'll need

- An account that can administer the Eightfold Google Cloud project (or permission to create one)
- The Vercel project the gallery deploys to
- 15 minutes

---

## 1. Create (or pick) a Google Cloud project

1. Go to https://console.cloud.google.com.
2. Top-left project picker → **New Project** (or pick an existing internal-tools project).
3. Name suggestion: `ef-design-gallery`.

## 2. Configure the OAuth consent screen

1. Left nav → **APIs & Services** → **OAuth consent screen**.
2. User type: **Internal**. (This restricts the client to your Google Workspace org — only `@eightfold.ai` users can sign in. If you don't see "Internal", you're not in a Workspace org; pick External and we'll rely on the in-app domain check for the gate.)
3. Fill in the required fields:
   - App name: `Eightfold Design Gallery`
   - User support email: an alias you control
   - Developer contact information: same
4. **Scopes:** add `.../auth/userinfo.email` and `.../auth/userinfo.profile` and `openid`. Skip the rest.
5. Save and continue.

## 3. Create the OAuth client ID

1. Left nav → **APIs & Services** → **Credentials** → **+ Create Credentials** → **OAuth client ID**.
2. Application type: **Web application**.
3. Name: `ef-design-gallery (production)` — repeat for `(preview)` if you want one for Vercel preview deploys.
4. **Authorized JavaScript origins:**
   - `https://<your-vercel-domain>` (e.g. `https://ef-design-gallery.vercel.app`)
   - `http://localhost:3000` (for local dev)
5. **Authorized redirect URIs:**
   - `https://<your-vercel-domain>/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`
6. **Create.** Copy the **Client ID** and **Client secret** — you'll plug them into env vars.

## 4. Generate an `AUTH_SECRET`

This is the secret Auth.js uses to sign session JWTs.

```bash
openssl rand -base64 32
```

Save the output. Use a different value per environment (prod vs preview) if you want sessions to be scoped per environment.

## 5. Set env vars in Vercel

In the Vercel project's **Settings → Environment Variables**, add:

| Name | Value |
|---|---|
| `AUTH_SECRET` | The output of `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | The Client ID from step 3 |
| `AUTH_GOOGLE_SECRET` | The Client secret from step 3 |
| `AUTH_ALLOWED_DOMAINS` | `eightfold.ai` (comma-separate for multiple, e.g. `eightfold.ai,eightfold.com`) |

Mark each as **Production** and (optionally) **Preview** if you want preview deployments to authenticate too.

**Do not set `NEXT_PUBLIC_AUTH_BYPASS` in Vercel.** Leaving it unset (or `false`) enforces auth.

## 6. Local development

Create `web/.env.local` (gitignored):

```bash
AUTH_SECRET=<openssl rand -base64 32 output>
AUTH_GOOGLE_ID=<client id>
AUTH_GOOGLE_SECRET=<client secret>
AUTH_ALLOWED_DOMAINS=eightfold.ai
# Comment this out to test the real Google sign-in flow locally
NEXT_PUBLIC_AUTH_BYPASS=true
```

When `NEXT_PUBLIC_AUTH_BYPASS=true`:
- `/signin` shows a placeholder explaining bypass is on
- middleware skips the auth check
- all gallery pages are accessible without sign-in

This is the only safe way to develop the gallery before OAuth credentials exist.

## 7. Smoke test

Locally:

```bash
cd gallery
npm install
npm run dev
```

1. Visit http://localhost:3000 — gallery loads (bypass on).
2. Comment out `NEXT_PUBLIC_AUTH_BYPASS=true` in `.env.local`.
3. Restart `npm run dev`.
4. Visit http://localhost:3000 — redirected to `/signin`.
5. Click **Continue with Google** — Google flow → returned to gallery as authenticated user.
6. Try signing in with a non-`@eightfold.ai` Google account (e.g. personal gmail) — should be rejected with "AccessDenied".

If sign-in fails:
- Check the redirect URI in the Google console exactly matches `http://localhost:3000/api/auth/callback/google` (no trailing slash).
- Check the consent screen is published.
- Check the user's email actually is `@eightfold.ai` (`AUTH_ALLOWED_DOMAINS` is case-insensitive but only matches the part after `@`).

## 8. After deployment

After the Vercel deploy, repeat step 7 against `https://<your-vercel-domain>`.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `Error: Invalid redirect URI` | Mismatch between the redirect URI you registered and the one Auth.js is requesting. Compare exactly. |
| Sign-in succeeds but you're logged out immediately | `AUTH_SECRET` is unset or differs between environments. Check Vercel env vars. |
| `AccessDenied` for valid @eightfold.ai users | `AUTH_ALLOWED_DOMAINS` is set to something other than `eightfold.ai`, or the consent screen's user type is "Internal" but you're signing in with a personal Google account. |
| Local dev redirects to `/signin` even after sign-in | `AUTH_SECRET` missing locally; cookies aren't signed properly. |
| "This app isn't verified" | Expected for an internal Workspace app. Click "Advanced" → "Continue (unsafe)". For external apps, you'll need to submit for verification. |
