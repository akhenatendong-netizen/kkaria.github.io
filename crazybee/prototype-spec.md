# CrazyBee North America Local Deals Prototype Spec

## 1. UX Analysis
- Target users: North American urban users looking for value-for-money local experiences with quick mobile checkout.
- Core needs:
  - Discover nearby high-quality deals fast.
  - Understand price, validity, refund policy, and booking terms before payment.
  - Redeem, reschedule, refund, and repurchase with minimal friction.
- Main user journeys:
  - Discovery: Home recommendations -> Search/filter -> Merchant/deal detail -> Checkout.
  - Conversion: Deal detail -> Primary CTA -> Orders tab for redemption.
  - Retention: Saved list -> Price trigger -> Repeat purchase from profile assets.

## 2. Product Interface Plan
- Primary information architecture (tab bar):
  - Home: recommendations, categories, nearby merchants.
  - Search: query input, chips, ranked results.
  - Orders: active/completed/expired with redemption and support actions.
  - Saved: saved deals and merchants with quick checkout.
  - Profile: account assets, settings, and shortcuts.
- Secondary key pages:
  - Merchant detail: merchant info, deal list, social proof.
  - Deal detail: pricing, validity terms, notes, fixed bottom CTA.
- Interaction principles:
  - Card-driven navigation with direct tap into details.
  - Immediate feedback on actions (hover/tap/toast).
  - Persistent tab navigation to preserve orientation.

## 3. High-Fidelity UI Strategy
- Device target: iPhone 15 Pro viewport (393x852), iOS status bar, and bottom tab bar.
- Visual language: white surfaces, soft gray background, red `#FF3535` reserved for critical actions.
- Component standards:
  - Rounded cards with `border-gray-200` + `shadow-sm`.
  - Spacious padding and clear visual hierarchy.
  - Strong title/subtitle/meta typographic levels.
- Image strategy: real lifestyle and food photography from Unsplash.

## 4. Implementation File Map
- Screens:
  - `home.html`
  - `search.html`
  - `restaurant-detail.html`
  - `deal-detail.html`
  - `orders.html`
  - `favorites.html`
  - `profile.html`
  - `index.html`
- Shared resources:
  - `styles.css`: design tokens and global component styles.
  - `app.js`: navigation, tabs, chips, favorites, toast feedback.

## 5. Build-Ready Value
- Full flow coverage: browse -> search -> detail -> purchase -> order management.
- Clean structure: split pages + shared style/script for easy framework migration.
- Scalable design system: extendable for dark mode, localization, and backend integration.
