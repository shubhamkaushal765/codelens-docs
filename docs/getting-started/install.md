---
title: Install
description: Install codelens via cargo install or build from source. Binary name is codelens.
---

# Install

## Prerequisites

- A stable Rust toolchain. The MSRV is the latest stable minus one minor — currently **Rust 1.93**.

If you do not have Rust installed, get it from [https://rustup.rs](https://rustup.rs). `rustup` installs `cargo` and the stable toolchain together.

## Install via cargo

```bash
cargo install --locked codelens
```

The binary is named `codelens`. After install, verify it is on your `PATH`:

```bash
codelens --version
```

## Build from source

```bash
git clone https://github.com/shubhamkaushal765/codelens
cd codelens
cargo build --release -p codelens-cli
```

The binary is written to `target/release/codelens`. Add that directory to your `PATH`, or invoke the binary directly with `./target/release/codelens`.

## GitHub Action

To run codelens in CI without managing a Rust install yourself, use the composite Action at the repo root:

```yaml
- uses: shubhamkaushal765/codelens@main
  with:
    path: "."
    fail-on: "medium"
```

See [GitHub Action](/integrations/github-action) for the full input reference.

## Language support

codelens reads file extensions to dispatch to a language frontend. The current support matrix:

| Language                | Status | Notes                                                                              |
| ----------------------- | ------ | ---------------------------------------------------------------------------------- |
| Rust                    | full   | `syn`-backed                                                                       |
| Python                  | full   | `rustpython-parser`-backed                                                         |
| JavaScript / TypeScript | full   | `oxc_parser`; covers `.js`, `.mjs`, `.cjs`, `.jsx`, `.ts`, `.mts`, `.cts`, `.tsx` |
| Go                      | stub   | No maintained native Rust Go parser; returns `Unsupported`                         |

Files in unsupported languages are skipped rather than failing the run. The skipped count appears in `stats.parse_failures` in JSON output.
