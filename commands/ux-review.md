---
description: "Focused design review of a diff, PR, files or a screenshot, with prioritized rule-cited comments"
argument-hint: "[PR number | path... | image | blank = current git diff]"
---

Run the **review-method** skill (load `ux-doctor` first, then `review-method`) on the change below. Read-only: do not edit files, start servers or post to any remote. The only permitted write is optional screenshots under `.ux-doctor/shots/`, made by the main agent (not the `ux-reviewer` subagent).

Target: $ARGUMENTS
(If that is blank or unexpanded, use the text the user typed after the command; if there is none, review the current git diff.)

Output the verdict and comments in the format the skill defines.
