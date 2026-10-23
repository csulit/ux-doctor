# Finding format, scoring and report template

## One finding
```
[SEV] <short title>                      rule: <ID> (<citation>)  tags: <tags>
where:    <file> · <selector | symbol | component> · line N @ <short sha>   (or route + screenshot region)
evidence: <what you read/measured, with values>   (verified | measured | inferred)
impact:   <one sentence: what the user experiences>
fix:      <concrete, token-based change with target values> — keeps: <the visible result it preserves>
```
- `SEV` = blocker | major | minor | polish | advisory (table, lowering format, blockers and `(general practice)` severities are defined in `../SKILL.md`).
- `citation` = `p.N` for playbook rules; `web:<slug>` for web rules (`source: web`, there is no page — say so).
- The `where` anchor must survive edits: file + selector/symbol/component name + `line N @ <short sha>`. Lines go stale after edits; the name stays findable.
- Evidence labels (verified | measured | inferred; `inferred (no render)` without a render) are defined in `../SKILL.md`.
- No good option? Write `fix: needs a design decision` and give none. A fix blocked by a project rule is not a finding fix: list it once as `Blocked by project rule — <file:line>`.
- `keeps:` is a claim the restyle verifies; for hide/remove/move fixes state the end state per scroll state (`at top: …; after the hero scrolls out: …`) and what the freed space becomes.
- One finding per distinct problem; repeats go under one finding as `+7 more: ...`.

## Dimensions and score
There are **7 scored dimensions** (the seven playbook knowledge skills). `ux-web-patterns` has no row of its own: fold its findings into the matching playbook dimension at **half weight**, keeping the `source: web` flag. A `(general practice)` check is weighted per `../SKILL.md`. Per dimension start at 100 and subtract per distinct finding: blocker 25, major 12, minor 5, polish 2 (web findings: 12.5 / 6 / 2.5 / 1); advisory 0 (floor 0). Overall = mean of the dimensions actually checked, rounded to the nearest integer after averaging (skip one with "n/a — not applicable/not checked"; never score Hierarchy or Layout as "no issues" without a render). Grade: A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 55, F < 55. If any lowering is contested, print a grade range computed with and without it, e.g. `B–C (78–84)`. The score tracks change; it is not a verdict — always show the findings behind it. "Accepted by design" items are not scored.

## Measuring (don't eyeball what a tool can compute)
Tool paths are relative to the ux-doctor skill folder (next to its `SKILL.md`).
- **Contrast** — computed values win over the playbook's labels (p.86 calls #626262 on white AAA-passing, but it computes to 6.1:1 = AA only): `node scripts/contrast.mjs <fg> <bg> [--large] [--over <hex>]` → ratio + AA/AAA verdict. `--large` applies 3:1; `--over <hex>` flattens a translucent foreground/background onto the colour beneath it. Compute every token pair per theme (light and dark), including translucent overlays. Thresholds: 4.5:1 normal text (WCAG AA, general practice; also playbook p.93), 3:1 large text/UI.
- **CTAs per viewport** — `node scripts/cta-scan.mjs <url|file.html|-> [--render] [--shots <dir>] [--json] [--scheme light|dark] [--filled <class-regex>] [--base <url>]`. It lists links/buttons in the first viewport (header included) and flags `DUP_IN_VIEWPORT` (same normalised label AND destination) and `MULTI_PRIMARY_IN_VIEWPORT`. Static mode approximates the first viewport; `--render` measures it in an installed Chrome (`measured`). Flags are hints feeding the severity table — confirm "primary" against the CSS or a screenshot. Exit 1 = flags. `--shots` writes PNGs, so run it only where writing under `.ux-doctor/shots/` is allowed (audit; `/ux-review` main agent; restyle baseline — never `--dry-run`); without `--shots` nothing is written.
- **AI-look tells** — `node scripts/slop-scan.mjs <url|file|dir|-> [--json] [--max-files N] [--list]`. Line-based heuristics over markup, components and stylesheets (no JavaScript is run; a URL fetches the page HTML only) for the tells in W1-80, W1-81, W1-83, W1-84 and W5-03..W5-12 (W1-82, two equal hero CTAs, is `cta-scan`'s MULTI_PRIMARY flag); it prints each tell with its rule IDs and `file:line` hits, the tier (0–1 low, 2–3 medium, 4+ high) and the W5-01 verdict (grouped finding at 3+ tells, else a `(general practice)` note). Hits are `verified` code facts but the tell itself is a hint: confirm each against the code or a render and drop tells the brief or tokens chose. `HIDDEN_UNTIL_SCROLL` (W5-04) is listed apart as a defect candidate, outside the tell count: confirm it with a render without JS or with reduced motion, then score it on its own. `--list` prints every tell with its rule IDs. Exit 1 = tells or a defect candidate, 0 = none, 2 = bad input, an unreadable file or folder, a directory walk stopped at `--max-files` or the 50 MB total (an incomplete directory scan prints its partial result first), a fetch failure or a timeout. Files over 1 MB are skipped and counted, not an error. Writes nothing.
- **Line length** — `ch` is the width of the `0` glyph, not an average character: `72ch` can be ~93 real characters. Count real characters per line in a browser, or use ~30–36em for proportional UI fonts (inference; measure per font: 36em ≈ 73.5 characters, about 2.0 characters/em). Target 45–75 real characters.
- **Heading line-height** — the ratio shrinks as size grows (F-08: ~1.3 at 36px); large display type may sit at 1.0–1.15 (inference). Fail only if heading line-height ≥ paragraph line-height or lines collide.
- **Spacing** — collect all `padding|margin|gap` values; flag values off the project's scale (playbook p.28: multiples of 2, 4 or 6; e.g. 4/8/16/24/32).
- **Type** — collect `font-family` (max 2), `font-size` (body 16px, nothing < 12px for main text), `line-height` (body 1.5–1.6, heading below the paragraph value, ≈1.2–1.3 at mid sizes).
- **Colour** — collect distinct hex/hsl values; flag pure `#000`/`#fff` text, saturated page backgrounds, status colours that break red=error/green=success.
- **Shadows** — collect `box-shadow`; flag grey shadows on tinted backgrounds, hard/zero-offset shadows, more than one unrelated shadow definition per tier.
- **Rule lookup** — `node scripts/rule.mjs <ID|tag|keyword>` prints matching rules compactly (exit 1 = none).

## Report template (`.ux-doctor/audit.md`, under ~100 lines)
```
# UX audit — <target>   (<date> · <git short sha>[+dirty])
Grade: <grade> (<score>/100)[, range <g1–g2>]  ·  blockers <n> · major <n> · minor <n> · polish <n> · advisory <n>
Evidence: rendered (<viewports, schemes>) | code-only — Visual confidence: low (no render)
Constraints: 1) … 2) …            (project constraints; "none found" if none)
Accepted by design: … (excluded from scoring)

## Fix first (max 3)
Eligible only if: blocker or major (blockers rank first), measured or verified, not blocked by a project rule, not a pure token-vs-playbook gap.
Rank: blockers first, then hard-threshold failure > primary flow > visible reach > lowest cost.
1. #<finding no.> — before: <value> → target: <value> — verify: <command>

## Findings
| # | Sev | Rule | Where | Measured | Fix | Status |
|---|-----|------|-------|----------|-----|--------|
(one table; "Where" uses the stable anchor; Status = open | fixed | deferred | blocked)
Detail block, majors only (3 lines): what is wrong · why it matters here · what the fix keeps.

## Advisory         (one line each; token passes all thresholds / accepted by design)
## Checked, no issues: <rule IDs on one line>
## What already works   (max 3; none may contradict a finding; no hierarchy/CTA claims unless true for the whole first viewport incl. header)
## Restyle plan   (batches: tokens → global → components → pages; reference finding numbers, don't restate them; list files)
Blocked by project rule: <finding #> — <file:line>
```
