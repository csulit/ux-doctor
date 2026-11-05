---
description: "Focused design review of a diff, PR, files or a screenshot, with prioritized rule-cited comments"
argument-hint: "[PR number | path... | image | blank = current git diff]"
---

Load the `ux-doctor` skill, then run the **review-method** skill on the change below, within its boundaries (no project edits, nothing posted to a remote).

Target: $ARGUMENTS
(If that is blank or unexpanded, use the text the user typed after the command; if there is none, review the current git diff.)
