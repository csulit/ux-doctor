# Duplicate-CTA check (same-destination test)

Hand-written. Load this only when `cta-scan` reports `DUP_IN_VIEWPORT`, when the same CTA looks doubled in a screenshot, or when a change hides, removes or moves a header, nav or hero CTA. Rules: A-05 (same CTA filled twice in one viewport), A-07 (one filled primary), W1-82 and W3-17 (one accent per view), W2-77 (a closing repeat is fine).

## Test
Two or more controls with the same normalised label AND destination visible together in the first viewport at 1440×900 or 390×844, header included (sticky or not) → **major** if two or more are filled/primary, **minor** if only one is. A same-destination test finding is `(general practice)` and carries that severity.

**Exempt**: repeats outside the first viewport (closing CTA, footer; W2-77 licenses only that), copies inside a collapsed mobile menu, and nav or text links to the same page with a different label (a note at most).

## Fix, in this order
1. Give the hero CTA a different job (a specific next step); the header CTA stays in place; rank the two per A-07 (one filled).
2. Hide the header copy until the hero CTA scrolls out.

Making one copy outline-only only lowers major to minor and is not a fix. Deleting the header CTA is never a resolution: the destination stays reachable at every scroll state, from the hero CTA at the top and from the header (or, on mobile, a bottom-anchored CTA per H-09) once the hero CTA has scrolled out: a persistent conversion route.

## Every fix states its end state per scroll state
Write it as `at top: …; after the hero scrolls out: …`. For fix 2 the header at the top must still look complete: no empty slot or reserved gap, no lone-icon cluster, and nav links don't shift when the CTA appears (give the nav its own grid column so the right-hand cluster can grow without moving it; never hold the CTA's width as empty space). The reveal honours `prefers-reduced-motion`.

## Verify
A fix that hides, removes or moves a control is not done until the vacated region has been viewed at both scroll states (top, and after the hero scrolls out) × 1440×900 and 390×844 × light and dark (where there is a theme toggle), with no new balance or alignment problem (C-02, A-21). `cta-scan` cannot scroll: use a browser tool to scroll past the hero CTA, then screenshot. Without one, label the claim `not visually verified (scrolled state)` and never mark it fixed on that basis.

## Code signals
Layout and header components render on every page, so count CTAs per viewport, not per file: a header CTA plus a hero CTA with the same label and destination is a duplicate even when each file has one. Collect candidates by destination, then compare labels, e.g. `rg -n 'mailto:|href=.(/signup|/contact|/demo|/pricing)'`; prefer `scripts/cta-scan.mjs <url> --render` on the rendered page.
