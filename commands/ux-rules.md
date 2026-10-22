---
description: "Look up playbook design rules by topic, rule ID, tag or question (e.g. \"button hierarchy\", \"E-10\", \"shadow on colored background\")"
argument-hint: "<topic | rule ID | question>"
---

Answer from the ux-doctor knowledge base only. Query: $ARGUMENTS
(If blank or unexpanded, use the user's text after the command; if none, list the eight knowledge skills and their rule counts.)

Steps:
1. Load the `ux-doctor` skill. Find matching rules with `node <ux-doctor skill folder>/scripts/rule.mjs <query>` (`<ux-doctor skill folder>` = the directory containing the `ux-doctor` skill's `SKILL.md`; query = ID, tag or keyword; exit 1 = no match). If the script can't run, use the `references/index.md` of the most relevant `ux-*` skill. Open the full entry in that skill's `references/rules.md` only if the compact output is not enough.
2. Reply with at most 5 rules (playbook first; mark W- rules `source: web`): ID, title, citation (`p.N`; for W- rules `web:<slug>` — there is no page), the rule with its exact numbers, the do/don't, and the audit check + restyle fix. Mention related rule IDs and, if the rule pulls against another, the entry in `references/rule-tensions.md`.
3. If nothing matches, say so and answer as `(general practice)`, clearly labelled. Never invent a playbook rule or number.
