<!--
Use this template when submitting a design into the gallery.
For code changes (components, build, gallery infrastructure), use the default PR template instead.
-->

## Summary

<!-- One paragraph: what is this design, what user need does it serve, what persona is it for. -->

## Metadata

- **Category:** <!-- one of: talent-management, talent-acquisition, octuple, talent-forge, workforce-exchange, personal-career-site, resource-management, talent-flex, job-intelligence-engine, admin-console, analytics -->
- **Version:** <!-- tailwind | og -->
- **Slug:** <!-- gallery URL slug, lowercase kebab-case -->
- **Built with skill:** <!-- design-tw-ux-designer | design-og-ux-designer -->

## Preview

<!-- Drag the thumbnail.png into this section, or paste the gallery URL once the PR's preview deployment is live. -->

## Design review checklist

- [ ] Files are under `gallery/public/content/designs/<category>/<slug>/`
- [ ] `meta.json` is present and validates against the schema
- [ ] `thumbnail.png` is at least 800 × 500
- [ ] `index.html` (or React route output) renders standalone — no broken asset paths
- [ ] No real customer data, employee names, or PII in the mock content
- [ ] Color contrast meets WCAG AA for body text
- [ ] Interactive elements have visible focus states
- [ ] Empty / loading / error states are represented where the design implies them

## Content review (against Eightfold standards)

- [ ] All product terminology matches `.claude/skills/_content/terms-list.md` (branded terms capitalized correctly; no deprecated terms)
- [ ] Voice and tone follow `.claude/skills/_content/content-design-standards.md`
- [ ] Button labels are action verbs ("Save changes", not "Click here")
- [ ] Error copy is calm and actionable
- [ ] No marketing voice in data-heavy views (tables, reports)

## Accessibility

- [ ] Headings are in a logical hierarchy (no skipped levels)
- [ ] Form fields have visible labels (not placeholder-only)
- [ ] Icon-only buttons have an `aria-label`
- [ ] Color is not the sole conveyor of meaning (status, errors)

## Reviewer notes

<!-- Anything reviewers should focus on, or known issues you're aware of and want feedback on. -->
