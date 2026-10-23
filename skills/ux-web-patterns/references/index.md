# Web-sourced modern product-UI patterns: states, feedback, motion, components, AI-look tells (paraphrased) — rule index

| ID | Rule | Page/Src (p.N = playbook PDF page; web:slug = web rule, no page) | Severity | Tags |
|---|---|---|---|---|
| W1-01 | Run entrances at 200–300ms with ease-out | web:animation-timing | medium | motion, craft |
| W1-02 | Make exits faster than entrances | web:animation-timing | low | motion, craft |
| W1-03 | Respond to taps within 100ms | web:animation-timing | medium | motion, interaction-cost, buttons |
| W1-04 | Stagger list items about 50ms apart | web:animation-timing | low | motion, craft |
| W1-05 | Reserve long bouncy motion for attention moments | web:animation-timing | low | motion, craft |
| W1-06 | Animate accordion height with grid rows, not height:auto | web:accordion-disclosure | medium | motion, craft |
| W1-07 | Sync the chevron with the panel animation | web:accordion-disclosure | low | motion, icons, craft |
| W1-08 | Open dropdown menus in about 150ms | web:dropdown-design | low | motion, craft |
| W1-09 | Build nested radii as outer minus padding | web:border-radius | low | craft, borders, spacing |
| W1-10 | Standardize corner radii on a single scale (4·8·12·16·24) | web:border-radius | medium | craft, borders |
| W1-11 | Grow radius with surface size and fit brand tone | web:border-radius | low | craft, borders, hierarchy |
| W1-12 | Check every text/background pair against WCAG contrast | web:color-accessibility | high | contrast, accessibility, color |
| W1-13 | Raise contrast on muted gray text first | web:color-accessibility | high | contrast, accessibility, typography |
| W1-14 | Pair every color cue with a second signal | web:color-accessibility | high | accessibility, color, states, icons |
| W1-15 | Avoid pure black backgrounds in dark mode | web:dark-mode | medium | dark-mode, depth, color |
| W1-16 | Express dark-mode elevation with lighter surfaces | web:dark-mode | medium | dark-mode, depth, color |
| W1-17 | Desaturate accents ~20% in dark mode | web:dark-mode | low | dark-mode, color |
| W1-18 | Soften text white and tier it with opacity in dark mode | web:dark-mode | medium | dark-mode, typography, hierarchy, contrast |
| W1-19 | Build shadows from three stacked layers | web:depth-layers | low | shadows, depth, craft |
| W1-20 | Add subtle hover lift with border emphasis | web:depth-layers | low | depth, shadows, interaction-cost, motion |
| W1-21 | Vary parallax speed per layer, subtly | web:depth-layers | low | depth, motion, craft |
| W1-22 | Replace hardcoded values with semantic tokens | web:design-system-kit | medium | color, craft |
| W1-23 | Use a numbered color scale mapped to semantic names | web:design-system-kit | low | color, craft |
| W1-24 | Set a fixed type scale of sizes and weights | web:design-system-kit | medium | typography, hierarchy |
| W1-25 | Space everything in 4px steps | web:design-system-kit | medium | spacing, craft |
| W1-26 | Describe every component by variant, size and state | web:design-system-kit | medium | buttons, forms, states, craft |
| W1-27 | Map easing and duration to intent | web:design-system-kit | low | motion, craft |
| W1-28 | Name tokens by role, not value | web:design-tokens | low | craft, color |
| W1-29 | Layer tokens primitives → semantic → component | web:design-tokens | low | craft |
| W1-30 | Snap stray sizes to a fixed scale | web:design-tokens | medium | spacing, typography, craft |
| W1-31 | Implement dark mode as a token set swap | web:design-tokens | medium | dark-mode, color, craft |
| W1-32 | Debounce autosave around 800ms | web:autosave-ux | medium | forms, interaction-cost |
| W1-33 | Model the save indicator as explicit states | web:autosave-ux | high | states, forms, copy |
| W1-34 | Queue edits offline and replay oldest first | web:autosave-ux | medium | states, forms |
| W1-35 | Never silently overwrite concurrent edits | web:autosave-ux | medium | states, forms |
| W1-36 | Guard unsaved work on exit | web:autosave-ux | medium | forms, states |
| W1-37 | Validate on client for speed and on server for trust | web:behind-the-button | high | forms, craft |
| W1-38 | Use optimistic UI only for cheap, reversible actions | web:behind-the-button | medium | states, interaction-cost |
| W1-39 | Use :has() instead of mirroring DOM state in JS | web:css-has-selector | low | forms, states, craft |
| W1-40 | Prefer :user-invalid over :invalid | web:css-has-selector | low | forms, states |
| W1-41 | Use CSS for layout and scroll-lock reactions | web:css-has-selector | low | layout, craft |
| W1-42 | Offer a three-state select-all checkbox | web:bulk-actions | medium | tables, forms, states |
| W1-43 | Name the exact count in bulk selection | web:bulk-actions | medium | tables, copy, states |
| W1-44 | Keep selection in app state with shift-click range | web:bulk-actions | low | tables, interaction-cost |
| W1-45 | Replace destructive-bulk confirm modal with a 10s undo | web:bulk-actions | medium | interaction-cost, states, tables |
| W1-46 | Offer date presets before custom ranges | web:date-pickers | medium | forms, interaction-cost |
| W1-47 | Make range selection legible and show two months | web:date-pickers | low | forms, interaction-cost |
| W1-48 | Fully support keyboard in date pickers | web:date-pickers | medium | accessibility, forms |
| W1-49 | Use a full-screen sheet for mobile date picking | web:date-pickers | medium | mobile, forms |
| W1-50 | Show live contrast in color pickers | web:color-picker-ux | low | color, contrast, forms |
| W1-51 | Give pickers OKLCH, memory and alpha previews | web:color-picker-ux | low | color, forms, interaction-cost |
| W1-52 | Generate tokens from one picked hue | web:color-picker-ux | low | color, craft |
| W1-53 | Use bottom sheets for thumb-zone actions | web:bottom-sheets | medium | mobile, interaction-cost, navigation |
| W1-54 | Give sheets snap points, drag-to-dismiss, and scrim with scroll lock | web:bottom-sheets | medium | mobile, states, interaction-cost |
| W1-55 | Keep context menus inside the viewport | web:context-menu | medium | layout, interaction-cost |
| W1-56 | Group menu actions and isolate Delete in red | web:context-menu | medium | hierarchy, states |
| W1-57 | Add a safe triangle for submenus | web:context-menu | low | interaction-cost, craft |
| W1-58 | Give context menus keyboard control and mobile long-press | web:context-menu | medium | accessibility, mobile, interaction-cost |
| W1-59 | Give dropdown triggers a 48px target with a caret | web:dropdown-design | medium | forms, mobile, icons, states |
| W1-60 | Flip dropdowns upward and add search past ~10 items | web:dropdown-design | medium | forms, interaction-cost, layout |
| W1-61 | Wire dropdown keyboard support | web:dropdown-design | high | accessibility, forms |
| W1-62 | Make command palettes fuzzy and grouped | web:command-palette | medium | navigation, interaction-cost |
| W1-63 | Prefill palette and keep it fully keyboard-driven | web:command-palette | medium | navigation, states, accessibility |
| W1-64 | Load async commands inline with nested drill-down | web:command-palette | low | navigation, states |
| W1-65 | Start bar chart y-axes at zero | web:charts-that-lie | high | craft, hierarchy |
| W1-66 | Pick the chart form from the question | web:charts-that-lie | medium | craft, hierarchy |
| W1-67 | Balance chart aspect ratio near 45° slope | web:charts-that-lie | low | craft, layout |
| W1-68 | Maximize data-ink and label directly | web:charts-that-lie | low | craft, color |
| W1-69 | Use color as encoding with one hero series | web:charts-that-lie | low | color, hierarchy |
| W1-70 | Title charts with the takeaway | web:charts-that-lie | low | copy, hierarchy |
| W1-71 | Use tri-state sorting on tables | web:data-table | low | tables, interaction-cost |
| W1-72 | Right-align numbers with tabular figures | web:data-table | high | tables, typography, alignment |
| W1-73 | Freeze header and first column | web:data-table | medium | tables, layout |
| W1-74 | Control row density through a single token | web:data-table | low | tables, spacing |
| W1-75 | Make the entire table row the selection target | web:data-table | low | tables, states, interaction-cost |
| W1-76 | Lift cards ~8px over ~200ms on hover | web:card-hover-anatomy | low | cards, shadows, motion, depth |
| W1-77 | Scale the image inside the card, never the card itself | web:card-hover-anatomy | medium | cards, layout, motion, imagery |
| W1-78 | Reveal card actions staggered at the bottom | web:card-hover-anatomy | low | cards, motion, layout |
| W1-79 | Signal card interactivity with an edge accent | web:card-hover-anatomy | low | cards, states, borders |
| W1-80 | Write a plain headline naming outcome and audience | web:de-ai-landing-hero | medium | copy, typography, hierarchy |
| W1-81 | Keep one accent and drop background blobs | web:de-ai-landing-hero | medium | color, depth, hierarchy |
| W1-82 | Make one primary hero button and a text-link secondary | web:de-ai-landing-hero | medium | buttons, hierarchy |
| W1-83 | Replace vague social proof with one specific quote | web:de-ai-landing-hero | low | copy, craft |
| W1-84 | Replace icon-circle feature rows with annotated product shots | web:de-ai-landing-hero | low | imagery, copy, cards, icons |
| W1-85 | Make the accordion header a real button with ARIA | web:accordion-disclosure | high | accessibility, interaction-cost |
| W1-86 | Choose single- vs multi-open by content | web:accordion-disclosure | low | interaction-cost, navigation |
| W1-87 | Anchor the tapped header when lower items expand | web:accordion-disclosure | low | interaction-cost, motion |
| W1-88 | Show drag pickup through scale, shadow and tilt | web:drag-and-drop | low | depth, shadows, states, motion |
| W1-89 | Reveal drop targets during the drag | web:drag-and-drop | medium | states, interaction-cost |
| W1-90 | Offer a ~5s undo after drops | web:drag-and-drop | low | interaction-cost, states |
| W1-91 | Use named buttons for destructive confirmations | web:destructive-actions | medium | copy, buttons, interaction-cost |
| W1-92 | Reserve red for destruction and move delete off the confirm spot | web:destructive-actions | medium | color, buttons, interaction-cost |
| W1-93 | Add friction to irreversible deletes | web:destructive-actions | medium | interaction-cost, states |
| W1-94 | Don't use disabled buttons to block submit | web:disabled-buttons | high | buttons, accessibility, forms, states |
| W1-95 | Distinguish loading from disabled | web:disabled-buttons | medium | buttons, states, accessibility, contrast |
| W1-96 | Acknowledge every interaction within 400ms | web:doherty-threshold | high | states, interaction-cost, motion |
| W1-97 | Use skeletons, optimistic updates and progress for waits | web:doherty-threshold | high | states, interaction-cost |
| W2-01 | Default to ease-out for entering elements | web:easing-curves | medium | motion, craft |
| W2-02 | Add a restrained spring overshoot to presses and modals | web:easing-curves | low | motion, craft |
| W2-03 | Stagger list and card entrances | web:easing-curves | low | motion, craft |
| W2-04 | Reuse one small set of easing curves everywhere | web:easing-curves | low | motion, craft |
| W2-05 | Group related items with shared visual properties | web:gestalt-laws | medium | hierarchy, alignment, layout |
| W2-06 | Wrap distant related elements in a shared container | web:gestalt-laws | low | cards, borders, layout |
| W2-07 | Dim and blur the background behind a modal | web:gestalt-laws | medium | depth, hierarchy |
| W2-08 | Derive spacing and type scales from one ratio | web:golden-ratio | medium | spacing, typography, hierarchy |
| W2-09 | Split layouts roughly 62% / 38% | web:golden-ratio | low | layout, hierarchy |
| W2-10 | Use a 12-column grid with clear column ratios | web:grid-system | medium | layout, alignment, spacing |
| W2-11 | Choose gutter width to match the intended mood | web:grid-system | low | spacing, layout |
| W2-12 | Collapse the grid at breakpoints: 12 → 6 → 4 → 1 | web:grid-system | high | layout, mobile |
| W2-13 | Establish the grid before breaking it on purpose | web:grid-system | low | layout, alignment, craft |
| W2-14 | Keep gradients within about 60° of hue | web:gradient-design | low | color, craft |
| W2-15 | Use gradients as ambient glow, not as full surfaces behind text | web:gradient-design | medium | color, contrast |
| W2-16 | Add 2–3% grain over gradients | web:gradient-design | low | color, craft |
| W2-17 | Optically size round icons 5–8% larger than square ones | web:icon-design-rules | low | icons, craft |
| W2-18 | Align icons to a 24px pixel grid (16px when dense) in a uniform container | web:icon-design-rules | medium | icons, alignment, craft |
| W2-19 | Keep one 2px stroke weight across the icon set | web:icon-design-rules | medium | icons, craft |
| W2-20 | Commit to fill or outline for the whole icon set | web:icon-design-rules | low | icons, craft |
| W2-21 | Design all six field states explicitly | web:form-field-states | high | forms, states |
| W2-22 | Keep the label outside the field, not as a placeholder | web:form-field-states | high | forms, accessibility, copy |
| W2-23 | Make focus rings at least 3:1 contrast | web:form-field-states | high | forms, accessibility, contrast |
| W2-24 | Signal errors with color, icon, and message together | web:form-field-states | high | forms, accessibility, color, states |
| W2-25 | Confirm success inside the field | web:form-field-states | low | forms, states |
| W2-26 | Distinguish disabled from loading fields | web:form-field-states | medium | forms, states |
| W2-27 | Validate on blur, then revalidate live after an error | web:form-validation-timing | high | forms, interaction-cost |
| W2-28 | Show positive confirmation for valid fields | web:form-validation-timing | low | forms, states |
| W2-29 | Group long numbers into fixed chunks | web:input-masking | medium | forms, interaction-cost |
| W2-30 | Keep the caret in place when auto-inserting separators | web:input-masking | medium | forms, interaction-cost |
| W2-31 | Clean pasted input and store raw values | web:input-masking | medium | forms, interaction-cost |
| W2-32 | Treat paste as the primary OTP path | web:otp-input | high | forms, interaction-cost, mobile |
| W2-33 | Auto-advance and backspace-retreat between OTP boxes | web:otp-input | medium | forms, interaction-cost |
| W2-34 | Model the OTP as one string with mobile autofill attributes | web:otp-input | medium | forms, mobile |
| W2-35 | Throttle OTP resend and give instant verify feedback | web:otp-input | medium | forms, states, motion |
| W2-36 | Signal editability on hover and keep layout unchanged on edit | web:inline-editing | medium | interaction-cost, craft, forms |
| W2-37 | Define consistent commit/cancel rules for inline edits | web:inline-editing | medium | forms, interaction-cost |
| W2-38 | Save inline edits optimistically with rollback and match mode to typo cost | web:inline-editing | low | forms, states, interaction-cost |
| W2-39 | Give dropzones immediate drag-over feedback | web:file-upload-ux | medium | forms, states, interaction-cost |
| W2-40 | Show real upload progress with percent and time remaining | web:file-upload-ux | medium | states, interaction-cost |
| W2-41 | Provide inline retry for failed uploads, per file | web:file-upload-ux | medium | states, interaction-cost |
| W2-42 | Show a thumbnail, type, and size as upload confirmation | web:file-upload-ux | low | imagery, states |
| W2-43 | Give filter chips distinct idle, active, and disabled states | web:filter-chips | high | states, buttons |
| W2-44 | Refresh the result count in the same frame as the tap | web:filter-chips | medium | states, interaction-cost |
| W2-45 | Show combination logic: OR within groups, AND across | web:filter-chips | low | layout, interaction-cost |
| W2-46 | Scroll chips in one row with an edge fade; pin active filters | web:filter-chips | medium | layout, mobile, navigation |
| W2-47 | Never remove the focus outline without a replacement | web:focus-states | high | accessibility, states |
| W2-48 | Make focus rings 2px thick with a 2px offset and strong contrast | web:focus-states | medium | accessibility, contrast, dark-mode |
| W2-49 | Use :focus-visible instead of :focus | web:focus-states | medium | accessibility, states |
| W2-50 | Keep DOM order synced with visual order | web:focus-states | medium | accessibility, layout |
| W2-51 | Trap focus in modals and restore it on close | web:focus-states | high | accessibility, interaction-cost |
| W2-52 | Make a skip link the first thing keyboard users reach | web:focus-states | medium | accessibility, navigation |
| W2-53 | Add an illustration or icon to empty states | web:empty-states | medium | states, imagery |
| W2-54 | Give every empty state one primary CTA toward the next step | web:empty-states | medium | states, buttons, copy |
| W2-55 | Tailor empty-state copy to the four kinds | web:empty-states | medium | copy, states |
| W2-56 | Preview what real items will look like in first-run empties | web:empty-states | low | states, imagery, craft |
| W2-57 | Match the error surface to its severity | web:error-states | high | states, forms, interaction-cost |
| W2-58 | Give every error a way out | web:error-states | high | states, interaction-cost |
| W2-59 | Make error messages name the cause and the next step | web:error-states | medium | copy, states |
| W2-60 | Validate inline as the user types to prevent errors | web:error-states | medium | forms, states |
| W2-61 | Choose loading pattern by what you know about the wait | web:loading-states-system | medium | states, interaction-cost |
| W2-62 | Show no loading indicator under ~300ms | web:loading-states-system | low | states, motion |
| W2-63 | Update the UI optimistically for reversible actions | web:optimistic-ui | medium | states, interaction-cost |
| W2-64 | Don't use optimistic UI for payments or irreversible actions | web:optimistic-ui | high | states, interaction-cost |
| W2-65 | Map notification severity to toast, banner, modal, or badge | web:notification-system | high | states, interaction-cost, hierarchy |
| W2-66 | Set persistence and stacking rules per notification surface | web:notification-system | medium | states, interaction-cost |
| W2-67 | Label buttons with the reward, not the mechanic | web:microcopy | low | copy, buttons |
| W2-68 | Write like a person, not a system | web:microcopy | low | copy |
| W2-69 | Ask "does it block the user?" before choosing an overlay | web:modal-hierarchy | medium | interaction-cost, hierarchy |
| W2-70 | Use bottom sheets, edge drawers, and small popovers for non-blocking flows | web:modal-hierarchy | low | mobile, navigation, depth |
| W2-71 | Use bottom tabs on mobile and a persistent sidebar on desktop | web:navigation-patterns | high | navigation, mobile, layout |
| W2-72 | Keep primary navigation out of the hamburger menu | web:navigation-patterns | high | navigation, interaction-cost |
| W2-73 | Use breadcrumbs only for hierarchies deeper than 2 levels | web:navigation-patterns | low | navigation, hierarchy |
| W2-74 | Structure landing pages as Hero, Proof, Problem, Solution, CTA | web:landing-page-skeleton | medium | hierarchy, layout, copy |
| W2-75 | Keep the hero to a headline, subhead, and one CTA | web:landing-page-skeleton | high | hierarchy, copy, buttons |
| W2-76 | Frame benefits as outcomes, max three | web:landing-page-skeleton | low | copy, hierarchy |
| W2-77 | Repeat the identical CTA at top and bottom | web:landing-page-skeleton | low | buttons, copy |
| W2-78 | Prefer cursor pagination when data changes often | web:pagination | medium | tables, interaction-cost |
| W2-79 | Truncate page links to first, last, current, and neighbors | web:pagination | medium | navigation, tables, layout |
| W2-80 | Persist the page in the URL and restore scroll on return | web:pagination | medium | navigation, interaction-cost |
| W2-81 | Never hide primary actions behind hover | web:hover-trap | high | mobile, interaction-cost, buttons |
| W2-82 | Wrap hover styles in @media (hover: hover) and use pointer: coarse | web:hover-trap | medium | mobile, interaction-cost |
| W2-83 | Pad touch targets to 44px while keeping icons about 20px | web:hover-trap | high | mobile, accessibility, buttons |
| W2-84 | Interpolate live cursor positions between server ticks | web:live-cursors | low | motion, craft |
| W2-85 | Hash user color from a stable ID and show presence | web:live-cursors | low | color, craft |
| W2-86 | Lock selected elements and outline them in the editor's color | web:live-cursors | low | states, interaction-cost |
| W2-87 | Offer follow mode for live design review | web:live-cursors | low | interaction-cost, navigation |
| W3-01 | Show password requirements live as the user types | web:password-field-ux | medium | forms, states, copy |
| W3-02 | Let users reveal the password and use paste or generated passwords | web:password-field-ux | high | forms, accessibility, interaction-cost |
| W3-03 | Make sliders fillable, fully draggable and keyboard operable | web:range-sliders | medium | forms, accessibility, interaction-cost |
| W3-04 | Snap sliders to steps and show the value above the thumb | web:range-sliders | low | forms, interaction-cost, states |
| W3-05 | Make star ratings preview on hover and restore on leave | web:star-rating | medium | forms, states, interaction-cost |
| W3-06 | Render fractional stars for averages and stagger the fill | web:star-rating | low | forms, motion, craft |
| W3-07 | Write a descriptive search placeholder and show recent searches | web:search-experience-system | low | forms, copy, interaction-cost |
| W3-08 | Rank autocomplete by popularity and support keyboard navigation | web:search-experience-system | high | forms, accessibility, navigation |
| W3-09 | Make empty search results a way forward | web:search-experience-system | medium | states, copy, interaction-cost |
| W3-10 | Chunk long forms into steps with visible progress | web:stepper-wizard | medium | forms, layout, interaction-cost |
| W3-11 | Validate inside each step and keep entered data | web:stepper-wizard | high | forms, states, interaction-cost |
| W3-12 | Build toggles with fixed proportions and a keyboard-accessible semantics | web:toggle-anatomy | high | forms, accessibility, craft |
| W3-13 | Animate toggle flips over ~250ms and handle async state | web:toggle-anatomy | medium | forms, motion, states |
| W3-14 | Space items inside a group more tightly than between groups | web:proximity-rule | medium | spacing, hierarchy, layout |
| W3-15 | Group nav and toolbar items by function and let whitespace do the dividing | web:proximity-rule | medium | spacing, navigation, layout, hierarchy |
| W3-16 | Stack size, color, contrast, whitespace and weight to create one focal point | web:visual-hierarchy | medium | hierarchy, typography, spacing |
| W3-17 | Reserve one accent color for the single key action | web:visual-hierarchy | high | color, hierarchy, buttons |
| W3-18 | Isolate one element against a uniform baseline | web:von-restorff | medium | hierarchy, cards, buttons |
| W3-19 | Limit emphasis to one element and never rely on color alone | web:von-restorff | medium | hierarchy, accessibility, color |
| W3-20 | Put the most important items at the start and end of a sequence | web:serial-position | low | hierarchy, navigation, layout |
| W3-21 | Engineer a deliberate peak and a strong ending in flows | web:peak-end-rule | medium | states, copy, craft |
| W3-22 | Audit the last interaction of every flow for friction | web:peak-end-rule | medium | states, interaction-cost |
| W3-23 | Use an open loop only for outcomes users want | web:zeigarnik-effect | low | states, interaction-cost, copy |
| W3-24 | Give cards generous padding, radius and a clear type hierarchy | web:perfect-card | medium | cards, spacing, typography, hierarchy |
| W3-25 | Layer a tight and a soft shadow plus a ~12% hairline border on cards | web:perfect-card | medium | cards, shadows, depth, borders, dark-mode |
| W3-26 | Give clickable cards a hover lift | web:perfect-card | low | cards, motion, states |
| W3-27 | Build elevation from three layered shadows and use it as hierarchy | web:shadow-elevation | medium | shadows, depth, hierarchy |
| W3-28 | Use a brand-tinted glow and optional 3D tilt for premium elevation | web:shadow-elevation | low | shadows, color, depth, craft |
| W3-29 | Build depth from background values and a hairline, not shadows | web:reverse-engineered-linear | medium | depth, borders, dark-mode, color |
| W3-30 | Make dense UIs compact with one accent and grey status icons | web:reverse-engineered-linear | medium | tables, color, typography, spacing |
| W3-31 | Align labels left and numbers right on a 4px grid | web:reverse-engineered-linear | low | alignment, tables, spacing |
| W3-32 | Fix z-index with position and stacking contexts, not bigger numbers | web:z-index-mastery | medium | layout, craft |
| W3-33 | Contain component layers with isolation: isolate | web:z-index-mastery | low | layout, craft |
| W3-34 | Delay hover tooltips ~300ms and anchor them with an arrow | web:tooltip-design | low | interaction-cost, craft, states |
| W3-35 | Flip tooltips near edges and allow every dismissal route | web:tooltip-design | medium | accessibility, interaction-cost |
| W3-36 | Keep tooltip copy to one short sentence | web:tooltip-design | low | copy, craft |
| W3-37 | Position toasts away from the content center | web:toast-notifications | medium | layout, mobile, states |
| W3-38 | Match toast dismiss timing to severity and cap the stack at three | web:toast-notifications | medium | states, interaction-cost, accessibility |
| W3-39 | Give toasts an exit, hover-pause and non-color cues | web:toast-notifications | medium | accessibility, color, states, icons |
| W3-40 | Prefer undo with a visible countdown over "Are you sure?" dialogs | web:undo-ux | medium | interaction-cost, states, copy |
| W3-41 | Soft-delete with a recovery window and reserve heavy friction for irreversible actions | web:undo-ux | medium | states, interaction-cost |
| W3-42 | Quarantine destructive settings and match apply model to stakes | web:settings-system | high | states, interaction-cost, forms |
| W3-43 | Organize settings by task, searchable, with reset per changed value | web:settings-system | medium | navigation, forms, layout |
| W3-44 | Give swipe actions discoverability, friction and a visible fallback | web:swipe-actions | medium | mobile, accessibility, interaction-cost |
| W3-45 | Color-code swipe actions by consequence and cap actions per side | web:swipe-actions | low | mobile, color, interaction-cost |
| W3-46 | Slide the tab indicator and fade content instead of cutting | web:tabs-system | low | navigation, motion, craft |
| W3-47 | Scroll overflowing tabs and make them keyboard operable | web:tabs-system | medium | navigation, accessibility, layout |
| W3-48 | Keep the focus ring and active tab in different colors | web:tabs-system | medium | accessibility, color, navigation |
| W3-49 | Adapt tabs to mobile with segmented controls or a sheet | web:tabs-system | low | mobile, navigation |
| W3-50 | Use skeletons that mirror the final layout and shimmer | web:skeleton-loading | medium | states, motion, layout |
| W3-51 | Apply skeletons only where they help and render user actions optimistically | web:skeleton-loading | low | states, motion, interaction-cost |
| W3-52 | Drive scroll effects with CSS scroll and view timelines | web:scroll-driven-animations | low | motion, craft |
| W3-53 | Combine sticky positioning with scroll timelines | web:scroll-driven-animations | low | motion, navigation, craft |
| W4-01 | Size the skeleton from the measured loaded UI | web:skeleton-measure | medium | states, layout, craft |
| W4-02 | Prove the skeleton-to-content swap causes no layout shift | web:skeleton-measure | medium | states, layout, mobile |
| W5-01 | Report AI-look tells as a cluster, never one by one | web:design-slop-score | low | craft, hierarchy |
| W5-02 | Check whether the look was chosen for this product | web:ai-design-slop-review | low | craft, typography, color |
| W5-03 | Keep motion for user actions, not a fade-up on every section | web:frontend-design-skill | low | motion, craft |
| W5-04 | Never hide content behind a scroll-triggered entrance | web:ai-design-slop-review | high | motion, states, accessibility |
| W5-05 | Don't single out one styled word in a headline | web:frontend-design-skill | low | typography, hierarchy, copy |
| W5-06 | Use eyebrows, labels and numbers only when they carry information | web:frontend-design-skill | low | typography, hierarchy, craft |
| W5-07 | Strip template chrome from links, meta lines and labels | web:frontend-design-skill | low | copy, typography, craft |
| W5-08 | Don't mark cards with a coloured edge stripe | web:design-slop-score | low | cards, borders, color |
| W5-09 | Don't nest cards or box single lines to fake hierarchy | web:vercel-design-md | medium | cards, hierarchy, borders |
| W5-10 | Use icons that inform, not emoji bullets or stock icon tiles | web:slop-taxonomy | low | icons, imagery, cards |
| W5-11 | Write copy that could only belong to this product | web:slop-taxonomy | medium | copy |
| W5-12 | Don't ship a default palette cluster as the brand | web:frontend-design-skill | low | color, craft |
| W5-13 | Test layouts with real content, not demo-sized content | web:ai-design-slop-review | medium | states, layout |
| W5-14 | Show a metric row only when it is the clearest form | web:vercel-design-md | low | copy, hierarchy, craft |
