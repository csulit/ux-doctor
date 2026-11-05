---
name: ux-layout-spacing
description: "Knowledge on alignment, whitespace, spacing scales, layout grids and breakpoints, card layout, visual balance and cross-component consistency (radii, buttons, icons, tokens). Use when auditing, reviewing or restyling UI for spacing, padding, margin, gap, alignment, grid, card height, border-radius, icon or button consistency, hard-coded values or emoji used as icons."
---

# UI Layout, Spacing & Consistency

Finds misaligned, cramped, off-scale or inconsistent UI and prescribes token-based fixes. Playbook rules A-21..A-28, B-01, B-13..B-23, C-02..C-15, H-05, H-06; core web rules W2-12 (grid breakpoints), W1-22 (semantic tokens), W5-10 and W5-13 (AI-look tells, `source: web`).

## How to use
Start from the Critical 20 (`../ux-doctor/references/critical.md`), then the top checks below. Open a rule only for a candidate finding: `node ../ux-doctor/scripts/rule.mjs B-15`, or `references/index.md` → `references/rules.md`. Only `check` rules become findings.

## Top checks
- B-15 / B-16 (p.28-29) — margin, padding or gap off the project's base-unit scale (typical offenders 7, 19, 21, 31px), or the same relationship spaced differently → snap to the scale; one value per relationship.
- B-13 (p.25-26) — rows and groups run together, dividers with no margin → more row padding; gaps between groups larger than inside them.
- C-07 / C-09 (p.38-41) — one component role (title, button, input) styled differently across screens; more than one primary fill, or equivalent alternatives (sign-in providers, payment methods) styled differently → one shared component and button scheme.
- C-08 / C-14 (p.39, p.45) — mixed radii (sharp beside fully rounded); mixed icon sets, strokes or fill styles → one radius scale and one icon set (filled only for a selected state, C-15).
- A-21 / A-23 / B-01 (p.17-20) — siblings mixing centred and left text, body and button off the title's left edge, list items at different x or width → one alignment strategy per component, shared edges.
- A-24 / A-25 (p.18) — centred or right-aligned paragraphs; numeric columns not right-aligned → left-align text, right-align numbers with tabular figures.
- C-11 / C-13 / H-05 (p.43-44, p.130) — 3+ cards of different heights or CTAs at different y; forms and CTAs stretched across wide screens → equal-height cards with pinned CTAs; a bounded form card.

## Code signals
- Off-scale spacing: `grep -nE '\b(p|m|gap|space-[xy])[trblxy]?-\[[0-9]+px\]'`; CSS `(margin|padding|gap)[^;]*\b(7|19|21|31)px` (B-15).
- Hard-coded hex and px instead of tokens across components (W1-22).
- `text-center` on some children and none on siblings; `text-center|text-right` on paragraphs; numeric `<td>` without `text-right` (B-01, A-24, A-25).
- Icon floated beside a multi-line paragraph, indenting body and button (A-21).
- `rounded-none` next to `rounded-full` siblings; more radii than the scale (C-08).
- Background colours of `.btn`/`<Button>` per screen; fills derived from card images (C-09).
- Card grids without `items-stretch`/`h-full`; CTA without `mt-auto` (C-11, C-13); `w-full` inputs with no `max-w-*` wrapper on desktop (H-05).
- Several icon libraries imported, mixed `fill=`/`stroke=`/`strokeWidth`; emoji as list or feature icons (C-14, W5-10).
- Grids with no breakpoint collapse (`grid-cols-3` with no `sm:`/`md:` variants) (W2-12).
- Screenshots: overlay a column grid; check shared left edges, equal gaps for equal relationships, ragged card bottoms, CTA baselines.

## Restyle
Values (spacing scale, form gaps, grid, radius): `../ux-doctor/references/defaults.md`. Specific to this skill:
- Auto-layout/flex with fixed gap and padding tokens (playbook example: gap 24, padding 32, from visual) (B-01).
- Images in a same-size uniform container, same offset from the card top (C-10).
- Card: `flex flex-col h-full`, CTA wrapper `mt-auto`; trim team-written copy to equal line counts (C-11, C-12, C-13).
- Form on wide screens: a narrow centred card (white fill, radius, soft shadow); `max-w-sm`–`max-w-md` is general practice (H-05, H-06).
- Visual product cards: single column, large image, then title, description, price, CTA (B-19, B-21).
