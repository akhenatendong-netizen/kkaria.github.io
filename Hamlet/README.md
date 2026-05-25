# Hamlet

Interactive Hamlet panorama experience built with React, Vite, React Three Fiber, and MediaPipe Hands.

## Local Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

This repo supports two publishing methods.

### Option 1: Deploy From Branch

Upload the whole `Hamlet` folder to a GitHub repository named `Hamlet`, then set:

- Settings -> Pages -> Build and deployment -> Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/docs`

Then open:

```text
https://demo.kkaria.com/Hamlet/
```

### Option 2: GitHub Actions

Set:

- Settings -> Pages -> Build and deployment -> Source: `GitHub Actions`

The workflow in `.github/workflows/deploy.yml` will build `dist/` and deploy it automatically after pushing.

## Notes

- `node_modules/` and `dist/` are ignored by `.gitignore`.
- `docs/` is committed static output for branch-based GitHub Pages.
- Source assets in `public/` are all below GitHub's 100 MB single-file limit.
- `vite.config.js` uses `base: './'`, so assets work from `/Hamlet/` and other subpaths.
