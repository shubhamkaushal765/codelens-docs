---
title: codelens.toml
description: Full reference for the codelens.toml configuration file.
---

# codelens.toml

`codelens.toml` lives at your project root and configures the analyzer registry, dimensions, and individual rules. The file is fully optional — every key has a sensible default — but a checked-in config is the recommended way to share consistent settings across a team and CI.

## Discovery order

The CLI loads exactly one config per run, in this order:

1. `--config <FILE>` — explicit path on the command line. Always wins.
2. Upward walk from the current working directory — the first `codelens.toml` found in `.`, the parent, the grandparent, and so on.
3. Built-in defaults — applied when no file is found.

## Reference

| Section                  | Key               | Type           | Default                              | Description                                                                                  |
| ------------------------ | ----------------- | -------------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| `[general]`              | `languages`       | array of string | all registered                      | Restrict analysis to these language IDs.                                                     |
| `[general]`              | `exclude`         | array of glob   | `["target/**", "node_modules/**"]`  | Globs to skip during the file walk. Combined with `.gitignore`.                              |
| `[general]`              | `follow_symlinks` | bool            | `false`                             | Follow symbolic links while walking.                                                         |
| `[dimensions.<dim>]`     | `enabled`         | bool            | `true`                              | Toggle a whole dimension (`maintainability`, `security`, `complexity`, `documentation`, `testsmell`). |
| `[dimensions.<dim>]`     | `weight`          | float           | `1.0`                               | Weight applied when aggregating per-dimension scores.                                        |
| `[rules.<rule_id>]`      | `enabled`         | bool            | `true`                              | Toggle a single rule on or off.                                                              |
| `[rules.<rule_id>]`      | `severity`        | string          | rule's default                      | Override severity. One of `info`, `low`, `medium`, `high`, `critical`.                       |
| `[rules.<rule_id>]`      | *(rule-specific)* | various         | per rule                            | Some rules accept extra knobs such as `threshold`. See [Per-rule configuration](/configuration/per-rule-config). |

Validation runs on load. Unknown keys, bad types, and out-of-range values produce errors that point at the offending TOML span.

## Example

```toml
# Restrict the run to Rust and Python sources, and skip vendored output.
[general]
languages = ["rust", "python"]
exclude   = ["target/**", "node_modules/**", "dist/**"]
follow_symlinks = false

# Keep maintainability findings, weighted normally.
[dimensions.maintainability]
enabled = true
weight  = 1.0

# Documentation findings still report, but contribute half as much to the score.
[dimensions.documentation]
enabled = true
weight  = 0.5

# Tighten cyclomatic complexity for this codebase.
[rules.MAINT001-cyclomatic]
enabled   = true
threshold = 8

# Treat hardcoded secrets as critical instead of the default high.
[rules.SEC001-hardcoded-secret]
enabled  = true
severity = "critical"

# We have a lot of legacy TODOs — silence the rule for now.
[rules.DOC002-todo-fixme]
enabled = false
```

:::tip
Run `codelens init` to drop a starter `codelens.toml` into the current directory. Edit from there rather than writing one from scratch.
:::

## See also

- [`codelens init`](/cli/init)
- [Per-rule configuration](/configuration/per-rule-config)
- [Baselines and fail-on](/configuration/baselines-and-fail-on)
