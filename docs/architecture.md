---
title: Architecture
description: How codelens works inside — file walking, parsing, analysis, scoring, and output.
---

import PipelineDiagram from '@site/src/components/diagrams/PipelineDiagram';

# Architecture

This page explains what codelens does when you run `codelens analyze`. You do not need to read this to use codelens effectively, but it can help you understand why results look the way they do and what to expect from incremental runs.

## How codelens works

<PipelineDiagram />

### 1. Walk your project files

codelens starts by collecting all source files under the path you give it, in a consistent lexicographic order. It respects `.gitignore` and any `exclude` patterns in your `codelens.toml`. Only files in supported languages (Rust, Python, JavaScript, TypeScript) are analyzed; everything else is skipped.

### 2. Parse each file with a language-specific frontend

Each file is parsed by a frontend for its language. The frontend does two things:

- Builds a normalized summary of the file — the list of functions, types, imports, comments, doc comments, and string literals. This summary is the same shape regardless of language.
- Extracts a language-native syntax tree for checks that need to go deeper into language-specific syntax (for example, detecting `unsafe` blocks in Rust).

Parse failures are counted and reported but do not abort the run. codelens continues analyzing all other files.

### 3. Run analyzer checks across your files

codelens runs two rounds of analysis:

- **Per-file checks** run in parallel across all parsed files. Each check looks at one file at a time. This covers the majority of rules — cyclomatic complexity, function length, hardcoded secrets, missing doc comments, and so on.
- **Project-wide checks** run once after all files are parsed. These are rules that need to see the whole project at once: circular dependencies between modules, fan-out across the codebase, duplicate code blocks, and test coverage ratios.

### 4. Sort and score findings

After analysis, codelens sorts all findings by file path, then by position in the file, then by rule ID. This ordering is deterministic — two runs against unchanged source produce byte-identical output.

Findings are then grouped by dimension. Each dimension gets a score from 0 to 100 based on how many findings were found and how severe they are. See [Severity and scoring](/concepts/severity-and-scoring) for the formula.

### 5. Render to your chosen format

The final report is written to stdout or a file in your chosen format: terminal output, JSON, SARIF 2.1.0, or Markdown. The JSON output includes the full list of findings and the per-dimension scores. See [Terminal output](/output/terminal) for the default format and the other output pages for JSON, Markdown, and SARIF.

## Incremental cache

When you run `codelens analyze` (or `codelens watch`), codelens caches results per file using a content hash. On the next run, files whose content has not changed reuse their cached findings without being re-parsed or re-analyzed. Only changed files go through the full pipeline.

Rules that aggregate across all files (cyclic dependencies, duplicate code, test ratio) always re-run, since they depend on the project as a whole.

To opt out of caching, pass `--no-cache` or set `cache = false` in your `codelens.toml`.

## Stable guarantees

These behaviors will not change without a version bump:

- **Rule IDs** (like `SEC001-hardcoded-secret`) are stable once a rule ships. You can safely reference them in baseline files and ignore lists.
- **Finding sort order** is `(file, position, rule_id)`. Byte-identical output across runs is guaranteed as long as source files do not change.
- **JSON schema version** is currently 2. Adding new fields is non-breaking. Removing or renaming a field bumps the version.

---

## For contributors

The full source-level architecture document — covering workspace layout, the two-axis extensibility contract, the `SemanticIndex` contract, parallelism details, and the incremental cache implementation — lives in the source repository:

[https://github.com/shubhamkaushal765/codelens/blob/main/docs/architecture.md](https://github.com/shubhamkaushal765/codelens/blob/main/docs/architecture.md)
