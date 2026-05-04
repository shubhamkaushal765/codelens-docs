---
title: Install
description: Install codelens by building from source. Source install is the only supported path in v1.
---

# Install

## Prerequisites

- A stable Rust toolchain. The MSRV is the latest stable minus one minor — currently **Rust 1.93**.
- `git`, to clone the repository.

If you do not have Rust installed, get it from [https://rustup.rs](https://rustup.rs). `rustup` installs `cargo` and the stable toolchain together.

## Build from source

Source install is the only supported path in v1.

```bash
git clone https://github.com/shubhamkaushal/codelens
cd codelens
cargo build --release -p codelens-cli
```

The binary is written to `target/release/codelens`. Add that directory to your `PATH`, or invoke the binary directly with `./target/release/codelens`.

## Verifying

```bash
codelens --version
```

The command should print the codelens version. If it prints a `command not found` error, the binary is not on your `PATH`.

:::info
Pre-built binaries and package-manager distribution are tracked for v2.
:::

## Language support

codelens reads file extensions to dispatch to a language frontend. The current support matrix:

| Language                | Status        | Notes                                                                |
| ----------------------- | ------------- | -------------------------------------------------------------------- |
| Rust                    | full          | `syn`-backed                                                         |
| Python                  | full          | `rustpython-parser`-backed                                           |
| JavaScript / TypeScript | scaffold-only | `oxc_parser` integration deferred — files return `Unsupported`       |
| Go                      | stub          | No maintained native Rust Go parser; returns `Unsupported`           |

Files in unsupported languages are skipped rather than failing the run. The skipped count appears in `stats.parse_failures` in JSON output.
