---
title: Per-rule configuration
description: Configure individual rules with [rules.<rule_id>] tables — enable, severity, and rule-specific knobs.
---

# Per-rule configuration

Every rule registered with `codelens` has a stable `rule_id` (for example `MAINT001-cyclomatic`). To configure a rule, add a `[rules.<rule_id>]` table to your `codelens.toml`.

## Universal keys

These two keys work on every rule:

| Key        | Type   | Default        | Description                                                            |
| ---------- | ------ | -------------- | ---------------------------------------------------------------------- |
| `enabled`  | bool   | `true`         | Turn the rule off entirely.                                            |
| `severity` | string | rule's default | Override severity. One of `info`, `low`, `medium`, `high`, `critical`. |

## Rule-specific knobs

Some rules accept additional keys. The table below lists every rule that exposes a knob beyond the universal pair. Rules not listed here only accept `enabled` and `severity`.

| Rule ID                 | Knob        | Default | Description                                              |
| ----------------------- | ----------- | ------- | -------------------------------------------------------- |
| `MAINT001-cyclomatic`   | `threshold` | `10`    | Cyclomatic complexity at which a function is flagged.    |
| `MAINT003-fn-length`    | `threshold` | `80`    | Maximum function length in lines before a finding fires. |
| `MAINT004-file-length`  | `threshold` | `600`   | Maximum file length in lines.                            |
| `MAINT005-deep-nesting` | `threshold` | `4`     | Maximum block-nesting depth.                             |

Cross-reference each rule's page under [Rules reference](/rules) for the full semantics — what is counted, how it is counted, and per-language notes.

## Examples

Disable a rule:

```toml
[rules.DOC002-todo-fixme]
enabled = false
```

Lower the severity of a noisy rule so it still reports but does not gate CI when you set `--fail-on high`:

```toml
[rules.MAINT003-fn-length]
severity = "low"
```

Raise the cyclomatic-complexity threshold for a codebase with intentionally long match statements:

```toml
[rules.MAINT001-cyclomatic]
threshold = 15
```

:::note
`enabled = false` excludes the rule's findings entirely — they do not appear in the report, do not affect any dimension's score, and are not counted by `--fail-on`. Use `severity = "info"` if you want the findings visible without gating CI.
:::

## See also

- [`codelens.toml` reference](/configuration/codelens-toml)
- [Baselines and fail-on](/configuration/baselines-and-fail-on)
- [Severity and scoring](/concepts/severity-and-scoring)
