---
title: codelens list
description: Reference for codelens list languages and codelens list analyzers.
---

# codelens list

Two subcommands that introspect the registry built into the binary. Use them to discover what `codelens` recognises and to read rule documentation without leaving the terminal.

```bash
codelens list languages
codelens list analyzers [--explain <RULE_ID>]
```

## codelens list languages

Prints a table of registered language frontends and the file extensions each one claims. Useful for confirming which files a run will pick up.

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
`go` appears in the registry but its `parse` implementation returns `Unsupported`. JavaScript/TypeScript is fully supported. See [language support](/getting-started/install#language-support) for the current support matrix.
:::

## codelens list analyzers

Prints a table of every registered analyzer along with its `rule_id`, dimension, default severity, and supported languages. Use this to see what runs by default and to look up rule IDs for configuration.

```bash
codelens list analyzers
```

### `--explain <RULE_ID>`

Prints the documentation page for a single rule to stdout. The output mirrors the rendered Markdown content of the rule's page in this site.

```bash
codelens list analyzers --explain MAINT001-cyclomatic
```

| Flag                  | Type   | Default | Description                                             |
| --------------------- | ------ | ------- | ------------------------------------------------------- |
| `--explain <RULE_ID>` | string | unset   | Print the documentation for the given rule ID and exit. |
| `-v`, `--verbose`     | flag   | off     | Increase log verbosity. `-v` enables INFO, `-vv` DEBUG. |
| `-h`, `--help`        | flag   |         | Print help.                                             |

## See also

- [Rules reference](/rules)
- [Analyzers and findings](/concepts/analyzers-and-findings)
