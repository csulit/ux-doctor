---
name: ux-web-patterns
description: "Extended web-pattern reference, lookup only (paraphrased tips from public UX pattern pages, W-IDs): motion timing and easing, tables, charts, date and colour pickers, sliders, tabs, tooltips, toasts, context menus, command palettes, drag and drop, file upload, autosave, settings, pagination, filter chips. Use when a component needs guidance the seven dimension skills don't cover; not loaded by audit passes."
---

# UX web patterns (extended, lookup only)

Paraphrased tips from public UX pattern pages, cited `web:<slug>` with no page and labelled `source: web`. The web rules that matter in most audits (states, focus, touch, response time, AI-look tells) already live in the seven dimension skills; this skill holds the rest. Audit passes don't load it. Look a rule up when a component in front of you has no dimension-skill rule:

```
node ../ux-doctor/scripts/rule.mjs <ID | tag | keyword>      e.g. rule.mjs date picker · rule.mjs W1-73
```

A finding citing an extended rule names the dimension it is scored in (`"dimension"` in the finding JSON). When an extended rule and a playbook rule disagree, the playbook wins; rules that yield say so in their `scope`.

## Topics (pattern slug → rule IDs)
- **Motion**: animation-timing (W1-01, W1-02, W1-04, W1-05), easing-curves (W2-02, W2-04), depth-layers (W1-20, W1-21), card-hover-anatomy (W1-76, W1-78, W1-79), drag-and-drop (W1-88..W1-90)
- **Inputs**: date-pickers (W1-46..W1-49), color-picker-ux (W1-50..W1-52), range-sliders (W3-03, W3-04), star-rating (W3-05, W3-06), input-masking (W2-29..W2-31), otp-input (W2-33..W2-35), inline-editing (W2-36..W2-38), file-upload-ux (W2-39..W2-42), filter-chips (W2-43..W2-46), toggle-anatomy (W3-12, W3-13), search-experience-system (W3-07..W3-09), stepper-wizard (W3-10), form-field-states (W2-26), form-validation-timing (W2-28), error-states (W2-60), css-has-selector (W1-40)
- **Saving and feedback**: autosave-ux (W1-32, W1-33, W1-35, W1-36), loading-states-system (W2-61), toast-notifications (W3-37..W3-39), empty-states (W2-55, W2-56), microcopy (W2-67, W2-68)
- **Overlays and menus**: dropdown-design (W1-08, W1-59, W1-60), context-menu (W1-55..W1-58), command-palette (W1-62..W1-64), tooltip-design (W3-34..W3-36), modal-hierarchy (W2-69, W2-70), bottom-sheets (W1-54), accordion-disclosure (W1-07, W1-86, W1-87)
- **Navigation**: tabs-system (W3-46..W3-49), pagination (W2-79, W2-80), navigation-patterns (W2-73), swipe-actions (W3-44, W3-45), settings-system (W3-42, W3-43)
- **Data**: data-table (W1-71, W1-73..W1-75), bulk-actions (W1-42..W1-44), charts-that-lie (W1-65..W1-70)
- **System and surfaces**: design-system-kit (W1-23, W1-26, W1-27), design-tokens (W1-28, W1-31), border-radius (W1-09, W1-11), icon-design-rules (W2-17, W2-18), gradient-design (W2-14..W2-16), dark-mode (W1-17), perfect-card (W3-24, W3-25), shadow-elevation (W3-27, W3-28), reverse-engineered-linear (W3-29, W3-30), grid-system (W2-11, W2-13)
- **Composition**: landing-page-skeleton (W2-74, W2-76, W2-77), clean-ui-tips (W4-03..W4-05), gestalt-laws (W2-05, W2-06), proximity-rule (W3-15), visual-hierarchy (W3-16), von-restorff (W3-19)
