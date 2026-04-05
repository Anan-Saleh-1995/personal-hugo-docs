# Hugo Learning Map

This is the private practice map for the `personal-hugo-docs` project.

It is not public site content.

Use it when you want to remember how Hugo works in this project without searching again.

## 1. What Hugo is doing here

Hugo is the static site generator that builds:

- the docs section at `/docs/*`
- the templates, content structure, and navigation shell of the site

This project is intentionally Hugo-first:

- no downloaded docs theme
- no wrapper docs framework
- no frontend framework for the shell

The goal is to learn Hugo directly through `content`, `layouts`, `assets`, render hooks, and Hugo Pipes.

## 2. Windows prerequisites

This project depends on:

- Git
- Hugo
- Node.js
- npm
- Dart Sass

Why each one matters:

- Git: version control and Husky hooks
- Hugo: the site generator
- Node and npm: formatter, linter, and hook tooling
- Dart Sass: the real Sass compiler Hugo uses for this project's SCSS pipeline

## 3. Important correction

There is no `hugo new project` command.

The correct site creation command is:

```powershell
hugo new site <path> --format yaml
```

If you remember only one correction from this file, remember that one.

## 4. The exact start sequence used on this project

Create the site:

```powershell
hugo new site "C:\path\to\personal-hugo-docs" --format yaml
```

Initialize Git:

```powershell
git init -b main
```

Create the package metadata:

```powershell
npm.cmd init -y
```

Install the repo tooling:

```powershell
npm.cmd install -D prettier prettier-plugin-go-template markdownlint-cli2 stylelint stylelint-config-standard-scss husky lint-staged @commitlint/cli @commitlint/config-conventional
```

Prepare Husky:

```powershell
npm.cmd run prepare
```

## 5. Basic Hugo command map

### `hugo version`

What it does:

- prints the installed Hugo version and build information

When to use it:

- right after install
- when debugging environment differences

Side effect:

- no repo files change

### `hugo help`

What it does:

- lists Hugo commands and help text

When to use it:

- when you forget a command or flag

Side effect:

- no repo files change

### `hugo new site <path> --format yaml`

What it does:

- creates a fresh Hugo project scaffold

When to use it:

- once, at project bootstrap

Side effect:

- creates the site folders and config file

### `hugo new content <section>/<name>.md`

What it does:

- creates a new content file using the archetype

When to use it:

- when adding a new docs page

Side effect:

- writes a markdown file under `content/`

### `hugo server -D`

What it does:

- starts the dev server
- includes draft content

When to use it:

- during local development

Side effect:

- may write generated resources locally

### `hugo build`

What it does:

- builds the production site

When to use it:

- before shipping or validating changes

Side effect:

- writes output to `public/`
- may update `resources/`

### `hugo config`

What it does:

- prints the effective Hugo configuration

When to use it:

- when debugging params, menus, and markup settings

Side effect:

- no repo files change

### `hugo env`

What it does:

- prints Hugo environment details

When to use it:

- when checking the local Hugo runtime

Side effect:

- no repo files change

### `hugo list`

What it is:

- a command family, not one single catch-all command

Useful examples:

```powershell
hugo list all
hugo list drafts
hugo list future
hugo list expired
```

What it does:

- lists content by status

When to use it:

- when checking drafts and content state

Side effect:

- no repo files change

## 6. Project anatomy

### `content/`

Public site content lives here.

This project uses:

- `content/docs/` for docs content

### `layouts/`

This is where Hugo templates live.

This project uses it for:

- the base template
- the root redirect template
- the docs templates
- partials
- render hooks

### `assets/`

This is where processed assets live before build output.

This project uses:

- `assets/scss/` for Sass
- `assets/js/` for the tiny JavaScript bundle

### `static/`

Files here are copied to the built site as-is.

### `archetypes/`

This controls the default front matter for new content.

### `data/`

This is for structured data files Hugo can read.

This project does not rely on it yet.

### `public/`

This is generated output after a build.

Do not hand-edit it.

### `resources/`

This is where Hugo stores processed resources.

## 7. Core Hugo concepts used here

### Sections

Sections are folder-based content groups.

Examples here:

- `content/docs/`
- `content/docs/hugo/`

### Front matter

Front matter controls:

- title
- description
- summary
- weight
- draft status

### Weights

Weights control sidebar ordering.

Lower weight comes earlier.

### Partials

Partials are reusable template pieces.

Examples here:

- header
- footer
- docs sidebar
- page TOC

### Base template and blocks

The base template defines the outer shell.

Page templates fill the `main` block inside it.

### Render hooks

Render hooks let markdown output be customized.

This project uses them for:

- heading anchor links
- code block wrappers and copy buttons

### Shortcodes

Shortcodes are reusable content components called from markdown.

This project does not need them yet.

### Hugo Pipes

Hugo Pipes processes assets.

This project uses it for:

- SCSS compilation
- asset minification
- JS build output
- fingerprinting in production

## 8. The repo workflow used here

The working loop is:

1. edit content, templates, or SCSS
2. run the dev server
3. run validation
4. stage related files together
5. commit with a Conventional Commit message

Useful commands:

```powershell
npm.cmd run dev
npm.cmd run validate
git status --short
```

## 9. Repeatable practice exercises

### Exercise 1: create a new docs page

1. Run:

   ```powershell
   hugo new content docs/hugo/my-test-page.md
   ```

2. Fill in the front matter.
3. Add a few `##` headings.
4. Run `npm.cmd run dev`.
5. Confirm the page appears in the sidebar and TOC.

### Exercise 2: change sidebar order

1. Change page weights.
2. Refresh the site.
3. Confirm the sidebar changes without editing a separate nav file.

### Exercise 3: test code block rendering

1. Add a fenced code block to a docs page.
2. Refresh the site.
3. Confirm the custom wrapper and copy button appear.

## 10. Troubleshooting notes

### PowerShell blocks `npm`

Use:

```powershell
npm.cmd
```

### Hugo cannot compile SCSS

Check:

- Dart Sass is installed
- Dart Sass is on `Path`
- Hugo is picking up the Dart Sass transpiler

### Git hooks do not run

Check:

- the repo exists
- `npm.cmd run prepare` was run
- `git config --get core.hooksPath` returns `.husky/_`
- `.husky/pre-commit` and `.husky/commit-msg` exist

## 11. What to remember when practicing later

Keep this order in your head:

1. Hugo site
2. Git
3. npm tooling
4. Husky
5. Dart Sass
6. templates
7. content
8. validation

That order keeps the project stable while it grows.
