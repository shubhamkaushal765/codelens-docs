# AGENTS.md — codelens-docs

Quick reference for AI agents and humans working on the codelens documentation site.

---

## What this is

`codelens-docs` is the public documentation site for [codelens](https://github.com/shubhamkaushal/codelens), built with [Docusaurus 3](https://docusaurus.io/). It is a static site authored in MDX, deployed to GitHub Pages.

The codelens source crate lives in a sibling directory: `/Users/coolmajor/VSCodeProjects/codelens/`. The `.agent/`, `docs/rules/`, and other source-of-truth markdown there is the canonical content base — this site adapts that material for end users.

---

## Where to look first

| You want to …                | Read                                                       |
| ---------------------------- | ---------------------------------------------------------- |
| Understand the site layout   | [.agent/ARCHITECTURE.md](./.agent/ARCHITECTURE.md)         |
| Run / build / preview locally | [.agent/DEV.md](./.agent/DEV.md)                          |
| Follow doc style             | [.agent/DOCS.md](./.agent/DOCS.md)                         |
| Follow code conventions      | [.agent/CONVENTIONS.md](./.agent/CONVENTIONS.md)           |
| Author or update content     | `docs/` — sidebar order in [sidebars.ts](./sidebars.ts)    |
| The codelens source repo     | `/Users/coolmajor/VSCodeProjects/codelens/`                |

---

## Stack

| Item       | Value                                               |
| ---------- | --------------------------------------------------- |
| Framework  | Docusaurus 3.x (classic preset, TypeScript config)  |
| Content    | MDX (Markdown + JSX), with Docusaurus admonitions   |
| Code highlighting | Prism, with `rust`, `toml`, `bash`, `json`, `python` |
| Routing    | docs at site root (`routeBasePath: '/'`)            |
| Deployment | GitHub Pages (`shubhamkaushal765.github.io/codelens-docs/`) |
| Node       | v20+ (CI uses latest stable)                        |

---

## Build / preview

```bash
npm install                # one-time
npm run start              # dev server with HMR (http://localhost:3000)
npm run build              # static build to ./build
npm run serve              # serve ./build locally
npm run typecheck          # tsc --noEmit
```

`onBrokenLinks: 'throw'` in [docusaurus.config.ts](./docusaurus.config.ts) gates the build on every internal link being valid. A failing `npm run build` is treated as a test failure.

---

## Sidebar / IA

The information architecture mirrors the user journey:

1. **Introduction** — what codelens is
2. **Getting started** — install, first analysis, reading output
3. **Concepts** — dimensions, analyzers, severity, scoring
4. **CLI reference** — `analyze`, `list`, `init`
5. **Configuration** — `codelens.toml`, per-rule config, baselines
6. **Output formats** — terminal, JSON, JSON schema, Markdown, SARIF
7. **Rules reference** — one page per rule
8. **Extending codelens** — adding a language / analyzer
9. **Architecture** — data flow, two-axis extensibility

Order is set explicitly in [sidebars.ts](./sidebars.ts).

---

## Adding a page

1. Create a new MDX file under the appropriate `docs/<section>/` folder.
2. Add the page id to [sidebars.ts](./sidebars.ts).
3. Run `npm run build` to verify links and frontmatter.
4. Update [.agent/ARCHITECTURE.md](./.agent/ARCHITECTURE.md) if the change introduces a new section.

---

## Adding a rule page

When a new analyzer ships in the codelens repo:

1. Copy the canonical rule doc from `../codelens/docs/rules/<RULE_ID>.md`.
2. Adapt links — replace `../../crates/...` paths with GitHub blob URLs, keep external references as-is.
3. Save to `docs/rules/<RULE_ID>.md`.
4. Add the id to the `Rules reference` category in [sidebars.ts](./sidebars.ts).

See [.agent/DOCS.md](./.agent/DOCS.md) for the rule-page template.
