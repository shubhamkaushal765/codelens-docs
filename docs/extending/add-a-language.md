---
title: Add a language frontend
description: Step-by-step guide for contributors who want codelens to support a new programming language.
---

# Add a language frontend

You want codelens to support a new language. This guide walks you through creating a `codelens-lang-X` crate that teaches codelens how to parse and index source files for that language. Once you're done, every existing cross-language analyzer automatically supports the new language — no changes to those crates required.

The example throughout is a Go frontend. Use the existing [`codelens-lang-rust`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/) and [`codelens-lang-python`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-python/) crates as models.

**The two-axis rule:** language crates and `codelens-analyzers` never depend on each other. Language crates teach codelens to parse; analyzer crates teach it to detect problems. The CLI is the only crate that depends on both. This boundary is enforced at the Cargo dependency-graph level.

```mermaid
flowchart TD
    classDef primary fill:#1e4d8c,color:#fff,stroke:none
    classDef accent fill:#d4a017,color:#fff,stroke:none

    CR[Create crate]
    LP[impl Language::parse]
    SI[Build SemanticIndex]
    CM[Compute ComplexityMetrics]
    NA[impl NativeAst]
    RE[pub fn register]
    RG[Add to build_registry]
    AX[Cross-language analyzers\nautomatically support new language]

    CR --> LP --> SI --> CM --> NA --> RE --> RG --> AX

    class CR accent
    class AX primary
```

## Checklist

1. [Create the crate](#step-1--create-the-crate-with-workspace-inheritance)
2. [Implement `Language::parse`](#step-2--implement-languageparse-using-a-native-rust-parser)
3. [Build a `SemanticIndex`](#step-3--build-a-semanticindex-from-the-ast)
4. [Compute `ComplexityMetrics`](#step-4--compute-complexitymetrics-per-function)
5. [Implement `NativeAst`](#step-5--implement-nativeast-for-goast)
6. [Optionally add language-specific analyzers](#step-6--optionally-add-language-specific-analyzers)
7. [Expose `pub fn register`](#step-7--expose-pub-fn-register)
8. [Wire into `build_registry()`](#step-8--wire-into-build_registry)

---

## Step 1 — Create the crate with workspace inheritance

Create `crates/codelens-lang-go/Cargo.toml`. Using `workspace = true` for `version` and `edition` means your crate automatically stays in sync with every other codelens crate — you never have to update these manually:

```toml
[package]
name    = "codelens-lang-go"
version.workspace = true
edition.workspace = true

[dependencies]
codelens-core.workspace = true
# your chosen Go parser crate
```

Then add `"crates/codelens-lang-go"` to the `[workspace] members` list in the root `Cargo.toml`.

---

## Step 2 — Implement `Language::parse` using a native Rust parser

Define a `GoLanguage` struct and implement [`codelens_core::Language`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-core/src/language.rs). This tells codelens which file extensions to hand to your parser and how to turn source text into a `ParsedFile`. The `id` and `extensions` methods are what codelens uses to route `.go` files to your crate — nothing else needs to know the mapping:

```rust
pub struct GoLanguage;

impl Language for GoLanguage {
    fn id(&self) -> LanguageId { LanguageId("go") }
    fn extensions(&self) -> &[&'static str] { &["go"] }
    fn parse(&self, source: Arc<SourceFile>) -> Result<ParsedFile, ParseError> {
        parse::parse(source)
    }
}
```

Model the `parse` function on [`codelens-lang-rust/src/parse.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/src/parse.rs) or [`codelens-lang-python/src/parse.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-python/src/parse.rs). Map parser errors to [`ParseError::Syntax`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-core/src/error.rs).

---

## Step 3 — Build a `SemanticIndex` from the AST

Create `src/index.rs`. Walk your parser's AST and emit normalized entries into a `SemanticIndex`. This is what cross-language analyzers read — they never touch the native AST. The full struct definitions are in [`codelens-core/src/index.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-core/src/index.rs).

Entry types to emit:

- `FunctionLike` — every function and method (with visibility and span)
- `TypeDecl` — type, struct, and interface declarations
- `Import` — import statements
- `StringLit` — string literals (used by secret-detection rules)
- `DocComment` — doc comments attached to public items

**Contract:** every public function or method must produce a `FunctionLike` with `visibility: Visibility::Public` and a populated `ComplexityMetrics`. This is what `MAINT001-cyclomatic` and `DOC001-public-api-undoc` read.

Reference implementations: [`codelens-lang-rust/src/index.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/src/index.rs) and [`codelens-lang-python/src/index.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-python/src/index.rs).

---

## Step 4 — Compute `ComplexityMetrics` per function

Create `src/complexity.rs`. For each function, compute four metrics that the complexity and maintainability analyzers rely on:

| Metric        | How to compute                                                              |
| ------------- | --------------------------------------------------------------------------- |
| `cyclomatic`  | Baseline 1, +1 per branch (`if`, `for`, `select`, `&&`, `||`, etc.)        |
| `cognitive`   | Sonar-style: +1 per branch, +1 more for each level of nesting               |
| `max_nesting` | The deepest nesting depth reached in the function body                      |
| `returns`     | Count of explicit `return` statements                                       |

See [`codelens-lang-rust/src/complexity.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/src/complexity.rs) for a complete reference implementation.

---

## Step 5 — Implement `NativeAst` for `GoAst`

Define a struct that holds whatever data Go-specific analyzers will need — this is passed alongside the `SemanticIndex` but is only accessible to analyzers that explicitly ask for it by type. This separation means cross-language analyzers are never exposed to Go-specific internals.

**Critical:** the struct must be `Send + Sync`. If your parser uses `Rc` internally, extract the data you need into owned values and drop the parser's AST before constructing `GoAst`:

```rust
pub(crate) struct GoAst {
    // pre-extracted data needed by Go-specific analyzers
    pub(crate) something: Vec<SomePlainType>,
}

impl NativeAst for GoAst {
    fn as_any(&self) -> &dyn Any { self }
}
```

Also provide a typed accessor so language-specific analyzers don't have to downcast manually. This is the function Go-specific analyzers will call instead of working with raw `dyn Any`:

```rust
pub(crate) fn try_go_ast(parsed: &ParsedFile) -> Option<&GoAst> { /* ... */ }
```

This follows the same pattern as `try_rust_ast` in [`codelens-lang-rust/src/lib.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/src/lib.rs).

---

## Step 6 — Optionally add language-specific analyzers

If you want rules that only make sense for Go (e.g. detecting misuse of `goroutine`), create `src/analyzers/mod.rs` and `src/analyzers/my_rule.rs`. Implement [`codelens_core::Analyzer`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-core/src/analyzer.rs) with `supported_languages()` returning `SupportedLanguages::Only(&[LanguageId("go")])`, and use `try_go_ast(file)` to access the `GoAst`.

See [`codelens-lang-rust/src/analyzers/unsafe_block.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/src/analyzers/unsafe_block.rs) for a complete example.

---

## Step 7 — Expose `pub fn register`

In `src/lib.rs`, expose a single `register` function that adds the language (and any language-specific analyzers) to the shared registry. This is the only public entry point your crate needs — `codelens-registry` calls it once at startup and everything else follows automatically:

```rust
pub fn register(registry: &mut Registry) {
    registry.add_language(Box::new(GoLanguage));
    // add any language-specific analyzers:
    registry.add_analyzer(Box::new(analyzers::my_rule::MyAnalyzer));
}
```

Reference: [`codelens-lang-rust/src/lib.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/src/lib.rs) and [`codelens-lang-python/src/lib.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-python/src/lib.rs).

---

## Step 8 — Wire into `build_registry()`

Add the new crate as a dependency of `codelens-registry`, which is shared by both the CLI and the LSP server. This is the only place you touch outside your new crate:

```toml
# crates/codelens-registry/Cargo.toml
codelens-lang-go = { path = "../codelens-lang-go" }
```

Then call `register` in [`codelens-registry/src/lib.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-registry/src/lib.rs):

```rust
codelens_lang_go::register(&mut registry);
```

No changes to `codelens-core`, `codelens-analyzers`, or any other language crate are needed. Cross-language analyzers automatically support Go because they read the `SemanticIndex` that your new frontend populates.

---

## Verify your work

```bash
cargo build --workspace && cargo test --workspace
```
