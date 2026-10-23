# ux-doctor (agent instructions for Codex / Cursor / Pi / any AGENTS.md-aware tool)

UI audit, design review and restyle plugin. Source of truth: `skills/` (Agent Skills), `skills/ux-doctor/references/rules.json`.

- Audit a UI: load skill `ux-doctor`, then `audit-method` (read-only; writes only inside `.ux-doctor/`: `audit.md`, `shots/`).
- Review a change: `ux-doctor` + `review-method` (writes no project files; optional screenshots under `.ux-doctor/shots/` by the main agent only).
- Restyle: `ux-doctor` + `restyle-method` (confirm the batch plan before editing; never commit; `--dry-run` writes nothing).
- Look up a rule: `node skills/ux-doctor/scripts/rule.mjs <ID|tag|keyword>` (or `skills/*/references/index.md`); cite IDs like `E-12` with `p.N` (playbook) or `web:<slug>` (web, no page). Rules that pull against each other: `skills/ux-doctor/references/rule-tensions.md`.
- Project rules (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/*`, `DESIGN.md` of the target) outrank playbook rules: read them first.
- Knowledge skills: ux-hierarchy-clarity, ux-layout-spacing, ux-depth-craft, ux-color, ux-typography, ux-interaction-cost, ux-ui-patterns (playbook) and ux-web-patterns (secondary web source, W-IDs).
- Measure, don't guess: `node skills/ux-doctor/scripts/contrast.mjs <fg> <bg> [--large] [--over <hex>]`; `node skills/ux-doctor/scripts/cta-scan.mjs <url|file.html> [--render] [--shots <dir>]` (CTAs/duplicates in the first viewport; `--render` uses an installed Chrome, downloads nothing, needs Node ≥ 22); `node skills/ux-doctor/scripts/slop-scan.mjs <url|file|dir>` (AI-look tells W1-80..W1-84, W5; a cluster, not a verdict: W5-01). Audit rendered evidence first; code-only is the fallback.
- Maintainers: edit `reference/extracted/*.md` → `npm run build && npm run validate`. Don't hand-edit generated files: `skills/*/references/{rules.md,index.md,rules.json,numeric-cheatsheet.md}` (`finding-format.md` and `rule-tensions.md` are hand-written), `reference/page-coverage.md`, and `platforms/codex/agents/*.toml` (from `agents/*.md` via `npm run build`). Sources to edit: `reference/extracted/*.md` (playbook) and `reference/extracted-web/*.md` (web layer).
