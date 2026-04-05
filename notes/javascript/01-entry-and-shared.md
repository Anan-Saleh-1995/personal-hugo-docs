<!-- markdownlint-disable-file MD024 -->

# 01 Entry And Shared Modules

This file explains:

- the site entry point
- shared constants
- shared utility helpers

## Entry Point

File:

- `assets/js/site.mjs`

Code:

```js
import { initCopyCode } from "./site/copy-code.mjs";
import { initNav } from "./site/nav.mjs";
import { initSearch } from "./site/search.mjs";
import { initTheme } from "./site/theme.mjs";
import { initToc } from "./site/toc.mjs";
import { initTree } from "./site/tree.mjs";

const initSite = () => {
  initTheme();
  initNav();
  initTree();
  initSearch();
  initCopyCode();
  initToc();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite, { once: true });
} else {
  initSite();
}
```

### Input

- browser loads the bundle
- browser reports `document.readyState`

### Output

- all feature initializers run once

### Exact behavior

Case 1:

- input: `document.readyState === "loading"`
- output:
  - attach one `DOMContentLoaded` listener
  - when DOM is ready, call `initSite()`

Case 2:

- input: DOM is already parsed
- output:
  - call `initSite()` immediately

So this file does not hold feature logic.
It only decides **when** to start the modules.

## Shared Constants

File:

- `assets/js/site/constants.mjs`

## `MEDIA_QUERIES`

```js
export const MEDIA_QUERIES = {
  drawer: "(max-width: 52.499rem), (max-height: 30rem) and (max-width: 74.999rem)",
  prefersDark: "(prefers-color-scheme: dark)",
};
```

### Input

- no runtime input

### Output

- two query strings

### Example

Input:

- viewport width `800px`

Output:

- `window.matchMedia(MEDIA_QUERIES.drawer).matches === true`

Input:

- viewport width `1280px`

Output:

- `window.matchMedia(MEDIA_QUERIES.drawer).matches === false`

## `SELECTORS`

This is the DOM contract between templates and JavaScript.

Examples:

- `navToggle: "[data-nav-toggle]"`
- `searchDialog: "[data-search-dialog]"`
- `copyCode: "[data-copy-code]"`
- `tocLink: '[data-toc] a[href^="#"]'`

### Input

- no runtime input

### Output

- selector strings used by the modules

### Why this matters

If a template changes from:

- `data-nav-toggle`

to:

- `data-sidebar-toggle`

then the JS stops finding that element until `SELECTORS` is updated.

So this file is a source of truth.

## `STORAGE_KEYS`

```js
export const STORAGE_KEYS = {
  sidebarScroll: "personal-hugo-docs-sidebar-scroll",
  theme: "personal-hugo-docs-theme",
};
```

### Input

- no runtime input

### Output

- the exact strings used in storage

### Example

Input:

- sidebar scrollTop = `642`

Output:

```txt
sessionStorage["personal-hugo-docs-sidebar-scroll"] = "642"
```

Input:

- user switches to dark mode

Output:

```txt
localStorage["personal-hugo-docs-theme"] = "dark"
```

## Other constants

- `THEME_COLORS`
- `COPY_MESSAGES`
- `SEARCH_MESSAGES`
- `SEARCH_RESULT_LIMIT`

These exist so the feature modules do not hardcode magic strings everywhere.

## Shared Utilities

File:

- `assets/js/site/utils.mjs`

## `query(selector, root = document)`

```js
export const query = (selector, root = document) => root.querySelector(selector);
```

### Input

- `selector`
- optional `root`

### Output

- first matching element
- or `null`

### Example

Input:

```js
query("[data-search-dialog]");
```

Output:

- the search dialog element
- or `null`

## `queryAll(selector, root = document)`

```js
export const queryAll = (selector, root = document) => Array.from(root.querySelectorAll(selector));
```

### Input

- `selector`
- optional `root`

### Output

- always an array

### Example

Input:

```js
queryAll("[data-theme-toggle]");
```

Output:

- `[button1, button2]`
- or `[]`

## `escapeHtml(value)`

### Input

- any value

### Output

- HTML-safe string

### Exact example

Input:

```txt
<script>alert("x")</script>
```

Output:

```txt
&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;
```

This is used in search result rendering.

## `isEditableTarget(target)`

### Input

- event target

### Output

- `true` if target is:
  - `input`
  - `textarea`
  - `select`
  - contenteditable
- otherwise `false`

### Exact example

Input:

- user presses `/` while cursor is inside `<input>`

Output:

- returns `true`
- search shortcut should not open the dialog

## `capitalize(value)`

### Input

- `"light"`

### Output

- `"Light"`

Used for labels like:

- `Switch to Light mode`
