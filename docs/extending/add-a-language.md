---
title: Add a language frontend
description: Step-by-step guide to adding a new language frontend to codelens. Cross-language analyzers automatically support the new language.
---

# Add a language frontend

A language frontend is a `codelens-lang-X` crate that implements `Language::parse` for one source language and populates a normalized `SemanticIndex`. This tutorial walks through adding a hypothetical real Go frontend (the current Go crate is a stub). Use the existing [`codelens-lang-rust`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/) and [`codelens-lang-python`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-python/) crates as models.

The two-axis invariant in plain terms: adding a language should not require any change to existing analyzer crates, and adding an analyzer should not require any change to existing language crates. The boundary is enforced at the Cargo dependency-graph level — language crates and `codelens-analyzers` never list each other as dependencies. The CLI is the only crate that depends on every other crate.

## Step 1 — Create the crate with workspace inheritance

Add a new `crates/codelens-lang-go/` directory with a `Cargo.toml` that inherits the workspace edition and Rust settings:

```toml
[package]
name    = "codelens-lang-go"
version.workspace = true
edition.workspace = true

[dependencies]
codelens-core.workspace = true
# your chosen native Go parser, e.g. some future go-parser crate
```

Add `"crates/codelens-lang-go"` to the `[workspace] members` list in the root `Cargo.toml`.

## Step 2 — Implement `Language::parse` using a native Rust parser

Define a `GoLanguage` struct and implement [`codelens_core::Language`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-core/src/language.rs):

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

Model the parse function on [`codelens-lang-rust/src/parse.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/src/parse.rs) or [`codelens-lang-python/src/parse.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-python/src/parse.rs). Map parser errors to [`ParseError::Syntax`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-core/src/error.rs).

## Step 3 — Build a `SemanticIndex` from the AST

Create `src/index.rs`. Walk the native AST and emit `FunctionLike`, `TypeDecl`, `Import`, `StringLit`, and `DocComment` entries. The full struct definitions live in [`codelens-core/src/index.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-core/src/index.rs).

For Rust, the index visitor lives in [`codelens-lang-rust/src/index.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/src/index.rs). For Python, it is in [`codelens-lang-python/src/index.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-python/src/index.rs).

The contract: every public function/method should produce a `FunctionLike` with `visibility: Visibility::Public` and a populated `ComplexityMetrics`. This is what `MAINT001-cyclomatic` and `DOC001-public-api-undoc` read.

## Step 4 — Compute `ComplexityMetrics` per function

Create `src/complexity.rs`. For each function, compute:

- `cyclomatic` — baseline 1, +1 per branching construct (`if`, `for`, `select`, `&&`, `||`, etc.).
- `cognitive` — Sonar-style: +1 for each branch, +1 more per nesting level.
- `max_nesting` — deepest nesting reached.
- `returns` — explicit `return` statement count.

See [`codelens-lang-rust/src/complexity.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/src/complexity.rs) for the Rust implementation.

## Step 5 — Implement `NativeAst` for `GoAst`

Define a struct that holds whatever data language-specific analyzers need. Name it `GoAst` and make it `pub(crate)`.

**Critical:** the struct must be `Send + Sync`. If the underlying parser uses `Rc` internally (as `proc_macro2` does for Rust — see the inline note in [`codelens-lang-rust/src/parse.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/src/parse.rs)), pre-extract the data you need and drop the parser's AST before constructing `GoAst`. Store only plain `Vec` / owned values:

```rust
pub(crate) struct GoAst {
    // pre-extracted data needed by Go-specific analyzers
    pub(crate) something: Vec<SomePlainType>,
}

impl NativeAst for GoAst {
    fn as_any(&self) -> &dyn Any { self }
}
```

Provide a `pub(crate) fn try_go_ast(parsed: &ParsedFile) -> Option<&GoAst>` to give language-specific analyzers a typed accessor (same pattern as `try_rust_ast` in [`codelens-lang-rust/src/lib.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/src/lib.rs)).

## Step 6 — Optionally add language-specific analyzers

Create `src/analyzers/mod.rs` and `src/analyzers/my_rule.rs`. Implement [`codelens_core::Analyzer`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-core/src/analyzer.rs) and set `supported_languages()` to `SupportedLanguages::Only(&[LanguageId("go")])`.

Language-specific analyzers call `try_go_ast(file)` to reach the `GoAst` data. See [`codelens-lang-rust/src/analyzers/unsafe_block.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/src/analyzers/unsafe_block.rs) as a model.

## Step 7 — Expose `pub fn register(registry: &mut Registry)`

In `src/lib.rs`:

```rust
pub fn register(registry: &mut Registry) {
    registry.add_language(Box::new(GoLanguage));
    // add any language-specific analyzers:
    registry.add_analyzer(Box::new(analyzers::my_rule::MyAnalyzer));
}
```

See [`codelens-lang-rust/src/lib.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/src/lib.rs) and [`codelens-lang-python/src/lib.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-python/src/lib.rs).

## Step 8 — Wire into `build_registry()`

Add the crate as a dependency of `codelens-registry` (which is shared by both the CLI and the LSP):

```toml
# crates/codelens-registry/Cargo.toml
codelens-lang-go = { path = "../codelens-lang-go" }
```

Then call `register` in [`codelens-registry/src/lib.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-registry/src/lib.rs):

```rust
codelens_lang_go::register(&mut registry);
```

No changes to `codelens-core`, `codelens-analyzers`, or any other language crate are needed. The cross-language analyzers automatically support Go because they read `SemanticIndex`, which your new frontend already populates.

## Verifying

```bash
cargo build --workspace && cargo test --workspace
```
