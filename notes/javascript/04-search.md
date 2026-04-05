<!-- markdownlint-disable-file MD024 MD029 -->

# 04 Search Module

This file explains:

- `assets/js/site/search.mjs`

This module owns:

- search dialog open/close
- keyboard shortcuts
- Pagefind loading
- query debounce
- result rendering
- focus return after close

## Module state

```js
let pagefindModulePromise = null;
let searchDebounceId = 0;
let searchRequestId = 0;
let searchReturnFocus = null;
```

### Meaning

- `pagefindModulePromise`: cached dynamic import promise
- `searchDebounceId`: timer id for delayed search
- `searchRequestId`: number used to discard stale async results
- `searchReturnFocus`: element to focus after dialog closes

## `renderSearchMessage(resultsContainer, message, className)`

### Input

- results container
- message text
- optional class name

### Output

- container HTML becomes:

```html
<p class="search-dialog__status">Message here</p>
```

### Exact example

Input:

- message = `"Searching..."`

Output:

- results area shows:
  - `Searching...`

## `resetSearchResults(resultsContainer, emptyState)`

### Input

- results container
- empty state node

### Output

- clears previous results
- appends the empty state node

### Exact example

Input:

- query becomes empty

Output:

- old results removed
- idle message reappears

## `loadPagefind()`

### Input

- no direct argument

### Output

- returns:
  - Pagefind module promise
  - or `null` if loading fails

### Exact flow

First call:

1. import `"/pagefind/pagefind.js"`
2. if module has `.options`, call:

```js
module.options({ excerptLength: 18 });
```

3. cache the promise
4. return it

Later calls:

- return the same cached promise

So Pagefind loads lazily once.

## `renderSearchResults(resultsContainer, hits)`

### Input

- results container
- normalized result objects:

```js
{
  (title, url, excerpt);
}
```

### Output

- builds clickable result cards with:
  - title
  - URL
  - excerpt

### Exact example

Input:

```js
[
  {
    title: "Connect a local project to an existing GitHub repo with SSH",
    url: "/docs/git/connect-local-project-to-existing-github-repo-with-ssh/",
    excerpt: "Use this when the GitHub repo already exists...",
  },
];
```

Output:

- one `<a class="search-result">...</a>` card rendered into the results container

## `performSearch(term, resultsContainer, emptyState)`

This is the main search worker.

### Input

- raw search string
- results container
- empty state node

### Output

- one of:
  - idle state
  - loading state
  - unavailable message
  - no-results message
  - rendered result cards

### Exact branch flow

#### Case 1: empty input

Input:

```js
term = "   ";
```

Output:

- `queryText = ""`
- call `resetSearchResults(...)`
- stop

#### Case 2: Pagefind unavailable

Input:

```js
term = "git";
```

Output:

1. render `Searching...`
2. try to load Pagefind
3. if import fails:
   - render `Search index is unavailable until the site is built.`

#### Case 3: results found

Input:

```js
term = "git";
```

Output flow:

1. trim term to `"git"`
2. increment request id
3. render `Searching...`
4. run `pagefind.search("git")`
5. slice results to `SEARCH_RESULT_LIMIT`
6. normalize each result to:
   - `title`
   - `url`
   - `excerpt`
7. render result cards

#### Case 4: stale async result

Example:

1. user types `g`
2. request 1 starts
3. user types `git`
4. request 2 starts
5. request 1 finishes late

Output:

- request 1 sees:

```js
requestId !== searchRequestId;
```

- request 1 exits
- old results do not overwrite newer results

## `initSearch()`

### Input

- dialog
- input
- results container
- empty state node
- open buttons
- close buttons

### Output

- wires full search behavior

## Internal helper: `openSearch(invoker)`

### Input

- the element that triggered search

### Output

- close compact nav if open
- store return-focus element
- open native dialog
- add `body.search-open`
- focus input

## Internal helper: `closeSearch()`

### Input

- none

### Output

- closes dialog if open

## Event flow

1. Open buttons:
   - click -> open dialog
2. Close buttons:
   - click -> close dialog
3. Dialog close event:
   - remove `body.search-open`
   - focus previous element if possible
4. Click directly on dialog backdrop:
   - close dialog
5. Search input:
   - clear previous debounce timer
   - after 120 ms run `performSearch`
6. Search results click:
   - if a result link is clicked, close dialog
7. Global keydown:
   - `Ctrl+K` or `Cmd+K` -> open dialog
   - `/` -> open dialog only if target is not editable

## Exact shortcut example

Input:

- focus is on page body
- user presses `/`

Output:

- `isEditableTarget(event.target) === false`
- dialog opens

Input:

- focus is inside `<input>`
- user presses `/`

Output:

- `isEditableTarget(event.target) === true`
- dialog does not open

## Main state this module changes

- `dialog.open`
- `body.search-open`
- result container HTML
- `searchReturnFocus`
- `searchDebounceId`
- `searchRequestId`
