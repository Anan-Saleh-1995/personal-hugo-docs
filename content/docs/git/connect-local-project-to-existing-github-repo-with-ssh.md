---
title: Connect a local project to an existing GitHub repo with SSH
linkTitle: Connect local project to GitHub with SSH
description: "The straight path for connecting a local project to an already created GitHub repository over SSH."
summary: "The straight path for connecting a local project to an already created GitHub repository over SSH."
draft: false
weight: 10
---

Use this when the GitHub repo already exists and the local project needs to connect to it with SSH.

## Check current remotes

```powershell
git remote -v
```

## Add the existing GitHub repo as origin

```powershell
git remote add origin git@github.com:YOUR-USERNAME/personal-hugo-docs.git
```

## Rename branch to main

```powershell
git branch -M main
```

## First push upstream

```powershell
git push -u origin main
```
