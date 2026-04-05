<!-- markdownlint-disable-file MD024 MD029 -->

# 05 Copy Code And TOC

This file explains:

- `assets/js/site/copy-code.mjs`
- `assets/js/site/toc.mjs`

## Copy-code module

This module owns:

- copy button behavior for fenced code blocks

## `setCopyButtonText(button, text)`

### Input

- button element
- next visible text

### Output

- `button.textContent = text`

### Exact example

Input:

- current button label = `Copy`
- new text = `Copied`

Output:

- visible label becomes `Copied`

## `initCopyCode()`

### Input

- any document click

### Output

- if click came from a copy button:
  - reads code text
  - writes to clipboard
  - changes button label

### Exact event flow

1. Document click occurs
2. Check:
   - is target an `HTMLElement`?
   - does it or an ancestor match `[data-copy-code]`?
3. If not:
   - return
4. Find closest `[data-code-block]`
5. Inside that block, find:

```css
pre code, pre
```

6. Read default label from:
   - `copyButton.dataset.copyLabel`
   - or fallback `Copy`
7. Try:

```js
navigator.clipboard.writeText(codeTarget.textContent ?? "");
```

8. On success:
   - label becomes `Copied`
   - after 1200 ms label becomes default again
9. On failure:
   - label becomes `Failed`
   - after 1200 ms label becomes default again

### Exact example

Input:

- code text:

```txt
git push -u origin main
```

- user clicks copy

Output on success:

1. clipboard receives:

```txt
git push -u origin main
```

2. button label changes:
   - `Copy`
   - `Copied`
   - back to `Copy`

## TOC module

This module owns:

- active heading tracking
- desktop TOC highlight
- mobile TOC current heading label
- closing mobile TOC after selection

## `getHeadingLabel(heading)`

### Input

- heading element

### Output

- heading text without trailing `#`

### Exact example

Input:

```txt
Goal #
```

Output:

```txt
Goal
```

## `initToc()`

### Input

- headings:
  - `[data-docs-article] :is(h2[id], h3[id])`
- TOC links:
  - `[data-toc] a[href^="#"]`
- mobile TOC wrapper
- mobile TOC panel
- mobile current heading node
- topbar

### Output

- keeps the active TOC link in sync with scroll
- updates mobile current heading label
- closes mobile TOC when needed

### Early exit rule

If there are:

- no headings
- or no TOC links

Output:

- return early
- do nothing

## Internal helper: `setActiveLink(id)`

### Input

- heading id

### Output

- updates every TOC link:
  - add/remove `.is-active`
  - add/remove `aria-current="true"`
- updates mobile current heading label

### Exact example

Input:

```js
setActiveLink("project-location");
```

Output:

- link `href="#project-location"`:
  - gets `.is-active`
  - gets `aria-current="true"`
- all other links lose active state
- mobile current heading text becomes `Project location`

## Internal helper: `updateActiveHeading()`

### Input

- current page scroll
- heading DOM positions
- topbar height
- mobile TOC summary height
- page height

### Output

- decides which heading should be active

### Exact calculation

1. read topbar height
2. read mobile TOC summary height
3. compute:

```js
activationOffset = topbarHeight + mobileTocHeight + 24;
```

That means the active line is not the top of the viewport.
It is a line below sticky UI.

### End-of-page special rule

Input:

- user reaches page bottom

Output:

- last heading becomes active

This avoids the common bug where the second-to-last heading stays highlighted at the end.

### Normal rule

Input:

- current scroll position

Output:

- choose the last heading whose top is less than or equal to `activationOffset`

### Exact example

Headings:

- `Goal` top = `-20`
- `Project location` top = `100`
- `Step 1` top = `380`

Activation offset:

- `120`

Output:

- active heading = `Project location`

because:

- `-20 <= 120`
- `100 <= 120`
- `380 > 120`

## Scroll throttling

The module uses `requestAnimationFrame`.

### Input

- many scroll events

### Output

- only one update per frame

This reduces repeated DOM reads.

## TOC event flow

1. On init:
   - run one active-heading calculation immediately
2. On window scroll:
   - schedule an update
3. On window resize:
   - schedule an update
4. On mobile TOC panel click:
   - if a hash link is clicked, close the details panel
5. On document `Escape`:
   - if mobile TOC is open, close it
