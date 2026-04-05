<!-- markdownlint-disable-file MD029 -->

# 06 Runtime And Debugging

This file is the practical runtime map.

It answers:

- what happens in what order
- what state changes matter most
- where to debug when something breaks

## Full runtime flow example

### Initial page load

Input:

- browser loads page
- DOM becomes ready

Output order:

1. `site.mjs` calls `initTheme()`
2. `initTheme()` sets root theme and labels
3. `site.mjs` calls `initNav()`
4. `initNav()` restores sidebar scroll and wires drawer behavior
5. `site.mjs` calls `initTree()`
6. `initTree()` wires sidebar branch toggles
7. `site.mjs` calls `initSearch()`
8. `initSearch()` wires dialog, shortcuts, debounce, and search rendering
9. `site.mjs` calls `initCopyCode()`
10. `initCopyCode()` wires delegated copy behavior
11. `site.mjs` calls `initToc()`
12. `initToc()` computes the first active heading

## Example: clicking a code-copy button

Input:

- user clicks copy button inside a code block

Output:

1. document click reaches `copy-code.mjs`
2. code block text is found
3. clipboard write is attempted
4. label changes:
   - `Copy`
   - `Copied`
   - back to `Copy`

## Example: clicking a sidebar item while scrolled deep

Input:

- sidebar scrollTop = `642`
- user clicks `Item 20`

Output:

1. nav module sees sidebar link click
2. it stores:

```txt
sessionStorage["personal-hugo-docs-sidebar-scroll"] = "642"
```

3. browser navigates to a new page
4. inline sidebar restore script applies the saved scroll early
5. `nav.mjs` restores scroll again during init as backup

## Example: opening search with keyboard

Input:

- user presses `Ctrl+K`

Output:

1. search module intercepts keydown
2. it calls `openSearch(...)`
3. compact nav closes if needed
4. native dialog opens
5. `body.search-open` is added
6. focus moves to the search input

## Example: typing `git`

Input:

- input sequence:
  - `g`
  - `gi`
  - `git`

Output:

- older debounce timers are cleared
- after 120 ms pause:
  - `performSearch("git", ...)`
- Pagefind returns matches
- search results render

## The most important state changes in the system

If you want the short version, these are the real states that matter:

- theme state:
  - `html[data-theme]`
  - `localStorage["personal-hugo-docs-theme"]`
- drawer state:
  - `body.nav-open`
- search state:
  - native `<dialog open>`
  - `body.search-open`
- sidebar branch state:
  - `aria-expanded`
  - branch `hidden`
  - `.is-expanded`
- TOC active state:
  - `.is-active`
  - `aria-current="true"`
- sidebar remembered scroll:
  - `sessionStorage["personal-hugo-docs-sidebar-scroll"]`

## Debugging map

### Theme broken

Look at:

- `assets/js/site/theme.mjs`
- `layouts/partials/head-theme-bootstrap.html`
- `#theme-color-meta`

### Nav drawer broken

Look at:

- `assets/js/site/nav.mjs`
- `data-nav-toggle`
- `data-nav-close`
- `data-nav-overlay`
- `data-nav-scroll-area`

### Sidebar expand/collapse broken

Look at:

- `assets/js/site/tree.mjs`
- `layouts/partials/docs-sidebar-tree.html`
- `aria-controls`
- `aria-expanded`

### Search broken

Look at:

- `assets/js/site/search.mjs`
- `layouts/partials/search-dialog.html`
- `public/pagefind/`

### TOC broken

Look at:

- `assets/js/site/toc.mjs`
- rendered heading ids
- TOC links from `layouts/partials/toc-nav.html`

### Copy buttons broken

Look at:

- `assets/js/site/copy-code.mjs`
- `layouts/_markup/render-codeblock.html`
- clipboard API support

## Final summary

The JavaScript is intentionally split by behavior:

- theme
- nav
- tree
- search
- copy-code
- TOC

Each module mostly follows the same pattern:

1. find the DOM nodes it needs
2. return early if they do not exist
3. attach listeners
4. mutate only its own piece of state

That is why the code stays understandable over time:

- selectors are centralized
- storage keys are centralized
- feature responsibilities are separated
- DOM state is visible in attributes and classes

If you revisit this later, the fastest path is:

1. start at `site.mjs`
2. jump to the relevant feature module
3. inspect:
   - input selectors
   - storage keys
   - event listeners
   - DOM outputs
