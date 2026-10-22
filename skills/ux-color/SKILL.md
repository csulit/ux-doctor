---
name: ux-color
description: "Playbook knowledge on colour use — brand/primary colour restraint, palette balance, neutral vs coloured backgrounds, dark mode, and status colours (error/success/warning). Use when auditing, reviewing or restyling palettes, tokens, themes, backgrounds, form validation states or colour-only indicators."
---

# UX Colour

Covers rule group E-02..E-12: palette purpose, primary-colour restraint, backgrounds, dark mode, status colours.
Use it to decide where colour goes, how much, and what it means.

## How to use
Read references/index.md first; open references/rules.md only for the rule IDs relevant to the current finding (search by ID, e.g. `grep -n '^### E-03' references/rules.md`). Cite rule IDs and pages in every finding.

## Top checks
- E-03 (p.66-67, high) — brand/primary colour on non-clickable things (headings, icon tiles, section titles, decorative blocks) or on more than a few focal items per screen → move it to main CTAs/links/active states; headings, secondary icons, secondary buttons go neutral grey/near-black; at most one or two highlighted focal items.
- E-05 (p.67-68, high) — page/screen background is a saturated colour (high chroma, e.g. HSL saturation > ~50% (inference; the playbook gives no number), applied only to light/mid-lightness backgrounds, about 25-75% lightness (inference), so E-07's very dark navy/grey surfaces are not flagged) → white/off-white/light grey or beige; brand colour to accents/CTAs.
- E-10 (p.70, high) — error/success/warning conveyed only by border/background colour → add status icon + short message; state must be distinguishable in greyscale; colour only reinforces.
- E-11 (p.71, high) — off-convention status colours (amber error, pink/blue success, brand-coloured status) → red = error, green = success, amber/yellow = warning (warning amber is by convention); keep icon + text.
- E-04 (p.67, medium) — many competing non-neutral hues, or hues without a role → one primary hue (+ optional accent) + neutrals; flag > ~1 brand hue + 1 accent (inference; the playbook gives no number). Exclude status colours and data viz.
- E-08 (p.70, medium) — no dark theme, no `prefers-color-scheme` handling, hard-coded hex everywhere → semantic tokens with light and dark values + theme toggle / honour system setting.
- E-06 (p.69, low) — saturated background on content-heavy/working screens → limit coloured backgrounds to splash, header/hero or a specialised section band; content areas neutral.
- E-07 (p.69, low) — dark theme with saturated or vibrant surfaces → dark neutral surfaces (very dark navy/grey), light text, same accent colours and same hierarchy as light.
- E-12 (p.71, low) — status colour shifted away from red/green hue family to match brand → adjust tone (lightness/saturation) only; keep hue family.
- E-02 (p.66, low) — colours picked ad hoc → define roles first (brand, action, status, neutral) and assign every colour a purpose.
- E-09 (p.70, low) — default theme chosen without regard to brand/audience → choose white vs moody dark deliberately.

## Code signals
- Primary token on non-interactive nodes: `text-primary|text-brand-*|text-indigo-600` on `h1-h6`, section titles, static icons; `bg-primary` on cards/tiles that aren't clickable (E-03).
- Count of filled primary buttons per screen; secondary buttons using `bg-primary` instead of neutral `bg-gray-100|200` (E-03).
- Distinct hue count: `grep -ohE '(bg|text|border)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+'` and tally unique hue names; or unique `hsl(`/hex values in CSS (E-04).
- Body/page background: `body|html|#root|main` with a saturated light/mid-lightness fill, e.g. `bg-<hue>-[3-6]00`, saturated hex/HSL (inference; skip very dark neutral surfaces per E-07); gradient page backgrounds (E-05, E-06).
- Validation states: `.error|.invalid|aria-invalid` styles that change only `border-color`/`background`/`color` with no sibling icon or message element; inputs with `border-red-*` and no helper text (E-10).
- Status mapping: error using `amber|yellow|orange|pink|blue`; success using `pink|blue|purple|brand`; `--color-error` / `--color-success` token hues (E-11, E-12).
- Theme: absence of `@media (prefers-color-scheme: dark)`, `.dark` class / `dark:` variants, or `[data-theme]`; raw hex values instead of CSS variables / design tokens (E-08).
- Dark theme surfaces with saturated `bg-*-900` hue or pure vivid backgrounds (E-07).
- Figma exports/screenshots: convert to greyscale and check whether error/success/selected states are still distinguishable (E-10).

## Restyle defaults
- Palette = one primary hue (+ optional accent) + neutrals + red/green/amber status tokens; assign roles before restyling (E-02, E-04, E-11).
- Primary only on CTAs, links, active states; everything else neutral (E-03).
- Page background white/off-white/light grey/beige; saturated fills only in hero/header/splash bands (E-05, E-06).
- Semantic tokens (e.g. `--bg`, `--surface`, `--text`, `--primary`, `--error`, `--success`) with light and dark values; honour `prefers-color-scheme` and offer a toggle (E-08).
- Dark theme: very dark navy/grey surfaces, light text, unchanged accents (E-07).
- Every status state: colour + icon + short message (e.g. red border + "!" icon + "Enter amount bigger than $1") (E-10).
- Status tokens in red/green/amber hue families, tuned by lightness/saturation to fit brand (E-11, E-12).
- Verify contrast of every colour pair; WCAG AA 4.5:1 for normal text (general practice, external to this skill's rules; see ux-hierarchy-clarity B-02/B-03).

## Pairs well with
- ux-hierarchy-clarity — primary/secondary button ranking, badge contrast, text over images.
- ux-typography — text colours, pure black/white avoidance, contrast of text.
- ux-depth-craft — tinted shadows, surfaces, polish.
- ux-ui-patterns — forms, validation, badges, buttons.
