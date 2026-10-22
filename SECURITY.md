# Security policy

## Reporting a vulnerability

Please report privately via [GitHub private vulnerability reporting](https://github.com/csulit/ux-doctor/security/advisories/new). Do not open a public issue.

You can expect an acknowledgement within a few days. This is a small, single-maintainer project, so fixes are best-effort.

## Scope

ux-doctor ships Markdown skills and commands plus a few dependency-free Node scripts (`skills/ux-doctor/scripts/`). In scope:

- The scripts fetching or rendering unintended resources (for example `cta-scan.mjs` with a URL or `--render`)
- Prompt-injection or write-outside-`.ux-doctor/` paths in the audit/review/restyle methods
- Supply-chain issues in the workflows under `.github/`

## Supported versions

Only the latest release on `main`.
