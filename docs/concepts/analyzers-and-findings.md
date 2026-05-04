---
title: Analyzers and findings
description: The Analyzer trait, the shape of a Finding, and where analyzers live in the source tree.
---

# Analyzers and findings

## Analyzers

An *analyzer* is a Rust struct that implements the `Analyzer` trait and emits zero or more findings per file. Most analyzers correspond 1:1 with a `rule_id` (e.g. `MAINT001-cyclomatic`), though one analyzer may emit findings for several related rules.

Analyzers come in two flavours:

- **Cross-language analyzers** read only the normalized `SemanticIndex` and live in [`codelens-analyzers`](https://github.com/shubhamkaushal/codelens/blob/main/crates/codelens-analyzers/). They never depend on a specific language crate.
- **Language-specific analyzers** live alongside their frontend in `codelens-lang-<lang>/src/analyzers/`. They use a typed downcast to reach AST data not exposed by `SemanticIndex` (for example, [`SEC101-rust-unsafe`](/rules/SEC101-rust-unsafe) inspects the Rust AST for `unsafe` blocks).

The dependency-graph rule that keeps these two layers from leaking into each other is described in [Architecture](/architecture).

To write a new analyzer, see [Add an analyzer](/extending/add-an-analyzer).

## Findings

A *finding* is a single issue at a specific location. The Rust struct has these fields:

| Field        | Type              | Notes                                                       |
| ------------ | ----------------- | ----------------------------------------------------------- |
| `analyzer`   | `AnalyzerId`      | Which analyzer emitted this finding                         |
| `dimension`  | `Dimension`       | One of the five v1 dimensions, or a `Custom(...)` variant   |
| `rule_id`    | `String`          | Stable identifier, e.g. `MAINT001-cyclomatic`               |
| `severity`   | `Severity`        | `info` / `low` / `medium` / `high` / `critical`             |
| `message`    | `String`          | One-line human-readable description                         |
| `location`   | `Location`        | File path, byte span, and 1-indexed start/end line:column   |
| `suggestion` | `Option<String>`  | Optional fix hint                                           |
| `references` | `Vec<String>`     | External standards, CWE / OWASP IDs, etc.                   |

The canonical JSON shape is documented at [JSON schema](/output/json-schema). A single finding looks like this in JSON:

```json
{
  "analyzer": "MAINT001-cyclomatic",
  "dimension": "Maintainability",
  "rule_id": "MAINT001-cyclomatic",
  "severity": "medium",
  "message": "function `process_request` has cyclomatic complexity 14 (threshold 10)",
  "location": {
    "file": "src/lib.rs",
    "span": { "start": 812, "end": 1547 },
    "start": { "line": 42, "column": 1 },
    "end": { "line": 78, "column": 2 }
  },
  "suggestion": null,
  "references": []
}
```

:::note
Findings are sorted deterministically by `(file, span.start, rule_id)` before output. Two runs against unchanged source produce byte-identical output.
:::
