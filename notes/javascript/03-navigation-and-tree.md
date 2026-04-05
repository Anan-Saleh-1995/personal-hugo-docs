<!-- markdownlint-disable-file MD024 -->

# 03 Navigation And Tree

This file explains:

- `assets/js/site/nav.mjs`
- `assets/js/site/tree.mjs`

These modules are separate because they solve different problems.

- `nav.mjs` controls the drawer and sidebar scroll memory
- `tree.mjs` controls expand/collapse of sidebar branches

## Nav module state

Private module variables:

```js
let drawerMode = null;
let overlay = null;
let mainArea = null;
let sidebarNav = null;
let toggleButtons = [];
let persistScrollFrame = 0;
```

### Meaning

- `drawerMode`: media query object for compact drawer mode
- `overlay`: backdrop element
- `mainArea`: `.docs-main-area`
- `sidebarNav`: scrollable nav area
- `toggleButtons`: all menu buttons
- `persistScrollFrame`: pending animation frame id for scroll-save throttling

## `persistSidebarScroll()`

### Input

- reads `sidebarNav.scrollTop`

### Output

- writes to session storage

### Exact example

Input:

- `sidebarNav.scrollTop = 642`

Output:

```txt
sessionStorage["personal-hugo-docs-sidebar-scroll"] = "642"
```

## `schedulePersistSidebarScroll()`

### Input

- many sidebar `scroll` events

### Output

- schedules one frame-based save

### Why

If the user drags the scroll thumb, the browser can fire many `scroll` events.

Instead of writing storage on every event, the code:

1. cancels any previous pending frame
2. schedules one `requestAnimationFrame`
3. writes once inside that frame

## `restoreSidebarScroll()`

### Input

- reads `sessionStorage["personal-hugo-docs-sidebar-scroll"]`

### Output

- sets `sidebarNav.scrollTop`

### Exact example

Input:

- stored value = `"642"`

Output:

- `sidebarNav.scrollTop = 642`

If stored value is missing or invalid:

- return early
- change nothing

## `updateToggleState(open)`

### Input

- `open = true` or `false`

### Output

- all nav toggle buttons are updated

### Exact example

Input:

```js
updateToggleState(true);
```

Output for each menu button:

- `aria-expanded="true"`
- `aria-label="Close navigation"`

Input:

```js
updateToggleState(false);
```

Output:

- `aria-expanded="false"`
- `aria-label="Open navigation"`

## `setMainAreaInert(open)`

### Input

- boolean

### Output

- `.docs-main-area.inert = open`

### Exact example

Input:

- compact drawer opens

Output:

- main area becomes inert
- focus/click should stay out of it

## `setNavOpen(open)`

### Input

- requested open state

### Internal logic

```js
const nextState = Boolean(drawerMode?.matches && open);
```

That means:

- nav only truly opens when drawer mode is active

### Output

- toggles `body.nav-open`
- updates menu button labels
- shows/hides overlay
- sets/removes `inert`

### Exact example 1

Input:

- desktop viewport
- `setNavOpen(true)`

Output:

- `drawerMode.matches === false`
- final state is still closed

### Exact example 2

Input:

- compact viewport
- `setNavOpen(true)`

Output:

- `body.classList.add("nav-open")`
- overlay becomes visible
- menu buttons switch to "close navigation"
- main area becomes inert

## `closeNav()`

Simple wrapper:

```js
setNavOpen(false);
```

## `initNav()`

### Input

- sidebar root
- close button
- overlay
- main area
- nav scroll area
- all nav toggle buttons
- drawer media query

### Output

- initializes nav behavior
- restores saved sidebar scroll
- attaches listeners

### Exact event wiring

1. Menu buttons:
   - click -> toggle drawer open/closed
2. Close button:
   - click -> close
3. Overlay:
   - click -> close
4. Sidebar delegated click:
   - if a link is clicked:
     - save current scroll position
     - on compact, close drawer
5. Sidebar scroll:
   - scroll -> schedule scroll persistence
6. Media query change:
   - if leaving drawer mode, close drawer
7. Document `Escape`:
   - close drawer

## Tree module

File:

- `assets/js/site/tree.mjs`

This module does not care about drawer state.
It only cares about the nested docs tree.

## `setTreeOpen(toggleButton, open)`

### Input

- one branch toggle button
- boolean open state

### Output

- writes:
  - `aria-expanded`
  - branch `hidden`
  - `.is-expanded` on item

### Exact example

Input:

- toggle controls `#docs-tree-abc123`
- `open = false`

Output:

- button becomes `aria-expanded="false"`
- branch gets `hidden`
- item loses `.is-expanded`

Input:

- same toggle
- `open = true`

Output:

- button becomes `aria-expanded="true"`
- branch becomes visible
- item gets `.is-expanded`

## `initTree()`

### Input

- sidebar root

### Output

- one delegated click listener on the sidebar

### Exact event flow

1. User clicks inside sidebar
2. Handler checks:
   - is target an `Element`?
   - does it or an ancestor match `[data-tree-toggle]`?
3. If no:
   - stop
4. If yes:
   - read current `aria-expanded`
   - flip it
   - call `setTreeOpen`

### Why delegation is used

Input:

- 1 branch toggle
- or 100 branch toggles

Output:

- still only one listener on the sidebar root

That is cleaner than attaching one listener per toggle button.

## Real separation of responsibility

If something breaks:

- drawer open/close -> `nav.mjs`
- scroll memory -> `nav.mjs`
- branch expand/collapse -> `tree.mjs`

That separation is intentional.
