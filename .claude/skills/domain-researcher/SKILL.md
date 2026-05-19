---
name: domain-researcher
description: Conducts market research on competing products in a given software domain, then runs a targeted discovery interview informed by that research. Use this skill whenever a user wants to start building a software product in any domain — performance management, applicant tracking, learning management, employee engagement, etc. Always trigger this skill first — before any architecture, user stories, or code is written. It is the required entry point to the entire pipeline. Does research BEFORE asking questions, so the interview is informed by real competitor analysis.
---

# Domain Researcher

## Context Manifest

```yaml
unit_type: one_shot
required_inputs: []                              # entry point — no pre-approved artifacts
per_unit_inputs: []
forbidden_paths: []
budget_tokens: 300000
artifacts:
  summary:          docs/product/domain-doc.md   # primary output; also writes market-research.md + personas.md
outputs:
  - docs/product/market-research.md
  - docs/product/domain-doc.md
  - docs/product/personas.md
```

This skill is **inline** (runs in forger's parent thread, not as a subagent). It writes directly to disk and updates forger's approval state via normal state updates — no return-contract JSON required.

Researches the competitive landscape for a software domain, then conducts a targeted discovery interview informed by that research. Produces a Market Research Brief and a Domain Assumptions Document that feed every downstream skill.

**Key principle: Research comes BEFORE questions, not after.** The user should feel like they're talking to a domain expert, not a generic interviewer.

## Phase 1 — Market Research (BEFORE any user questions)

The skill receives only the **domain category** from the user (e.g., "performance management", "applicant tracking", "learning management", "employee engagement surveys"). It then researches the competitive landscape autonomously.

### 1. Identify the market

- Search for top enterprise products in this category
- Identify 3-5 leading competitors (e.g., for performance management: Culture Amp, Lattice, 15Five, BetterWorks, Workday Perf)
- Note their target market segment (SMB, mid-market, enterprise)

### 2. Research product flows in depth

For each competitor, research:
- What modules/features they offer (the full feature surface area)
- Admin configuration flows (how an HR admin sets things up)
- Employee experience flows (what ICs see and do)
- Manager experience flows (what managers see and do)
- Unique differentiators (what makes each product special)
- Pricing tiers and what's gated behind enterprise plans

### 3. Research screen patterns

- How do dashboards look? What metrics are shown?
- How do forms/wizards flow? How many steps?
- What configuration options exist (rating scales, question types, visibility controls)?
- How is calibration handled visually (9-box, bell curve, table)?
- How do notifications/reminders work?

### 4. Synthesize into a Market Research Brief

- Competitor comparison matrix (features x products)
- Standard modules in this domain (the "table stakes" features)
- Advanced/differentiating modules (what separates enterprise from SMB)
- Common personas and their key workflows
- UX patterns worth adopting
- Patterns to avoid (common complaints, poor UX decisions)

### 5. Present the research to the user

Show the market brief and say:

> "Based on my research, here are the standard modules in [domain]. Here's what the top products offer. Now let me ask you some targeted questions about YOUR specific needs."

Write the brief to `docs/product/market-research.md`.

---

## Phase 2 — Targeted Interview (INFORMED by research)

Now ask questions — but smart, research-informed questions in **4 rounds**. Don't dump all questions at once — ask one round, get answers, then proceed.

### How to Ask — Use Interactive Options

Use the `AskUserQuestion` tool for every question round. This gives users clickable options instead of asking them to type. Rules:

- **Single-select** for either/or choices (greenfield vs replacement, auth method, multi-tenancy)
- **Multi-select** for checklists (module selection, compliance requirements, integrations)
- Group related questions into a single `AskUserQuestion` call (up to 4 questions per call)
- Always include descriptive labels and descriptions on each option
- The user can always select "Other" to type a custom response — don't add your own "Other" option

### Round 1 — Company & Context

1. What is the company name (or a placeholder name for this project)?
2. Roughly how many employees will use this system?
3. What industry / sector is this for?
4. Is this a greenfield build or replacing an existing system?
   - **If replacement:** "Which product are you replacing? What did you like/dislike about it?" (Research this product first — it's the most important reference.)

**Delivery:** Use `AskUserQuestion` with 2 questions:
- "Is this a greenfield build or replacing an existing system?" — single-select: `Greenfield` / `Replacing an existing product`
- "What industry / sector?" — single-select with common options: `Technology` / `Financial Services` / `Healthcare` / `Professional Services` (user can pick "Other" for anything else)

Ask company name and size as a follow-up text question (these need free-form input).

### Round 2 — Module Selection (RESEARCH-BACKED)

Instead of asking open-ended methodology questions, present the modules discovered in research as a checklist:

> "Based on my research of [competitors], here are the standard modules in [domain]. Which ones are in scope?"

Present a checklist where each option includes a one-line description based on how the researched products implement it. For example (performance management):

- [ ] Review Cycles (bi-annual/quarterly/continuous) — Culture Amp supports 4 feedback components per cycle
- [ ] Self-Reflection — standard in all products, usually with configurable question sets
- [ ] Manager Reviews — written narrative + rating, with per-question sharing visibility
- [ ] Peer Feedback (with nominations) — Lattice allows employee-initiated, Culture Amp requires admin setup
- [ ] Upward Feedback — less common, Culture Amp includes it as optional component
- [ ] Calibration (bell curve, 9-box) — enterprise feature, usually gated behind higher tiers
- [ ] Goal Setting / OKRs — Lattice has deep OKR integration, 15Five focuses on weekly check-ins
- [ ] Continuous Feedback / Check-ins — 15Five's core differentiator
- [ ] PIPs (Performance Improvement Plans) — enterprise compliance feature
- [ ] Analytics & Dashboards — all products offer, depth varies significantly
- [ ] Compensation Planning — advanced, usually enterprise-only
- [ ] Succession Planning — advanced, usually enterprise-only

**Delivery:** Use `AskUserQuestion` with `multiSelect: true`. Each module is an option with:
- `label`: Module name (e.g., "Review Cycles")
- `description`: One-line research-backed description (e.g., "Bi-annual/quarterly/continuous — Culture Amp supports 4 feedback components per cycle")

Since AskUserQuestion supports max 4 options, split modules into batches of 4 questions with 4 options each if needed. Group related modules together (e.g., core review modules in one question, advanced modules in another).

### Round 3 — Deep Dive per Module

For each selected module, ask targeted questions informed by the research. For example, if they select "Review Cycles":

> "Culture Amp's review cycles include 4 feedback components (self, manager, peer, upward) with per-component timelines and configurable question sharing. Lattice offers a simpler 2-step flow. Which is closer to what you need?"

**Delivery:** For each selected module, use `AskUserQuestion` with single-select options representing the different competitor approaches discovered in research. For example:
- Question: "Review cycle structure — which approach?"
- Options: `Full (self + manager + peer + upward)` / `Standard (self + manager only)` / `Lightweight (manager review only)`
- Each option's description cites which competitor uses that approach

This is radically different from asking "How often do reviews happen?" in a vacuum.

**Conditional follow-ups:** If the user said "no OKRs" in Round 2, don't ask about goal-setting configuration. If they said "no calibration in Phase 1", don't ask about bell curve setup.

### Round 4 — Enterprise & Technical

1. Which integrations are needed? (Ask open-ended — don't limit to a fixed HRIS list. The user might use Paylocity, Namely, or something unexpected.)
2. What authentication method? (SSO via Okta/Azure AD, email/password, other)
3. Any compliance requirements? (GDPR, CCPA, SOC2, HIPAA, local labour laws)
4. Multi-tenancy needed? (Single company or SaaS product for multiple companies)
5. Any known constraints? (Tech stack preferences, timeline, team size)

**Delivery:** Use `AskUserQuestion` with up to 4 questions:
- "Authentication method?" — single-select: `SSO (Okta/Azure AD/SAML)` / `Email + password` / `Both (SSO + email fallback)`
- "Compliance requirements?" — multi-select: `GDPR` / `SOC2` / `CCPA` / `HIPAA`
- "Multi-tenancy?" — single-select: `Single company` / `SaaS (multi-tenant)`
- "Known tech stack preference?" — single-select: `No preference` / `Node.js/TypeScript` / `Python/Django` / `Go`

Ask integrations as a follow-up text question since it's open-ended.

Skip questions already resolved by prior answers.

---

## Phase 3 — Output

After the interview, produce three artifacts:

### 1. Market Research Brief (`docs/product/market-research.md`)

- Competitor analysis with feature matrix
- UX patterns worth adopting (with product citations)
- Patterns to avoid (common complaints)
- Module depth notes for each selected module — how the reference products implement it

### 2. Domain Assumptions Document (`docs/product/domain-doc.md`)

```markdown
# Domain Assumptions Document
**Project:** [Name]
**Version:** 1.0
**Status:** Pending Approval

## Organisation Profile
- Company: [name]
- Size: [headcount]
- Industry: [sector]
- Build type: [Greenfield / Replacement]
- If replacement: [product being replaced + what they liked/disliked]

## Selected Modules
[List of modules selected in Round 2, with configuration details from Round 3]

## Personas
| Persona | Role | Key Goals | Pain Points |
|---|---|---|---|
| ... | ... | ... | ... |

*(Derive personas from the research + interview — don't use a fixed template)*

## Integrations & Technical Constraints
- Integrations: [open-ended list from Round 4]
- Auth: [method]
- Compliance: [list]
- Multi-tenancy: [Yes/No]
- Constraints: [list]

## Open Questions
*(List anything the user was unsure about or deferred)*

## Out of Scope (this phase)
*(List anything explicitly excluded)*
```

### 3. Module Depth Notes

For each selected module, a summary of how the reference products implement it. These feed directly into story-writer and design-tw-ux-designer. Include them as a section within the market research brief.

---

Present all artifacts inline in the conversation, then write them to the `docs/` folder. Hand off to **forger** for user approval before any other skill proceeds.

---

## Behavioral Rules

1. **NEVER ask a question you could answer through research.** If you can find the answer by searching the web, do that first.
2. **ALWAYS present options with context.** Don't ask "What rating scale?" — ask "Culture Amp recommends a 4-point scale to avoid central tendency. Lattice defaults to 5-point. Which do you prefer, or do you have a custom scale?"
3. **Research BEFORE questions, not after.** The user should feel like they're talking to a domain expert, not a generic interviewer.
4. **Show your work.** Present the market research summary before asking questions so the user trusts you know the space.
5. **Conditional follow-ups.** If the user says "no OKRs", don't ask about goal-setting. If they say "no calibration in Phase 1", don't ask about bell curve configuration.
6. **Ask for the replacement product.** If it's a replacement build, the product being replaced is the most important reference. Research it first.
7. **Open-ended integration questions.** Don't limit to a fixed HRIS list — the user might use Paylocity, Namely, or something unexpected.
8. **Present artifacts inline.** Show the market research brief and domain doc in the conversation, not just file paths.

## Interview Tone

- Keep it conversational, not like a form
- If the user gives a vague answer, ask one follow-up before moving on
- If they don't know something, mark it as an open question — don't block progress
- You should sound like a domain consultant who has done this before, because you have (via research)
