# Finding format, scoring and report template

## One finding
Write each finding as one object in `.ux-doctor/findings.json` (or in memory under `--dry-run`), then render it in the report:
```json
{ "rule": "F-09", "placement": "primary", "title": "Muted nav links fail contrast",
  "where": "src/components/Nav.tsx · NavLink · line 42 @ a1b2c3d",
  "evidence": "#9CA3AF on #FFFFFF = 2.5:1 (contrast.mjs)", "label": "verified",
  "impact": "Nav labels are hard to read in daylight.",
  "fix": "text-gray-600 (#4B5563, 7.6:1) — keeps: the muted look relative to the active link" }
```
- `rule`: a `check` rule ID (cite the canonical ID; an old one resolves with `rule.mjs`, e.g. `W1-12 → F-09`) or `"general practice"` with `"severity": "major" | "minor"` and a `"dimension"`. Principles and defaults are never findings.
- `placement`: `primary` = primary flow, above the fold, or visibly repeated 3+ times; else `secondary`.
- Optional: `"lower": "<one-line reason>"` (one level down, the only permitted override), `"contested": true` (the report prints a grade range), `"blocker": "<reason>"` (only the cases in `../SKILL.md`), `"advisory": "<reason>"` (0 points), `"dimension"` (required for extended web rules).
- `where`: a stable anchor: file + selector/symbol/component + `line N @ <short sha>` (or route + screenshot region). Lines go stale; the name stays findable.
- `label`: `verified` | `measured` | `inferred` (`inferred (no render)` without a render).
- `fix`: a concrete, token-based change with target values, then `— keeps: <the visible result it preserves>`. For hide/remove/move fixes state the end state per scroll state (`duplicate-cta.md`). No good option: `needs a design decision`. A fix blocked by a project rule is listed once as `Blocked by project rule — <file:line>` instead.
- One finding per root cause; repeats go under one finding as `+7 more: ...`.

## Scoring
Run `node scripts/score.mjs .ux-doctor/findings.json` (or `-` for stdin, `--json` for machine output). It rejects incomplete findings, merged or unknown IDs, principles and defaults, and prints the final severity of each finding (rule severity × placement, then any lowering), the score of each of the 7 dimensions, the overall score, the grade and, for contested lowerings, the range. Copy its numbers into the report; never compute them by hand. Pass `"evidence": "code-only"` at the top level when there is no render (Hierarchy and Layout are then never scored as "no issues") and `"notChecked": [...]` for dimensions you skipped. The score tracks change; it is not a verdict.

## Measuring (don't eyeball what a tool can compute)
Tool paths are relative to the ux-doctor skill folder. Values and hard floors: `defaults.md`.
- **Contrast**: `node scripts/contrast.mjs <fg> <bg> [--large] [--over <hex>]` → ratio + AA/AAA. `--over` flattens a translucent colour onto the one beneath it. Compute every text/background token pair per theme. Computed values win over the playbook's labels.
- **CTAs per viewport**: `node scripts/cta-scan.mjs <url|file.html|-> [--render] [--shots <dir>] [--json] [--scheme light|dark] [--filled <class-regex>] [--base <url>]`. Lists links and buttons in the first viewport (header included) and flags `DUP_IN_VIEWPORT` (then load `duplicate-cta.md`) and `MULTI_PRIMARY_IN_VIEWPORT`. Static mode approximates; `--render` measures in an installed Chrome. Flags are hints: confirm "primary" in CSS or a screenshot. `--shots` writes PNGs, so use it only where the workflow allows writing `.ux-doctor/shots/`. Exit 1 = flags.
- **AI-look tells**: `node scripts/slop-scan.mjs <url|file|dir|-> [--json] [--max-files N] [--list]`. Counts the tells of W1-80, W1-81, W1-83, W1-84 and W5-03..W5-12 with `file:line` hits, a tier (0–1 low, 2–3 medium, 4+ high) and the W5-01 verdict (one grouped finding at 3+ confirmed tells, else a `(general practice)` note). Confirm each hit and drop tells the brief or tokens chose. `HIDDEN_UNTIL_SCROLL` (W5-04) is a defect candidate scored on its own. Exit 1 = tells, 2 = bad input or incomplete scan. Writes nothing.
- **Line length**: count real characters per line in a browser (`ch` is the width of `0`; ~2.0 characters per em for proportional UI fonts, *inference*).
- **Collect values with grep**: `padding|margin|gap` (against the spacing scale), `font-family|font-size|line-height|font-weight`, colours (`#000`/`#fff` text, saturated backgrounds, status colours), `box-shadow` (grey on tinted backgrounds, hard shadows, unrelated definitions per tier), `border-radius`.
- **Rule lookup**: `node scripts/rule.mjs <ID|tag|keyword>` (exit 1 = none). Over-broad tags print a count per skill; add a word to narrow.

## Report template (`.ux-doctor/audit.md`, under ~100 lines)
```
# UX audit — <target>   (<date> · <git short sha>[+dirty])
Grade: <grade> (<score>/100)[, range <g1–g2>]  ·  blockers <n> · major <n> · minor <n> · polish <n> · advisory <n>   (from score.mjs)
Evidence: rendered (<viewports, schemes>) | code-only — Visual confidence: low (no render)
Constraints: 1) … 2) …            (project constraints; "none found" if none)
Accepted by design: … (excluded from scoring)

## Fix first (max 3)
Eligible only if: blocker or major, measured or verified, not blocked by a project rule, not a pure token-vs-playbook gap.
Rank: blockers first, then hard-floor failure > primary flow > visible reach > lowest cost.
1. #<finding no.> — before: <value> → target: <value> — verify: <command>

## Findings
| # | Sev | Rule | Where | Measured | Fix | Status |
|---|-----|------|-------|----------|-----|--------|
(one table; Status = open | fixed | deferred | blocked; web rules marked `source: web`)
Detail block, majors only (3 lines): what is wrong · why it matters here · what the fix keeps.

## Advisory         (one line each)
## Checked, no issues: <rule IDs on one line>
## What already works   (max 3; none may contradict a finding)
## Restyle plan   (batches: tokens → global → components → pages; reference finding numbers; list files)
Blocked by project rule: <finding #> — <file:line>
```
