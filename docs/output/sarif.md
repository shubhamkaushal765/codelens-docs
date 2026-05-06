---
title: SARIF output
sidebar_label: SARIF
description: SARIF 2.1.0 output for GitHub code scanning and other SARIF consumers.
---

# SARIF output

codelens emits SARIF 2.1.0 via `--format sarif`. Use this format to upload findings to GitHub code scanning or any other SARIF-aware platform.

```bash
codelens analyze ./src --format sarif --output results.sarif
```

## What is emitted

- A single merged `run` object with all findings as `results`.
- CWE and OWASP taxonomy are emitted as result-level `taxa` (SARIF `taxonomyReferences`).
- Each finding's `location` maps to a SARIF `physicalLocation` with a `region` (line/column).
- `rule` objects in `tool.driver.rules` carry the rule ID, short description, and severity.

## GitHub Actions integration

The [GitHub Action](/integrations/github-action) runs SARIF analysis and uploads automatically:

```yaml
- uses: shubhamkaushal765/codelens@main
  with:
    format: "sarif"
    fail-on: "high"
```

For manual upload:

```yaml
- run: codelens analyze . --format sarif --output results.sarif
  continue-on-error: true
- uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: results.sarif
```

## When to prefer JSON

For programmatic access — extracting findings, gating CI, or aggregating across runs — use [JSON](./json) instead. JSON is the stable contract; SARIF is a presentation format for code-scanning integrations.

## References

- [SARIF 2.1.0 specification (OASIS)](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html)
- [GitHub code scanning documentation](https://docs.github.com/en/code-security/code-scanning)
