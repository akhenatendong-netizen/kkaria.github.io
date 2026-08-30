# Mobile product and device mockups

## Purpose

Use mockups to make the product tangible, explain behavior, and increase credibility. Never use devices merely to fill space.

## Input hierarchy

1. Current exported product screens supplied by the user.
2. Current screen frames from an authorized Crazybee Figma product file.
3. Approved historical screens clearly labeled as historical.
4. Explicit placeholders labeled as conceptual.

Never generate a fictional UI that could be interpreted as the shipped product.

## Crazybee viewport standard

- Use 393 × 852 px as the default consumer-app viewport.
- Prefer an existing 393 × 852 Figma frame.
- For taller frames, take the topmost crop only: `0, 0, 393, 852`.
- Do not fit an entire long scroll capture into the device. This makes the UI illegible and misrepresents the normal viewport.
- Preserve the chosen viewport's aspect ratio with no stretching, compression, or internal crop.

## Composition patterns

- Hero cluster: 3–6 angled devices for product breadth; keep one screen visually dominant.
- Single device: one large readable device paired with a benefit-led narrative.
- Flow strip: 3–5 upright screens in sequence; use short steps and consistent scale.
- Contextual product: device paired with a real venue, merchant, meal, event, or audience context.
- Detail crop: enlarge a meaningful UI region when the full screen would be unreadable.

## Legibility rules

- Prioritize comprehension over the number of screens.
- Avoid tiny UI text that appears detailed but cannot be read.
- Keep devices consistent in model, lighting, angle, shadow, and material within one slide.
- Do not crop critical navigation, prices, confirmation states, or outcome evidence.
- Do not place key screen content under glare, deep shadow, or decorative overlays.
- Use high-resolution screen exports at the intended presentation scale.
- Keep the full 393 × 852 viewport visible for front-facing product proof.
- Use detail crops only as a separate, clearly framed supporting view; do not substitute them for the complete primary viewport.

## Device construction

- Create one transparent PNG mockup asset per distinct screen.
- Use a realistic front-facing iPhone 16 Pro shell with titanium/metal material and restrained product-photography highlights.
- Keep the screen plane straight and unobstructed. Do not place glare, a Dynamic Island, a notch, a hand, a reflection, or decorative overlay across the UI.
- Generate only the device shell and lighting when AI imagery is needed. Composite the authentic Figma UI deterministically so labels, prices, images, and layout remain exact.
- Do not build the device from a plain black rounded rectangle in PowerPoint.

## Trust pairing

Pair mockups with at least one relevant credibility element when available:

- A precise user benefit.
- A verified metric with date and definition.
- A named venue or merchant example approved for publication.
- A short explanation of what the viewer is seeing.
- A real-world photograph showing the use context.

Do not add unrelated badges or numbers to make a page appear more credible.

## PowerPoint implementation

- Keep captions, labels, metrics, and simple backgrounds as editable PowerPoint objects.
- Preserve complex 3D device clusters as high-resolution transparent PNGs when native reconstruction reduces fidelity.
- Preserve each front-facing iPhone mockup as a tightly trimmed transparent PNG so slide placement does not include excess invisible padding.
- Keep the source UI exports separately when possible so screens can be updated later.
- Document the screen source, version date, and whether it represents live, beta, historical, or conceptual product.
