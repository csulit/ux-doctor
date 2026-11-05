# Critical 20

Hand-written. The twenty checks that produce most blockers and majors, across all dimensions. Audits and reviews check these first, on every screen; building and restyling follow the **Build** column. Numbers come from `defaults.md`; each rule's full entry is one `node scripts/rule.mjs <ID>` away.

| # | Check (finding when…) | Build (do this) | Rules |
|---|---|---|---|
| 1 | text is below 4.5:1, or large text below 3:1, on its real surface in any theme | measure every text/background token pair with `contrast.mjs`; dark text on tinted badges | F-09, B-03, F-12 |
| 2 | main text is below 12px, or body text is not ~16px outside dense tool UIs | 16px body, 1.5–1.6 line-height | F-06, F-07 |
| 3 | a state (error, success, selected, required) is shown by colour alone | pair every colour cue with an icon, label or pattern | E-10 |
| 4 | an action group or a viewport (header included) has more than one filled primary, or the same CTA twice | one filled primary, a neutral secondary, a text-link tertiary; duplicates: `duplicate-cta.md` | A-07, A-05 |
| 5 | an icon-only control has no visible label or `aria-label`, or on/off look the same | visible text labels; distinct on/off states | A-18 |
| 6 | copy and control state contradict each other ("Unselect items to remove") | positive wording; the checked item is the one acted on | A-20 |
| 7 | text sits on a photo with no scrim, gradient or blur | a bottom-to-top dark gradient or a blurred translucent panel; test with a light image | B-09 |
| 8 | a destructive confirm is styled as safe, or has no Cancel | red destructive button, Cancel left, named buttons; reversible deletes get undo instead | G-10, G-11, W3-40 |
| 9 | an error message gives no cause or no way forward | cause + next step + retry/back, in the product's own components | H-13 |
| 10 | an empty state is bare text or nothing | illustration, benefit headline, a tip, one CTA that creates the first item | H-12 |
| 11 | the focus outline is removed without a replacement, or the ring is below 3:1 | `:focus-visible` ring 2px + 2px offset, ≥ 3:1 | W2-47, W2-23 |
| 12 | a primary action appears only on hover, or a touch target is under 24px | always-visible primary actions; 44px targets | W2-81, W2-83 |
| 13 | a field uses its placeholder as the label, or lacks focus/error/disabled states | label outside the field; default, focus, error, success, disabled and loading states | W2-22, W2-21 |
| 14 | a modal doesn't trap focus or doesn't restore it on close | trap focus inside, restore it to the trigger | W2-51 |
| 15 | content stays hidden until a scroll trigger fires | content renders fully without JS and with reduced motion | W5-04 |
| 16 | a payment or irreversible action updates optimistically | wait for the server on payments and irreversible actions | W2-64 |
| 17 | a heading is lighter than its body, or meta outweighs the primary item | heading darkest, body grey, meta smaller and lighter | A-12, A-09 |
| 18 | the page background is saturated, or the brand colour sits on non-interactive elements | neutral background; brand colour on actions and active states only | E-05, E-03 |
| 19 | spacing is off the base-unit scale, or related and unrelated items sit equally apart | one 4-based scale; tighter inside a group than between groups | B-15, A-15 |
| 20 | mobile primary actions sit out of thumb reach, or desktop primary navigation hides behind a hamburger | bottom bar or bottom-anchored CTA on mobile; persistent navigation on desktop | H-09, W2-72 |
