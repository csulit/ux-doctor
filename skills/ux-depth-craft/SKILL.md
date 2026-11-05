---
name: ux-depth-craft
description: "Knowledge on depth and finish: shadows, elevation scales, tinted shadows, background layering, borders and outlines, glassmorphism, modal backdrops, overlapping imagery and nested cards. Use when auditing, reviewing or restyling box-shadow, borders, cards, dropdowns, modals, backdrop-filter/glass, flat all-white UIs or overlapping avatars and images."
---

# UX Depth & Craft

How shadows, background tone, outlines and glass create hierarchy and polish without clutter or lost legibility. Playbook rules D-02..D-18, E-01, H-07, H-08; core web rules W2-07 (modal backdrop), W1-77 (scale the image, not the card), W5-08 and W5-09 (AI-look card tells, `source: web`).

## How to use
Start from the Critical 20 (`../ux-doctor/references/critical.md`), then the top checks below. Open a rule only for a candidate finding: `node ../ux-doctor/scripts/rule.mjs D-05`, or `references/index.md` → `references/rules.md`. Only `check` rules become findings.

## Top checks
- D-18 / E-01 (p.64-65) — text on a translucent or blurred panel that loses contrast over its real backdrop, or glass over a too-light background → measure with `contrast.mjs --over`; darker tint, higher fill opacity, stronger blur or a solid surface.
- D-05 / D-06 (p.52-54) — hard or dark halo shadows (`0 0 48px #9F9F9F`), or neutral grey shadows on a coloured background → soft offset shadow (`0 12px 48px #E9E9E9`), tinted to the background hue.
- D-03 (p.50-51) — dropdown, popover, menu or modal with no shadow over content → a subtle diffuse shadow from the tier scale.
- D-08 (p.55-56) — many one-off `box-shadow` values, or tiers that don't follow purpose (a modal weaker than a small card) → named tiers (sm / md / lg) with rising offset and blur.
- D-11 / D-12 (p.56-58) — page and cards the same colour with no border or shadow → light grey page + white cards, or thin light outlines.
- D-13 / D-14 (p.59-61) — dividers on every row plus section borders plus tinted fills in one card; dark or heavy routine borders → spacing instead of lines; 1px light borders.
- W5-09 (web) — a bordered or shadowed card inside another card, or a box around a single line to fake hierarchy → flatten the inner level with spacing and a heading.

## Code signals
- Count unique `box-shadow:` values and Tailwind `shadow-\[`/`drop-shadow-\[` (D-08).
- `0 0 \d+px` with a dark colour, `#000`/`black` or `rgba(0,0,0,.2+)` in shadows (D-05); grey shadows on tinted sections (D-06).
- Overlay components (dropdown, popover, modal, tooltip) with `shadow-none` or no shadow (D-03); modals with no dimmed backdrop (W2-07).
- `backdrop-filter|backdrop-blur|bg-white/\d+` surfaces: check backdrop brightness and text contrast (D-18, E-01).
- `border-(2|4|8)`, `border-(black|gray-(700|800|900))`, `divide-y` on every list (D-13, D-14).
- `bg-white` on both wrapper and card with no `border`/`shadow` (D-11); `<Card>` inside `<Card>` (W5-09); `border-l-4 border-<accent>` on every card (W5-08).
- Hovered cards with `hover:scale-*` on the container (W1-77).
- Overlapping avatars (`-space-x-`, negative margins) without a ring in the surface colour (H-08).

## Restyle
Values (shadow tiers, borders, layering): `../ux-doctor/references/defaults.md`. Specific to this skill:
- Tinted shadows from the p.53-54 examples: purple surface `0 19px 56px #CFC9DD`, cream surface `0 12px 48px #E3D5B2`; derive a desaturated mid-tone of the surface hue for others (D-06).
- Shadow variants for special needs: a tinted warning shadow, a very subtle input shadow (D-10).
- Glass only on selected floating components over rich, dark-enough imagery; a flat plain surface is a valid baseline and never a finding (D-16, D-17).
- Overlapping images: straddle the banner edge and add a ring in the surface colour (~2-3px, from visual) (H-07, H-08).
