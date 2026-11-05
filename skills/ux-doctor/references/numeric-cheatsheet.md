# Numeric cheat-sheet (actionable playbook values)

Generated from the playbook extraction, keeping only values with a unit, ratio, weight or colour (example data and counts are left out). Page numbers = PDF pages. For the one value to build with per property, use `defaults.md`.

| value | applies to | source |
|---|---|---|
| 28px / 28px | BAD: label spacing above and below (equal), ambiguous grouping in contact form | A: p.13 |
| 12px | GOOD: gap between a label and its own field | A: p.13 |
| 32px | GOOD: gap between the previous field and the next label | A: p.13 |
| ~2.7:1 (32:12) | ratio of inter-group to intra-group spacing in good form (derived) | A: p.13 |
| 2.84:1, 1.81:1, 1.92:1 | contrast ratios of bad status badges (white-ish text on saturated fills) | B: p.21 |
| 4.8:1, 4.94:1, 6.54:1 | contrast ratios of good status badges (dark text on pale tint) | B: p.21 |
| 4.5:1 | standard WCAG AA body-text minimum (external, NOT in PDF; added for audit use) | B: p.21 |
| 4px, 8px, 16px, 24px, 32px "and so on" | example spacing scale from multiples of 4 | B: p.28 |
| 8px | example "related items apart" distance | B: p.29 |
| 31px, 19px | examples of random spacing to avoid | B: p.29 |
| X 0, Y 0, Blur 48, #9F9F9F | BAD harsh drop shadow on white card | D: p.52 |
| X 0, Y 12, Blur 48, #E9E9E9 | GOOD soft drop shadow on white card | D: p.52 |
| X 0, Y 19, Blur 48, #C7C7C7 | BAD grey shadow on light purple background | D: p.53 |
| X 0, Y 19, Blur 56, #CFC9DD | GOOD purple-tinted shadow on light purple background | D: p.53 |
| X 0, Y 20, Blur 60, #D8D8D8 | BAD grey shadow on cream/yellow background | D: p.54 |
| X 0, Y 12, Blur 48, #E3D5B2 | GOOD warm-tinted shadow on cream/yellow background | D: p.54 |
| 1px vs 10px | flight search box border examples (both valid) | D: p.62 |
| #FFFFFF / #FFFFFF | BAD dark theme heading / body text colour (pure white on black) | E: p.83 |
| #000000 / #000000 | BAD light theme heading / body text colour (pure black on white) | E: p.83 |
| #F2F2F2 | GOOD dark theme heading text | E: p.83 |
| #CACACA | GOOD dark theme body text | E: p.83 |
| #1A1A1A | GOOD light theme heading text | E: p.83 |
| #4E4E4E | GOOD light theme body text | E: p.83 |
| #A9A9A9 | light grey body text on white — fails WCAG AA & AAA | F: p.86 |
| #626262 | grey body text on white — passes WCAG AA (computed 6.1:1; PDF badge also says AAA, which needs 7:1 — erratum) | F: p.86 |
| Extra-light vs Regular (400) | body weight bad vs good | F: p.87 |
| 16px | "gold standard" main body text size | F: p.90 |
| < 12px | avoid for main text | F: p.90 |
| 32px / 16px / 10px | bad card: title / tabs / body font sizes | F: p.90 |
| 32px / 16px / 16px | good card: title / tabs / body font sizes | F: p.90 |
| 1.5-1.6x (150-160%) | line-height for ~16px body text | F: p.91 |
| 36px heading → 1.3x (130%) line-height | heading rule of thumb | F: p.92 |
| 4.5:1 | minimum contrast ratio for most text (WCAG AA) | F: p.93 |
| 28px, Bold, #1B000D, LH 120% | good card heading | F: p.95 |
| 18px, Regular, #5E5458, LH 160% | good card body | F: p.95 |
| 18px, Semibold, #141B12 | good card button label (AA+AAA pass) | F: p.95 |
| 22px, Medium, #000000, LH 170% | bad card heading | F: p.95 |
| 18px, Regular, #000000, LH 110% | bad card body | F: p.95 |
| 22px, Regular, #FFFFFF | bad card button label (AA+AAA fail) | F: p.95 |
| #000000 / #FFFFFF | pure black/white — avoid for both headings and paragraphs | F: p.96 |
| < 10px | avoid font sizes (platform-dependent) | F: p.96 |
| 1440px or more | Desktop screen width at which designers are tempted to stretch forms and CTAs (don't) | H: p.130 |
