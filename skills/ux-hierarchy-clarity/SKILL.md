---
name: ux-hierarchy-clarity
description: "Knowledge on visual hierarchy, proximity, clarity, contrast, simplicity and visual cues, plus the hero and AI-look tells that blur them. Use when auditing, reviewing or restyling screens for button ranking, primary/secondary/tertiary actions, duplicate CTAs, badge contrast, text over images, clutter, label spacing, icon-only controls, misleading copy or a generic-looking landing hero."
---

# UX Hierarchy, Clarity & Contrast

Decides what stands out, what recedes and what goes. Playbook rule groups A (hierarchy, proximity, clarity), B-02..B-11 (contrast, simplicity) and C-17/C-18/D-01 (visual cues); core web rules W3-17, W2-75 (one accent, one hero CTA) and the AI-look tells W1-80, W1-82..W1-84, W5-01, W5-02, W5-11, W5-14 (`source: web`).

## How to use
Start from the Critical 20 (`../ux-doctor/references/critical.md`), then the top checks below. Open a rule only for a candidate finding: `node ../ux-doctor/scripts/rule.mjs A-07`, or `references/index.md` → `references/rules.md`. Only `check` rules become findings.

## Top checks
- A-07 (p.8) — more than one filled saturated button in one action group, buttons that differ only in hue, or row actions styled as primaries → one filled primary, a neutral secondary, a text-link tertiary (red underlined text for repeated destructive row actions). A main action rendered as a text link is also a miss.
- A-05 (p.7) — the same CTA filled twice in one viewport, header included → one copy; when `cta-scan` flags `DUP_IN_VIEWPORT`, follow `../ux-doctor/references/duplicate-cta.md` (the same-destination test).
- A-12 / A-09 (p.9-11) — heading lighter than its body, or meta (quantity, SKU, date) as large or dark as the name → heading darkest, body grey, meta smaller and lighter.
- A-15 / A-16 (p.13) — label→field gap not clearly smaller than the gap between field groups (e.g. 28/28) → ~12px label→field, ~32px between groups.
- A-18 / A-20 (p.14, p.16) — icon-only controls without a visible label or `aria-label`; copy and control state that contradict each other → add labels; positive wording where checked = acted on.
- B-03 / B-09 (p.21-22) — badge text below 4.5:1 (white on a saturated fill); text on a photo with no scrim → tint background with dark same-hue text; bottom-to-top gradient or blurred panel.
- W5-01 (web) — AI-look tells: run `../ux-doctor/scripts/slop-scan.mjs`; 3+ confirmed tells = one grouped finding, fewer = a `(general practice)` note; never claim AI made the page. Hero tells W1-80..W1-84 and W5-04 are scored on their own rules.

## Code signals
- Several filled variants (`bg-*-600`, `btn-primary`, `variant="default"`) as siblings in one container; count filled buttons per group (A-07). Header and hero are one viewport: count per viewport, not per file (A-05).
- Row-level actions rendered as full `<Button>` in a `.map` instead of `variant="link"`/`ghost` (A-07).
- `text-gray-400|500` on `h1-h4` next to `text-gray-800|900` on `p` (A-12); KPI label class ≥ value class (A-11).
- `label { margin-bottom }` ≈ field-group gap; uniform `gap-*`/`space-y-*` in forms (A-15, A-16).
- `<button>` containing only `<svg>`/`<Icon/>` with no text and no `aria-label`; `role="switch"` without a label (A-18).
- `text-white` with `bg-green-500|orange-400|red-400` in chip or badge components (B-03).
- Text absolutely positioned over `<img>`/`background-image` with no `bg-gradient-to-t`, `from-black/*` or `backdrop-blur` layer (B-09).
- Copy: `/unselect|uncheck .* to (keep|remove)/i`; `defaultChecked` contradicting the label (A-20).
- Hero: adjective-only headline, two equal filled CTAs, "trusted by" logo strip with no specifics, icon-in-circle feature rows (W1-80..W1-84).

## Restyle
Values (spacing, contrast, text colours): `../ux-doctor/references/defaults.md`. Specific to this skill:
- Button ranks: brand-coloured solid primary, neutral grey secondary of the same size, underlined text tertiary (A-07); a marketing hero may use a text-link secondary (W1-82).
- Metric cards: small muted label, large bold value (~2× the label, from visual), formatted figures `2,121` (A-11).
- Status badge: `*-100` background with `*-700/800` text of the same hue, re-measured ≥ 4.5:1 (B-03).
- Row thumbnails ≈ 40px so text carries the row (A-08, from visual); sender photo or logo, coloured initials only as fallback (D-01, C-18).
