# JavaScript Notes

These notes explain the site JavaScript in smaller pieces instead of one large file.

Read them in this order:

1. [`01-entry-and-shared.md`](./01-entry-and-shared.md)
2. [`02-theme.md`](./02-theme.md)
3. [`03-navigation-and-tree.md`](./03-navigation-and-tree.md)
4. [`04-search.md`](./04-search.md)
5. [`05-copy-code-and-toc.md`](./05-copy-code-and-toc.md)
6. [`06-runtime-and-debugging.md`](./06-runtime-and-debugging.md)

This folder is meant to answer:

- what starts first
- what each module reads
- what each module writes
- what storage keys are touched
- what DOM classes and attributes change
- what event wakes the code up
- what exact input leads to what exact output

Main JS files:

- `assets/js/site.mjs`
- `assets/js/site/constants.mjs`
- `assets/js/site/utils.mjs`
- `assets/js/site/theme.mjs`
- `assets/js/site/nav.mjs`
- `assets/js/site/tree.mjs`
- `assets/js/site/search.mjs`
- `assets/js/site/copy-code.mjs`
- `assets/js/site/toc.mjs`
