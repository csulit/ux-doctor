# Web patterns W3
> Source: public UX pattern pages (paraphrased tips). Not part of the PDF playbook.

## Web patterns: Inputs

### W3-03 Make sliders fillable, fully draggable and keyboard operable  (src: range-sliders)
- **Rule**: Fill the track up to the thumb for an instant value read, and make the whole row draggable, not a 4px hairline. Arrows step by one; Home/End jump to extremes.
- **Why**: Precise dragging is hard, and a thin unfilled track leaves the value to guesswork.
- **Do / Don't**: Do: Provide a filled track, a row-wide drag target, and arrow/Home/End support. Don't: Depend on a 4px hairline as the sole target or ship mouse-only sliders.
- **Audit check**: Inspect custom sliders for a filled-range element, track height ~4px with no enlarged padding/hit area, and onKeyDown handling of ArrowLeft/ArrowRight/Home/End (or native input[type=range]).
- **Restyle fix**: Add a fill element sized to the value, pad the track hit area to the full row height, and add key handlers plus role="slider" with aria-valuenow/min/max.
- **Severity**: medium ; **Tags**: forms, accessibility

### W3-04 Snap sliders to steps and show the value above the thumb  (src: range-sliders)
- **Rule**: Snap to steps with visible ticks so values like 47.3 never appear. Show the exact value over the thumb while dragging; use a two-thumb band for min/max cases like price.
- **Why**: The number appears where the eye already looks, and values stay tidy.
- **Do / Don't**: Do: Use stepped snapping and a live value tooltip over the thumb. Don't: Keep a slider continuous if users need clean numbers.
- **Audit check**: Check for a step attribute/value on range inputs and a value readout near the thumb during drag; price filters should use a two-thumb range.
- **Restyle fix**: Set step on the slider, add tick marks, render a tooltip bound to the thumb position, and use a dual-thumb band for ranges.
- **Severity**: low ; **Tags**: forms, interaction-cost

### W3-05 Make star ratings preview on hover and restore on leave  (src: star-rating)
- **Rule**: Light up the stars up to the pointer while hovering, as a preview before committing. Hold this hover state apart from the saved rating so leaving without clicking restores it.
- **Why**: People see what they are about to submit rather than finding out afterwards.
- **Do / Don't**: Do: Preview while hovering and return to the saved value on mouse leave. Don't: Let the display stay frozen on the last hovered star.
- **Audit check**: Look for separate hover and value state (e.g. hoverValue vs value) and an onMouseLeave that resets hover; flag rating widgets with only onClick.
- **Restyle fix**: Add a hover state driving fill, and clear it on mouseleave so the display falls back to the saved rating.
- **Severity**: medium ; **Tags**: forms, states

### W3-06 Render fractional stars for averages and stagger the fill  (src: star-rating)
- **Rule**: Show averages as partial fills: 4.4 becomes four whole stars and a fifth cut at 44%, never rounded up. On commit, fill left to right with ~30ms stagger per star.
- **Why**: Rounding up overstates quality, and an all-at-once pop feels dull.
- **Do / Don't**: Do: Clip the final star to the fractional percentage and sweep the fill with ~30ms stagger. Don't: Round averages upward or pop every star together.
- **Audit check**: Check average displays for Math.round/Math.ceil on rating values and for a width/clip-path percentage on the last star; check transition-delay steps of about 30ms per star.
- **Restyle fix**: Use a width or clip-path percentage on an overlay star layer and add per-index transition delay of ~30ms.
- **Severity**: low ; **Tags**: forms, motion

### W3-07 Write a descriptive search placeholder and show recent searches  (src: search-experience-system)
- **Rule**: Write a placeholder that says what is searchable (e.g. "Search by name, SKU, or brand") rather than a bare "Search". Show recent searches the moment the field gains focus so one tap refills it.
- **Why**: The placeholder is the first onboarding and recent items cut friction to zero.
- **Do / Don't**: Do: Use descriptive placeholder text and surface recent searches on focus. Don't: Ship a bare "Search" placeholder with an empty focus state.
- **Audit check**: grep placeholder="Search" (exact, bare) on search inputs; check for an onFocus-driven recent-searches list.
- **Restyle fix**: Rewrite the placeholder to name searchable fields and render a recent-searches panel on focus.
- **Severity**: low ; **Tags**: forms, copy

### W3-08 Rank autocomplete by popularity and support keyboard navigation  (src: search-experience-system)
- **Rule**: Rank suggestions by clicks, not alphabetically, with category badges; three precise hits beat ten noisy ones. Arrows navigate, Enter selects, Escape closes, and the focus ring stays visible.
- **Why**: Popularity ordering surfaces probable targets, and hidden focus breaks keyboard use.
- **Do / Don't**: Do: Rank by popularity, add category badges, support full keyboard control and a visible focus ring. Don't: Order suggestions alphabetically or strip the focus outline.
- **Audit check**: Check for onKeyDown handling ArrowUp/ArrowDown/Enter/Escape, role="listbox"/"option" with aria-activedescendant, and outline:none / focus:outline-none without a replacement focus style.
- **Restyle fix**: Add key handlers and ARIA combobox roles, sort suggestions by usage score, and restore a visible focus-visible ring.
- **Severity**: medium ; **Tags**: forms, accessibility

### W3-09 Make empty search results a way forward  (src: search-experience-system)
- **Rule**: When a search finds nothing, present popular searches, category shortcuts or alternative spellings, helping users recover just as they would otherwise abandon.
- **Why**: An empty dead end is where people bounce.
- **Do / Don't**: Do: Give suggestions and category links when results are empty. Don't: Leave only a plain "No matches" line.
- **Audit check**: Find empty/no-results branches in search components and check they render more than a single text line (links, suggestions).
- **Restyle fix**: Add popular searches, category chips and a spell-suggestion line to the empty state.
- **Severity**: medium ; **Tags**: states, copy

### W3-10 Chunk long forms into steps with visible progress  (src: stepper-wizard)
- **Rule**: Split long forms into meaningful groups (Personal, Shipping, Payment, Review), not arbitrary counts: three fields are easy, twelve cause exhausting scrolling. Add one progress cue: bar, numbered dots or labels.
- **Why**: Chunking reduces mental load, and visible progress shows the finish nearing.
- **Do / Don't**: Do: Group steps by context and include a progress indicator. Don't: Pile twelve fields into one scrolling wall or split at arbitrary counts.
- **Audit check**: Count inputs per form/page (flag around 12 or more in one view); check for a stepper/progress element in multi-step flows.
- **Restyle fix**: Break the form into semantic steps and add a progress bar, dots, or labeled steps.
- **Severity**: medium ; **Tags**: forms, layout

### W3-11 Validate inside each step and keep entered data  (src: stepper-wizard)
- **Rule**: Validate fields within their own step when Next is clicked, show inline errors immediately instead of rejecting at the final screen, and focus the first invalid field. Persist state on every step change so Back and refresh keep what was entered.
- **Why**: Losing a form or surfacing step-one errors on step four loses the user.
- **Do / Don't**: Do: Validate per step, show inline errors, and persist data across steps and refresh. Don't: Surface early errors at the end or discard input on Back/refresh.
- **Audit check**: Check each step validates on Next-click (not via a disabled Next; see W1-94), keeps entered data, and flags and focuses the first invalid field; check persistence (localStorage/sessionStorage/URL/state store) across steps.
- **Restyle fix**: Keep Next enabled, validate the step on click with a per-step schema, keep entered data, show inline messages and focus the first invalid field (see W1-94); persist form state on each step change.
- **Skill**: ux-ui-patterns
- **Severity**: medium ; **Tags**: forms, states

### W3-12 Build toggles with fixed proportions and a keyboard-accessible semantics  (src: toggle-anatomy)
- **Rule**: Make the rail 2x the knob's diameter, padded by the knob's radius so it stays centred in both states. Space toggles when focused; show a visible focus ring; expose the state through either role="switch" with aria-checked on a button, or a native checkbox using its own checked state (never both).
- **Why**: Steady proportions look polished, and proper semantics let keyboard and screen-reader users operate it.
- **Do / Don't**: Do: Use a button with role="switch" and aria-checked, or a native checkbox with its native checked state; add Space support and a visible focus ring. Don't: Ship a toggle that reacts only to mouse clicks, or put aria-checked on a native checkbox.
- **Audit check**: grep custom toggles for role="switch" + aria-checked on a button, or a native input type=checkbox without aria-checked (not a bare div onClick), and focus-visible styles; check rail width ≈ 2× knob size.
- **Restyle fix**: Use either a button with role="switch" and aria-checked, or a native checkbox relying on its checked state; add focus-visible ring and correct rail/knob sizing.
- **Severity**: medium ; **Tags**: forms, accessibility

### W3-13 Animate toggle flips over ~250ms and handle async state  (src: toggle-anatomy)
- **Rule**: Transition rail color, knob translateX, knob shadow and label together over ~250ms ease-out. Async: flip optimistically, show a knob loader while pending, revert with shake and error toast on failure.
- **Why**: An abrupt jump looks broken, and a switch without a spinner seems stuck during a request.
- **Do / Don't**: Do: Morph all four properties together, with a pending spinner and failure rollback. Don't: Snap the knob instantly or leave network status unclear.
- **Audit check**: Check toggle CSS for transition on background-color and transform with ~250ms ease-out; flag toggles with no transition; check async toggles for pending and error rollback handling.
- **Restyle fix**: Add transition-all duration-[250ms] ease-out to rail/knob, add pending spinner state and rollback on error.
- **Severity**: medium ; **Tags**: forms, motion

## Web patterns: Fundamentals

### W3-15 Group nav and toolbar items by function and let whitespace do the dividing  (src: proximity-rule)
- **Rule**: Group controls by function (navigate, actions, system) and split long lists like eight sidebar links into labeled groups such as Dashboard, Management and Account. Use whitespace for grouping before reaching for borders, boxes or dividers.
- **Why**: Spacing and labeled groups make flat lists scannable without extra lines.
- **Do / Don't**: Do: Group by meaning and rely on spacing first. Don't: Use boxes and dividers where a larger gap says the same thing.
- **Audit check**: Check sidebars/toolbars for a single evenly spaced list of many items and for border/divider elements between every group.
- **Restyle fix**: Split long nav lists into labeled sections and swap dividers for larger gaps.
- **Severity**: medium ; **Tags**: spacing, navigation

### W3-16 Stack size, color, contrast, whitespace and weight to create one focal point  (src: visual-hierarchy)
- **Rule**: Make the primary element about 2x body size with more padding than neighbours, supported by weight: 800 headings, 400 body, 300 captions. Combine properties; none carries a layout alone.
- **Why**: Stacked cues create a clear entry point and reading order.
- **Do / Don't**: Do: Make the headline about double body size, combining size with weight, contrast and spacing. Don't: Depend on size alone or give everything equal emphasis.
- **Audit check**: Compare heading to body font sizes (ratio near 2x), font-weight spread across headings/body/captions, and padding of the hero versus secondary items.
- **Restyle fix**: Scale the headline to ~2x body, set weights 800/400/300 by role, and give the hero extra padding. (On conflict the playbook wins: see F-03, small captions stay at 400; use 300 only at large display sizes.)
- **Scope**: Captions and small text stay at weight 400 (F-03); 300 only at large display sizes.
- **Severity**: medium ; **Tags**: hierarchy, typography

### W3-17 Reserve one accent color for the single key action  (src: visual-hierarchy)
- **Rule**: Keep the interface neutral; reserve one accent for the one action you want taken. Contrast pairs: bold white headings over muted copy, filled primary beside ghost secondary.
- **Why**: Many colors turn hierarchy into noise.
- **Do / Don't**: Do: Use one accent for the primary action and ghost-style secondaries. Don't: Give each element its own color.
- **Audit check**: Count distinct accent/hue classes in a view; check for more than one filled primary-style button per view.
- **Restyle fix**: Neutralize secondary elements, make secondary buttons ghost/outline, and keep the accent fill only on the primary CTA. (On conflict the playbook wins: see E-31, avoid pure white; use off-white for headings; and E-03, links and active states may carry the primary colour as text or indicator.)
- **Scope**: The accent fill goes on one primary action per view; links and active states may carry the primary colour as text or an indicator (E-03) and don't count as a second accent.
- **Skill**: ux-hierarchy-clarity
- **Severity**: medium ; **Tags**: color, hierarchy

### W3-19 Limit emphasis to one element and never rely on color alone  (src: von-restorff)
- **Rule**: Highlight one element per view (featured plan, main CTA or form button); two or three cancel each other out. Add scale, elevation and glow to color so color-blind users notice.
- **Why**: Competing emphasis cancels isolation, and color-only contrast fails some users.
- **Do / Don't**: Do: Emphasise one element and pair color with scale or elevation. Don't: Highlight several items or depend on color alone.
- **Audit check**: Count emphasized elements per view (primary buttons, highlighted cards); check whether the emphasized state differs by more than hue (size, shadow, badge). Pricing-card sets: emphasise one plan only.
- **Restyle fix**: Demote extra highlights and add scale/elevation/badge to the one standout.
- **Also cited as**: W3-18 (web:von-restorff)
- **Severity**: medium ; **Tags**: hierarchy, accessibility

## Web patterns: Surfaces

### W3-24 Give cards generous padding, radius and a clear type hierarchy  (src: perfect-card)
- **Rule**: Generous padding signals intent: use 40px instead of a cramped 12px, plus a 24px border-radius. Title at weight 600, ~38px; body smaller at ~55% opacity so the title wins.
- **Why**: Spacing and type account for most of the difference between cheap-looking and premium cards.
- **Do / Don't**: Do: Use ~40px padding, ~24px radius, a 600-weight title and ~55% opacity description. Don't: Squeeze content to the edges with tiny padding, near-zero radius or equal title/body weight.
- **Audit check**: Check card classes for p-3/12px padding with rounded-none/sm, and title/body with the same font-weight and opacity.
- **Restyle fix**: Raise card padding to ~40px, radius to ~24px, set title 600 at ~38px, and body ~55% opacity. (On conflict the playbook wins: see F-09, the blended body colour must still reach 4.5:1; measure it with `contrast.mjs --over`, and raise the opacity or use a grey token if it fails.)
- **Scope**: Opacity text is allowed only if the blended colour still reaches 4.5:1 on the real surface (`contrast.mjs --over`); otherwise use a solid grey token (F-09).
- **Severity**: medium ; **Tags**: cards, spacing

### W3-25 Layer a tight and a soft shadow plus a ~12% hairline border on cards  (src: perfect-card)
- **Rule**: Stack two shadows — a tight, darker one for contrast and a wide, soft one for ambient elevation — and add a hairline border at about 12% opacity to define the card edge on a dark background.
- **Why**: Two layers read as believable depth and the border keeps the edge crisp.
- **Do / Don't**: Do: Combine a tight and a soft ambient shadow with a ~12% border. Don't: Use one flat shadow or no edge definition on dark surfaces.
- **Audit check**: grep box-shadow values on cards for a single shadow and check border color alpha around 0.12 (e.g. border-white/10–12).
- **Restyle fix**: Replace single shadow with two comma-separated layers and add a 1px border at ~12% opacity. (On conflict the playbook wins: see D-05, soft diffuse shadows over a tight dark one.)
- **Scope**: Shadows stay soft and diffuse (D-05): drop the tight dark layer. The ~12% hairline border is fine on dark backgrounds.
- **Severity**: medium ; **Tags**: cards, shadows

### W3-27 Build elevation from three layered shadows and use it as hierarchy  (src: shadow-elevation)
- **Rule**: Layer a tight contact shadow (~0 1px 3px), a mid-range and a wide diffuse shadow. Elevation signals importance: reserve it for key elements, e.g. lifted premium plan, flat basic.
- **Why**: Layered shadows look physical, and elevation conveys priority.
- **Do / Don't**: Do: Use three shadow layers and keep the highest elevation for the most important elements. Don't: Use one flat drop shadow everywhere or treat shadows as decoration.
- **Audit check**: Check box-shadow declarations for a single layer and for identical shadows across all surfaces. Typical layer blurs are about 2, 12 and 32px.
- **Restyle fix**: Define an elevation scale with three-layer shadows and apply the highest level only to key elements.
- **Also cited as**: W1-19 (web:depth-layers)
- **Severity**: medium ; **Tags**: shadows, depth

### W3-28 Use a brand-tinted glow and optional 3D tilt for premium elevation  (src: shadow-elevation)
- **Rule**: Add a low-opacity blurred glow in an accent hue matching the product domain (creative tools purple, fintech blue, health green). Perspective with small rotateX and translateZ adds 3D depth.
- **Why**: Tinted glows give branded polish that plain black shadows can't.
- **Do / Don't**: Do: Tint the glow with the brand accent. Don't: Rely on black shadows alone for a branded product.
- **Audit check**: Check shadow colors for rgba(0,0,0,…) only; look for perspective/rotateX/translateZ on lifted surfaces.
- **Restyle fix**: Add a low-opacity accent-colored glow layer to the shadow stack.
- **Scope**: One focal element only (primary CTA, featured card); default elevation follows D-05 and D-06.
- **Severity**: low ; **Tags**: shadows, color

### W3-29 Build depth from background values and a hairline, not shadows  (src: reverse-engineered-linear)
- **Rule**: For a flat engineered look, skip shadows; use three background tones (base, surface, raised) divided by a 1px border of 8% white. Hover shifts surface value, not elevation.
- **Why**: Flat surfaces feel engineered, whereas shadows feel decorated.
- **Do / Don't**: Do: Use three background values, an rgba white 8% hairline, and surface-value hover. Don't: Separate rows, panels or the sidebar with drop shadows.
- **Audit check**: grep shadow-* / box-shadow on rows, panels and sidebars in dense dark UIs; check for border-white/[0.08] and hover:bg-* changes.
- **Restyle fix**: Remove shadows, define three bg tokens, add 1px rgba(255,255,255,0.08) borders and hover surface shifts.
- **Severity**: medium ; **Tags**: depth, borders

### W3-30 Make dense UIs compact with one accent and grey status icons  (src: reverse-engineered-linear)
- **Rule**: Compact UIs signal competence: 13px text, 32px rows, -1% tracking fit 14 issues versus 8. One indigo accent on selected row and primary button; status as grey icons, not pills.
- **Why**: Seven colors reduce to one, and the UI looks intentional.
- **Do / Don't**: Do: Use 13px text, 32px rows, one accent and grey status icons. Don't: Mark status or priority with colored pills where a grey icon conveys it.
- **Audit check**: Check data-list row heights (~32px), font-size 13px, count of distinct accent colors, and colored badge/pill status components.
- **Restyle fix**: Compact rows, apply -0.01em tracking, replace colored pills with grey icons and limit the accent to selection and primary. Dense tool UIs only; grey icons are for workflow statuses (todo, in progress, done) told apart by icon shape. (On conflict the playbook wins: see F-06, 16px body, and E-11/E-10, error and success keep red/green plus an icon or label.)
- **Scope**: Dense data and tool UIs only: never below the 12px floor, and reading text stays 16px (F-06). Grey icons only for workflow statuses told apart by shape; system statuses keep their conventional hue plus an icon or label (E-11, E-10).
- **Severity**: medium ; **Tags**: tables, color

## Web patterns: Overlays

### W3-34 Delay hover tooltips ~300ms and anchor them with an arrow  (src: tooltip-design)
- **Rule**: Hold a hover tooltip back for about 300ms so accidental cursor passes don't open it, and add an arrow pointing at the trigger so the target is clear.
- **Why**: Instant tooltips without an anchor are noisy and ambiguous.
- **Do / Don't**: Do: Delay ~300ms and add an arrow toward the trigger. Don't: Pop up immediately whenever the cursor brushes past.
- **Audit check**: Check tooltip components for delay props (delayDuration/delay ≈ 300) and an arrow element; flag 0ms delays.
- **Restyle fix**: Set the open delay to 300ms and render an arrow.
- **Severity**: low ; **Tags**: interaction-cost, states

### W3-35 Flip tooltips near edges and allow every dismissal route  (src: tooltip-design)
- **Rule**: Near a viewport edge, show the tooltip on the opposite side to avoid clipping, and dismiss it on mouse leave, Escape, blur (focus leaving) and tapping elsewhere.
- **Why**: Clipped or undismissable tooltips harm readability and accessibility.
- **Do / Don't**: Do: Flip near edges and dismiss on mouse leave, Escape, blur and outside tap. Don't: Let tooltips clip off-screen or close only on mouse leave.
- **Audit check**: Check tooltip positioning (flip/collision handling) and keydown Escape/onBlur handlers.
- **Restyle fix**: Enable flip/collision avoidance and add Escape, blur and outside-click handlers.
- **Severity**: medium ; **Tags**: accessibility, interaction-cost

### W3-36 Keep tooltip copy to one short sentence  (src: tooltip-design)
- **Rule**: Limit tooltip width to about 300px and a single sentence; a paragraph of documentation belongs elsewhere.
- **Why**: Long tooltip text is hard to read and vanishes when the mouse moves.
- **Do / Don't**: Do: Use one sentence, at most ~300px wide. Don't: Stuff multi-line, documentation-sized text into a tooltip.
- **Audit check**: Check tooltip max-width (~300px/max-w-xs) and content length.
- **Restyle fix**: Shorten the text or move it to a popover/help page.
- **Severity**: low ; **Tags**: copy

### W3-37 Position toasts away from the content center  (src: toast-notifications)
- **Rule**: Place toasts bottom-right on desktop and at the top edge on mobile; never the screen center, which covers active content and blocks clicks.
- **Why**: Central toasts block the content users are working on.
- **Do / Don't**: Do: Anchor bottom-right on desktop and top on mobile. Don't: Put toasts in the screen center.
- **Audit check**: Check toast container position classes (bottom-right, top-center on mobile) and absence of centered fixed toasts.
- **Restyle fix**: Move the toast viewport to bottom-right (desktop) and top (mobile).
- **Severity**: medium ; **Tags**: layout, mobile

### W3-38 Match toast dismiss timing to severity and cap the stack at three  (src: toast-notifications)
- **Rule**: Auto-dismiss info after about 4s, warnings after about 7s, and keep critical errors until acknowledged. Show at most 3 toasts, newest at the bottom, older floating up and out, and queue the rest.
- **Why**: Timing and caps match urgency and avoid a pile-up.
- **Do / Don't**: Do: Use ~4s info, ~7s warning, sticky errors, and max 3 visible. Don't: Auto-dismiss critical errors or show more than three toasts.
- **Audit check**: grep toast duration options (≈4000, ≈7000) and Infinity for errors; check visibleToasts/limit ≤ 3. Banners, modals and badges persist until resolved; only toasts auto-dismiss.
- **Restyle fix**: Set per-severity durations, make errors persistent, and set a toast limit of 3 with a queue.
- **Also cited as**: W2-66 (web:notification-system)
- **Severity**: medium ; **Tags**: states, interaction-cost

### W3-39 Give toasts an exit, hover-pause and non-color cues  (src: toast-notifications)
- **Rule**: Provide a close button (desktop), swipe-dismiss (mobile) and a hover-paused timer. Pair color-coded types with an icon and accent border; about 6% of users can't distinguish the colors.
- **Why**: Users need control of timing, and color alone is insufficient.
- **Do / Don't**: Do: Pause the countdown on hover and pair color with an icon and accent border. Don't: Depend on color alone to convey toast type.
- **Audit check**: Check toasts for a close button, pauseOnHover behavior, swipe handling, and an icon per type.
- **Restyle fix**: Add a close button, pause-on-hover, and per-type icon and left border.
- **Severity**: medium ; **Tags**: accessibility, color

### W3-40 Prefer undo with a visible countdown over "Are you sure?" dialogs  (src: undo-ux)
- **Rule**: Run the action immediately and offer a timed undo with a visible clock (draining ring or bar) in place of confirmation dialogs. Keep the window long enough to react.
- **Why**: Undo penalises nobody; confirmations penalise everyone for one person's slip.
- **Do / Don't**: Do: Execute at once and show an undo toast with a countdown. Don't: Put every destructive action behind a confirmation prompt.
- **Audit check**: grep window.confirm / confirm dialogs on reversible deletes and check undo toasts for a timer indicator. Bulk deletes: a 10s undo replaces the confirm modal.
- **Restyle fix**: Replace confirm dialogs on reversible actions with an undo toast with a draining bar.
- **Also cited as**: W1-45 (web:bulk-actions)
- **Scope**: Reversible deletes only. Irreversible actions keep the confirm dialog built per G-10, G-11 and G-12, with named buttons (W1-91) and friction scaled to the stakes (W3-41). Don't flag a missing dialog where undo exists.
- **Skill**: ux-ui-patterns
- **Severity**: medium ; **Tags**: interaction-cost, states

### W3-41 Soft-delete with a recovery window and reserve heavy friction for irreversible actions  (src: undo-ux)
- **Rule**: Set a deleted flag and keep items in trash for thirty days before purging; save type-to-confirm friction (like GitHub requiring the repo name) for truly irreversible actions. Delayed send (Gmail's ten seconds) and an undo stack with Cmd+Z extend the same idea.
- **Why**: Deletion should be a state, not an event, and friction should sit only where there is no way back.
- **Do / Don't**: Do: Soft-delete with a recovery window and use type-to-confirm only for irreversible actions. Don't: Hard-delete from the database on click.
- **Audit check**: Check delete handlers for hard DELETE vs deleted_at/deletedAt flags and for a trash view; check irreversible flows for type-to-confirm. For irreversible deletes add hold-to-confirm, a danger zone or a cancelable cooldown.
- **Restyle fix**: Add a deleted_at flag with a 30-day purge and require typing the resource name for permanent deletion.
- **Also cited as**: W1-93 (web:destructive-actions)
- **Skill**: ux-ui-patterns
- **Severity**: medium ; **Tags**: states, interaction-cost

### W3-42 Quarantine destructive settings and match apply model to stakes  (src: settings-system)
- **Rule**: Commit light toggles instantly with a saved confirmation; identity fields like email get Save/Cancel. Wall delete off at the page bottom, gated by typing the exact resource name.
- **Why**: Matching commit style to blast radius prevents accidents.
- **Do / Don't**: Do: Apply low-stakes toggles instantly, require explicit save for identity, and type-to-confirm for delete. Don't: Allow irreversible actions on one unprotected click.
- **Audit check**: Check destructive buttons for a confirm input requiring the resource name, a danger-zone section at page bottom, and Save/Cancel on identity fields.
- **Restyle fix**: Move delete into a bottom danger zone with type-the-name confirmation.
- **Severity**: medium ; **Tags**: states, interaction-cost

### W3-43 Organize settings by task, searchable, with reset per changed value  (src: settings-system)
- **Rule**: Group by user task, not data model, so twenty flat rows become three scannable sections; add search; mark changed values with a modified indicator and per-setting reset; collapse advanced options.
- **Why**: Task grouping and search keep the common path short.
- **Do / Don't**: Do: Group by task, add search, show modified markers with reset, and collapse advanced options. Don't: Dump every option into one flat schema-ordered list or bury settings in nested menus.
- **Audit check**: Check settings pages for a search input, section headings, and reset controls; count rows in an ungrouped list.
- **Restyle fix**: Split settings into task sections, add a search field, reset links and an advanced accordion.
- **Severity**: medium ; **Tags**: navigation, forms

### W3-44 Give swipe actions discoverability, friction and a visible fallback  (src: swipe-actions)
- **Rule**: Hint via peek or onboarding nudge; reveal destructive buttons on partial swipe, committing by tap (or full swipe plus undo toast). Add a visible fallback: long-press menu or detail-view button.
- **Why**: Swipe is hidden UI, and an instant full-swipe delete risks losing data.
- **Do / Don't**: Do: Pair swipe actions with an undo window and a visible fallback path. Don't: Make swipe the sole route or let a full swipe delete immediately.
- **Audit check**: Check swipe components for an undo handler and an equivalent button/menu action in the row or detail view.
- **Restyle fix**: Add an overflow menu or detail button, and an undo toast for swipe deletes.
- **Severity**: medium ; **Tags**: mobile, accessibility

### W3-45 Color-code swipe actions by consequence and cap actions per side  (src: swipe-actions)
- **Rule**: Use surface tones for neutral actions and red for destructive ones, keep colors and left/right meanings uniform in every list, and limit each side to two actions.
- **Why**: Past two actions, users can't form muscle memory.
- **Do / Don't**: Do: Keep colors and left/right meanings uniform app-wide. Don't: Offer over two actions on either side.
- **Audit check**: Count swipe actions per side and compare action colors/directions across list components.
- **Restyle fix**: Reduce to two actions per side and standardize the color mapping.
- **Severity**: low ; **Tags**: mobile, color

## Web patterns: Navigation

### W3-46 Slide the tab indicator and fade content instead of cutting  (src: tabs-system)
- **Rule**: Glide the active indicator with a spring instead of jumping, timed to the content fade. Fade out, wait about 80ms, fade in, and equalise panel heights to prevent shifting.
- **Why**: Hard cuts and layout shifts make tab changes feel abrupt.
- **Do / Don't**: Do: Slide the indicator and fade panels of equal height. Don't: Swap content with a hard cut.
- **Audit check**: Check tab indicators for transition/layoutId/spring on position, and panels for opacity transition and min-height.
- **Restyle fix**: Add an animated indicator and a fade transition with ~80ms pause and equal panel heights.
- **Severity**: low ; **Tags**: navigation, motion

### W3-47 Scroll overflowing tabs and make them keyboard operable  (src: tabs-system)
- **Rule**: When tabs overflow, scroll sideways with edge fades and desktop chevron buttons, not wrapping. Arrows move between tabs, Home first, End last, Tab exits to next focusable group.
- **Why**: Wrapping breaks the row, and keyboard support is basic.
- **Do / Don't**: Do: Scroll overflow with fades and support arrow/Home/End keys. Don't: Let an overflowing tab row spill onto a second line.
- **Audit check**: Check tab lists for flex-wrap, overflow-x-auto with fade masks, role="tablist"/"tab" and onKeyDown for arrows/Home/End.
- **Restyle fix**: Switch to nowrap overflow-x scroll with edge fades and add roving tabindex key handling.
- **Severity**: medium ; **Tags**: navigation, accessibility

### W3-48 Keep the focus ring and active tab in different colors  (src: tabs-system)
- **Rule**: Never let the focus ring and the active state share a color, otherwise keyboard users cannot tell where they are versus what is selected.
- **Why**: Distinct signals separate focus from selection.
- **Do / Don't**: Do: Use distinct colors for focus and active. Don't: Reuse the same color for both.
- **Audit check**: Compare focus-visible ring color with the active tab color.
- **Restyle fix**: Change the focus ring to a contrasting color or offset ring distinct from the active indicator.
- **Severity**: medium ; **Tags**: accessibility, color

### W3-49 Adapt tabs to mobile with segmented controls or a sheet  (src: tabs-system)
- **Rule**: On mobile, use a segmented control when there are fewer than 5 tabs and a bottom sheet when there are more than 5; don't just shrink the desktop bar.
- **Why**: A shrunken desktop bar is hard to use on mobile.
- **Do / Don't**: Do: Choose a segmented control below 5 tabs, a bottom sheet above 5. Don't: Carry the desktop tab bar to mobile in smaller form.
- **Audit check**: Check mobile breakpoints for a different tab component and count tabs per bar.
- **Restyle fix**: Add a mobile variant: segmented control or bottom sheet by tab count.
- **Severity**: low ; **Tags**: mobile, navigation

## Web patterns: Feedback

### W3-50 Use skeletons that mirror the final layout and shimmer  (src: skeleton-loading)
- **Rule**: Mimic what's coming: avatar circle, text bars, image block, with shimmer; a static skeleton looks broken. Use true content dimensions, since a layout-changing skeleton is worse than a spinner.
- **Why**: Skeletons let users begin parsing the layout during loading.
- **Do / Don't**: Do: Shape skeletons like the final layout and animate them. Don't: Use a static or mismatched skeleton.
- **Audit check**: Check skeleton components for animate-pulse/shimmer keyframes and matching dimensions with loaded components; check for layout shift (CLS) on load. Measure the loaded UI (`getBoundingClientRect()` per block) and copy sizes, gaps, radius and line counts into the skeleton instead of guessing; reserve media space with `aspect-ratio`.
- **Restyle fix**: Rebuild the skeleton from the real component's dimensions and add a shimmer animation.
- **Also cited as**: W4-01 (web:skeleton-measure)
- **Skill**: ux-ui-patterns
- **Severity**: medium ; **Tags**: states, motion

## Web patterns: Motion

