---
name: audit-method
description: "Step-by-step procedure for a full, read-only UI/UX design audit of a codebase, URL, screenshots or Figma export, producing a scored report with rule-cited findings. Use when asked to audit, assess, score or health-check a UI, or via /ux-audit."
---

# Audit method (read-only)

Never edit project source during an audit. Write only inside `.ux-doctor/` (`audit.md`, `shots/`); never edit `.git/info/exclude` or any other file. Never install dependencies or start servers. If nothing is running and no URL or screenshots were given, ask once, then continue code-only under the fallback in step 2.

`<skill>` = the `ux-doctor` skill folder (the directory with its `SKILL.md`). Severity, lowering, evidence labels, project constraints and tool usage are defined in `../ux-doctor/SKILL.md` and `../ux-doctor/references/finding-format.md` — not repeated here.

## 1. Scope (≤ 2 questions, otherwise assume)
Target = argument, else the current project. Flags: `--focus <dimension|tag>` limits to one knowledge skill; `--quick` = top-3 dimensions by relevance, no subagents. Detect stack (Tailwind, CSS/SCSS, CSS-in-JS, React/Vue/Svelte, native, Figma export, plain screenshots) and the project's own tokens/theme file (`tailwind.config.*`, `:root{--*}`, `theme.*`, `tokens.*`) and any `DESIGN.md` — these are the project's own design decisions and override playbook example values.
- **Read project constraints** (ground rule 1, `../ux-doctor/SKILL.md`) and print a `Constraints:` line. Record **Accepted by design** brand decisions (e.g. a single-weight brand font) for the report header.
- List the project's own audit/test scripts (axe, lighthouse, playwright, visual-compare) from `package.json`/Makefile; **ask before running** any. Never run deploy/publish scripts.

## 2. Collect evidence — rendered first
1. **Find an already running server** (install nothing, start nothing). Candidate ports from `package.json` scripts and framework config; defaults: Astro 4321, Vite 5173/4173, Next/Rails 3000, Angular 4200, Storybook 6006, wrangler 8787/8788, Django 8000, Hugo 1313. Probe both `http://localhost:<port>/` and `http://[::1]:<port>/` — dev servers often bind IPv6 only. Where available confirm it serves *this* project: `lsof -a -p <pid> -d cwd`.
2. **Scan each audited route** from the project root: `node <skill>/scripts/cta-scan.mjs <url> --render --shots .ux-doctor/shots` (usage: `finding-format.md`). Without a browser run it without `--render` (static, approximate). Repeat with `--scheme dark|light` when there is a theme toggle. A registered browser tool may replace this.
3. **View every screenshot** (desktop 1440×900, mobile 390×844). Label per `../ux-doctor/SKILL.md` (stated viewport).
4. **Code**: list key screens/routes and shared components (layout, buttons, forms, cards, nav, tables, modals). Run the measurements in `finding-format.md` (spacing, type, colour per theme, shadows, borders, radii). Use `rg` (or `grep -r`); sample ≥1 file per component family plus all global styles.
5. **Screenshots/Figma given by the user**: view every image; findings are `inferred`.

**Code-only fallback** (no server, screenshots or browser): visible-together findings are `inferred (no render)`; reconstruct the first viewport as header/nav + first section. The report header says `Visual confidence: low (no render)`; do not score Hierarchy or Layout as "no issues" or list visual-hierarchy items in "What already works".

State what you could not inspect.

## 3. Viewport pass (mandatory, before the dimension passes)
For the home page and each primary route, list **every control visible in the first viewport** at desktop and mobile, **including the global header/nav** (sticky or not — never exempt): label, target, style (primary/secondary/link). Use `cta-scan` output when you have it. Feed the list to group 1 below and to the persistent-navigation check in `ux-ui-patterns`. Duplicates (same normalised label AND destination, `DUP_IN_VIEWPORT`) and more than one primary become findings (confirm "primary" in CSS or a screenshot).

## 4. Passes — one per dimension
Load `ux-doctor` first, then for each dimension the matching knowledge skill. Read each skill's **Top checks** first; open `references/rules.md` only for candidate rules (token cost). Check each rule's *Audit check* against the evidence. Groups:
1. `ux-hierarchy-clarity` + `ux-color`
2. `ux-layout-spacing` + `ux-depth-craft`
3. `ux-typography`
4. `ux-interaction-cost` + `ux-ui-patterns` + `ux-web-patterns` (states, focus/touch, motion, tokens, AI-look tells)

If a `ux-auditor` agent is registered, run the four groups in parallel with it. Give it: target, evidence paths, **project constraints**, **evidence mode** (rendered|code-only), the **viewport list**, project tokens, and the **absolute paths** of its group's SKILL.md files and of `ux-doctor/references/finding-format.md`. It is read-only and writes nothing; you (the main agent) run `cta-scan --shots` beforehand. If not, run the groups sequentially yourself — never hand the work to a generic agent that can write files. Merge results, **dedupe** (same root cause = one finding), and re-check each blocker/major yourself against the source or render before reporting it.

## 5. Score & report
Apply severity, scoring and the report template from `../ux-doctor/references/finding-format.md` and `../ux-doctor/SKILL.md` (advisory items are unscored). After drafting fixes, check `../ux-doctor/references/rule-tensions.md`.
- **Called from `restyle-method`**: return the findings in memory; do not overwrite an existing `.ux-doctor/audit.md` without asking. When called from `--dry-run`, write nothing at all: run `cta-scan` without `--shots`.
- **Standalone**: write `.ux-doctor/audit.md`. If `.ux-doctor/` is not git-ignored, only PRINT the one-line command for the user to run (`echo '.ux-doctor/' >> .git/info/exclude`); never run it. Then print grade (+range), counts, the Fix-first items and the path. Always include "What already works" and a batched **Restyle plan**.
- Closing suggestion names the restyle command for the platform: `/ux-restyle --from-audit` (Pi, Cursor), `/ux-doctor:ux-restyle --from-audit` (Claude Code), `$restyle-method` (Codex).

## Quality bar
- Cap ~25 findings; merge repeats. No finding without rule ID + citation + stable anchor + evidence label + fix (or `needs a design decision`).
- A fix that hides, removes or moves a control states its end state per scroll state and what the freed space becomes; `keeps:` names only what the fix provably preserves (the restyle checks it afterwards).
- Don't flag intentional brand decisions consistent across the product unless they break contrast/legibility.
- Distinguish playbook (`p.N`), web (`web:<slug>`, `source: web`) and `(general practice)`.
- Include one **"AI-look tells"** line (generic gradients/blobs, adjective headlines, equal-weight CTAs, icon-circle feature rows — rules W1-80..W1-84; unchanged framework-default palette/type/spacing is a `(general practice)` note, not scored) when auditing a landing page or when most colours/type/spacing are framework defaults (see `ux-web-patterns`).
- Don't pad: dimensions with no issues get one line of rule IDs ("Checked, no issues").
