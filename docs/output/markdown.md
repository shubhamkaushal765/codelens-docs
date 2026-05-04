---
title: Markdown output
sidebar_label: Markdown
description: PR-friendly Markdown reports with a top-level scoreboard and collapsible details, suited for posting on GitHub pull requests.
---

# Markdown output

The Markdown format is designed for posting analysis results as a comment on a pull request. It renders cleanly on GitHub, GitLab, and most other platforms that support GitHub-flavoured Markdown.

```bash
codelens analyze ./src --format md
```

Both `md` and `markdown` are accepted:

```bash
codelens analyze ./src --format markdown --output report.md
```

## Layout

| Section          | Form                                                       |
| ---------------- | ---------------------------------------------------------- |
| Top-level title  | `# codelens report`                                        |
| Scoreboard       | A table with one row per dimension and a final score      |
| Per-dimension    | A `<details>` block, collapsed by default, with findings  |

The collapsible `<details>` blocks keep the comment short by default and let reviewers expand only the dimensions they care about.

## Example

````markdown
# codelens report

| Dimension       | Score | Findings |
| --------------- | ----- | -------- |
| Maintainability | 84.5  | 3        |
| Security        | 100.0 | 0        |
| Complexity      | 100.0 | 0        |
| Documentation   | 78.0  | 4        |
| Test smell      | 95.0  | 1        |

<details>
<summary>Maintainability — 3 findings</summary>

- **MAINT001-cyclomatic** [Medium] `src/lib.rs:12:1` — Function 'parse_request' has cyclomatic complexity 14 (threshold: 10).
- **MAINT003-fn-length** [Low] `src/lib.rs:60:1` — Function 'render' is 92 lines (threshold: 80).
- **MAINT004-file-length** [Low] `src/parse.rs:1:1` — File is 612 lines (threshold: 500).

</details>
````

:::tip
Pipe directly to `gh pr comment` to post the report on the current PR:

```bash
codelens analyze ./src --format md | gh pr comment --body-file -
```
:::

## When to prefer JSON

For programmatic access — extracting findings, gating CI, or aggregating across runs — use [JSON](./json) instead. Markdown is a presentation format; JSON is the stable contract.
