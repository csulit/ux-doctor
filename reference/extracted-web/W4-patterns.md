# Web patterns W4
> Source: community design-engineering tips added by the maintainer (paraphrased). Not part of the PDF playbook.
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
