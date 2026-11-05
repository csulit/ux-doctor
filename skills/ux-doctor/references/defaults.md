# Defaults: one value per property

Hand-written. The single place for the numbers ux-doctor builds, restyles and judges with. **Project tokens come first**: use the project's value whenever it has one, and this table only where it has none. A project value that passes every **hard floor** is at most `advisory`, even when it differs from the target.

- **Hard floor**: below it is a finding (and a blocker on primary content where `../SKILL.md` says so). These are the only "hard thresholds" the other files mean.
- **Target**: the value to build or restyle with when the project has none.
- Values marked *(general practice)* or *(inference)* are not stated by the playbook; `web` values come from the web layer.

## Text

| Property | Hard floor | Target | Rules |
|---|---|---|---|
| Text contrast, normal text | 4.5:1 | ≥ 4.5:1 on every surface and theme; measure with `scripts/contrast.mjs` | F-09 (B-03 badges, F-12 button labels) |
| Text contrast, large text (≥ 24px, or ≥ 18.66px bold) | 3:1 | ≥ 4.5:1 where it costs nothing | F-09 |
| Main text size | 12px | 16px body; 13–14px only in dense data/tool UIs (web) | F-06, W3-30 |
| Body line-height | — | 1.5–1.6 | F-07 |
| Heading line-height | must be below the paragraph line-height | ~1.3 at 36px, 1.2–1.3 at mid sizes, 1.0–1.15 for display type *(inference)* | F-08 |
| Line length | 45–75 real characters per line on desktop, 30–40 on mobile | ~65 on desktop; `ch` is the width of `0`, so measure real characters or use ~30–36em | E-22, E-23 |
| Font families | at most 2 | 1 proven sans (Inter or similar); a second family only split by role (headings vs body) | E-19, E-17, E-21 |
| Weights | no weight below 400 for body or small text | headings 500–700, body 400 | E-33, F-03 |
| Text colour, light theme | no `#000000` text on white | heading `#1A1A1A`, body `#4E4E4E` | E-31 |
| Text colour, dark theme | no `#FFFFFF` text on dark | heading `#F2F2F2`, body `#CACACA` | E-31 |
| Type scale | sizes outside the project scale | one fixed scale, e.g. 12 / 14 / 16 / 20 / 24 / 32 / 40 *(general practice)* | W1-24 |

## Space, layout and shape

| Property | Hard floor | Target | Rules |
|---|---|---|---|
| Spacing scale | values off the project scale (e.g. 7, 19, 31px) | base unit 4: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 (multiples of 2 or 6 are also valid bases) | B-15 |
| Form grouping | label→field gap equal to the gap between groups | ~12px label→field, ~32px between field groups | A-16, A-15 |
| Grid | — | 12 columns on desktop, collapsing 12 → 6 → 4 → 1 | A-27, W2-12 |
| Corner radius | more than one unrelated radius language | one scale 4 / 8 / 12 / 16 / 24, larger surfaces take larger radii; nested radius = outer − padding | C-08, W1-11, W1-09 |
| Card sets | — | 3+ cards in a row share one height, CTAs pinned to the bottom | C-11, C-13 |

## Colour and depth

| Property | Hard floor | Target | Rules |
|---|---|---|---|
| Page background | — | neutral (white, off-white, light grey, beige); dark surfaces not pure black, lighter as they rise | E-05, W1-15, W1-16 |
| Primary colour | — | on interactive elements and active states only; one filled primary per action group and per viewport (header included) | E-03, A-07 |
| Status colours | colour as the only signal | red = error, green = success, amber = warning, always with an icon or label | E-11, E-10 |
| Shadows | — | soft and diffuse (e.g. `0 12px 48px` at low alpha), tinted to a coloured background, 3 named tiers (sm / md / lg) | D-05, D-06, D-08, D-09 |
| Borders | — | 1px, light neutral; only where colour alone doesn't separate | D-14, B-07 |
| Layering | — | light grey page with white cards, or thin outlines, instead of an all-white flat page | D-11, D-12 |

## Interaction

| Property | Hard floor | Target | Rules |
|---|---|---|---|
| Touch target | 24px (WCAG 2.2 AA) | 44px for every target; 48px for dropdown and form-control triggers (web) | W2-83, W1-59 |
| Focus ring | removed without replacement; ring below 3:1 | `:focus-visible` ring 2px with a 2px offset, ≥ 3:1 in both themes (web) | W2-47, W2-23 |
| Press feedback | — | ≤ 100ms (web) | W1-03 |
| Loading | — | nothing under ~300ms, then a skeleton or progress; aim for the result within ~400ms (web) | W2-62, W1-96 |
| Motion | animation that ignores `prefers-reduced-motion` *(general practice)* | press ≤ 100ms, dropdowns ~150ms, entrances 200–300ms ease-out, exits faster than entrances (web) | W1-01, W1-02, W1-08 |
| Mobile actions | — | primary actions and navigation in the thumb zone: bottom bar, bottom-anchored CTA, 3–5 bottom tabs | H-09 |
