# Portfolio

Personal portfolio site built with React and Vite, deployed to GitHub Pages.

Live at: _(added once deployed)_

## Stack

- React 19
- Vite
- Plain CSS Modules (no UI framework — full control over the design system)

## Design system

Dark theme with an accessibility-checked contrast palette:

| Color | Hex | Use |
|---|---|---|
| Navy | `#0a192f` | Background |
| Light Navy | `#112240` | Elevated surfaces |
| Slate | `#8892b0` | Body text (5.7:1 contrast on Navy — passes WCAG AA) |
| Lightest Slate | `#ccd6f6` | Headings |
| Green | `#64ffda` | Accent (14:1 contrast on Navy — passes WCAG AAA) |

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment

Pushes to `main` automatically build and deploy to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`).
