---
name: audit-method
description: "Step-by-step procedure for a full, read-only UI/UX design audit of a codebase, URL, screenshots or Figma export, producing a scored report with rule-cited findings. Use when asked to audit, assess, score or health-check a UI, or via /ux-audit."
---

# Audit method (read-only)

**Boundaries**: never edit project source. Write only inside `.ux-doctor/` (`audit.md`, `findings.json`, `shots/`); never edit `.git/info/exclude` or any other file. Never install dependencies or start servers. If nothing is running and no URL or screenshots were given, ask once, then continue code-only.

`<skill>` = the `ux-doctor` skill folder. Severity, evidence labels and project constraints: `../ux-doctor/SKILL.md`. Finding JSON, measuring and the report template: `../ux-doctor/references/finding-format.md`.

## 1. Scope (≤ 2 questions, otherwise assume)
Target = argument, else the current project. `--focus <dimension|tag>` limits to one dimension skill; `--quick` = the Critical 20 plus the top 3 dimensions by relevance, no subagents. Detect the stack and the project's tokens/theme file and any `DESIGN.md`: these override the defaults.
- Read the **project constraints** (ground rule 1) and print a `Constraints:` line. Record **Accepted by design** brand decisions for the report header.
- List the project's own audit or test scripts (axe, lighthouse, playwright, visual-compare); **ask before running** any. Never run deploy or publish scripts.

## 2. Collect evidence — rendered first
1. **Find an already running server.** Candidate ports from `package.json` scripts and framework config; defaults: Astro 4321, Vite 5173/4173, Next/Rails 3000, Angular 4200, Storybook 6006, wrangler 8787/8788, Django 8000, Hugo 1313. Probe both `http://localhost:<port>/` and `http://[::1]:<port>/`. Where available confirm it serves *this* project: `lsof -a -p <pid> -d cwd`.
2. **Scan each audited route**: `node <skill>/scripts/cta-scan.mjs <url> --render --shots .ux-doctor/shots` (static without a browser; `--scheme dark|light` when there is a theme toggle). A registered browser tool may replace this.
3. **View every screenshot** (desktop 1440×900, mobile 390×844).
4. **Code**: list key screens and shared components (layout, buttons, forms, cards, nav, tables, modals); collect values per `finding-format.md` (sample ≥ 1 file per component family plus all global styles).
5. **User screenshots or Figma**: view every image; findings are `inferred`.

**Code-only fallback**: visible-together findings are `inferred (no render)`; set `"evidence": "code-only"` in `findings.json`; the header says `Visual confidence: low (no render)`; no visual-hierarchy items in "What already works". State what you could not inspect.

## 3. Viewport pass (before the dimension passes)
For the home page and each primary route list **every control visible in the first viewport** at desktop and mobile, **including the global header/nav**: label, target, style (primary/secondary/link). Use `cta-scan` output when you have it. A `DUP_IN_VIEWPORT` flag or a doubled CTA → `../ux-doctor/references/duplicate-cta.md`.

## 4. Passes
First check the **Critical 20** (`../ux-doctor/references/critical.md`) on every audited screen. Then one pass per group, reading each skill's **Top checks** first and opening a rule entry only for a candidate finding:
1. `ux-hierarchy-clarity` (incl. `slop-scan` for AI-look tells, W5-01)
2. `ux-layout-spacing` + `ux-depth-craft`
3. `ux-typography` + `ux-color`
4. `ux-interaction-cost` + `ux-ui-patterns`

`ux-web-patterns` is lookup-only: consult it with `rule.mjs` only for a component no dimension rule covers.

If a `ux-auditor` agent is registered, run the four groups in parallel. Give each: target, evidence paths, **project constraints**, **evidence mode** (rendered|code-only), the **viewport list**, project tokens, and the **absolute paths** of its group's `SKILL.md` files, `critical.md`, `defaults.md` and `finding-format.md`. It returns finding JSON and writes nothing; you run `cta-scan --shots` beforehand. Without the agent, run the groups yourself — never hand them to a generic agent that can write files. Merge, **dedupe** (same root cause = one finding), and re-check every blocker and major yourself against the source or render.

## 5. Score & report
Write the merged findings to `.ux-doctor/findings.json` and run `node <skill>/scripts/score.mjs .ux-doctor/findings.json`; fix any lint errors it prints, then copy its severities, scores and grade into the report. Before drafting fixes that touch the same property, check `../ux-doctor/references/rule-tensions.md`.
- **Called from `restyle-method`**: keep the findings in memory (`score.mjs -` reads stdin); don't overwrite an existing `.ux-doctor/audit.md` without asking. Under `--dry-run` write nothing: run `cta-scan` without `--shots`.
- **Standalone**: write `.ux-doctor/audit.md`. If `.ux-doctor/` is not git-ignored, only PRINT `echo '.ux-doctor/' >> .git/info/exclude` for the user; never run it. Then print the grade (+ range), counts, the Fix-first items and the path, and name the restyle command: `/ux-restyle --from-audit` (Pi, Cursor), `/ux-doctor:ux-restyle --from-audit` (Claude Code), `$restyle-method` (Codex).

## Quality bar
- Cap ~25 findings; merge repeats. Every finding passes `score.mjs`.
- A fix that hides, removes or moves a control states its end state per scroll state and what the freed space becomes (`duplicate-cta.md`); `keeps:` names only what the fix provably preserves.
- Don't flag intentional brand decisions consistent across the product unless they break a hard floor.
- On landing pages, or when most values are framework defaults, include one **AI-look tells** line from `slop-scan.mjs` (W5-01); never claim a page was AI-generated.
- Don't pad: dimensions with no issues get one line of rule IDs ("Checked, no issues").
