import fs from "node:fs";
import path from "node:path";

export const revalidate = 60;

const SCREENSHOTS_DIR = path.join(process.cwd(), "public", "docs-screenshots");

/** Returns true if a screenshot file exists at the expected path. Lets us
    fall back to a placeholder for steps we haven't captured yet. */
function hasScreenshot(filename: string): boolean {
  try {
    return fs.statSync(path.join(SCREENSHOTS_DIR, filename)).isFile();
  } catch {
    return false;
  }
}

/** Two-column step block: text on the left, screenshot on the right. On
    narrow viewports they stack vertically. If the screenshot file isn't
    in /docs-screenshots/ yet, renders a labeled placeholder card so the
    user can see exactly which filename to drop in. */
function Step({
  number,
  title,
  screenshot,
  caption,
  children,
}: {
  number?: number;
  title: string;
  screenshot: string;
  caption: string;
  children: React.ReactNode;
}) {
  const available = hasScreenshot(screenshot);
  return (
    <section className="grid grid-cols-1 gap-8 border-t border-[var(--border)] py-10 lg:grid-cols-2 lg:gap-12">
      <div>
        <h3 className="text-xl font-semibold tracking-tight">
          {number ? `${number}. ` : ""}
          {title}
        </h3>
        <div className="mt-3 space-y-3 leading-relaxed">{children}</div>
      </div>
      <div>
        {available ? (
          <figure>
            <img
              src={`/docs-screenshots/${screenshot}`}
              alt={caption}
              className="w-full rounded-lg border border-[var(--border)] shadow-sm"
            />
            <figcaption className="mt-2 text-xs text-[var(--muted-foreground)]">{caption}</figcaption>
          </figure>
        ) : (
          <div className="flex aspect-[1440/900] items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-center">
            <div className="space-y-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Screenshot pending
              </div>
              <p className="text-sm">{caption}</p>
              <code className="inline-block rounded bg-[var(--background)] px-2 py-1 text-[11px] font-mono text-[var(--muted-foreground)] border border-[var(--border)]">
                /docs-screenshots/{screenshot}
              </code>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export const metadata = {
  title: "Designer workflow — Eightfold Design System",
};

export default function WorkflowPage() {
  return (
    <article>
      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Designer workflow</h1>
        <p className="mt-3 text-lg text-[var(--muted-foreground)]">
          How to use this repo to design, get feedback, and ship designs to the gallery — without
          writing code or living in a terminal.
        </p>
        <p className="mt-3">
          Everything here is built around the idea that{" "}
          <strong>you talk to Claude in plain English and Claude runs the technical commands for you.</strong>{" "}
          You should rarely need to type a{" "}
          <code className="rounded bg-[var(--card)] px-1.5 py-0.5 text-[0.9em] font-mono border border-[var(--border)]">
            git
          </code>{" "}
          command by hand.
        </p>
      </header>

      <h2 className="mb-3 text-2xl font-semibold tracking-tight">
        One-time setup (10 minutes, once per laptop)
      </h2>
      <p className="mb-2 max-w-3xl">
        You'll get one access grant and install two things. None of these require you to know what
        they do — just send an email and click through installers.
      </p>

      <Step
        number={1}
        title="Get added to the Eightfold GitHub org"
        screenshot="step-01-email-helpdesk.png"
        caption="An email composed to helpdesk@eightfold.ai requesting Eightfold GitHub org access (include your GitHub username)."
      >
        <p>
          Email{" "}
          <strong>
            <a href="mailto:helpdesk@eightfold.ai" className="text-[var(--primary)] underline">
              helpdesk@eightfold.ai
            </a>
          </strong>{" "}
          asking to be added to the Eightfold GitHub organization. Include your GitHub username so
          they know who to invite. You'll get an email invitation from GitHub — accept it.
        </p>
        <p>
          This is a prerequisite for everything that follows: without it, you can't pull the design
          system repo, push design PRs, or have Claude push branches on your behalf.
        </p>
      </Step>

      <Step
        number={2}
        title="Install Claude Code"
        screenshot="step-02-install-claude-code.png"
        caption="The Claude Code download page at claude.com/claude-code."
      >
        <p>
          Download from{" "}
          <a
            href="https://claude.com/claude-code"
            className="text-[var(--primary)] underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://claude.com/claude-code
          </a>{" "}
          and run the installer. Sign in with your Anthropic account.
        </p>
      </Step>

      <Step
        number={3}
        title="Install Node.js"
        screenshot="step-03-install-nodejs.png"
        caption="The Node.js download page at nodejs.org with the LTS version highlighted."
      >
        <p>
          Download the <strong>LTS</strong> version from{" "}
          <a
            href="https://nodejs.org"
            className="text-[var(--primary)] underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://nodejs.org
          </a>{" "}
          and run the installer. Click through with all defaults.
        </p>
        <p className="text-sm text-[var(--muted-foreground)]">
          (Node.js is what runs the gallery website on your laptop. Claude needs it.)
        </p>
      </Step>

      <Step
        number={4}
        title="Get added to the design-system repo"
        screenshot="step-04-github-repo.png"
        caption="The tonyh-2-eightfold/ef-design-system repository on GitHub."
      >
        <p>
          Once you're in the Eightfold org (step 1), ask whoever owns the{" "}
          <code className="rounded bg-[var(--card)] px-1 py-0.5 text-[0.9em] font-mono border border-[var(--border)]">
            tonyh-2-eightfold/ef-design-system
          </code>{" "}
          repo to add you as a collaborator with <strong>write</strong> access. You'll get an email.
        </p>
      </Step>

      <Step
        number={5}
        title="The first time Claude talks to GitHub"
        screenshot="step-05-gh-auth-login.png"
        caption="The GitHub OAuth authorization page that opens when Claude runs `gh auth login` for the first time."
      >
        <p>
          The first time you ask Claude to do anything with GitHub (clone the repo, push a design),
          Claude will say something like{" "}
          <em>"I need to authenticate with GitHub — running `gh auth login`."</em> A browser window
          will pop up. Click <strong>Authorize</strong>. Done.
        </p>
        <p>You'll never have to do this again on this laptop.</p>
      </Step>

      <h2 className="mb-3 mt-16 text-2xl font-semibold tracking-tight">
        Day-to-day: designing something new
      </h2>

      <Step
        number={1}
        title="Open Claude Code and point it at the repo"
        screenshot="step-day-01-clone-repo.png"
        caption="A Claude Code conversation where the designer asks Claude to clone the ef-design-system repo to their Desktop."
      >
        <p>
          If this is your <strong>first time</strong> on this laptop, ask:
        </p>
        <blockquote className="border-l-4 border-[var(--primary)] bg-[var(--card)] py-2 pl-4 italic text-[var(--muted-foreground)]">
          <strong>You:</strong> Clone the ef-design-system repo from{" "}
          <code>tonyh-2-eightfold/ef-design-system</code> to my Desktop.
        </blockquote>
        <p>Claude will create a folder on your Desktop with the repo in it.</p>
        <p>If you've used the repo before:</p>
        <blockquote className="border-l-4 border-[var(--primary)] bg-[var(--card)] py-2 pl-4 italic text-[var(--muted-foreground)]">
          <strong>You:</strong> Open the ef-design-system repo on my Desktop and pull the latest
          changes.
        </blockquote>
        <p>
          Either way, <strong>Claude moves into that folder</strong> for the rest of the
          conversation. Everything from here is conversational.
        </p>
      </Step>

      <Step
        number={2}
        title="Tell Claude which version you're designing for"
        screenshot="step-day-02-version-question.png"
        caption="Claude Code asking which design-system version (Tailwind or OG Octuple) the designer wants to use."
      >
        <p>At the start of every new design conversation, Claude will ask:</p>
        <blockquote className="border-l-4 border-[var(--primary)] bg-[var(--card)] py-2 pl-4 italic text-[var(--muted-foreground)]">
          <strong>Claude:</strong> Which design system are you working in — Tailwind (<code>tw</code>) or
          OG Octuple (<code>og</code>)?
        </blockquote>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            <strong>Tailwind (<code>tw</code>)</strong>: New product, greenfield, no existing UI to match.
          </li>
          <li>
            <strong>OG Octuple (<code>og</code>)</strong>: The design lives inside an existing product
            (Talent Management, Talent Acquisition, Career Hub, etc.).
          </li>
        </ul>
        <p>If you're not sure: tell Claude what you're designing for, and Claude will recommend one.</p>
      </Step>

      <Step
        number={3}
        title="Describe the design"
        screenshot="step-day-03-design-prompt.png"
        caption="A Claude Code session where the designer describes a manager 1:1 dashboard and Claude starts producing the React mock."
      >
        <p>Just talk. Be specific about persona and what they're trying to do.</p>
        <blockquote className="border-l-4 border-[var(--primary)] bg-[var(--card)] py-2 pl-4 italic text-[var(--muted-foreground)]">
          <strong>You:</strong> Design a "this week" dashboard for a manager in Talent Management.
          They should see who's overdue on a review, who has a 1:1 today, and a graph of team
          development progress over the last 4 weeks.
        </blockquote>
        <p>
          Claude will produce <strong>working React code</strong> with mock data — not Figma frames,
          not static images. You can open it in a browser and click around.
        </p>
      </Step>

      <Step
        number={4}
        title="Iterate"
        screenshot="step-day-04-iterate.png"
        caption="Designer asking Claude for a change (e.g. 'show 8 weeks instead of 4') and Claude updating the design."
      >
        <p>Look at what Claude built. Tell it what to change.</p>
        <blockquote className="border-l-4 border-[var(--primary)] bg-[var(--card)] py-2 pl-4 italic text-[var(--muted-foreground)]">
          <strong>You:</strong> The development progress graph should show 8 weeks, not 4. And the
          overdue reviews list should let me click into a single review.
        </blockquote>
        <p>Claude updates the code. Refresh the browser. Keep going until it's right.</p>
      </Step>

      <Step
        number={5}
        title="Check the copy"
        screenshot="step-day-05-check-copy.png"
        caption="Claude scanning the design's labels and button copy against the Eightfold terms list and reporting any issues."
      >
        <p>Before submitting, ask Claude to verify the writing:</p>
        <blockquote className="border-l-4 border-[var(--primary)] bg-[var(--card)] py-2 pl-4 italic text-[var(--muted-foreground)]">
          <strong>You:</strong> Check all the labels and copy in this design against the Eightfold
          terms list and content standards. Flag anything that doesn't match.
        </blockquote>
        <p>Claude will scan the design and report. Make fixes.</p>
      </Step>

      <Step
        number={6}
        title="Capture a thumbnail"
        screenshot="step-day-06-screenshot-tool.png"
        caption="macOS Cmd+Shift+4 selection screenshot tool capturing the design."
      >
        <p>
          Take a screenshot of the design (your OS's screenshot tool is fine — <strong>Cmd+Shift+4</strong>{" "}
          on Mac for a region). Save it somewhere you remember.
        </p>
      </Step>

      <Step
        number={7}
        title="Publish"
        screenshot="step-day-07-publish.png"
        caption="Claude Code running the publish-design skill: asking for title, category, slug, then opening the PR."
      >
        <blockquote className="border-l-4 border-[var(--primary)] bg-[var(--card)] py-2 pl-4 italic text-[var(--muted-foreground)]">
          <strong>You:</strong> Publish this design to the gallery.
        </blockquote>
        <p>Claude will ask you for:</p>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            <strong>Category</strong> — one of the 12 product areas
          </li>
          <li>
            <strong>Title</strong>, <strong>Description</strong>, <strong>Slug</strong>
          </li>
          <li>
            <strong>Thumbnail path</strong>
          </li>
        </ul>
        <p>
          Then Claude creates a feature branch, saves the design files into{" "}
          <code className="rounded bg-[var(--card)] px-1 py-0.5 text-[0.9em] font-mono border border-[var(--border)]">
            web/public/content/designs/&lt;category&gt;/&lt;slug&gt;/
          </code>
          , pushes the branch, and opens a PR using the design template.
        </p>
        <p>
          You'll get a link to the PR. <strong>You don't need to merge it yourself</strong> — a
          reviewer will look at it, ask questions if anything's unclear, and then merge.
        </p>
      </Step>

      <Step
        number={8}
        title="After the PR merges"
        screenshot="step-13-design-in-gallery.png"
        caption="The published design appearing on the gallery's product-area page."
      >
        <p>
          The next time the gallery deploys (usually within a couple of minutes), your design will
          appear at:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-[var(--card)] p-3 text-xs border border-[var(--border)]">
          https://&lt;your-gallery-domain&gt;/gallery/&lt;category&gt;/&lt;your-slug&gt;
        </pre>
        <p>You're done.</p>
      </Step>

      <h2 className="mb-3 mt-16 text-2xl font-semibold tracking-tight">Browsing existing designs</h2>

      <Step
        title="Online (after the gallery is deployed)"
        screenshot="step-14-gallery-online.png"
        caption="The gallery's 'Browse by product' grid at octuple-tw-design-system-web.vercel.app/gallery."
      >
        <p>
          Visit the gallery URL in your browser. Sign in with your <code>@eightfold.ai</code> Google
          account (once OAuth is wired). Browse by category.
        </p>
      </Step>

      <Step
        title="Locally (works any time, even offline)"
        screenshot="step-15-gallery-local.png"
        caption="The gallery running locally at http://localhost:3000."
      >
        <blockquote className="border-l-4 border-[var(--primary)] bg-[var(--card)] py-2 pl-4 italic text-[var(--muted-foreground)]">
          <strong>You:</strong> Start the design gallery so I can browse it.
        </blockquote>
        <p>
          Claude will run the gallery on your laptop. Open <code>http://localhost:3000</code> in your
          browser. When you're done:
        </p>
        <blockquote className="border-l-4 border-[var(--primary)] bg-[var(--card)] py-2 pl-4 italic text-[var(--muted-foreground)]">
          <strong>You:</strong> Stop the gallery.
        </blockquote>
      </Step>

      <h2 className="mb-3 mt-16 text-2xl font-semibold tracking-tight">"Just tell Claude" cheat sheet</h2>
      <p className="mb-4 max-w-3xl">
        You almost never need to use a terminal directly. Translate "technical task" to "ask Claude":
      </p>
      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--card)] text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Instead of running…</th>
              <th className="px-4 py-2 font-medium">Just say…</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["git clone …", "Clone the ef-design-system repo from GitHub to my Desktop."],
              ["git pull", "Pull the latest changes."],
              ["git checkout -b …", "Start a new branch for this design."],
              ["npm install", "Install the gallery's dependencies."],
              ["npm run dev", "Start the gallery so I can see it."],
              ["git status", "What changes do I have right now?"],
              ["git push + gh pr create", "Publish this design to the gallery."],
            ].map(([a, b]) => (
              <tr key={a} className="border-t border-[var(--border)]">
                <td className="px-4 py-2 font-mono text-xs">{a}</td>
                <td className="px-4 py-2 italic">"{b}"</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 mt-16 text-2xl font-semibold tracking-tight">The two rules you should not break</h2>
      <ol className="ml-6 list-decimal space-y-3">
        <li>
          <strong>Pick one design system per design and stick to it.</strong> Don't mix Tailwind
          components and OG Octuple components in the same design.
        </li>
        <li>
          <strong>Don't make up terminology.</strong> Eightfold has authoritative names for things
          (Career Hub, AI Companion, Talent Intelligence Platform, …). When in doubt, ask Claude to
          check the terms list before you commit to a label.
        </li>
      </ol>

      <h2 className="mb-3 mt-16 text-2xl font-semibold tracking-tight">When something goes wrong</h2>
      <ul className="ml-6 list-disc space-y-3">
        <li>
          <strong>"Claude says my GitHub credentials aren't working."</strong> Ask Claude to run{" "}
          <code>gh auth login</code>. A browser will open. Authorize. Try again.
        </li>
        <li>
          <strong>"The gallery won't start."</strong> Ask:{" "}
          <em>"Why won't the gallery start? Read the error and tell me what to do."</em> Claude will
          read the error and fix it or tell you what's wrong.
        </li>
        <li>
          <strong>"I published a design but it's not in the gallery yet."</strong> The design appears
          after the PR is reviewed and merged into <code>main</code>. Check your PR; if it's still open,
          ask the reviewer.
        </li>
        <li>
          <strong>"I want to fix a design that's already in the gallery."</strong> Ask Claude to open the
          design and let you iterate. Same publish flow opens a new PR with the changes.
        </li>
      </ul>
    </article>
  );
}
