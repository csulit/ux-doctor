---
name: ux-hierarchy-clarity
description: "Playbook knowledge on visual hierarchy, proximity, clarity, contrast, simplicity and visual cues. Use when auditing, reviewing or restyling screens for button ranking, primary/secondary/tertiary actions, badge contrast, text over images, clutter, label spacing, icon-only controls or misleading copy."
---

# UX Hierarchy, Clarity & Contrast

Covers rule groups A (hierarchy, proximity, clarity), B-02..B-12 (contrast, simplicity) and C-17/C-18/D-01 (visual cues).
Use it to decide what should stand out, what should recede, and what to remove.

## How to use
Read references/index.md first; open references/rules.md only for the rule IDs relevant to the current finding (search by ID, e.g. `grep -n '^### A-07' references/rules.md`). Cite rule IDs and pages in every finding.

## Top checks
- A-05 (p.7) — per decision group AND per viewport (the global header/nav counts as part of the first viewport, sticky or not; inference): more than one equal-size, equal-colour filled button, the same CTA filled twice in one viewport, or row-level actions styled like primary CTAs → assign one primary, one secondary, one tertiary style.
- (general practice) same-destination test — same CTA twice in one viewport: ≥ 2 controls with the same normalised label AND destination visible together in the first viewport at 1440x900 or 390x844 (header included) → major if ≥ 2 are filled/primary, minor if only one is.
  - Exempt: repeats outside the first viewport (closing CTA, footer; W2-77 licenses only that), copies inside a collapsed mobile menu, nav/text links to the same page with a different label.
  - Fix, in order: (1) give the hero CTA a different job (a specific next step), header CTA stays in place, then rank the two per A-05 (one filled); (2) hide the header copy until the hero CTA scrolls out. Making one copy outline-only only lowers major to minor and is not a fix.
  - Deleting the header CTA is never a resolution: the destination must stay reachable at every scroll state — from the hero CTA at the top, and from the header (or, on mobile, a bottom-anchored CTA per the H-09 row in rule-tensions) once the hero CTA has scrolled out (persistent conversion route).
  - Every fix states its end state per scroll state: `at top: …; after the hero scrolls out: …`.
  - For (2) the header at the top must still look complete: no empty slot or reserved gap, no lone-icon cluster, nav links don't shift when the CTA appears (give the nav its own grid column so the right-hand cluster can grow without moving it; never hold the CTA's width as empty space), and the reveal honours `prefers-reduced-motion`.
  - A fix that hides, removes or moves a control is not done until the vacated region has been viewed at both scroll states (top, and after the hero scrolls out) × 1440x900 and 390x844 × light and dark (where there is a theme toggle), with no new balance or alignment problem (C-02, A-21). `cta-scan` cannot scroll, so re-running it at the top cannot see this: use a browser tool to scroll past the hero CTA, then screenshot; without one, label the claim `not visually verified (scrolled state)` and never mark it fixed on that basis.
  - Related: A-07, W1-82, W3-17, W3-19.
- A-06 (p.8) — buttons differ only in hue (red/blue/green) with same size/fill → colour does not rank; keep one saturated CTA, neutralise the rest.
- A-07 (p.8) — per action group: exactly one filled saturated button; secondary = grey fill/outline, same size OK; repeated/destructive row actions = small underlined red text link.
- A-10 (p.10) — name the top 1-3 items per screen; visual weight order must match → rank 1 gets largest/darkest/most contrasted treatment.
- A-11 (p.10) — metric card value font-size must exceed label; good example roughly 2x+ (from visual; label ~12px muted, value large bold); format 2,121 not 2121.
- A-12 (p.11) — heading must be at least as dark/contrasty as body (light theme); grey title over black body → heading text-primary, body text-secondary.
- A-09 (p.9) — meta (quantity, SKU, date) with size ≥ name or darker than name → meta smaller + lighter, name darkest.
- A-14 (p.12) — card/detail view with many identical label:value rows (playbook example has 8; the ≥5 cut-off is an inference) → price largest+bold, status as pill badge, specs as one icon+value row with dividers.
- A-15/A-16 (p.13) — label→field gap must be clearly smaller than previous-field→next-label gap (equal gaps, e.g. 28/28, or an inter-group gap not clearly larger than the intra-group gap = violation; playbook good example 12/32) → ~12px label→field, ~32px between groups (from the p.13 example).
- A-18 (p.14) — icon-only tiles/toggles/nav without visible label or aria-label; on/off not distinguishable → add text label, green on / grey off.
- A-19 (p.15) — screen packed with competing actions, one accent colour on everything, tiny text (no numeric threshold in playbook) → cut to key metrics/actions, progressive disclosure, accent only for active/selected.
- A-20 (p.16) — checkbox state contradicts the copy ("Unselect items you want to remove") → positive wording; checked = the item that will be acted on.
- B-03 (p.21) — badge/chip text contrast: bad examples 2.84:1, 1.81:1, 1.92:1 (white on saturated fill); good 4.8, 4.94, 6.54:1 (dark same-hue text on pale tint) → tint bg + dark text, re-measure to ≥ 4.5:1 (WCAG AA threshold is external; the playbook only shows the ratios).
- B-09 (p.22) — text directly on a photo with no scrim/gradient/`backdrop-filter: blur()` → bottom-to-top dark gradient or blurred translucent panel; test with a light image.
- B-11/B-12 (p.23-24) — cart/list items with non-task metadata (views, sold counts, material, return notes) or oversized images → delete, shrink thumbnail, secondary attrs light grey + small, more gap between items.
- B-07 (p.22) — component fill ≈ parent fill with no border/shadow (white input on white card) → 1px subtle neutral border.

## Code signals
- Several `bg-*-600`/`btn-primary`/`variant="default"` buttons siblings in one container; `grep -rnE 'Button|btn' ` then count filled per group (A-05, A-07).
- Count CTAs per viewport, not per file: layout/header components render on every page, so a header CTA plus a hero CTA with the same normalised label AND destination is a duplicate even when each file has one (different labels to the same destination are only a note). Collect candidates by destination, then compare labels, e.g. `rg -n 'mailto:|href=.(/signup|/contact|/demo|/pricing)'`; prefer `../ux-doctor/scripts/cta-scan.mjs <url> --render` on the rendered page (same-destination test above).
- Row-level actions rendered as full `<Button>` (e.g. "Remove", "Delete" in a `.map`) instead of `variant="link"`/`ghost` (A-05, A-07).
- Uniform text: all text one `font-normal` or one `font-semibold`; adjacent type levels with near-identical `text-sm`/`text-base` (B-05, B-06).
- Heading colour lighter than body: `text-gray-400|500` on `h1-h4` next to `text-gray-800|900` on `p` (A-12).
- Metric/KPI cards where label class size ≥ value class size (`text-xl` label, `text-sm` value) (A-11).
- Spacing: `label { margin-bottom }` ≈ field-group gap; `space-y-*` equal to `mb-*` on labels; `gap-*` uniform in forms (A-15, A-16).
- Icon-only controls: `<button>` containing only `<svg>`/`<Icon/>` with no text and no `aria-label`; `role="switch"` without label (A-18).
- Badge classes: `text-white` with `bg-green-500|orange-400|red-400`; `bg-*-500 text-white` in chip/badge components (B-03).
- `<img>` or `background-image` with absolutely-positioned text and no `bg-gradient-to-t`, `from-black/*`, `backdrop-blur` overlay (B-09).
- Inputs/cards with `bg-white` on `bg-white` parent and no `border`/`shadow` (B-07, B-08).
- Copy regex: `/unselect|un-check|uncheck .* to (keep|remove)/i`; checkboxes with `defaultChecked` that contradict title text (A-20).
- Screenshots: count distinct interactive elements and filled buttons per viewport; look for list rows without leading avatar/icon when image data exists (C-18, D-01).

## Restyle defaults
- One primary = brand-coloured solid; secondary = neutral grey fill, same size; tertiary/destructive-in-row = underlined red text link (A-07).
- Heading near-black, body grey, meta smaller + lighter grey (A-09, A-12).
- Metric card: label small muted (~12px, from visual), value large bold high-contrast (~2x, from visual), trend small and coloured (A-11).
- Form: label margin-bottom ~12px (Tailwind `mb-3`), field groups ~32px apart (`space-y-8`) (A-16, values from the p.13 example; Tailwind classes are general practice).
- Status badge: `*-100` background + `*-700/800` text of same hue, re-measure ≥ 4.5:1 (B-03; 4.5:1 is WCAG AA, external).
- Text on image: bottom dark gradient scrim or `backdrop-blur` + semi-transparent dark layer (B-09).
- Weights by role: headings/values heavier, body/meta regular (B-05 gives no numbers; E-33 says heading 500-700, body 400).
- Thumbnail ≈ 40px in list rows so text carries the row (A-08, from visual); ~32px circular avatar in message rows (inference), initials only as fallback (D-01, C-18).
- Add visible text labels to icons; green on / grey off for toggles (A-18).
- Step/process sections: illustration or icon per step plus segmented progress indicator (C-17).
- Add missing subtle border (e.g. 1px neutral) or soft diffuse shadow to raised surfaces (B-07, B-08).

## Pairs well with
- ux-color — status colours, primary-colour restraint, neutral backgrounds.
- ux-typography — size/weight scale, body/heading contrast values.
- ux-layout-spacing — proximity, whitespace, grouping.
- ux-depth-craft — shadows, borders, polish.
- ux-ui-patterns — cards, badges, forms, lists.
- ux-interaction-cost — clutter and task-relevance.
