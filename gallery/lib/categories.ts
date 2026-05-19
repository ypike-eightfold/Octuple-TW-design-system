// The 11 product categories the gallery supports. Adding a new category requires:
// 1. add an entry to this array
// 2. create the corresponding empty directory under public/content/designs/<slug>/
// 3. update the publish-design SKILL.md's allowed list
// 4. update the design.md PR template's allowed list

export type CategorySlug =
  | "talent-management"
  | "talent-acquisition"
  | "octuple"
  | "talent-forge"
  | "workforce-exchange"
  | "personal-career-site"
  | "resource-management"
  | "talent-flex"
  | "job-intelligence-engine"
  | "admin-console"
  | "analytics";

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { slug: "talent-management", name: "Talent Management", blurb: "Employee profiles, growth, reviews, org charts." },
  { slug: "talent-acquisition", name: "Talent Acquisition", blurb: "Candidate experience, job postings, hiring flows." },
  { slug: "octuple", name: "Octuple", blurb: "Original design system explorations and patterns." },
  { slug: "talent-forge", name: "Talent Forge", blurb: "Internal tools and prototype workflows." },
  { slug: "workforce-exchange", name: "Workforce Exchange", blurb: "Marketplace and talent-sharing surfaces." },
  { slug: "personal-career-site", name: "Personal Career Site", blurb: "Candidate-facing career pages and job search." },
  { slug: "resource-management", name: "Resource Management", blurb: "Resource allocation, staffing, project planning." },
  { slug: "talent-flex", name: "Talent Flex", blurb: "Flexible work and contingent talent flows." },
  { slug: "job-intelligence-engine", name: "Job Intelligence Engine", blurb: "Job and skills intelligence surfaces." },
  { slug: "admin-console", name: "Admin Console", blurb: "Configuration, governance, and platform admin." },
  { slug: "analytics", name: "Analytics", blurb: "Dashboards, reports, and insight views." },
];

export const CATEGORY_SLUGS: CategorySlug[] = CATEGORIES.map((c) => c.slug);

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
