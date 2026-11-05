# ux-doctor (agent instructions for Codex / Cursor / Pi / any AGENTS.md-aware tool)

UI build, audit, design review and restyle plugin. Source of truth: `skills/` (Agent Skills) and `skills/ux-doctor/references/rules.json`.

- Build or change UI: skill `ux-build` (project tokens, then `skills/ux-doctor/references/defaults.md` and `critical.md`).
- Audit: `ux-doctor` + `audit-method`. Review a change: `ux-doctor` + `review-method`. Restyle: `ux-doctor` + `restyle-method`. Each method skill states its own write boundaries.
- Look up a rule: `node skills/ux-doctor/scripts/rule.mjs <ID|tag|keyword>`; score audit findings: `node skills/ux-doctor/scripts/score.mjs <findings.json>`.
- Project rules (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/*`, `DESIGN.md` of the target) outrank playbook rules.
- Maintainers: edit `reference/extracted/*.md` (playbook) and `reference/extracted-web/*.md` (web layer; `- **Skill**:` puts a core web rule into a dimension skill, `- **Kind**:` marks a default or principle, `- **Scope**:` says when a rule yields), then `npm run build && npm run validate`. Don't hand-edit generated files: `skills/*/references/{rules.md,index.md,rules.json,numeric-cheatsheet.md}`, `reference/page-coverage.md`, `platforms/codex/agents/*.toml`. Hand-written references: `finding-format.md`, `rule-tensions.md`, `defaults.md`, `critical.md`, `duplicate-cta.md`.
