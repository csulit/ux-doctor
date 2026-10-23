# Changelog

All notable changes to this project are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org/).

## [Unreleased]

### Added
- AI-look tells: 14 web rules W5-01..W5-14 (skill `ux-web-patterns`), paraphrased from Anthropic's `frontend-design` skill, Vercel's `design.md`, Adrian Krebs' Show HN design-pattern scoring, Ralabs' AI design slop review guide and the Slop Taxonomy. They cover per-section fade-ups and content hidden behind scroll triggers, single styled headline words, eyebrow labels and false numbering, arrow/dot/dash chrome, coloured card stripes, nested cards, emoji and stock icon tiles, stock copy, default palette clusters, demo-sized content and filler stat rows. W5-01 makes them a cluster (one grouped finding at 3+ tells), never a claim of AI authorship.
- `slop-scan.mjs`: counts AI-look tells in a URL, file or source tree, with `file:line` hits, rule IDs and a tier; no dependencies, writes nothing. Fixtures `reference/fixtures/ai-slop.html` and `plain-landing.html`, tests in `test/slop-scan.test.mjs`, regression checks in `npm run validate` and a CI smoke test.
- Rule tensions for the new tells (Inter E-17, radius language C-08, W1-79 hover edges, W1-82 arrow link, W2-03 list cascades, D-16/D-18 glass, G-14 icons, A-11 metric cards).
- GitHub Actions CI (validate on Node 20/22/24 plus macOS and Windows, generated-file drift check, CLI smoke tests).
- Security tooling: CodeQL, Dependabot, dependency review, OpenSSF Scorecard, zizmor workflow lint, weekly link check.
- Version tracking: `package.json` is the source of truth, synced into the plugin manifests by `npm run build` and enforced by `npm run validate`; tag-driven release workflow (see RELEASING.md) with build provenance.
- Community files: SECURITY, CONTRIBUTING, CODE_OF_CONDUCT, CODEOWNERS, issue and PR templates.

### Fixed
- Duplicate-CTA guidance now lives in one place (the same-destination test in `ux-hierarchy-clarity`): a fix must keep a persistent route to the destination at every scroll state, state its end state per scroll state, and re-check the vacated region at both scroll states, so a hidden header CTA is now checked for an orphaned slot.
- Restyle verifies each audit `keeps:` claim after the change and reports `keeps: verified` or `keeps: broken`; `npm run validate` now guards the canonical guidance against removal, weakening or copy-paste drift.

## [0.1.0]

### Added
- Initial release: audit, review and restyle skills, 4 commands and 3 agents for Claude Code, Codex, Cursor and Pi.
- 188 playbook rules plus 239 web-pattern rules, with `rule.mjs`, `contrast.mjs` and `cta-scan.mjs` helpers.
- Skeleton-loader rules W4-01/W4-02.
