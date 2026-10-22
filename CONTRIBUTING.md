# Contributing

Thanks for helping. Issues and PRs are welcome.

## Setup

Node ≥ 20.1, no dependencies to install.

```sh
npm run build      # regenerate skills/*/references, page-coverage.md, platforms/codex/agents/*.toml
npm run validate   # structure, rule IDs, manifests
```

Releases: see [RELEASING.md](RELEASING.md).

CI runs both, fails if generated files are stale, and smoke-tests the CLI helpers.

## Where to edit

- Rules: `reference/extracted/*.md` (playbook) or `reference/extracted-web/*.md` (web layer), then rebuild.
- Agents: `agents/*.md`; the Codex `.toml` files are generated.
- **Never hand-edit generated files** (listed in `AGENTS.md`).
- Don't add the playbook PDF, page images, or copied source text (see `NOTICE.md`). Paraphrase and cite page numbers or `web:<slug>`.

## Pull requests

Keep them focused. Use the PR template checklist. Be kind: all participation falls under the [Code of Conduct](CODE_OF_CONDUCT.md).
