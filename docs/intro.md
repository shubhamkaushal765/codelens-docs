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

| Language                | Status | Notes                                           |
| ----------------------- | ------ | ----------------------------------------------- |
| Rust                    | full   | `syn`-backed                                    |
| Python                  | full   | `rustpython-parser`-backed                      |
| JavaScript / TypeScript | full   | `oxc_parser`; covers `.js/.mjs/.cjs/.jsx/.ts/.mts/.cts/.tsx` |
| Go                      | stub   | No maintained native Rust Go parser             |

The full table with notes lives at [Install — Language support](/getting-started/install#language-support).

## Rules

25 rules span all five dimensions. Rule IDs use the prefix of their dimension: `MAINT`, `SEC`, `CPLX`, `DOC`, `TEST`. Every finding carries optional CWE and OWASP taxonomy labels; filter with `--cwe` or `--owasp`. Browse the full list under [Rules reference](/rules/).

## Output formats

codelens renders to a colored terminal report by default, with optional OSC-8 hyperlinks. Pass `--format json` for the stable machine-readable contract, `--format markdown` for PR-comment-friendly output, or `--format sarif` for GitHub code-scanning integration.

See [Terminal output](/output/terminal) for the default format.

## Scan history and dashboard

Every `codelens analyze` run is saved to `~/.codelens/`. Run `codelens show` to start a local HTTP server and open a browser dashboard with Overview, Scans, Findings, Trends, Diff, Heatmap, and Config tabs. See [`codelens show`](/cli/show).

## Language Server

`codelens lsp` starts a stdio JSON-RPC Language Server. Editors that send `textDocument/didSave` receive `publishDiagnostics` with findings mapped to LSP severity levels. See [LSP integration](/integrations/lsp).

## GitHub Action

A composite action at `action.yml` in the source repo installs codelens, runs analysis, and uploads SARIF results to GitHub code scanning. See [GitHub Action](/integrations/github-action).

## Extensibility

The workspace is extensible along two independent axes:

- **New languages.** A `codelens-lang-X` crate implements a small `Language` trait. Cross-language analyzers automatically support the new language because they read a normalized `SemanticIndex`. See [Add a language frontend](/extending/add-a-language).
- **New analyzers.** A new analyzer adds one file to `codelens-analyzers` (cross-language) or to a language crate (language-specific). No language frontend changes. See [Add an analyzer](/extending/add-an-analyzer).

Neither change touches the other axis. The contract is enforced at the Cargo dependency-graph level, not by visibility modifiers — see [Architecture](/architecture).
