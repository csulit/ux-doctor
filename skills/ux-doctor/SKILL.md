---
name: ux-doctor
description: "Core of the ux-doctor plugin: severity, evidence labels, the Critical 20 checks and the map of the seven UI dimension skills (built from The UI/UX Playbook, plus core web rules for states, focus, touch and AI-look tells). Use at the start of any UI audit, design review or restyle, or when asked to \"check the design\", \"improve the UI\", \"make it look better\" or \"review the styling\"."
---

# ux-doctor — core

Design judgements come from rules, not taste. Every rule has an ID, a citation and a **kind**:
- `check` — a testable violation; only checks become findings.
- `default` — a value to build or restyle with.
- `principle` — background; never a finding.

Playbook rules (`A-01`…`H-18`, cite `p.N`) are primary. Core web rules (`W…`, cite `web:<slug>`, label `source: web`) sit inside the dimension skills next to the playbook rules they complement; the extended web reference (`ux-web-patterns`) is lookup-only. A rule that yields to another says so in its `scope`. No rule fits: label the point `(general practice)`; an estimate: `(inference)`.

## Workflows (pick one)
| Intent | Skill | Command (Claude Code / Cursor / Pi) |
|---|---|---|
| Write or change UI (no audit asked) | `ux-build` | — |
| Score a whole screen, app or codebase | `audit-method` | `/ux-audit` |
| Critique a diff, PR, file or screenshot | `review-method` | `/ux-review` |
| Apply fixes / restyle | `restyle-method` | `/ux-restyle` |
| Look up a rule, principle or number | `scripts/rule.mjs` | `/ux-rules` |

Claude Code namespaces plugin commands (`/ux-doctor:ux-audit` …). On Codex invoke the workflow skill directly (`$audit-method`).

## What to read, in order
1. `references/critical.md` — the Critical 20: check these first on every screen.
2. The **Top checks** of each dimension skill the task touches (at most 7 each).
3. `references/defaults.md` — the one value per property, with hard floors and targets.
4. A rule's full entry only when a candidate finding needs it: `node scripts/rule.mjs <ID>`.

| Dimension skill | Covers |
|---|---|
| `ux-hierarchy-clarity` | button ranking, emphasis, proximity, clarity, contrast of badges and text on images, AI-look headline and hero tells |
| `ux-layout-spacing` | alignment, whitespace, spacing scale, grids, cards, consistency, icon sets |
| `ux-depth-craft` | shadows, borders, layering, glass, overlapping imagery, nested cards |
| `ux-color` | brand-colour restraint, palette, backgrounds, dark mode, status colours |
| `ux-typography` | fonts, sizes, line-height, line length, weight, text colour and contrast |
| `ux-interaction-cost` | clicks, choice, recall, thumb zone, touch targets, response time, motion that hides content |
| `ux-ui-patterns` | forms and field states, focus, passwords, OTP, dialogs, destructive actions, empty/error/404 states, nav |
| `ux-web-patterns` | extended reference, lookup only: motion details, tables, charts, overlays, pickers, settings |

Other references: `references/finding-format.md` (finding JSON, measuring, report template), `references/rule-tensions.md` (the six genuine trade-offs), `references/duplicate-cta.md` (only when a CTA is doubled), `references/numeric-cheatsheet.md` (playbook values with pages), `references/rules.json` (all rules).

## Severity
Rule severity (high/medium/low) is ux-doctor's judgement: `high` means a task breaks or a hard floor fails. `scripts/score.mjs` turns it into the finding severity: high → major; medium → major in the primary flow (primary flow, above the fold or visibly repeated 3+ times), else minor; low → minor in the primary flow, else polish.
- **Lowering** (the only override): one level, with a one-line reason printed in the finding. Never raise above the table.
- **blocker** is outside the table and only for: normal text < 4.5:1 or large text < 3:1 on primary content; a destructive action styled as safe or without confirmation or undo; a primary action unreachable by touch or keyboard; a change that breaches a project constraint.
- **advisory** (0 points): a project-token value that passes every hard floor in `references/defaults.md`, even when it differs from the target; anything on the audit's **Accepted by design** list (brand decisions such as a single-weight brand font).

## Evidence labels (one per claim)
`verified` — read from code or computed by a tool. `measured` — from the rendered page (`cta-scan --render`, a browser tool, computed style, a screenshot at a stated viewport). `inferred` — estimates and perceptual claims; `inferred (no render)` without a render. Claims about what is visible together (above the fold, competing CTAs, wrapping) are never `verified`.

## Ground rules
1. **Project rules outrank playbook rules.** Before judging, read the target's `AGENTS.md`, `CLAUDE.md` (follow `@imports`), `.cursor/rules/*`, `DESIGN.md` and the design sources they point to (search hidden dirs; `grep -r` if `rg` is missing). Extract a numbered **Project constraints** list: fixed copy or legal text, brand palette or fonts decided elsewhere, do-not-edit paths, required commands, CSP. Never propose a fix that breaches one; list it once as `Blocked by project rule` with the rule's `file:line`. Pass the list to every subagent.
2. **Project tokens are decisions.** Prefer the project's tokens and design system over the defaults; a token that passes the hard floors is at most advisory.
3. **Measure, don't guess** (paths relative to this skill folder): `scripts/contrast.mjs` (ratios; `--over <hex>` for translucent colours), `scripts/cta-scan.mjs` (CTAs and primaries in the first viewport), `scripts/slop-scan.mjs` (AI-look tells, W5-01), `scripts/rule.mjs` (rule lookup), `scripts/score.mjs` (finding lint, severities, grade), grep for values. Tool flags are hints: confirm them in CSS or a screenshot. Otherwise say "not measured".
4. **Cite**: playbook `p.N`; web `web:<slug>` with `source: web` and no page. Every fix states the visible result it keeps; where no good option exists write `needs a design decision`.
5. **Minimal, token-based fixes**; don't redesign what isn't broken. Before shipping two fixes that touch the same property, check `references/rule-tensions.md`.
6. **Subagents are optional**: use `ux-auditor`, `ux-reviewer` and `ux-restyler` only if registered; otherwise run the same passes yourself within the same read-only or edit boundaries. Never hand a read-only pass to a generic write-capable agent. Pass absolute paths when delegating; sibling skills live next to this folder (`../ux-typography/…`).
