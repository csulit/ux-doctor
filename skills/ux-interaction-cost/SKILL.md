---
name: ux-interaction-cost
description: "Knowledge on interaction cost — the clicks, typing, scrolling, memory and time a UI demands — with Fitts's and Hick's Law, recognition over recall, autofill, dropdown-vs-visible options, steppers and one-click buy. Use when auditing, reviewing or restyling flows, forms, checkout or product pages for friction, step count or effort."
---

# Interaction Cost

Covers how to measure and reduce the mental, physical and time effort a user spends reaching a goal (F-20..F-34) and one-click ordering (G-01).
Use it to count effort in key flows, rank detours, and prescribe shorter paths.

## How to use
- Read `references/index.md` first; open `references/rules.md` only for the rule IDs relevant to the current finding (search by ID, e.g. `grep -n '^### F-31' references/rules.md`).
- Cite rule IDs and pages in every finding (e.g. "F-31, p.107-108").
- For each key task (checkout, signup, configure+buy) count clicks, keystrokes, scrolls, page loads, decisions and compare with the minimum possible (F-20). Classify each friction point as cognitive, physical or time (F-21).
- Prioritise highest-frequency tasks with highest effort; zero cost is unrealistic (F-23).

## Top checks
- F-20 — key task takes more clicks/keystrokes/scrolls/decisions than the shortest path → shorten the path, apply F-24..F-30. (high, p.98)
- F-31 — small option set (colour, size, plan) hidden in a `<select>`/nested menu → show inline as swatches, segmented control or radio chips. Playbook baseline: 2 clicks + scroll for colour, 2 more + scroll for quantity = 5 clicks, 1 scroll (plus a short mouse move) to add two red chairs; improved: a colour change = 1 click + short mouse move. (high, p.107-108) The "≈ ≤5-6 options" cut-off for "small set" is an (inference), not stated in the playbook.
- F-29 — avoidable steps, retyped saved data, no address lookup → merge/remove steps, `autocomplete` attributes, address typeahead, saved payment prefilled. (high, p.105)
- F-25 — many equal-weight options shown at once (nav items, cards, filters, menu entries) → curate a "Popular"/recommended subset, top N + "See all", disclose the rest progressively. (high, p.101)
- F-32 — colour/material/pattern choices as text only ("Green") → visual swatches with a ringed selected state. (p.108)
- F-33 — quantity as `<select>` or stepper without direct entry → − / editable number / + stepper. (p.108)
- F-34 — primary CTA far from the inputs it commits (far-right, detached) → place adjacent to the last input (right of or below the stepper). (p.108)
- F-24 — action distant from its subject, tiny hit area, or behind another screen → anchor controls next to/persistently with the target, enlarge hit area (Fitts's Law). (p.100)
- F-26 — wall of text or >~7 ungrouped items, no headings → chunk into groups of ≲7 (≈7±2 working memory), add headings, "Show more"/"Show all N". (p.101-102)
- F-28 — user must remember state from earlier screens/sessions, unlabeled or unconventional icons → "Continue/recent" shortcuts, visible progress, conventional labelled icons. (p.104)
- F-30 — per-item repeated work with no bulk select, duplicate, templates or remembered choices → add multi-select + bulk actions, defaults, copy/duplicate. (p.106)
- F-27 — auto-playing/animated banners, pop-ups on load, ads, competing visuals on task or reading screens → remove or defer; keep content and essential nav. (p.103)
- F-22 — long reading before action, long scroll to CTA, search needed, heavy typing, load waits, info to remember → cut copy, surface info, shorten forms, keep context visible. (p.99)
- G-01 — returning user cannot buy in one step → add a filled "Buy now" beside an outlined "Add to cart", backed by saved address and payment; which is primary is a deliberate business choice. (p.109)

## Code signals
- `<select` / `role="combobox"` / `Dropdown`/`Listbox` with few options for colour, size, quantity (F-31, F-33).
- `<select name="quantity"`, or `type="number"` without +/- buttons; stepper lacking an editable input (F-33).
- Form inputs missing `autocomplete` (`name`, `email`, `tel`, `street-address`, `postal-code`, `cc-number`, `cc-exp`, `cc-csc`); address as separate free-text fields with no lookup (F-29).
- Multi-page/wizard flows where steps contain one field or duplicate saved data; step count vs minimum (F-29).
- Submit/"Add to cart" button in a different container/column or `ml-auto`/`justify-end` far from the inputs (F-34).
- Small interactive elements: icon buttons with no padding, hit area visibly small (check rendered size) (F-24).
- Nav/menu/filter arrays with many same-weight entries; lists rendering full catalogue without curated sections or "See all" (F-25, F-26).
- `autoplay`, auto-rotating carousels, modal/newsletter pop-ups on mount (`useEffect` + `setTimeout` opening a dialog), cookie/promo banners stacked above task content (F-27).
- Icon-only buttons without `aria-label`/visible label; no "recent", "continue" or progress UI where users resume tasks (F-28).
- Tables/lists with per-row action buttons only, no checkbox column/bulk action bar (F-30).
- Product page: no one-step purchase CTA for signed-in users with stored data (G-01).
- Screenshots/flows: tally clicks, typing, scrolls, waits per task; record the count in the finding.

## Restyle defaults
- Inline swatches (ringed selected state) for colour/visual attributes; segmented control or chips for small option sets (F-31, F-32).
- Quantity stepper − / editable number / + (default 1), with "Add to cart" immediately right of it, below the swatches (F-33, F-34, G-01).
- Product CTA pair: outlined "Add to cart" + filled "Buy now", one filled primary per decision area (G-01).
- Curated carousels/sections with top N + "See all"; filters in a sidebar rather than dumping the list (F-25).
- Section headings and boxed chunks; truncate long text/lists with "Show more"/"Show all N"; sticky action card for the main CTA on long pages (F-26).
- Persistent anchored controls near their target (F-24).
- Autofill via `autocomplete`, address typeahead, pre-filled saved payment, merge or drop non-outcome steps (F-29).
- "Continue watching/recent" row with progress bars, labelled conventional icons (F-28).
- Multi-select with bulk actions, duplicate, templates, remembered previous choices (F-30).
- Strip pop-ups/banners/decorative visuals from focus pages; single narrow centred column for reading (F-27).
- Minimum hit-area size: 44×44px (iOS) / 48dp (Material) (general practice; the playbook gives no number).

## Pairs well with
- `ux-ui-patterns` — forms, checkout, product page, empty/error states.
- `ux-hierarchy-clarity` — primary vs secondary CTA, curated emphasis.
- `ux-layout-spacing` — CTA proximity, grouping/chunking, form layout.
- `ux-typography` — copy length, scannability.
- `ux-depth-craft` — button/selected-state affordance.
