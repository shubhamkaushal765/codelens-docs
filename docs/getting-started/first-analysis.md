---
title: Your first analysis
description: Walk through running codelens on a project, generating a config, and exploring results in the browser.
---

# Your first analysis

This page walks through a first run of codelens on a small project. The example assumes a layout like:

```text
my-project/
├── src/
│   ├── lib.rs
│   └── main.rs
└── Cargo.toml
```

## Step 1 — Run a one-shot analysis

Point `codelens analyze` at any directory containing Rust, Python, or JavaScript/TypeScript source. No configuration is required for this first run.

```bash
codelens analyze ./src --format terminal
```

codelens walks the directory, parses every supported file in parallel, runs each registered analyzer, and prints a terminal report. The walk respects `.gitignore` and skips common vendor directories by default.

## Step 2 — Read the terminal output

The report groups findings by dimension and severity, then prints a closing scoreboard with one 0–100 score and an A–F grade per dimension. See [Reading the output](/getting-started/reading-output) for an annotated example.

## Step 3 — Explore the dashboard

After the run, open the interactive history dashboard:

```bash
codelens show
```

This starts a background HTTP server and opens a browser tab with Overview, Scans, Findings, Trends, Diff, Heatmap, and Config tabs. Every subsequent `codelens analyze` run is automatically saved to history.

To skip saving a run: `codelens analyze ./src --no-save`.

## Step 4 — Generate a config

Once you know which rules and severities matter for your project, generate a `codelens.toml` with the defaults:

```bash
codelens init
```

`codelens init` writes `codelens.toml` to the current directory. The file contains commented sections for the `[general]` block (excludes, language list), one `[dimensions.<name>]` block per dimension, and per-rule overrides under `[rules.<rule_id>]`. See the [codelens.toml reference](/configuration/codelens-toml) for every field.

## Step 5 — Re-run with the config

When `codelens.toml` is present at the project root, codelens auto-discovers it by walking upward from the analyzed path. You can run from the project root:

```bash
codelens analyze .
```

…or override the discovery with `--config <path>`:

```bash
codelens analyze ./src --config ./codelens.toml
```

The full flag list is documented in [`codelens analyze`](/cli/analyze).
