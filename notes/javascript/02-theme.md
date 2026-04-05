<!-- markdownlint-disable-file MD024 -->

# 02 Theme Module

This file explains:

- `assets/js/site/theme.mjs`

This module owns:

- active theme state on `<html>`
- `theme-color` meta content
- theme toggle labels
- optional persistence to `localStorage`

## `getThemeConfig()`

### Input

- reads:
  - `#theme-color-meta`
  - its `data-theme-storage-key`
  - its `data-theme-color-light`
  - its `data-theme-color-dark`

### Output

- object:

```js
{
  storageKey,
  themeColors: { light, dark },
  themeMeta
}
```

### Exact example

If the meta tag contains:

```html
<meta
  id="theme-color-meta"
  data-theme-storage-key="personal-hugo-docs-theme"
  data-theme-color-light="#ffffff"
  data-theme-color-dark="#1c2128"
/>
```

then output becomes:

```js
{
  storageKey: "personal-hugo-docs-theme",
  themeColors: {
    light: "#ffffff",
    dark: "#1c2128"
  },
  themeMeta: <meta ...>
}
```

## `getStoredTheme()`

### Input

- reads `localStorage[storageKey]`

### Output

- `"light"`
- `"dark"`
- or `null`

### Exact rule

If storage contains:

- `"light"` -> output `"light"`
- `"dark"` -> output `"dark"`
- `"banana"` -> output `null`

## `getSystemTheme()`

### Input

- `window.matchMedia("(prefers-color-scheme: dark)").matches`

### Output

- `"dark"` if true
- `"light"` if false

## `updateThemeToggleLabels(theme, buttons)`

### Input

- current theme
- list of toggle buttons

### Output

- mutates the buttons

### Exact example

Input:

- current theme = `"dark"`

Calculated:

- next theme = `"light"`
- label = `"Switch to Light mode"`

Output:

- every button gets:
  - `aria-label="Switch to Light mode"`
- every `.sr-only` child becomes:
  - `Switch to Light mode`

## `applyTheme(theme, { persist = false } = {})`

### Input

- `theme`: `"light"` or `"dark"`
- `persist`: boolean

### Output

- mutates:
  - `html[data-theme]`
  - `html.style.colorScheme`
  - `#theme-color-meta[content]`
  - theme toggle labels
  - optionally local storage

### Exact example 1

Input:

```js
applyTheme("dark");
```

Output:

- `document.documentElement.dataset.theme = "dark"`
- `document.documentElement.style.colorScheme = "dark"`
- `theme-color` meta content becomes `#1c2128`
- toggle label becomes `Switch to Light mode`
- nothing is written to storage

### Exact example 2

Input:

```js
applyTheme("light", { persist: true });
```

Output:

- root theme becomes light
- meta content becomes light color
- `localStorage["personal-hugo-docs-theme"] = "light"`

## `initTheme()`

### Input

- existing `html[data-theme]`
- all `[data-theme-toggle]` buttons
- `prefers-color-scheme` media query

### Output

- initializes the visible theme
- wires click listeners
- wires system preference listener

### Exact flow

1. Read current root theme:
   - if `html[data-theme="dark"]` -> initial = `"dark"`
   - else initial = `"light"`
2. Call `applyTheme(initial)`
3. Add click listener to every toggle:
   - if current is dark -> next is light
   - else next is dark
   - call `applyTheme(next, { persist: true })`
4. Add media query `change` listener:
   - if no user-stored theme exists:
     - apply system theme
   - if stored theme exists:
     - do nothing

## Final theme rule

The module follows this order:

1. user-stored theme wins
2. otherwise system theme wins

And the visible state lives mainly in:

- `html[data-theme]`
- `localStorage["personal-hugo-docs-theme"]`
- `#theme-color-meta[content]`
