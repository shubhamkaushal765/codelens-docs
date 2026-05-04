---
title: Introduction
description: What codelens is and why static analysis with multi-dimensional scores beats single-axis lint.
---

# Introduction

codelens is a Rust workspace that statically analyzes source code across Rust, Python, and JavaScript/TypeScript and emits structured findings on five quality dimensions. It runs as a single CLI binary, parallelizes parsing and analysis with `rayon`, and produces deterministic output suited to both terminals and CI pipelines.

## Why multiple dimensions

Tools like clippy, eslint, and pylint return a flat list of warnings. A reviewer or CI gate has to weigh "missing docstring" the same way it weighs "hardcoded AWS key" unless they hand-curate severities. codelens groups findings into five named dimensions — maintainability, security, complexity, documentation, and test smell — and emits an independent 0–100 score per dimension. CI can gate on individual dimensions (for example, fail the build if `security` drops below 95 but allow `documentation` to slip).

See [Dimensions](/concepts/dimensions) for the full list and [Severity and scoring](/concepts/severity-and-scoring) for the formula.

## Languages supported

| Language                | Status        |
| ----------------------- | ------------- |
| Rust                    | full          |
| Python                  | full          |
| JavaScript / TypeScript | scaffold-only |
| Go                      | stub          |

The full table with notes lives at [Install — Language support](/getting-started/install#language-support).

## Output formats

codelens renders to a colored terminal report by default, with optional OSC-8 hyperlinks. Pass `--format json` for the stable machine-readable contract, or `--format markdown` for PR-comment-friendly output. SARIF 2.1.0 is stubbed for v2.

See [Terminal output](/output/terminal) for the default format.

## Extensibility

The workspace is extensible along two independent axes:

- **New languages.** A `codelens-lang-X` crate implements a small `Language` trait. Cross-language analyzers automatically support the new language because they read a normalized `SemanticIndex`. See [Add a language frontend](/extending/add-a-language).
- **New analyzers.** A new analyzer adds one file to `codelens-analyzers` (cross-language) or to a language crate (language-specific). No language frontend changes. See [Add an analyzer](/extending/add-an-analyzer).

Neither change touches the other axis. The contract is enforced at the Cargo dependency-graph level, not by visibility modifiers — see [Architecture](/architecture).
