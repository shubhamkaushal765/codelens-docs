---
title: GitHub Action
description: Run codelens in GitHub Actions and upload SARIF results to GitHub code scanning.
---

# GitHub Action

codelens ships a [composite action](https://github.com/shubhamkaushal765/codelens/blob/main/action.yml) at the root of the source repository. It installs codelens, runs analysis, and uploads SARIF results to GitHub code scanning.

## Quick start

```yaml
name: codelens

on: [push, pull_request]

jobs:
  codelens:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    steps:
      - uses: actions/checkout@v4
      - uses: shubhamkaushal765/codelens@main
        with:
          path: "."
          fail-on: "medium"
```

## Inputs

| Input     | Required | Default    | Description                                                                        |
| --------- | -------- | ---------- | ---------------------------------------------------------------------------------- |
| `path`    | no       | `.`        | Root path to analyse, relative to the repository root.                             |
| `format`  | no       | `sarif`    | Output format passed to `codelens analyze --format`.                               |
| `fail-on` | no       | `medium`   | Exit non-zero when findings of this severity or higher are found.                  |
| `version` | no       | `latest`   | Version of codelens to install. Pass `latest` or a semver string (e.g. `0.1.0`).  |

## What it does

1. Installs the stable Rust toolchain via [`dtolnay/rust-toolchain@stable`](https://github.com/dtolnay/rust-toolchain).
2. Runs `cargo install --locked codelens` (or a pinned version).
3. Runs `codelens analyze <path> --format <format> --fail-on <fail-on> --output codelens-results.sarif` with `continue-on-error: true` so the upload step always runs.
4. Uploads `codelens-results.sarif` to GitHub via [`github/codeql-action/upload-sarif@v3`](https://github.com/github/codeql-action) (only when `format == 'sarif'`).

## Permissions

The `security-events: write` permission is required for the SARIF upload step.

```yaml
permissions:
  security-events: write
```

## Using JSON instead of SARIF

Set `format: json` to get a JSON report artifact instead of uploading to code scanning:

```yaml
- uses: shubhamkaushal765/codelens@main
  with:
    path: "."
    format: "json"
    fail-on: "high"
- uses: actions/upload-artifact@v4
  with:
    name: codelens-report
    path: codelens-results.sarif
```

## Pinning a version

To avoid unexpected breakage from new analyzer rules, pin to a specific codelens version:

```yaml
- uses: shubhamkaushal765/codelens@main
  with:
    version: "0.1.0"
    fail-on: "high"
```

## See also

- [`codelens analyze`](/cli/analyze)
- [Baselines and fail-on](/configuration/baselines-and-fail-on)
- [SARIF output](/output/sarif)
