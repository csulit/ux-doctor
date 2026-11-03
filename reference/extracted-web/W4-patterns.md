# Web patterns W4
> Source: community design and design-engineering tips added by the maintainer (paraphrased). Not part of the PDF playbook.
## Web patterns: Feedback
### W4-01 Size the skeleton from the measured loaded UI  (src: skeleton-measure)
- **Rule**: Render the real, loaded component in a browser (Playwright, headless Chrome or any devtools-protocol driver), read each block's box with `getBoundingClientRect()`, and give the skeleton the same sizes and positions instead of eyeballed values.
- **Why**: Guessed placeholder sizes make the page jump when real content replaces them (layout jank).
- **Do / Don't**: Do copy measured width, height, gap, radius and line count from the loaded state into the skeleton. Don't pick round-number placeholder heights by feel.
- **Audit check**: Render the loading and loaded states (or screenshot both) and compare the boxes of corresponding blocks: avatar, title and text lines, media, buttons, and the container's total height. Flag differences of more than a few px or a different number of lines. Grep skeleton components for arbitrary fixed `h-*`/`w-*` values that don't exist in the real component (inference).
- **Restyle fix**: Measure the loaded component once, then set skeleton block dimensions, spacing and line count to match; reuse the real component's layout classes or tokens where possible so they cannot drift apart.
- **Severity**: medium ; **Tags**: states, layout, craft

### W4-02 Prove the skeleton-to-content swap causes no layout shift  (src: skeleton-measure)
- **Rule**: After sizing the skeleton, check that replacing it with real content moves nothing: same top and left positions for matching blocks and no change in the surrounding elements' positions (cumulative layout shift near zero).
- **Why**: A skeleton that looks right but still shifts content defeats its purpose and hurts perceived stability.
- **Do / Don't**: Do compare element boxes before and after the swap, or record layout-shift entries during load. Don't call the skeleton done because it looks similar.
- **Audit check**: With a browser tool, capture boxes of the elements below and beside the skeleton in both states, or read `PerformanceObserver` `layout-shift` entries during the swap; media without reserved space (`width`/`height` or `aspect-ratio`) is a likely cause (inference). Text with a different line count than the skeleton is another.
- **Restyle fix**: Reserve space for media with `aspect-ratio` or explicit dimensions, set `min-height` on the container for the loaded content, and match line counts; re-measure until the shift is gone.
- **Severity**: medium ; **Tags**: states, layout, mobile

## Web patterns: Colour proportion
### W4-03 Balance colour by area with the 60-30-10 split: dominant, secondary, accent  (src: clean-ui-tips)
- **Rule**: Split a screen's colour by area into three roles: a dominant base (page background, about 60%), a secondary tone for surfaces such as cards, inputs and bars (about 30%), and an accent kept to actions and active states (about 10%). The numbers are a balance heuristic, not a measurement target.
- **Why**: One colour in charge, one supporting tier and a small accent give the screen a clear structure and make the accent easy to find; an even split leaves no colour in charge.
- **Do / Don't**: Do give surfaces their own tone one step from the background and keep the accent on buttons, links and selection. Don't fill large areas with the accent or build the screen from two tones with no surface tier.
- **Audit check**: On a screenshot, estimate the area share of background, surface and accent colours. Flag an accent covering clearly more than about 10% of the screen or sitting on non-interactive blocks, two roles at a near-equal share, or no distinct surface tier (cards and inputs indistinguishable from the page, see D-11) (inference).
- **Restyle fix**: Assign tokens per role (background, surface, accent), move the accent off decorative areas onto actions and active states, and add a surface tone one step lighter or darker than the background. (On conflict the playbook wins: the 10% is a ceiling, E-03 keeps the primary colour on interactive elements and E-04 keeps the palette small.)
- **Severity**: low ; **Tags**: color, hierarchy, craft

## Web patterns: Multi-step questions
### W4-04 Ask one question per step in questionnaires and onboarding  (src: clean-ui-tips)
- **Rule**: In a stepped questionnaire, quiz or onboarding flow, give each step one question and its own action. Stacking several independent questions ("Q1 … Q2 …") on one step of a stepper defeats the stepper.
- **Why**: Each question is a separate decision; stacking them multiplies what users must parse at once and pushes the step's action below the fold.
- **Do / Don't**: Do show one question, its options and a visible Continue/Submit per step, with the step count. Don't stack unrelated questions on one step, and don't split related data-entry fields (address, card details) into one-field steps (see W3-10, G-06).
- **Audit check**: In multi-step flows, count independent questions per step (flag 2 or more); numbered "Q1."/"Q2." labels inside one step are a signal. On a mobile viewport, check that the step's primary action is visible without scrolling (inference).
- **Restyle fix**: Drop questions whose answer the product doesn't use first (F-29), then split the rest into one question per step, update the step count and progress, and keep the action low in thumb reach (H-10).
- **Severity**: medium ; **Tags**: forms, interaction-cost, layout

## Web patterns: Repeated content
### W4-05 Move text repeated on every item into the group heading  (src: clean-ui-tips)
- **Rule**: When every item in a list, accordion or menu repeats the same text ("Relaxation before bed / Exercise 1", "Relaxation before bed / Exercise 2"), put the shared part in the group's heading once and leave only what differs on each item.
- **Why**: Repeated text multiplies reading per item and buries the part that tells the items apart.
- **Do / Don't**: Do title the group "Relaxation before bed" and label the items "Exercise 1", "Exercise 2", "Exercise 3". Don't repeat a shared prefix, suffix or unit on every row.
- **Audit check**: Compare item labels in lists, accordions, tabs, menus and table columns; flag a shared run of two or more words, or the same unit, repeated on three or more sibling items (inference).
- **Restyle fix**: Move the shared text into the heading, group label or column header (for label:value lists see A-14) and shorten each item to its distinguishing part.
- **Severity**: low ; **Tags**: copy, hierarchy, layout
