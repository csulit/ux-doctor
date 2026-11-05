---
name: ux-color
description: "Knowledge on colour use — brand/primary colour restraint, palette balance, neutral vs coloured backgrounds, dark-mode surfaces and status colours (error/success/warning). Use when auditing, reviewing or restyling palettes, tokens, themes, backgrounds, form validation states, colour-only indicators or decorative gradient blobs."
---

# UX Colour

Decides where colour goes, how much, and what it means. Playbook rules E-02..E-12; core web rules W1-15, W1-16 (dark surfaces), W1-81 and W5-12 (AI-look colour tells, `source: web`).

## How to use
Start from the Critical 20 (`../ux-doctor/references/critical.md`), then the top checks below. Open a rule only for a candidate finding: `node ../ux-doctor/scripts/rule.mjs E-03`, or `references/index.md` → `references/rules.md`. Only `check` rules become findings.

## Top checks
- E-10 (p.70) — error, success or warning shown only by border or background colour → add a status icon and a short message; states stay distinguishable in greyscale.
- E-11 / E-12 (p.71) — off-convention status colours (amber error, pink or blue success, brand-coloured status) → red = error, green = success, amber = warning; fit the brand by tone, never by hue.
- E-03 (p.66-67) — brand colour on non-clickable things (headings, icon tiles, section titles, decorative blocks) → brand colour on CTAs, links and active states; the rest neutral.
- E-05 / E-06 (p.67-69) — saturated page or content-area background (high chroma at light or mid lightness; very dark navy or grey surfaces are fine, E-07) → white, off-white, light grey or beige; colour bands only in hero, header or splash.
- E-04 (p.67) — many competing hues, or hues without a role → one primary hue (+ optional accent) + neutrals + status colours; data viz excluded.
- W1-15 / W1-16 (web) — dark theme on pure `#000`, or elevated surfaces darker than the page → dark grey base, lighter surfaces as they rise.
- W1-81 / W5-12 (web) — decorative blur blobs or an untouched framework palette nobody chose → one accent, neutral background; count as tells under W5-01 (one glow behind the hero is fine).

## Code signals
- `text-primary|text-brand-*` on `h1-h6`, section titles or static icons; `bg-primary` on cards that aren't clickable (E-03).
- Unique hue count: `grep -ohE '(bg|text|border)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+'` (E-04).
- `body|html|main` with `bg-<hue>-[3-6]00` or a saturated hex; gradient page backgrounds (E-05, E-06).
- `.error|[aria-invalid]` styles that change only `border-color`/`background` with no icon or message sibling (E-10).
- `--color-error` / `--color-success` hues outside the red/green families (E-11, E-12).
- Dark theme: `bg-black`/`#000` surfaces; cards darker than the page (W1-15, W1-16).
- `blur-3xl rounded-full` blobs, `from-purple-* via-* to-*` heroes (W1-81).
- Screenshots: view in greyscale; error, success and selected states must still be distinguishable (E-10).

## Restyle
Values (backgrounds, status colours, text colours): `../ux-doctor/references/defaults.md`. Specific to this skill:
- Assign colour roles first (brand, action, status, neutral), then tokens with light and dark values (`--bg`, `--surface`, `--text`, `--primary`, `--error`, `--success`) (E-02, E-04).
- Dark theme: same accents and hierarchy as light; desaturate accents slightly if they glare (E-07, W1-17).
- Every status state: colour + icon + short message (E-10).
