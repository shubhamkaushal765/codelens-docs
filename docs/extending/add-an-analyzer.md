---
title: Add an analyzer
description: Add a new cross-language or language-specific analyzer to codelens without touching existing language frontends.
---

# Add an analyzer

Adding an analyzer never requires changes to a language frontend. There are two cases: a *cross-language* rule that reads only `SemanticIndex` and lives in `codelens-analyzers`, and a *language-specific* rule that needs the native AST and lives inside its language crate.

## Cross-language rule

A cross-language rule lives in `codelens-analyzers` and operates on `SemanticIndex` only.

### Step 1 — Implement `Analyzer`

Create `crates/codelens-analyzers/src/my_rule.rs`. Implement `Analyzer`. Set `supported_languages()` to `SupportedLanguages::All` (or restrict to a subset of `LanguageId`s without importing any language crate). Your `analyze_file` receives a `&ParsedFile` and calls `file.index()` — never `file.native::<T>()`.

Example rule shape (following [`cyclomatic.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-analyzers/src/cyclomatic.rs)):

```rust
pub struct MyRuleAnalyzer;

impl Analyzer for MyRuleAnalyzer {
    fn id(&self) -> AnalyzerId { AnalyzerId::new("my-rule") }
    fn dimension(&self) -> Dimension { Dimension::Maintainability }
    fn supported_languages(&self) -> SupportedLanguages { SupportedLanguages::All }
    fn rules(&self) -> &[RuleMeta] { &[/* ... */] }
    fn analyze_file(&self, ctx: &AnalysisContext<'_>, file: &ParsedFile) -> Vec<Finding> {
        file.index().functions.iter()
            .filter(|f| /* condition */)
            .map(|f| Finding { /* ... */ })
            .collect()
    }
}
```

### Step 2 — Register in `builtin()`

Register in [`codelens-analyzers/src/lib.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-analyzers/src/lib.rs):

```rust
pub fn builtin() -> Vec<Box<dyn Analyzer>> {
    vec![
        Box::new(CyclomaticAnalyzer),
        Box::new(PublicApiUndocAnalyzer),
        Box::new(HardcodedSecretAnalyzer),
        Box::new(MyRuleAnalyzer),   // add here
    ]
}
```

The `build_registry()` function in `codelens-registry` calls `builtin()` and picks up the new analyzer automatically — no CLI or LSP edit needed.

### Step 3 — Assign a `rule_id`

Use the format `<DIM><NNN>-slug`, e.g. `MAINT002-fan-out`. The prefix encodes the dimension:

| Prefix  | Dimension       |
| ------- | --------------- |
| `MAINT` | Maintainability |
| `SEC`   | Security        |
| `CMPLX` | Complexity      |
| `DOC`   | Documentation   |
| `TEST`  | TestSmell       |

### Step 4 — Document the rule

Create `docs/rules/<rule_id>.md` in the codelens-docs repo. Include: what it detects, why it matters, fix guidance, positive + negative fixture examples, and config knobs if any. See existing rule pages under [Rules reference](/rules/) for the expected structure.

### Step 5 — Add fixtures and tests

Add a fixture file under `fixtures/<language>/` that triggers the finding, and a negative fixture that does not. Run `cargo test --workspace` to verify the inline unit tests pass.

## Language-specific rule

A language-specific rule lives inside its language crate, not in `codelens-analyzers`.

### Step 1 — Implement `Analyzer` against the native AST

Create `crates/codelens-lang-X/src/analyzers/my_rule.rs`. Access the native AST via `try_x_ast(file)`:

```rust
pub struct MyLangRuleAnalyzer;

impl Analyzer for MyLangRuleAnalyzer {
    fn analyze_file(&self, _ctx: &AnalysisContext<'_>, file: &ParsedFile) -> Vec<Finding> {
        let Some(ast) = try_x_ast(file) else { return vec![] };
        // use ast.something to produce findings
        todo!()
    }
    // ...
}
```

See [`unsafe_block.rs`](https://github.com/shubhamkaushal765/codelens/blob/main/crates/codelens-lang-rust/src/analyzers/unsafe_block.rs) for the complete Rust example.

### Step 2 — Register in the language crate

Register inside the language crate's `register()` function (see Step 7 in [Add a language frontend](/extending/add-a-language)).

### Step 3 — Assign a `rule_id`

Follow the same `<DIM><NNN>-slug` format, but conventionally append the language tag for language-specific rules: `SEC101-rust-unsafe`, `SEC002-python-eval-sink`.

### Step 4 — Document the rule

Write `docs/rules/<rule_id>.md` with positive and negative fixture examples for the target language.

## Verifying

```bash
cargo build --workspace && cargo test --workspace
```
