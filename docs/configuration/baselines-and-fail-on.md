---
title: Baselines and fail-on
description: Two CI workflows — gate pull requests on severity with --fail-on, and adopt codelens on legacy code with --baseline.
---

# Baselines and fail-on

`codelens analyze` ships two flags that exist for CI integration. Use them together: `--fail-on` gates new findings, `--baseline` ignores old ones.

## `--fail-on`

Use `--fail-on` to make CI fail when findings reach a severity threshold. Without it, `codelens analyze` always exits `0` after rendering output — useful for informational runs, but not for blocking merges.

| Value      | Fails on                     |
| ---------- | ---------------------------- |
| `info`     | Any finding (Info or above). |
| `low`      | Low or above.                |
| `medium`   | Medium or above.             |
| `high`     | High or above.               |
| `critical` | Critical findings only.      |

Default: unset — no threshold, exit `0` always.

### GitHub Actions example

```yaml
name: codelens

on: [pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - run: cargo install codelens-cli
      - run: codelens analyze . --format markdown --fail-on high
```

A non-zero exit fails the job, and the markdown summary is captured in the run log.

## `--baseline`

Use `--baseline` to adopt `codelens` on a codebase that already has issues you do not plan to fix immediately. The baseline file records every finding from a known-good run; on subsequent runs, findings present in the baseline are suppressed, so only **new** findings reach the formatter and `--fail-on`.

### Workflow

1. Capture today's findings:

   ```bash
   codelens analyze . --format json --output baseline.json
   ```

2. Commit the baseline:

   ```bash
   git add baseline.json
   git commit -m "chore: codelens baseline"
   ```

3. From now on, run with the baseline applied:

   ```bash
   codelens analyze . --baseline baseline.json --fail-on high
   ```

   Pre-existing findings stay quiet. Anything new at `high` or above fails CI.

:::tip
Refresh the baseline periodically as legacy findings get fixed. Diff the new and old baselines (`git diff baseline.json`) to see your progress, and shrink the file over time.
:::

## See also

- [`codelens analyze` reference](/cli/analyze)
- [`codelens.toml` reference](/configuration/codelens-toml)
- [Per-rule configuration](/configuration/per-rule-config)
