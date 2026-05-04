---
title: codelens analyze
description: Reference for the codelens analyze subcommand — flags, examples, and exit codes.
---

# codelens analyze

```
codelens analyze <PATH> [OPTIONS]
```

Walks `<PATH>` (a file or directory), parses each supported source file, runs every enabled analyzer, and emits findings in the chosen format. The walk respects `.gitignore` by default, skips vendor directories, does not follow symlinks, and parses files in parallel via `rayon`.

## Arguments

| Argument | Description                                  |
| -------- | -------------------------------------------- |
| `<PATH>` | Root path to analyse — file or directory. Required. |

## Flags

| Flag                    | Type                                              | Default    | Description                                                                                  |
| ----------------------- | ------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| `--dimensions <LIST>`   | comma-separated string                            | all        | Restrict to these dimensions (e.g. `security,maintainability`).                              |
| `--languages <LIST>`    | comma-separated string                            | all        | Restrict to these language IDs (e.g. `rust,python`).                                         |
| `--format <FORMAT>`     | `json` \| `terminal` \| `markdown` \| `sarif`     | `terminal` | Output format. `sarif` is not implemented in v1.                                             |
| `--output <FILE>`       | path                                              | stdout     | Write rendered output to `<FILE>` instead of stdout.                                         |
| `--config <FILE>`       | path                                              | auto       | Path to a `codelens.toml`. Overrides upward auto-discovery from the current working directory. |
| `--fail-on <LEVEL>`     | `info` \| `low` \| `medium` \| `high` \| `critical` | unset      | Exit with code 1 if any finding has severity at or above `<LEVEL>`.                          |
| `--baseline <FILE>`     | path                                              | unset      | Suppress findings already present in this baseline JSON file.                                |
| `--no-color`            | flag                                              | off        | Disable ANSI colour in terminal output.                                                      |
| `--hyperlinks`          | flag                                              | off        | Emit OSC-8 hyperlinks for file paths in terminal output.                                     |
| `-v`, `--verbose`       | flag (repeatable)                                 | off        | Increase log verbosity. `-v` enables INFO, `-vv` enables DEBUG.                              |
| `-h`, `--help`          | flag                                              |            | Print help.                                                                                  |
| `-V`, `--version`       | flag                                              |            | Print version.                                                                               |

## Examples

Basic terminal run on the current directory:

```bash
codelens analyze .
```

Render JSON to a file:

```bash
codelens analyze ./src --format json --output report.json
```

Fail CI on any high-severity finding:

```bash
codelens analyze . --fail-on high
```

Use an explicit config and restrict to maintainability rules:

```bash
codelens analyze . --config ./codelens.toml --dimensions maintainability
```

Suppress pre-existing findings via a baseline:

```bash
codelens analyze . --baseline baseline.json --fail-on medium
```

## Exit codes

| Code | Meaning                                                                                  |
| ---- | ---------------------------------------------------------------------------------------- |
| `0`  | Output rendered. No finding met or exceeded the `--fail-on` threshold (or the flag was unset). |
| `1`  | At least one finding met or exceeded the `--fail-on` threshold.                          |
| `2`  | Configuration or argument error (invalid flag value, malformed `codelens.toml`, missing path). |

:::note
The `--fail-on` flag has no default. If you omit it, `codelens analyze` exits `0` regardless of how many findings it reports — the command is informational unless you opt in to a gate.
:::

## See also

- [codelens.toml reference](/configuration/codelens-toml)
- [Baselines and fail-on workflows](/configuration/baselines-and-fail-on)
- [Output formats](/output/terminal)
