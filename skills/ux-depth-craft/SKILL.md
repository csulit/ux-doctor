---
name: ux-depth-craft
description: "Knowledge of depth and craft rules from the UI/UX playbook: shadows, elevation scales, tinted shadows, background layering, borders/outlines, glassmorphism and overlapping imagery. Use when auditing, reviewing or restyling box-shadow, borders, cards, dropdowns, modals, backdrop-filter/glass, flat all-white UIs or overlapping avatars/images."
---

# UX Depth & Craft

Scope: how shadows, background tone, outlines and glass create hierarchy and polish without clutter or lost legibility.
Rules D-02…D-18, E-01, H-07, H-08 (playbook pp.50-65, 132-133).

## How to use
Read references/index.md first; open references/rules.md only for the rule IDs relevant to the current finding (search by ID, e.g. `grep -n '^### D-05' references/rules.md`). Cite rule IDs and pages in every finding.

## Top checks
- D-18 (p.64, high) — Text/controls on translucent or blurred panels must stay legible, effect "modern but not overbearing"; secondary text vanishing over a bright backdrop = fail → darker tint / higher fill opacity / stronger blur, or darken the image; keep a faint 1px light border.
- E-01 (p.65) — Glass (`backdrop-filter`, rgba alpha < 1) over a too-light background = fail; measure contrast against the actual backdrop → darken backdrop, raise opacity, or use a solid surface.
- D-05 (p.52) — Shadow must be soft: bad `X0 Y0 Blur48 #9F9F9F` (dark halo); good `X0 Y12 Blur48 #E9E9E9` (light, offset down) → add positive Y, lighten colour/alpha.
- D-06 / D-07 (pp.53-54) — Neutral grey/black shadow (R=G=B) on a coloured background = flag → tint to the background hue: `0 19px 56px #CFC9DD` on light purple; `0 12px 48px #E3D5B2` on cream.
- D-03 (pp.50-51) — Dropdown, popover, menu, tooltip, modal with `box-shadow: none` over content → add subtle diffuse shadow.
- D-04 (p.51) — Chips/controls over maps, images, video, charts with no shadow/border/opaque fill → add a small soft (sm-tier) shadow.
- D-08 (p.55) — Count distinct `box-shadow` values; many one-off near-duplicates → consolidate to named tokens (xs, sm, md, lg, xl, 2xl) with monotonic Y offset and blur.
- D-09 (p.56) — Min 3 tiers by purpose: soft = buttons/small cards/thumbnails; medium = modals/pop-ups; strong = dropdowns/important alerts. Modal weaker than a small card, or big dark shadows on buttons = flag.
- D-11 (pp.56-57) — Page and cards same colour (#FFF on #FFF) with no border/shadow, esp. dashboards → light-grey page + white cards.
- D-12 (p.58) — Alternative to D-11: segment with 1px light outlines on cards and hairlines between sidebar groups.
- D-13 (pp.59-60) — Divider between every row + section borders + tinted section fills in one card = overdone → remove dividers, use spacing, light-grey fill for inputs, drop footer tint.
- D-14 (pp.60-61) — Dark (#000/#333) or visibly thick/prominent routine borders on table rows/buttons → thin (1px in the playbook examples), very light grey. No exact width threshold in the playbook (1px and 10px examples are both valid, D-15).
- D-02 (p.50) — Every surface identical with no tone/outline/shadow cue to raised vs background elements → add a layering model (page tone, surface tone, optional outline, shadow tiers).
- H-07 / H-08 (pp.132-133) — Banner and avatar/product image stacked apart (flat) or overlapping without separation → let image straddle the banner edge and add a border/ring in the surface colour.

## Code signals
- `grep -rnE "box-shadow:\s*[^;]+" ` then count unique values; also Tailwind arbitrary `shadow-\[` and `drop-shadow-\[` (D-08).
- Shadow colour alpha: `rgba\(0,\s*0,\s*0,\s*0?\.(1[5-9]|[2-9])` (inference: D-05 says roughly 10-15% black, not an exact cut-off) or `#000`/`black` inside a shadow value (D-05, D-07).
- `0 0 \d+px` (Y = 0 halo) combined with a dark colour (D-05).
- Overlays (`position:\s*(absolute|fixed)`, `z-index`, dropdown/popover/modal/tooltip components) with `shadow-none` or no shadow (D-03).
- `backdrop-filter|backdrop-blur|bg-(white|black)/\d+|rgba\([^)]*,\s*0?\.\d+\)` surfaces: check backdrop brightness and text contrast (D-18, E-01). Figma: layers with "Background blur".
- Border widths/colours (width patterns are inference; flag only if also dark/harsh, D-15): `border(-\w+)?:\s*([2-9]|\d\d)px`, `border-(2|4|8)`, `border-(black|gray-(700|800|900))`, `#000`/`#333` borders; `divide-y` on every list, `border-b` on every row (D-13, D-14).
- Page bg equals card bg: compare `body`/`main` background with `.card`/`bg-white` panels; Tailwind `bg-white` on both wrapper and card with no `border`/`shadow` (D-11).
- Avatars/thumbnails with negative margin (`-mt-`, `-ml-`, `translate-y-`, `-space-x-`) lacking `ring-`/`border` in the surface colour (H-08).
- Screenshots: look for floating menus that merge with the page, halo-shaped dark shadows, lines everywhere, pale glass panels with faint text.

## Restyle defaults
- Soft shadow: `0 12px 48px #E9E9E9` on neutral light backgrounds (D-05).
- Tinted shadows: purple surface `0 19px 56px #CFC9DD` (D-06); cream surface `0 12px 48px #E3D5B2` (D-07). Derive a desaturated mid-tone of the surface hue for other colours (D-06).
- Shadow tokens `--shadow-xs … --shadow-2xl`, Y offset and blur rising with tier; ≥3 tiers mapped by purpose (D-08, D-09). Variants such as a tinted warning shadow and a very subtle input shadow (D-10).
- Layering: light-grey page + pure white cards (D-11; exact grey not given in playbook, ~#F5F5F7 is a visual estimate). Or `1px solid` light-grey outlines (D-12, D-14).
- Prefer spacing and a light grey input fill over extra borders (D-13).
- Thick borders only as a deliberate, soft, translucent brand-tint frame (playbook example 10px) (D-15).
- Glass only on selected floating components over rich, dark-enough imagery; flat plain surface stays valid, do not flag it (D-16, D-17).
- Overlap ring: surface-coloured border; playbook gives no px, looks ~2-3px (H-08).
- Border grey ~#E5E7EB-level (D-14, from visual, not specified). Glass legibility target 4.5:1 text / 3:1 large text and UI (WCAG, general practice; E-01 cites it as the check).

## Pairs well with
- ux-color — tinted shadows, surface/page tone, contrast of glass text.
- ux-hierarchy-clarity — elevation, outlines and tone as hierarchy techniques.
- ux-layout-spacing — spacing instead of borders, card grouping.
- ux-ui-patterns — dropdowns, modals, cards, tables, avatar stacks.
- ux-typography — legibility of text on glass or coloured surfaces.
