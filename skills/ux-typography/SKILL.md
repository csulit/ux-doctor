---
name: ux-typography
description: "Knowledge on typography: font choice and count, type scale, body size, line-height, line length, weight, text colour and contrast, plus headline styling tells. Use when auditing, reviewing or restyling font-family, font-size, line-height, font-weight, text colour, max-width of text, button-label contrast, eyebrow labels or one-word gradient headlines."
---

# UX Typography

Readable, hierarchical, accessible text. Playbook rules E-13..E-33 and F-01..F-19 (the p.96-97 checklist is folded into the rules it repeats); core web rules W1-24 (fixed type scale), W5-05, W5-06, W5-07 (AI-look type tells, `source: web`). A-12 (heading vs body colour) is scored in ux-hierarchy-clarity and A-24 (text alignment) in ux-layout-spacing.

## How to use
Start from the Critical 20 (`../ux-doctor/references/critical.md`), then the top checks below. Open a rule only for a candidate finding: `node ../ux-doctor/scripts/rule.mjs F-07`, or `references/index.md` → `references/rules.md`. Only `check` rules become findings.

## Top checks
- F-09 / F-12 (p.86, p.93, p.95) — text, or a button label on its fill, below 4.5:1 (3:1 large); light-grey body text is the usual offender → darken text, dark labels on pastel fills; always compute with `contrast.mjs`.
- F-06 (p.90, p.96) — main text below 12px, or body text not ~16px outside dense tool UIs → 16px body. `text-xs` (12px) is not itself a violation.
- F-07 / F-08 (p.91-92) — paragraph line-height outside 1.5-1.6 (below 1.2 cramped, above 2 floating); heading line-height ≥ paragraph line-height → body 1.5-1.6, headings tighter (display type at 1.0-1.15 is fine).
- E-22 / E-23 (p.76-78) — desktop body lines outside 45-75 real characters, mobile outside 30-40 → cap the column (~30-36em for proportional fonts); `ch` is the width of `0`, so measure real characters in the render.
- E-33 / F-03 / F-04 (p.84, p.87-89) — headings and body at the same weight or nearly the same size; body below weight 400 → headings 500-700 and clearly larger, body 400.
- E-19 / E-16 (p.74-76) — more than 2 families (icon and mono fonts excluded), or a decorative/novelty face for body, buttons or labels → one proven family, a second only split by role.
- E-31 (p.83) — `#000000` text on white or `#FFFFFF` on dark → graded off-black and off-white text tokens.

## Code signals
- Families: `grep -rhoE "font-family:[^;}]+"`, `@font-face`, Google Fonts `<link>`/`@import`; count unique non-icon, non-mono (E-19).
- Sizes: `font-size:\s*([0-9]|1[01])px`, `text-\[(\d|1[01])px\]`, rem values below 0.75 (F-06); sizes outside the type scale (W1-24).
- Line-height: `leading-(none|tight|snug)` on `<p>`; compare heading vs paragraph ratios (F-07, F-08).
- Measure: `max-w-none`, `w-full` or no `max-width` on paragraph containers; `max-w-prose` = 65ch, not 65 characters (E-22).
- Weights: `font-thin|font-extralight`, `font-weight:\s*[1-3]00` on body, headings with `font-normal` (E-33, F-03).
- Colours: `text-(black|white)`, `#000`/`#fff` text, `text-gray-(300|400)` or `opacity-*` on body text; run `contrast.mjs` on every text/background and label/fill pair (E-31, F-09, F-12).
- `<p>` with `m-0` in long-form text, walls of copy without subheadings (E-29, E-30, F-19).
- Headlines with one gradient or highlighted word, `uppercase tracking-widest text-xs` eyebrows before every heading, false numbering ("01 / 02") (W5-05, W5-06).

## Restyle
Values (sizes, line-heights, weights, text colours, families, line length): `../ux-doctor/references/defaults.md`. Specific to this skill:
- Proven UI families: Inter, Gotham, Lato, Open Sans, San Francisco, Helvetica, Manrope, Roboto (E-17); pairings: Playfair Display + Source Sans Pro, Raleway + Merriweather, Montserrat + Open Sans (E-21). Licensed fonts only (E-18).
- Sector choices are defaults, not findings: serif headings for formal sectors (E-13), sans for tech and messaging (E-15), script for a hero headline at most (E-14).
- Reference card (F-11, p.95): heading 28px Bold LH 120% `#1B000D`; body 18px Regular LH 160% `#5E5458`; button label 18px Semibold `#141B12`.
- Break long copy into short paragraphs with visible gaps and semibold subheadings (E-29, E-30, F-19).
