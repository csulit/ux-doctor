---
name: ux-ui-patterns
description: "Component-pattern knowledge: form fields and their states, labels, validation timing, focus rings and focus traps, keyboard support, passwords, OTP and card fields, disabled vs loading buttons, destructive dialogs and undo, notifications, skeletons, product pages, mobile thumb zone, empty/error/404 states and nav dropdowns. Use when auditing, reviewing or restyling these screens or components."
---

# UI patterns: forms, focus, dialogs, states, mobile, navigation

Concrete component patterns. Playbook rules G-02..G-16, H-01..H-04, H-09..H-18; core web rules for field states and validation (W2-21, W2-22, W2-23, W2-27, W3-11), focus and keyboard (W2-47, W2-51, W1-61, W1-85), buttons (W1-94, W1-95), destructive actions (W1-91, W1-92, W3-40, W3-41), feedback (W2-65, W3-50, W4-02) and OTP (W2-32), all `source: web`.

## How to use
Start from the Critical 20 (`../ux-doctor/references/critical.md`), then the top checks below. Open a rule only for a candidate finding: `node ../ux-doctor/scripts/rule.mjs G-10`, or `references/index.md` → `references/rules.md`. Only `check` rules become findings.

## Top checks
- G-10 / G-11 / G-12 (p.120-122) — destructive confirm styled green or primary, no Cancel, or Delete left of Cancel → red destructive button on the right, low-emphasis Cancel on the left, named buttons (W1-91); reversible deletes get a timed undo instead of a dialog (W3-40).
- H-13 / H-12 (p.136-138) — error message without cause or next step; empty state as bare text or nothing → cause + fix + a way out; illustration, benefit headline, a tip and one CTA that creates the first item.
- W2-47 / W2-23 / W2-51 (web) — `outline: none` with no replacement, focus ring below 3:1, modal that doesn't trap or restore focus → `:focus-visible` ring 2px + 2px offset, focus trap and restore.
- W2-22 / W2-21 / W2-27 (web) — placeholder used as the label; missing focus, error, success, disabled or loading states; errors shown while the first attempt is still being typed → label outside the field, all six states, format errors on blur then live.
- W1-94 / W1-95 (web) — submit `disabled` with no explanation; loading indistinguishable from disabled → keep it enabled and validate on click; a distinct pending state.
- H-09 / H-03 (p.128, p.134) — mobile primary CTA or navigation at the top or far corners; promos or a second CTA inside sign-up, login or checkout → bottom-anchored actions and 3-5 bottom tabs; one primary per task flow.
- G-07 / G-08 / G-05 (p.114-119) — a confirm-password field; password without show/hide or with paste blocked; OTP as one plain input → single field with a toggle; per-digit boxes with paste and `autocomplete="one-time-code"` (W2-32).

## Code signals
- Destructive dialogs: `delete|remove|destroy` near `AlertDialog|Modal|confirm(` with `bg-green|btn-primary` (G-10), no `onCancel` (G-11), Delete before Cancel or `flex-row-reverse` (G-12).
- `.length === 0 &&` branches returning a bare `<p>` or `null` (H-12); `catch` rendering raw `error.message` (H-13).
- `outline-none|outline:\s*none|focus:outline-none` without `focus-visible:ring` (W2-47); dialogs without focus management (W2-51); custom dropdowns, accordions and toggles without keyboard handlers or real `<button>`/ARIA roles (W1-61, W1-85).
- `placeholder=` with no `<label>`; error styles applied `onChange` from the first keystroke (W2-22, W2-27).
- `disabled={!isValid}` on submit buttons (W1-94).
- `confirm.?password|password2|passwordConfirm`; `type="password"` with no toggle; `onPaste` `preventDefault` (G-07, G-08).
- A single `<input maxLength={4|6}>` for codes (G-05, W2-32); `w-full` on `cvc|zip|expiry` inputs (G-06).
- Toasts for field errors, modals for minor notices (W2-65); skeletons whose boxes don't match the loaded layout (W3-50, W4-02).
- `fixed top-* right-*` auth buttons at small breakpoints; primary CTA not bottom-anchored on mobile (H-09).
- Dropdown menus with many items and no group labels (H-17); 404 routes without the global header, links or search (H-14).

## Restyle
Values (touch targets, focus ring, timing): `../ux-doctor/references/defaults.md`. Specific to this skill:
- Password: single field + trailing eye toggle (`aria-pressed`), live requirement list or 4-segment strength bar (G-07, G-08, G-09).
- OTP: equal square boxes, large digits, auto-advance, paste fills all boxes (G-05, W2-32).
- Short fields about a third to half of the row; Expiry+CVC and Country+Zip share a row (G-06, the fraction is an inference).
- Mobile: primary and secondary actions stacked full width at the bottom, filled primary lowest (H-09).
- Error and 404: cause + fix copy in the product's own components, global header kept, helpful links or search (H-13, H-14).
- Product page: short intro, "Key features" list (check icon, bold title, one line each), short outro; short features in two columns (G-14, G-15).
- Dropdowns: consistent line icons, small group labels, thumbnails only in a featured panel (H-16, H-17, H-18).
