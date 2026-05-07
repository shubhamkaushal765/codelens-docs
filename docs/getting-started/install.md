---
title: Install
description: Get codelens running in under two minutes with cargo install, or build from source for the latest changes.
---

# Install

## Quickstart

The fastest way to get `codelens` is through cargo, Rust's package manager:

```bash
cargo install --locked codelens
```

Then verify the binary is on your `PATH`:

```bash
codelens --version
```

That's it. Skip to [Your first analysis](/getting-started/first-analysis) when you're ready to scan some code.

## Requirements

You'll need cargo (Rust's package manager) installed. If you don't have it yet, get it from [rustup.rs](https://rustup.rs) — the installer sets up cargo and the Rust toolchain together in one step.

## Build from source

If you want the latest unreleased changes, build directly from the repository:

```bash
git clone https://github.com/shubhamkaushal765/codelens
cd codelens
cargo build --release -p codelens-cli
```

The binary is written to `target/release/codelens`. Add that directory to your `PATH`, or invoke the binary directly:

```bash
./target/release/codelens --version
```

## GitHub Action

To run codelens in CI without managing a Rust install yourself, use the composite Action:

```yaml
- uses: shubhamkaushal765/codelens@main
  with:
    path: "."
    fail-on: "medium"
```

See [GitHub Action](/integrations/github-action) for the full input reference.

## Language support

codelens reads file extensions to decide how to scan each file:

| Language                | Status | Extensions                                           | Notes        |
| ----------------------- | ------ | ---------------------------------------------------- | ------------ |
| Rust                    | Full   | `.rs`                                                | Built-in     |
| Python                  | Full   | `.py`                                                | Built-in     |
| JavaScript / TypeScript | Full   | `.js`, `.mjs`, `.cjs`, `.jsx`, `.ts`, `.mts`, `.cts`, `.tsx` | Built-in     |
| Go                      | Stub   | `.go`                                                | Not yet supported |

Files in unsupported languages are skipped silently — they won't cause the run to fail.
