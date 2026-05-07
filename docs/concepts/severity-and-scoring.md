---
title: Severity and scoring
description: The five severity levels, their weights, and the per-dimension 0–100 score formula.
---

import SeverityWeights from '@site/src/components/diagrams/SeverityWeights';

# Severity and scoring

Every finding has a severity. Severities have integer weights, weights are summed per dimension, the sum is normalized by project size, and the dimension score is `100 - penalty`.

## Severity weights

<SeverityWeights />

| Severity   | Weight |
| ---------- | ------ |
| `info`     | 0      |
| `low`      | 1      |
| `medium`   | 4      |
| `high`     | 12     |
| `critical` | 30     |

`info` findings have weight 0 — they appear in the report but do not change the score.

## Score formula

For each dimension:

```text
weighted_sum = Σ weights[finding.severity]      (over findings in this dimension)
penalty      = clamp(weighted_sum / max(kloc, 1), 0, 100)
score        = 100 - penalty
```

Where `kloc` is the project's effective lines of code in supported languages. In v1 `kloc` is computed from total source bytes divided by 80; this heuristic will be replaced with a real line counter in a future release.

The score is a `f32` clamped to `0..=100`. Higher is better.

## Worked example

A 5,000-line project (kloc = 5) has these Security findings:

- 1 critical (weight 30)
- 2 high (weight 12 each, total 24)
- 3 medium (weight 4 each, total 12)

```text
weighted_sum = 30 + 24 + 12 = 66
penalty      = clamp(66 / 5, 0, 100) = 13.2
security     = 100 - 13.2 = 86.8
```

The Security score is **86.8**.

:::note
Custom dimensions (via the `Custom` variant on `Dimension`) work the same way — the formula does not special-case the five built-in dimensions.
:::

## Tuning per rule

Per-rule severity overrides live in `codelens.toml`:

```toml
[rules.SEC001-hardcoded-secret]
severity = "critical"
```

See [Per-rule configuration](/configuration/per-rule-config).
