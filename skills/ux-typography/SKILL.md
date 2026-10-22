---
name: ux-typography
description: "Knowledge of typography rules from the UI/UX playbook: font choice and count, type scale, body size, line-height, line length, weight, text colour and contrast, alignment. Use when auditing, reviewing or restyling font-family, font-size, line-height, font-weight, text colour, max-width of text or button-label contrast."
---

# UX Typography

Scope: choosing and setting type so text is readable, hierarchical and accessible.
Rules E-13…E-33 and F-01…F-19 (playbook pp.72-97).

## How to use
Read references/index.md first; open references/rules.md only for the rule IDs relevant to the current finding (search by ID, e.g. `grep -n '^### F-07' references/rules.md`). Cite rule IDs and pages in every finding.

## Top checks
- F-06 (pp.90, 96) — Main text < 12px = violation (p.90); any text < 10px = violation, platform-dependent (p.96); body < 16px = check, not an automatic fail (inference) (`text-[10px]` etc.) → body 16px. `text-xs` is 12px, so it is not itself a violation.
- F-07 (p.91) — Paragraph line-height < 1.2 cramped, > 2 floating, ideal 1.5-1.6 (`leading-none/tight` on paragraphs = violation) → 1.5-1.6.
- F-08 / F-16 (p.92) — Fail = heading line-height ≥ paragraph line-height (compare computed ratios in the same context) or heading lines colliding/clipped (inference). The heading ratio shrinks as size grows: playbook 120% in the card example, 36px heading ≈ 1.3, paragraphs 1.5-1.6. Large display type (≥ ~56px) at 1.0-1.15 is not a violation by itself (inference); do not apply a flat "> 1.3" cut-off.
- E-22 / E-26 (pp.76-78) — Desktop body measure outside 45-75 real characters per line (no `max-width`, `max-w-none`, full-width paragraphs) → measure real characters per line in the rendered page (browser `Range` rects per line, or font metrics); 1ch is the width of the `0` glyph, NOT an average character (one proportional UI font: 72ch ≈ 93 real characters, 36em ≈ 73.5). Rule of thumb for proportional UI fonts about 30-36em for 45-75 characters (inference — verify per font); `ch` only for monospace. Centred block (E-27) or left-aligned (E-28).
- E-23 (p.77) — Mobile lines should be 30-40 characters → adjust padding/size.
- F-02 (p.86) — Light-grey body text: `#A9A9A9` on white fails, `#626262` passes (`text-gray-300/400`, opacity on text) → darken to ≥ ~#626262 or 4.5:1.
- F-09 (p.93) — Text/background pair < 4.5:1 (WCAG AA), especially on tinted cards and images → darken text; dark text on mid-tone fills, not white.
- F-12 (p.95) — Button label < 4.5:1 on its fill (white on pink/pastel) → near-black `#141B12`, semibold, or darker fill.
- E-33 / F-15 (pp.84, 96-97) — Heading and body same weight (400/400) → headings 500-700, body 400 (or 300).
- F-03 (p.87) — Body weight < 400 (`font-thin`, `font-extralight`; `font-light` on small text = warning) → 400, or 500 for delicate small text.
- F-01 (p.85) — Light heading (≤ 400) relies mostly on size: it must be clearly, visibly larger than body; a colour darker than body is a reinforcement, not a requirement → else raise weight or size. No numeric size ratio in the playbook (a ≥ ~2x rule of thumb would be an inference).
- F-04 / F-05 (pp.88-89) — Heading size ≈ body size, or a secondary message larger than the critical one → clear size step. Playbook examples: 32px title vs 16px body (p.90 card, = 2x computed) and 28px heading vs 18px body (p.95, ≈ 1.55x computed); no minimum ratio is stated.
- E-19 / F-18 (pp.75-76, 96-97) — More than 2 distinct `font-family` values (excluding icon/mono) → 1 family (ideal) or max 2 split heading/body (E-20, E-21).
- E-31 / F-13 / F-14 (pp.83, 96) — `#000000` / `#FFFFFF` for both heading and body, or identical heading/body colour → graded off-black/off-white, heading darker than body.
- E-16 (p.74, high) — Decorative/blackletter/condensed/novelty face for body, buttons or UI labels → neutral legible typeface.
- F-10 (p.94) — `text-align: center|right` on multi-line paragraphs or lists → left-align; centre only short titles.

## Code signals
- Distinct families: `grep -rhoE "font-family:[^;}]+"` and `font-(sans|serif|mono)`, `@font-face`, Google Fonts `<link>`/`@import`, Figma text styles; count unique non-icon/non-mono (E-19, F-18).
- Sizes: `font-size:\s*([0-9]|1[01])px`, `text-\[(\d|1[01])px\]`, `font-size:\s*0?\.([0-6]\d*|7[0-4]\d*)rem` (i.e. < 0.75rem = < 12px) (F-06).
- Line-height: `line-height:\s*(0?\.\d+|1(\.[01]\d*)?|1\.[0-4]\d*)\b`, `leading-(none|tight|snug)` on `<p>`; compare heading vs paragraph ratio (F-08 fails on heading ≥ paragraph, not on a fixed number; display type ≥ ~56px at 1.0-1.15 is fine, inference); `line-height` > 2 (F-07, F-08).
- Measure: `max-w-none`, `w-full` or absent `max-width` on paragraph containers; `max-w-(prose|[0-9]xl)`, `[0-9]+ch` (do not convert `ch` into a character count; `max-w-prose` = 65ch is not 65 characters in a proportional font); measure real characters per line at desktop and mobile widths in the rendered page (E-22, E-23, E-26).
- Weights: `font-weight:\s*[1-3]00`, `font-thin|font-extralight|font-light`, headings with `font-normal` (E-33, F-03, F-15).
- Colours: `color:\s*#(000|000000|fff|ffffff)\b`, `text-(black|white)`, `text-gray-(300|400)`, `opacity-(40|50|60)` on text, placeholder-grey used as content; run a contrast check for every text/background pair and button label/fill pair (E-31, F-02, F-09, F-12).
- Alignment: `text-center|text-right|text-align:\s*(center|right)` on multi-line blocks (F-10).
- Paragraph spacing: `<p>` with `margin:0` / `m-0` / no gap in long-form text (E-29, F-19).
- Body font resolves to serif: `font-serif`, Times New Roman, Georgia (F-17).
- Screenshots: walls of full-width text, wall-of-paragraph without subheads (E-30), faint grey copy, tiny captions, white labels on pastel buttons.

## Restyle defaults
- One family, e.g. Inter; variety via weight/size (E-17, E-20). Safe list: Inter, Gotham, Lato, Open Sans, San Francisco, Helvetica, Manrope, Roboto (E-17). Two-font pairs: Playfair Display + Sources Sans Pro; Raleway + Merriweather; Montserrat + Open Sans (E-21). Licensed fonts only; Google Fonts is a safe free source (E-18).
- Sans-serif body (F-17); serif for formal sectors (E-13), sans for tech/music/messaging (E-15), script for hero headline only (E-14).
- Body 16px / weight 400 / line-height 1.5-1.6 (F-06, F-03, F-07); headings weight 500-700, line-height ≈ 1.2-1.3 (E-33, F-08).
- Reference card (F-11, p.95): heading 28px Bold LH 120% `#1B000D`; body 18px Regular LH 160% `#5E5458`; button label 18px Semibold `#141B12`; left-aligned.
- Text tokens (E-32, p.83): light mode heading `#1A1A1A`, body `#4E4E4E`; dark mode heading `#F2F2F2`, body `#CACACA`. Add a secondary text token lighter than the heading token but ≥ 4.5:1 (F-14).
- Measure: cap text columns in `em`/`rem`, about 30-36em for proportional UI fonts (inference — re-measure real characters per line: target 45-75 desktop); `ch` only for monospace; 30-40 chars mobile (E-22, E-23).
- Break long copy into short paragraphs with visible gaps and subheadings (semibold, slightly larger than body, optional icon / thin divider line) (E-29, E-30, F-19). Exact paragraph spacing (~0.75-1em) is not in the playbook (general practice).
- Contrast target 4.5:1 normal text (F-09, WCAG AA); 3:1 for large text/UI is general practice.

## Pairs well with
- ux-hierarchy-clarity — size/weight/colour as hierarchy.
- ux-color — contrast, text colour tokens, dark mode.
- ux-layout-spacing — line length, paragraph spacing, alignment.
- ux-depth-craft — text on glass or coloured surfaces.
- ux-ui-patterns — button labels, cards, forms.
