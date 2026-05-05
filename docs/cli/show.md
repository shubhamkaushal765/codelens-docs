---
title: codelens show
---

# codelens show

Open the scan-history viewer in a browser.

## Usage

| Command          | Effect                                                   |
| ---------------- | -------------------------------------------------------- |
| `codelens show`  | Start the daemon if not running, then open the browser. |
| `codelens stop`  | Stop the running daemon.                                |
| `codelens status`| Print daemon state.                                     |

## How history works

Every successful `codelens analyze` automatically saves a snapshot to
`~/.codelens/projects/<hash>/scans/`. The viewer lists all projects and
their scans, lets you delete individual scans, and shows score trends per
dimension.

To opt out for a single run: `codelens analyze --no-save …`.
To disable globally, add to `codelens.toml`:

```toml
[history]
auto_save = false
```

## Configuration

| Field                          | Default | Description                                      |
| ------------------------------ | ------- | ------------------------------------------------ |
| `history.auto_save`            | `true`  | When false, scans are never written.            |
| `history.max_scans_per_project`| `100`   | Older scans are pruned on write when exceeded.  |
