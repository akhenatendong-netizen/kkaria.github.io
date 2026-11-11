# CrazyBee brand website preview

React + TypeScript + Three.js + Vite.

The October redesign studies MDX (https://mdx.so/) for its concentrated hero composition, studio lighting, continuously changing surface, peripheral typography and deliberate motion. The scene, shaders and models here are original CrazyBee implementations; no reference-site assets are reused.

## Run

```sh
npm install
npm run dev -- --port 5173
```

Open http://127.0.0.1:5173/ .

## Build

```sh
npm run build
npm run preview
```

## Included

- Consumer and merchant experiences, selected through the in-page audience tabs and persisted in the URL.
- Supplied CrazyBee IP image and existing project food/brand assets.
- Nonlinear Three.js world: a warm-lit, continuously shaded, gently deforming orb, original procedural burger, pizza slice and strawberry cupcake sculptures, pause, rotate and reset controls.
- Three independent destination panels for each audience, with choices and next/previous navigation.
- Scroll-driven three-act brand story, sticky staging and delayed typography.
- Draggable, reversible 3D coupon with keyboard-accessible flip/reset buttons.
- A dark cinematic hero transitions into white editorial chapters. Header and chapter navigation switch contrast automatically.
- Full-screen navigation with staggered typography, native focus handling and Escape dismissal.
- Grab-inspired in-page audience tabs, structured service rows, FAQ and reduced-motion support.

## Preview boundaries

The homepage mascot uses the supplied original plush artwork's transparent-background adaptation as a camera-facing image. It is not a 3D mascot. Food sculptures and their rotation controls have been removed. The mascot remains the sole central subject; dragging changes the surrounding light sculpture. The dark studio orb and flowing highlights remain. Logo bee and C are brand red; remaining lettering is dark on white and white in the dark hero. Food sculptures illustrate categories, not current offers. No invented discounts, merchant results or availability are displayed. The existing group-delivery link opens the separate ordering website. Merchant contact opens an email draft; no form submissions or messages are sent automatically. No live catalog or payment integration is included. No public deployment has been made.

## Asset edit

The built-in image generation tool made public/assets/crazybee-cutout.png with transparent_background=true. Prompt: remove only the white background and ground shadow; preserve the supplied mascot’s pose, expression, colors, plush texture, pink wings, scarf and utensil bag. This generated adaptation should be replaced with the approved transparent brand master when available.

## Homepage comparison

- `/?design=a`: original IP / orbital homepage (default).
- `/?design=b`: alternative restaurant homepage. Click **Step inside**, drag to orbit, or select **The table**, **The counter**, and **The welcome** for camera close-ups. Reset returns to the room overview; Back outside or Escape leaves exploration.
- The A / B control switches only the homepage. All following sections and consumer / merchant content are shared.
- The restaurant is an original procedural Three.js diorama for brand exploration, not a listing or depiction of a real venue. No external model downloads are required.
