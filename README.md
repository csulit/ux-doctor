# ux-doctor

[![CI](https://github.com/csulit/ux-doctor/actions/workflows/ci.yml/badge.svg)](https://github.com/csulit/ux-doctor/actions/workflows/ci.yml)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/csulit/ux-doctor/badge)](https://scorecard.dev/viewer/?uri=github.com/csulit/ux-doctor)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/15792/badge)](https://www.bestpractices.dev/projects/15792)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Audit, design-review and restyle UIs against **188 rules extracted page-by-page from *The UI/UX Playbook*** (uxpeak, 144 pp) plus a secondary layer of 253 web-pattern tips (paraphrased from public UX pattern pages and published guidance on generic AI-generated UI). One canonical source, packaged for **Claude Code, Codex, Cursor and Pi**.

## Commands (4)
| Command | What it does | Writes files? |
|---|---|---|
| `/ux-audit [target] [--focus d] [--quick]` | Scored, rule-cited audit (rendered evidence first, project rules respected) → `.ux-doctor/audit.md` | `.ux-doctor/` only (`audit.md`, `shots/`); never edits `.git/info/exclude` (prints the one-line command instead) |
| `/ux-review [PR \| paths \| image]` | Verdict + prioritized comments on a change | no project files; optional screenshots under `.ux-doctor/shots/`, made by the main agent only (the read-only `ux-reviewer` subagent never writes) |
| `/ux-restyle [path] [--from-audit] [--scope …] [--dry-run] [--yes]` | Batched restyle (tokens → global → components → pages), measured | yes (after confirm); `--dry-run` writes nothing anywhere (embedded quick audit runs `cta-scan` without `--shots`, results in memory) |
| `/ux-rules <topic \| ID>` | Look up playbook rules and exact numbers | no |

Restyle command per platform: `/ux-restyle --from-audit` (Pi, Cursor), `/ux-doctor:ux-restyle --from-audit` (Claude Code), `$restyle-method` (Codex).

## Measuring tools (bundled in `skills/ux-doctor/`)
- `scripts/contrast.mjs <fg> <bg> [--large] [--over <hex>]` — WCAG ratio; `--over` flattens translucent colours.
- `scripts/cta-scan.mjs <url|file.html|-> [--render] [--shots <dir>] [--json] [--scheme light|dark]` — CTAs in the first viewport, flags duplicate/competing primaries (`--render` drives an installed Chrome/Edge, downloads nothing, and needs **Node ≥ 22**; static mode and the other scripts need Node ≥ 20.1; `--shots` saves desktop/mobile PNGs).
- `scripts/slop-scan.mjs <url|file|dir|-> [--json]` — counts AI-look tells (gradient text, blur blobs, eyebrow labels, card stripes, nested cards, emoji icons, per-section fade-ups, stock copy, …) with `file:line` hits and rule IDs; reports a tier, flags patterns not provenance (W5-01).
- `scripts/rule.mjs <ID|tag|keyword>` — compact rule lookup. `references/rule-tensions.md` — known pairs of rules that pull against each other, with resolutions.

## Skills (12) and agents (3)
- Workflow skills: `audit-method`, `review-method`, `restyle-method`; core `ux-doctor` (severity, scoring, finding format).
- Knowledge skills (progressive disclosure: `SKILL.md` → `references/index.md` → `references/rules.md`): `ux-hierarchy-clarity`, `ux-layout-spacing`, `ux-depth-craft`, `ux-color`, `ux-typography`, `ux-interaction-cost`, `ux-ui-patterns`, and `ux-web-patterns` (secondary: 253 paraphrased tips from public UX pattern pages and published AI-look guidance — states, motion, focus/touch, tokens, AI-look tells; labelled `source: web`).
- Agents: `ux-auditor` (read-only, run ×4 in parallel by dimension group), `ux-reviewer` (read-only), `ux-restyler` (edits one approved batch).

## Install
Replace `csulit/ux-doctor` with your fork if you use one.

| Platform | How | Tested |
|---|---|---|
| Claude Code | `/plugin marketplace add csulit/ux-doctor` then `/plugin install ux-doctor@ux-doctor-marketplace`; commands become `/ux-doctor:ux-audit`, `/ux-doctor:ux-review`, `/ux-doctor:ux-restyle`, `/ux-doctor:ux-rules`. Local test: `claude --plugin-dir <clone>` | `claude plugin validate .` passes; `/ux-doctor:ux-rules` ran live via `--plugin-dir` |
| Cursor | install as a plugin from the repo (`.cursor-plugin/plugin.json`), or `cursor-agent --plugin-dir <clone>`; or copy `skills/ commands/ agents/ rules/` into `.cursor/` | `/ux-rules` ran live via `cursor-agent --plugin-dir` |
| Pi | `pi install git:github.com/csulit/ux-doctor` (global) or `pi install -l git:github.com/csulit/ux-doctor` (this project only); commands load as prompt templates `/ux-audit` … ; no native subagents, so the passes run sequentially | audit, review, restyle (dry-run and `--yes`) and rules ran live |
| Codex | `.codex-plugin/plugin.json` exposes the skills; invoke `$audit-method`, `$review-method`, `$restyle-method`. For subagents copy `platforms/codex/agents/*.toml` to `.codex/agents/`. Codex has no plugin slash-commands | **not tested** (no Codex CLI available when this was built) |

Requirements: Node ≥ 20.1 for the bundled scripts; `cta-scan.mjs --render` needs Node ≥ 22 and an installed Chrome, Edge or Chromium (nothing is downloaded).

## Layout
```
skills/            Agent Skills (shared by all platforms)
commands/          4 slash commands (Claude Code, Cursor, Pi)
agents/            subagents (Claude Code, Cursor); platforms/codex/agents = generated TOML
skills/ux-doctor/references/rules.json   all 441 rules (188 playbook + 253 web), machine readable
reference/         editable sources: extracted/*.md (playbook), extracted-web/*.md (web layer); generated: page-coverage.md; git-ignored: PDF, render/, pages/, web/
scripts/           build-knowledge.mjs, sync-platforms.mjs, validate.mjs, check-paraphrase.mjs (dev)  (measuring tools ship with the skill: skills/ux-doctor/scripts/contrast.mjs, cta-scan.mjs, slop-scan.mjs, rule.mjs)
```
Rebuild after editing `reference/extracted/*.md`: `npm run build && npm run validate`.

## How the PDF was processed
144 pages → 8 parallel extractors (A: 1-19 … H: 127-144), each reading page text **and** viewing the rendered page image (most knowledge is in good/bad example pairs). Every page is accounted for in `reference/page-coverage.md`. Items marked "(from visual)" are inferred from imagery. The PDF's printed page numbers are PDF page − 1 from p.3; all citations use PDF pages.

## Sources and licensing
Code and workflow text: MIT (`LICENSE`). **The rule data is derived from third-party work** (a paid playbook and public pattern pages): see `NOTICE.md` for exactly what is included, what is not (PDF, page text, page renders, scraped pages are git-ignored), and how to request removal. Not affiliated with uxpeak or any other source.

Maintainers: `scripts/check-paraphrase.mjs` and a full rebuild from the PDF need the git-ignored raw sources (`reference/pages`, `reference/render`, `reference/web`); normal use and `npm run validate` don't.
