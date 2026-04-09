---
title: "Reset Node dependencies"
description: "Remove node_modules and package-lock.json, then install again from scratch."
summary: "Remove node_modules and package-lock.json, then install again from scratch."
draft: false
weight: 10
params:
  display_toc: true
---

Use this when you want to remove installed packages and the lockfile, then install again from scratch.

## CMD

Use this for Windows Command Prompt.

```cmd
rmdir /s /q node_modules
del package-lock.json
npm install
```

## PowerShell

Use this for Windows PowerShell.

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## Bash

Use this for Bash on Linux, macOS, Git Bash, and WSL.

```bash
rm -rf node_modules
rm package-lock.json
npm install
```
