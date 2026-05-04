---
title: Rules reference
description: All rules built into codelens v1, indexed by dimension and severity.
---

# Rules reference

A *rule* is a single check codelens performs against your code. Each rule has a stable id (e.g. `MAINT001-cyclomatic`) that never changes once shipped, a dimension, and a default severity.

## All rules

| Rule ID | Dimension | Default severity | Languages | One-liner |
| --- | --- | --- | --- | --- |
| [MAINT001-cyclomatic](/rules/MAINT001-cyclomatic) | Maintainability | Medium | All | Functions whose cyclomatic complexity exceeds a threshold |
| [MAINT003-fn-length](/rules/MAINT003-fn-length) | Maintainability | Low | All | Functions whose body exceeds a line-count threshold |
| [MAINT004-file-length](/rules/MAINT004-file-length) | Maintainability | Low | All | Files that exceed a line-count threshold |
| [MAINT005-deep-nesting](/rules/MAINT005-deep-nesting) | Maintainability | Medium | All | Functions nested more deeply than a threshold |
| [DOC001-public-api-undoc](/rules/DOC001-public-api-undoc) | Documentation | Medium | All | Public functions and types missing doc comments |
| [DOC002-todo-fixme](/rules/DOC002-todo-fixme) | Documentation | Info | All | Inventory of TODO and FIXME markers in comments |
| [SEC001-hardcoded-secret](/rules/SEC001-hardcoded-secret) | Security | High | All | Credentials and high-entropy secrets in string literals |
| [SEC002-eval-sink](/rules/SEC002-eval-sink) | Security | High | Python, JS/TS | Calls to `eval`, `exec`, or `Function(...)` (Python and JS only) |
| [SEC101-rust-unsafe](/rules/SEC101-rust-unsafe) | Security | Info | Rust only | Unsafe blocks/fns/impls/traits inventory (Rust only) |

## Severity levels

Severity controls how heavily a finding is weighted in the dimension score. Higher severity = larger penalty.

| Severity   | Weight | Use                                          |
| ---------- | ------ | -------------------------------------------- |
| `info`     | 0      | Informational; does not affect the score    |
| `low`      | 1      | Minor issue                                  |
| `medium`   | 4      | Moderate issue                               |
| `high`     | 12     | Serious issue                                |
| `critical` | 30     | Must fix immediately                         |

See [Severity and scoring](/concepts/severity-and-scoring) for the score formula.

## Coming in future releases

Eight rules are listed in the v1 spec but not yet shipped — see [Coming soon](/rules/coming-soon).
