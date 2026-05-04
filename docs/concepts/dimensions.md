---
title: Dimensions
description: The five quality dimensions codelens groups findings under, plus the rules that belong to each.
---

# Dimensions

A *dimension* is a category of code-quality concern. codelens v1 has five built-in dimensions; each finding is assigned to exactly one. Scores are computed per dimension, so CI gates can target one concern at a time.

## Reference

| Dimension       | What it measures                                                          | Rules                                                                                                                      |
| --------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Maintainability | How easy the code is to read and modify (length, nesting, branching)      | [MAINT001-cyclomatic](/rules/MAINT001-cyclomatic), [MAINT003-fn-length](/rules/MAINT003-fn-length), [MAINT004-file-length](/rules/MAINT004-file-length), [MAINT005-deep-nesting](/rules/MAINT005-deep-nesting) |
| Security        | Patterns commonly exploited by attackers                                  | [SEC001-hardcoded-secret](/rules/SEC001-hardcoded-secret), [SEC002-eval-sink](/rules/SEC002-eval-sink), [SEC101-rust-unsafe](/rules/SEC101-rust-unsafe) |
| Complexity      | Structural complexity beyond per-function metrics                         | (in v2)                                                                                                                    |
| Documentation   | Public-API doc coverage and inline TODO/FIXME inventory                   | [DOC001-public-api-undoc](/rules/DOC001-public-api-undoc), [DOC002-todo-fixme](/rules/DOC002-todo-fixme)                   |
| Test smell      | Quality of tests themselves                                               | (in v2)                                                                                                                    |

:::note
Each dimension produces an independent 0–100 score. There is no single composite score in v1 — you can choose which dimensions to gate on.
:::

The Complexity and TestSmell dimensions exist in the type system today and will always appear in the scoreboard, but their analyzers ship in v2.

For the score formula, see [Severity and scoring](/concepts/severity-and-scoring).
