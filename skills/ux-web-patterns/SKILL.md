---
name: ux-web-patterns
description: "Secondary, web-sourced knowledge (239 paraphrased tips from public UX pattern pages, W-IDs): UI states (loading, empty, error, field states), motion timing, focus and keyboard access, touch targets, dark mode, design tokens, overlays, tables, charts, navigation, and the tells of an AI-made landing page. Use when auditing, reviewing or restyling modern product UI or when a playbook skill has no rule for the case."
---

# UX web patterns (secondary source)

Paraphrased tips from public UX pattern pages (each rule is tagged with its topic slug, cited as `web:<slug>`). **Not part of the PDF playbook** and not rated by it: when a W-rule and a playbook rule (A-… to H-…) disagree, the playbook wins; label W-findings `source: web` in reports. Numbers (ms, px, ratios) are the source's, not WCAG-normative unless it says so.

## How to use
Read `references/index.md` (ID | rule | pattern slug | severity | tags), pick the pattern slugs below that match what you see, then open only those entries in `references/rules.md` (`grep -n '^### W1-33' references/rules.md`). Cite the W-ID and slug in every finding.

## Route by topic (pattern slug → entries)
- **States & feedback**: loading-states-system, skeleton-loading, skeleton-measure (W4-01, W4-02), doherty-threshold (W1-96, W1-97), empty-states, error-states (W2-57, W2-58), toast-notifications, notification-system (W2-65), optimistic-ui (W2-64), undo-ux, destructive-actions (W1-91..W1-93), autosave-ux (W1-33), behind-the-button (W1-37, W1-38)
- **Forms & inputs**: behind-the-button (W1-37), form-field-states (W2-21..W2-26), form-validation-timing (W2-27), disabled-buttons (W1-94), password-field-ux, otp-input (W2-32), input-masking, date-pickers, file-upload-ux, filter-chips, range-sliders, toggle-anatomy, star-rating, color-picker-ux, inline-editing, settings-system (W3-42)
- **Access & touch**: focus-states (W2-47, W2-51), color-accessibility (W1-12..W1-14), hover-trap (W2-81, W2-83), dropdown-design (W1-61), accordion-disclosure (W1-85)
- **Motion**: animation-timing, easing-curves, scroll-driven-animations, css-has-selector
- **System & tokens**: design-tokens, design-system-kit, border-radius, dark-mode, grid-system (W2-12), icon-design-rules, gradient-design, z-index-mastery
- **Surfaces & depth**: depth-layers, shadow-elevation, perfect-card, card-hover-anatomy, reverse-engineered-linear (density/depth/one-accent recipe)
- **Overlays & navigation**: modal-hierarchy, bottom-sheets, tooltip-design, context-menu, command-palette, navigation-patterns (W2-71, W2-72), tabs-system, stepper-wizard, pagination, search-experience-system
- **Data**: data-table (W1-72), charts-that-lie (W1-65), bulk-actions, drag-and-drop, swipe-actions, live-cursors
- **Landing / AI-look tells**: de-ai-landing-hero (W1-80..W1-84), landing-page-skeleton (W2-75), microcopy
- **Perception heuristics**: gestalt-laws, proximity-rule, visual-hierarchy (W3-17), von-restorff, serial-position, peak-end-rule, zeigarnik-effect, golden-ratio

## Top checks (all W-rules; severity from the index)
- W1-94 — submit/CTA is `disabled` with no explanation → keep it enabled, validate on click, mark and focus the first blocking field.
- W2-21..W2-24 — field lacks any of the six states the source names (default, focus, error, success, disabled, loading), label is a placeholder, focus ring < 3:1, error by colour alone → add the states, outside label, icon + message.
- W2-47 — `outline: none` / `outline-0` without a replacement focus style → restore a visible `:focus-visible` ring.
- W2-81, W2-83 — primary action revealed only on `:hover`; tap target ≈ icon size → move it to touch, pad to 44px (icon ≈ 20px); W2-82: gate hover styles with `@media (hover: hover)`.
- W1-96, W1-97 — an action gives no visible response within 400ms → skeleton/progress/optimistic update where safe.
- W2-57 (error surface matches severity), W2-58 (every error has a way out), W2-64 (no optimistic UI on payments/irreversible actions).
- W1-80..W1-84 — AI-made landing tells: adjective-only headline, purple gradient blob, two equal CTAs, unverifiable "trusted by" claim, icon-in-circle one-word feature row → name the product/outcome, one accent, one primary + text link, one specific quote, product screenshot with annotations.
- W4-01, W4-02 — skeleton loader whose sizes/positions were guessed, or whose swap with real content shifts the layout → measure the loaded UI in a browser (`getBoundingClientRect()` per block), copy sizes, gaps, radius and line counts into the skeleton, reserve media space (`aspect-ratio`/dimensions), and re-measure until nothing moves.
- W2-71, W2-72 — primary navigation hidden behind a hamburger on desktop.
- W3-17, W3-19 — more than one filled primary-style button or emphasised element per view, header included (e.g. the same "Talk to us" filled in the sticky header and in the hero) → keep one accent/emphasis per view; for a duplicate CTA (same normalised label AND destination): give the hero CTA a different job (specific next step) or hide the header copy until the hero CTA scrolls out; making one copy outline-only only lowers major to minor and is not a fix. W2-77 licenses a closing repeat only (top vs bottom of the page), never two copies inside one viewport.
- W1-65, W1-72 — bar chart y-axis not starting at zero; numeric table columns not right-aligned with tabular figures.
- W1-12..W1-14 — decorative muted greys failing contrast; colour-only cues.

## Conflicts
- **W vs playbook**: the playbook wins. Entries carry an explicit "see <ID>" where they are known to differ (e.g. golden-ratio spacing W2-08 vs base-unit multiples B-15/B-17; dialog action order W1-92 vs G-12; tight dark shadow W3-25 vs D-05; 13px dense text W3-30 vs F-06 — valid only for dense tool UIs).
- **W vs W**: prefer the more specific/safer rule and say so in the finding. Known pairs: submit/Next buttons (W1-94 keep enabled, validate on click; also W3-11) → W1-94 wins; card hover (W3-26 lift) vs W1-77 → never scale the card container, use translate + shadow; springs (W2-02 allows one restrained spring on presses/modals; W1-05 keeps long bouncy motion for attention moments) → both hold; skeleton timing (W1-97 vs W2-62) → no loader under ≈300ms, skeleton beyond.

## Code signals
`disabled` / `aria-disabled` on submit buttons; `outline:\s*none|outline-none|focus:outline-none` without `focus-visible:ring`; `:hover` blocks without `@media (hover: hover)`; `transition` durations far above the pattern's range (the rules allow ≈200–300ms for entrances, up to ≈500ms for complex transitions and longer only for attention moments — check the specific rule) or visible multi-bounce oscillation (a single low-bounce spring is allowed, W2-02); missing `loading`/`empty`/`error` branches in data components (`isLoading`, `isError`, `data.length === 0`); `placeholder=` used with no `<label>`; hard-coded hex/px instead of tokens; `bg-black` / `#000` dark surfaces; `from-purple-* via-* to-*` gradient heroes; two same-size `<Button>`s side by side.

## Restyle defaults
Order: project tokens → playbook values (e.g. 4/8 spacing base, 16px body, soft shadows) → W-rule values, only where the playbook is silent (labelled per rule): entrances 200–300ms ease-out, tap feedback < 100ms, 4px spacing scale, radius scale 4/8/12/16/24, touch targets 44px, dark surfaces lighter-for-elevated rather than pure black. Mark everything taken from this skill `(web pattern)`.

## Pairs well with
`ux-ui-patterns`, `ux-interaction-cost`, `ux-color`, `ux-depth-craft`.
