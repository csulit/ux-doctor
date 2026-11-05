---
name: ux-build
description: "Lightweight design guidance for writing or changing UI when no audit or review was asked for: use the project's tokens, fall back to one default per property, and follow the Critical 20. Use whenever you build a page, component, form, dialog or theme, or are asked to \"make it look good\" while implementing a feature."
---

# Build UI the ux-doctor way

No scoring, no report: just build it right the first time.

1. **Project first.** Read the target's `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/*` and `DESIGN.md`, and find its tokens (`tailwind.config.*`, `:root { --* }`, `theme.*`, `tokens.*`) and shared components. Reuse them; never add a font, colour or dependency the project didn't choose without asking.
2. **Fill the gaps from the defaults.** Where the project has no value, take the target from `../ux-doctor/references/defaults.md` (one value per property: type, spacing, radius, shadows, colours, touch targets, focus, timing). Never go below a hard floor.
3. **Follow the Build column of the Critical 20** (`../ux-doctor/references/critical.md`). These are the checks reviews fail most.
4. **Component specifics** come from the dimension skill that owns them (forms and dialogs: `ux-ui-patterns`; buttons and emphasis: `ux-hierarchy-clarity`; spacing and cards: `ux-layout-spacing`). Look a rule up with `node ../ux-doctor/scripts/rule.mjs <ID|keyword>` instead of loading whole skills.
5. **Measure what you can.** Run `node ../ux-doctor/scripts/contrast.mjs <fg> <bg>` for every new text/background pair, in both themes.

Build every state, not only the happy path: loading, empty, error, disabled, focus and hover (touch devices have no hover). Before handing off, say which values came from the project, which from the defaults, and anything you could not measure.
