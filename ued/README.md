# Garden Feelings — Islands

An English, interactive student concept inspired by the University of Bristol Botanic Garden. This is an imagined garden experience, not an official service or a geographically accurate map.

## Run

```sh
python3 -m http.server 8795 --directory dist
```

Open http://localhost:8795. The complete website is in `dist`; no build or package installation is needed. Keep the directory structure intact. A web server is required for JavaScript modules; double-clicking index.html is not sufficient.

## Main experience

- Explore four bright 3D islands with animated camera journeys, orbit and zoom controls, water, shadows, a companion and optional sound.
- Each island loads its interactive details on demand: glasshouse butterflies and doors, unfurling ferns and a fossil, duck and pond ripples, blooming flowers and a breeze.
- Tap the glass jar or “How does this place feel?” to push the camera towards the jar.
- A large translucent, frosted-glass jar opens over the original animated garden, keeping its surroundings visible. Its inner surface remains a 2D physics space. Choose one of five labelled, coloured emotions.
- The selected smooth, softly highlighted sphere drops and settles among the other spheres using planar Matter.js collisions. Spheres can be dragged; they never stack into depth.
- After the drop, the jar and QR invitation remain visible together for 18 seconds, then the camera returns to the island. “Stay a little longer” pauses the return. “Continue here” opens the follow-up form on this device.
- QR follow-ups carry the selected island and emotion. Optional reasons and an 800-character comment are saved locally and can be downloaded as JSON from the journal.
- Exploration stamps are separate from feedback. No rating is required to discover the islands.
- Main screens use headings and necessary controls only. Instructions, reduced motion and prototype limitations are in Help.

## Preserved version

The original 2D playground is retained at `/classic/` and in the separate `Garden-Feelings-Classic-Preserved-20261111.zip` supplied alongside this version. Its browser-local records use a different storage key and are not deleted.

## Prototype limits

Starter spheres are demonstration content, not actual visitor responses. Each jar starts with a demonstration arrangement. Real selections are saved separately in this browser.

There is no shared backend: feedback stays on the device used to submit it and is not sent to the garden. A QR code carries context across devices but does not synchronise records. Deploy to an accessible HTTPS origin to scan from a phone; localhost links cannot open the computer's server on another device. The hosted site retains its owner-private access, so the phone also needs authorised access.

Counts are browser-local records, not unique visitors or verified garden-wide research results. Actual garden locations, physical installation, data handling and accessibility require further validation.

## Libraries and rendering

- Three.js 0.170.0, MIT: real-time WebGL geometry, materials and lighting. Three.js, OrbitControls and RoomEnvironment are vendored under `dist/vendor` with the licence.
- Matter.js 0.20.0, MIT: 2D circle collision and dragging, vendored in `dist/matter.min.js`.
- qrcode-generator 1.4.4, MIT: real QR generation, vendored in `dist/qrcode.js`.
- Manrope and DM Sans via Google Fonts; local sans-serif fallbacks when offline.

Scenes and smooth sphere faces are procedural; the falling spheres match the emotion picker. The visual direction evokes playful rendered 3D; no Blender rendering is claimed.

## Checks

JavaScript syntax checked. Browser checks covered island entry and interactive hotspots, frosted-glass jar selection, QR generation, extended stay, return to the island, follow-up submission and local saved confirmation. The glass overlay and its canvas use panel-local coordinates, with responsive phone styles. Desktop flow was checked for this revision; a fresh narrow-screen visual check remains outstanding. This is not a completed accessibility audit or a physical QR-scanning/user study.
