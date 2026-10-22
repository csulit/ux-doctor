# Contributing

Thanks for helping. Issues and PRs are welcome. To report a bug or suggest a rule, [open an issue](https://github.com/csulit/ux-doctor/issues/new/choose) using the templates; report vulnerabilities privately (see [SECURITY.md](SECURITY.md)).

## Setup

Node ≥ 20.1. The scripts have no runtime dependencies; the tests need `npm ci` (dev dependency: fast-check).

```sh
npm run build      # regenerate skills/*/references, page-coverage.md, platforms/codex/agents/*.toml
npm run validate   # structure, rule IDs, manifests
npm test           # property-based fuzz tests for cta-scan
```

Releases: see [RELEASING.md](RELEASING.md).

CI runs all three, fails if generated files are stale, and smoke-tests the CLI helpers.

## Where to edit

- Rules: `reference/extracted/*.md` (playbook) or `reference/extracted-web/*.md` (web layer), then rebuild.
- Agents: `agents/*.md`; the Codex `.toml` files are generated.
- **Never hand-edit generated files** (listed in `AGENTS.md`).
- Don't add the playbook PDF, page images, or copied source text (see `NOTICE.md`). Paraphrase and cite page numbers or `web:<slug>`.

## Pull requests

Keep them focused. Use the PR template checklist.

**Tests:** new functionality and bug fixes come with automated tests in the same PR (under `test/`, run by `npm test`), and CI must be green before merge.

Be kind: all participation falls under the [Code of Conduct](CODE_OF_CONDUCT.md).
