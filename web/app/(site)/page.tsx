import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { getAllDesigns } from "@/lib/designs";

export const revalidate = 60;

export default function HomePage() {
  const all = getAllDesigns();

  return (
    <div>
      {/* HERO --------------------------------------------------------------
          Wide illustration anchors the top of the page. Title + lede sit
          beneath it so the illustration breathes. Negative top margin lets
          the hero stretch closer to the global top nav. */}
      <section className="-mt-10 mb-12">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <img
            src="/octuple-hero.svg"
            alt=""
            aria-hidden
            className="block w-full"
          />
        </div>
        <div className="mt-10 max-w-3xl">
          <span className="inline-block rounded-full border border-[var(--border)] px-3 py-1 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
            For everyone designing for Eightfold AI
          </span>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">
            Design at Eightfold&nbsp;AI
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-relaxed text-[var(--muted-foreground)]">
            One home for the design system, the patterns and content we share across
            products, the screens our designers have shipped, and the tools we use
            to make them. Built so anyone &mdash; engineer, PM, recruiter, designer &mdash;
            can find what they need and pull a piece of Eightfold's product story.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/components"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
            >
              Explore the components →
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              Browse the gallery
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE -----------------------------------------------------
          Three large cards. Material-style: a colored accent strip on top,
          generous padding, subtle shadow on hover. */}
      <section className="mt-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-semibold tracking-tight">What's inside</h2>
          <Link
            href="/docs/workflow"
            className="text-sm font-medium text-[var(--primary)] hover:underline"
          >
            How to use this →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <FeatureCard
            href="/components"
            kicker="Components"
            title="Octuple, end to end"
            body="Tokens, primitives, and Eightfold-specific components with live examples for every one. The same library that powers Talent Acquisition, Career Hub, and the rest of the suite."
            cta="Open the catalog →"
            accent="from-indigo-500 to-purple-500"
          />
          <FeatureCard
            href="/gallery"
            kicker="Gallery"
            title="Approved designs"
            body={
              all.length === 0
                ? "Full-screen mockups, flows, and reference designs the team has published. Browse by product area."
                : `${all.length} ${all.length === 1 ? "design" : "designs"} across ${CATEGORIES.length} product areas. Real flows you can crib from, organized by where they live in the product.`
            }
            cta="Browse designs →"
            accent="from-emerald-500 to-teal-500"
          />
          <FeatureCard
            href="/docs/workflow"
            kicker="Workflow"
            title="Design with Claude"
            body="Conversational design: ask Claude in plain English, get working React + Octuple, publish to the gallery via a pull request. No terminal required."
            cta="See the workflow →"
            accent="from-orange-500 to-pink-500"
          />
        </div>
      </section>

      {/* CONTENT GUIDELINES STRIP -----------------------------------------
          Side-by-side callout for the two shared content docs that live
          inside /components but are interesting on their own. */}
      <section className="mt-20 rounded-2xl bg-[var(--card)] p-10 border border-[var(--border)]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
              Content
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">
              Write like Eightfold
            </h3>
            <p className="mt-3 text-[var(--muted-foreground)]">
              Voice, tone, grammar, and the authoritative terms list with hundreds of
              product-specific words. Linked from both design system versions so the
              same rules apply everywhere.
            </p>
          </div>
          <ul className="space-y-3">
            <li>
              <Link
                href="/components"
                className="group flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-5 py-4 transition hover:border-[var(--primary)]"
              >
                <div>
                  <div className="font-medium">Content design standards</div>
                  <div className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                    Voice and tone, grammar, UI copy patterns
                  </div>
                </div>
                <span className="text-[var(--primary)] opacity-0 transition group-hover:opacity-100">
                  →
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/components"
                className="group flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-5 py-4 transition hover:border-[var(--primary)]"
              >
                <div>
                  <div className="font-medium">Terms list</div>
                  <div className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                    Branded terms, sensitive terms, full A-Z glossary
                  </div>
                </div>
                <span className="text-[var(--primary)] opacity-0 transition group-hover:opacity-100">
                  →
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* PRINCIPLES --------------------------------------------------------
          Quick "values" section like Material's mission statements. */}
      <section className="mt-20">
        <h2 className="mb-8 text-3xl font-semibold tracking-tight">What we stand for</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.title}>
              <div className="text-3xl">{p.icon}</div>
              <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALLOUT ----------------------------------------------------- */}
      <section className="mt-24 mb-8 rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/5 p-10 text-center">
        <h3 className="text-2xl font-semibold tracking-tight">Ship your first design today</h3>
        <p className="mt-3 mx-auto max-w-2xl text-[var(--muted-foreground)]">
          Ten minutes of setup. After that you talk to Claude in plain English; Claude clones
          the repo, builds the screen, opens the pull request.
        </p>
        <Link
          href="/docs/workflow"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
        >
          Open the workflow guide →
        </Link>
      </section>
    </div>
  );
}

function FeatureCard({
  href,
  kicker,
  title,
  body,
  cta,
  accent,
}: {
  href: string;
  kicker: string;
  title: string;
  body: string;
  cta: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-lg"
    >
      {/* Colored accent stripe at the top, gradient varies per card */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} aria-hidden />
      <div className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
        {kicker}
      </div>
      <h3 className="mt-3 text-xl font-semibold group-hover:text-[var(--primary)]">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{body}</p>
      <span className="mt-5 inline-block text-sm font-medium text-[var(--primary)]">{cta}</span>
    </Link>
  );
}

const PRINCIPLES = [
  {
    icon: "🎯",
    title: "Consistent with the brand",
    body: "Voice, color, typography, and component behavior aligned across every Eightfold AI product. Designers don't reinvent — they reach for the same building blocks the rest of the team already uses.",
  },
  {
    icon: "🧰",
    title: "Reusable by anyone",
    body: "Designed for designers, engineers, PMs, and anyone making a product surface. If you can describe what you want, Claude can build a working mock with these pieces — no terminal required.",
  },
  {
    icon: "🤖",
    title: "AI-native by default",
    body: "Skills baked into the repo teach Claude the Eightfold patterns, terminology, and 'don't do this' lessons. Every design starts from the same scar-tissue knowledge the team's accumulated.",
  },
  {
    icon: "📖",
    title: "Documented in plain English",
    body: "Content design standards and a 170+ term glossary keep copy aligned. Capitalization, voice, tone — all reviewed against the same source of truth, on every design.",
  },
  {
    icon: "✅",
    title: "Reviewed before it ships",
    body: "Designs reach the gallery via pull request. A reviewer checks against the design rules, copy standards, and accessibility minimums before anything goes live.",
  },
  {
    icon: "🔁",
    title: "Open for contribution",
    body: "Anyone in the org can submit a design, propose a new pattern, or update a skill. The repo is the source of truth, and the workflow is the same whether you're a senior staff or a new contractor.",
  },
];
