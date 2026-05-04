---
title: codelens init
description: Reference for codelens init — writes a default codelens.toml to the current directory.
---

# codelens init

```bash
codelens init
```

Writes a default `codelens.toml` to the current directory. The file is a fully-commented starting point you can edit in place, with every section the configuration loader recognises.

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

See the [`codelens.toml` reference](/configuration/codelens-toml) for the full set of recognised keys.

## Flags

| Flag              | Type | Default | Description                                      |
| ----------------- | ---- | ------- | ------------------------------------------------ |
| `-v`, `--verbose` | flag | off     | Increase log verbosity (`-v` INFO, `-vv` DEBUG). |
| `-h`, `--help`    | flag |         | Print help.                                      |

:::caution
If `codelens.toml` already exists in the current directory, `codelens init` refuses to overwrite it. Delete or rename the existing file first, then re-run.
:::

## See also

- [codelens.toml reference](/configuration/codelens-toml)
- [Per-rule configuration](/configuration/per-rule-config)
