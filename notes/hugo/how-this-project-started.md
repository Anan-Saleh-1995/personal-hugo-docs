---
title: How this project started
linkTitle: How this project started
description: "The first build log for this site: path, commands, tooling, and the exact steps used to bootstrap the Hugo project."
summary: "The first build log for this site: path, commands, tooling, and the exact steps used to bootstrap the Hugo project."
draft: false
weight: 10
---

This is the first subject on the site because it documents the beginning of the project itself.

Instead of searching from scratch or asking again later, this page records the exact workflow used to start the Hugo project and the local tooling around it.

## Goal

The site was started with these rules:

- Hugo first
- custom layouts, not a downloaded docs theme
- shared footer
- docs start at `/docs`
- docs shell on `/docs/*`
- filesystem plus front matter as the source of truth for the docs sidebar
- local quality tooling before deeper styling work

## Project location

The project was created here:

```text
C:\path\to\personal-hugo-docs
```

That location matters because the site was intentionally created in a fresh folder outside the original markdown notes repo.

## Step 1: create the Hugo site

Command used:

```powershell
hugo new site "C:\path\to\personal-hugo-docs" --format yaml
```

What it did:

- created a fresh Hugo project
- generated the standard Hugo folders like `content`, `layouts`, `assets`, `static`, `archetypes`, and `data`
- created `hugo.yaml` instead of TOML

## Step 2: initialize Git

Command used:

```powershell
git init -b main
```

What it did:

- initialized a Git repository
- created the default branch as `main`

## Step 3: create the npm package metadata

Command used:

```powershell
npm.cmd init -y
```

What it did:

- created `package.json`
- made room for local scripts, linting, formatting, and hook tooling

Why `npm.cmd` was used instead of `npm`:

- in this PowerShell environment, `npm.ps1` was blocked by execution policy
- `npm.cmd` avoids that issue on Windows

## Step 4: install the repo tooling

Command used:

```powershell
npm.cmd install -D prettier prettier-plugin-go-template markdownlint-cli2 stylelint stylelint-config-standard-scss husky lint-staged @commitlint/cli @commitlint/config-conventional
```

What it did:

- installed formatting, markdown linting, SCSS linting, Git hooks, staged-file checks, and Conventional Commit validation

## Step 5: prepare Husky

Command used:

```powershell
npm.cmd run prepare
```

What it did:

- created Husky internals inside `.husky/_`
- configured Git to use Husky's hook dispatch path

After that, the real hook files were added:

- `.husky/pre-commit`
- `.husky/commit-msg`

## Step 6: install the real Dart Sass runtime

Important detail:

The npm `sass` package is not the same thing as the Dart Sass binary Hugo expects to find when using the Dart Sass transpiler.

The actual runtime was installed separately under the user profile and added to the user `Path`.

## Step 7: create the project rules and config

The early repo files added here do a lot of the quiet work:

- `.gitignore`
- `.editorconfig`
- `.nvmrc`
- `.prettierignore`
- `.prettierrc.yaml`
- `.markdownlint.jsonc`
- `stylelint.config.mjs`
- `commitlint.config.cjs`

## Step 8: define the npm scripts

The project scripts were set up around the real workflow:

```json
{
  "dev": "hugo server -D --disableFastRender",
  "build": "hugo build",
  "format": "prettier --write \"**/*.{html,js,json,md,mjs,scss,yaml,yml}\"",
  "format:check": "prettier --check \"**/*.{html,js,json,md,mjs,scss,yaml,yml}\"",
  "lint:md": "markdownlint-cli2 \"**/*.md\" \"#node_modules\" \"#public\" \"#resources\"",
  "lint:css": "stylelint \"assets/**/*.scss\"",
  "lint": "npm run lint:md && npm run lint:css",
  "validate": "npm run format:check && npm run lint && npm run build",
  "prepare": "husky"
}
```

## Step 9: build the Hugo shell

After the tooling layer, the site shell was built in parts:

- base template
- shared head partial
- shared header and footer
- docs sidebar partial
- page TOC partial
- heading render hook
- code block render hook
- tiny JavaScript bundle for the mobile docs drawer, copy buttons, and TOC active state
- Sass structure split into tokens, base, layouts, and components

## Commands to remember first

Start the dev server with drafts:

```powershell
npm.cmd run dev
```

Run the full validation flow:

```powershell
npm.cmd run validate
```

Build the production site:

```powershell
npm.cmd run build
```

## Why this page exists

This page exists so the project can document its own origin.

If the site changes later, this page should still answer:

- where it started
- which commands were used
- which tools were installed
- why the structure looks the way it does
