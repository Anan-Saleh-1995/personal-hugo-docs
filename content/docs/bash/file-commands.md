---
title: "File commands"
description: "Basic Bash file commands for listing, reading, and removing files."
summary: "Basic Bash file commands for listing, reading, and removing files."
draft: false
weight: 10
params:
  display_toc: true
---

Simple Bash commands for checking what is in a folder, reading file contents, and deleting files or folders.

## List files with `ls`

`ls` lists the files and folders in the current directory.

```bash
ls
```

You can also point it at a specific path:

```bash
ls some-folder
```

Use this when you want to quickly see what is inside a folder.

## Read file contents with `cat`

`cat` prints file contents to the terminal.

```bash
cat some-file.md
```

Use this when you want to quickly read a small file without opening an editor.

## Remove files with `rm`

`rm` removes files.

```bash
rm old-file.txt
```

Be careful: this deletes the file instead of moving it to a recycle bin.

## What `-f` means

`-f` means `force`.

```bash
rm -f old-file.txt
```

This tells `rm`:

- do not ask for confirmation
- do not complain if the file does not exist

Use it when you want `rm` to stay quiet and just try the deletion.

## What `-r` means

`-r` means `recursive`.

```bash
rm -r old-folder
```

This tells `rm` to remove a folder and everything inside it.

## What `-rf` means

`-rf` combines both flags:

- `-r` = recursive
- `-f` = force

```bash
rm -rf old-folder
```

This removes the folder and everything inside it without asking.

Use `rm -rf` carefully, because it can delete a lot very quickly.
