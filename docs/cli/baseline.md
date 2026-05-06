---
title: codelens baseline
description: Capture a baseline of current findings to suppress pre-existing issues in future runs.
---

# codelens baseline

```
codelens baseline save [OPTIONS] [PATH]
```

Captures the current findings as a `codelens-baseline.json` file. Use the baseline file with `codelens analyze --baseline` to suppress pre-existing issues, so only **new** findings trigger `--fail-on`.

## Subcommands

| Subcommand      | Effect                                          |
| --------------- | ----------------------------------------------- |
| `baseline save` | Run analysis and write findings to a JSON file. |

## Flags

| Flag              | Type   | Default                  | Description                                                                                                        |
| ----------------- | ------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `--ref <GIT_REF>` | string | unset (working tree)     | Capture findings from a git ref (tag, branch, or commit SHA). Uses `git archive | tar -x` into a temporary directory. |
| `-o <FILE>`       | path   | `codelens-baseline.json` | Write the baseline to this file instead of the default.                                                           |
| `[PATH]`          | path   | `.`                      | Root path to analyse.                                                                                              |

## Examples

Capture the baseline from the working tree:

```bash
codelens baseline save
```

Capture the baseline from a released tag:

```bash
codelens baseline save --ref v1.0.0 -o baseline-v1.0.0.json
```

Apply the baseline to suppress pre-existing issues in CI:

```bash
codelens analyze . --baseline codelens-baseline.json --fail-on high
```

## Workflow

```mermaid
flowchart TD
    A[baseline save] -->|writes| B[codelens-baseline.json]
    B --> C[git commit\nbaseline file]
    C --> D[CI: analyze\n--baseline --fail-on]
    D -->|new findings| E[exit 1\nblock merge]
    D -->|no new findings| F[exit 0\npass]

    classDef primary fill:#1e4d8c,color:#fff,stroke:#163c6e
    classDef accent fill:#d4a017,color:#000,stroke:#b8860b
    class D primary
    class E accent
```

1. Capture a baseline on the current state of the codebase:

   ```bash
   codelens baseline save -o codelens-baseline.json
   git add codelens-baseline.json
   git commit -m "chore: codelens baseline"
   ```

2. In CI and local runs, apply the baseline:

   ```bash
   codelens analyze . --baseline codelens-baseline.json --fail-on medium
   ```

3. Refresh the baseline periodically as legacy findings are fixed:

   ```bash
   codelens baseline save -o codelens-baseline.json
   ```

## See also

- [Baselines and fail-on](/configuration/baselines-and-fail-on)
- [`codelens analyze`](/cli/analyze)
- [`codelens diff`](/cli/diff)
