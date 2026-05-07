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

### CSS / styling

- Never hardcode hex values in CSS. Always use `--cl-*` semantic tokens.
- Raw ramp tokens (`--codelens-blue-N`, `--codelens-slate-N`, `--codelens-amber-N`) are for deriving semantic tokens only — not for direct use in components.
- Keep all hover/focus transition durations at `150ms ease`. Never exceed `150ms`.
- Use `--cl-focus-ring` for focus outlines. Never suppress focus outlines with `outline: none`.
- Respect dark mode: every color you set must have a corresponding value in `[data-theme='dark']` (either via a `--cl-*` variable that already has a dark value, or an explicit override).
- Full design system contract: [.agent/DESIGN.md](./DESIGN.md).

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

---

## Diagrams & SVG

### Placement

| Context | Method |
| ------- | ------ |
| MDX docs (`docs/`) | Mermaid fenced block (` ```mermaid `) |
| React pages (`src/pages/`) | Inline `<svg>` element |
| Large standalone illustration | `.svg` file in `static/img/`, referenced via `<img>` or `useBaseUrl` |

### When to add a Mermaid diagram

Add a diagram only when it materially aids comprehension that prose alone cannot convey (e.g. a multi-step pipeline, a dependency graph). Do not add one per page by default.

### Palette tokens to use in diagrams

Use semantic CSS variable names. For SVG-portable cases where CSS variables are not available, the hex equivalents are noted in parentheses.

| Purpose | CSS token | SVG hex (light) |
| ------- | --------- | --------------- |
| Primary / node fill | `--cl-accent-primary` | `#1a4480` |
| Accent / focal element | `--cl-accent-secondary` | `#9a6200` |
| Edge / line color | `--codelens-slate-500` | `#6b7890` |
| Background surface | `--cl-surface-code` | `#f1f4f9` |
| Node border | `--cl-accent-primary` | `#1a4480` |
| Cluster background | `--cl-surface-card` | `#eef2f8` |

Diagram fills in `static/img/*.svg` files should reference the hex values from the design system — see [.agent/DESIGN.md](./DESIGN.md).

### SVG conventions

- Square logo viewBox: `0 0 64 64`.
- Illustrations: viewBox up to `0 0 800 400`.
- Use `currentColor` where fills should follow the theme.
- One descriptive comment at the top of each SVG file.
- No raster images, no text elements in decorative SVGs.
- Use `fill` attributes matching the palette rather than CSS classes for portability.
