---
title: Baselines and fail-on
description: Two CI workflows — gate pull requests on severity with --fail-on, and adopt codelens on legacy code with --baseline.
---

# Baselines and fail-on

`codelens analyze` ships two flags for CI integration. Use them together: `--fail-on` gates new findings, `--baseline` ignores old ones.

## `--fail-on`

Use `--fail-on` to make CI fail when findings reach a severity threshold. Without it, `codelens analyze` always exits `0` after rendering output — useful for informational runs, but not for blocking merges.

| Value      | Fails on                    |
| ---------- | --------------------------- |
| `info`     | Any finding (info or above) |
| `low`      | Low or above                |
| `medium`   | Medium or above             |
| `high`     | High or above               |
| `critical` | Critical findings only      |

Default: unset — no threshold, exit `0` always.

### GitHub Actions example

```yaml
name: codelens

on: [pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    steps:
      - uses: actions/checkout@v4
      - uses: shubhamkaushal765/codelens@main
        with:
          path: "."
          fail-on: "high"
```

See [GitHub Action](/integrations/github-action) for the full input reference.

## `--baseline`

Use `--baseline` to adopt codelens on a codebase that already has issues you do not plan to fix immediately. The baseline file records every finding from a known-good run; on subsequent runs, findings present in the baseline are suppressed, so only **new** findings reach the formatter and `--fail-on`.

### Capturing a baseline

Use `codelens baseline save` to capture the current findings as a baseline file:

```bash
codelens baseline save -o codelens-baseline.json
```

You can also capture a baseline from a historical git ref:

```bash
codelens baseline save --ref v1.0.0 -o baseline-v1.0.0.json
```

See [`codelens baseline`](/cli/baseline) for the full reference.

### Workflow

1. Capture today's findings:

   ```bash
   codelens baseline save -o codelens-baseline.json
   ```

2. Commit the baseline:

   ```bash
   git add codelens-baseline.json
   git commit -m "chore: codelens baseline"
   ```

3. From now on, run with the baseline applied:

   ```bash
   codelens analyze . --baseline codelens-baseline.json --fail-on high
   ```

   Pre-existing findings stay quiet. Anything new at `high` or above fails CI.

:::tip
Refresh the baseline periodically as legacy findings get fixed. Use `codelens diff` to compare two saved reports and track progress.
:::

## Cache and baseline interaction

The incremental cache (`--no-cache` / `[history] cache = false`) affects analysis speed but not baseline suppression. Baseline suppression is applied after all findings are collected, regardless of whether the cache was used.

## See also

- [`codelens analyze` reference](/cli/analyze)
- [`codelens baseline`](/cli/baseline)
- [`codelens diff`](/cli/diff)
- [`codelens.toml` reference](/configuration/codelens-toml)
- [Per-rule configuration](/configuration/per-rule-config)
