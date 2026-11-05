# Changelog

All notable changes to this project are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org/).

## [Unreleased]

## [0.3.0] - 2026-11-05

### Changed
- Rule set made agent-sized (see `docs/agent-usability-audit.md`): 417 → 357 rules. 39 restatements are folded into the rule they repeat (A-06 → A-07, F-02 → F-09, W1-12/W1-13 → F-09, W1-14/W2-24 → E-10, W2-53/W2-54 → H-12, W2-58/W2-59 → H-13, W3-02 → G-08, and 32 more web rules); their IDs resolve as aliases. 21 web rules that are perception heuristics or engineering advice with no visible UI effect are removed (golden ratio, peak-end, Zeigarnik, serial position, live cursors, `:has()`, z-index stacking, scroll timelines, cursor pagination and others).
- Every rule has a `kind`: `check` (yields findings), `default` (a value to build with) or `principle` (background, never a finding); `rule.mjs` and `score.mjs` enforce it.
- 56 core web rules (field states, focus, touch, response time, destructive actions, AI-look tells) move into the seven dimension skills next to the playbook rules they complement; `ux-web-patterns` becomes a lookup-only extended reference that audit passes don't load. Web findings no longer score at half weight.
- Conflicts are resolved inside the rules: a yielding rule states it in a new `scope` field. `rule-tensions.md` shrinks from 77 rows to the 6 genuine trade-offs; the restatement table is gone.
- Severity re-rated: `high` (23 rules, was 88) means a task breaks or a hard floor fails. Tags: at most 2 per rule, `craft` retired. `rule.mjs` prints kind, skill and scope, ranks core rules before extended ones and shows per-skill counts for broad queries.
- Each dimension skill has at most 7 top checks (was 12-17) and points to `defaults.md` instead of restating values. The duplicate-CTA procedure moves to `references/duplicate-cta.md`, loaded only when a CTA is doubled.
- Audit groups rebalanced (typography + colour, interaction cost + UI patterns); commands, agents, `rules/ux-doctor.mdc` and `AGENTS.md` point to the method skills instead of restating their boundaries. `numeric-cheatsheet.md` keeps only actionable values.

### Added
- `references/critical.md`: the Critical 20 checks, each with a matching build instruction.
- `references/defaults.md`: one value per property with its hard floor and target (touch targets: 24px floor, 44px target; line length, contrast, type, spacing, radius, shadows, motion).
- `scripts/score.mjs`: lints audit findings (`.ux-doctor/findings.json`) and computes final severities, dimension scores, the grade and contested ranges; tests in `test/score.test.mjs`.
- `ux-build` skill: lightweight guidance for writing UI (project tokens, defaults, Critical 20) without the audit ceremony.
- `npm run validate` guards the limits: ≤ 7 top checks per dimension skill, ≤ 30 high rules, 20 critical rows, ≤ 10 tension rows, ≤ 2 tags and a valid kind per rule.

## [0.2.0] - 2026-11-04

### Added
- Clean-UI tips: web rules W4-03 (60-30-10 colour proportion), W4-04 (one question per step in questionnaires) and W4-05 (move text repeated on every item into the group heading), source `web:clean-ui-tips`; rule tensions W4-04 vs F-29/W3-10 and W4-03 vs E-03/E-04.
- AI-look tells: 14 web rules W5-01..W5-14 (skill `ux-web-patterns`), paraphrased from Anthropic's `frontend-design` skill, Vercel's `design.md`, Adrian Krebs' Show HN design-pattern scoring, Ralabs' AI design slop review guide and the Slop Taxonomy. They cover per-section fade-ups and content hidden behind scroll triggers, single styled headline words, eyebrow labels and false numbering, arrow/dot/dash chrome, coloured card stripes, nested cards, emoji and stock icon tiles, stock copy, default palette clusters, demo-sized content and filler stat rows. W5-01 makes them a cluster (one grouped finding at 3+ tells), never a claim of AI authorship.
- `slop-scan.mjs`: counts AI-look tells in a URL, file or source tree, with `file:line` hits, rule IDs and a tier; no dependencies, writes nothing. Fixtures `reference/fixtures/ai-slop.html` and `plain-landing.html`, tests in `test/slop-scan.test.mjs`, regression checks in `npm run validate` and a CI smoke test.
- Rule tensions for the new tells (Inter E-17, radius language C-08, W1-79 hover edges, W1-82 arrow link, W2-03 list cascades, D-16/D-18 glass, G-14 icons, A-11 metric cards).
- GitHub Actions CI (validate on Node 20/22/24 plus macOS and Windows, generated-file drift check, CLI smoke tests).
- Security tooling: CodeQL, Dependabot, dependency review, OpenSSF Scorecard, zizmor workflow lint, weekly link check.
- Version tracking: `package.json` is the source of truth, synced into the plugin manifests by `npm run build` and enforced by `npm run validate`; tag-driven release workflow (see RELEASING.md) with build provenance.
- Community files: SECURITY, CONTRIBUTING, CODE_OF_CONDUCT, CODEOWNERS, issue and PR templates.

### Changed
- Duplicate audit: 11 playbook rules that repeat another rule's check (the p.96-97 typography checklist and second worked examples) are folded into the rule they repeat, with the page added as "reaffirmed" and their unique details kept: F-13 → E-31, F-14 → A-12, F-15 → E-33, F-16 → F-08, F-18 → E-19, F-10 → A-24, G-13 → E-29, D-07 → D-06, C-01 → B-23, C-06 → C-03, B-17 → B-15. Playbook rules: 188 → 177 (433 in total). Cross-dimension pairs (A-12/F-14, A-24/F-10, E-29/G-13, B-23/C-01) now score one problem in one dimension; the typography and UI-patterns skills point to those rules with their dimension.
- `rule.mjs` resolves a retired ID to the rule it was merged into (`(F-13 was merged into E-31)`; `mergedFrom` in `--json`), so older audit reports still look up; `npm run validate` rejects an alias that shadows a live ID and a retired ID cited in docs outside the `F-13 → E-31` form. Tests in `test/rule.test.mjs`.
- `rule-tensions.md` gains a **Restatements: count once** table for web rules that repeat another rule (F-09/W1-12, E-10/W1-14/W2-24, G-09/W3-01, C-14/W2-20, W1-76/W3-26, W2-64/W1-38/W2-63, W3-27/W1-19, W1-04/W2-03, W3-40/W1-45), referenced from the finding format, the audit dedupe step and the auditor agent, and three contradictions found on the way: W1-20 vs W1-77/W3-26 (scaling hovered cards), C-18 vs D-01 (initial avatars vs photos), W3-29 vs W3-27/W1-19 (flat tones vs layered shadows).
- Second duplicate and conflict audit across all 433 rules. 16 more playbook rules that repeat another rule's check are folded into it, with the page added as "reaffirmed" and their unique details kept: the p.22 contrast examples restated by later chapters (B-05 → E-33, B-06 → F-04, B-08 → D-03), bad/good pairs and worked examples of one check (B-12 → B-10, A-22 → A-21, C-05 → C-02, C-16 → C-14, E-20 → E-19, E-26 → E-22, E-32 → E-31, F-23 → F-20, F-34 → F-24, G-03 → G-02, G-04 → G-06, H-10 → H-09, H-11 → H-12). Playbook rules: 177 → 161 (417 in total). H-12 now carries H-11's high severity for a bare empty state. B-16 keeps only its own check (same value for the same relationship; within-vs-between gaps is A-15's), E-19 no longer repeats E-16's display-font check and allows two families split by role (E-21), and F-11 is a reference spec whose failing points are reported under the rule that owns each one.
- `rule-tensions.md`: the **Restatements: count once** table grows from 9 to 32 rows (for example F-09 now also covers F-02, F-12, B-03 and W1-13; H-12 covers W2-53/W2-54; H-13 covers W2-58/W2-59; A-07 covers A-06/A-05 per action group). 18 new tension rows resolve contradictions the audit found: validation timing (W2-27/W1-40 vs W2-60/G-09/W3-01), grey status icons vs status colours (W3-30 vs E-11), background glow vs no blobs (W1-81 vs W2-15), hover-only card actions (W1-78 vs W2-81), 44 vs 48px targets (W1-59 vs W2-83), red reserved for destruction vs red errors (W1-92 vs E-11), undo vs confirm dialogs (W3-40 vs G-10/G-11/G-12), instant acknowledgement vs no loader under 300ms (W1-96/W1-97 vs W2-62), entrance vs dropdown timing (W1-01 vs W1-08), accent on one CTA vs primary colour on links (W3-17 vs E-03), text-link vs grey-button secondaries (W1-82/W2-75 vs A-07), 300-weight captions (W3-16 vs F-03), opacity text vs 4.5:1 (W3-24/W1-18 vs F-09), dominant imagery (B-19/B-20 vs A-08/C-02), accent glow vs tinted shadows (W3-28 vs D-06), serif body in formal sectors (E-13 vs F-17), equal-length card copy vs real content (C-12 vs W5-13) and scroll-driven reveals (W3-52/W1-21 vs W5-03).
- The web rules involved (W1-18, W1-59, W1-78, W1-81, W1-92, W1-96, W1-97, W2-15, W2-60, W2-75, W3-16, W3-17, W3-24, W3-30) and E-13 and E-27 now state the scope or the playbook rule that wins, so a fix for one no longer recreates a violation of the other. E-27 makes clear that the block is centred while its lines stay left-aligned (consistent with A-24).
- Plugin manifests: the Codex and Cursor descriptions no longer say 188 rules.
- Sharper audit checks from the same tips, marked `(inference)`: C-09 covers equivalent alternatives styled differently (sign-in providers, payment methods), F-25 covers over-fine or overlapping answer ranges, F-26 covers clamping secondary descriptions behind "Read more", A-07 covers a main action rendered as a text link.

### Fixed
- Duplicate-CTA guidance now lives in one place (the same-destination test in `ux-hierarchy-clarity`): a fix must keep a persistent route to the destination at every scroll state, state its end state per scroll state, and re-check the vacated region at both scroll states, so a hidden header CTA is now checked for an orphaned slot.
- Restyle verifies each audit `keeps:` claim after the change and reports `keeps: verified` or `keeps: broken`; `npm run validate` now guards the canonical guidance against removal, weakening or copy-paste drift.

## [0.1.0]

### Added
- Initial release: audit, review and restyle skills, 4 commands and 3 agents for Claude Code, Codex, Cursor and Pi.
- 188 playbook rules plus 239 web-pattern rules, with `rule.mjs`, `contrast.mjs` and `cta-scan.mjs` helpers.
- Skeleton-loader rules W4-01/W4-02.
