# Extended web-pattern reference (lookup only): motion, components, data, overlays, navigation (paraphrased) — rule index

| ID | Rule | Page/Src (p.N = playbook PDF page; web:slug = web rule, no page) | Kind | Severity | Tags |
|---|---|---|---|---|---|
| W1-01 | Run entrances at 200–300ms with ease-out | web:animation-timing | check | medium | motion |
| W1-02 | Make exits faster than entrances | web:animation-timing | check | low | motion |
| W1-04 | Stagger list items about 50ms apart | web:animation-timing | default | low | motion |
| W1-05 | Reserve long bouncy motion for attention moments | web:animation-timing | check | low | motion |
| W1-07 | Sync the chevron with the panel animation | web:accordion-disclosure | check | low | motion, icons |
| W1-08 | Open dropdown menus in about 150ms | web:dropdown-design | check | low | motion |
| W1-09 | Build nested radii as outer minus padding | web:border-radius | check | low | borders, spacing |
| W1-11 | Grow radius with surface size and fit brand tone | web:border-radius | check | low | borders, hierarchy |
| W1-17 | Desaturate accents ~20% in dark mode | web:dark-mode | check | low | dark-mode, color |
| W1-20 | Add subtle hover lift with border emphasis | web:depth-layers | check | low | depth, shadows |
| W1-21 | Vary parallax speed per layer, subtly | web:depth-layers | check | low | depth, motion |
| W1-23 | Use a numbered color scale mapped to semantic names | web:design-system-kit | check | low | color |
| W1-26 | Describe every component by variant, size and state | web:design-system-kit | check | medium | buttons, forms |
| W1-27 | Map easing and duration to intent | web:design-system-kit | default | low | motion |
| W1-28 | Name tokens by role, not value | web:design-tokens | check | low | color |
| W1-31 | Implement dark mode as a token set swap | web:design-tokens | check | medium | dark-mode, color |
| W1-32 | Debounce autosave around 800ms | web:autosave-ux | check | medium | forms, interaction-cost |
| W1-33 | Model the save indicator as explicit states | web:autosave-ux | check | medium | states, forms |
| W1-35 | Never silently overwrite concurrent edits | web:autosave-ux | check | medium | states, forms |
| W1-36 | Guard unsaved work on exit | web:autosave-ux | check | medium | forms, states |
| W1-40 | Prefer :user-invalid over :invalid | web:css-has-selector | check | low | forms, states |
| W1-42 | Offer a three-state select-all checkbox | web:bulk-actions | check | medium | tables, forms |
| W1-43 | Name the exact count in bulk selection | web:bulk-actions | check | medium | tables, copy |
| W1-44 | Keep selection in app state with shift-click range | web:bulk-actions | check | low | tables, interaction-cost |
| W1-46 | Offer date presets before custom ranges | web:date-pickers | check | medium | forms, interaction-cost |
| W1-47 | Make range selection legible and show two months | web:date-pickers | check | low | forms, interaction-cost |
| W1-48 | Fully support keyboard in date pickers | web:date-pickers | check | medium | accessibility, forms |
| W1-49 | Use a full-screen sheet for mobile date picking | web:date-pickers | check | medium | mobile, forms |
| W1-50 | Show live contrast in color pickers | web:color-picker-ux | check | low | color, contrast |
| W1-51 | Give pickers OKLCH, memory and alpha previews | web:color-picker-ux | check | low | color, forms |
| W1-52 | Generate tokens from one picked hue | web:color-picker-ux | check | low | color |
| W1-54 | Give sheets snap points, drag-to-dismiss, and scrim with scroll lock | web:bottom-sheets | check | medium | mobile, states |
| W1-55 | Keep context menus inside the viewport | web:context-menu | check | medium | layout, interaction-cost |
| W1-56 | Group menu actions and isolate Delete in red | web:context-menu | check | medium | hierarchy, states |
| W1-57 | Add a safe triangle for submenus | web:context-menu | check | low | interaction-cost |
| W1-58 | Give context menus keyboard control and mobile long-press | web:context-menu | check | medium | accessibility, mobile |
| W1-59 | Give dropdown triggers a 48px target with a caret | web:dropdown-design | check | medium | forms, mobile |
| W1-60 | Flip dropdowns upward and add search past ~10 items | web:dropdown-design | check | medium | forms, interaction-cost |
| W1-62 | Make command palettes fuzzy and grouped | web:command-palette | check | medium | navigation, interaction-cost |
| W1-63 | Prefill palette and keep it fully keyboard-driven | web:command-palette | check | medium | navigation, states |
| W1-64 | Load async commands inline with nested drill-down | web:command-palette | check | low | navigation, states |
| W1-65 | Start bar chart y-axes at zero | web:charts-that-lie | check | high | hierarchy |
| W1-66 | Pick the chart form from the question | web:charts-that-lie | principle | medium | hierarchy |
| W1-67 | Balance chart aspect ratio near 45° slope | web:charts-that-lie | check | low | layout |
| W1-68 | Maximize data-ink and label directly | web:charts-that-lie | check | low | color |
| W1-69 | Use color as encoding with one hero series | web:charts-that-lie | check | low | color, hierarchy |
| W1-70 | Title charts with the takeaway | web:charts-that-lie | check | low | copy, hierarchy |
| W1-71 | Use tri-state sorting on tables | web:data-table | check | low | tables, interaction-cost |
| W1-73 | Freeze header and first column | web:data-table | check | medium | tables, layout |
| W1-74 | Control row density through a single token | web:data-table | check | low | tables, spacing |
| W1-75 | Make the entire table row the selection target | web:data-table | check | low | tables, states |
| W1-76 | Lift cards ~8px over ~200ms on hover | web:card-hover-anatomy | check | low | cards, shadows |
| W1-78 | Reveal card actions staggered at the bottom | web:card-hover-anatomy | check | low | cards, motion |
| W1-79 | Signal card interactivity with an edge accent | web:card-hover-anatomy | check | low | cards, states |
| W1-86 | Choose single- vs multi-open by content | web:accordion-disclosure | check | low | interaction-cost, navigation |
| W1-87 | Anchor the tapped header when lower items expand | web:accordion-disclosure | check | low | interaction-cost, motion |
| W1-88 | Show drag pickup through scale, shadow and tilt | web:drag-and-drop | check | low | depth, shadows |
| W1-89 | Reveal drop targets during the drag | web:drag-and-drop | check | medium | states, interaction-cost |
| W1-90 | Offer a ~5s undo after drops | web:drag-and-drop | check | low | interaction-cost, states |
| W2-02 | Add a restrained spring overshoot to presses and modals | web:easing-curves | default | low | motion |
| W2-04 | Reuse one small set of easing curves everywhere | web:easing-curves | default | low | motion |
| W2-05 | Group related items with shared visual properties | web:gestalt-laws | check | medium | hierarchy, alignment |
| W2-06 | Wrap distant related elements in a shared container | web:gestalt-laws | check | low | cards, borders |
| W2-11 | Choose gutter width to match the intended mood | web:grid-system | check | low | spacing, layout |
| W2-13 | Establish the grid before breaking it on purpose | web:grid-system | principle | low | layout, alignment |
| W2-14 | Keep gradients within about 60° of hue | web:gradient-design | check | low | color |
| W2-15 | Use gradients as ambient glow, not as full surfaces behind text | web:gradient-design | check | medium | color, contrast |
| W2-16 | Add 2–3% grain over gradients | web:gradient-design | check | low | color |
| W2-17 | Optically size round icons 5–8% larger than square ones | web:icon-design-rules | check | low | icons |
| W2-18 | Align icons to a 24px pixel grid (16px when dense) in a uniform container | web:icon-design-rules | check | medium | icons, alignment |
| W2-26 | Distinguish disabled from loading fields | web:form-field-states | check | medium | forms, states |
| W2-28 | Show positive confirmation for valid fields | web:form-validation-timing | check | low | forms, states |
| W2-29 | Group long numbers into fixed chunks | web:input-masking | check | medium | forms, interaction-cost |
| W2-30 | Keep the caret in place when auto-inserting separators | web:input-masking | check | medium | forms, interaction-cost |
| W2-31 | Clean pasted input and store raw values | web:input-masking | check | medium | forms, interaction-cost |
| W2-33 | Auto-advance and backspace-retreat between OTP boxes | web:otp-input | check | medium | forms, interaction-cost |
| W2-34 | Model the OTP as one string with mobile autofill attributes | web:otp-input | check | medium | forms, mobile |
| W2-35 | Throttle OTP resend and give instant verify feedback | web:otp-input | check | medium | forms, states |
| W2-36 | Signal editability on hover and keep layout unchanged on edit | web:inline-editing | check | medium | interaction-cost, forms |
| W2-37 | Define consistent commit/cancel rules for inline edits | web:inline-editing | check | medium | forms, interaction-cost |
| W2-38 | Save inline edits optimistically with rollback and match mode to typo cost | web:inline-editing | check | low | forms, states |
| W2-39 | Give dropzones immediate drag-over feedback | web:file-upload-ux | check | medium | forms, states |
| W2-40 | Show real upload progress with percent and time remaining | web:file-upload-ux | check | medium | states, interaction-cost |
| W2-41 | Provide inline retry for failed uploads, per file | web:file-upload-ux | check | medium | states, interaction-cost |
| W2-42 | Show a thumbnail, type, and size as upload confirmation | web:file-upload-ux | check | low | imagery, states |
| W2-43 | Give filter chips distinct idle, active, and disabled states | web:filter-chips | check | medium | states, buttons |
| W2-44 | Refresh the result count in the same frame as the tap | web:filter-chips | check | medium | states, interaction-cost |
| W2-45 | Show combination logic: OR within groups, AND across | web:filter-chips | check | low | layout, interaction-cost |
| W2-46 | Scroll chips in one row with an edge fade; pin active filters | web:filter-chips | check | medium | layout, mobile |
| W2-49 | Use :focus-visible instead of :focus | web:focus-states | check | medium | accessibility, states |
| W2-50 | Keep DOM order synced with visual order | web:focus-states | check | medium | accessibility, layout |
| W2-52 | Make a skip link the first thing keyboard users reach | web:focus-states | check | medium | accessibility, navigation |
| W2-55 | Tailor empty-state copy to the four kinds | web:empty-states | check | medium | copy, states |
| W2-56 | Preview what real items will look like in first-run empties | web:empty-states | check | low | states, imagery |
| W2-60 | Validate inline as the user types to prevent errors | web:error-states | check | medium | forms, states |
| W2-61 | Choose loading pattern by what you know about the wait | web:loading-states-system | check | medium | states, interaction-cost |
| W2-67 | Label buttons with the reward, not the mechanic | web:microcopy | check | low | copy, buttons |
| W2-68 | Write like a person, not a system | web:microcopy | check | low | copy |
| W2-69 | Ask "does it block the user?" before choosing an overlay | web:modal-hierarchy | check | medium | interaction-cost, hierarchy |
| W2-70 | Use bottom sheets, edge drawers, and small popovers for non-blocking flows | web:modal-hierarchy | check | low | mobile, navigation |
| W2-73 | Use breadcrumbs only for hierarchies deeper than 2 levels | web:navigation-patterns | check | low | navigation, hierarchy |
| W2-74 | Structure landing pages as Hero, Proof, Problem, Solution, CTA | web:landing-page-skeleton | default | medium | hierarchy, layout |
| W2-76 | Frame benefits as outcomes, max three | web:landing-page-skeleton | check | low | copy, hierarchy |
| W2-77 | Repeat the identical CTA at top and bottom | web:landing-page-skeleton | check | low | buttons, copy |
| W2-79 | Truncate page links to first, last, current, and neighbors | web:pagination | check | medium | navigation, tables |
| W2-80 | Persist the page in the URL and restore scroll on return | web:pagination | check | medium | navigation, interaction-cost |
| W3-03 | Make sliders fillable, fully draggable and keyboard operable | web:range-sliders | check | medium | forms, accessibility |
| W3-04 | Snap sliders to steps and show the value above the thumb | web:range-sliders | check | low | forms, interaction-cost |
| W3-05 | Make star ratings preview on hover and restore on leave | web:star-rating | check | medium | forms, states |
| W3-06 | Render fractional stars for averages and stagger the fill | web:star-rating | check | low | forms, motion |
| W3-07 | Write a descriptive search placeholder and show recent searches | web:search-experience-system | check | low | forms, copy |
| W3-08 | Rank autocomplete by popularity and support keyboard navigation | web:search-experience-system | check | medium | forms, accessibility |
| W3-09 | Make empty search results a way forward | web:search-experience-system | check | medium | states, copy |
| W3-10 | Chunk long forms into steps with visible progress | web:stepper-wizard | check | medium | forms, layout |
| W3-12 | Build toggles with fixed proportions and a keyboard-accessible semantics | web:toggle-anatomy | check | medium | forms, accessibility |
| W3-13 | Animate toggle flips over ~250ms and handle async state | web:toggle-anatomy | check | medium | forms, motion |
| W3-15 | Group nav and toolbar items by function and let whitespace do the dividing | web:proximity-rule | check | medium | spacing, navigation |
| W3-16 | Stack size, color, contrast, whitespace and weight to create one focal point | web:visual-hierarchy | check | medium | hierarchy, typography |
| W3-19 | Limit emphasis to one element and never rely on color alone | web:von-restorff | check | medium | hierarchy, accessibility |
| W3-24 | Give cards generous padding, radius and a clear type hierarchy | web:perfect-card | check | medium | cards, spacing |
| W3-25 | Layer a tight and a soft shadow plus a ~12% hairline border on cards | web:perfect-card | check | medium | cards, shadows |
| W3-27 | Build elevation from three layered shadows and use it as hierarchy | web:shadow-elevation | check | medium | shadows, depth |
| W3-28 | Use a brand-tinted glow and optional 3D tilt for premium elevation | web:shadow-elevation | check | low | shadows, color |
| W3-29 | Build depth from background values and a hairline, not shadows | web:reverse-engineered-linear | check | medium | depth, borders |
| W3-30 | Make dense UIs compact with one accent and grey status icons | web:reverse-engineered-linear | check | medium | tables, color |
| W3-34 | Delay hover tooltips ~300ms and anchor them with an arrow | web:tooltip-design | check | low | interaction-cost, states |
| W3-35 | Flip tooltips near edges and allow every dismissal route | web:tooltip-design | check | medium | accessibility, interaction-cost |
| W3-36 | Keep tooltip copy to one short sentence | web:tooltip-design | check | low | copy |
| W3-37 | Position toasts away from the content center | web:toast-notifications | check | medium | layout, mobile |
| W3-38 | Match toast dismiss timing to severity and cap the stack at three | web:toast-notifications | check | medium | states, interaction-cost |
| W3-39 | Give toasts an exit, hover-pause and non-color cues | web:toast-notifications | check | medium | accessibility, color |
| W3-42 | Quarantine destructive settings and match apply model to stakes | web:settings-system | check | medium | states, interaction-cost |
| W3-43 | Organize settings by task, searchable, with reset per changed value | web:settings-system | check | medium | navigation, forms |
| W3-44 | Give swipe actions discoverability, friction and a visible fallback | web:swipe-actions | check | medium | mobile, accessibility |
| W3-45 | Color-code swipe actions by consequence and cap actions per side | web:swipe-actions | check | low | mobile, color |
| W3-46 | Slide the tab indicator and fade content instead of cutting | web:tabs-system | check | low | navigation, motion |
| W3-47 | Scroll overflowing tabs and make them keyboard operable | web:tabs-system | check | medium | navigation, accessibility |
| W3-48 | Keep the focus ring and active tab in different colors | web:tabs-system | check | medium | accessibility, color |
| W3-49 | Adapt tabs to mobile with segmented controls or a sheet | web:tabs-system | check | low | mobile, navigation |
| W4-03 | Balance colour by area with the 60-30-10 split: dominant, secondary, accent | web:clean-ui-tips | check | low | color, hierarchy |
| W4-04 | Ask one question per step in questionnaires and onboarding | web:clean-ui-tips | check | medium | forms, interaction-cost |
| W4-05 | Move text repeated on every item into the group heading | web:clean-ui-tips | check | low | copy, hierarchy |
