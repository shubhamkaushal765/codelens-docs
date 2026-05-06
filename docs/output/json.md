---
title: JSON output
sidebar_label: JSON
description: How to produce machine-readable JSON reports from codelens, with a stable schema for CI and tooling integration.
---

# JSON output

JSON is the **stable machine contract** for codelens. Use it whenever another tool or script needs to consume analysis results.

```bash
codelens analyze ./src --format json
```

To write the report to disk instead of stdout, add `--output`:

```bash
codelens analyze ./src --format json --output report.json
```

## Stability

| Property         | Value                                                                              |
| ---------------- | ---------------------------------------------------------------------------------- |
| Pretty-printed   | Always (two-space indent)                                                          |
| Field order      | Stable; documented per object                                                      |
| `schema_version` | Integer; current value is `2`. Bumped on any breaking change to the report shape. |
| Sort order       | Findings sorted by `(file, span.start, rule_id)`                                   |

For the full reference — every field, every constraint, every example — see [JSON schema](./json-schema).

:::note
Findings are sorted by `(file, span.start, rule_id)` — output is byte-for-byte deterministic given the same input. This makes JSON reports safe to diff in CI.
:::

## Example

A minimal report with a single finding:

```json
{
  "schema_version": 2,
  "tool": {
    "name": "codelens",
    "version": "0.1.0"
  },
  "scores": {
    "maintainability": 84.5,
    "security": 100.0,
    "complexity": 100.0,
    "documentation": 78.0,
    "test_smell": 95.0
  },
  "grades": {
    "maintainability": "B",
    "security": "A",
    "complexity": "A",
    "documentation": "C",
    "test_smell": "A"
  },
  "findings": [
    {
      "analyzer": "MAINT001-cyclomatic",
      "dimension": "maintainability",
      "rule_id": "MAINT001-cyclomatic",
      "severity": "medium",
      "message": "Function 'parse_request' has cyclomatic complexity 14 (threshold: 10).",
      "location": {
        "file": "src/lib.rs",
        "span": { "start": 200, "end": 900 },
        "start": { "line": 12, "column": 1 },
        "end": { "line": 45, "column": 2 }
      },
      "suggestion": "Extract sub-routines to reduce branching.",
      "references": [
        "https://docs.codelens.dev/rules/MAINT001-cyclomatic"
      ],
      "cwe": ["CWE-1121"]
    }
  ],
  "stats": {
    "files_scanned": 12,
    "parse_failures": 0,
    "elapsed_ms": 237
  }
}
```

## Consuming the JSON

Any JSON-aware tool works. `jq` is convenient for ad-hoc filtering:

```bash
codelens analyze ./src --format json | jq '.findings[] | select(.severity == "critical")'
```

For full field definitions, severity weights, and the scoring formula, continue to the [JSON schema reference](./json-schema).
