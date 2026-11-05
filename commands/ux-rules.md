---
description: "Look up playbook design rules by topic, rule ID, tag or question (e.g. \"button hierarchy\", \"E-10\", \"shadow on colored background\")"
argument-hint: "<topic | rule ID | question>"
---

Answer from the ux-doctor knowledge base only. Query: $ARGUMENTS
(If blank or unexpanded, use the user's text after the command; if none, list the seven dimension skills and the extended web reference.)

1. Run `node <ux-doctor skill folder>/scripts/rule.mjs <query>` (`<ux-doctor skill folder>` = the directory containing the `ux-doctor` skill's `SKILL.md`; query = ID, tag or keyword; exit 1 = no match; an over-broad tag prints counts per skill, so add a word). For a value ("what line-height?") read `references/defaults.md` first.
2. Reply with at most 5 rules, playbook first: ID, title, citation (`p.N`; W- rules `web:<slug>`, `source: web`, no page), kind, the rule with its exact numbers, the audit check, the restyle fix and its scope if it has one.
3. If nothing matches, say so and answer as `(general practice)`, clearly labelled. Never invent a playbook rule or number.
