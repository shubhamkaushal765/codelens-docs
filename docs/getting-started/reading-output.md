---
title: Reading the output
description: Understand codelens findings and dimension scores so you can act on results quickly.
---

# Reading the output

The default terminal report has two parts: a list of findings, then a closing scoreboard. Here's how to read both.

## What a finding looks like

![Anatomy of a finding](/img/finding-anatomy.svg)

Each finding takes two lines:

```text
[MAINT001-cyclomatic] medium  src/lib.rs:42:1
  function `process_request` has cyclomatic complexity 14 (threshold 10)
```

| Part           | What it tells you                                                        |
| -------------- | ------------------------------------------------------------------------ |
| `MAINT001-...` | The rule ID — stable across releases, used in config and baselines       |
| `medium`       | Severity: `info`, `low`, `medium`, `high`, or `critical`                 |
| `src/lib.rs:…` | File path and line:column where the issue starts                         |
| Message line   | Plain-English description of the problem                                 |

Findings are sorted by file, then line, then rule ID, so two scans of unchanged code produce identical output.

## What the scoreboard means

After the findings, codelens prints one row per dimension:

```text
Maintainability  87.4  B
Security         98.1  A
Complexity      100.0  A
Documentation    73.5  C
TestSmell        91.0  A
```

Scores run from 0 to 100 — higher is better. The letter grade maps score ranges: A (90–100), B (80–89), C (70–79), D (60–69), F (below 60).

| Dimension       | What it measures                                          |
| --------------- | --------------------------------------------------------- |
| Security        | Patterns commonly exploited by attackers                  |
| Maintainability | How easy the code is to read and change                   |
| Complexity      | Project-level structural complexity (fan-out, cycles)     |
| Documentation   | Public-API doc coverage and TODO/FIXME inventory          |
| TestSmell       | Quality of the tests themselves                           |

For the full rule list per dimension see [Dimensions](/concepts/dimensions). For the scoring formula see [Severity and scoring](/concepts/severity-and-scoring).

## Filter by security taxonomy

Findings that map to industry vulnerability taxonomies carry CWE and OWASP labels. You can filter to just those findings at the command line:

```bash
# Show only findings tagged CWE-798 (hardcoded credentials)
codelens analyze . --cwe CWE-798

# Show only findings in the OWASP A07:2021 category
codelens analyze . --owasp A07:2021
```

Both flags are repeatable. When you combine them, a finding must match all specified values to appear.

## Choose an output format

The `--format` flag switches the renderer:

| Format   | Flag                  | Best for                                       | Reference                              |
| -------- | --------------------- | ---------------------------------------------- | -------------------------------------- |
| Terminal | `--format terminal`   | Local development (default)                    | [Terminal](/output/terminal)           |
| JSON     | `--format json`       | Scripts, tooling, custom dashboards            | [JSON](/output/json)                   |
| Markdown | `--format markdown`   | PR comments                                    | [Markdown](/output/markdown)           |
| SARIF    | `--format sarif`      | GitHub code scanning                           | [SARIF](/output/sarif)                 |

:::tip
Use `--format json` with `jq` to filter findings ad hoc:

```bash
codelens analyze . --format json | jq '.findings[] | select(.severity == "high")'
```
:::
