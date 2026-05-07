---
title: codelens install-hook
description: Install a git pre-commit hook that blocks commits when codelens finds issues above a severity threshold.
---

# codelens install-hook

```
codelens install-hook
```

Use `codelens install-hook` to protect your repository at the point of commit. It writes a git pre-commit hook to `.git/hooks/pre-commit` that runs `codelens analyze --fail-on medium` before each commit and aborts the commit if any finding at `medium` severity or above is found.

## When to use this

- Enforce a minimum quality bar for every commit without relying on CI alone.
- Give developers immediate feedback before bad code reaches the remote.
- Combine with a baseline file to block only newly introduced findings.

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
