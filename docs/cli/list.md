---
title: codelens list
description: List the languages and rules codelens supports, and look up rule documentation by ID.
---

# codelens list

```bash
codelens list languages
codelens list analyzers [--explain <RULE_ID>]
```

Use `codelens list` to discover what languages codelens recognises and what rules are available. This is how you find a rule ID to disable or configure in `codelens.toml`.

## When to use this

- Check which file types will be included in a scan.
- Browse all available rules and their default severities.
- Look up what a specific rule checks before enabling or disabling it.

## codelens list languages

Prints a table of supported languages and the file extensions codelens scans for each.

```bash
codelens list languages
```

Example output:

```text
ID          Extensions
rust        rs
python      py
javascript  js, jsx, ts, tsx, mjs, cjs
go          go
```

:::note
`go` appears in the registry but is not yet fully supported. JavaScript and TypeScript are fully supported. See [language support](/getting-started/install#language-support) for the current support matrix.
:::

## codelens list analyzers

Prints every available rule with its rule ID, dimension, default severity, and supported languages. Use this to see what runs by default and to find the exact rule ID you need for configuration.

```bash
codelens list analyzers
```

### `--explain <RULE_ID>`

Prints the full documentation for a single rule. Use this to understand what a rule checks and why, without leaving the terminal.

```bash
codelens list analyzers --explain MAINT001-cyclomatic
```

## Options

| Flag                  | Type   | Default | Description                                             |
| --------------------- | ------ | ------- | ------------------------------------------------------- |
| `--explain <RULE_ID>` | string | unset   | Print documentation for the given rule ID and exit.     |
| `-v`, `--verbose`     | flag   | off     | Increase log verbosity. `-v` = INFO, `-vv` = DEBUG.    |
| `-h`, `--help`        | flag   |         | Print help.                                             |

## See also

- [Rules reference](/rules)
- [Analyzers and findings](/concepts/analyzers-and-findings)
