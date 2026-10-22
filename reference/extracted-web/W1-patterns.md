# Web patterns W1
> Source: public UX pattern pages (paraphrased tips). Not part of the PDF playbook.

## Web patterns: Motion

### W1-01 Run entrances at 200–300ms with ease-out  (src: animation-timing)
- **Rule**: Time entrance animations between 200 and 300ms and use a cubic ease-out so they decelerate into place. Longer than about 300ms starts to feel sluggish.
- **Why**: This range reads as responsive yet deliberate.
- **Do / Don't**: Do use ease-out for entering elements. Don't use linear easing or stretch entrances past ~300ms.
- **Audit check**: grep `transition`/`animation` durations on enter states (`duration-500`, `duration-700`, `0.5s`+); grep `linear` or `ease-in` on entrances.
- **Restyle fix**: Set entrance transitions to 200–300ms with `cubic-bezier` ease-out (e.g. `ease-out`, `duration-200`/`duration-300`).
- **Severity**: medium ; **Tags**: motion, craft

### W1-02 Make exits faster than entrances  (src: animation-timing)
- **Rule**: Dismissals should run quicker than the matching entrance, e.g. ~250ms in and ~150ms out (roughly 40% faster). Symmetric timing makes the UI feel like it drags.
- **Why**: Quick exits make dismissals feel snappy.
- **Do / Don't**: Do shorten exit durations relative to entrance. Don't use identical in/out timing.
- **Audit check**: Compare enter vs leave durations in modals, toasts, menus (`data-[state=closed]:duration-*`, `exit` transition props, `leave` classes); flag equal values.
- **Restyle fix**: Set exit duration to ~60% of the entrance (e.g. 250ms in / 150ms out).
- **Severity**: low ; **Tags**: motion, craft

### W1-03 Respond to taps within 100ms  (src: animation-timing)
- **Rule**: Taps and presses need a visible response in less than 100ms; a slower reaction feels laggy even when the underlying action completes instantly.
- **Why**: Late acknowledgement makes the interface seem unresponsive.
- **Do / Don't**: Do make `:active`/press transitions brief. Don't let sluggish transitions hold back pressed states.
- **Audit check**: Check `:active`, `active:` and button `transition-duration` values; flag > 100ms on press feedback.
- **Restyle fix**: Set press/active state transitions to ≤100ms (e.g. `duration-75`).
- **Severity**: medium ; **Tags**: motion, interaction-cost, buttons

### W1-04 Stagger list items about 50ms apart  (src: animation-timing)
- **Rule**: Offset each list item's entrance by about 50ms. At 30ms the items blur into one blob; at 100ms the list crawls in.
- **Why**: A good stagger lets the eye follow items without slowing the page.
- **Do / Don't**: Do use ~50ms increments. Don't use 30ms or 100ms steps.
- **Audit check**: grep `animation-delay`, `transition-delay`, `stagger`, `delay-[…]`, or `index * ` multipliers in motion code; check step is ≈50ms.
- **Restyle fix**: Set per-item delay to `index * 50ms`.
- **Severity**: low ; **Tags**: motion, craft

### W1-05 Reserve long bouncy motion for attention moments  (src: animation-timing)
- **Rule**: Attention-grabbing elements (notifications are one example) may run 500–800ms with a bounce or overshoot. Spring and bounce belong only to moments that genuinely need attention; routine entrances use ease-out.
- **Why**: Overusing bounce dilutes its signal and makes routine UI feel playful or slow.
- **Do / Don't**: Do reserve spring/bounce for moments that genuinely need attention (a notification is one case). Don't apply bounce easing to ordinary entrances or controls.
- **Audit check**: grep `bounce`, `spring`, `overshoot`, `cubic-bezier` with values >1 on routine components; do not flag deliberate restrained springs on presses/modals/confirmations (see W2-02).
- **Restyle fix**: Replace bounce on routine entrances (menus, panels, list items) with ease-out; keep springs on attention moments and on the restrained press/modal/confirmation springs from W2-02.
- **Severity**: low ; **Tags**: motion, craft

### W1-06 Animate accordion height with grid rows, not height:auto  (src: accordion-disclosure)
- **Rule**: `height: auto` cannot transition and just snaps. Animate `grid-template-rows` from `0fr` to `1fr` on a `display: grid` wrapper, or measure `scrollHeight` and animate to a pixel value.
- **Why**: Collapsible panels otherwise jump instead of easing open.
- **Do / Don't**: Do use the 0fr→1fr grid technique or a measured height. Don't expect `transition: height` to work from/to auto.
- **Audit check**: grep `transition.*height` combined with `height: auto` / `h-auto` on collapsible panels; look for absence of `grid-template-rows` / `grid-rows-[0fr]`.
- **Restyle fix**: Wrap panel content in a grid container and toggle `grid-template-rows: 0fr` ↔ `1fr` (inner `overflow: hidden`).
- **Severity**: medium ; **Tags**: motion, craft

### W1-07 Sync the chevron with the panel animation  (src: accordion-disclosure)
- **Rule**: Give the chevron rotation and the panel height an identical duration and easing curve. A lag of even ~10 frames between them looks broken.
- **Why**: A single coordinated motion looks fluid, not janky.
- **Do / Don't**: Do share one duration and easing between icon and panel. Don't let the chevron fall behind the panel.
- **Audit check**: Compare `transition` duration/easing on the chevron (`rotate-180`, `transform`) vs the panel; flag mismatches.
- **Restyle fix**: Apply identical duration and easing tokens to both.
- **Severity**: low ; **Tags**: motion, icons, craft

### W1-08 Open dropdown menus in about 150ms  (src: dropdown-design)
- **Rule**: Make a dropdown's opening animation last about 150ms: 50ms seems abrupt and cheap, while 500ms seems slow and heavy.
- **Why**: 150ms looks smooth yet doesn't make users wait.
- **Do / Don't**: Do animate opening at ~150ms. Don't use no transition at all, or anything longer than ~150ms.
- **Audit check**: Check dropdown/popover/select content enter transitions (`duration-*`, `animation-duration`) for 0 or ≥300ms.
- **Restyle fix**: Set menu enter animation to ~150ms ease-out.
- **Severity**: low ; **Tags**: motion, craft

## Web patterns: Fundamentals

### W1-09 Build nested radii as outer minus padding  (src: border-radius)
- **Rule**: For a rounded element inside another, inner radius = outer radius − padding so the curves stay concentric.
- **Why**: Concentric corners look intentional; mismatched ones look "off".
- **Do / Don't**: Do compute the inner radius from the outer one. Don't nest a rounded card in another with the same radius.
- **Audit check**: Find nested rounded containers (`rounded-xl` inside `rounded-xl` with `p-*`) and compare radii vs padding.
- **Restyle fix**: Reduce the inner `border-radius` to outer − padding (min 0).
- **Severity**: low ; **Tags**: craft, borders, spacing

### W1-10 Standardize corner radii on a single scale (4·8·12·16·24)  (src: border-radius)
- **Rule**: Pull all corner radii from one shared scale (4, 8, 12, 16, 24) rather than choosing values component by component.
- **Why**: Uniformity is what gives a UI its polished look.
- **Do / Don't**: Do reuse the same scale across components. Don't invent a new radius for each component.
- **Audit check**: grep `border-radius` / `rounded-[` values not in {4,8,12,16,24}; count distinct radii.
- **Restyle fix**: Snap off-scale radii to the nearest scale step and expose them as tokens.
- **Severity**: medium ; **Tags**: craft, borders

### W1-11 Grow radius with surface size and fit brand tone  (src: border-radius)
- **Rule**: Radius rises with surface size: ~4px tooltips, ~8px inputs, ~12px cards, ~16px modals, ~24px panels. Sharp corners feel corporate, round ones friendly; choose per brand.
- **Why**: Radius signals both size hierarchy and personality.
- **Do / Don't**: Do raise radius as surfaces get larger. Don't put an oversized playful radius on a serious brand, or a tight one on a playful brand.
- **Audit check**: Compare radius of buttons/inputs/cards/modals; flag a modal with smaller radius than an input, or a 24px+ radius on small controls.
- **Restyle fix**: Assign radii by component size per the scale above.
- **Severity**: low ; **Tags**: craft, borders, hierarchy

### W1-12 Check every text/background pair against WCAG contrast  (src: color-accessibility)
- **Rule**: Contrast is a ratio set by the background. Aim for 4.5:1 for body text and 3:1 for large text; below 3:1 text becomes effectively invisible.
- **Why**: The same color can be crisp on one surface and vanish on another.
- **Do / Don't**: Do test each text-on-background pair. Don't assume a color is fine because it worked elsewhere.
- **Audit check**: Compute contrast for every text color against its actual background; flag <4.5:1 body, <3:1 large text.
- **Restyle fix**: Darken or lighten the text (or background) until the ratio clears the threshold.
- **Severity**: high ; **Tags**: contrast, accessibility, color

### W1-13 Raise contrast on muted gray text first  (src: color-accessibility)
- **Rule**: Low contrast mostly lurks in muted grays: secondary headings, card labels and navigation links often measure just 1.5–2:1.
- **Why**: Looking sleek doesn't make text easier to read.
- **Do / Don't**: Do darken or lighten muted secondary text until it passes. Don't leave low-contrast gray on navigation links and labels.
- **Audit check**: Check `text-gray-400`/`text-slate-400`/`opacity-50` on light backgrounds, and nav/label colors, for ratio <4.5:1.
- **Restyle fix**: Step muted text to a darker (light mode) or lighter (dark mode) token that meets 4.5:1.
- **Severity**: high ; **Tags**: contrast, accessibility, typography

### W1-14 Pair every color cue with a second signal  (src: color-accessibility)
- **Rule**: Never convey meaning by color alone; ~8% of users have color vision deficiency and red/green merge. Add an icon, label, trend arrow or chart pattern next to each color cue.
- **Why**: The message must survive when the color doesn't.
- **Do / Don't**: Do add an icon or text to error/success states. Don't separate errors from success by red-vs-green only.
- **Audit check**: Inspect error/success/status elements for color-only styling (`text-red-*`, `text-green-*`, colored dots) with no icon/text/aria.
- **Restyle fix**: Add an icon (and label text) to each state and arrows to up/down stats.
- **Severity**: high ; **Tags**: accessibility, color, states, icons

### W1-15 Avoid pure black backgrounds in dark mode  (src: dark-mode)
- **Rule**: Build dark mode on a near-black base such as #121212 rather than #000000 so shadows and elevation stay visible.
- **Why**: Pure black flattens depth.
- **Do / Don't**: Do use a near-black grey base. Don't use #000 as the page background.
- **Audit check**: grep `#000`, `#000000`, `bg-black`, `rgb(0,0,0)` as dark-theme backgrounds.
- **Restyle fix**: Replace with ~#121212 and lighten raised surfaces.
- **Severity**: medium ; **Tags**: dark-mode, depth, color

### W1-16 Express dark-mode elevation with lighter surfaces  (src: dark-mode)
- **Rule**: Raise each layer of elevation with a progressively lighter grey (base, then surface, then elevated); lightness takes over the job that shadows do in light themes.
- **Why**: On dark backgrounds a shadow is nearly invisible, so brightness has to signal depth.
- **Do / Don't**: Do define a token per layer. Don't paint the page, cards and modals one identical dark colour.
- **Audit check**: Compare background colors of page, card, popover in dark theme; flag identical values.
- **Restyle fix**: Define base/surface/elevated tokens with increasing lightness and apply per layer.
- **Severity**: medium ; **Tags**: dark-mode, depth, color

### W1-17 Desaturate accents ~20% in dark mode  (src: dark-mode)
- **Rule**: Cut accent saturation about 20% on dark backgrounds, since fully saturated buttons and highlights vibrate and tire the eyes.
- **Why**: Toned-down accents look more refined on dark UI.
- **Do / Don't**: Do use a toned-down accent variant in dark theme. Don't carry the light-mode saturated accent over unchanged.
- **Audit check**: Compare accent values between light and dark themes; flag identical highly saturated accents (`dark:` variants absent).
- **Restyle fix**: Add a dark-theme accent token ~20% less saturated.
- **Severity**: low ; **Tags**: dark-mode, color

### W1-18 Soften text white and tier it with opacity in dark mode  (src: dark-mode)
- **Rule**: Don't set text to #FFFFFF on dark UI; use a soft off-white, and build hierarchy by stepping white opacity down for high, medium and disabled emphasis.
- **Why**: Pure white glares and fatigues the eyes; opacity tiers keep hierarchy without new hues.
- **Do / Don't**: Do use opacity levels for emphasis. Don't use #FFF for all text.
- **Audit check**: grep `#fff`, `#ffffff`, `text-white` on dark backgrounds, esp. for body text.
- **Restyle fix**: Use an off-white body color and `rgba(255,255,255,α)` tiers for secondary/disabled text.
- **Severity**: medium ; **Tags**: dark-mode, typography, hierarchy, contrast

### W1-19 Build shadows from three stacked layers  (src: depth-layers)
- **Rule**: Combine three shadows: a tight ~2px one, a medium ~12px spread and a broad ~32px ambient one, imitating how real light falls away.
- **Why**: A stack looks more physical than a single flat shadow.
- **Do / Don't**: Do layer several shadows whose blur and offset grow. Don't depend on one `box-shadow`.
- **Audit check**: grep `box-shadow` / `shadow-*` on cards and popovers; flag single-layer shadows.
- **Restyle fix**: Replace with a three-layer `box-shadow` (≈2px / 12px / 32px blurs).
- **Severity**: low ; **Tags**: shadows, depth, craft

### W1-20 Add subtle hover lift with border emphasis  (src: depth-layers)
- **Rule**: Lift hovered elements toward the viewer with `translateZ` plus about `scale(1.03)` and a soft glow, and brighten the border/shadow intensity to reinforce it.
- **Why**: A small physical reaction makes elements feel responsive without cartoonish exaggeration.
- **Do / Don't**: Do keep lifts to a few px and ~3% scale. Don't push scale or parallax so far it steals attention.
- **Audit check**: grep `hover:scale-*`, `:hover { transform: … scale(` values >1.05 and missing border/shadow change.
- **Restyle fix**: Use ~`scale(1.03)` plus a border/shadow intensity change on hover.
- **Severity**: low ; **Tags**: depth, shadows, interaction-cost, motion

### W1-21 Vary parallax speed per layer, subtly  (src: depth-layers)
- **Rule**: Move parallax layers at unequal rates to suggest distance: slowest in the background, moderate in the middle, quickest in front (about 1x / 2.5x / 5x).
- **Why**: Unequal speeds imply genuine depth.
- **Do / Don't**: Do give each layer its own scroll speed. Don't push offsets so far that they draw focus from the content.
- **Audit check**: Check scroll-linked transforms (`translateY` bound to scroll, `data-speed`, `parallax`) for a single shared speed or extreme values.
- **Restyle fix**: Assign slower speed to back layers and faster to front, keeping offsets modest.
- **Severity**: low ; **Tags**: depth, motion, craft

## Web patterns: System

### W1-22 Replace hardcoded values with semantic tokens  (src: design-system-kit)
- **Rule**: Replace raw hex colors with semantic tokens such as `var(--brand)` or `var(--error)`; intent then outlives redesigns, and renaming one token updates the entire app.
- **Why**: Tokens act as the one source of truth for consistency.
- **Do / Don't**: Do define each value as a named token. Don't write hex or pixel values directly in components.
- **Audit check**: grep `#[0-9a-fA-F]{3,8}`, `rgb(`, and arbitrary `[#…]` Tailwind values in components outside the token file.
- **Restyle fix**: Move values to CSS variables/theme tokens and reference them.
- **Severity**: medium ; **Tags**: color, craft

### W1-23 Use a numbered color scale mapped to semantic names  (src: design-system-kit)
- **Rule**: Create a 100–900 numbered color scale so shades are systematic, and alias its steps to semantic names like brand, success and error.
- **Why**: Systematic shades replace luck.
- **Do / Don't**: Do define scale steps and then alias them. Don't choose individual one-off shades.
- **Audit check**: Count distinct colors in CSS vs the defined palette; flag shades outside the scale.
- **Restyle fix**: Define the scale and remap ad-hoc colors to the nearest step.
- **Severity**: low ; **Tags**: color, craft

### W1-24 Set a fixed type scale of sizes and weights  (src: design-system-kit)
- **Rule**: Set a fixed type scale of sizes and weights. Uniform size and weight everywhere erases hierarchy.
- **Why**: A real scale lets heading and body be told apart instantly.
- **Do / Don't**: Do give each level its own size/weight pair. Don't set all text at one size and weight.
- **Audit check**: List distinct `font-size`/`font-weight` combos; flag too few distinct levels or many off-scale values.
- **Restyle fix**: Introduce a type scale and apply by role (heading, subheading, body, caption).
- **Severity**: medium ; **Tags**: typography, hierarchy

### W1-25 Space everything in 4px steps  (src: design-system-kit)
- **Rule**: Space things on a 4px scale (space-1 = 4 through space-16 = 64). Arbitrary gaps such as 7px, 23px or 11px look careless.
- **Why**: Gaps taken from a scale come across as intentional.
- **Do / Don't**: Do take spacing from the scale. Don't eyeball gaps.
- **Audit check**: grep `padding`/`margin`/`gap` px values not divisible by 4; Tailwind arbitrary `p-[7px]` etc.
- **Restyle fix**: Snap values to the nearest 4px-scale step.
- **Severity**: medium ; **Tags**: spacing, craft

### W1-26 Describe every component by variant, size and state  (src: design-system-kit)
- **Rule**: Define each component through variants, sizes and states: buttons come as primary, secondary, ghost and destructive; sizes as small, medium and large; inputs cover default, focus, error and disabled.
- **Why**: A uniform component API keeps the interface coherent.
- **Do / Don't**: Do cover every variant and state. Don't leave states unstyled or built as one-offs.
- **Audit check**: Check buttons/inputs for missing `:focus-visible`, error and disabled styles and for ad-hoc one-off button styles.
- **Restyle fix**: Create variant/size/state classes (e.g. cva) and refactor one-offs onto them.
- **Severity**: medium ; **Tags**: buttons, forms, states, craft

### W1-27 Map easing and duration to intent  (src: design-system-kit)
- **Rule**: Use ease-out for entering, ease-in-out for moving and ease-in for leaving, with a duration scale running from 100ms for micro-interactions up to 500ms for complex transitions.
- **Why**: Intent-driven easing feels natural and consistent.
- **Do / Don't**: Do define easing and duration as tokens. Don't use arbitrary durations, or a single easing everywhere.
- **Audit check**: Collect distinct `transition-duration` and `timing-function` values; flag many one-off values or durations beyond 500ms.
- **Restyle fix**: Add motion tokens (100–500ms scale, three easings) and reference them.
- **Severity**: low ; **Tags**: motion, craft

### W1-28 Name tokens by role, not value  (src: design-tokens)
- **Rule**: Name tokens by meaning (`color-primary`, `spacing-md`, `font-body`) rather than value (`color-blue-500`, `spacing-16`), which becomes false after a rebrand.
- **Why**: Role names survive visual changes.
- **Do / Don't**: Do use role-based names. Don't bake literal values into names.
- **Audit check**: grep token/variable names containing color words or numbers (`--blue-500` used directly in components).
- **Restyle fix**: Add semantic aliases and use them in components.
- **Severity**: low ; **Tags**: craft, color

### W1-29 Layer tokens primitives → semantic → component  (src: design-tokens)
- **Rule**: Structure tokens in three layers (primitives, semantic, component), each referencing the layer above, so one primitive edit cascades to all dependents.
- **Why**: One edit replaces hunting down 47 values.
- **Do / Don't**: Do reference tokens from tokens. Don't hardcode raw values across components.
- **Audit check**: Inspect token file for a flat list with no aliasing; count components using raw values vs `var(--…)`.
- **Restyle fix**: Introduce semantic and component aliases referencing primitives.
- **Severity**: low ; **Tags**: craft

### W1-30 Snap stray sizes to a fixed scale  (src: design-tokens)
- **Rule**: Define one scale and round everything onto it, so stray values such as 13px padding or a 17px gap become 12 and 16.
- **Why**: Consistency no longer relies on guessing.
- **Do / Don't**: Do round arbitrary spacing and font sizes to scale steps. Don't leave off-scale values behind.
- **Audit check**: grep `13px`, `17px`, odd `px` values in padding/gap/font-size; arbitrary Tailwind values.
- **Restyle fix**: Replace with nearest scale tokens.
- **Severity**: medium ; **Tags**: spacing, typography, craft

### W1-31 Implement dark mode as a token set swap  (src: design-tokens)
- **Rule**: Dark mode is swapping one token set for another via alias tokens, not inverting colors.
- **Why**: Same components get a deliberately different feel.
- **Do / Don't**: Do remap semantic tokens per theme. Don't use `filter: invert` or color flips.
- **Audit check**: grep `filter: invert`, many per-component `dark:` hardcoded colors vs theme variable overrides under `.dark` / `[data-theme]`.
- **Restyle fix**: Define theme token sets and have components use semantic tokens only.
- **Severity**: medium ; **Tags**: dark-mode, color, craft

## Web patterns: Inputs

### W1-32 Debounce autosave around 800ms  (src: autosave-ux)
- **Rule**: Never write on every keystroke. Reset a timer on each key and commit one write after roughly 800ms of silence.
- **Why**: One clean save avoids request floods.
- **Do / Don't**: Do debounce writes (~800ms). Don't save on each `onChange`.
- **Audit check**: grep `onChange`/`input` handlers calling `fetch`/`mutate`/`save` without `debounce`/`setTimeout`.
- **Restyle fix**: Wrap the save in a ~800ms debounce.
- **Severity**: medium ; **Tags**: forms, interaction-cost

### W1-33 Model the save indicator as explicit states  (src: autosave-ux)
- **Rule**: Run the status pill off a state machine with typing, saving, saved, offline and error states, and never show "Saved" before the write has landed.
- **Why**: Users rely on the indicator more than on the feature.
- **Do / Don't**: Do base status on real results, updated live. Don't show "Saved" for a change the server never received.
- **Audit check**: Look for a static "Saved" label or boolean `isSaved` without error/offline states.
- **Restyle fix**: Add the five states and set "Saved" only on success response.
- **Severity**: high ; **Tags**: states, forms, copy

### W1-34 Queue edits offline and replay oldest first  (src: autosave-ux)
- **Rule**: When offline, push edits into a local queue, show a badge with the pending count, and drain the queue oldest-first on reconnect.
- **Why**: Edits aren't lost and replay order stays correct.
- **Do / Don't**: Do queue and replay in order. Don't drop edits on network loss.
- **Audit check**: grep `navigator.onLine`, `online`/`offline` listeners; check for a queue and pending badge.
- **Restyle fix**: Add a local queue plus pending-count badge.
- **Severity**: medium ; **Tags**: states, forms

### W1-35 Never silently overwrite concurrent edits  (src: autosave-ux)
- **Rule**: With two tabs on one document, last-write-wins can wipe out someone's work. Merge simultaneous changes or warn the user.
- **Why**: A silent overwrite can destroy an hour of effort.
- **Do / Don't**: Do merge or warn the user. Don't overwrite without telling anyone.
- **Audit check**: Look for version/ETag/updatedAt checks on save; absence suggests last-write-wins.
- **Restyle fix**: Add a conflict warning/merge prompt on version mismatch.
- **Severity**: medium ; **Tags**: states, forms

### W1-36 Guard unsaved work on exit  (src: autosave-ux)
- **Rule**: If unsaved changes exist, intercept tab close with the browser's `beforeunload` prompt.
- **Why**: One dialog beats retyping an afternoon of work.
- **Do / Don't**: Do confirm exit with unsaved work. Don't let the tab close silently.
- **Audit check**: grep `beforeunload` in editors/forms with dirty state.
- **Restyle fix**: Register `beforeunload` while the form is dirty.
- **Severity**: medium ; **Tags**: forms, states

### W1-37 Validate on client for speed and on server for trust  (src: behind-the-button)
- **Rule**: Use client-side validation (inline errors, green checks, 0 network calls) for instant feedback, but re-run every check stricter on the server and recompute totals from your own catalog.
- **Why**: Client requests can be forged.
- **Do / Don't**: Do validate on both sides. Don't trust client-sent prices or values.
- **Audit check**: Check API handlers for use of client-provided `price`/`total` fields and missing server validation (zod/schema).
- **Restyle fix**: Add server validation and recompute totals server-side.
- **Severity**: high ; **Tags**: forms, craft

### W1-38 Use optimistic UI only for cheap, reversible actions  (src: behind-the-button)
- **Rule**: Likes, favorites and renames can repaint instantly and reconcile later; for money or irreversible actions hold the spinner until the server confirms. On response, repaint with server truth such as the real order ID.
- **Why**: Optimistic updates on payments misreport outcomes.
- **Do / Don't**: Do wait for server confirmation on payments. Don't use optimistic UI on irreversible actions.
- **Audit check**: grep `optimistic`, `onMutate`, `setQueryData` in checkout/payment/delete flows.
- **Restyle fix**: Show a loading state until confirmation and render server-returned data.
- **Severity**: medium ; **Tags**: states, interaction-cost

### W1-39 Use :has() instead of mirroring DOM state in JS  (src: css-has-selector)
- **Rule**: Let `:has()` style state the DOM already holds, e.g. `.plan:has(:checked)`, `.field:has(:user-invalid)`, or `form:has(:user-invalid) button { opacity: .4 }`. Every major browser has supported it since 2023.
- **Why**: It eliminates derived React state and handlers.
- **Do / Don't**: Do put the rule on the container; border, label and icon then update together. Don't copy checked/invalid state into React merely to switch a class.
- **Audit check**: Find `useState` that only toggles a class from checked/invalid/open, and absence of `:has(`/`has-[…]:` usage.
- **Restyle fix**: Replace with `:has()` / Tailwind `has-[:checked]:` rules.
- **Severity**: low ; **Tags**: forms, states, craft

### W1-40 Prefer :user-invalid over :invalid  (src: css-has-selector)
- **Rule**: Style errors with `:user-invalid` so they show after the user leaves a field, not on first render.
- **Why**: Avoids showing errors before interaction.
- **Do / Don't**: Do use `:user-invalid`. Don't use `:invalid` that fires immediately.
- **Audit check**: grep `:invalid` / `invalid:` in field styling.
- **Restyle fix**: Switch to `:user-invalid` (or `user-invalid:`).
- **Severity**: low ; **Tags**: forms, states

### W1-41 Use CSS for layout and scroll-lock reactions  (src: css-has-selector)
- **Rule**: Let CSS react to DOM structure: `.app:has(aside) { grid-template-columns: 280px 1fr }` for sidebars, `.grid:has(> :nth-child(n + 5))` for quantity queries, and `body:has(dialog[open]) { overflow: hidden }` to lock scroll.
- **Why**: Removes prop threading, JS counting and cleanup effects.
- **Do / Don't**: Do use these selectors. Don't write cleanup effects or count children in JS for layout.
- **Audit check**: grep `document.body.style.overflow` in effects, `showSidebar` props, `children.length` used to choose layout.
- **Restyle fix**: Replace with equivalent `:has()` rules.
- **Severity**: low ; **Tags**: layout, craft

### W1-42 Offer a three-state select-all checkbox  (src: bulk-actions)
- **Rule**: The header checkbox needs empty, partial (indeterminate dash) and checked states; clicking from partial should select everything, never clear.
- **Why**: Selection scope is visible at a glance.
- **Do / Don't**: Do support the indeterminate state. Don't offer a header checkbox with only two states.
- **Audit check**: grep `indeterminate` in table header checkbox code.
- **Restyle fix**: Set `indeterminate` when some rows selected; clicking from partial selects all.
- **Severity**: medium ; **Tags**: tables, forms, states

### W1-43 Name the exact count in bulk selection  (src: bulk-actions)
- **Rule**: If select-all grabs only visible rows, offer "Select all 247 matching" and re-read the label live when filters change (e.g. 247 → 96).
- **Why**: People should act on the real set.
- **Do / Don't**: Do show the exact count. Don't use a vague "all".
- **Audit check**: grep "Select all" labels without a count variable.
- **Restyle fix**: Interpolate matching count into the label and update it on filter change.
- **Severity**: medium ; **Tags**: tables, copy, states

### W1-44 Keep selection in app state with shift-click range  (src: bulk-actions)
- **Rule**: Store selected ids in application state, not the DOM, so selection survives paging; support shift-click for ranges.
- **Why**: DOM-held selection resets when the page changes.
- **Do / Don't**: Do keep ids in state. Don't derive selection from the visible rows.
- **Audit check**: Look for `querySelectorAll(':checked')` or selection state reset on page change; check for `shiftKey` handling.
- **Restyle fix**: Move selection to a Set of ids in state and add shift-range logic.
- **Severity**: low ; **Tags**: tables, interaction-cost

### W1-45 Replace destructive-bulk confirm modal with a 10s undo  (src: bulk-actions)
- **Rule**: Skip the confirm modal for bulk destructive actions: show the count, execute at once, and give a 10 second undo shown as a countdown ring that drains.
- **Why**: Undoing is quicker than answering a confirmation dialog.
- **Do / Don't**: Do offer an undo that repeats what was deleted. Don't depend on a confirm dialog.
- **Audit check**: grep `confirm(` / AlertDialog on bulk delete; check for undo toast.
- **Restyle fix**: Run action, show "N deleted — Undo" toast with ~10s countdown.
- **Severity**: medium ; **Tags**: interaction-cost, states, tables

### W1-46 Offer date presets before custom ranges  (src: date-pickers)
- **Rule**: Presets handle ~90% of cases, so give one-click options like Last 7 days, Last 30 days, Last quarter, Today and Yesterday, and keep custom ranges for edge cases.
- **Why**: Most users want to skip calendar clicking.
- **Do / Don't**: Do open with presets. Don't make people use the calendar for everyday ranges.
- **Audit check**: Look in date-range pickers for a presets list.
- **Restyle fix**: Add a preset column/list beside the calendar.
- **Severity**: medium ; **Tags**: forms, interaction-cost

### W1-47 Make range selection legible and show two months  (src: date-pickers)
- **Rule**: Hover paints a live preview, first click locks start, second locks end, and edges remain draggable. Show two months side by side (three on large screens) so ranges cross month boundaries.
- **Why**: Avoids repeated "next" clicks and restarts.
- **Do / Don't**: Do render two months. Don't make users click "next" four times for a nearby date.
- **Audit check**: Check calendar for `numberOfMonths`/`months` prop = 1, missing hover preview.
- **Restyle fix**: Set months to 2 (3 on wide screens) and add range preview styling.
- **Severity**: low ; **Tags**: forms, interaction-cost

### W1-48 Fully support keyboard in date pickers  (src: date-pickers)
- **Rule**: Support the whole keyboard set: arrows traverse the grid, direct typing of a date works, Enter confirms, Escape dismisses, Page Up shifts one month, Shift+Page Up shifts one year.
- **Why**: Keyboard users get equal access and speed.
- **Do / Don't**: Do implement every one of these keys. Don't build a grid that only works with a mouse.
- **Audit check**: Check for `onKeyDown` with `PageUp`/`Arrow*`/`Escape` handling and an editable text input.
- **Restyle fix**: Add key handlers and a typed-input field.
- **Severity**: medium ; **Tags**: accessibility, forms

### W1-49 Use a full-screen sheet for mobile date picking  (src: date-pickers)
- **Rule**: On mobile use a vertically scrolling full-screen sheet with today anchored at the top and a large confirm button at the bottom in thumb reach.
- **Why**: Popovers are cramped on phones.
- **Do / Don't**: Do switch to a sheet on mobile. Don't shrink the desktop popover.
- **Audit check**: Check for responsive branching on the date picker (media query / `useIsMobile`); popover used at small widths.
- **Restyle fix**: Render picker as full-screen sheet below the mobile breakpoint.
- **Severity**: medium ; **Tags**: mobile, forms

### W1-50 Show live contrast in color pickers  (src: color-picker-ux)
- **Rule**: Show a contrast-ratio badge while picking that turns from red to green, so failing pairs are stopped before release.
- **Why**: Checking during selection beats checking in review.
- **Do / Don't**: Do verify contrast as the user picks. Don't release a picker that is only a gradient and a slider.
- **Audit check**: Check for a contrast calculation in picker components.
- **Restyle fix**: Add a WCAG ratio badge against the target background.
- **Severity**: low ; **Tags**: color, contrast, forms

### W1-51 Give pickers OKLCH, memory and alpha previews  (src: color-picker-ux)
- **Rule**: Offer OKLCH alongside hex (lightness, chroma, hue), keep recent swatches and saved palettes (last five picks), and preview alpha over a checkerboard on light and dark backgrounds.
- **Why**: Predictable adjustment, fewer repeated picks, honest transparency.
- **Do / Don't**: Do expose recents and a checkerboard. Don't preview alpha on white only.
- **Audit check**: Look for `oklch` input, recent-swatches state and checkerboard background in picker.
- **Restyle fix**: Add OKLCH fields, recents row and checkerboard preview.
- **Severity**: low ; **Tags**: color, forms, interaction-cost

### W1-52 Generate tokens from one picked hue  (src: color-picker-ux)
- **Rule**: Turn one pick into a system by generating tints and shades from a single hue, yielding ten tokens from one decision.
- **Why**: Every choice cascades through the UI.
- **Do / Don't**: Do derive the scale from one hue. Don't pick each shade separately.
- **Audit check**: Check palette definitions for hand-picked unrelated shades vs generated steps.
- **Restyle fix**: Derive tints/shades via OKLCH lightness steps from the brand hue.
- **Severity**: low ; **Tags**: color, craft

## Web patterns: Overlays

### W1-53 Use bottom sheets for thumb-zone actions  (src: bottom-sheets)
- **Rule**: Put menus and primary actions at the bottom, where thumbs rest, not in the unreachable upper-right corner of tall phones. Unlike a blocking modal, a sheet leaves the page visible.
- **Why**: On tall screens the top can't be reached one-handed.
- **Do / Don't**: Do pin actions to the bottom edge. Don't hide frequent menus in the top right, or cover everything with a modal.
- **Audit check**: Check mobile layouts for key actions in top-right (`top-0 right-0`) and full-screen modals for simple choices.
- **Restyle fix**: Move mobile menus/actions into a bottom sheet.
- **Severity**: medium ; **Tags**: mobile, interaction-cost, navigation

### W1-54 Give sheets snap points, drag-to-dismiss, and scrim with scroll lock  (src: bottom-sheets)
- **Rule**: Allow the sheet to rest half-open or at full height, accept a downward drag to dismiss, and darken the page behind with a scrim while locking body scroll.
- **Why**: Adjustable height and gestures fit the need, and attention stays on the sheet.
- **Do / Don't**: Do add snap points and lock scrolling. Don't let the background scroll behind the sheet.
- **Audit check**: grep for `snapPoints`, drag handlers, backdrop element, `overflow: hidden` on body when sheet is open.
- **Restyle fix**: Add snap points, drag-to-dismiss, scrim and scroll lock.
- **Severity**: medium ; **Tags**: mobile, states, interaction-cost

### W1-55 Keep context menus inside the viewport  (src: context-menu)
- **Rule**: Measure before opening: flip up when there's no room below, mirror left when none to the right, anchored to the cursor.
- **Why**: Menus clipped off-screen are unusable.
- **Do / Don't**: Do flip based on available space. Don't let menus overflow the viewport.
- **Audit check**: Check menu positioning for collision handling (`avoidCollisions`, `flip`, `getBoundingClientRect`).
- **Restyle fix**: Add collision-aware positioning.
- **Severity**: medium ; **Tags**: layout, interaction-cost

### W1-56 Group menu actions and isolate Delete in red  (src: context-menu)
- **Rule**: Cluster actions by purpose with dividers (Rename beside Duplicate, Share beside Copy link) and set Delete apart at the bottom in red; a dozen flat actions are just noise.
- **Why**: Grouping aids scanning and guards against mis-clicks.
- **Do / Don't**: Do separate groups with dividers and keep the destructive action apart. Don't dump a dozen ungrouped items.
- **Audit check**: Count menu items without separators (`Separator`, `<hr>`, `role="separator"`); check delete is last and styled destructive.
- **Restyle fix**: Add separators and move destructive item to the bottom in red.
- **Severity**: medium ; **Tags**: hierarchy, states

### W1-57 Add a safe triangle for submenus  (src: context-menu)
- **Rule**: Draw an invisible safe triangle between the cursor and the submenu so it stays open while the pointer travels diagonally toward it (hover intent).
- **Why**: Without it, submenus close as the cursor leaves the row.
- **Do / Don't**: Do implement hover-intent handling. Don't dismiss a submenu the instant the pointer leaves its row.
- **Audit check**: Check submenu hover code for immediate `onMouseLeave` close without delay/safe-area logic.
- **Restyle fix**: Add a safe-triangle or short close delay.
- **Severity**: low ; **Tags**: interaction-cost, craft

### W1-58 Give context menus keyboard control and mobile long-press  (src: context-menu)
- **Rule**: Arrow keys step through items, typed letters jump to matches, Escape closes one level; on touch screens, pressing and holding brings up the same actions in a bottom sheet.
- **Why**: Power users and touch users need equal access.
- **Do / Don't**: Do support both keyboard control and long press. Don't build a menu reachable only by right-click.
- **Audit check**: grep `onContextMenu` without `touchstart`/long-press handling and without key handlers.
- **Restyle fix**: Add key navigation and long-press trigger opening a sheet.
- **Severity**: medium ; **Tags**: accessibility, mobile, interaction-cost

### W1-59 Give dropdown triggers a 48px target with a caret  (src: dropdown-design)
- **Rule**: A dropdown trigger should look pressable: hover state included, a caret icon showing, and a touch area of 48px; a 30px box with a faint outline fails.
- **Why**: Obvious affordance and a target that's easy to reach.
- **Do / Don't**: Do give it a 48px touch area, a caret and hover feedback. Don't ship a small trigger with weak contrast.
- **Audit check**: Check trigger height (<48px, `h-8`/`h-7`), missing chevron icon, missing `hover:` style.
- **Restyle fix**: Set `min-height: 48px`, add a caret, add hover state.
- **Severity**: medium ; **Tags**: forms, mobile, icons, states

### W1-60 Flip dropdowns upward and add search past ~10 items  (src: dropdown-design)
- **Rule**: Open the menu upward when there isn't room below, and add a search field once a list exceeds ~10 items.
- **Why**: Prevents clipping and scroll-hunting.
- **Do / Don't**: Do flip and add filtering. Don't let long menus clip off the viewport.
- **Audit check**: Check for collision handling and a filter input in selects with >10 options.
- **Restyle fix**: Enable collision flip; add a searchable combobox for long lists.
- **Severity**: medium ; **Tags**: forms, interaction-cost, layout

### W1-61 Wire dropdown keyboard support  (src: dropdown-design)
- **Rule**: Custom dropdowns respond to the Down/Up arrows for moving the highlight, Enter to choose, and Escape to dismiss.
- **Why**: People who cannot or prefer not to use a pointer still need to operate the menu.
- **Do / Don't**: Do handle arrows, Enter and Escape. Don't build a menu that works only with a mouse.
- **Audit check**: grep `onKeyDown` handling `ArrowDown`/`Enter`/`Escape` on custom dropdowns; check `role="listbox"`/`menu`.
- **Restyle fix**: Add key handlers (or use a headless primitive).
- **Severity**: high ; **Tags**: accessibility, forms

## Web patterns: Navigation

### W1-62 Make command palettes fuzzy and grouped  (src: command-palette)
- **Rule**: Use fuzzy subsequence matching (typing "stg" finds Settings, Storage, Staging) and group results into labeled sections like Recent, Actions, Pages.
- **Why**: Exact matching feels broken; flat lists are hard to scan.
- **Do / Don't**: Do fuzzy-match and group. Don't require exact substrings.
- **Audit check**: Check filter uses `includes`/`startsWith` instead of fuzzy (e.g. `cmdk`, fuse); check for group headings.
- **Restyle fix**: Switch to fuzzy matching and add section headings.
- **Severity**: medium ; **Tags**: navigation, interaction-cost

### W1-63 Prefill palette and keep it fully keyboard-driven  (src: command-palette)
- **Rule**: Open with recent or suggested commands rather than a blank void; arrows move, Enter runs, Esc closes (and goes back one level).
- **Why**: Gives a starting point and avoids mouse return.
- **Do / Don't**: Do prefill suggestions. Don't open to an empty "No results" state.
- **Audit check**: Check palette's empty-query state renders items; check key handlers.
- **Restyle fix**: Show recents/suggestions on open; add key bindings.
- **Severity**: medium ; **Tags**: navigation, states, accessibility

### W1-64 Load async commands inline with nested drill-down  (src: command-palette)
- **Rule**: For async commands, show a spinner inline and leave the palette open; nested commands get a breadcrumb, and Esc steps back exactly one level.
- **Why**: Keeps the screen responsive and preserves context.
- **Do / Don't**: Do spin inline and support breadcrumbs. Don't lock up the entire screen.
- **Audit check**: Check async command handlers closing the palette or setting global loading overlay.
- **Restyle fix**: Render inline loading rows and breadcrumb level state.
- **Severity**: low ; **Tags**: navigation, states

## Web patterns: Data

### W1-65 Start bar chart y-axes at zero  (src: charts-that-lie)
- **Rule**: Every bar chart's y-axis must begin at zero; a truncated baseline turns +4% into a fake +400%.
- **Why**: It's the most common way charts mislead.
- **Do / Don't**: Do start at zero. Don't crop axes to exaggerate differences.
- **Audit check**: grep `domain=`, `min:`, `beginAtZero: false`, `yAxis.min` on bar charts.
- **Restyle fix**: Set the baseline to 0.
- **Severity**: high ; **Tags**: craft, hierarchy

### W1-66 Pick the chart form from the question  (src: charts-that-lie)
- **Rule**: Compare values with bars, show change over time with lines, and avoid pies beyond ~5 slices; the question, not taste, selects the form.
- **Why**: A mismatched form hides the message.
- **Do / Don't**: Do select the chart from the question. Don't use a pie once there are more than five slices.
- **Audit check**: Count slices in pie/donut charts (>5); check line charts used for non-time categories.
- **Restyle fix**: Convert to bar chart or group small slices.
- **Severity**: medium ; **Tags**: craft, hierarchy

### W1-67 Balance chart aspect ratio near 45° slope  (src: charts-that-lie)
- **Rule**: The width-to-height proportion of a chart changes how its trend reads; choose dimensions so the typical line angle is about 45°.
- **Why**: A too-flat plot hides growth while a too-tall one exaggerates it into a spike.
- **Do / Don't**: Do pick the proportion for an honest-looking angle. Don't compress or stretch the plot at random.
- **Audit check**: Inspect chart container width/height ratios for extreme values (very wide, very short).
- **Restyle fix**: Adjust height/width so the main series slopes ~45°.
- **Severity**: low ; **Tags**: craft, layout

### W1-68 Maximize data-ink and label directly  (src: charts-that-lie)
- **Rule**: Cut boxed legends, 3D skew, drop shadows and gridlines, and name each line directly on the chart. Every pixel left should carry data.
- **Why**: Decoration adds no information.
- **Do / Don't**: Do take out decoration that isn't data. Don't add shadows, 3D or gridlines that encode nothing.
- **Audit check**: Check chart config for `CartesianGrid`, `shadow`, 3D options, and external legends.
- **Restyle fix**: Remove decoration and place labels on series ends.
- **Severity**: low ; **Tags**: craft, color

### W1-69 Use color as encoding with one hero series  (src: charts-that-lie)
- **Rule**: Highlight the key series with a single accent color, and pick categorical, sequential or diverging scales according to the data type.
- **Why**: Color should encode information, not decorate.
- **Do / Don't**: Do use one hero color. Don't give every series the same vivid color.
- **Audit check**: Count saturated colors across series; check scale type vs data type.
- **Restyle fix**: Mute secondary series in grey; accent the focus series.
- **Severity**: low ; **Tags**: color, hierarchy

### W1-70 Title charts with the takeaway  (src: charts-that-lie)
- **Rule**: Write chart titles as the conclusion ("Revenue flat since March") rather than the metric ("Quarterly revenue").
- **Why**: Readers shouldn't hunt for the story.
- **Do / Don't**: Do state the insight. Don't use metric-only titles.
- **Audit check**: Review chart titles/headings for generic metric names.
- **Restyle fix**: Rewrite titles as insight statements.
- **Severity**: low ; **Tags**: copy, hierarchy

### W1-71 Use tri-state sorting on tables  (src: data-table)
- **Rule**: Sorting cycles ascending → descending → original order; a binary toggle loses the natural order.
- **Why**: Users need a way back to the default.
- **Do / Don't**: Do add a third click that resets. Don't ship a binary sort.
- **Audit check**: Check sort state logic for only `asc`/`desc` values.
- **Restyle fix**: Add a null/original state to the sort cycle.
- **Severity**: low ; **Tags**: tables, interaction-cost

### W1-72 Right-align numbers with tabular figures  (src: data-table)
- **Rule**: Right-align numeric columns and set tabular figures so every digit lines up on one grid.
- **Why**: Left-aligned proportional digits wobble and resist quick comparison.
- **Do / Don't**: Do right-align numbers using tabular numerals. Don't left-align numbers set in proportional digits.
- **Audit check**: grep `tabular-nums` / `font-variant-numeric` and `text-right` on numeric cells.
- **Restyle fix**: Add `tabular-nums text-right` to numeric columns and headers.
- **Severity**: high ; **Tags**: tables, typography, alignment

### W1-73 Freeze header and first column  (src: data-table)
- **Rule**: Make the header stick during vertical scrolling and pin the first column during horizontal scrolling, giving each a faint shadow.
- **Why**: Labels must stay within reach while scrolling.
- **Do / Don't**: Do make the header and first column sticky. Don't let labels disappear when scrolling.
- **Audit check**: grep `position: sticky` / `sticky top-0` / `sticky left-0` on table head and first column.
- **Restyle fix**: Apply sticky positioning with background and edge shadow.
- **Severity**: medium ; **Tags**: tables, layout

### W1-74 Control row density through a single token  (src: data-table)
- **Rule**: Provide one density control that switches between a few row heights (for example 36, 48 and 60px); use zebra striping when rows are roomy and a single hairline when compact.
- **Why**: Predictable rhythm instead of guessed spacing.
- **Do / Don't**: Do derive density from a token. Don't set row padding ad hoc.
- **Audit check**: Check row `height`/padding values for one-offs; look for a density setting.
- **Restyle fix**: Add density tokens and apply to row height/padding.
- **Severity**: low ; **Tags**: tables, spacing

### W1-75 Make the entire table row the selection target  (src: data-table)
- **Rule**: Selected rows get a full tint plus an accent left bar and checkbox, and the whole row should be clickable, not just a tiny checkbox.
- **Why**: Larger target is easier to hit and state is clearer.
- **Do / Don't**: Do tint and mark the whole row. Don't limit selection to a checkbox hit area.
- **Audit check**: Check row `onClick`/selected styles (`data-[state=selected]`) and checkbox target size.
- **Restyle fix**: Add row-level click and selected styling.
- **Severity**: low ; **Tags**: tables, states, interaction-cost

## Web patterns: Surfaces

### W1-76 Lift cards ~8px over ~200ms on hover  (src: card-hover-anatomy)
- **Rule**: On hover, raise the card roughly 8px while its shadow grows, over ~200ms ease-out. Quicker looks twitchy; slower looks stuck.
- **Why**: Gives the card a sense of weight.
- **Do / Don't**: Do animate lift and shadow together. Don't make the lift much shorter or longer than 200ms.
- **Audit check**: grep `hover:-translate-y-*`, `:hover { transform: translateY(` and `transition` on cards; check shadow change and duration.
- **Restyle fix**: Add `hover:-translate-y-2 hover:shadow-lg transition duration-200 ease-out`.
- **Severity**: low ; **Tags**: cards, shadows, motion, depth

### W1-77 Scale the image inside the card, never the card itself  (src: card-hover-anatomy)
- **Rule**: Scaling the entire card nudges neighbors and breaks the grid. Instead enlarge the image to ~1.05 within an `overflow-hidden` frame while the container stays put.
- **Why**: The content moves but the card's footprint stays.
- **Do / Don't**: Do enlarge the image inside its frame. Don't apply `scale` to the card container.
- **Audit check**: grep `hover:scale-*` on card root; check image wrapper has `overflow-hidden`.
- **Restyle fix**: Move scale to the `<img>` with `group-hover:scale-105` inside an overflow-hidden wrapper.
- **Severity**: medium ; **Tags**: cards, layout, motion, imagery

### W1-78 Reveal card actions staggered at the bottom  (src: card-hover-anatomy)
- **Rule**: Reveal hidden actions (favorite, cart, share) one after another, ~60ms apart, anchored to the card's bottom; the reveal adds affordance rather than altering layout.
- **Why**: Keeps actions tidy and layout steady.
- **Do / Don't**: Do anchor revealed actions to the bottom edge. Don't cover the title with buttons or push them past the card edge.
- **Audit check**: Check hover-revealed buttons for absolute positioning overlapping title and for `transition-delay` ~60ms steps.
- **Restyle fix**: Position actions in the bottom bar with 60ms staggered delays.
- **Severity**: low ; **Tags**: cards, motion, layout

### W1-79 Signal card interactivity with an edge accent  (src: card-hover-anatomy)
- **Rule**: A pulsing accent border or gradient sweep around the edge on hover keeps the card from looking flat and signals it's interactive.
- **Why**: Cards need a visible interactive cue.
- **Do / Don't**: Do add a hover edge cue. Don't leave clickable cards with no hover change.
- **Audit check**: Check clickable cards for missing `hover:` border/shadow/background.
- **Restyle fix**: Add an accent border or gradient edge on hover.
- **Severity**: low ; **Tags**: cards, states, borders

### W1-80 Write a plain headline naming outcome and audience  (src: de-ai-landing-hero)
- **Rule**: Use a plain-text headline stating what the product does and a subtitle naming who it's for, instead of a gradient headline stuffed with adjectives like "Supercharge" or "seamless".
- **Why**: Adjective-heavy heroes signal nothing concrete.
- **Do / Don't**: Do name the outcome and audience. Don't fill headlines with supercharge/seamless/powerful.
- **Audit check**: grep hero copy for `supercharge|seamless|powerful|unleash` and `bg-clip-text text-transparent` gradients.
- **Restyle fix**: Rewrite headline as a concrete outcome; use solid text color.
- **Severity**: medium ; **Tags**: copy, typography, hierarchy

### W1-81 Keep one accent and drop background blobs  (src: de-ai-landing-hero)
- **Rule**: Pair a neutral background with a single splash of color, placed only on the product screenshot and primary button: one accent, zero blobs.
- **Why**: Purple gradient smears add energy but no content.
- **Do / Don't**: Do keep the accent for the screenshot and primary CTA. Don't add decorative gradient blobs.
- **Audit check**: grep `blur-3xl`, `radial-gradient` blobs, absolute gradient circles in hero.
- **Restyle fix**: Remove blobs and set a neutral background.
- **Severity**: medium ; **Tags**: color, depth, hierarchy

### W1-82 Make one primary hero button and a text-link secondary  (src: de-ai-landing-hero)
- **Rule**: Equal-sized buttons side by side divide attention; keep one primary button and make the other a text link with an arrow, shifting emphasis from 50/50 to about 90/10.
- **Why**: One obvious primary action sharpens conversion focus.
- **Do / Don't**: Do downgrade the secondary action. Don't put two identical buttons next to each other.
- **Audit check**: Check hero for two buttons with same variant/size.
- **Restyle fix**: Convert the secondary to a link with an arrow icon.
- **Severity**: medium ; **Tags**: buttons, hierarchy

### W1-83 Replace vague social proof with one specific quote  (src: de-ai-landing-hero)
- **Rule**: Replace "Trusted by 10,000+ users" over grey logos with one testimonial giving name, role and a quantified outcome, such as month-end close taking three hours instead of a week.
- **Why**: Numbers nobody can verify and unfamiliar logos aren't credible.
- **Do / Don't**: Do feature one named customer's role and quantifiable result. Don't use counts nobody can verify.
- **Audit check**: grep "Trusted by" with numbers and logo strips; check testimonials lack name/role/result.
- **Restyle fix**: Replace with a named testimonial including a metric.
- **Severity**: low ; **Tags**: copy, craft

### W1-84 Replace icon-circle feature rows with annotated product shots  (src: de-ai-landing-hero)
- **Rule**: Instead of three cards that each pair a circled icon with a single word (Fast, Secure, Easy), show one product screenshot with three annotations pointing at actual UI elements.
- **Why**: Pages with nothing concrete to show fall back on decoration; showing the product itself removes the generic feel.
- **Do / Don't**: Do show the real product. Don't build feature rows made of circled icons and single-word captions.
- **Audit check**: Look for 3-column grids of icon-in-circle + one-word titles ("Fast", "Secure", "Easy").
- **Restyle fix**: Substitute with a screenshot plus callouts.
- **Severity**: low ; **Tags**: imagery, copy, cards, icons

## Web patterns: Interactions

### W1-85 Make the accordion header a real button with ARIA  (src: accordion-disclosure)
- **Rule**: Render the header as a `<button>`, using `aria-expanded` for its state and `aria-controls` to reference the panel, so Enter/Space toggles it and a focus ring appears.
- **Why**: Native semantics provide keyboard and screen-reader support.
- **Do / Don't**: Do use a button with `aria-expanded`/`aria-controls`. Don't use a clickable `<div>`.
- **Audit check**: grep accordion headers for `<div onClick` and missing `aria-expanded`/`aria-controls`.
- **Restyle fix**: Change to `<button>` and add the two ARIA attributes.
- **Severity**: high ; **Tags**: accessibility, interaction-cost

### W1-86 Choose single- vs multi-open by content  (src: accordion-disclosure)
- **Rule**: In an accordion only one panel is open at once, whereas a disclosure allows several. Use single mode for sequential steps and multi for FAQ lists.
- **Why**: Open behavior should suit how the content gets used.
- **Do / Don't**: Do pick the open mode that fits the content. Don't restrict FAQ lists to one open item at a time.
- **Audit check**: Check accordion `type="single"|"multiple"` against content type.
- **Restyle fix**: Set the open mode appropriately.
- **Severity**: low ; **Tags**: interaction-cost, navigation

### W1-87 Anchor the tapped header when lower items expand  (src: accordion-disclosure)
- **Rule**: Reveal the new content with a stagger, and hold the tapped header in place when an item near the bottom opens, so nothing lurches under the user's eyes.
- **Why**: Stops disorienting jumps in scroll position.
- **Do / Don't**: Do hold the tapped header steady. Don't allow the list to jump when a lower item opens.
- **Audit check**: Check expand handlers for `scrollIntoView`/scroll anchoring (`overflow-anchor`) handling.
- **Restyle fix**: Scroll to keep the header fixed on expand.
- **Severity**: low ; **Tags**: interaction-cost, motion

### W1-88 Show drag pickup through scale, shadow and tilt  (src: drag-and-drop)
- **Rule**: A grabbed item should appear lifted off the surface: tilt it slightly, deepen its shadow and enlarge it a little, all together.
- **Why**: Signals the item has left the surface.
- **Do / Don't**: Do apply all three cues together. Don't let the dragged item sit flat.
- **Audit check**: Check drag overlay/`isDragging` styles for `scale`, `shadow`, `rotate`.
- **Restyle fix**: Add `scale-105 shadow-xl rotate-2` to dragging state.
- **Severity**: low ; **Tags**: depth, shadows, states, motion

### W1-89 Reveal drop targets during the drag  (src: drag-and-drop)
- **Rule**: Show the landing spot before release: insertion line between items, filled highlight for a column, dashed outlines for valid slots. Snap to the nearest valid slot except on free canvases.
- **Why**: Dragging should never be guesswork.
- **Do / Don't**: Do highlight the exact target throughout the drag. Don't demand pixel-perfect placement when snapping can handle it.
- **Audit check**: Check drag code for `isOver` styles and snap logic.
- **Restyle fix**: Add drop-zone indicators matched to scope and snap behavior.
- **Severity**: medium ; **Tags**: states, interaction-cost

### W1-90 Offer a ~5s undo after drops  (src: drag-and-drop)
- **Rule**: After every drop show a brief undo toast (~5 seconds), so a misplaced item costs a single click.
- **Why**: Drags are easy to get wrong.
- **Do / Don't**: Do give a short undo window. Don't let a mistaken drop stay permanent.
- **Audit check**: Check onDragEnd handlers for undo toast.
- **Restyle fix**: Show an "Undo" toast with ~5s timeout after drop.
- **Severity**: low ; **Tags**: interaction-cost, states

## Web patterns: Feedback

### W1-91 Use named buttons for destructive confirmations  (src: destructive-actions)
- **Rule**: Put the action itself on each button ("Delete project" / "Keep project") rather than a generic Yes/No; the verb does the warning work.
- **Why**: People skip past generic confirmation prompts.
- **Do / Don't**: Do label the destructive button with its own action. Don't let a vague "Are you sure?" prompt carry the confirmation.
- **Audit check**: grep dialogs for `Yes`/`No`/`OK` button labels and "Are you sure".
- **Restyle fix**: Rename buttons to verb + object.
- **Severity**: medium ; **Tags**: copy, buttons, interaction-cost

### W1-92 Reserve red for destruction and move delete off the confirm spot  (src: destructive-actions)
- **Rule**: Spend red only on destructive actions (not logout, badges, alerts), and never place a destructive button where confirm normally sits.
- **Why**: Overused red cries wolf, and muscle memory clicks primary spots blind.
- **Do / Don't**: Do reserve red and reposition delete. Don't put delete in the usual confirm position.
- **Audit check**: grep `bg-red-*`/`text-red-*`/`destructive` on non-destructive elements; check button order in dialogs.
- **Restyle fix**: Recolor non-destructive red usages and reorder dialog actions. (On conflict the playbook wins: see G-12, Cancel left / destructive right.)
- **Severity**: medium ; **Tags**: color, buttons, interaction-cost

### W1-93 Add friction to irreversible deletes  (src: destructive-actions)
- **Rule**: Use a hold-to-confirm ring filling over ~300ms (early release cancels), a bordered labeled danger zone at page bottom, and a cancelable cooldown such as 14 days.
- **Why**: Gesture, location and time slow people down without a modal.
- **Do / Don't**: Do add a hold gesture, danger zone or grace period. Don't let irreversible deletion be one easy click.
- **Audit check**: Check delete flows for danger-zone section, hold gesture, scheduled deletion.
- **Restyle fix**: Move delete into a danger zone and add hold or grace period.
- **Severity**: medium ; **Tags**: interaction-cost, states

### W1-94 Don't use disabled buttons to block submit  (src: disabled-buttons)
- **Rule**: Disabled buttons leave tab order, mute screen readers and block pointer events, so tooltips never fire. Keep it active, validate on click, flag blocking fields and focus the first.
- **Why**: Users can't see why submission is blocked.
- **Do / Don't**: Do validate when clicked and focus the first error. Don't disable submit and make users guess.
- **Audit check**: grep `disabled={!isValid}`, `disabled` on submit buttons, tooltips on disabled controls.
- **Restyle fix**: Remove `disabled`, add click validation with error messages and focus.
- **Severity**: high ; **Tags**: buttons, accessibility, forms, states

### W1-95 Distinguish loading from disabled  (src: disabled-buttons)
- **Rule**: While a request runs, keep focus on the button, show a spinner and set `aria-busy` (and expose the busy status in visible/live text) rather than greying it out. Disabled labels are often pale (around 1.9:1), which makes them hard to read.
- **Why**: Greying out throws away the user's position, and the dimmed label is hard to read just when they want reassurance.
- **Do / Don't**: Do use a busy state. Don't treat loading as disabled.
- **Audit check**: grep `disabled={isLoading}`/`isSubmitting` and check `aria-busy` plus a visible/live status message; look for pale disabled labels that are hard to read.
- **Restyle fix**: Use `aria-busy="true"` with a spinner, expose the busy status in visible/live text, and keep the button focusable.
- **Severity**: medium ; **Tags**: buttons, states, accessibility, contrast

### W1-96 Acknowledge every interaction within 400ms  (src: doherty-threshold)
- **Rule**: Aim to respond inside the Doherty Threshold of 400ms: below 200ms feels instant, 200–400ms is acceptable, above 400ms damages engagement. Perceived speed beats raw speed.
- **Why**: Slow replies make users mentally check out.
- **Do / Don't**: Do acknowledge every interaction within 400ms. Don't hold all visual response until the server answers.
- **Audit check**: Check async actions for immediate loading/pressed state; look for await before any UI update.
- **Restyle fix**: Add immediate acknowledgment (state change, spinner or skeleton).
- **Severity**: high ; **Tags**: states, interaction-cost, motion

### W1-97 Use skeletons, optimistic updates and progress for waits  (src: doherty-threshold)
- **Rule**: Show placeholder skeleton shapes as soon as a screen opens, update optimistically when success is near-certain, and use spinners, progress or inline status for waits beyond the threshold.
- **Why**: Unavoidable waits still feel responsive.
- **Do / Don't**: Do display skeletons and progress. Don't leave the screen empty or frozen while data loads.
- **Audit check**: grep loading branches returning `null` or blank; check for `Skeleton`/`animate-pulse` and progress components.
- **Restyle fix**: Add skeleton placeholders and progress indicators.
- **Severity**: high ; **Tags**: states, interaction-cost
