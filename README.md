# Personal Hugo Docs

Custom Hugo docs site built as a public, maintainable foundation for long-term notes and documentation. The site is docs-first at `/docs`, uses Hugo templates plus Sass tokens, and keeps search/theme/navigation behavior in small vanilla JS modules.

## Requirements

- Git
- Node.js LTS
- Hugo Extended `0.159.1`
- Dart Sass CLI on `PATH`

Hugo's Dart Sass pipeline requires a real Sass executable on `PATH`. On Windows, install it with:

```bash
npm install --global sass
```

You can also install Dart Sass from the official standalone release if you prefer.

## Local Setup

```bash
npm install
npm run dev
```

## Build And Checks

```bash
npm run format
npm run validate
```

`npm run validate` checks formatting, Markdown, SCSS, builds the site, and generates the Pagefind index in `public/pagefind/`.

## Smoke Tests

Install Chromium for Playwright once:

```bash
npx playwright install chromium
```

Run the smoke suite after a build:

```bash
npm run validate
npm run test:smoke
```

## Folder Map

- `content/`: published Markdown content
- `layouts/`: Hugo layouts, partials, and render hooks
- `assets/scss/`: tokens, base styles, layouts, and component styles
- `assets/js/`: small feature modules for theme, nav, search, TOC, and code-copy behavior
- `static/`: static public assets
- `notes/`: private project notes that are not published
- `tests/smoke/`: Playwright smoke tests

## Stable Extension Points

- Search, nav, theme, and TOC hooks are driven by `data-*` attributes documented in `CONTRIBUTING.md`.
- Docs page shell state comes from `layouts/partials/docs-page-model.html`.
- Public repo-level configuration lives in `hugo.yaml` under `params`.

## Browser Baseline

The site targets modern evergreen browsers only. The runtime uses native ES modules, `<dialog>`, `inert`, and modern `matchMedia(...).addEventListener("change", ...)`.
