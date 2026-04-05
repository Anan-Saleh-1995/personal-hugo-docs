# Contributing

## Local Workflow

```bash
npm install
npm run dev
```

Make sure Hugo Extended is installed on your machine and available on `PATH`.

Before submitting changes:

```bash
npm run validate
npm run test:smoke
```

## Template Rules

- Build class lists with `slice`, `append`, and `delimit`.
- Do not concatenate modifier classes inline inside attribute strings.
- Boolean ARIA state must render literal values such as `aria-expanded="true"` and `aria-expanded="false"`.
- Docs shell state belongs in `layouts/partials/docs-page-model.html`.

## SCSS Ownership

- `assets/scss/tokens/`: design tokens and breakpoints only
- `assets/scss/layouts/_docs.scss`: page shell grid, responsive shell switching, and shell spacing
- `assets/scss/components/`: component-owned styling such as topbar, sidebar, TOC, search, code blocks, and article header

Prefer standalone modifier classes when they can cleanly override a block. Avoid compound selectors unless they express a real state relationship.

## JavaScript Boundaries

- `assets/js/site/theme.mjs`: theme persistence and theme metadata
- `assets/js/site/nav.mjs`: compact drawer behavior
- `assets/js/site/tree.mjs`: sidebar disclosure toggles
- `assets/js/site/search.mjs`: Pagefind dialog UI
- `assets/js/site/toc.mjs`: active heading syncing for desktop and mobile TOC
- `assets/js/site/copy-code.mjs`: code-copy buttons

`assets/js/site.mjs` should stay a tiny entrypoint that only wires those modules together.

## Data Attribute Contract

- `data-nav-toggle`
- `data-nav-close`
- `data-nav-overlay`
- `data-search-open`
- `data-search-close`
- `data-search-dialog`
- `data-search-input`
- `data-search-results`
- `data-theme-toggle`
- `data-tree-toggle`
- `data-toc`
- `data-mobile-toc`
- `data-mobile-toc-panel`

Interactive features should depend on those hooks instead of brittle selector chains.
