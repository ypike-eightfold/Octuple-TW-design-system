# ef-design-gallery

Internal gallery for browsing approved Eightfold product designs. Google SSO restricted to `@eightfold.ai`.

This is a Next.js 15 app that lives inside the `ef-design-system` repo. It deploys as a **separate Vercel project** from the component-showcase site at `ef-design-system.vercel.app`.

---

## How a design appears in the gallery

The gallery is **PR-merge-driven**. To publish a design:

1. A designer runs the `publish-design` Claude Code skill (in the parent repo's `.claude/skills/`).
2. The skill scaffolds `web/public/content/designs/<category>/<slug>/` with `index.html`, `thumbnail.png`, `meta.json`.
3. The skill opens a PR using the [design.md template](../.github/PULL_REQUEST_TEMPLATE/design.md).
4. Reviewers approve and merge.
5. The next Vercel deploy picks up the new files; the design appears in the gallery.

There is no upload UI. There is no draft area. Everything ships via PR.

---

## Local development

```bash
cd gallery
npm install
cp .env.example .env.local
# Edit .env.local — keep NEXT_PUBLIC_AUTH_BYPASS=true until OAuth is set up
npm run dev
```

Visit http://localhost:3000.

While `NEXT_PUBLIC_AUTH_BYPASS=true`, all pages are accessible without signing in. This is the only safe way to develop before OAuth credentials exist.

For real Google sign-in: see [docs/google-oauth-setup.md](docs/google-oauth-setup.md).

---

## Architecture

```
web/
├── app/                                  # Next.js app router
│   ├── layout.tsx                        # Shell, header, footer, session
│   ├── page.tsx                          # Home — grid of categories
│   ├── signin/page.tsx                   # Google sign-in
│   ├── [category]/page.tsx               # Designs in a category
│   ├── [category]/[slug]/page.tsx        # Design detail (iframe + meta)
│   └── api/auth/[...nextauth]/route.ts   # Auth.js handlers
├── auth.ts                               # Auth.js config (Google + domain gate)
├── middleware.ts                         # Forces auth on every page
├── lib/
│   ├── categories.ts                     # The 11 product categories
│   └── designs.ts                        # Build-time scan of designs
├── public/content/designs/<category>/<slug>/
│   ├── index.html                        # The design itself
│   ├── thumbnail.png                     # Card image
│   └── meta.json                         # Title, description, version, …
├── docs/google-oauth-setup.md
└── .env.example
```

### Why static `index.html` files

The gallery is read-only and the designs are independent. Putting each design under `public/` means Next.js serves them as static files at `/content/designs/<cat>/<slug>/index.html`. The detail page renders them in a sandboxed iframe. No build step per design, no React component coupling, no asset path rewriting.

### Why filesystem-scanned `meta.json` instead of a database

Same reason. The PR is the source of truth. The gallery's index regenerates at build (or on revalidation) from the filesystem. Nothing else to sync.

---

## The 11 categories

| Slug | Name |
|---|---|
| `talent-management` | Talent Management |
| `talent-acquisition` | Talent Acquisition |
| `octuple` | Octuple |
| `talent-forge` | Talent Forge |
| `workforce-exchange` | Workforce Exchange |
| `personal-career-site` | Personal Career Site |
| `resource-management` | Resource Management |
| `talent-flex` | Talent Flex |
| `job-intelligence-engine` | Job Intelligence Engine |
| `admin-console` | Admin Console |
| `analytics` | Analytics |

Adding a new category: edit `lib/categories.ts`, create the directory, update `publish-design/SKILL.md` and the design PR template.

---

## Deploy to Vercel

1. New Vercel project → import the `ef-design-system` repo.
2. **Root Directory**: `gallery`.
3. **Framework Preset**: Next.js.
4. **Build Command**: leave default (`next build`).
5. **Install Command**: leave default (`npm install`).
6. Environment variables: follow [docs/google-oauth-setup.md](docs/google-oauth-setup.md).
7. Deploy.

After it deploys, register the Vercel URL as an authorized redirect URI in the Google OAuth client.

The component-showcase site at `ef-design-system.vercel.app` has its own Vercel project pointing at the repo root — these don't conflict.

---

## Robots

The gallery sets `noindex, nofollow` site-wide. It is internal-only and should never appear in search results. The Auth.js gate is the actual access control; `robots` is defense in depth.
