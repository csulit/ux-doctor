# Web patterns W5
> Source: paraphrased from public writing on the generic look of AI-generated interfaces, added by the maintainer. Not part of the PDF playbook. Slugs: `frontend-design-skill` (Anthropic, github.com/anthropics/skills, skills/frontend-design/SKILL.md), `vercel-design-md` (vercel.com/design.md, "Reject generated-design reflexes"), `design-slop-score` (Adrian Krebs, adriankrebs.ch/blog/design-slop/), `ai-design-slop-review` (Ralabs, ralabs.org/blog/ai-design-slop-how-to-review-ai-generated-interfaces/), `slop-taxonomy` (Ad Astra Computing, github.com/Ad-Astra-Computing/ahd, docs/SLOP_TAXONOMY.md). These rules flag unchosen defaults, not AI authorship: a tell the brief or the project's tokens chose on purpose is not a finding. The hero tells are W1-80..W1-84 (`de-ai-landing-hero`); W5 adds the rest.
## Web patterns: AI-look tells
### W5-01 Report AI-look tells as a cluster, never one by one  (src: design-slop-score)
- **Rule**: One default pattern on its own says nothing about how a page was made; count the tells from W1-80..W1-84 and W5 together and treat a page as generic only when several of them show up at once (the source's tiers: 0–1 low, 2–3 medium, 4 or more high).
- **Why**: Automated checks for these patterns misfire on a share of pages, and plenty of hand-made sites use one or two of them for good reasons.
- **Do / Don't**: Do give one grouped "AI-look tells" line that lists the tells found. Don't raise a separate finding for each tell, and don't claim the page was AI-generated.
- **Audit check**: Run `node scripts/slop-scan.mjs <url|file|dir>` or check the tells by hand; report the count and the tier. Below 3 tells, mention them as one `(general practice)` note; at 3 or more, one grouped finding at this rule's severity. Drop any tell the brief, `DESIGN.md` or the project tokens chose explicitly (Accepted by design).
- **Restyle fix**: Fix the tells that cost clarity first (W1-80..W1-84, W5-04, W5-09), then replace the remaining defaults with one deliberate choice tied to the product (W5-02).
- **Severity**: low ; **Tags**: craft, hierarchy

### W5-02 Check whether the look was chosen for this product  (src: ai-design-slop-review)
- **Rule**: Ask whether anyone decided the type, palette and layout, rather than whether a model made them: if the same treatment would fit an unrelated product (say a booking tool, a CRM or a trading app) just as well, it is an accepted default.
- **Why**: Generic output comes from a missing brief, and its ingredients (Inter, cards, rounded corners, standard icon sets) are fine on their own; what is missing is a decision.
- **Do / Don't**: Do tie at least one visible decision (type, colour, imagery or layout) to the product's subject and audience. Don't call Inter, cards or rounded corners a defect by themselves (the playbook recommends Inter, E-17).
- **Audit check**: Put the hero and one product screen next to the product's domain and ask what in them could not belong to an unrelated product; if nothing, note it under W5-01. Inferred; needs a render or screenshot.
- **Restyle fix**: Needs a design decision: propose one product-specific choice (a real screenshot, domain imagery, a type pairing or an accent from the brand) instead of restyling everything.
- **Severity**: low ; **Tags**: craft, typography, color

### W5-03 Keep motion for user actions, not a fade-up on every section  (src: frontend-design-skill)
- **Rule**: Motion the user did not trigger should be rare and should point at something; one orchestrated load or reveal works better than a fade-and-rise entrance on each section and a hover effect on every card, which is the generated default.
- **Why**: Effects scattered across the page add noise, and decoration seen on every visit becomes friction.
- **Do / Don't**: Do animate responses to the user (open, expand, confirm) and at most one entrance moment per page. Don't attach the same scroll entrance to every section.
- **Audit check**: Count scroll-entrance hooks on section roots (`whileInView`, `data-aos`, `useInView`, `IntersectionObserver` + `opacity-0`/`translate-y-*`, `animate-*fade*`); flag 3 or more. Check that a `prefers-reduced-motion: reduce` path exists.
- **Restyle fix**: Remove the per-section entrances, keep one page-level moment if it carries meaning, and gate all non-essential motion behind `@media (prefers-reduced-motion: no-preference)`.
- **Severity**: low ; **Tags**: motion, craft

### W5-04 Never hide content behind a scroll-triggered entrance  (src: ai-design-slop-review)
- **Rule**: Content must be visible without its entrance animation: when a section starts transparent and waits for a scroll observer, a trigger that never fires leaves a blank section, which is a defect, not a matter of taste.
- **Why**: Observers miss on fast scrolls, anchor jumps, print, reduced motion, slow scripts and some crawlers, and the content then never appears.
- **Do / Don't**: Do start content visible and add the animation as an enhancement. Don't ship sections whose resting style is `opacity: 0` until a script runs.
- **Audit check**: grep for elements that start hidden (`opacity-0`, `opacity: 0`, `initial={{ opacity: 0`) and only become visible through `whileInView`, `data-aos` or an observer; render with JavaScript disabled, with `prefers-reduced-motion: reduce`, and after jumping to an anchor further down, and check every section shows its content.
- **Restyle fix**: Make the visible state the default and apply the hidden start only when script and motion are allowed (e.g. a class set by JS inside `prefers-reduced-motion: no-preference`), or use a CSS view timeline whose resting state is visible (W3-52).
- **Severity**: high ; **Tags**: motion, states, accessibility

### W5-05 Don't single out one styled word in a headline  (src: frontend-design-skill)
- **Rule**: Restyling just one word or phrase of a headline (italic serif, bold, a different colour or a gradient) is one of the commonest typographic defaults of generated pages; let the whole headline carry the emphasis.
- **Why**: The lone accented word repeats across unrelated products, so it reads as a template instead of an emphasis.
- **Do / Don't**: Do get headline emphasis from size, weight and placement. Don't wrap a single headline word in an italic serif, accent colour or gradient span by default.
- **Audit check**: Look inside `h1`/`h2` for an `<em>`, `<i>` or `<span>` with `italic`, `font-serif`, an accent `text-*` colour or `bg-clip-text` around one or two words.
- **Restyle fix**: Set the headline in one style; if a word truly needs stress, make it the subject of the sentence instead.
- **Severity**: low ; **Tags**: typography, hierarchy, copy

### W5-06 Use eyebrows, labels and numbers only when they carry information  (src: frontend-design-skill)
- **Rule**: Structural devices (eyebrow labels, dividers, numbering) should encode something about the content: a tracked all-caps label above every heading, or 01 / 02 / 03 markers on items that are not a sequence, is template chrome.
- **Why**: Labels that repeat the heading or number unordered items add reading work without adding meaning.
- **Do / Don't**: Do number real steps and timelines. Don't put an uppercase kicker above each section heading or number a list of unrelated features.
- **Audit check**: Count small `uppercase tracking-*` (or `text-transform: uppercase` + `letter-spacing`) labels directly before section headings; flag 3 or more. Check numbered markers (`01`, `02`, step circles) against whether the content is ordered.
- **Restyle fix**: Delete eyebrows that restate the heading, keep one where it names a category the heading does not, and replace false numbering with plain headings.
- **Severity**: low ; **Tags**: typography, hierarchy, craft

### W5-07 Strip template chrome from links, meta lines and labels  (src: frontend-design-skill)
- **Rule**: Small habits mark a template whatever the subject: an arrow added to every link and button label, metadata strung together with centred dots, short labels split by a spaced dash after an all-caps word, and small data labels set in a monospace font.
- **Why**: Applied everywhere, these marks stop signalling anything and make unrelated products look alike.
- **Do / Don't**: Do keep an arrow where it says "this goes somewhere else" (the one text-link secondary of W1-82). Don't append arrows to every control or build every label with dots and dashes.
- **Audit check**: Count links/buttons whose text ends in `→`/`->`/an arrow icon (flag when most do), ` · ` separators in meta lines, ` — ` inside short labels, and `font-mono` on non-code labels.
- **Restyle fix**: Keep arrows on links that leave the flow, write meta lines as plain text or separate fields, and use the body face for labels unless the content is code or tabular data.
- **Severity**: low ; **Tags**: copy, typography, craft

### W5-08 Don't mark cards with a coloured edge stripe  (src: design-slop-score)
- **Rule**: A coloured border on just the left or top edge of ordinary content cards is, according to the designers the source asked, about as reliable a generated-design tell as em dashes are for generated text.
- **Why**: The stripe adds colour without adding meaning and stands in for real hierarchy.
- **Do / Don't**: Do separate cards with spacing, type and surface. Don't put a static accent stripe on every card (a hover edge cue on clickable cards, W1-79, and a status colour on alerts are different cases).
- **Audit check**: grep cards for `border-l-[2-8]`/`border-t-[2-8]` with an accent colour, or `border-left: 3px+ solid <accent>` on rounded containers; ignore `blockquote` and status alerts whose colour encodes severity.
- **Restyle fix**: Remove the stripe; if the cards need a category signal, use a label or icon that names it (W1-14 pairs colour with a second signal).
- **Severity**: low ; **Tags**: cards, borders, color

### W5-09 Don't nest cards or box single lines to fake hierarchy  (src: vercel-design-md)
- **Rule**: Cards inside cards, and borders drawn around single lines of text, are a reflex for repairing weak hierarchy; fix the hierarchy with spacing and type instead.
- **Why**: Every extra box adds edges to read past and claims a layer the content does not have.
- **Do / Don't**: Do use one container level for a group (a shared region is fine, W2-06). Don't wrap a card in another card or put a bordered box around one line.
- **Audit check**: Look for a bordered/shadowed rounded container inside another (`rounded-* border`/`shadow-*` or `Card` inside `Card`/`CardContent`), and for bordered boxes holding a single line of text.
- **Restyle fix**: Remove the inner container's border and shadow, group its contents with spacing and a heading, and keep the outer surface.
- **Severity**: medium ; **Tags**: cards, hierarchy, borders

### W5-10 Use icons that inform, not emoji bullets or stock icon tiles  (src: slop-taxonomy)
- **Rule**: Emoji used as bullets (✨ 🚀 ⚡) and the obvious stock icon in a tinted rounded square for each feature (a bolt for speed, a shield for security, sparkles for AI) are defaults that decorate rather than explain.
- **Why**: The same icon-for-an-adjective appears on every product, so it carries no information about this one.
- **Do / Don't**: Do use icons that help scanning or name a real object or status (G-14 still applies). Don't decorate feature lists with emoji or put a generic icon tile on top of every card.
- **Audit check**: Count pictographic emoji in headings, list items and buttons; count icon tiles (a small square or circle with a tinted background holding one icon) at the top of cards in a grid; flag 3 or more.
- **Restyle fix**: Replace emoji with the project's icon set or nothing; swap generic icon tiles for product imagery (W1-84) or remove them and let the heading lead.
- **Severity**: low ; **Tags**: icons, imagery, cards

### W5-11 Write copy that could only belong to this product  (src: ai-design-slop-review)
- **Rule**: Text can look as generic as the styling around it: stock lines like "build the future of", "ship faster", "AI-native", "seamless" or "effortless" could describe any product and say nothing about this one.
- **Why**: Readers scan for what the product does for them, and stock phrases hide that answer.
- **Do / Don't**: Do name the user, the task and the result in plain words. Don't fill sections with filler adjectives and slogans (the hero headline is W1-80; button labels are W2-67).
- **Audit check**: grep visible copy for `seamless|effortless|supercharge|unleash|unlock|elevate|revolutioni[sz]e|game-?chang|cutting-edge|next-gen|empower|streamline|build the future|ship faster|AI-native|in today's`; flag 3 or more outside the hero.
- **Restyle fix**: Rewrite each flagged line as a concrete claim (who, what, with what result); delete it if no concrete claim exists.
- **Severity**: medium ; **Tags**: copy

### W5-12 Don't ship a default palette cluster as the brand  (src: frontend-design-skill)
- **Rule**: Generated pages gather around a few palettes regardless of subject: a purple-to-blue gradient, a warm cream page with a serif display and a terracotta accent, near-black with one acid-green or vermilion accent, and the UI kit's untouched default theme.
- **Why**: These are defaults rather than choices, so they make unrelated products look alike; the cluster shifts over time (the purple gradient has already given way to the cream-and-serif look).
- **Do / Don't**: Do use one of these looks when the brief explicitly requests it. Don't spend an open colour decision on one of them.
- **Audit check**: Compare the page's background, accent and display face with the clusters above and with the framework's default tokens (unchanged shadcn/ui `--primary`/`--radius`, Tailwind `indigo-500`/`violet-500`); count a match as one tell under W5-01 only if no brief or token file chose it.
- **Restyle fix**: Needs a design decision: derive the accent and neutrals from the brand or product domain, then express them as tokens.
- **Severity**: low ; **Tags**: color, craft

### W5-13 Test layouts with real content, not demo-sized content  (src: ai-design-slop-review)
- **Rule**: Generated layouts are sized for convenient content; check every view with long names (about forty characters), tables with zero, two and thousands of rows, negative and very large numbers, and missing images.
- **Why**: A screen tuned to sample data tends to break on the first real account.
- **Do / Don't**: Do try extreme but realistic content in each component before calling it done. Don't judge a screen only by the seeded demo data.
- **Audit check**: Render the view with stress data (long strings, empty and huge lists, negative values, missing avatars) or find components without `truncate`/`line-clamp`/`min-w-0`/`overflow-wrap` on user text; flag overflow, collisions and clipped values.
- **Restyle fix**: Add truncation with full text on demand, wrap or clamp long strings, reserve width for numbers with tabular figures, and design the empty and overflow states.
- **Severity**: medium ; **Tags**: states, layout

### W5-14 Show metric rows only for real, sourced numbers  (src: vercel-design-md)
- **Rule**: A row of repeated metric boxes (big number, small label) is a generated default; use it only for real, attributable figures, and prefer one composed comparison when it explains the point better.
- **Why**: Unsourced or decorative numbers read as filler and cost trust, like the vague proof in W1-83.
- **Do / Don't**: Do give each figure a source, period or comparison. Don't add a stat banner to fill space or repeat numbers shown elsewhere.
- **Audit check**: Look for 3 or more sibling blocks each holding a large number and a short label (`text-3xl`+ followed by `text-sm`/`text-muted`), and check whether each figure is sourced or dated.
- **Restyle fix**: Keep only sourced figures; merge the rest into one sentence or chart that compares them, or remove them.
- **Severity**: low ; **Tags**: copy, hierarchy, craft
