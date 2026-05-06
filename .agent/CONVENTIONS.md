# CONVENTIONS.md — Code & content conventions

How to write and structure code and content in this repo.

**Last reviewed:** 2026-05-06

---

## File and directory naming

| Item                              | Convention                  | Example                                  |
| --------------------------------- | --------------------------- | ---------------------------------------- |
| MDX content files                 | `kebab-case.md`             | `getting-started/install.md`             |
| Rule reference files              | `<RULE_ID>.md` (UPPER)      | `rules/MAINT001-cyclomatic.md`           |
| React components                  | `PascalCase.tsx`            | `src/components/Hero/Hero.tsx`           |
| CSS modules                       | `<Component>.module.css`    | `src/pages/index.module.css`             |
| Sidebar ids                       | match file path minus `.md` | `getting-started/install`                |
| New section directories           | `kebab-case/`               | `docs/integrations/`, `docs/cli/`        |

---

## Frontmatter

Every doc page has frontmatter. Required keys:

```yaml
---
title: <full page title>
description: <≤160 chars; powers OG and search snippet>
---
```

Optional keys when needed:

```yaml
sidebar_label: <override the label shown in the sidebar>
sidebar_position: <number, only when explicit ordering is needed>
slug: <override the URL>          # rare; the default file-path mapping is preferred
```

---

## Commit style

Use [Conventional Commits](https://www.conventionalcommits.org/).

| Type       | Use                                                          |
| ---------- | ------------------------------------------------------------ |
| `docs`     | Default for content changes (new pages, rewrites, tweaks)    |
| `feat`     | New feature in the site itself (new component, new section)  |
| `fix`      | Bug fix (broken link, render bug, typo)                      |
| `chore`    | Dependency bumps, config tweaks, tooling                     |
| `refactor` | Restructuring with no content change (e.g. moving files)     |
| `style`    | Whitespace, formatting only                                  |

Scope examples: `rules`, `cli`, `home`, `nav`, `config`.

Example:

```
docs(rules): add MAINT001-cyclomatic page

Adapted from upstream codelens repo. Includes Rust + Python examples,
configuration notes, and fix guidance.
```

---

## Markdown / MDX style

- One H1 per page (matches frontmatter `title`).
- Tables over bullet lists where a comparison matters.
- Code fences always specify a language (`rust`, `toml`, `bash`, etc.).
- Admonitions for callouts; keep them short (see [DOCS.md](./DOCS.md)).
- Internal links use absolute paths from site root: `[install](/getting-started/install)`.
- External links open in a new tab via Docusaurus default — do not add `target="_blank"` manually.
- No unhandled MDX syntax errors — use `npm run build` to validate before committing.
- `description` frontmatter must be ≤160 chars (powers OG tags and search snippets).
- No marketing copy ("powerful", "blazing-fast"). State the fact directly.

---

## TypeScript / React (in `src/`)

- Components are functional + hooks; class components are not used.
- Props are typed inline for one-off components, exported as `interface` for reusable ones.
- CSS goes in `*.module.css` files; do not inline styles unless purely cosmetic and one-off.
- Imports order: react/docusaurus → third-party → internal alias → relative.

---

## Dependency policy

- Stick to Docusaurus core + classic preset where possible.
- New runtime deps require a justification in the PR description.
- Dev deps for linting/formatting are fine.
- Never commit `node_modules/` or `build/` — both are gitignored.

---

## Branching

- `main` is the default and deployable branch.
- Feature work in topic branches: `docs/<topic>` or `feat/<feature>`.
- PRs target `main`; squash or rebase merges preferred.
