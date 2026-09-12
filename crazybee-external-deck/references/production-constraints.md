# Validated production constraints

Apply these rules by default to every Crazybee external deck unless the user explicitly overrides them.

## Source fidelity

- Preserve all audience-facing wording, numbers, qualifiers, labels, and source lines from a supplied deck.
- Do not shorten, paraphrase, or delete source content to make a layout fit.
- Remove visible Chinese production annotations only after implementing their instructions in the deck.
- Preserve information baked into source raster tables and images; reconstruct only when necessary for legibility.

## Typography

- Verify actual font availability before layout work.
- Use Poppins when it is installed and renders correctly.
- Never allow silent fallback to Arial or another narrow default font.
- Use Avenir Next as the approved fallback for a rounder, wider, less congested appearance.
- Use at least 16 pt for all audience-facing editable text.
- Increase line spacing and paragraph separation before adding decorative containers.
- Split a dense slide rather than shrinking copy.

## Layout and styling

- Favor flat editorial composition over dashboard-like card grids.
- Do not add strokes around cards. Use whitespace, background contrast, scale, and alignment for grouping.
- Remove decorative red rules, long red bars, and unnecessary red connectors. Keep red for meaningful emphasis, key numbers, labels, and core brand moments.
- Keep number, label, and definition groups aligned to one baseline system with generous vertical separation.
- Match the spacing rhythm and confident text-to-number relationships of the approved Crazybee references.

## Mobile UI viewport

- Display consumer mobile UI at 393 × 852 px.
- Prefer a source frame already sized 393 × 852.
- When a source is taller than 852 px, crop from the top: `left=0`, `top=0`, `width=393`, `height=852`.
- Do not scale the entire scrolling page into one phone.
- Preserve source aspect ratio. Never stretch, compress, or crop away content inside the selected 393 × 852 viewport.

## Device mockups

- Use an individually composited transparent PNG for each distinct UI screen.
- Use a front-facing iPhone 16 Pro with realistic titanium/metal edges and restrained studio highlights.
- Keep the screen unobstructed: no glare across UI, no decorative overlay, no hand, no shadow over content, and no notch or Dynamic Island covering the capture.
- Use AI generation only for the physical device shell or supporting light/material treatment. Composite the authentic Figma UI deterministically afterward.
- Never use a plain black rounded rectangle as a phone frame.
- Keep source UI exports separately so the device asset can be regenerated without changing the product screen.

## Verification

- Render every slide and inspect at full size.
- Verify the first 393 × 852 viewport is visible in every mobile mockup.
- Verify no editable audience text is below 16 pt.
- Verify the rendered font, not only the declared font name.
- Verify no long red decorative bars, card borders, UI stretching, tiny full-page scroll captures, or plain black mockup frames remain.
