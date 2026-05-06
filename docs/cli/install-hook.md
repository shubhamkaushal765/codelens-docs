---
title: codelens install-hook
description: Write a git pre-commit hook that runs codelens on every commit.
---

# codelens install-hook

```
codelens install-hook
```

Writes a git pre-commit hook to `.git/hooks/pre-commit` in the current repository. The hook runs `codelens analyze --fail-on medium` before each commit and aborts the commit if any finding at `medium` severity or above is found.

## What it writes

The generated hook script:

```bash
#!/usr/bin/env bash
set -e
codelens analyze --fail-on medium
```

If `.git/hooks/pre-commit` already exists, `codelens install-hook` appends the codelens invocation rather than overwriting the file.

## Flags

| Flag            | Default | Description |
| --------------- | ------- | ----------- |
| `-h`, `--help`  |         | Print help. |

## Customising

To change the severity threshold, edit `.git/hooks/pre-commit` directly:

```bash
codelens analyze --fail-on high
```

To use a baseline so only new findings block commits:

```bash
codelens analyze --baseline codelens-baseline.json --fail-on medium
```

:::note
The hook is local to your working copy and is not committed to the repository. Share the hook contents in team documentation or use a tool like [pre-commit](https://pre-commit.com/) for project-wide enforcement.
:::

## See also

- [`codelens analyze`](/cli/analyze)
- [Baselines and fail-on](/configuration/baselines-and-fail-on)
