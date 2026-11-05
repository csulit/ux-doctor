# Agent-usability audit of ux-doctor

Date: 2026-11-05 · Version audited: 0.2.0 (417 rules)
Question: can an agent tell which UI/UX rule to apply, and when? Or does the volume of rules get in the way?

## Verdict

Your hunch is right, though the raw rule count is only part of the problem. The real issue is that **almost nothing in the plugin tells an agent what matters most**. Today an agent faces:

- two rule sources, and the secondary one is the larger;
- 117 "top checks";
- 88 rules rated `high`;
- a 77-row conflict table that touches half the database.

On top of that, about 41k tokens of procedure load before the agent reads a single rule body. The playbook content is good, and so are the measuring scripts. The weak part is the layer that decides what to apply.

The fix is mostly subtraction, plus a few scripts:

1. Cut the web layer down to a small core and fold it into the dimension skills.
2. Write conflict resolutions into the rules themselves, so the conflict table can shrink.
3. Downgrade principles so they are no longer rules.
4. Compute scores with a script instead of having the agent do the arithmetic.
5. Add a lightweight "build" path for the most common agent job: writing new UI.

## Status: implemented

All nine recommendations are now in the plugin. The measured result:

| | Before | After |
|---|---|---|
| Rules | 417 (161 playbook + 256 web) | 357 (159 playbook + 56 core web + 142 extended web) |
| `check` rules an audit pass considers | 417 | 178 |
| Tension rows (`rule-tensions.md`) | 77 | 6 |
| Top checks | 117 | 49, plus the Critical 20 |
| `high` rules | 88 | 23 |
| Instruction load before rule bodies | ~41k tokens | ~14.7k tokens (core + method + references + 7 `SKILL.md`), ~21.5k with every index |
| Places a default value lives | 4 | 1 (`defaults.md`) |
| Scoring arithmetic by the agent | yes | no (`score.mjs`) |

`npm run validate` now enforces these limits, so they can't creep back up. The findings below describe the plugin **before** the change.

## What the agent has to hold (measured)

| Load | Today | Notes |
|---|---|---|
| Rules | 417 (161 playbook + 256 web) | Web rules are 61% of the IDs and about 2/3 of the rule text (`ux-web-patterns/references/rules.md` is 197 KB of the 300 KB of `rules.md` files) |
| Distinct web sources | 219 slugs for 256 rules | Most sources contribute 1–2 rules: a long tail with no shared voice |
| Rules rated `high` | 88 (50 playbook, 38 web) | 21% of all rules are "high" |
| "Top checks" bullets | 117 across 8 skills | `ux-web-patterns/SKILL.md` alone names 78 rule IDs |
| Conflict table (`rule-tensions.md`) | 46 tension rows + 31 restatement rows, 22 KB | Touches 214 of 417 IDs (51%) and must be consulted after every fix (ground rule 6, the audit, the restyle conflict pass) |
| Procedure before any rule | ~11.5k tokens | `ux-doctor` + `audit-method` + `finding-format` + `rule-tensions` |
| Full audit instruction load | ~41k tokens | The preamble, plus the 8 `SKILL.md` files (~16.6k), plus the 8 `index.md` files (~12.9k), before any `rules.md` entry is opened |
| All `rules.md` files | ~98k tokens | Expected to be read selectively |
| Rules with a numeric audit check | 24 of 161 playbook, 26 of 256 web | Most checks are judgement calls |
| Rules leaning on `(from visual)` / `(inference)` | 69 / 44 | Inferred thresholds sit next to stated ones with the same weight |

Token counts are characters ÷ 4.

## Findings

Severity here measures the effect on agent decision quality, not UI severity.

### 1. major: the secondary source is larger than the primary one
- The playbook is primary, and the web layer has 1.6× as many rules. The precedence rule ("on conflict the playbook wins") only works if the agent loads both layers and spots the conflict, which costs exactly the attention it was meant to save.
- The web layer covers four different kinds of content:
  - **Real gaps** in the playbook: UI states, focus, touch, errors, AI-look tells.
  - **Perception heuristics** (15 rules) that don't translate into checks. Examples: golden ratio W2-08, peak-end W3-21, Zeigarnik W3-23, serial position W3-20.
  - **Engineering advice** with no visible UI effect. Examples: W1-39 `:has()` instead of JS, W2-84 cursor interpolation, W1-06 grid-rows accordion animation.
  - **Restatements** of playbook rules (31 rows).
- Auditor workload is lopsided because of this. Group 4 (interaction-cost + ui-patterns + web) carries about 300 rules, while group 3 (typography) carries 34.

**Recommendation:** keep a **core web set of about 50 rules**: the states, focus/keyboard, touch, error, overlay and AI-look rules that the playbook lacks.
- Give each core rule the dimension its tags already point to, and move it into that dimension's skill. This also removes the "fold web findings at half weight" scoring rule.
- Move everything else into an **extended** file that only `rule.mjs` and `/ux-rules` query, never the audit passes.
- Drop the perception-heuristic and engineering-only rules completely.

### 2. major: the conflict table compensates for conflicts that should be fixed at the source
- Half the database is in `rule-tensions.md`, and every fix has to be checked against it. Most rows are web-vs-playbook, and the table already holds the resolution text, for example "W1-59 vs W2-83" or "W3-24 / W1-18 vs F-09".
- That resolution belongs inside the winning rule, and the losing half should be deleted. Leaving it in a side table means the agent has to recall the table every time.
- Release 0.2.0 already did this for 27 playbook duplicates (folded into canonical rules with "reaffirmed"). The 31 restatement rows are the same job, unfinished, for the web layer.

**Recommendation:**
- Fold every restatement into its canonical rule and retire the duplicate ID as an alias. `rule.mjs` already resolves aliases.
- For each tension row, edit the losing rule's scope into the rules.
- Aim for **10 or fewer rows**, each a genuine design trade-off that needs judgement (e.g. sticky header vs thumb zone H-09, one-weight brand font vs E-33).

### 3. major: "top checks" and "high" no longer signal priority
- Every skill lists 12–17 top checks, and `ux-web-patterns` lists 14 bullets naming 78 IDs. When everything is top, nothing is.
- Severity is inflated. Process advice is rated high, for example A-10 "Rank elements by user importance before designing" and A-01 "Don't ship a beautiful UI that doesn't help users finish the task". So is W2-83 (44px targets), even though `ux-doctor/SKILL.md` itself says 24px targets are only advisory.

**Recommendation:**
- Cap each skill at **7 or fewer top checks**. Each one must be measurable, or decidable from a screenshot in one look.
- Publish one cross-skill **Critical 20** list (the checks that produce blockers and majors) in `ux-doctor/SKILL.md`.
- Re-rate severity so that `high` means "breaks a task or a hard threshold". The target is no more than 30 high rules overall.

### 4. major: principles, examples and sector taste are stored as rules
Some IDs, each with a severity, cannot produce a finding at all:
- A-04 "Know the 15 core UI principles" (its audit check is "Use as t…")
- F-21 "Know the three cost components"
- B-18 "Treat layout as both aesthetics and usability"
- A-28 Figma auto-layout (a design-tool instruction, meaningless when auditing code)
- E-14 script typeface "for beauty"
- E-13 / E-16 sector font picks

An agent that is told to check every rule wastes passes on these. Worse, it may cite them as findings.

**Recommendation:** give every rule a `kind` in `rules.json`:
- `check`: a testable violation that yields a finding;
- `default`: a value to use when building or restyling;
- `principle`: background only.

Principles become one-line context in the skill intro and leave the index and the scoring. Only `check` rules feed audits.

### 5. major: procedure crowds out design judgement
Each piece is defensible on its own. Together they are a lot to carry before the first design call:
- the severity matrix;
- lowering by exactly one level, with a printed reason;
- evidence labels;
- stable anchors carrying a commit SHA;
- `keeps:` claims stated for each scroll state;
- 7 dimensions, with web at half weight, `(general practice)` weighting and grade ranges.

Agents spend tokens and attention on bookkeeping and on arithmetic they are bad at.

**Recommendation:** move the mechanics into scripts.
- A `score.mjs` takes findings as JSON (rule ID, placement, lowering reason) and outputs severities, the grade and the range.
- A `finding-lint.mjs` rejects findings that are missing an ID, a citation, an anchor or an evidence label.

The skills then shrink to "emit this JSON, run the script". This removes roughly half of `finding-format.md` and the severity section of `ux-doctor/SKILL.md`.

### 6. minor: one past incident is the most specified behaviour in the plugin
- The duplicate-CTA "same-destination test" is a top-check bullet with 9 nested sub-bullets in `ux-hierarchy-clarity`.
- It is referenced from 7 files, and `validate.mjs` enforces its exact phrasing.
- `rule-tensions.md` also carries a row about a `mailto` fix "filed in one audit".

Fixes driven by incidents like this teach agents that CTA duplication is the main thing to look for, and pinning the wording in place blocks any later simplification.

**Recommendation:**
- Move the full procedure to `ux-doctor/references/duplicate-cta.md`. Load it only when `cta-scan` reports `DUP_IN_VIEWPORT` or the diff touches the header or hero.
- Keep a one-line top check in its place.
- Make the validator check that this file exists and is linked, instead of checking phrases.

### 7. minor: the same property has several numbers in several places
- **Touch targets:** 24px (advisory floor in `ux-doctor/SKILL.md`), 44px (W2-83), 48px (W1-59). One tension row exists just to reconcile them.
- **Motion:** 100 / 150 / 200–300 / 400 / 500ms, spread over five rules plus a tension row.
- **Spacing:** multiples of 2/4/6 (B-15), 4px steps (W1-25), golden ratio (W2-08).
- **Where numbers live:** rule bodies, each skill's "Restyle defaults", each rule's `restyleFix`, and `numeric-cheatsheet.md`. Of the cheat sheet's 170 rows, about 48 are illustrative example data ("$12 / 1 pizza", "4 reasons", "Margin 79", "15 principles").

**Recommendation:**
- Generate one `defaults.md` with **one row per property**: floor (fail below this), target (use this when building) and source rule.
- The skills' "Restyle defaults" sections point to it instead of restating values.
- Filter the cheat sheet down to values an agent can act on.

### 7a. minor: tags don't narrow lookups
- `craft` and `interaction-cost` are each on 114 rules, `states` on 98 and `hierarchy` on 96. `rule.mjs craft` matches 114 rules and prints 5, ordered by file position and severity, which is close to arbitrary.

**Recommendation:**
- Retire `craft`.
- Allow at most 2 tags per rule, primary tag first.
- When a tag query has more than `--limit` hits, `rule.mjs` should print the count per skill so the agent can narrow the query.

### 8. minor: no lightweight path for building UI
- The skill triggers on "make it look better", but the only workflows are audit, review and restyle, each with full ceremony (constraints list, evidence, scoring).
- The most common agent situation is generating new UI. For that the agent needs about one page: defaults, roughly 10 must-nots, and the project's tokens. Today it has to go through 8 skills to collect them.

**Recommendation:**
- Add a `build-defaults` section, or a small skill, made of `defaults.md` plus the Critical 20 phrased as "do".
- Point `rules/ux-doctor.mdc` and `AGENTS.md` at it for everyday UI work.
- Keep audit, review and restyle for explicit requests.

### 9. minor: the same instructions are repeated across entry points
- Write boundaries for screenshots: 57 mentions in 18 files.
- Project-constraint rules: 17 mentions in 11 files.
- No-install / no-server rules: 8 mentions in 6 files.

Commands, agents, method skills, `rules/ux-doctor.mdc`, `AGENTS.md` and the README each restate them with small wording differences. Each copy is more text for the agent to reconcile and another place where wording can drift.

**Recommendation:**
- Define boundaries once, in the method skill that owns them.
- Commands and agents become a short pointer plus the one boundary that is specific to that entry point (e.g. "the subagent never writes").

## Target shape

| | Today | Target |
|---|---|---|
| Rules an audit pass considers | 417 | about 190 `check` rules (about 140 playbook + about 50 core web) |
| Rule sources an agent reconciles | 2, side by side | 1, with web rules living inside the dimension skills |
| Tension rows | 77 | 10 or fewer |
| Top checks | 117 | 56 or fewer (7 × 8 skills), plus one Critical 20 |
| `high` rules | 88 | 30 or fewer |
| Instruction load before rule bodies | ~41k tokens | ~15k tokens (scoring and finding mechanics moved into scripts) |
| Places a default value lives | 4 | 1 (`defaults.md`) |

## Plan, in order of payoff

1. **Classify** every rule as `check`, `default` or `principle`; tag the core web set; mark the drop list. This is data-only work in `reference/extracted*/*.md` plus a `kind` field in `build-knowledge.mjs`.
2. **Fold** the 31 restatements into canonical rules as aliases, and push each tension resolution into the rule it limits. Shrink `rule-tensions.md`.
3. **Generate** `defaults.md` and a filtered cheat sheet; point the "Restyle defaults" sections at them.
4. **Re-rate** severity and cap top checks; write the Critical 20.
5. **Script** the scoring (`score.mjs`) and finding validation; cut the matching prose from `ux-doctor/SKILL.md` and `finding-format.md`.
6. **Split** the web layer: the core set moves into the dimension skills, and the extended set becomes lookup-only. Rebalance the four auditor groups.
7. **Add** the build path, and trim commands and agents down to pointers.

Steps 1–2 alone remove the main source of confusion: two overlapping rule sets plus a conflict table. They also make the remaining steps mechanical.

## What already works (keep)
- Progressive disclosure: `SKILL.md` → `index.md` → `rules.md`, plus `rule.mjs` for compact lookups.
- Measuring before judging: `contrast.mjs`, `cta-scan.mjs` and `slop-scan.mjs` replace guesswork with numbers.
- A clear precedence order: project rules, then playbook, then web.
- The 0.2.0 dedupe, which shows the folding approach works and that retired IDs keep resolving.
