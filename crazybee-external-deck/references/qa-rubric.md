# Quality rubric

## Hard-fail conditions

Do not deliver when any of these remain:

- Unintended overlap, clipping, off-canvas content, broken crop, or unreadable text.
- Missing or substituted font that materially changes layout.
- Distorted, recolored, low-resolution, or unapproved Crazybee logo.
- Fictional product UI presented as real.
- Unsupported metric, customer, partnership, testimonial, or product claim.
- Residual sample text, unresolved generic placeholders, or wrong company identity.
- Product screens too small to support the page's argument.
- Editable audience-facing text below 16 pt.
- A declared font that silently rendered as Arial or another unapproved fallback.
- A consumer mobile screen that shows a shrunken long scroll capture instead of the 393 × 852 top viewport.
- A phone mockup made from a plain black rounded rectangle, or a mockup that stretches, compresses, crops, or obstructs authentic UI.
- Bordered card grids, decorative red rules, or long red bars that make the deck feel like a generic UI template.
- Source-deck wording, numbers, qualifiers, labels, or source lines removed or paraphrased without explicit approval.
- Inconsistent page size or a slide that visibly departs from the deck system without narrative reason.
- Missing source notes for externally sourced non-trivial claims or assets.
- Any English cover, section, slide, or card title that does not use strict Title Case: one uppercase initial per word with all remaining letters lowercase.
- A final slide that uses the correct colors and logo but still looks like a generic corporate or AI-generated template instead of the approved Crazybee references.

## Scored review

Score each dimension from 1 to 5. Require at least 4 in every category and an average of 4.3 or higher.

1. Brand fidelity: recognizably Crazybee; correct reference precedence.
2. Narrative clarity: one clear takeaway per slide and a coherent sequence.
3. Commercial credibility: claims are specific, supported, and appropriately restrained.
4. Product comprehension: viewers understand what the product does and why it matters.
5. Visual hierarchy: clear reading order, strong typography, intentional emphasis.
6. Layout craft: alignment, spacing, margins, cropping, and density are controlled.
7. Asset quality: images, screens, logos, and mockups are sharp and consistent.
8. Editability: appropriate elements remain editable without sacrificing key visual fidelity.
9. Reference parity: representative slides match the composition quality, typographic confidence, image treatment, and intentional asymmetry of the relevant Figma benchmarks.
10. Production fidelity: content preservation, 16 pt minimum, actual font rendering, 393 × 852 viewport compliance, and authentic UI mockups all pass.

## Review sequence

1. Render every slide.
2. Inspect every slide individually at full size.
3. Inspect a montage for rhythm, repetition, and balance between immersive and evidence modes.
4. Run structural overflow checks.
5. Verify claims and source notes.
6. Record rubric scores and corrections.
7. Compare representative slides side by side with at least two relevant frames from the `source-map.md` reference lock set.
8. Rerender every corrected slide before delivery.
9. Audit editable text sizes, declared versus rendered font, card strokes, red decorative rules, and mobile viewport dimensions before handoff.
