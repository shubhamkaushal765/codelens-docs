---
title: Architecture
description: A condensed tour of the codelens architecture — goals, the two-axis extensibility contract, data flow, and stable contracts.
---

# Architecture

This page is a condensed end-user tour of the codelens architecture. The full long-form narrative lives in the source repo.

## Goals

codelens runs fast, structured static analysis across a multi-language codebase and emits findings that CI pipelines and humans can act on. The design centres on one invariant: the system must be extensible along two independent axes — new languages and new analysis dimensions — without requiring changes to the other axis.

A secondary goal is production quality: idiomatic Rust, errors via `thiserror` in library crates, `anyhow` only in the CLI, `#![warn(missing_docs)]` on every library crate, no `unwrap()` in library code.

## Non-goals

What is **not** a goal for v1: real coverage data (line, branch, MC/DC) — coverage requires runtime instrumentation, not static analysis. Taint analysis or dataflow tracking — these need a control-flow graph representation that is out of scope. IDE-grade incremental parsing — there is no LSP server, no watch mode, no partial re-parse. `tree-sitter` is also explicitly off the table: if no native Rust parser is available for a language, that language is stubbed or dropped, not back-doored through `tree-sitter` bindings.

## The two-axis extensibility contract

The central architectural rule, stated precisely:

> `codelens-lang-*` crates and `codelens-analyzers` must never depend on each other. Both depend only on `codelens-core`. The `codelens-cli` crate is the single integration point that depends on everything.

This is enforced at the **Cargo dependency-graph level**, not by visibility modifiers. Because `codelens-analyzers` does not list any `codelens-lang-*` crate as a dependency, the concrete `NativeAst` implementation types (e.g. `RustAst`, `PythonAst`) are simply not in scope when an analyzer is compiled. There is no `unsafe` code or `#[doc(hidden)]` trick hiding something — the types literally do not exist in that compilation unit.

The practical consequence: cross-language analyzers in `codelens-analyzers` consume **only** `SemanticIndex` fields. They never call `ParsedFile::native<T>()`. A language-specific analyzer (e.g. `SEC101-rust-unsafe`) lives inside `codelens-lang-rust` alongside the frontend and uses a typed downcast to reach the pre-extracted Rust AST data.

## Data flow

The pipeline for a single `codelens analyze <path>` run:

```text
                  ┌──────────────────────────────────────┐
  source files ──►│  walk_files (lexicographic order)     │
                  └────────────────┬─────────────────────┘
                                   │ Vec<PathBuf>
                  ┌────────────────▼─────────────────────┐
                  │  Language::parse  (rayon par_iter)    │
                  │  ┌──────────────────────────────────┐ │
                  │  │  SemanticIndex  (cross-lang data) │ │
                  │  │  NativeAst      (lang-specific)   │ │
                  │  └──────────────────────────────────┘ │
                  │  ──► ParsedFile                        │
                  └────────────────┬─────────────────────┘
                                   │ Vec<ParsedFile>
                  ┌────────────────▼─────────────────────┐
                  │  Analyzer::analyze_file (rayon)       │
                  │  + Analyzer::analyze_project (seq)    │
                  └────────────────┬─────────────────────┘
                                   │ Vec<Finding>
                  ┌────────────────▼─────────────────────┐
                  │  sort_findings  (file, span, rule_id) │
                  └────────────────┬─────────────────────┘
                                   │
                  ┌────────────────▼─────────────────────┐
                  │  aggregate_dimension_score            │
                  └────────────────┬─────────────────────┘
                                   │ Report
                  ┌────────────────▼─────────────────────┐
                  │  render (JSON / terminal / markdown)  │
                  └────────────────┬─────────────────────┘
                                   │ String → stdout / file
```

## SemanticIndex

`SemanticIndex` is the load-bearing cross-language contract. Frontends fill it in at parse time; cross-language analyzers consume it. It exposes `functions`, `types`, `modules`, `imports`, `string_literals`, `comments`, and `doc_comments`. Every `FunctionLike` carries pre-computed `ComplexityMetrics` (cyclomatic, cognitive, max_nesting, returns), so analyzers like `MAINT001-cyclomatic` never re-walk a native AST — they read a `u32` from a struct field. Pre-computation also keeps non-`Send` parser fragments out of the post-parse data, allowing rayon to parallelize file analysis without extra synchronization.

## Engine and parallelism

`Engine::analyze_path` orchestrates the pipeline in three phases separated by a sequential barrier:

- **Phase A — parse (parallel):** `rayon::par_iter` over the lexicographically sorted file list. Each file is read, wrapped in `Arc<SourceFile>`, and passed to its language frontend. Parse failures are counted and do not abort the run.
- **Phase B — per-file analysis (parallel):** a second `rayon::par_iter` over the parsed files. Each worker filters analyzers by `supported_languages()` and calls `analyze_file`.
- **Phase C — project analysis (sequential):** each analyzer's `analyze_project` runs once with the full project. This is where rules that aggregate across files (fan-out, cycle detection) belong; v1's cross-language analyzers all return an empty `Vec` here.

A single `sort_findings` call after Phase C uses the key `(file, span.start, rule_id)`. One sort at the end is cheaper than maintaining a sorted structure during parallel collection.

## Stable contracts

- **`schema_version`** — the JSON output starts at `1` and is bumped on any breaking change to the report shape. Adding fields is non-breaking; removing or retyping a field is breaking.
- **`rule_id`** — strings are stable once a rule ships. Renaming a rule ID is a breaking change to any baseline file that references it.
- **Finding sort order** — `(file, span.start, rule_id)`. Two runs against unchanged source produce byte-identical output.
- **`#[non_exhaustive]` enums** — `FunctionKind`, `Visibility`, and similar enums in `codelens-core` are non-exhaustive, so adding a variant is non-breaking; downstream code must handle a `_` arm.

:::info
The full long-form architecture doc lives at [https://github.com/shubhamkaushal/codelens/blob/main/docs/architecture.md](https://github.com/shubhamkaushal/codelens/blob/main/docs/architecture.md).
:::
