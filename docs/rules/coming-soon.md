---
title: Coming soon
sidebar_label: Coming soon
description: Rules listed in the codelens v1 spec that are not yet shipped.
---

# Coming soon

The codelens v1 spec defines 17 rules across five dimensions. Nine of those are shipped today (see the [rules index](/rules/)). The eight rules listed below are part of the spec but not yet implemented.

Track progress on the [GitHub issue tracker](https://github.com/shubhamkaushal/codelens/issues).

## Unbuilt rules

| Rule ID | Dimension | Default severity | Languages | Status note |
| --- | --- | --- | --- | --- |
| MAINT002-cognitive | Maintainability | Medium | All | Sonar-style cognitive complexity, threshold 15. Needs per-language design pass. |
| SEC003-shell-injection | Security | High | All | String-concat into `subprocess`, `child_process.exec`. Needs string-flow heuristics. |
| SEC004-weak-crypto | Security | Medium | All | MD5 / SHA1 detection in security contexts. |
| CPLX001-fan-out | Complexity | Low | All | Per-module out-degree threshold. Needs project-level module graph. |
| CPLX002-cyclic-deps | Complexity | High | All | Module-level cycle detection. Needs project-level module graph. |
| TEST001-test-ratio | TestSmell | Low | All | Test-to-source ratio per directory. |
| TEST002-no-asserts | TestSmell | Medium | All | Test files with no detected assertions. Needs assertion-detection heuristic. |
| TEST003-skipped | TestSmell | Info | All | Skipped / ignored test count. Needs skip-marker detection. |

:::info
Severities and language scope reflect [ARCH_SPEC § 6](https://github.com/shubhamkaushal/codelens/blob/main/.agent/ARCH_SPEC.md). They may shift before the rule ships.
:::
