---
title: Terminal output
sidebar_label: Terminal
description: The default human-readable output format for codelens, grouped by dimension and severity with a per-dimension scoreboard.
---

# Terminal output

The terminal format is what `codelens` emits when you run it interactively. It is the default — no `--format` flag is required.

```bash
codelens analyze ./src
```

## Layout

Output is grouped by **dimension → severity → file**, with a closing scoreboard per dimension that summarises the score and finding counts.

| Section            | Contents                                                              |
| ------------------ | --------------------------------------------------------------------- |
| Per-dimension list | Findings ordered by severity (highest first), then by file path      |
| Scoreboard         | Final score (0–100) and finding counts per severity for that dimension |

A single finding line looks like this:

```text
MAINT001-cyclomatic [Medium]    src/lib.rs:12:1   Function 'parse_request' has cyclomatic complexity 14 (threshold: 10)
```

The columns are: `rule_id`, `severity`, `file:line:column`, `message`.

## Color

Color is on by default. The renderer auto-detects whether stdout is a TTY and disables ANSI escape codes when output is piped or redirected. To force-disable color regardless of context, pass `--no-color`.

```bash
codelens analyze ./src --no-color
codelens analyze ./src | tee report.txt   # color auto-disables
```

## Hyperlinks

Pass `--hyperlinks` to wrap file paths in OSC-8 escape sequences. In a supporting terminal, file paths become clickable and open in your editor (or your terminal's configured handler).

```bash
codelens analyze ./src --hyperlinks
```

| Terminal          | OSC-8 support |
| ----------------- | ------------- |
| iTerm2            | Yes           |
| WezTerm           | Yes           |
| Kitty             | Yes           |
| Windows Terminal  | Yes           |
| GNOME Terminal    | Yes           |
| macOS Terminal    | No            |

:::tip
For the OSC-8 specification and a broader list of compatible terminals, see [Hyperlinks in terminal emulators on Wikipedia](https://en.wikipedia.org/wiki/Hyperlink#Hyperlinks_in_terminal_emulators).
:::

## When to use other formats

| You want…                              | Use                                          |
| -------------------------------------- | -------------------------------------------- |
| Machine-readable output for CI tooling | [JSON](./json)                               |
| A PR comment                           | [Markdown](./markdown)                       |
| Code-scanning integration              | [SARIF](./sarif) (not yet implemented in v1) |
