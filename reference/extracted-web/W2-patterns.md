# Web patterns W2
> Source: public UX pattern pages (paraphrased tips). Not part of the PDF playbook.

## Web patterns: Motion

### W2-01 Default to ease-out for entering elements  (src: easing-curves)
- **Rule**: Entering elements should begin quickly then slow as they settle (ease-out); reserve linear easing for endless loops like spinners or marquees.
- **Why**: Slowing to rest imitates physical objects; linear timing on UI that starts and stops feels robotic.
- **Do / Don't**: Do apply ease-out to entrances. Don't apply linear timing to UI that begins and halts.
- **Audit check**: grep `transition-timing-function: linear`, `ease-linear`, `animation-timing-function: linear` on non-spinner/marquee elements; check enter animations use `ease-out`/`cubic-bezier` deceleration.
- **Restyle fix**: Replace linear timing on entering UI with ease-out (`ease-out` in Tailwind); exits use the leaving curve (ease-in) per W1-27; keep linear only for spinners and marquees.
- **Severity**: medium ; **Tags**: motion, craft

### W2-02 Add a restrained spring overshoot to presses and modals  (src: easing-curves)
- **Rule**: A slight spring overshoot on button presses, modals, and confirmations makes the UI feel alive and premium. Keep stiffness/bounce low so the element does not wobble.
- **Why**: A little overshoot reads as polish; too much reads as broken.
- **Do / Don't**: Do add subtle overshoot to presses, modals, and confirmations. Don't crank bounce until the element wobbles.
- **Audit check**: grep spring configs (`type: "spring"`, `stiffness`, `damping`, `cubic-bezier` with y>1); flag very low damping / high bounce values that produce visible oscillation.
- **Restyle fix**: Apply a single low-bounce spring (or overshoot cubic-bezier) to press/modal/confirmation transitions and raise damping if it wobbles.
- **Severity**: low ; **Tags**: motion, craft

### W2-03 Stagger list and card entrances  (src: easing-curves)
- **Rule**: Offset list and card entrances by a few frames each so they cascade in instead of appearing as one rigid block.
- **Why**: A cascade guides the eye and feels less abrupt than a single hard snap.
- **Do / Don't**: Do stagger siblings by a few frames. Don't mount a whole grid/list with one simultaneous pop.
- **Audit check**: grep for `staggerChildren`, `animation-delay`, `transition-delay` on list/card groups; flag lists that enter all at once with no delay offset.
- **Restyle fix**: Add an incremental per-item delay (index × small step) to list/card enter animations.
- **Severity**: low ; **Tags**: motion, craft

### W2-04 Reuse one small set of easing curves everywhere  (src: easing-curves)
- **Rule**: Use the same handful of curves for button press, card cascade, and sheet open so motion feels coherent rather than stitched together.
- **Why**: Consistent easing is a large part of perceived coherence.
- **Do / Don't**: Do define easing tokens and reuse them. Don't scatter one-off cubic-bezier values across components.
- **Audit check**: grep and count distinct `cubic-bezier(...)` / easing values across the codebase; many unique values with no shared tokens is a flag.
- **Restyle fix**: Define 2–3 easing tokens (CSS variables or Tailwind theme) and replace ad-hoc curves with them.
- **Severity**: low ; **Tags**: motion, craft

## Web patterns: Fundamentals

### W2-05 Group related items with shared visual properties  (src: gestalt-laws)
- **Rule**: Items sharing color, shape, or size look like one set, so recoloring rows can carve a uniform grid into Navigation, Content, and Actions. Line related controls up along one axis.
- **Why**: Brains group by similarity and continuity automatically.
- **Do / Don't**: Do style related items alike and align them on one line. Don't scatter them at mixed offsets or angles.
- **Audit check**: In screenshots, check that items in one function share color/size/shape and that controls share a left or center edge; flag inconsistent offsets among siblings.
- **Restyle fix**: Unify styling of related items and snap them to one alignment axis.
- **Severity**: medium ; **Tags**: hierarchy, alignment, layout

### W2-06 Wrap distant related elements in a shared container  (src: gestalt-laws)
- **Rule**: When proximity alone cannot group elements, a shared border or card (common region) signals belonging without moving them closer, such as settings wrapped in cards.
- **Why**: A shared region groups items even when they sit far apart.
- **Do / Don't**: Do wrap loosely placed related elements in a bordered card. Don't rely on whitespace alone to group dispersed items.
- **Audit check**: Look for related controls across a page with no wrapping container (`border`, `rounded`, `bg-*` card wrapper) and ambiguous group boundaries.
- **Restyle fix**: Add a bordered/filled card around each logical group.
- **Severity**: low ; **Tags**: cards, borders, layout

### W2-07 Dim and blur the background behind a modal  (src: gestalt-laws)
- **Rule**: Blur and dim what is behind a dialog so the dialog stands out as the focal figure against the background.
- **Why**: Figure-ground separation makes the dialog feel deliberate rather than floating.
- **Do / Don't**: Do dim/blur the backdrop. Don't show a modal over an undimmed page where it competes with the content.
- **Audit check**: grep modal/dialog markup for backdrop/overlay: look for `bg-black/*`, `backdrop-blur`, `::backdrop`; flag dialogs with no scrim.
- **Restyle fix**: Add a scrim (e.g. semi-transparent dark overlay) and optional `backdrop-filter: blur()` behind the modal.
- **Severity**: medium ; **Tags**: depth, hierarchy

### W2-08 Derive spacing and type scales from one ratio  (src: golden-ratio)
- **Rule**: Multiply a base unit by 1.618 for spacing (8 → 13 → 21 → 34 → 55) and type (body 16px, subheading 26px, heading 42px, display 68px), rounded to whole pixels.
- **Why**: One ratio gives gaps and hierarchy a common rhythm and removes guesswork.
- **Do / Don't**: Do derive scales from one base and ratio, rounded to usable pixels. Don't choose sizes ad hoc or force the ratio against an existing 8px grid.
- **Audit check**: Collect distinct font sizes and spacing values (`text-[..px]`, `gap-[..]`, `p-[..]`); flag many one-off values with no consistent step ratio.
- **Restyle fix**: Replace arbitrary sizes with a tokenized scale such as 8/13/21/34/55 and 16/26/42/68, rounded to your grid. (On conflict the playbook wins: see B-15/B-17, base-unit multiples.)
- **Severity**: medium ; **Tags**: spacing, typography, hierarchy

### W2-09 Split layouts roughly 62% / 38%  (src: golden-ratio)
- **Rule**: Divide the screen around the golden ratio, about 62% / 38%, giving the larger panel to primary content and the smaller to secondary actions.
- **Why**: Unequal proportions create clear primary/secondary hierarchy and balanced composition.
- **Do / Don't**: Do give primary content the larger share. Don't force the ratio where real content needs otherwise.
- **Audit check**: In two-pane layouts, check widths (`w-[62%]`, `grid-cols-[1.618fr_1fr]`, flex ratios); flag 50/50 splits where one pane is clearly secondary.
- **Restyle fix**: Set the primary pane to ~62% and secondary to ~38% of the width.
- **Severity**: low ; **Tags**: layout, hierarchy

### W2-10 Use a 12-column grid with clear column ratios  (src: grid-system)
- **Rule**: Start from a 12-column grid because 12 divides into halves, thirds, quarters, and sixths. Structure pages with ratios like 4:8 (sidebar + content), 6:6 (even split), or 3:9 (narrow nav + wide canvas).
- **Why**: A shared grid lets nearly any layout map cleanly and read as intentional.
- **Do / Don't**: Do anchor elements to shared column edges using clean ratios. Don't use arbitrary widths where 4:8 or 6:6 already fits.
- **Audit check**: grep `grid-cols-12`, `col-span-*`; flag hard-coded pixel widths on layout blocks and edges that do not align to a column.
- **Restyle fix**: Rebuild layout blocks as column spans on a 12-col grid.
- **Severity**: medium ; **Tags**: layout, alignment, spacing

### W2-11 Choose gutter width to match the intended mood  (src: grid-system)
- **Rule**: Gutters set tone: 8px reads dense and technical, 24px balanced and clean, 40px editorial and premium.
- **Why**: Gap size changes density perception as much as columns do.
- **Do / Don't**: Do use tight gutters for dense dashboards and wide for editorial. Don't use one default gap regardless of context.
- **Audit check**: Inspect `gap-*`/`column-gap` values per layout type; flag dense data UIs with 40px gutters or editorial pages with 8px.
- **Restyle fix**: Set gutters to ~8px (dense), ~24px (general), or ~40px (editorial) to match the page's purpose.
- **Severity**: low ; **Tags**: spacing, layout

### W2-12 Collapse the grid at breakpoints: 12 → 6 → 4 → 1  (src: grid-system)
- **Rule**: Reduce columns per breakpoint: 12 for desktop, 6 for tablet, 4 for large phones, and one stacked column at the smallest widths.
- **Why**: Cutting columns step by step lets content reflow neatly.
- **Do / Don't**: Do cut the column count at each breakpoint. Don't keep the desktop column count on small screens.
- **Audit check**: grep for responsive prefixes (`sm:`, `md:`, `lg:` with `grid-cols-*`, `@media` column rules); flag fixed multi-column grids with no mobile fallback to a single column.
- **Restyle fix**: Add breakpoint variants that reduce columns and stack to 1 column on small screens.
- **Severity**: high ; **Tags**: layout, mobile

### W2-13 Establish the grid before breaking it on purpose  (src: grid-system)
- **Rule**: Intentional grid breaks (a full-width hero bleed or a pull quote pushed into the margin) only read as deliberate against an otherwise orderly grid.
- **Why**: Emphasis through contrast needs an established order to contrast with.
- **Do / Don't**: Do break the grid sparingly for emphasis. Don't break it before the base alignment is solid.
- **Audit check**: Check for negative margins / absolute offsets (`-mx-*`, `w-screen`) used in pages where other content is misaligned.
- **Restyle fix**: Fix base alignment first, then keep only one or two deliberate bleeds.
- **Severity**: low ; **Tags**: layout, alignment, craft

### W2-14 Keep gradients within about 60° of hue  (src: gradient-design)
- **Rule**: Blend neighboring hues (teal → cyan) rather than opposites (orange → blue), which create a muddy gray middle. Stay within 60° of hue travel and keep lightness moving in one direction to avoid banding.
- **Why**: Wide hue travel and lightness reversals make gradients look cheap.
- **Do / Don't**: Do keep hue travel under 60° and lightness monotonic. Don't blend opposite hues or go dark → light → dark.
- **Audit check**: grep `linear-gradient(`, `from-* via-* to-*`, `radial-gradient(` and compare end-stop hues; flag complementary endpoints.
- **Restyle fix**: Pick end colors on neighboring hues; adjust stops so lightness changes in one direction.
- **Severity**: low ; **Tags**: color, craft

### W2-15 Use gradients as ambient glow, not as full surfaces behind text  (src: gradient-design)
- **Rule**: Put a soft radial glow behind content instead of a full-bleed linear wash over it, and keep body copy off the gradient's blended middle band.
- **Why**: Contrast can't be predicted where the colors blend.
- **Do / Don't**: Do use gradients as atmosphere behind content. Don't set body text straight onto a gradient's middle.
- **Audit check**: Find text elements over gradient backgrounds (`bg-gradient-*` ancestors) and measure contrast at the mid-transition area.
- **Restyle fix**: Move the gradient to a background glow layer or put text on a solid/scrimmed surface.
- **Severity**: medium ; **Tags**: color, contrast

### W2-16 Add 2–3% grain over gradients  (src: gradient-design)
- **Rule**: Overlay about 2–3% noise on gradients to hide banding on poor displays and add texture; check on a low-end screen.
- **Why**: Smooth gradients band visibly on cheap displays; grain disguises it.
- **Do / Don't**: Do add faint noise and preview it on a weak display. Don't release big smooth gradients without checking for banding.
- **Audit check**: Look for large gradients with no noise overlay (no noise SVG/PNG, `feTurbulence`, `mix-blend` texture layer); inspect screenshots for visible banding.
- **Restyle fix**: Overlay a low-opacity (~2–3%) noise texture on large gradient areas.
- **Severity**: low ; **Tags**: color, craft

### W2-17 Optically size round icons 5–8% larger than square ones  (src: icon-design-rules)
- **Rule**: Round and organic glyphs should be drawn roughly 5–8% bigger than boxy ones so they look equal; identical pixel boxes make circles seem undersized.
- **Why**: What the eye perceives as size is not the same as the measured size.
- **Do / Don't**: Do enlarge circular icons by about 5–8%. Don't rely only on matching bounding-box dimensions.
- **Audit check**: In icon sets, compare visual weight of circle-based vs square icons in the same row; check SVG viewBox fill proportions.
- **Restyle fix**: Scale circular/organic icons by 5–8% within the same container.
- **Severity**: low ; **Tags**: icons, craft

### W2-18 Align icons to a 24px pixel grid (16px when dense) in a uniform container  (src: icon-design-rules)
- **Rule**: Draw icon shapes on a 24px grid, or 16px in compact UI, to avoid sub-pixel blur; put every icon in an identically sized container so toolbars look even.
- **Why**: Fractional-pixel offsets soften edges, and uneven boxes make toolbars look ragged.
- **Do / Don't**: Do use one container size and a pixel grid. Don't allow icons to drift in arbitrary, mismatched sizes.
- **Audit check**: grep icon size classes/props (`size-*`, `w-* h-*`, `width=`/`height=` on svg); flag a mix of sizes beyond 16/24 within one toolbar.
- **Restyle fix**: Standardize icon containers to 24px (16px dense) and normalize SVG viewBox to the grid.
- **Severity**: medium ; **Tags**: icons, alignment, craft

### W2-19 Keep one 2px stroke weight across the icon set  (src: icon-design-rules)
- **Rule**: Use one 2px line weight on every icon; mixing weights makes the set look pieced together from several libraries.
- **Why**: Uniform line weight is the quickest giveaway of a polished icon family.
- **Do / Don't**: Do keep one line weight across the whole family. Don't mix weights or pull from different icon libraries.
- **Audit check**: grep `stroke-width=`/`strokeWidth` values and imports from multiple icon libraries; flag values other than a single standard.
- **Restyle fix**: Set a uniform `stroke-width` (2) or replace icons from mismatched libraries.
- **Severity**: medium ; **Tags**: icons, craft

### W2-20 Commit to fill or outline for the whole icon set  (src: icon-design-rules)
- **Rule**: Pick one approach for the whole set, either filled or outlined, instead of deciding icon by icon.
- **Why**: Random mixing lacks any unifying visual logic.
- **Do / Don't**: Do settle on one style, optionally an intentional active/inactive scheme used consistently. Don't alternate fill and outline arbitrarily.
- **Audit check**: Review icon imports/variants (e.g. `Solid` vs `Outline` suffixes, `fill=` mixed with `stroke=`) for inconsistent use in the same context.
- **Restyle fix**: Convert icons to a single style, or define a consistent state-based rule (e.g. outline idle, fill active).
- **Severity**: low ; **Tags**: icons, craft

## Web patterns: Inputs

### W2-21 Design all six field states explicitly  (src: form-field-states)
- **Rule**: A text field has default, focus, error, success, disabled, and loading states, and each needs an explicit design.
- **Why**: Any forgotten state becomes a production bug.
- **Do / Don't**: Do style all six states. Don't ship fields with only default and focus.
- **Audit check**: grep input styles for `:focus`, `aria-invalid`, `:disabled`, `data-[error]`, `aria-busy`; flag missing states.
- **Restyle fix**: Add the missing state styles (error, success, disabled, loading) to the shared input component.
- **Severity**: high ; **Tags**: forms, states

### W2-22 Keep the label outside the field, not as a placeholder  (src: form-field-states)
- **Rule**: Show a permanent label over the input and hint text beneath; a placeholder standing in as the label vanishes as soon as typing starts.
- **Why**: Mid-entry, users forget what the field was for.
- **Do / Don't**: Do keep a visible label on top and helper text underneath. Don't let a placeholder replace the label.
- **Audit check**: grep `<input` with `placeholder=` but no associated `<label>`/`aria-label`/`htmlFor`; flag.
- **Restyle fix**: Add a visible `<label>` above each input and move hints to helper text below.
- **Severity**: high ; **Tags**: forms, accessibility, copy

### W2-23 Make focus rings at least 3:1 contrast  (src: form-field-states)
- **Rule**: Field focus indicators need a contrast ratio of 3:1 or better; a gentle blue glow looks nice yet fails accessibility checks.
- **Why**: Faint focus is difficult to spot.
- **Do / Don't**: Do use a ring with 3:1 contrast or more. Don't depend on a pale glow.
- **Audit check**: grep `focus:ring-*`, `box-shadow` on `:focus` and compute ring color contrast against the surface; flag <3:1 or very low opacity glows.
- **Restyle fix**: Use a solid ring color meeting 3:1 against the surrounding background.
- **Severity**: high ; **Tags**: forms, accessibility, contrast

### W2-24 Signal errors with color, icon, and message together  (src: form-field-states)
- **Rule**: Pair color with an icon and text naming the problem and remedy; a lone red border goes unseen by about 12% of people with a color-vision deficiency.
- **Why**: Anyone who can't perceive the color is left out when it's the only cue.
- **Do / Don't**: Do pair color, icon, and written message. Don't let a red border carry the error by itself.
- **Audit check**: grep error styles (`border-red-*`, `aria-invalid`) and check that an icon and message element (`aria-describedby`, `role="alert"`) accompany them.
- **Restyle fix**: Add an error icon and specific message below the field alongside the red border.
- **Severity**: high ; **Tags**: forms, accessibility, color, states

### W2-25 Confirm success inside the field  (src: form-field-states)
- **Rule**: Show success within the field itself, where attention already is, rather than via a toast that steals focus and disappears before being read.
- **Why**: In-context confirmation is seen; toasts are missed.
- **Do / Don't**: Do show an in-field success indicator. Don't use a toast for field-level confirmation.
- **Audit check**: Look for field validation success implemented only via toast calls (`toast.success`) with no in-field indicator.
- **Restyle fix**: Add a check icon/green state in the input and drop the toast.
- **Severity**: low ; **Tags**: forms, states

### W2-26 Distinguish disabled from loading fields  (src: form-field-states)
- **Rule**: Disabled: grayscale fill and not-allowed cursor. Loading: in-field spinner plus locked input so submissions can't double up. Don't fake disabled with 0.5 opacity, which looks like loading.
- **Why**: The two states need to look clearly different from each other.
- **Do / Don't**: Do lock the field and display a spinner while an async check runs. Don't rely on 0.5 opacity alone to mean disabled.
- **Audit check**: grep `disabled:opacity-50`/`opacity-50` as the only disabled style; check for `cursor-not-allowed` and a loading spinner with `disabled`/`aria-busy`.
- **Restyle fix**: Give disabled a gray fill + `cursor-not-allowed`; add a spinner and input lock to the loading state.
- **Severity**: medium ; **Tags**: forms, states

### W2-27 Validate on blur, then revalidate live after an error  (src: form-validation-timing)
- **Rule**: Check a field when focus leaves it rather than on submit or each keystroke; once it has errored, switch that field to live validation so the error clears the moment it is fixed.
- **Why**: Submit-time is too late and keystroke-time is too early.
- **Do / Don't**: Do validate on blur and revalidate live after an error. Don't hold all errors until submit or flag mid-typing.
- **Audit check**: grep `onBlur`, `mode: "onBlur"`/`"onTouched"`/`reValidateMode`, `onChange` validation; flag validation only in `onSubmit` or red errors fired on first keystroke.
- **Restyle fix**: Set validation mode to blur (e.g. `mode: "onTouched"`) with live revalidation after the first error.
- **Severity**: high ; **Tags**: forms, interaction-cost

### W2-28 Show positive confirmation for valid fields  (src: form-validation-timing)
- **Rule**: Use a green check to tell users a field is correct, not only when it is wrong.
- **Why**: Success is feedback too.
- **Do / Don't**: Do confirm correct fields with a check. Don't only flag broken ones.
- **Audit check**: Check validated forms for a success state (check icon, `data-valid`, green border) in addition to the error state.
- **Restyle fix**: Add a check icon/success style after a field passes validation.
- **Severity**: low ; **Tags**: forms, states

### W2-29 Group long numbers into fixed chunks  (src: input-masking)
- **Rule**: Insert a space every four characters so a 16-digit card number becomes scannable chunks like 4242 4242 4242 4242, and surface the card brand mark inline from the leading digit (4 Visa, 5 Mastercard, 3 Amex).
- **Why**: Unbroken digit runs are hard to read and verify.
- **Do / Don't**: Do format long numbers into groups and show the brand. Don't leave raw unformatted digit runs.
- **Audit check**: Check card/phone inputs for a mask (`inputmode`, `react-input-mask`, `imask`, `cleave`, custom `onChange` formatter); flag plain unformatted inputs for long numbers.
- **Restyle fix**: Add a formatter grouping digits 4-by-4 and an inline brand icon.
- **Severity**: medium ; **Tags**: forms, interaction-cost

### W2-30 Keep the caret in place when auto-inserting separators  (src: input-masking)
- **Rule**: After a mask inserts a separator, leave the caret immediately following the typed character instead of sending it to the field's end.
- **Why**: A caret that leaps away breaks editing in the middle of a value.
- **Do / Don't**: Do put the caret back where it was after reformatting. Don't allow it to leap to the end.
- **Audit check**: In custom formatters that set `value` in `onChange`, check for `setSelectionRange` / `selectionStart` handling.
- **Restyle fix**: Save and restore `selectionStart` around reformatting.
- **Severity**: medium ; **Tags**: forms, interaction-cost

### W2-31 Clean pasted input and store raw values  (src: input-masking)
- **Rule**: Strip dashes and spaces from pasted values and reformat to your own grouping rather than rejecting them; render the formatted value but persist the unformatted digits.
- **Why**: Users shouldn't be penalized for separators, and stored data should stay clean.
- **Do / Don't**: Do sanitize pasted values and save raw data. Don't error on pasted separators or store formatting characters.
- **Audit check**: Check `onPaste`/`onChange` handlers for sanitizing (`replace(/\D/g, "")`) and that submitted payloads contain no spaces/dashes.
- **Restyle fix**: Add a sanitize step on paste and strip formatting before submit/storage.
- **Severity**: medium ; **Tags**: forms, interaction-cost

### W2-32 Treat paste as the primary OTP path  (src: otp-input)
- **Rule**: If a code is pasted in any box, clean it of spaces and non-digits (`value.replace(/\D/g, "")`) and fill all six boxes at once. Skip one wide input; spaced codes overflow.
- **Why**: Paste is the primary path into a code field, so it has to work flawlessly from any box.
- **Do / Don't**: Do accept paste in any box and fan the digits out. Don't let a paste jam the field.
- **Audit check**: grep OTP components for `onPaste` and `replace(/\D/g`; flag missing paste handling.
- **Restyle fix**: Add a paste handler that sanitizes and distributes digits.
- **Severity**: high ; **Tags**: forms, interaction-cost, mobile

### W2-33 Auto-advance and backspace-retreat between OTP boxes  (src: otp-input)
- **Rule**: Move focus forward as each digit lands, and let backspace on an empty box jump to the previous box and clear it.
- **Why**: Correcting a typo should never trap the cursor.
- **Do / Don't**: Do auto-advance and support backspace-to-previous. Don't require manual tapping between boxes.
- **Audit check**: Check OTP key handlers for `onKeyDown` with `Backspace` logic and `.focus()` on next/previous refs.
- **Restyle fix**: Implement focus advance and backspace retreat with refs.
- **Severity**: medium ; **Tags**: forms, interaction-cost

### W2-34 Model the OTP as one string with mobile autofill attributes  (src: otp-input)
- **Rule**: Store the code as a single string (`useState("847291")`) rather than six independent values, and set `inputmode="numeric"` and `autocomplete="one-time-code"` so the OS offers one-tap SMS autofill.
- **Why**: One source of truth is simpler, and the attributes enable native autofill.
- **Do / Don't**: Do keep one string state and set the autofill attributes. Don't keep an array of six separate states.
- **Audit check**: grep OTP inputs for `inputMode="numeric"` and `autoComplete="one-time-code"`; flag `useState(["","",...])` arrays.
- **Restyle fix**: Refactor to a single string state and add the two attributes.
- **Severity**: medium ; **Tags**: forms, mobile

### W2-35 Throttle OTP resend and give instant verify feedback  (src: otp-input)
- **Rule**: Gate resend behind a visible 30s countdown to dodge a 429 Too Many Requests ban. Wrong codes shake, clear, refocus; correct ones turn boxes green with a check and "Verified".
- **Why**: Avoids rate-limit bans and makes the result obvious.
- **Do / Don't**: Do show a resend countdown plus clear success and failure states. Don't let an incorrect code just sit there without feedback.
- **Audit check**: Look for a resend button with timer state (30s) and for error/success animation on the OTP boxes.
- **Restyle fix**: Add a countdown-disabled resend button and shake/clear/refocus on error, green check on success.
- **Severity**: medium ; **Tags**: forms, states, motion

### W2-36 Signal editability on hover and keep layout unchanged on edit  (src: inline-editing)
- **Rule**: Editable text should hint at editing with a pencil on hover or a soft background tint, and swapping to the input must keep font, size, and padding identical with the border moving from transparent to accent.
- **Why**: Without a signal, users cannot tell text is editable, and any layout jump breaks the illusion.
- **Do / Don't**: Do show a hover affordance and keep metrics identical. Don't leave editable text with no affordance or jump on swap.
- **Audit check**: Compare text and input classes (font, size, padding, `border-transparent`) in inline-edit components; check for hover pencil/tint styles.
- **Restyle fix**: Share typography/padding classes between display and input states and add a hover affordance.
- **Severity**: medium ; **Tags**: interaction-cost, craft, forms

### W2-37 Define consistent commit/cancel rules for inline edits  (src: inline-editing)
- **Rule**: Enter commits and Escape cancels; choose one rule for blur (save or discard) and apply it everywhere.
- **Why**: Inconsistent blur behavior causes lost or unexpected edits.
- **Do / Don't**: Do keep blur behavior uniform across screens. Don't save on blur in one place and discard in another.
- **Audit check**: grep `onBlur` handlers in inline-edit components and compare their commit/cancel behavior; check `Enter`/`Escape` key handlers.
- **Restyle fix**: Centralize inline-edit behavior in one component with one blur rule.
- **Severity**: medium ; **Tags**: forms, interaction-cost

### W2-38 Save inline edits optimistically with rollback and match mode to typo cost  (src: inline-editing)
- **Rule**: Show new text immediately during the request; on failure revert, retain the draft, and explain. Use always-editable cells when slips are cheap, an explicit Edit action when costly.
- **Why**: Immediate feedback feels quick, and the edit mode should fit the risk.
- **Do / Don't**: Do update instantly, and on failure roll back while keeping the draft. Don't throw away what the user typed when a save fails.
- **Audit check**: Check mutation handlers for optimistic update + `onError` rollback with an error message; check high-stakes fields for an explicit Edit step.
- **Restyle fix**: Add optimistic updates with rollback and error message; require Edit mode for costly fields.
- **Severity**: low ; **Tags**: forms, states, interaction-cost

### W2-39 Give dropzones immediate drag-over feedback  (src: file-upload-ux)
- **Rule**: React the moment a file hovers a dropzone with border, glow, and copy changes — three signals before the drop.
- **Why**: Users should never hesitate over a dead-looking zone.
- **Do / Don't**: Do change border, glow, and text on drag-over. Don't leave the dropzone static.
- **Audit check**: grep `onDragOver`/`onDragEnter`/`isDragActive` with matching `data-*`/class changes; flag dropzones with no drag-over style.
- **Restyle fix**: Add an active drag state that changes border, glow, and label.
- **Severity**: medium ; **Tags**: forms, states, interaction-cost

### W2-40 Show real upload progress with percent and time remaining  (src: file-upload-ux)
- **Rule**: Display percent complete and estimated time remaining instead of a bare spinner.
- **Why**: Users can decide to wait or leave.
- **Do / Don't**: Do show a progress bar with percent and ETA. Don't hide progress behind a spinner.
- **Audit check**: Check upload components for `role="progressbar"`/`<progress>`, percent and ETA text; flag spinner-only uploads.
- **Restyle fix**: Replace the spinner with a progress bar plus percent and time remaining.
- **Severity**: medium ; **Tags**: states, interaction-cost

### W2-41 Provide inline retry for failed uploads, per file  (src: file-upload-ux)
- **Rule**: Failed upload (even at 90%): keep the file and offer one-tap inline retry. Per-file progress and retry in a queue stop one failure stalling the other nine.
- **Why**: Forcing a restart wastes users' effort.
- **Do / Don't**: Do keep files loaded and retry each item individually. Don't make people re-pick files or let one failure halt the queue.
- **Audit check**: Look for per-file retry buttons/state and queue items with independent progress; flag a global error that clears the list.
- **Restyle fix**: Add per-item progress, error, and retry controls to the upload queue.
- **Severity**: medium ; **Tags**: states, interaction-cost

### W2-42 Show a thumbnail, type, and size as upload confirmation  (src: file-upload-ux)
- **Rule**: Confirm receipt with a thumbnail, file type, and size, not just a filename.
- **Why**: Visual proof shows the right file arrived.
- **Do / Don't**: Do show a preview with type and size. Don't treat a filename alone as confirmation.
- **Audit check**: Check upload list items for an `<img>`/preview, type badge, and size text.
- **Restyle fix**: Add a thumbnail and meta (type, size) row to each uploaded file.
- **Severity**: low ; **Tags**: imagery, states

### W2-43 Give filter chips distinct idle, active, and disabled states  (src: filter-chips)
- **Rule**: Idle chips have a surface and border, active ones are filled with a check, and disabled ones are dimmed since they'd return no results.
- **Why**: When active resembles idle, the filter seems broken.
- **Do / Don't**: Do give the three states clearly different looks. Don't let active chips look like idle ones.
- **Audit check**: grep chip styles for `aria-pressed`/`data-[state=on]`/`aria-checked` and `disabled` variants; compare computed active vs idle styles.
- **Restyle fix**: Fill active chips with accent color and a check icon; dim disabled chips.
- **Severity**: high ; **Tags**: states, buttons

### W2-44 Refresh the result count in the same frame as the tap  (src: filter-chips)
- **Rule**: Update the number of results the moment a chip toggles, and provide a single clear-all reset alongside a live count.
- **Why**: A frozen number suggests the tap failed, prompting repeat taps.
- **Do / Don't**: Do refresh the count instantly and include one clear-all. Don't leave the number out of date.
- **Audit check**: Check filter handlers update count synchronously with state (no debounce delay without a loading state); check for a "Clear all" control.
- **Restyle fix**: Bind the result count to filter state and add a clear-all next to it.
- **Severity**: medium ; **Tags**: states, interaction-cost

### W2-45 Show combination logic: OR within groups, AND across  (src: filter-chips)
- **Rule**: Make filter logic legible: OR within a group widens matches (more colors, more results), AND across groups narrows them (adding a size reduces the set).
- **Why**: Users need to predict how filters combine.
- **Do / Don't**: Do group chips visibly and apply OR in-group, AND across groups. Don't mix logic unpredictably.
- **Audit check**: Review filter logic code for in-group `some`/OR and cross-group `every`/AND, and check groups are visually separated.
- **Restyle fix**: Visually group chips by category and align logic with the pattern.
- **Severity**: low ; **Tags**: layout, interaction-cost

### W2-46 Scroll chips in one row with an edge fade; pin active filters  (src: filter-chips)
- **Rule**: Overflowing chips go in one sideways-scrolling row with a fade at its right edge, not a tall wrapped block; pin the applied filters in a sticky summary strip.
- **Why**: Wrapped chips shove results down the page; a pinned summary tells users what narrowed the list.
- **Do / Don't**: Do keep a single scrollable row, faded at the edge, plus a sticky summary. Don't let chips wrap onto many rows.
- **Audit check**: Check chip containers for `overflow-x-auto`/`flex-nowrap` and a gradient mask; flag `flex-wrap` with many chips; look for a `sticky` active-filters bar.
- **Restyle fix**: Switch to `flex-nowrap overflow-x-auto` with a fade mask and add a sticky active-filter bar.
- **Severity**: medium ; **Tags**: layout, mobile, navigation

### W2-47 Never remove the focus outline without a replacement  (src: focus-states)
- **Rule**: Stripping the default focus ring with `outline: none` fails accessibility unless something clearly visible takes its place.
- **Why**: Keyboard users can no longer tell where they are.
- **Do / Don't**: Do supply a custom ring wherever the outline is removed. Don't apply `outline: none` without a visible substitute.
- **Audit check**: grep `outline: none`, `outline-none`, `outline: 0` and check for accompanying `focus-visible:ring`, `box-shadow`, or `outline` styles.
- **Restyle fix**: Add `:focus-visible` ring styles wherever outline is removed.
- **Severity**: high ; **Tags**: accessibility, states

### W2-48 Make focus rings 2px thick with a 2px offset and strong contrast  (src: focus-states)
- **Rule**: A proper focus ring is 2px thick, offset by 2px, and has enough contrast to be visible on both light and dark backgrounds.
- **Why**: Thin or low-contrast rings disappear on some surfaces.
- **Do / Don't**: Do use 2px thickness, 2px offset, and contrast on every background. Don't use a faint or flush ring.
- **Audit check**: grep `ring-2`, `ring-offset-2`, `outline-offset: 2px`, `outline: 2px`; verify contrast in light and dark themes.
- **Restyle fix**: Apply `focus-visible:ring-2 ring-offset-2` with theme-aware ring colors.
- **Severity**: medium ; **Tags**: accessibility, contrast, dark-mode

### W2-49 Use :focus-visible instead of :focus  (src: focus-states)
- **Rule**: `:focus-visible` shows the ring on Tab presses but not mouse clicks.
- **Why**: Keyboard users get guidance without pointer clutter.
- **Do / Don't**: Do use `:focus-visible`. Don't style focus rings with `:focus` and then hide them for mouse users.
- **Audit check**: grep `:focus {`, `focus:ring` versus `:focus-visible`, `focus-visible:`.
- **Restyle fix**: Convert `focus:` ring styles to `focus-visible:`.
- **Severity**: medium ; **Tags**: accessibility, states

### W2-50 Keep DOM order synced with visual order  (src: focus-states)
- **Rule**: Focus follows DOM order, so reordering columns with CSS makes Tab jump around the page; keep visual and DOM order the same.
- **Why**: Tab order that disagrees with layout is disorienting.
- **Do / Don't**: Do keep DOM order matching visual order. Don't reorder visually with CSS and leave DOM order behind.
- **Audit check**: grep `order-*`, `flex-direction: row-reverse`/`column-reverse`, `grid-area` reordering, and positive `tabindex` values.
- **Restyle fix**: Reorder the markup instead of using CSS order, and remove positive tabindex.
- **Severity**: medium ; **Tags**: accessibility, layout

### W2-51 Trap focus in modals and restore it on close  (src: focus-states)
- **Rule**: In a modal, Tab cycles through the dialog and wraps; Escape closes it and returns focus to the opener.
- **Why**: Focus leaking behind the dialog or dropped on close breaks keyboard use.
- **Do / Don't**: Do trap focus and restore it on close. Don't let focus escape or get lost.
- **Audit check**: Check dialogs for focus trap (Radix/Headless UI/`focus-trap`/`<dialog>` `showModal`), an Escape handler, `aria-modal`, and focus return.
- **Restyle fix**: Use an accessible dialog primitive or add focus trap, Escape, and focus restore.
- **Severity**: high ; **Tags**: accessibility, interaction-cost

### W2-52 Make a skip link the first thing keyboard users reach  (src: focus-states)
- **Rule**: One keypress on a skip link bypasses dozens of nav links; hide it until it receives focus and put it first on the page.
- **Why**: Otherwise keyboard users tab through the entire menu on every page.
- **Do / Don't**: Do put a skip link, hidden until focused, at the very start. Don't force keyboard users through the whole nav.
- **Audit check**: grep for `href="#main"`/"Skip to content" as the first body element with `sr-only focus:not-sr-only`.
- **Restyle fix**: Add `<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>` at top of body.
- **Severity**: medium ; **Tags**: accessibility, navigation

## Web patterns: Feedback

### W2-53 Add an illustration or icon to empty states  (src: empty-states)
- **Rule**: A blank screen looks broken; adding a small illustration or icon shows the emptiness is deliberate.
- **Why**: Without a visual cue, an empty list looks the same as a failure.
- **Do / Don't**: Do include a small graphic. Don't show only a plain "No data" line or an empty page.
- **Audit check**: Find empty-state branches (`length === 0`, "No results") rendering only text or nothing.
- **Restyle fix**: Add an icon/illustration, a heading, and guidance to each empty state.
- **Severity**: medium ; **Tags**: states, imagery

### W2-54 Give every empty state one primary CTA toward the next step  (src: empty-states)
- **Rule**: Provide a primary action that is the next real step (e.g. "+ New project"), not "Try refreshing"; empty states double as onboarding.
- **Why**: The empty state is the best moment to teach the feature.
- **Do / Don't**: Do point the CTA at the next real step. Don't rely on generic "Try refreshing" as the only action.
- **Audit check**: Check empty-state components for a `Button`/link; flag those with no action or only a refresh.
- **Restyle fix**: Add a primary button with a task-specific label.
- **Severity**: medium ; **Tags**: states, buttons, copy

### W2-55 Tailor empty-state copy to the four kinds  (src: empty-states)
- **Rule**: Handle the four empty kinds (filtered-out, first-run, error, no-results) separately, each with its own copy and CTA, in warm human wording, not log text ("ERROR 404 — Result set empty.").
- **Why**: Using one generic screen gives wrong guidance in at least three of those situations.
- **Do / Don't**: Do write human copy tailored to each context. Don't use one generic or system-style message.
- **Audit check**: Check whether a single shared empty component serves all cases; grep cold strings like "No items found", "Result set empty", "No data".
- **Restyle fix**: Split into four variants with unique copy and actions.
- **Severity**: medium ; **Tags**: copy, states

### W2-56 Preview what real items will look like in first-run empties  (src: empty-states)
- **Rule**: Show a ghost preview of a real item to teach the feature before users touch it.
- **Why**: Empty states are an onboarding opportunity.
- **Do / Don't**: Do include a ghost example item in first-run empties. Don't show only an apology.
- **Audit check**: Review first-run empty states for a sample/ghost item or illustrative preview.
- **Restyle fix**: Add a dimmed placeholder item showing the structure of a real one.
- **Severity**: low ; **Tags**: states, imagery, craft

### W2-57 Match the error surface to its severity  (src: error-states)
- **Rule**: Show field validation inline beneath the input, transient or connectivity trouble in a toast or banner, and reserve modals for blocking failures. More disruptive errors get more space.
- **Why**: Each error kind has a natural place; misplacing it adds friction.
- **Do / Don't**: Do pick inline, toast, or modal according to severity. Don't escalate a trivial validation mistake into a modal.
- **Audit check**: grep `toast`/`alert(`/`Modal` calls tied to form validation; flag modals for minor errors and floating alerts for field errors.
- **Restyle fix**: Move field errors inline and reserve modals for blockers.
- **Severity**: high ; **Tags**: states, forms, interaction-cost

### W2-58 Give every error a way out  (src: error-states)
- **Rule**: Every error needs a real exit — Retry, a support link, or expandable technical details — not a dead-end "OK".
- **Why**: Dead ends leave users stuck.
- **Do / Don't**: Do offer retry, undo, or help. Don't ship errors whose only option is "OK".
- **Audit check**: Review error components for action buttons other than a lone dismiss; grep `Retry`, `Contact support`.
- **Restyle fix**: Add a retry/help action to every error component.
- **Severity**: high ; **Tags**: states, interaction-cost

### W2-59 Make error messages name the cause and the next step  (src: error-states)
- **Rule**: Phrase failures for people: state the cause, the reason and the next step in concrete wording instead of exposing a status code or a generic failure line.
- **Why**: A bare code or catch-all sentence gives no cause and no path forward.
- **Do / Don't**: Do name what went wrong and what the user can do now. Don't show only a numeric code or a catch-all failure sentence.
- **Audit check**: grep user-facing error strings for bare status codes (e.g. "500") or catch-all text with no cause and no action.
- **Restyle fix**: Rewrite each such message as cause + reason + next step, in plain wording.
- **Severity**: medium ; **Tags**: copy, states

### W2-60 Validate inline as the user types to prevent errors  (src: error-states)
- **Rule**: Live inline validation that checks each rule and turns criteria green catches mistakes before submit; keep field-level errors small, anchored to the input, and specific. (Balance with on-blur timing for format-style errors.)
- **Why**: Submit-only validation tells people they failed after the fact.
- **Do / Don't**: Do show per-rule progress (e.g. password criteria) near the input. Don't use a generic floating alert for field errors.
- **Audit check**: Check password/complex fields for rule checklists and that errors render adjacent to the input with `aria-describedby`.
- **Restyle fix**: Add a live criteria checklist and anchor error text below the field.
- **Severity**: medium ; **Tags**: forms, states

### W2-61 Choose loading pattern by what you know about the wait  (src: loading-states-system)
- **Rule**: Skeleton: known content shape, wait over ~300ms. Spinner: short unknown wait under ~3s. Progress bar: wait over ~3s with known percentage, plus real meta like time remaining.
- **Why**: Defaulting to one skeleton everywhere shows little thought.
- **Do / Don't**: Do choose by content shape, duration, and known progress. Don't skeleton every fetch or show a full-page spinner for long waits.
- **Audit check**: grep `Skeleton`, `Spinner`, `animate-spin`, `<progress>`; flag full-page spinners and skeletons that don't match the loaded layout.
- **Restyle fix**: Swap patterns per context: skeleton for lists/cards, spinner inside buttons, progress bar for uploads/exports.
- **Severity**: medium ; **Tags**: states, interaction-cost

### W2-62 Show no loading indicator under ~300ms  (src: loading-states-system)
- **Rule**: When a response lands in under ~300ms, show no loading state at all.
- **Why**: A flash of a loader looks like a glitch more than feedback.
- **Do / Don't**: Do delay showing loaders (~300ms). Don't flash a spinner or skeleton for fast responses.
- **Audit check**: Check loading flags are set immediately (`setLoading(true)`) without a delay/minimum threshold; look for flicker in fast fetches.
- **Restyle fix**: Add a ~300ms delay before showing the loader (and optionally a minimum display time).
- **Severity**: low ; **Tags**: states, motion

### W2-63 Update the UI optimistically for reversible actions  (src: optimistic-ui)
- **Rule**: Apply likes, saves, toggles, and reorders instantly, sync server-side quietly, and roll back (restoring the count) on failure; under 400ms reads as instant.
- **Why**: People read anything under ~400ms as instant, so a spinner shown past that threshold on a simple action makes it feel broken.
- **Do / Don't**: Do reflect the change at once and revert if it fails. Don't hold low-stakes actions until the response arrives.
- **Audit check**: Check mutation hooks for `onMutate`/optimistic updates with `onError` rollback (`useOptimistic`, React Query); flag spinner-blocked likes/toggles.
- **Restyle fix**: Add optimistic updates with rollback and an error surface.
- **Severity**: medium ; **Tags**: states, interaction-cost

### W2-64 Don't use optimistic UI for payments or irreversible actions  (src: optimistic-ui)
- **Rule**: Keep optimistic updates for reversible, low-stakes actions. Charges, bookings, and confirmations should appear only after the server approves them.
- **Why**: Falsely reporting success on irreversible actions is expensive.
- **Do / Don't**: Do wait for server approval on payments and transfers. Don't show a confirmation ahead of clearance.
- **Audit check**: grep optimistic updates in payment, transfer, or booking flows.
- **Restyle fix**: Replace optimistic confirmation with a real pending state until the server confirms.
- **Severity**: high ; **Tags**: states, interaction-cost

### W2-65 Map notification severity to toast, banner, modal, or badge  (src: notification-system)
- **Rule**: Let the event's severity pick the surface: a toast for low-priority news, a banner for degraded service, a modal for a blocking error such as "card declined", and a badge for a passive unread count.
- **Why**: Routing everything to the loudest surface trains users to ignore all of it.
- **Do / Don't**: Do match surface to severity. Don't use a blocking modal for purely informational messages.
- **Audit check**: grep `toast(`, `Banner`, `Modal`, `Badge` usage and flag modals for info-level messages.
- **Restyle fix**: Re-route low-severity notices to toast/badge and keep modals for true blockers.
- **Severity**: high ; **Tags**: states, interaction-cost, hierarchy

### W2-66 Set persistence and stacking rules per notification surface  (src: notification-system)
- **Rule**: Toasts self-dismiss after a few seconds with undo; banners persist until cleared; modals block until answered; badges last until resolved. Toasts may stack; modals never queue.
- **Why**: How long each surface lingers and whether it stacks is its behavioral contract.
- **Do / Don't**: Do let toasts self-dismiss with undo and stack neatly. Don't line up several modals.
- **Audit check**: Check toast config for duration and an undo action; check for code paths that open multiple dialogs at once.
- **Restyle fix**: Add auto-dismiss + undo to toasts and serialize modals.
- **Severity**: medium ; **Tags**: states, interaction-cost

### W2-67 Label buttons with the reward, not the mechanic  (src: microcopy)
- **Rule**: Name what the user gets ("Create my free account") instead of the system verb ("Submit").
- **Why**: Same action, different perceived value and conversion.
- **Do / Don't**: Do label with the outcome. Don't use generic "Submit".
- **Audit check**: grep button text for `Submit`, `OK`, `Click here`, `Send`.
- **Restyle fix**: Rename generic buttons to outcome-based labels.
- **Severity**: low ; **Tags**: copy, buttons

### W2-68 Write like a person, not a system  (src: microcopy)
- **Rule**: Copy should read like a helpful colleague; avoid machine phrasing such as "operation failed" in labels, errors, and empty states.
- **Why**: Wording influences whether a UI feels usable or hostile as much as layout does.
- **Do / Don't**: Do adopt a helpful, human voice. Don't ship machine-sounding phrases.
- **Audit check**: grep user-facing strings for "operation failed", "invalid", "null", "undefined", "error occurred".
- **Restyle fix**: Rewrite system strings in plain, friendly language.
- **Severity**: low ; **Tags**: copy

## Web patterns: Overlays

### W2-69 Ask "does it block the user?" before choosing an overlay  (src: modal-hierarchy)
- **Rule**: Modal only when interaction blocks; otherwise pick sheet, popover, or drawer by context. Keep modals for critical or destructive choices ("Delete account?") with full scrim and one centered decision.
- **Why**: Routine tasks become slower when something interrupts them.
- **Do / Don't**: Do use modals for decisions that demand an answer. Don't put routine non-blocking actions behind a modal or full scrim.
- **Audit check**: grep Modal/Dialog usage and review whether each is critical/destructive; flag modals for menus or quick actions.
- **Restyle fix**: Convert routine modals to popovers or sheets.
- **Severity**: medium ; **Tags**: interaction-cost, hierarchy

### W2-70 Use bottom sheets, edge drawers, and small popovers for non-blocking flows  (src: modal-hierarchy)
- **Rule**: Bottom sheet: mobile-first default; slides up with drag handle and snap points, context partly visible. Drawer: edge-anchored panel for navigation, dimming only what it covers. Popover: trigger-anchored, ~200px.
- **Why**: Each form fits a different intent and weight.
- **Do / Don't**: Do tether popovers to their trigger at ~200px; use edge drawers for navigation. Don't hide navigation in an overlay that blocks the page.
- **Audit check**: Check popover width (~200px), sheets with drag handle/snap points, and navigation hidden inside modals.
- **Restyle fix**: Move navigation to a drawer, mobile secondary flows to bottom sheets, quick actions to small anchored popovers.
- **Severity**: low ; **Tags**: mobile, navigation, depth

## Web patterns: Navigation

### W2-71 Use bottom tabs on mobile and a persistent sidebar on desktop  (src: navigation-patterns)
- **Rule**: Mobile primary navigation is 3-5 bottom tabs in thumb reach; desktop hierarchical content with 5+ sections uses a persistent sidebar that is not collapsed by default.
- **Why**: Visible primary destinations drive engagement and discoverability.
- **Do / Don't**: Do match pattern to platform and depth. Don't pick patterns by taste.
- **Audit check**: Check mobile layouts for a bottom `nav` with 3–5 items and desktop apps with 5+ sections for a visible sidebar; flag a default-collapsed sidebar.
- **Restyle fix**: Move primary destinations to a bottom tab bar (mobile) or persistent sidebar (desktop).
- **Severity**: high ; **Tags**: navigation, mobile, layout

### W2-72 Keep primary navigation out of the hamburger menu  (src: navigation-patterns)
- **Rule**: Hamburgers suit secondary links; hiding primary ones there cuts engagement ~40% on mobile and ~56% on desktop. A command palette (Cmd K) only accelerates, so keep visible navigation too.
- **Why**: Few people use hidden navigation, and newcomers never find shortcuts.
- **Do / Don't**: Do keep primary destinations visible. Don't make a hamburger or command palette the sole route.
- **Audit check**: grep hamburger/menu-toggle components wrapping primary links at desktop widths; check features reachable only via a command palette.
- **Restyle fix**: Surface primary links in visible nav and keep the hamburger/palette for secondary access.
- **Severity**: high ; **Tags**: navigation, interaction-cost

### W2-73 Use breadcrumbs only for hierarchies deeper than 2 levels  (src: navigation-patterns)
- **Rule**: Breadcrumbs justify their space only past 2 levels of depth; in flat structures they just clutter.
- **Why**: Wayfinding aids pay off just in deeply nested sites.
- **Do / Don't**: Do add them to deep hierarchies. Don't put them on flat sites.
- **Audit check**: grep `Breadcrumb` components on pages with ≤2 levels of route depth.
- **Restyle fix**: Remove breadcrumbs on flat pages; add them to deeper ones.
- **Severity**: low ; **Tags**: navigation, hierarchy

### W2-74 Structure landing pages as Hero, Proof, Problem, Solution, CTA  (src: landing-page-skeleton)
- **Rule**: Use five sections in sequence: Hero, Proof, Problem, Solution, CTA. Proof (logos, one testimonial, one hard number) follows the hero; sharpen the problem before offering the solution.
- **Why**: Visitors judge trustworthiness almost instantly, and pain drives desire for the fix.
- **Do / Don't**: Do put proof immediately after the hero and establish the pain first. Don't push proof to the bottom or leap to the solution.
- **Audit check**: Review the section order of landing pages; flag proof placed at the bottom and solution before problem.
- **Restyle fix**: Reorder sections to Hero → Proof → Problem → Solution → CTA.
- **Severity**: medium ; **Tags**: hierarchy, layout, copy

### W2-75 Keep the hero to a headline, subhead, and one CTA  (src: landing-page-skeleton)
- **Rule**: In about 3 seconds the hero must convey what's offered, who it serves, and why it matters, using a headline, subhead, and single CTA; skip carousels or sliders.
- **Why**: Rotating slides conceal the one message that counts.
- **Do / Don't**: Do lead with a headline, subhead, and lone CTA. Don't put a rotating carousel in the hero.
- **Audit check**: grep hero sections for carousel/slider libraries (`swiper`, `embla`, `slick`) and count CTAs.
- **Restyle fix**: Replace the carousel with one headline, subhead, and primary CTA.
- **Severity**: high ; **Tags**: hierarchy, copy, buttons

### W2-76 Frame benefits as outcomes, max three  (src: landing-page-skeleton)
- **Rule**: Sell outcomes and limit to three benefits; "save 10 hours a week" outperforms "advanced automation".
- **Why**: Results show value, whereas feature lists leave readers to infer it.
- **Do / Don't**: Do limit benefits to three, worded as outcomes. Don't enumerate features.
- **Audit check**: Count benefit items in the benefits section and check wording for outcome phrasing.
- **Restyle fix**: Trim to three outcome-based benefits.
- **Severity**: low ; **Tags**: copy, hierarchy

### W2-77 Repeat the identical CTA at top and bottom  (src: landing-page-skeleton)
- **Rule**: Use the identical CTA, same color and same copy, at both top and bottom of the page.
- **Why**: Repeating catches scrollers who weren't ready initially.
- **Do / Don't**: Do reuse the exact CTA. Don't vary the label or styling between appearances.
- **Audit check**: Compare primary CTA label and classes in the hero versus the closing section; does not license two copies inside one viewport (header + hero): see W3-17, W3-19.
- **Restyle fix**: Make the closing CTA match the hero CTA.
- **Severity**: low ; **Tags**: buttons, copy

## Web patterns: Data

### W2-78 Prefer cursor pagination when data changes often  (src: pagination)
- **Rule**: Offset pagination drifts when rows are inserted or deleted, showing duplicates or skipping items; cursor pagination anchors to a specific row and stays stable.
- **Why**: Stable lists avoid duplicates and skips.
- **Do / Don't**: Do use cursors for frequently changing data. Don't rely on offset paging for live feeds.
- **Audit check**: grep API calls for `offset=`/`page=` on feeds that mutate; check for `cursor`/`after` params.
- **Restyle fix**: Switch the endpoint and client to cursor-based pagination.
- **Severity**: medium ; **Tags**: tables, interaction-cost

### W2-79 Truncate page links to first, last, current, and neighbors  (src: pagination)
- **Rule**: Never render every page link; show first, last, current, and immediate neighbors with ellipses for gaps. Pick numbered, load-more, or infinite scroll by job.
- **Why**: Hundreds of links overflow the screen.
- **Do / Don't**: Do collapse ranges with ellipses. Don't render hundreds of numbered links.
- **Audit check**: Check pagination components for `Array.from({length: totalPages})` rendering all pages with no ellipsis.
- **Restyle fix**: Implement a windowed page list with ellipsis.
- **Severity**: medium ; **Tags**: navigation, tables, layout

### W2-80 Persist the page in the URL and restore scroll on return  (src: pagination)
- **Rule**: Put the page number in the URL (`?page=500`) so reloads hold position and links can be shared; also restore scroll after users come back from a detail page.
- **Why**: Users get annoyed when they lose their place.
- **Do / Don't**: Do store the page in the URL and restore scroll. Don't send lists back to the top upon return.
- **Audit check**: Check that pagination state is in the URL (`searchParams`, router query) and not just `useState`; look for scroll restoration logic.
- **Restyle fix**: Sync page state to the query string and restore scroll position.
- **Severity**: medium ; **Tags**: navigation, interaction-cost

## Web patterns: Interactions

### W2-81 Never hide primary actions behind hover  (src: hover-trap)
- **Rule**: Touch has no hover, so the first tap becomes a sticky hover that freezes revealed actions. Hover may surface extras only, and hover-only actions need a touch-reachable home (in the card, behind a swipe, or in a bottom sheet).
- **Why**: Touch users can't reach hover-only actions.
- **Do / Don't**: Do keep every primary action tappable. Don't hide primary actions behind hover.
- **Audit check**: grep `group-hover:opacity-100`, `:hover` reveal of buttons (`opacity-0 group-hover:`) for essential actions.
- **Restyle fix**: Make the actions always visible or move them into a menu/sheet on touch.
- **Severity**: high ; **Tags**: mobile, interaction-cost, buttons

### W2-82 Wrap hover styles in @media (hover: hover) and use pointer: coarse  (src: hover-trap)
- **Rule**: Test pointer capability with `@media (hover: hover)` instead of user-agent sniffing, and use `pointer: coarse` to enlarge controls for thumbs.
- **Why**: Mouse-equipped tablets keep full hover behavior while touch-only devices dodge sticky hover.
- **Do / Don't**: Do rely on media queries for hover and pointer. Don't infer touch from the user-agent string.
- **Audit check**: grep `navigator.userAgent` touch sniffing, `:hover` rules outside `@media (hover: hover)`, and `pointer: coarse` usage.
- **Restyle fix**: Wrap hover styles in `@media (hover: hover)` and add `pointer: coarse` sizing.
- **Severity**: medium ; **Tags**: mobile, interaction-cost

### W2-83 Pad touch targets to 44px while keeping icons about 20px  (src: hover-trap)
- **Rule**: A 20px icon looks fine in design review yet is hard to hit; pad the hit area to 44px while keeping the glyph small.
- **Why**: Undersized targets lead to taps landing in the wrong place.
- **Do / Don't**: Do expand the tap area to 44px. Don't let the icon's size set the target size.
- **Audit check**: grep icon buttons with `w-5 h-5`/`size-5` and no padding; computed button size under 44px.
- **Restyle fix**: Add padding (e.g. `p-3`) or `min-w-11 min-h-11` to icon buttons.
- **Severity**: high ; **Tags**: mobile, accessibility, buttons

### W2-84 Interpolate live cursor positions between server ticks  (src: live-cursors)
- **Rule**: The server streams about 10 positions per second while the screen redraws at 60fps; interpolate between ticks so cursors glide instead of teleporting.
- **Why**: Raw tick-rate rendering looks jumpy.
- **Do / Don't**: Do interpolate positions each frame. Don't render at raw server tick rate.
- **Audit check**: Check cursor rendering for lerp/spring/`requestAnimationFrame` smoothing versus direct position assignment on each message.
- **Restyle fix**: Add interpolation or a spring to cursor movement.
- **Severity**: low ; **Tags**: motion, craft

### W2-85 Hash user color from a stable ID and show presence  (src: live-cursors)
- **Rule**: Derive each collaborator's color from a hash of their ID so it persists across sessions, and show an avatar stack with an overflow counter (e.g. three faces, then +5) to signal presence.
- **Why**: Stable identity cues are tracked peripherally; presence is felt before anyone speaks.
- **Do / Don't**: Do hash IDs to colors and show an avatar stack with overflow. Don't assign random colors per session.
- **Audit check**: grep `Math.random()` used for user colors; check for an avatar group with `+N` overflow.
- **Restyle fix**: Replace random color assignment with an ID hash and add a stacked avatar presence indicator.
- **Severity**: low ; **Tags**: color, craft

### W2-86 Lock selected elements and outline them in the editor's color  (src: live-cursors)
- **Rule**: Selecting an element should lock it and outline it in the selector's color, preventing two people editing the same shape.
- **Why**: Stops clashing edits.
- **Do / Don't**: Do lock and badge selected elements. Don't permit simultaneous edits of one element.
- **Audit check**: Check collaborative selection code for lock state broadcast and a colored outline/badge on locked elements.
- **Restyle fix**: Add a lock indicator with the editor's color on selected elements.
- **Severity**: low ; **Tags**: states, interaction-cost

### W2-87 Offer follow mode for live design review  (src: live-cursors)
- **Rule**: Let a user click another user's avatar to bind their viewport to that user's pans and zooms, replacing screen share.
- **Why**: It makes live review in-product.
- **Do / Don't**: Do bind the viewport on avatar click. Don't force screen sharing for review.
- **Audit check**: Look for avatar click handlers that subscribe to another user's viewport state.
- **Restyle fix**: Add a follow action to avatars with a visible "following" state.
- **Severity**: low ; **Tags**: interaction-cost, navigation
