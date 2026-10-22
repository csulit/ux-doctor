---
description: "Restyle a UI toward the playbook rules in reviewed batches (tokens, global, components, pages) with measured before/after"
argument-hint: "[path] [--from-audit] [--scope tokens|global|components|pages|all] [--dry-run] [--yes]"
---

Run the **restyle-method** skill (load `ux-doctor` first, then `restyle-method`) with the input below. This command edits files: show the batch plan and wait for confirmation unless `--yes` is given. Never commit. Record `git status --porcelain` first and respect the project's own rules (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/*`).

Input / options: $ARGUMENTS
(If that is blank or unexpanded, use the text the user typed after the command; if there is none, use `.ux-doctor/audit.md` when it exists, else run a quick audit first.)
