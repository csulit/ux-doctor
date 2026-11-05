---
name: ux-interaction-cost
description: "Knowledge on interaction cost — the clicks, typing, scrolling, memory, reach and waiting a UI demands — with Fitts's and Hick's Law, recognition over recall, autofill, visible options, steppers, touch targets, hover-only actions, response time and motion that hides content. Use when auditing, reviewing or restyling flows, forms, checkout, product pages, navigation or mobile UI for friction, step count, reach or responsiveness."
---

# Interaction Cost

Counts the mental, physical and time effort a user spends reaching a goal, and prescribes shorter paths. Playbook rules F-20..F-33 and G-01; core web rules W1-03, W1-96, W1-97, W2-62 (response time), W2-81, W2-82, W2-83 (touch and hover), W2-72 (navigation), W2-64 (optimistic UI), W5-03, W5-04 (scroll motion, `source: web`).

## How to use
Start from the Critical 20 (`../ux-doctor/references/critical.md`), then the top checks below. Open a rule only for a candidate finding: `node ../ux-doctor/scripts/rule.mjs F-31`, or `references/index.md` → `references/rules.md`. Only `check` rules become findings. Record counted clicks, scrolls and waits in the finding's evidence.

## Top checks
- F-29 / F-22 (p.99, p.105) — avoidable steps, retyped saved data, no address lookup, long scroll or reading before the action → merge or drop steps, `autocomplete` attributes, prefilled saved data.
- F-31 / F-33 (p.107-108) — a small option set (colour, size, plan, quantity) hidden in a `<select>` → inline swatches, segmented control or chips; quantity as − / editable number / +.
- F-25 / F-26 (p.101-102) — many equal-weight options or a wall of ungrouped items → a curated subset with "See all"; groups of about 7 with headings.
- F-24 (p.100, p.108) — the action far from what it commits, or a tiny hit area → place it next to its inputs; enlarge the target.
- W2-81 / W2-83 (web) — a primary action revealed only on hover; touch targets under 24px (target 44px) → always-visible primary actions; pad icon buttons to 44px.
- W1-96 / W2-62 (web) — an action with no visible response within ~400ms, or a spinner flashing under ~300ms → pressed and pending state at once, skeleton or progress only past ~300ms.
- W5-04 / F-27 (web, p.103) — content hidden until a scroll trigger fires; auto-playing banners or pop-ups on load in task or reading flows → render content without the animation; remove or defer distractions.

## Code signals
- `<select` / `Listbox` with few options for colour, size or quantity; `type="number"` without +/- buttons (F-31, F-33).
- Inputs missing `autocomplete` (`email`, `tel`, `street-address`, `postal-code`, `cc-number`, `cc-exp`) (F-29).
- Submit or "Add to cart" in a different column, `ml-auto` far from its inputs (F-24).
- Actions inside `group-hover:`/`:hover` only; `:hover` styles without `@media (hover: hover)` (W2-81, W2-82); icon buttons `w-5 h-5` with no padding (W2-83).
- Async handlers with no pending state; spinners rendered without a delay (W1-96, W2-62).
- `whileInView`/`data-aos` on every section, sections starting at `opacity-0` (W5-03, W5-04); `autoplay` carousels, dialogs opened in `useEffect` on mount (F-27).
- Desktop nav collapsed into a hamburger at every breakpoint (W2-72).
- Optimistic updates around payment or delete calls (W2-64).

## Restyle
Values (touch targets, timing): `../ux-doctor/references/defaults.md`. Specific to this skill:
- Product page: inline swatches with a ringed selected state, a stepper with "Add to cart" right beside it, a filled "Buy now" next to an outlined "Add to cart" for returning users (F-32, F-33, F-24, G-01).
- Long lists: curated sections with top N + "See all"; "Show more" for long text; a sticky action card on long pages (F-25, F-26).
- Resuming tasks: "Continue/recent" rows with progress, conventional labelled icons (F-28); repetitive work gets multi-select and bulk actions (F-30).
