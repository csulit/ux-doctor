---
name: ux-ui-patterns
description: "Component-pattern knowledge for forms, passwords, OTP and card fields, destructive dialogs, product pages, mobile thumb zone, empty/error/404 states and nav dropdowns. Use when auditing, reviewing or restyling these screens or components (confirm-password, delete modal, empty state, 404, mega-menu, banners)."
---

# UI patterns: forms, dialogs, states, mobile, navigation

Scope: concrete component patterns (C-01, G-02..G-16, H-01..H-04, H-09..H-18) from the playbook.
Covers input fields, passwords, confirm dialogs, product-page content, mobile CTAs, empty/error states, dropdowns.

## How to use
Read references/index.md first; open references/rules.md only for the rule IDs relevant to the current finding (search by ID, e.g. `grep -n '^### G-10' references/rules.md`). Cite rule IDs and pages in every finding.

## Top checks
Severity high first.
- H-03 (p.128) — sign-up/login/checkout has a second CTA, ad, upsell or promo unrelated to the form; exactly one primary action must remain → delete the promo or swap in a text-free, CTA-free brand image (H-04).
- G-10 (p.120) — destructive confirm button is green/neutral/`btn-primary` → use danger red token; keep green for positive actions.
- G-11 (p.121) — destructive dialog has only "Delete" (a close "×" alone isn't enough) → add a low-emphasis Cancel (text/ghost) button.
- H-09 (p.134) — mobile primary CTA, primary nav or most-used controls sit at the top of the screen or far corners ("top third" is an inference; the playbook map shows the top and bottom-right as hard to reach); thumb map: easy = lower-left/middle, hard = top and bottom-right (assumes right thumb) → move to a bottom bar or bottom-anchored CTA.
- H-11 (p.136) — list/table/dashboard/inbox renders bare text ("You have no projects!") or nothing at zero items → build a designed empty state (H-12).
- H-13 (p.138) — error message doesn't state cause, give a next step, or uses non-app styling (e.g. "That's all we know") → rewrite as cause + fix, add link/button, use product components.
- H-12 (p.136-137) — empty state lacks any of the 4 parts: benefit headline, illustration, actionable tips (example has 2; "1-3" is an inference), primary CTA that creates the first item → add the missing parts.
- G-12 (p.122) — footer order is `[Delete] [Cancel]` in LTR → `[Cancel] [Delete]`, destructive on the right; mirror for RTL (inferred in rule).
- G-07 (p.117-118) — sign-up/reset has a second password field (confirm/repeat/retype, or two `type=password`) → delete it; add show/hide (G-08) and inline validation (G-09).
- G-05 (p.114-115) — fixed-length code (OTP/PIN) is one single-line input at body size → N equal boxes (example uses 4), large digits, auto-advance focus, visible active/cursor state.
- G-06 (p.115-116) — short fields (CVC 3-4 digits, MM/YY, zip, quantity) rendered full width in a tall single column → short width proportional to content ("about 1/3 to 1/2" is an inference; playbook gives no fraction); pair Expiry+CVC and Country+Zip; card number and name stay full width.
- G-02 (p.111-112) — home/discover uses big "Explore now" banners instead of items; real content must be visible with no extra tap (0 taps, inferred from the rule; playbook example shows 3 cards) → row/grid of real item cards (image, title, key metadata) plus a "View all" link at the right of the section header.
- G-13 (p.123) — product description as one dense paragraph (bad example ~15+ lines in a narrow column; a "5-6 lines" cut-off is an inference) with bold as the only scan aid → short intro, "Key features" list (check icon + bold title + one-line description), short outro (G-14).
- H-17 (p.141-142) — multi-group dropdown ("6+ items" is an inference) has no group labels → add small category headings (Products / Use cases / Resources).

- (general practice) persistent navigation — a sticky/fixed header or nav on a long marketing page is fine only if it stays compact. Whenever it is sticky, verify: `scroll-margin-top` / `scroll-padding-top` so in-page anchors are not hidden under it; `z-index` vs skip link, modals and menus (W3-32: fix with stacking contexts, not bigger numbers); mobile menu usable on short screens (scrolls, reachable close button); contrast of a transparent/blurred header over content in both themes; reduced height on scroll. Also flag a duplicate CTA created by header + hero (see ux-hierarchy-clarity same-destination test; W3-17). Related web rules: W2-71 (bottom tabs on mobile / persistent sidebar on desktop), W2-72 (keep primary navigation out of the hamburger), W2-73 (breadcrumbs only for deeper hierarchies).

Lower severity (medium/low) worth a pass: G-03 curated "Top N" list in first viewport; G-04 field widths follow data type; G-08 eye/eye-slash toggle with accessible label; G-09 live strength meter (4 bars, "Weak" in red); G-14/G-15 icons and 2-column features (2×2 in the example; "4+ features" threshold is an inference); H-02 every block answers a user question; H-04 side image has no text/button/link; H-10 (p.135-136) stack Sign in + Sign up full width at the bottom; H-14 404 keeps global header and gives helpful links or search (example has 6 links; "4-6" is an inference); H-16 consistent line icons in dropdowns; H-18 thumbnails only in a featured panel; C-01 creation forms mirror the output layout; H-01/G-16 add social proof/comparison as stakeholder proposals.

## Code signals
(General inspection hints; the rule each maps to is cited.)
- Confirm password (G-07): `grep -rniE "confirm.?password|repeat.?password|retype|password2|passwordConfirm"`; count `type="password"` inputs per form.
- Password toggle (G-08): `type="password"` with no sibling button toggling `type`, no `aria-label` like "Show password".
- Password feedback (G-09): validation only inside `onSubmit`, no `onChange`/`aria-live` strength or rule list.
- Destructive dialogs (G-10, G-11, G-12): find `delete|remove|destroy` near `AlertDialog|Modal|confirm(`; check button classes for `bg-green|success|btn-primary` (G-10), presence of a Cancel/`onCancel` (G-11), DOM or `flex-row-reverse`/`order-` putting Delete before Cancel (G-12).
- OTP (G-05): single `<input maxLength={4|6}>` with no per-digit inputs, `inputMode`, or auto-advance `focus()`; font size equal to body.
- Field widths (G-06, G-04): `w-full` on inputs named `cvc|cvv|zip|postal|expiry|qty|age`; no `grid-cols-2`/`flex` pairing of short fields.
- Banners (G-02): hero/banner components whose only child is heading + "Explore"/"Discover" button, sitting above or instead of an items list.
- Empty states (H-11, H-12): `.length === 0 &&` or `!items.length` branches returning a bare `<p>`/string or `null`; no CTA button or illustration in the branch.
- Errors/404 (H-13, H-14): `catch` branches rendering raw `error.message`; 404 route without header/nav component, links or search.
- Competing CTAs (H-03): multiple filled/primary buttons per auth or checkout view; promo components in the same layout as a form; side image with `<h*>`, `<p>`, `<a>`, `<button>` children (H-04).
- Sticky/fixed header (persistent navigation, general practice): `position:\s*(sticky|fixed)`, `sticky top-0`, `fixed top-0`, `top:\s*0`, `scroll-padding-top`, `scroll-margin-top`, `z-index` / `z-[0-9]+` values on header, skip link, modal and menu layers; `backdrop-filter|backdrop-blur` or `bg-*/[0-9]+` on the header; header height change on scroll.
- Mobile (H-09, H-10): `fixed|absolute top-* right-*` auth/action buttons at small breakpoints; primary CTA not in a bottom-anchored container (`fixed bottom-0`, `sticky bottom-0`, `bottom-*`).
- Dropdowns (H-16, H-17, H-18): menu item components with no icon slot, no section label elements, `<img>` in every item row.
- Feature lists (G-13, G-15): long `<p>` of features; single-column list of 4+ short items with unused horizontal space (no `grid-cols-2`).
- Screenshots/Figma: look for the same patterns visually — tall single-column payment forms, green Delete, Delete left of Cancel, text-only empty screens.

## Restyle defaults
- Destructive confirm: danger/red token on the confirm button, e.g. `--color-danger` / `bg-red-*` (G-10); Cancel as text/ghost on the left, destructive pill on the right (G-11, G-12).
- Password: single field + trailing eye/eye-slash icon button toggling `type` (G-07, G-08); 4-segment strength bar plus one-line label ("Weak" in red) under the field (G-09).
- OTP: equal square boxes, one per digit (example: 4), large type, auto-advance focus, visible cursor (G-05).
- Short-field widths about 1/3 to 1/2 of the row (inference; no fraction in the playbook); Expiry+CVC and Country+Zip share rows (G-06).
- Mobile: primary CTA and secondary action stacked full width at the bottom, filled primary lowest (H-10, H-09).
- Empty state: illustration + solution-oriented headline + short tips with icons (example has 2) + full-width primary CTA (H-12).
- Error/404: cause + fix copy, product's own components, global header kept, helpful links (example has 6; 4-6 is an inference) or search, small error code (H-13, H-14).
- Home/discover: row of real item cards (example shows 3) with image, title, metadata; "View all" link in header (G-02); curated "Top N" list (G-03).
- Product page: intro → "Key features" list (check icon, bold title, one-line description) → short outro; stars + score + count row under the title (G-14); `grid grid-cols-2 gap-*` for short features with divider lines (G-15); bar comparison for the main quantitative claim, product bar long and saturated, others short and pale (G-16).
- Dropdowns: consistent line icons in light-tinted circles (H-16); small accent-colour group labels (H-17); thumbnails only in a featured panel with an "all posts" link (H-18).
- Creation forms: editable preview of the output — image slot on top, title/price in one row, description, location, tags; thin dividers (C-01).
- (general practice) Keep touch targets about 44-48px and give OTP/password inputs correct `autocomplete`, `inputmode` and `aria-label` attributes; destructive dialogs should focus Cancel by default.
- (general practice) Contrast of red danger buttons and strength text should meet WCAG AA 4.5:1 for text (external standard, not from the playbook).

## Pairs well with
- ux-interaction-cost — field count, taps to content, thumb reach.
- ux-color — danger red vs success green, status colours.
- ux-hierarchy-clarity — one primary action, button emphasis.
- ux-layout-spacing — field pairing, grids, dividers.
- ux-typography — OTP digit size, scannable product copy.
- ux-depth-craft — dropdown/modal elevation and polish.
- ux-doctor — orchestrator for full audits and restyles.
