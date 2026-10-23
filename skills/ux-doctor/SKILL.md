---
name: ux-doctor
description: "Core of the ux-doctor plugin. Defines the severity scale, scoring, finding format and the map of the eight UI knowledge skills (built from The UI/UX Playbook, plus a secondary web-pattern layer). Use at the start of any UI audit, design review or restyle, or when asked to \"check the design\", \"improve the UI\", \"make it look better\" or \"review the styling\"."
---

# ux-doctor — core

Evidence-based UI auditing, review and restyling. All design judgements come from the playbook rules in the `ux-*` knowledge skills (188 playbook rules with IDs like `E-12` and a PDF page, + 253 web-pattern rules). Sources: playbook rules (IDs `A-01`…`H-18`, PDF pages) are primary; `W1-…W5-…` rules (skill `ux-web-patterns`, 253 paraphrased tips from public UX pattern pages and published guidance on generic AI-generated UI) are secondary and must be labelled `source: web`; on conflict the playbook wins. Do not give taste-based advice without a rule ID; if no rule fits, label it `(general practice)`; label anything that is an estimate rather than a playbook claim `(inference)`.

## Workflows (pick one)
| Intent | Skill | Command (Claude Code / Cursor / Pi) |
|---|---|---|
| Score a whole screen/app/codebase | `audit-method` | `/ux-audit` |
| Critique a diff, PR, file or screenshot | `review-method` | `/ux-review` |
| Apply fixes / restyle | `restyle-method` | `/ux-restyle` |
| Look up a rule / principle / number | this skill + `references/` | `/ux-rules` |

Claude Code namespaces plugin commands (`/ux-doctor:ux-audit` …). On Codex (no plugin commands) invoke the workflow skill directly, e.g. `$audit-method`.

## Knowledge skills (load only what the task needs)
| Skill | Covers | Rules |
|---|---|---|
| `ux-hierarchy-clarity` | hierarchy, proximity, clarity, contrast, simplicity, visual cues | 34 |
| `ux-layout-spacing` | alignment, whitespace, layout, balance, consistency | 37 |
| `ux-depth-craft` | shadows, outlines, borders, glass, imagery | 20 |
| `ux-color` | palette, backgrounds, dark mode, status colours | 11 |
| `ux-typography` | fonts, sizes, line-height, text contrast, alignment | 40 |
| `ux-interaction-cost` | clicks, effort, friction | 16 |
| `ux-ui-patterns` | forms, passwords, dialogs, product pages, mobile, states, nav | 30 |
| `ux-web-patterns` | *(secondary, web)* UI states, motion, focus/touch, tokens, dark mode, overlays, data, AI-look tells | 253 (W-) |

Full rule database: `references/rules.json` (in the ux-doctor skill folder; each rule has a `citation`: playbook `p.N`, web `web:<slug>`). Query it compactly with `node scripts/rule.mjs <ID|tag|keyword>`. Numbers: `references/numeric-cheatsheet.md`. Method for the checks, scoring and report template: `references/finding-format.md`. Known pairs of rules that pull against each other: `references/rule-tensions.md`.

## Severity
Rule severities (high/medium/low) in the rule database are ux-doctor's own judgement made during extraction — the playbook does not rate severity. Final finding severity = rule severity × placement. This table is the **default**:

| Rule severity | Primary flow, above the fold, or repeated ≥3× | Secondary / isolated |
|---|---|---|
| high | major | major |
| medium | major | minor |
| low | minor | polish |

- **Lowering** (the only permitted override): lower a finding by exactly one level with a one-line reason printed in the finding, e.g. `sev: minor (table: major — passes the WCAG 2.2 AA 24px target minimum)`. Never raise a finding above the table; blockers are the only items outside it. "Repeated ≥3×" counts only instances where the defect is visible. Never override the table silently.
- **`(general practice)` checks without a rule severity** (e.g. the same-destination CTA test, persistent navigation) carry the severity stated in the check itself (e.g. same-destination CTA: major if ≥ 2 are filled, else minor). Score them at playbook weights if the check lives in a playbook dimension's skill, at web weights if it comes from `ux-web-patterns`.
- **blocker** is outside the table and only for: users cannot complete a task or read key content (normal text < 4.5:1, or large text < 3:1, on primary content); a destructive action styled as safe or without confirmation/undo; a primary action unreachable by touch/keyboard; a change that breaches a project constraint (`review-method`).
- **advisory** (0 points, unscored, one line each): (a) a project-token value that passes every hard threshold — contrast ≥ 4.5:1 text / 3:1 large, text ≥ 12px, measured line length 45–75 characters on desktop (30–40 on mobile, playbook E-23), targets ≥ 24px, heading line-height < paragraph line-height — even when it differs from a playbook default; (b) anything on the **Accepted by design** list: brand decisions the audit records in its header (e.g. a single-weight brand font). Accepted items are excluded from scoring, but any missing contrast they cause is still noted.

## Evidence labels (one per claim)
- **verified** — read from code or computed by a tool (e.g. `contrast.mjs`).
- **measured** — from the rendered page: `cta-scan.mjs --render`, a browser tool, computed style, or a screenshot at a stated viewport.
- **inferred** — estimates and perceptual claims.

Claims about what is visible together (above the fold, competing/duplicate CTAs, wrapping) are `measured` or `inferred`, never `verified`. Without a render write `inferred (no render)`. One label per claim.

## Ground rules
1. **Project rules outrank playbook rules.** Before judging, read the target's `AGENTS.md`, `CLAUDE.md` (follow `@imports`), `.cursor/rules/*`, `DESIGN.md` and the design sources they point to (search hidden dirs too; use `grep -r` if `rg` is missing). Extract a numbered **Project constraints** list: fixed copy/legal text, brand/palette/font decided elsewhere, do-not-edit paths, required commands, CSP. Never propose a fix that breaches one; list it once as `Blocked by project rule` with `file:line` of the rule. Give the list to every subagent. All workflow skills read constraints this way (defined here only).
2. Evidence before opinion: every finding cites a stable anchor (see `references/finding-format.md`) or a screenshot region, the rule ID, a citation and an evidence label.
3. Prefer consistency with the project's own tokens/design system over the playbook's example values; the playbook values are defaults when the project has none. Project tokens are decisions, not violations: a token that passes the hard thresholds is at most `advisory`.
4. Never invent numbers. Measure instead of eyeballing, or say "not measured": `scripts/contrast.mjs` (ratios; `--over <hex>` flattens translucent colours), `scripts/cta-scan.mjs` (CTAs and primaries in the first viewport, duplicate CTAs; usage in `references/finding-format.md`), `scripts/slop-scan.mjs` (counts AI-look tells, W5-01), `scripts/rule.mjs` (rule lookup), grep for values. Tool flags are hints that feed the severity table; confirm them against CSS or a screenshot. All paths are relative to this skill folder.
5. **Citations**: playbook rules cite `p.N`; web rules cite `web:<slug>` and the report says plainly that there is no page. Every fix states the visible result it preserves. Where no good option exists the finding says `needs a design decision` and offers no fix.
6. Fixes must be minimal and token-based; don't redesign what isn't broken. After applying or proposing any fix, check `references/rule-tensions.md` for pairs that pull against each other and resolve them before shipping both.
7. Subagents are optional: use the `ux-auditor` / `ux-reviewer` / `ux-restyler` agents only if they are registered on this platform; otherwise run the same passes sequentially yourself, in the same read-only/edit boundaries. Never substitute a generic write-capable agent for a read-only pass.
8. Bundled files are addressed relative to a skill folder (`references/…`, `scripts/…`). Sibling skills live next to it: `../ux-doctor/…`. When delegating, pass absolute paths.
