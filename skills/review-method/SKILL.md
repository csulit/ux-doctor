---
name: review-method
description: "Procedure for a focused design review of a change set (git diff, PR, branch, file list) or a screenshot/mockup, returning prioritized, rule-cited comments. Use when asked to review UI changes, critique a design, give design feedback on a PR, or via /ux-review."
---

# Review method (read-only)

Never edit project files. The only permitted write is optional screenshots under `.ux-doctor/shots/`, made by the **main agent** (never by the read-only `ux-reviewer` subagent). Never start servers or install anything. Severity, evidence labels, lowering, constraints: `../ux-doctor/SKILL.md`; finding block, tools: `../ux-doctor/references/finding-format.md`.

Goal: a short, actionable critique of *what changed* — not an audit of the whole product.

## 1. Determine the change
Argument may be: nothing, a PR number/URL, paths, or image files.
- **Nothing**: `git diff HEAD` plus untracked files from `git ls-files --others --exclude-standard`. Exclude from the untracked list `.claude/ .cursor/ .pi/ .codex/ .ux-doctor/`, vendored/generated paths (`node_modules`, `dist`, `build`, lockfiles, minified files) and files > 50 KB. If more than 10 untracked files remain, ask which to include. Prefer `.ux-doctor/restyle.patch` when it exists (it is the restyle's own diff). If the tree is clean, diff the branch against the default branch from `git symbolic-ref --short refs/remotes/origin/HEAD`; if `origin/HEAD` is unset use the first existing of `main`, `master`, `trunk`, `develop`, else ask which base to use.
- **PR**: `gh pr diff`. If `gh` is unavailable, fall back to `git fetch` + `git diff <base>...<head>`, or ask the user for the diff.
- **Images**: read the screenshot paths directly. Unescape backslash-escaped spaces; macOS screenshot temp folders cannot be listed but can be read. When reviewing a screenshot of a restyle and you don't have the "before", ask for it.
Keep only UI-relevant hunks (markup, CSS/Tailwind, theme/tokens, assets). If none, say so and stop.

## 2. Read in context
For each touched component read the whole file, one hop of usage and the project's tokens/theme. The new UI must be consistent with sibling components (playbook "Consistency" rules) unless the change is an intentional system update. Read the project constraints (ground rule 1, `../ux-doctor/SKILL.md`): **a diff that breaches one is a blocker, citing the project file and line**.

## 3. Pick the knowledge
Choose the 2–4 knowledge skills the diff touches (a card → `ux-layout-spacing`, `ux-depth-craft`, `ux-typography`; a form → `ux-ui-patterns`, `ux-interaction-cost`); use each `references/index.md` and open only matching rules. Measure instead of guessing (`../ux-doctor/references/finding-format.md`, `contrast.mjs`, `rule.mjs`). If the diff touches a layout, header, nav or hero component, the **main agent** runs `node <ux-doctor skill folder>/scripts/cta-scan.mjs <url> --render --shots .ux-doctor/shots` on the affected routes (only against an already running server; or views a given screenshot) **before judging hierarchy or CTAs and before delegating** — header and hero together make up the first viewport. A diff that hides, removes or moves a header/nav CTA is checked per the same-destination test in `ux-hierarchy-clarity` (persistent route at both scroll states, no orphaned slot); the main agent also captures the header after scrolling past the hero CTA (browser tool) before delegating, since the `ux-reviewer` agent cannot take screenshots. Check `../ux-doctor/references/rule-tensions.md` for suggestions that pull against each other.

## 4. Output
```
## Design review — <what> (<n files>)
Verdict: approve | approve with comments | changes requested      (changes requested only if a blocker/major exists)
### Must fix   (blocker/major)   — finding blocks
### Should fix (minor)           — finding blocks, one line each if trivial
### Nits       (polish)          — bullet list
### Good       — 2-4 things done well, with rule IDs (none may contradict a finding)
Advisory: <one line each — token-conforming values, accepted by design; unscored>
```
Finding block = `../ux-doctor/references/finding-format.md`, anchored on the **new** code (`line N @ <short sha>`). Suggest the exact replacement classes/values. If the diff cannot be judged visually, mark visual claims `inferred`, say what you could not verify and which screenshot would settle it.

## Rules
- Comment only on lines the change introduced or made worse; pre-existing issues go in one "Pre-existing, out of scope" line (max 3 items).
- ≤ 12 comments; prioritise by user impact. No taste-only comments without a rule ID.
- For PRs, never post comments to the remote unless the user asks; print them.
- Optional subagent: `ux-reviewer` (read-only, writes nothing) can do steps 2–4 for large diffs; give it the diff, project constraints, evidence mode (rendered|code-only), the viewport list and the screenshot paths from your `cta-scan --shots` run.
