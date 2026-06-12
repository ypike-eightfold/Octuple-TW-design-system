/* Recent-commit feeds for the home dashboard, sourced from the GitHub
 * API rather than local git: Vercel builds from a shallow clone, so
 * `git log` is not reliable at build time. The repo is public — no
 * token required — but GITHUB_TOKEN is honored when present for
 * friendlier rate limits.
 *
 * Every fetch is cached for 5 minutes (Next.js fetch revalidate) and
 * degrades to an empty list on any failure, so the dashboard modules
 * hide rather than break when the API is unreachable.
 *
 * Date labels are computed HERE, server-side, and passed to the client
 * as plain strings — computing "3 days ago" on both server and client
 * is a hydration mismatch waiting to happen.
 */

const REPO = "ypike-eightfold/Octuple-TW-design-system";
const REVALIDATE_SECONDS = 300;

export type ActivityArea = "octuple" | "gallery" | "docs" | "skills";

export interface ActivityEntry {
  sha: string;
  headline: string;
  author: string;
  /** Human label like "today" / "3 days ago" / "May 28" — server-computed. */
  dateLabel: string;
  /** ISO date, for <time dateTime> and sorting. */
  date: string;
  url: string;
  area: ActivityArea;
}

const AREA_PATHS: Record<ActivityArea, string> = {
  octuple: "src/components",
  gallery: "web/public/content/designs",
  docs: "docs",
  skills: ".claude/skills",
};

interface GitHubCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { name?: string; date?: string } | null;
  };
  author: { login?: string } | null;
}

function relativeLabel(iso: string, now: Date): string {
  const then = new Date(iso);
  const diffDays = Math.floor((now.getTime() - then.getTime()) / 86_400_000);
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 14) return `${diffDays} days ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function isMergeCommit(message: string): boolean {
  return message.startsWith("Merge pull request") || message.startsWith("Merge branch");
}

async function fetchAreaCommits(area: ActivityArea, perPage: number): Promise<ActivityEntry[]> {
  const url =
    `https://api.github.com/repos/${REPO}/commits` +
    `?path=${encodeURIComponent(AREA_PATHS[area])}&per_page=${perPage}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  try {
    const res = await fetch(url, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const commits = (await res.json()) as GitHubCommit[];
    const now = new Date();
    return commits
      .filter((c) => !isMergeCommit(c.commit.message))
      .map((c) => {
        const date = c.commit.author?.date ?? "";
        return {
          sha: c.sha,
          headline: c.commit.message.split("\n")[0],
          author: c.commit.author?.name ?? c.author?.login ?? "Unknown",
          dateLabel: date ? relativeLabel(date, now) : "",
          date,
          url: c.html_url,
          area,
        };
      });
  } catch {
    return [];
  }
}

/** Latest component-library commits — the "What's new in Octuple" module. */
export async function getOctupleUpdates(limit = 5): Promise<ActivityEntry[]> {
  const entries = await fetchAreaCommits("octuple", limit + 5);
  return entries.slice(0, limit);
}

/** Combined team activity across designs, docs, and skills, newest first.
    Deduped by sha — one commit can touch several areas. */
export async function getTeamActivity(limit = 8): Promise<ActivityEntry[]> {
  const areas: ActivityArea[] = ["gallery", "docs", "skills"];
  const lists = await Promise.all(areas.map((a) => fetchAreaCommits(a, limit + 5)));
  const seen = new Set<string>();
  const merged: ActivityEntry[] = [];
  for (const entry of lists.flat().sort((a, b) => b.date.localeCompare(a.date))) {
    if (seen.has(entry.sha)) continue;
    seen.add(entry.sha);
    merged.push(entry);
  }
  return merged.slice(0, limit);
}
