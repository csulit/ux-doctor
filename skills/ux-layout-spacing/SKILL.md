---
name: ux-layout-spacing
description: "Knowledge on alignment, whitespace, spacing scales, layout grids, card layout, visual balance and cross-component consistency (radii, buttons, icons). Use when auditing, reviewing or restyling UI for spacing, padding, margin, gap, alignment, grid, card height, border-radius, icon or button consistency."
---

# UI Layout, Spacing & Consistency

Covers alignment (A-21..A-28, B-01), whitespace and spacing systems (B-13..B-17), layout (B-18..B-23), balance (C-02..C-06), consistency (C-07..C-16) and wide-screen form containment (H-05, H-06).
Use it to find misaligned, cramped, off-scale or inconsistent UI and to prescribe token-based fixes.

## How to use
- Read `references/index.md` first; open `references/rules.md` only for the rule IDs relevant to the current finding (search by ID, e.g. `grep -n '^### B-15' references/rules.md`).
- Cite rule IDs and pages in every finding (e.g. "B-15, p.28").
- Measure before judging: extract spacing values, bounding boxes, radii, button fills; report the number, not an impression.

## Top checks
- B-15 — any margin/padding/gap off the project's own base-unit scale (playbook accepts multiples of 2, 4 or 6; e.g. 4/8/16/24/32) → snap to nearest scale token; reuse one value per relationship. (high, p.28)
- B-17 — arbitrary values such as 7, 19, 21, 31px → round (19→16/20/24, 31→32, 7→8). (p.29)
- B-16 — gap inside a group must be smaller than gap between groups, same value everywhere (e.g. label→input 8, between fields 24, between sections 40) → define intra-group / between-field / between-section tokens. (p.29)
- B-13 — nav/list rows and groups run together, dividers with ~no margin → raise row height/padding; make group gaps larger than in-group gaps. (high, p.25-26)
- B-14 — rows <~8px apart (inference; the playbook gives no px threshold), tooltip colliding with title, button touching content (or the opposite: huge disconnecting gaps) → start generous, step down the scale until groups are clear. (p.26-27)
- C-07 — same component role (title, button, input) differs in size/radius/colour/padding across screens → consolidate to one shared component/token; vary only content/imagery. (high, p.38)
- C-09 — more than 1 primary-button fill per screen (e.g. buttons tinted per card image) → one primary + one secondary style everywhere (playbook: dark fill main, light grey secondary). (high, p.40-41)
- C-08 — mixed radii (0 beside rounded-full, round images + square buttons) → one radius family via tokens for cards, buttons, media, avatars. (p.39)
- B-01 / A-22 / A-23 — siblings mix `text-center` and left, body/button not on title/icon left edge, list items with different x/width → one alignment strategy per component; icon+title header row, body/button on the common left edge; identical x/width for list items. (p.17-18, p.20)
- A-24 / A-25 / A-26 — centred or right-aligned paragraphs; left/centred numeric columns; long centred copy → left-align body and lists; right-align numbers (and RTL); centre only short titles/CTAs. (p.18)
- C-11 / C-13 — 3+ cards with different heights or CTAs at different y → stretch to equal height, flex column, CTA wrapper `mt-auto`. (C-11 p.43; C-13 p.44)
- C-05 / C-02 — hero image or full-width tall CTA dominates a content card while body text is tiny → shrink image, content-width compact pill CTA, enlarge the description/rating text while keeping the heading modest (about the same size). (p.36-37)
- H-05 / H-06 — inputs/CTAs spanning near-full width at ≥1440px → put form in a bounded centred card with generous side whitespace. (p.130-131)
- C-14 / C-16 — mixed outline/filled icons, stroke widths, sizes or libraries on one screen → one icon set and style; mixing only for state (C-15, filled = selected tab). (p.45-46)
- B-21 — card order not image → name → description → price → CTA (price above image, description after CTA) → reorder. (p.32)

## Code signals
- Off-scale spacing: `grep -nE '\b(p|m|gap|space-[xy])[trblxy]?-\[[0-9]+px\]'`; CSS `(margin|padding|gap)[^;]*\b(7|19|21|31)px`; any px value off the project's own base-unit scale, e.g. not a multiple of 2, 4 or 6 (B-15, B-17).
- Positioning hacks instead of flex/grid: `position:\s*absolute` with manual `top/left`, stacked `margin-top` nudges, `relative top-[..]` (A-28).
- Mixed alignment inside one container: `text-center` on some children and `text-left` or none on siblings; stray `items-center` on single children (B-01, A-26).
- Paragraph/list with `text-center`/`text-right`; numeric `<td>`/columns without `text-right` (A-24, A-25).
- Icon floated beside multi-line paragraph (`float-left`, flex row with icon + text block holding body and button) → indented body (A-22).
- Radius spread: collect `rounded-*`, `border-radius` values; more than the token scale, or `rounded-none`/`0` next to `rounded-full` siblings (C-08).
- Button fills: collect background colours of `.btn`/`<Button>` per screen; >1 primary fill, or fill derived from card/image colour (C-09).
- Card grids lacking `items-stretch`/`h-full`/equal grid rows; card without `flex flex-col` and CTA without `mt-auto` (C-11, C-13).
- Inputs/buttons `w-full` or `width:100%` with no `max-w-*`/`max-width` wrapper at desktop (H-05); form not inside a card (bg + radius + shadow) (H-06).
- Multiple icon imports (`lucide-react` + `react-icons` + `@heroicons`), mixed `fill=`/`stroke=`, different `size`/`strokeWidth` props (C-14, C-16).
- Figma exports: spacing not bound to tokens/variables, no auto-layout, no layout grid (A-27, A-28, B-15).
- Screenshots: overlay a column grid; check shared left edges, equal gaps for equal relationships, ragged card bottoms, CTA baselines.

## Restyle defaults
- Spacing scale on base 4 (playbook example; 2 or 6 bases also fine): 4, 8, 16, 24, 32, 40 (B-15). Tokens: related/intra-group 8, between fields 24, between sections 40, title→subtitle 16, subtitle→first field 40, checkbox→button 40 (B-15, B-16; values from the playbook's form visual).
- Auto-layout/flex with fixed gap and padding tokens; playbook example: gap 24, padding 32 (B-01, from visual).
- Layout grid: define columns, margin, gutter once and snap components to it (A-27; example: 3 columns, margin 79, gutter 70).
- Alignment: left for text-heavy UI, applied to all siblings; right for numeric columns incl. headers (B-01, A-24, A-25).
- Radius tokens per role (card, button, media), one shape family (C-08). One primary + one secondary button style (C-09).
- Images in a same-size uniform container (e.g. tinted circle), same offset from card top (C-10).
- Card: `flex flex-col h-full`, CTA wrapper `mt-auto`; grid stretches equal height; trim copy to same line count where possible (C-11, C-12, C-13).
- Form: narrow centred card (white fill, radius, soft shadow) on tinted page; card ≈ a third of page width at 1440px per the playbook visual (H-05, H-06). No px max stated in playbook; `max-w-sm`–`max-w-md` (~384–448px) is (general practice).
- Product/visual cards: single column, large image, then title, description, price, CTA; no divider lines, use spacing (B-19, B-21).
- Accent colour on the CTA only; light neutral/complementary tints for large surfaces (C-06, C-03).
- Icons: one outline set, one size and stroke; filled variant only for the active tab (C-14, C-15).
- Option lists with structured data (name, quantity, price) → selectable cards with distinct selected state (B-22).

## Pairs well with
- `ux-hierarchy-clarity` — proximity grouping, dominant element, card priority.
- `ux-depth-craft` — card/form shadows, borders, radius feel.
- `ux-typography` — alignment of text, line length, type-size consistency.
- `ux-color` — single-colour overuse, button colour scheme.
- `ux-ui-patterns` — forms, cards, nav and tab-bar patterns.
- `ux-interaction-cost` — form layout, CTA proximity, step count.
