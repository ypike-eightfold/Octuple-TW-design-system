"use client";

import Link from "next/link";
import {
  Sparkles,
  Palette,
  Bot,
  BookOpenText,
  CheckCheck,
  GitPullRequestArrow,
  ArrowRight,
} from "lucide-react";
import {
  Button,
  Pill,
  InsightCard,
  Badge,
} from "@tonyh-2-eightfold/ef-design-system";

interface Props {
  totalDesigns: number;
  categoryCount: number;
}

function NextLink({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={to} className={className}>
      {children}
    </Link>
  );
}

export function HomePageView({ totalDesigns, categoryCount }: Props) {
  return (
    <div>
      {/* HERO BACKGROUND --------------------------------------------------
          The illustration sits BEHIND the sticky top nav. The nav's
          backdrop-blur turns the top edge of the hero into a frosted
          glass band. Negative top margin lifts the section so the hero
          overlaps the nav slot. */}
      <section className="relative -mt-16 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          aria-hidden
          style={{
            backgroundImage: "url('/octuple-hero.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center top",
            backgroundSize: "cover",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 -z-10 bg-gradient-to-b from-transparent to-[var(--background)]"
          aria-hidden
        />

        <div className="px-6">
          <div className="mx-auto max-w-6xl pt-40 pb-24">
            <div className="max-w-3xl">
              <Pill icon="auto_awesome" variant="blueGreen" size="medium">
                For everyone designing for Eightfold AI
              </Pill>
              <h1 className="mt-6 text-5xl font-semibold tracking-tight text-[var(--foreground)] sm:text-6xl">
                Design at Eightfold&nbsp;AI
              </h1>
              <p className="mt-5 max-w-2xl text-xl leading-relaxed text-[var(--muted-foreground)]">
                One home for the design system, the patterns and content we share across
                products, the screens our designers have shipped, and the tools we use
                to make them. Built so anyone &mdash; engineer, PM, recruiter, designer &mdash;
                can find what they need and pull a piece of Eightfold&apos;s product story.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/components">
                    <span>Explore the components</span>
                    <ArrowRight aria-hidden className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/gallery">Browse the gallery</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <section className="mt-12">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">What&apos;s inside</h2>
            <Link
              href="/docs/workflow"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline"
            >
              How to use this
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <InsightCard
              title="Octuple, end to end"
              description="Tokens, primitives, and Eightfold-specific components with live examples for every one."
              icon="palette"
              bgColor="#EEF2FF"
              iconBgColor="#C7D2FE"
              iconColor="#3730A3"
              textColor="#1E1B4B"
              buttonLabel="Open the catalog"
              buttonHref="/components"
              fixedSize={false}
              LinkComponent={NextLink}
            >
              <p className="text-sm leading-relaxed">
                The same library that powers Talent Acquisition, Career Hub, and the
                rest of the suite.
              </p>
            </InsightCard>

            <InsightCard
              title="Approved designs"
              description={
                totalDesigns === 0
                  ? "Full-screen mockups, flows, and reference designs the team has published."
                  : `${totalDesigns} ${totalDesigns === 1 ? "design" : "designs"} across ${categoryCount} product areas.`
              }
              icon="photo_library"
              bgColor="#ECFDF5"
              iconBgColor="#A7F3D0"
              iconColor="#065F46"
              textColor="#022C22"
              buttonLabel="Browse designs"
              buttonHref="/gallery"
              fixedSize={false}
              LinkComponent={NextLink}
            >
              <p className="text-sm leading-relaxed">
                Real flows you can crib from, organized by where they live in the product.
              </p>
            </InsightCard>

            <InsightCard
              title="Design with Claude"
              description="Conversational design: ask in plain English, get working React + Octuple."
              icon="smart_toy"
              bgColor="#FFF7ED"
              iconBgColor="#FED7AA"
              iconColor="#9A3412"
              textColor="#431407"
              buttonLabel="See the workflow"
              buttonHref="/docs/workflow"
              fixedSize={false}
              LinkComponent={NextLink}
            >
              <p className="text-sm leading-relaxed">
                Publish to the gallery via a pull request. No terminal required.
              </p>
            </InsightCard>
          </div>
        </section>

        <section className="mt-20 rounded-2xl bg-[var(--card)] p-10 border border-[var(--border)]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <Badge variant="secondary" size={24}>
                Content
              </Badge>
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
                  <ArrowRight
                    aria-hidden
                    className="h-5 w-5 text-[var(--primary)] opacity-0 transition group-hover:opacity-100"
                  />
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
                  <ArrowRight
                    aria-hidden
                    className="h-5 w-5 text-[var(--primary)] opacity-0 transition group-hover:opacity-100"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="mb-8 text-3xl font-semibold tracking-tight">What we stand for</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.title}>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <p.Icon aria-hidden className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 mb-8 rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/5 p-10 text-center">
          <h3 className="text-2xl font-semibold tracking-tight">Ship your first design today</h3>
          <p className="mt-3 mx-auto max-w-2xl text-[var(--muted-foreground)]">
            Ten minutes of setup. After that you talk to Claude in plain English; Claude clones
            the repo, builds the screen, opens the pull request.
          </p>
          <div className="mt-6 flex justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/docs/workflow">
                <span>Open the workflow guide</span>
                <ArrowRight aria-hidden className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

const PRINCIPLES = [
  {
    Icon: Sparkles,
    title: "Consistent with the brand",
    body: "Voice, color, typography, and component behavior aligned across every Eightfold AI product. Designers don't reinvent — they reach for the same building blocks the rest of the team already uses.",
  },
  {
    Icon: Palette,
    title: "Reusable by anyone",
    body: "Designed for designers, engineers, PMs, and anyone making a product surface. If you can describe what you want, Claude can build a working mock with these pieces — no terminal required.",
  },
  {
    Icon: Bot,
    title: "AI-native by default",
    body: "Skills baked into the repo teach Claude the Eightfold patterns, terminology, and 'don't do this' lessons. Every design starts from the same scar-tissue knowledge the team's accumulated.",
  },
  {
    Icon: BookOpenText,
    title: "Documented in plain English",
    body: "Content design standards and a 170+ term glossary keep copy aligned. Capitalization, voice, tone — all reviewed against the same source of truth, on every design.",
  },
  {
    Icon: CheckCheck,
    title: "Reviewed before it ships",
    body: "Designs reach the gallery via pull request. A reviewer checks against the design rules, copy standards, and accessibility minimums before anything goes live.",
  },
  {
    Icon: GitPullRequestArrow,
    title: "Open for contribution",
    body: "Anyone in the org can submit a design, propose a new pattern, or update a skill. The repo is the source of truth, and the workflow is the same whether you're a senior staff or a new contractor.",
  },
];
