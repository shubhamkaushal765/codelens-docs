---
title: Dimensions
description: The five quality dimensions codelens measures, what each one checks, and why it matters for your project.
---

import DimensionsHexagon from '@site/src/components/diagrams/DimensionsHexagon';

# Dimensions

codelens groups every finding it reports into one of five dimensions. Each dimension gets its own 0–100 score, so you can see at a glance where your project is healthy and where it needs attention. CI gates work per-dimension, so you can enforce a Security floor without blocking on Documentation.

<DimensionsHexagon />

---

## Security

**What this catches:** Code patterns that are commonly exploited by attackers — hardcoded credentials, dangerous functions like `eval`, use of memory-unsafe blocks, and similar issues that create real attack surface.

**Why you should care:** A single hardcoded secret or injection sink can compromise your entire application. Security findings are the highest-stakes issues codelens reports, and most of them come with a concrete suggestion for how to fix the problem.

**Examples of issues you'll see:**
- A database password embedded directly in source code (`SEC001-hardcoded-secret`)
- A call to `eval()` with user-controlled input (`SEC002-eval-sink`)
- An `unsafe` block in Rust that bypasses memory safety guarantees (`SEC101-rust-unsafe`)

Rules: [SEC001-hardcoded-secret](/rules/SEC001-hardcoded-secret), [SEC002-eval-sink](/rules/SEC002-eval-sink), [SEC101-rust-unsafe](/rules/SEC101-rust-unsafe)

---

## Maintainability

**What this catches:** Code that is technically correct today but difficult to read, change, or review — functions that are too long, too deeply nested, or have too many decision branches.

**Why you should care:** High-maintainability code is easier to onboard new contributors to, cheaper to extend, and less likely to hide bugs. When this score drops, it usually means functions are doing too many things at once.

**Examples of issues you'll see:**
- A function with a cyclomatic complexity score above your threshold, meaning it has too many branching paths to reason about easily (`MAINT001-cyclomatic`)
- A function over 100 lines long (`MAINT003-fn-length`)
- A file that has grown to several hundred lines and should be split (`MAINT004-file-length`)
- `if` blocks nested five or more levels deep (`MAINT005-deep-nesting`)

Rules: [MAINT001-cyclomatic](/rules/MAINT001-cyclomatic), [MAINT003-fn-length](/rules/MAINT003-fn-length), [MAINT004-file-length](/rules/MAINT004-file-length), [MAINT005-deep-nesting](/rules/MAINT005-deep-nesting)

---

## Complexity

**What this catches:** Structural complexity that spans multiple files — modules with too many dependencies on other modules (fan-out), circular dependencies between modules, and blocks of copy-pasted code that should be consolidated.

**Why you should care:** Even when individual functions look clean, a codebase can become brittle if modules are tightly entangled or if the same logic is duplicated in five places. Changes in one part unexpectedly break another.

**Examples of issues you'll see:**
- A module that imports from 20 other modules (`CPLX001-fan-out`)
- Two or more modules that depend on each other, creating a cycle (`CPLX002-cyclic-deps`)
- Near-identical code blocks repeated across multiple files (`CPLX003-duplicate-code`)

---

## Documentation

**What this catches:** Public functions, classes, and modules that have no documentation, plus `TODO` and `FIXME` comments that have accumulated and never been resolved.

**Why you should care:** Undocumented public APIs slow down anyone trying to use or extend your code. A pile of unresolved `TODO` comments is a signal that technical debt is being deferred rather than addressed.

**Examples of issues you'll see:**
- A public function with no docstring or doc comment (`DOC001-public-api-undoc`)
- A `FIXME` comment that has been in the codebase for months (`DOC002-todo-fixme`)

Rules: [DOC001-public-api-undoc](/rules/DOC001-public-api-undoc), [DOC002-todo-fixme](/rules/DOC002-todo-fixme)

---

## Test smell

**What this catches:** Problems with the tests themselves — not enough tests overall, test functions with no assertions, skipped tests that nobody has re-enabled, and patterns that make tests flaky.

**Why you should care:** Tests that exist but don't assert anything give you false confidence. Skipped tests mean coverage gaps you may have forgotten about. Flaky tests erode trust in your CI pipeline.

**Examples of issues you'll see:**
- A project where less than 20% of source files have corresponding test files (`TEST001-test-ratio`)
- A test function with zero `assert` calls (`TEST002-no-asserts`)
- A test marked with `skip` or `pytest.mark.skip` (`TEST003-skipped`)
- A test that compares against `time.time()` or `Date.now()`, which will break depending on when it runs (`TEST004-flaky-time`)
- A test with only one assertion for a complex behavior (`TEST005-assert-count`)

---

## Quick reference

| Dimension       | What it measures                                                                        |
| --------------- | --------------------------------------------------------------------------------------- |
| Security        | Patterns commonly exploited by attackers                                                |
| Maintainability | How easy the code is to read and modify (length, nesting, branching)                   |
| Complexity      | Structural complexity across files (fan-out, cyclic deps, duplicate code)               |
| Documentation   | Public-API doc coverage and inline TODO/FIXME inventory                                 |
| Test smell      | Quality of tests themselves (test ratio, no-assert tests, skipped tests, flaky patterns) |

:::note
Each dimension produces an independent 0–100 score. There is no single composite score — you choose which dimensions to gate on in CI.
:::

All 25 rules across all five dimensions are enabled by default. Browse the full list under [Rules reference](/rules/).

For how scores are calculated from findings, see [Severity and scoring](/concepts/severity-and-scoring).
