# DOCS.md — Documentation Style Guide

**Last reviewed:** 2026-05-06

How to write and maintain content for the codelens-docs site. Adapted from `/home/user/codelens/.agent/DOCS.md`.

---

## Audience

Assume readers know:

- Basic Rust (you can read `fn`, `let`, `pub`, traits)
- What static analysis is (broadly)
- How to use a CLI

Do NOT assume readers know:

- Specific complexity metrics (cyclomatic, cognitive)
- SARIF, OSC-8, or other niche formats
- The internals of `codelens` crates

When you introduce a term, define it on first use or link to the page that defines it.

---

## Voice

- Clear, concise, professional. No marketing copy, no exclamation marks.
- Second person (`you run`, `you configure`).
- Present tense for behavior (`codelens emits a finding`).
- Imperative for instructions (`Run`, `Open`, `Add`).
- Front-load conclusions; explain why second.

---

## Structure

1. **One H1 per file**, matching the page title in frontmatter.
2. Use H2 for top-level sections, H3 for subsections. Avoid H4+.
3. **Tables over prose** wherever a table fits.
4. Code examples only when the example *is* the rule (e.g. config snippets, CLI invocations).
5. Lead with what; details after.

---

## Frontmatter

Every page has frontmatter:

```yaml
---
title: Cyclomatic complexity
sidebar_label: MAINT001-cyclomatic   # only when display label differs from title
description: Detects functions whose cyclomatic complexity exceeds a threshold.
---
```

`description` powers OG tags and search snippets; keep under 160 chars.

---

## Admonitions

Use Docusaurus admonitions for callouts. Keep them short (≤2 sentences each).

| Admonition  | When                                                                  |
| ----------- | --------------------------------------------------------------------- |
| `:::tip`    | Practical advice that improves the user's experience                  |
| `:::note`   | Side information that's useful but not strictly necessary             |
| `:::caution` | Behavior likely to surprise the reader (mild)                        |
| `:::warning` | Behavior that can cause incorrect results or data loss               |
| `:::info`   | Version, scope, or status notes (e.g. "available since v1.2")        |

Example:

```markdown
:::tip
Run `codelens init` to write a default `codelens.toml` to the current directory.
:::
```

---

## Code blocks

Always specify the language for syntax highlighting:

````markdown
```rust
pub fn example() {}
```

```toml
[rules.MAINT001-cyclomatic]
threshold = 10
```

```bash
codelens analyze ./src --format json
```
````

Available Prism languages: `rust`, `python`, `toml`, `bash`, `json`, plus all defaults.

---

## Links

| Where to                              | How to write                                                            |
| ------------------------------------- | ----------------------------------------------------------------------- |
| Another doc page (same site)          | `[label](/path/to-page)` or `[label](./relative-page)`                  |
| A specific section on this site       | `[label](/path/to-page#anchor-id)`                                      |
| codelens source code on GitHub        | `[label](https://github.com/shubhamkaushal765/codelens/blob/main/...)`     |
| External standards (CWE, OWASP, etc.) | Plain URL link with descriptive label                                   |

`onBrokenLinks: 'throw'` will fail the build on any broken internal link.

---

## Rule-page template

Every page under `docs/rules/<RULE_ID>.md` follows this structure:

```markdown
---
title: <RULE_ID> — <human title>
sidebar_label: <RULE_ID>
description: <one-line summary ≤160 chars>
---

# <RULE_ID> — <human title>

| Property         | Value                                  |
| ---------------- | -------------------------------------- |
| Dimension        | <Dimension>                            |
| Default severity | <Severity>                             |
| Languages        | <list or "All">                        |
| CWE              | CWE-NNN (if applicable, else omit row) |
| OWASP            | AXX:20YY (if applicable, else omit)    |

## What it detects
…

## Why it matters
…

## Configuration
… (or "No configuration knobs beyond `enabled` and `severity`.")

## Examples — flagged
…

## Examples — not flagged
…

## Fix guidance
…

## References
- External standards (CWE, OWASP, etc.)
```

The `CWE` and `OWASP` rows in the property table are optional — include only when the rule maps to a standard. The source of truth for all mappings is [`docs/taxonomy.md`](https://github.com/shubhamkaushal765/codelens/blob/main/docs/taxonomy.md) in the codelens repo.

---

## What NOT to write

- Internal implementation details — link to the crate's `cargo doc` instead.
- Past-tense changelogs in page bodies — use a dedicated changelog page if needed.
- Speculation about future features — link to a GitHub issue or omit.
- Marketing copy ("powerful", "blazing-fast", "industry-leading"). State the fact.

---

## When to update

| Trigger                              | Files                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------ |
| New rule ships in codelens           | `docs/rules/<RULE_ID>.md`, [sidebars.ts](../sidebars.ts)                 |
| New CLI subcommand                   | `docs/cli/<subcommand>.md`, [sidebars.ts](../sidebars.ts), `AGENTS.md` IA |
| New CLI flag on analyze              | `docs/cli/analyze.md`                                                    |
| New config knob                      | `docs/configuration/codelens-toml.md`                                    |
| New output format                    | `docs/output/<format>.md`, sidebar                                       |
| Schema bump                          | `docs/output/json-schema.md`, `docs/output/json.md`                      |
| New language                         | `docs/getting-started/install.md`, `docs/intro.md`                       |
| New integration                      | `docs/integrations/<name>.md`, [sidebars.ts](../sidebars.ts)             |

Reviewers should catch missing updates; CI does not gate on doc freshness.
