---
title: SARIF output
sidebar_label: SARIF
description: SARIF 2.1.0 output is in the v1 spec but not yet implemented. This page tracks status and the planned behaviour.
---

# SARIF output

SARIF 2.1.0 is part of the v1 specification but is **not yet implemented**. Running with `--format sarif` currently returns an error.

```bash
codelens analyze ./src --format sarif
```

:::caution
The above invocation exits with the error:

```text
SARIF formatter not implemented in v1.
```
:::

## Why it is stubbed

The `codelens-report` crate has a `sarif.rs` module wired into the format dispatch, but it returns `ReportError::NotImplemented`. The blocker is upstream: a stable, well-maintained Rust SARIF schema binding does not yet exist. Rather than ship a hand-rolled emitter that might drift from the spec, the SARIF formatter will land once stable bindings are available.

## What to use in the meantime

| Goal                                   | Use                                                                                |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| Machine-readable output                | [JSON](./json)                                                                     |
| GitHub code-scanning ingestion         | Convert JSON to SARIF in CI, or wait for native support                            |
| Human review                           | [Terminal](./terminal) or [Markdown](./markdown)                                   |

## References

- [SARIF 2.1.0 specification (OASIS)](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html)
- Track progress on the [codelens GitHub issue tracker](https://github.com/shubhamkaushal/codelens/issues)
