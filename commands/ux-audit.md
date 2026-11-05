---
description: "Full read-only UI/UX audit of a project, route, URL or screenshots, scored against the playbook; writes .ux-doctor/audit.md"
argument-hint: "[path | url | screenshot] [--focus <dimension>] [--quick]"
---

Load the `ux-doctor` skill, then run the **audit-method** skill on the target below, within its boundaries (read-only; writes only inside `.ux-doctor/`).

Target / options: $ARGUMENTS
(If that is blank or unexpanded, use the text the user typed after the command; if there is none, audit the current project.)
