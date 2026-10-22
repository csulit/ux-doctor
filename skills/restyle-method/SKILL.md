---
name: restyle-method
description: "Procedure for safely restyling a UI toward the playbook rules, from an audit report or from scratch: plan in batches, centralize tokens, apply minimal edits, verify. Use when asked to restyle, polish, fix design issues, improve the look, modernize or apply the design review, or via /ux-restyle."
---

# Restyle method (edits code)

`<skill>` = the `ux-doctor` skill folder (the directory with its `SKILL.md`). Severity, evidence labels, project constraints and tool usage are defined in `../ux-doctor/SKILL.md` and `../ux-doctor/references/finding-format.md`.

## 0. Preconditions
- **Working tree**: first record `git status --porcelain`. If a file you plan to touch is already dirty, ask before touching it. Never revert the user's edits. Prefer a new branch if the user agrees (don't create one silently).
- **Project constraints**: read them (ground rule 1, `../ux-doctor/SKILL.md`). Drop plan items that touch copy, palette or fonts unless each is explicitly approved by the user **and** not blocked by a project rule. Anything blocked goes in the report as `Blocked by project rule` with `file:line`.
- **Input**: `--from-audit` (read `.ux-doctor/audit.md`, use its Restyle plan; if missing, say so and offer to run `audit-method` first), a path/scope, or nothing (use `.ux-doctor/audit.md` if it exists, else run `audit-method --quick` on the scope, in memory — don't overwrite an existing report without asking). If the audit is older than the latest commit touching those files, re-check findings before applying.
- **Flags**: `--scope tokens|global|components|pages|all` (default `tokens` + `global` + `components`), `--dry-run` (plan only: writes NOTHING anywhere — no DESIGN.md, no `.ux-doctor/`, no screenshots; its embedded quick audit runs `cta-scan` without `--shots` and keeps results in memory), `--yes` (skip the plan confirmation; it never covers creating `DESIGN.md` or editing `AGENTS.md`/`CLAUDE.md`, which always need an explicit yes).
- **Scripts**: classify each command from `package.json`, lockfile/`packageManager`, Makefile and the Commands sections of `AGENTS.md`, `CLAUDE.md`, README:
  - **run**: typecheck, lint without fix, test, check, build.
  - **ask**: dev, serve, preview, anything that starts a server.
  - **never**: deploy*, publish, release, push, migrate, install/add, and any script whose body contains `deploy`, `--prod` or `wrangler deploy`.
  Show the exact commands in the plan confirmation.
- **Visual baseline BEFORE the first edit** (skipped by `--dry-run`): if the project has a visual-compare/baseline tool, take its baseline first; otherwise run `node <skill>/scripts/cta-scan.mjs <url> --render --shots .ux-doctor/shots` on the main routes (against an already running server) and keep the shots as "before". With no browser, **stop** and ask for before/after screenshots of the main route; the restyle stays `not visually verified` until they are reviewed.

## 1. Plan (show it, then ask once)
List batches in this order, with files and the finding numbers and rule IDs each fixes:
1. **Tokens** — if the project has no written design system, offer to create a short `DESIGN.md` at the repo root (one explicit decision each for type, colour, space, finish/depth, motion — values taken from existing tokens first, playbook defaults second) and to point `AGENTS.md`/`CLAUDE.md` at it so later sessions follow it; ask separately, and only do it on an explicit yes. The project's single source of truth for colour, type scale, spacing scale, radius, shadow tiers (add/adjust CSS variables / Tailwind theme / theme file). Creates the values later batches reference.
2. **Global** — base typography, body colour/background, focus styles.
3. **Components** — buttons (one primary per view), inputs/forms, cards, tables, nav, dialogs, states (empty/error/loading).
4. **Pages** — layout, grid, alignment, whitespace, page-specific hierarchy.

**Conflict pass before applying**: check `../ux-doctor/references/rule-tensions.md` and the plan itself for fixes that pull against each other Resolve each in the plan — don't ship both.

Unless `--yes`, wait for confirmation (or the user's edits to the plan). If the user says "go with your recommendation", apply the whole recommendation, not half. Large plans: do tokens + global + the 3 highest-impact components first; offer the rest.

## 2. Apply
- Make the smallest edit that satisfies the rule; use existing utilities/tokens before adding new ones; match the codebase's conventions and formatter.
- Preserve behaviour, semantics, accessibility attributes and copy; don't rename public classes/props or add dependencies/fonts without asking.
- Defaults come from the knowledge skills' "Restyle defaults" and the rule *Restyle fix* fields; where the project has its own scale, snap to it.
- **One primary action per viewport, header included.** Duplicate CTA (same normalised label AND destination): give the hero CTA a different job (specific next step) or hide the header copy until the hero CTA scrolls out; making one copy outline-only only lowers major to minor and is not a fix.
- **No rule IDs in source comments** — write the plain reason.
- **After changing a size or colour token**: re-check every pair of adjacent text styles that differed only by that value on the real surface. Re-run `cta-scan` (no `--shots` under `--dry-run`) after layout, header or hero changes.
- Independent batches on disjoint files can go to the `ux-restyler` subagent in parallel; give each: file list, rule IDs, target values, project constraints, "don't touch other files".
- Re-measure after each batch (`contrast.mjs`, spacing/type/colour sets) — never claim a fix you did not re-measure.

## 3. Verify
Run the **run**-class commands that exist (typecheck, lint without `--fix`, tests, build). Run formatters/`--fix` only on the files you touched; never project-wide. Repeat the visual capture from §0, view before/after at 1440×900 and 390×844, and look for regressions (overflow, wrapped labels, lost focus rings, dark-mode breakage, duplicate CTAs). Without a browser the restyle stays `not visually verified`. Save your own diff to `.ux-doctor/restyle.patch` at the end (only your changes, not pre-existing dirty files).

## 4. Report
A before→after summary per axis (type, colour, space, finish) for the main screens, changed files grouped by batch, finding numbers resolved vs deferred vs blocked (and why), measured before→after values, checks run, visual-verification status, anything needing a human eye. Build fixed/deferred statuses **from the final `git diff`, not memory**; never mark `[fixed]` what is not in the tree; re-anchor stale lines. Update `.ux-doctor/audit.md` statuses accordingly if it exists. Never commit unless asked.
