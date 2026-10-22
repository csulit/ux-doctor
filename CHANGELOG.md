# Changelog

All notable changes to this project are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org/).

## [Unreleased]

### Added
- GitHub Actions CI (validate on Node 20/22/24 plus macOS and Windows, generated-file drift check, CLI smoke tests).
- Security tooling: CodeQL, Dependabot, dependency review, OpenSSF Scorecard, zizmor workflow lint, weekly link check.
- Version tracking: `package.json` is the source of truth, synced into the plugin manifests by `npm run build` and enforced by `npm run validate`; tag-driven release workflow (see RELEASING.md) with build provenance.
- Community files: SECURITY, CONTRIBUTING, CODE_OF_CONDUCT, CODEOWNERS, issue and PR templates.

## [0.1.0]

### Added
- Initial release: audit, review and restyle skills, 4 commands and 3 agents for Claude Code, Codex, Cursor and Pi.
- 188 playbook rules plus 239 web-pattern rules, with `rule.mjs`, `contrast.mjs` and `cta-scan.mjs` helpers.
- Skeleton-loader rules W4-01/W4-02.
