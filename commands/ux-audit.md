---
description: "Full read-only UI/UX audit of a project, route, URL or screenshots, scored against the playbook; writes .ux-doctor/audit.md"
argument-hint: "[path | url | screenshot] [--focus <dimension>] [--quick]"
---

Run the **audit-method** skill (load `ux-doctor` first, then `audit-method`) on the target below. Read-only: do not edit source files (write only inside `.ux-doctor/`: `audit.md`, `shots/`; never edit `.git/info/exclude`), never install or start servers.

Target / options: $ARGUMENTS
(If that is blank or unexpanded, use the text the user typed after the command; if there is none, audit the current project.)

Finish by printing the grade (with range if contested), severity counts, the Fix-first items and the report path, and suggest the restyle command for this platform: `/ux-restyle --from-audit` (Pi, Cursor), `/ux-doctor:ux-restyle --from-audit` (Claude Code), `$restyle-method` (Codex).
