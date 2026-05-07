---
title: codelens init
description: Create a codelens.toml config file in the current directory to start customising your scan.
---

# codelens init

```bash
codelens init
```

Use `codelens init` to create a `codelens.toml` configuration file in the current directory. The generated file includes every supported section with inline comments, so you can edit it to match your project without consulting the full reference first.

## What it writes

```toml
[general]
languages = ["rust", "python"]
exclude   = ["target/**", "node_modules/**"]
follow_symlinks = false

[dimensions.maintainability]
enabled = true
weight  = 1.0

[rules.MAINT001-cyclomatic]
enabled   = true
threshold = 10

[rules.SEC001-hardcoded-secret]
enabled  = true
severity = "high"
```

See the [`codelens.toml` reference](/configuration/codelens-toml) for the full set of available options.

## Options

| Flag              | Type | Default | Description                                      |
| ----------------- | ---- | ------- | ------------------------------------------------ |
| `-v`, `--verbose` | flag | off     | Increase log verbosity (`-v` = INFO, `-vv` = DEBUG). |
| `-h`, `--help`    | flag |         | Print help.                                      |

:::caution
If `codelens.toml` already exists in the current directory, `codelens init` will not overwrite it. Delete or rename the existing file first, then re-run.
:::

## See also

- [codelens.toml reference](/configuration/codelens-toml)
- [Per-rule configuration](/configuration/per-rule-config)
