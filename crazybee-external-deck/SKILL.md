---
name: crazybee-external-deck
description: Create, revise, and quality-check editable 16:9 PowerPoint decks for Crazybee external audiences. Use for Crazybee company introductions, product demos, partnership proposals, sales pitches, case studies, university or institutional presentations, and any deck that must combine Crazybee's black-red-white experiential brand language with disciplined commercial layouts, mobile-product mockups, visual evidence, and rendered-slide QA. Trigger when the user mentions Crazybee slides, Crazybee PPT/PPTX, an external introduction deck, a product presentation, or adapting the supplied Crazybee Figma references into PowerPoint.
---

# Crazybee External Deck

Create audience-ready Crazybee presentations that feel energetic, credible, visual, and commercially disciplined. Keep the final PPTX editable while preserving complex hero visuals as high-resolution raster assets when native reconstruction would reduce fidelity.

## Required workflow

1. Read the presentation-authoring skill completely and follow its runtime, sourcing, rendering, and verification requirements.
2. Read `references/source-map.md`, `references/brand-system.md`, `references/editorial-style.md`, `references/production-constraints.md`, `references/product-screen-index.md`, `references/mockup-product-pages.md`, `references/brand-asset-index.md`, and `references/qa-rubric.md`. Read `references/merchant-messaging.md` for merchant, restaurant, POS, redemption, or partnership decks.
3. Read `references/content-boundaries.md` when claims, client names, metrics, testimonials, pricing, partnerships, or confidential information are involved.
4. Inspect supplied Figma frames, PPTX files, product screens, and brand assets before planning. Treat them as the source of truth; do not infer exact fonts, colors, or logo geometry from screenshots when inspectable sources exist.
5. Confirm audience, purpose, delivery mode, language, and desired slide count. Use reasonable defaults only when they do not alter the commercial message.
6. Write a one-sentence communication job and a slide-by-slide narrative before authoring.
7. Map each slide to an approved archetype in `references/slide-archetypes.md`. Prefer a small coherent family over one-off compositions.
8. Create the deck, render every slide, inspect every slide at full size, correct failures, and rerender.
9. Score the final deck using `references/qa-rubric.md`. Do not deliver when a hard-fail condition remains.

## Language and typography lock

- Default to English only. Do not add Chinese translations unless the user explicitly requests them.
- Prefer Poppins for every audience-facing title, section title, slide title, and major numeric statement when the font is installed and verified.
- Set every English cover, section, slide, and card title in strict Title Case: capitalize the first letter of every word and set all remaining letters in that word to lowercase. Do not use sentence case or all caps.
- Prefer Poppins or Inter for body text only when the selected font is installed, renders correctly, and does not create a narrow or congested page.
- If Poppins or Inter is unavailable, never permit silent Arial-style fallback. Use Avenir Next as the approved local fallback because it has a wider, rounder, more relaxed texture. State the fallback in the handoff.
- Use no audience-facing text smaller than 16 pt, excluding text already embedded inside authentic screenshots, logos, or source raster evidence.
- Use comfortable line spacing and paragraph separation. Redesign or split a slide before tightening body copy or reducing type below 16 pt.
- Preserve title hierarchy through size and weight rather than introducing a third font.
- Verify fonts before authoring and again in the rendered PPTX. Font-family names in code are not proof that the intended font rendered.

## Source-content preservation lock

- When revising a user-supplied deck, preserve every audience-facing source word, number, qualifier, label, and source line unless the user explicitly authorizes editing or removal.
- Treat visible Chinese production annotations as instructions, not audience content, when the user asks for an English external deck. Remove only those annotations after implementing them.
- Do not replace original copy with shorter paraphrases merely to fit a layout. Redesign or add slides instead.
- Treat text baked into source images or tables as source content. Preserve it or reconstruct it faithfully when legibility must improve.

## Style routing

Apply the two references as complementary layers:

- Use the Crazybee deck as the primary source for brand energy, red-black-white contrast, nightlife and dining photography, product emphasis, logo behavior, bold cover treatments, and cinematic hero pages.
- Use the Indiana University / Genwise deck as a secondary source for grid discipline, whitespace, restrained business typography, evidence presentation, recurring header/footer logic, and institutional credibility.
- Never copy Genwise colors, logo, identity, or subject-specific content into Crazybee work.
- Do not average the references into a generic corporate look. Use one dominant visual mode per slide: immersive Crazybee hero or restrained evidence-led business page.

## Product and mockup priority

Treat mobile product presentation as a core deck system, not decoration.

- Use device mockups when demonstrating flows, multiple screens, product breadth, or a high-value interaction.
- Pair every product visual with a concise audience benefit, not only a feature label.
- Use real, current UI captures whenever supplied. Never invent screens that could be mistaken for shipped product.
- Add evidence adjacent to the relevant product story: usage data, merchant coverage, testimonials, process proof, or case results when approved.
- Preserve screen legibility. Do not place more screens than the viewing distance permits.
- For Crazybee consumer mobile UI, standardize the displayed viewport to 393 × 852 px. If the source frame is taller, crop the topmost 393 × 852 region. Prefer an existing native 393 × 852 frame when one is available.
- Never shrink an entire long scrolling design into a phone screen. Never stretch, compress, AI-redraw, or cover authentic UI.
- Use individually rendered transparent iPhone 16 Pro mockup assets with realistic titanium/metal material and controlled light. Do not simulate a phone by adding a plain black rounded rectangle around a screenshot.
- Keep front-facing mockups upright whenever product comprehension is the priority. Preserve the entire 393 × 852 viewport and keep UI clear of glare, notches, overlays, and decorative obstruction.
- Follow all cropping, angle, hierarchy, and trust rules in `references/mockup-product-pages.md`.

## Output modes

### Strict mode

Use approved slide archetypes, supplied assets, and verified claims only. Choose this by default for investor, client, university, government, legal, or institutional audiences.

### Creative mode

Allow new compositions and generated supporting imagery while preserving brand tokens, audience clarity, and all QA gates. Never generate replacement product UI, customer logos, testimonials, or performance data.

## Required deliverables

- Deliver one editable `.pptx` unless the user requests another format.
- Keep external claim and asset sources in speaker notes as required by the presentation-authoring skill.
- State any unresolved placeholders or unavailable licensed assets.
- Do not deliver planning files, contact sheets, or intermediate renders unless requested.

## Resource routing

- `references/source-map.md`: canonical reference files and their roles.
- `references/brand-system.md`: visual system and reference precedence.
- `references/editorial-style.md`: storytelling, copy, and credibility rules.
- `references/production-constraints.md`: validated content, typography, spacing, card, line, UI viewport, and mockup constraints from production review.
- `references/slide-archetypes.md`: reusable page families and selection rules.
- `references/mockup-product-pages.md`: device mockup and UI presentation rules.
- `references/product-screen-index.md`: semantic routing for approved consumer and merchant product nodes.
- `references/brand-asset-index.md`: approved icon/lockup variants and background-selection rules.
- `references/merchant-messaging.md`: approved merchant value proposition, product proof, and claim-context rules.
- `references/content-boundaries.md`: factual, legal, confidentiality, and placeholder rules.
- `references/qa-rubric.md`: hard gates and scored review.
- `assets/`: approved templates, fonts, logos, graphics, product screens, photography, and mockups once supplied.
- `scripts/`: deterministic inspection and QA helpers added only after the retained assets and runtime are confirmed.
