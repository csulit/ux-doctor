---
description: "Restyle a UI toward the playbook rules in reviewed batches (tokens, global, components, pages) with measured before/after"
argument-hint: "[path] [--from-audit] [--scope tokens|global|components|pages|all] [--dry-run] [--yes]"
---

Load the `ux-doctor` skill, then run the **restyle-method** skill with the input below. It edits files: show the batch plan and wait for confirmation unless `--yes` is given; never commit.

Input / options: $ARGUMENTS
(If that is blank or unexpanded, use the text the user typed after the command; if there is none, use `.ux-doctor/audit.md` when it exists, else run a quick audit first.)
