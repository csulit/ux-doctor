# Component patterns: forms, passwords, dialogs, product pages, mobile, states, navigation — rule index

| ID | Rule | Page/Src (p.N = playbook PDF page; web:slug = web rule, no page) | Kind | Severity | Tags |
|---|---|---|---|---|---|
| G-02 | Don't hide content behind promotional banners that need a tap | p.111, p.112, reaffirmed p.113 | check | medium | interaction-cost, layout |
| G-05 | Use separate large digit boxes for verification codes | p.114, p.115 | check | medium | forms, typography |
| G-06 | Match field length to expected data (short fields for CVC, expiry, zip) and pair them on a row | p.115, p.116, reaffirmed p.114 | check | medium | forms, layout |
| G-07 | Don't use a "Confirm password" field | p.117, p.118 | check | medium | forms, interaction-cost |
| G-08 | Add a show/hide toggle to password fields | p.118 | check | medium | forms, icons |
| G-09 | Use inline, real-time password validation | p.119 | check | medium | forms, states |
| G-10 | Make the destructive confirm button red (not green) | p.120 | check | high | color, buttons |
| G-11 | Give users a way back: always include a Cancel option | p.121 | check | high | buttons, states |
| G-12 | Place Cancel on the left and the destructive action on the right | p.122 | check | medium | buttons, layout |
| G-14 | Divide content into logical sections with icons (checkmarks, stars) | p.124 | check | medium | icons, hierarchy |
| G-15 | Lay features out in two columns | p.125 | default | low | layout, cards |
| G-16 | Go beyond the given content: add extra content types (colour-coded icons, comparison visual) | p.126 | principle | low | icons, hierarchy |
| H-01 | Look beyond the brief for extra persuasive content | p.127 | principle | low | copy, hierarchy |
| H-02 | Be creative but keep every element relevant | p.127 | principle | medium | hierarchy, copy |
| H-03 | Remove unrelated ads and promos from task flows | p.128 | check | medium | interaction-cost, hierarchy |
| H-04 | Use action-free imagery beside forms | p.129 | check | medium | imagery, forms |
| H-09 | Place primary actions in the thumb zone | p.134, reaffirmed p.135-136 | check | medium | mobile, interaction-cost |
| H-12 | Don't leave empty states bare: build them from illustration, benefit headline, tips and a CTA | p.136-137 | check | medium | states, imagery |
| H-13 | Error states must explain, offer a fix and match the app's style | p.138 | check | high | states, copy |
| H-14 | Offer helpful links or suggestions on 404 pages | p.139 | check | medium | states, navigation |
| H-15 | Express brand personality in error pages | p.140 | default | low | states, imagery |
| H-16 | Add icons to navigation dropdown items | p.141 | default | low | navigation, icons |
| H-17 | Group related dropdown items under category headings | p.141-142 | check | medium | navigation, hierarchy |
| H-18 | Use images in dropdowns sparingly, only for highlighted items | p.142 | check | low | navigation, imagery |
| W1-61 | Wire dropdown keyboard support | web:dropdown-design | check | high | accessibility, forms |
| W1-85 | Make the accordion header a real button with ARIA | web:accordion-disclosure | check | high | accessibility, interaction-cost |
| W1-91 | Use named buttons for destructive confirmations | web:destructive-actions | check | medium | copy, buttons |
| W1-92 | Reserve red for destruction and move delete off the confirm spot | web:destructive-actions | check | medium | color, buttons |
| W1-94 | Don't use disabled buttons to block submit | web:disabled-buttons | check | medium | buttons, accessibility |
| W1-95 | Distinguish loading from disabled | web:disabled-buttons | check | medium | buttons, states |
| W2-21 | Design all six field states explicitly | web:form-field-states | check | medium | forms, states |
| W2-22 | Keep the label outside the field, not as a placeholder | web:form-field-states | check | high | forms, accessibility |
| W2-23 | Make focus rings at least 3:1 contrast | web:form-field-states | check | high | forms, accessibility |
| W2-27 | Validate on blur, then revalidate live after an error | web:form-validation-timing | check | medium | forms, interaction-cost |
| W2-32 | Treat paste as the primary OTP path | web:otp-input | check | medium | forms, interaction-cost |
| W2-47 | Never remove the focus outline without a replacement | web:focus-states | check | high | accessibility, states |
| W2-51 | Trap focus in modals and restore it on close | web:focus-states | check | high | accessibility, interaction-cost |
| W2-65 | Map notification severity to toast, banner, modal, or badge | web:notification-system | check | medium | states, interaction-cost |
| W3-11 | Validate inside each step and keep entered data | web:stepper-wizard | check | medium | forms, states |
| W3-40 | Prefer undo with a visible countdown over "Are you sure?" dialogs | web:undo-ux | check | medium | interaction-cost, states |
| W3-41 | Soft-delete with a recovery window and reserve heavy friction for irreversible actions | web:undo-ux | check | medium | states, interaction-cost |
| W3-50 | Use skeletons that mirror the final layout and shimmer | web:skeleton-loading | check | medium | states, motion |
| W4-02 | Prove the skeleton-to-content swap causes no layout shift | web:skeleton-measure | check | medium | states, layout |
