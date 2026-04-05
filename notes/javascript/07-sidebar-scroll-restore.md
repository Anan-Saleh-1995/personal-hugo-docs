<!-- markdownlint-disable MD024 MD029 -->

# 07 Sidebar Scroll Restore

This file explains:

- `static/js/sidebar-scroll-restore.js`

This script exists for one reason:

- restore the sidebar scroll position **early enough**
- so the user does not see the sidebar jump from top to the old position after page navigation

This script is separate from `nav.mjs` because timing matters.

`nav.mjs` runs later as part of the main site bundle.
This file runs immediately at the point where the sidebar HTML is parsed.

## Where it is used

Template:

- `layouts/partials/docs-sidebar.html`

Rendered HTML:

```html
<nav
  class="docs-sidebar__nav"
  aria-label="Docs"
  data-nav-scroll-area
  data-nav-scroll-key="personal-hugo-docs-sidebar-scroll"
>
  ...
</nav>

<script src="/js/sidebar-scroll-restore.js"></script>
```

The important detail is:

- the script tag comes **immediately after** the nav element

That is why the script can do:

```js
const nav = document.currentScript?.previousElementSibling;
```

and reliably get the sidebar scroll area.

## Top-level flow

Code starts like this:

```js
(() => {
  const nav = document.currentScript?.previousElementSibling;
  ...
})();
```

This is an IIFE:

- immediately invoked function expression

Meaning:

- the script runs as soon as the browser loads it
- its variables stay local
- it does not leak names into `window`

## Step 1: find the sidebar nav element

```js
const nav = document.currentScript?.previousElementSibling;
if (!(nav instanceof HTMLElement)) {
  return;
}
```

### Input

- the current script tag

### Output

- the previous sibling element

### Exact example

If the HTML is:

```html
<nav data-nav-scroll-area ...></nav>
<script src="/js/sidebar-scroll-restore.js"></script>
```

then:

- `document.currentScript` = the `<script>` tag
- `document.currentScript.previousElementSibling` = the `<nav>`

If the previous element is missing or not an `HTMLElement`:

- output = stop immediately

## Step 2: read the storage key from the DOM

```js
const storageKey = nav.dataset.navScrollKey;
if (!storageKey) {
  return;
}
```

### Input

- `data-nav-scroll-key`

### Output

- storage key string

### Exact example

Input:

```html
<nav data-nav-scroll-key="personal-hugo-docs-sidebar-scroll"></nav>
```

Output:

```txt
storageKey = "personal-hugo-docs-sidebar-scroll"
```

If the dataset value is missing:

- stop immediately

## Step 3: read the saved sidebar state

```js
const saved = window.sessionStorage.getItem(storageKey);
if (!saved) {
  return;
}
```

### Input

- `sessionStorage["personal-hugo-docs-sidebar-scroll"]`

### Output

- raw saved string

### Exact example

Possible saved values:

```txt
"642"
```

or:

```json
{ "bottomOffset": 0, "scrollTop": 905 }
```

If nothing is saved:

- stop immediately

## `applySavedScroll()`

This is the main worker inside the file.

## Case 1: plain number format

```js
let nextScrollTop = Number.parseFloat(saved);
```

### Input

- `saved = "642"`

### Output

- `nextScrollTop = 642`

This supports the older simple format.

## Case 2: JSON object format

```js
if (saved.trim().startsWith("{")) {
  ...
}
```

### Input

- saved string begins with `{`

### Output

- parse JSON and derive a better target scroll position

### Example input

```json
{ "bottomOffset": 0, "scrollTop": 905 }
```

That means:

- at save time, the nav was near the bottom
- exact scroll top was `905`
- distance from bottom was `0`

## Inside the JSON branch

```js
const parsed = JSON.parse(saved);
const maxScrollTop = Math.max(0, nav.scrollHeight - nav.clientHeight);
const bottomOffset = Number.parseFloat(parsed?.bottomOffset);
const savedTop = Number.parseFloat(parsed?.scrollTop);
```

### Input

- current nav height
- current nav scroll height
- saved values from storage

### Output

- current maximum possible scroll
- parsed saved numbers

### Exact example

If:

- `nav.scrollHeight = 1600`
- `nav.clientHeight = 695`

then:

```txt
maxScrollTop = 905
```

If parsed state is:

```json
{ "bottomOffset": 0, "scrollTop": 905 }
```

then:

```txt
bottomOffset = 0
savedTop = 905
```

## Bottom-anchor rule

```js
if (!Number.isNaN(bottomOffset) && bottomOffset <= 48) {
  nextScrollTop = Math.max(0, maxScrollTop - bottomOffset);
}
```

### Input

- `bottomOffset`
- `maxScrollTop`

### Output

- use bottom-relative restoration

### Why

Raw `scrollTop` works well in the middle.
Near the end, tiny changes in layout height can make the nav jump.

So this rule says:

- if the saved position was within `48px` of the bottom
- restore relative to the bottom instead of using the old raw top

### Exact example

Saved state:

```json
{ "bottomOffset": 0, "scrollTop": 905 }
```

Current page:

- `maxScrollTop = 912`

Output:

```txt
nextScrollTop = 912 - 0 = 912
```

That keeps the user anchored near the bottom even if the nav height changed slightly.

## Raw top fallback rule

```js
else if (!Number.isNaN(savedTop)) {
  nextScrollTop = Math.min(savedTop, maxScrollTop);
}
```

### Input

- `savedTop`
- `maxScrollTop`

### Output

- use raw top, but clamp it to valid range

### Exact example

Saved state:

```json
{ "bottomOffset": 320, "scrollTop": 412 }
```

Current page:

- `maxScrollTop = 900`

Output:

```txt
nextScrollTop = 412
```

So middle-of-list navigation keeps the same scroll position.

## Final guard

```js
if (Number.isNaN(nextScrollTop)) {
  return;
}
```

If parsing fails:

- do nothing

## Apply the scroll

```js
nav.scrollTop = nextScrollTop;
```

### Input

- final computed scroll top

### Output

- sidebar moves to that position

## `scheduleRestore()`

This is the anti-jump part.

```js
const scheduleRestore = () => {
  applySavedScroll();
  window.requestAnimationFrame(() => {
    applySavedScroll();
    window.requestAnimationFrame(applySavedScroll);
  });
  window.setTimeout(() => {
    applySavedScroll();
  }, 80);
};
```

### Input

- one saved sidebar position

### Output

- apply the same restore multiple times across early layout frames

### Why this exists

One restore call can lose to:

- late layout settling
- browser focus behavior
- tiny nav height changes after parse

So instead of:

- restore once

the script does:

1. restore immediately
2. restore on next animation frame
3. restore on the following animation frame
4. restore again after `80ms`

### Exact effect

Input:

- saved bottom state near end of nav

Output:

- browser is repeatedly pulled back to the intended scroll position while the page finishes stabilizing

That is what reduces the visible top-then-bottom jump.

## Final runtime sequence

When navigating from one docs page to another:

1. `nav.mjs` saves sidebar scroll state into `sessionStorage`
2. new page HTML begins parsing
3. browser reaches the sidebar `<nav>`
4. browser reaches:

```html
<script src="/js/sidebar-scroll-restore.js"></script>
```

5. this file runs immediately
6. it reads the saved scroll state
7. it restores scroll multiple times early
8. later, the main JS bundle loads
9. `nav.mjs` restores again as a backup

So this file is the **early restore** layer.
`nav.mjs` is the **feature/runtime** layer.

They work together, but they do different jobs.
