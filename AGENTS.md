# AGENTS.md — codelens-docs

Quick reference for AI agents and humans working on the codelens documentation site.

---

## What this is

`codelens-docs` is the public documentation site for [codelens](https://github.com/shubhamkaushal765/codelens), built with [Docusaurus 3](https://docusaurus.io/). It is a static site authored in MDX, deployed to GitHub Pages.

The codelens source repo is the canonical source of truth: `/home/user/codelens/`. The `.agent/`, `docs/`, and other source-of-truth markdown there is the content base — this site adapts that material for end users.

---

## Where to look first

| You want to …                       | Read                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| Understand the site layout          | [.agent/ARCHITECTURE.md](./.agent/ARCHITECTURE.md)           |
| Run / build / preview locally       | [.agent/DEV.md](./.agent/DEV.md)                             |
| Follow doc style                    | [.agent/DOCS.md](./.agent/DOCS.md)                           |
| Follow code conventions             | [.agent/CONVENTIONS.md](./.agent/CONVENTIONS.md)             |
| Follow the design system            | [docs/design/color-system.md](./docs/design/color-system.md) and [.agent/DESIGN.md](./.agent/DESIGN.md) |
| Author or update content            | `docs/` — sidebar order in [sidebars.ts](./sidebars.ts)      |
| The codelens source repo            | `/home/user/codelens/`                                       |
| CLI subcommand reference pages      | `docs/cli/`                                                  |
| GitHub Action integration           | `docs/integrations/github-action.md`                         |
| LSP integration                     | `docs/integrations/lsp.md`                                   |
| codelens show dashboard docs        | `docs/cli/show.md`                                           |

---

## Stack

| Item              | Value                                                           |
| ----------------- | --------------------------------------------------------------- |
| Framework         | Docusaurus 3.x (classic preset, TypeScript config)              |
| Content           | MDX (Markdown + JSX), with Docusaurus admonitions               |
| Code highlighting | Prism, with `rust`, `toml`, `bash`, `json`, `python`            |
| Diagrams          | `@docusaurus/theme-mermaid` 3.10.1 (Mermaid in MDX) + reusable React SVG components in `src/components/diagrams/` |
| Routing           | docs at site root (`routeBasePath: '/'`)                        |
| Deployment        | GitHub Pages (`shubhamkaushal765.github.io/codelens-docs/`)     |
| Node              | v20+ (CI uses latest stable)                                    |

---

## Visual identity & diagrams

| Asset | Location |
| ----- | -------- |
| Logo mark (aperture/lens SVG) | `static/img/logo.svg` |
| Hero pipeline illustration | `static/img/codelens-flow.svg` |
| Anatomy of a finding (terminal output) | `static/img/finding-anatomy.svg` |
| Reusable React SVG diagrams | `src/components/diagrams/` (see [.agent/ARCHITECTURE.md](./.agent/ARCHITECTURE.md#diagrams)) |

Brand anchor colors (full palette in [docs/design/color-system.md](./docs/design/color-system.md)):

| Role | Light | Dark |
| ---- | ----- | ---- |
| Primary accent | `#1a4480` (steel blue) | `#7aa7f5` |
| Secondary accent | `#9a6200` (amber) | `#e0a93a` |
| Body text | `#111827` | `#e6edf3` |

Run `node scripts/verify-contrast.mjs` to validate WCAG AA contrast for all palette pairings.

Mermaid diagrams illustrate flows where prose alone is hard to parse — see `intro.md`, `architecture.md` (data flow), `concepts/analyzers-and-findings.md`, `getting-started/first-analysis.md`, `cli/show.md`, `cli/watch.md`, `cli/diff.md`, `cli/baseline.md`, `cli/lsp.md`, `integrations/github-action.md`, `integrations/lsp.md`, `extending/add-a-language.md`, `extending/add-an-analyzer.md`, `configuration/baselines-and-fail-on.md`.

Reusable theme-aware React SVG diagrams live under `src/components/diagrams/`. They consume only `--cl-*` semantic tokens (auto dark/light), include `<title>`/`<desc>` and `aria-labelledby`, and gate motion behind `prefers-reduced-motion`. Current set:

| Component | Embedded in | Purpose |
| --------- | ----------- | ------- |
| `PipelineDiagram` | `intro.md`, `architecture.md` | Animated 5-stage analysis pipeline |
| `TwoAxisExtensibility` | `architecture.md` | Crate dependency contract — visual proof that lang and analyzer crates do not import each other |
| `DimensionsHexagon` | `concepts/dimensions.md` | Pentagon layout of the 5 dimensions with hover tooltips |
| `SeverityWeights` | `concepts/severity-and-scoring.md` | Bar visualization of the 0/1/4/12/30 weights |

To add a new component, follow the checklist in [.agent/ARCHITECTURE.md → Adding a React diagram component](./.agent/ARCHITECTURE.md#adding-a-react-diagram-component).

`docs/getting-started/reading-output.md` uses the standalone `static/img/finding-anatomy.svg` illustration. The homepage (`src/pages/index.tsx`) uses inline SVG for the pipeline visual, not Mermaid, because it is a React component.

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

1. **Introduction** — what codelens is (25 rules, 3 languages, show/LSP/Action)
2. **Getting started** — install, first analysis, reading output
3. **Concepts** — dimensions, analyzers, severity, scoring
4. **CLI reference** — `analyze`/`scan`, `list`, `init`, `show`/`stop`/`status`, `report`, `diff`, `baseline`, `watch`, `install-hook`, `lsp`
5. **Configuration** — `codelens.toml`, per-rule config, baselines and fail-on
6. **Output formats** — terminal, JSON, JSON schema, Markdown, SARIF
7. **Integrations** — GitHub Action, LSP
8. **Rules reference** — one page per rule
9. **Extending codelens** — adding a language / analyzer
10. **Architecture** — workspace crates, data flow, two-axis extensibility, incremental cache

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

1. Copy the canonical rule doc from `../codelens/docs/rules/<RULE_ID>.md` (if present) or write from scratch.
2. Adapt links — replace `../../crates/...` paths with GitHub blob URLs, keep external references as-is.
3. Save to `docs/rules/<RULE_ID>.md`.
4. Add the id to the `Rules reference` category in [sidebars.ts](./sidebars.ts).

See [.agent/DOCS.md](./.agent/DOCS.md) for the rule-page template.
