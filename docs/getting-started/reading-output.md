---
title: Reading the output
description: Anatomy of a codelens terminal finding and the closing dimension scoreboard.
---

# Reading the output

The default terminal format groups findings by dimension and severity, then prints a closing scoreboard. This page walks the anatomy of each piece.

## Anatomy of a finding

![Anatomy of a finding](/img/finding-anatomy.svg)

Each finding occupies two short lines:

```text
[MAINT001-cyclomatic] medium  src/lib.rs:42:1
  function `process_request` has cyclomatic complexity 14 (threshold 10)
```

| Element        | Meaning                                                                       |
| -------------- | ----------------------------------------------------------------------------- |
| `MAINT001-...` | The `rule_id` — stable across releases, used in baselines and config          |
| `medium`       | The finding's severity (`info`, `low`, `medium`, `high`, `critical`)          |
| `src/lib.rs:…` | File path and 1-indexed line:column of the finding's start                    |
| message line   | Human-readable description from the analyzer                                  |

Findings are sorted by `(file, span.start, rule_id)`, so two runs against unchanged source produce byte-identical output.

## Anatomy of the scoreboard

After the findings, codelens prints one row per dimension with a 0–100 score and an A–F letter grade:

```text
Maintainability  87.4  B
Security         98.1  A
Complexity      100.0  A
Documentation    73.5  C
TestSmell        91.0  A
```

Each score is a `0..=100` value where higher is better. The grade maps score ranges: ≥90 → A, ≥80 → B, ≥70 → C, ≥60 → D, else F. One-line meanings:

| Dimension       | What it means                                                       |
| --------------- | ------------------------------------------------------------------- |
| Maintainability | How easy the code is to read and change                             |
| Security        | Patterns commonly exploited by attackers                            |
| Complexity      | Project-level structural complexity (fan-out, cycles)               |
| Documentation   | Public-API doc coverage and TODO/FIXME inventory                    |
| TestSmell       | Quality of the tests themselves                                     |

For the full list of rules per dimension, see [Dimensions](/concepts/dimensions). For the score formula, see [Severity and scoring](/concepts/severity-and-scoring).

## CWE and OWASP labels

Findings that map to industry taxonomy carry `cwe` and `owasp` arrays in JSON output. In the terminal, these appear as short labels at the end of the finding line. Filter findings by taxonomy at the CLI:

```bash
codelens analyze . --cwe CWE-798
codelens analyze . --owasp A07:2021
```

Both flags are repeatable and intersect (a finding must match all specified values).

## Other output formats

The `--format` flag selects an alternative renderer:

| Format     | Flag                  | Reference                                |
| ---------- | --------------------- | ---------------------------------------- |
| Terminal   | `--format terminal`   | [Terminal](/output/terminal) (default)   |
| JSON       | `--format json`       | [JSON](/output/json)                     |
| Markdown   | `--format markdown`   | [Markdown](/output/markdown)             |
| SARIF      | `--format sarif`      | [SARIF](/output/sarif)                   |

:::tip
Pipe `--format json` to `jq` for ad-hoc analysis: `codelens analyze . --format json | jq '.findings[] | select(.severity == "high")'`.
:::
