# Changelog

All notable changes to this project are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org/).

## [Unreleased]

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
- Duplicate audit: 11 playbook rules that repeat another rule's check (the p.96-97 typography checklist and second worked examples) are folded into the rule they repeat, with the page added as "reaffirmed" and their unique details kept: F-13 → E-31, F-14 → A-12, F-15 → E-33, F-16 → F-08, F-18 → E-19, F-10 → A-24, G-13 → E-29, D-07 → D-06, C-01 → B-23, C-06 → C-03, B-17 → B-15. Playbook rules: 188 → 177 (433 in total). Cross-dimension pairs (A-12/F-14, A-24/F-10, E-29/G-13) no longer score one problem in two dimensions.
- `rule.mjs` resolves a retired ID to the rule it was merged into (`(F-13 was merged into E-31)`; `mergedFrom` in `--json`), so older audit reports still look up; `npm run validate` rejects an alias that shadows a live ID and a retired ID cited in docs outside the `F-13 → E-31` form. Tests in `test/rule.test.mjs`.
- `rule-tensions.md` gains a **Restatements: count once** table for web rules that repeat another rule (F-09/W1-12, E-10/W1-14/W2-24, G-09/W3-01, C-14/W2-20, W1-76/W3-26, W2-64/W1-38/W2-63, W3-27/W1-19, W1-04/W2-03, W3-40/W1-45), referenced from the finding format, the audit dedupe step and the auditor agent, and three contradictions found on the way: W1-20 vs W1-77/W3-26 (scaling hovered cards), C-18 vs D-01 (initial avatars vs photos), W3-29 vs W3-27/W1-19 (flat tones vs layered shadows).
- Sharper audit checks from the same tips, marked `(inference)`: C-09 covers equivalent alternatives styled differently (sign-in providers, payment methods), F-25 covers over-fine or overlapping answer ranges, F-26 covers clamping secondary descriptions behind "Read more", A-07 covers a main action rendered as a text link.

### Fixed
- Duplicate-CTA guidance now lives in one place (the same-destination test in `ux-hierarchy-clarity`): a fix must keep a persistent route to the destination at every scroll state, state its end state per scroll state, and re-check the vacated region at both scroll states, so a hidden header CTA is now checked for an orphaned slot.
- Restyle verifies each audit `keeps:` claim after the change and reports `keeps: verified` or `keeps: broken`; `npm run validate` now guards the canonical guidance against removal, weakening or copy-paste drift.

## [0.1.0]

### Added
- Initial release: audit, review and restyle skills, 4 commands and 3 agents for Claude Code, Codex, Cursor and Pi.
- 188 playbook rules plus 239 web-pattern rules, with `rule.mjs`, `contrast.mjs` and `cta-scan.mjs` helpers.
- Skeleton-loader rules W4-01/W4-02.
