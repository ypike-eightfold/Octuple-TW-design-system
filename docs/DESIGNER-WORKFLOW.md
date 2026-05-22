# Designer workflow

How to use this repo to design, get feedback, and ship designs to the gallery — without writing code or living in a terminal.

Everything here is built around the idea that **you talk to Claude in plain English and Claude runs the technical commands for you.** You should rarely need to type a `git` command by hand.

---

## One-time setup (10 minutes, once per laptop)

You'll get one access grant and install two things. None of these require you to know what they do — just send an email and click through installers.

### 1. Get added to the Eightfold GitHub org

Email **helpdesk@eightfold.ai** asking to be added to the Eightfold GitHub organization. Include your GitHub username so they know who to invite. You'll get an email invitation from GitHub — accept it.

This is a prerequisite for everything that follows: without it, you can't pull the design system repo, push design PRs, or have Claude push branches on your behalf.

### 2. Install Claude Code

Download from https://claude.com/claude-code and run the installer. Sign in with your Anthropic account.

### 3. Install Node.js

Download the **LTS** version from https://nodejs.org and run the installer. Click through with all defaults.

(Node.js is what runs the gallery website on your laptop. Claude needs it.)

### 4. Get added to the design-system repo

Once you're in the Eightfold org (step 1), ask whoever owns the `ypike-eightfold/Octuple-TW-design-system` repo to add you as a collaborator with **write** access. You'll get an email.

### 5. The first time Claude talks to GitHub

The first time you ask Claude to do anything with GitHub (clone the repo, push a design), Claude will say something like *"I need to authenticate with GitHub — running `gh auth login`."* A browser window will pop up. Click **Authorize**. Done.

You'll never have to do this again on this laptop.

---

## Day-to-day: designing something new

### Step 1 — Open Claude Code and point it at the repo

If this is your **first time** on this laptop, ask:

> **You:** Clone the design system repo from `ypike-eightfold/Octuple-TW-design-system` to my Desktop.

Claude will create a folder on your Desktop with the repo in it.

If you've used the repo before:

> **You:** Open the ef-design-system repo on my Desktop and pull the latest changes.

Either way, **Claude moves into that folder** for the rest of the conversation. Everything from here is conversational.

### Step 2 — Tell Claude which version you're designing for

At the start of every new design conversation, Claude will ask:

> **Claude:** Which design system are you working in — Tailwind (`tw`) or OG Octuple (`og`)?

| Pick | When |
|---|---|
| **Tailwind (`tw`)** | New product, greenfield, no existing UI to match. |
| **OG Octuple (`og`)** | The design lives inside an existing product (Talent Management, Talent Acquisition, Career Hub, etc.). |

If you're not sure: tell Claude what you're designing for, and Claude will recommend one.

### Step 3 — Describe the design

Just talk. Be specific about persona and what they're trying to do.

> **You:** Design a "this week" dashboard for a manager in Talent Management. They should see who's overdue on a review, who has a 1:1 today, and a graph of team development progress over the last 4 weeks.

Claude will produce **working React code** with mock data — not Figma frames, not static images. You can open it in a browser and click around.

### Step 4 — Iterate

Look at what Claude built. Tell it what to change.

> **You:** The development progress graph should show 8 weeks, not 4. And the overdue reviews list should let me click into a single review.

Claude updates the code. Refresh the browser. Keep going until it's right.

If you want to see what other designs in the same area look like, ask:

> **You:** Show me other designs in the Talent Management category for reference.

Claude will open the gallery (see below).

### Step 5 — Check the copy

Before submitting, ask Claude to verify the writing:

> **You:** Check all the labels and copy in this design against the Eightfold terms list and content standards. Flag anything that doesn't match.

Claude will scan the design and report. Make fixes.

### Step 6 — Capture a thumbnail

Take a screenshot of the design (your OS's screenshot tool is fine — Cmd+Shift+4 on Mac for a region). Save it somewhere you remember.

### Step 7 — Publish

> **You:** Publish this design to the gallery.

Claude will ask you for:

- **Category** — one of the 11 product areas (Talent Management, Talent Acquisition, Octuple, Talent Forge, Workforce Exchange, Personal Career Site, Resource Management, Talent Flex, Job Intelligence Engine, Admin Console, Analytics)
- **Title** — what to call the design
- **Description** — 1-2 sentences for the gallery card
- **Slug** — a short URL-friendly name (e.g. `manager-this-week-dashboard`)
- **Thumbnail path** — drag your screenshot into the conversation or paste the file path

Then Claude will:

1. Create a feature branch
2. Save the design files into `web/public/content/designs/<category>/<slug>/`
3. Push the branch to GitHub
4. Open a pull request using the design template

You'll get a link to the PR. **You do not need to merge it yourself** — a reviewer will look at it, ask questions if anything's unclear, and then merge.

### Step 8 — After the PR merges

The next time the gallery deploys (usually within a couple of minutes), your design will appear at:

```
https://<your-gallery-domain>/<category>/<your-slug>
```

You're done.

---

## Browsing existing designs

Two ways:

### Online (after the gallery is deployed)

Visit the gallery URL in your browser. Sign in with your `@eightfold.ai` Google account. Browse by category.

### Locally (works any time, even offline)

> **You:** Start the design gallery so I can browse it.

Claude will run the gallery on your laptop. Open http://localhost:3000 in your browser. When you're done:

> **You:** Stop the gallery.

---

## "Just tell Claude" cheat sheet

You almost never need to use a terminal directly. Translate "technical task" to "ask Claude":

| Instead of running… | Just say… |
|---|---|
| `git clone ...` | "Clone the ef-design-system repo from GitHub to my Desktop." |
| `git pull` | "Pull the latest changes." |
| `git checkout -b ...` | "Start a new branch for this design." |
| `npm install` | "Install the gallery's dependencies." |
| `npm run dev` | "Start the gallery so I can see it." |
| `git status` | "What changes do I have right now?" |
| `git push` + `gh pr create` | "Publish this design to the gallery." |
| Opening files to edit them | "Change the heading on the dashboard from 'My week' to 'This week.'" |

You can ask Claude what it's doing at any time:

> **You:** What did you just do? Walk me through it.

It will explain in plain English.

---

## The two rules you should not break

1. **Pick one design system per design and stick to it.** Don't mix Tailwind components and OG Octuple components in the same design. Claude will warn you if you accidentally do this, but worth knowing upfront.
2. **Don't make up terminology.** Eightfold has authoritative names for things (Career Hub, AI Companion, Talent Intelligence Platform, …). When in doubt, ask Claude to check the terms list before you commit to a label.

---

## When something goes wrong

### "Claude says my GitHub credentials aren't working."

Run (or ask Claude to run): `gh auth login`. A browser will open. Authorize. Try again.

### "The gallery won't start."

Ask:

> **You:** Why won't the gallery start? Read the error and tell me what to do.

Claude will read the error message and either fix it or tell you what's wrong.

### "I published a design but it's not in the gallery yet."

The design appears **after** the PR is reviewed and merged into `main`. Check your PR — if it's still open, ask the reviewer to take a look. If it's merged, give Vercel a couple of minutes to redeploy.

### "I want to fix a design that's already in the gallery."

> **You:** Open the design `<slug>` from the `<category>` category and let me iterate on it.

Claude will check out the design files, you iterate, and the same publish flow opens a new PR with your changes.

### "I made a mess and want to start over."

> **You:** Throw away my changes and start fresh from the latest main branch.

Claude will confirm before doing anything destructive.

---

## What's actually in this repo (so you know what Claude is doing)

- `.claude/skills/` — the instructions Claude uses to know how to design Eightfold UI properly. You don't edit these unless you want to improve them; if you find Claude making the same mistake repeatedly, tell Claude *"add this to your learnings"* and it'll record the fix.
- `gallery/` — the website that shows all the approved designs. Runs locally with `npm run dev`; deploys to Vercel.
- `web/public/content/designs/<category>/<slug>/` — where every published design lives (one folder each).
- `src/` — the actual Tailwind components. You don't need to touch this.
- `CLAUDE.md` — Claude's own playbook for this repo. Tells Claude how to behave.

---

## Help and feedback

If you want to suggest a change to how Claude approaches design work, the easiest path is:

> **You:** I want Claude to always do X when I ask for Y. Update the right skill.

Claude will figure out which skill to update and open a PR with the change.
