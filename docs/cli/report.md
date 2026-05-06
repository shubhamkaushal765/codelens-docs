---
title: codelens report
description: Re-render a saved codelens JSON report in a different output format.
---

# codelens report

```
codelens report <INPUT> [OPTIONS]
```

Reads a saved JSON report and re-renders it in the chosen format. Use this to convert a stored `.json` file to Markdown, SARIF, or terminal output without re-running the analysis.

## Arguments

| Argument  | Description                                                       |
| --------- | ----------------------------------------------------------------- |
| `<INPUT>` | Path to a `codelens analyze --format json` output file. Required. |

## Flags

| Flag                | Type                                          | Default    | Description                                 |
| ------------------- | --------------------------------------------- | ---------- | ------------------------------------------- |
| `--format <FORMAT>` | `json` \| `terminal` \| `markdown` \| `sarif` | `terminal` | Target output format.                       |
| `--output <FILE>`   | path                                          | stdout     | Write output to `<FILE>` instead of stdout. |
| `-h`, `--help`      | flag                                          |            | Print help.                                 |

## Examples

Re-render a saved JSON report as Markdown:

```bash
codelens report report.json --format markdown
```

Convert JSON to SARIF for upload:

```bash
codelens report report.json --format sarif --output results.sarif
```

Post a historical report as a GitHub PR comment:

```bash
codelens report report.json --format markdown | gh pr comment --body-file -
```

## See also

- [`codelens analyze`](/cli/analyze)
- [Output formats](/output/terminal)
- [`codelens diff`](/cli/diff)
