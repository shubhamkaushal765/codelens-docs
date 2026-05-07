# ARCHITECTURE.md — Site structure

Living code map of the codelens-docs site.

---

## Top-level layout

```
codelens-docs/
├── docusaurus.config.ts        # site config (URL, theme, plugins, Mermaid theme)
├── sidebars.ts                 # IA — explicit sidebar tree
├── package.json                # deps + scripts
├── tsconfig.json               # TS config (extends @docusaurus/tsconfig)
├── scripts/
│   └── verify-contrast.mjs    # WCAG AA contrast verification (zero deps, node ES module)
├── docs/                       # MDX content tree
│   ├── intro.md                # /intro  (Mermaid: finding flow)
│   ├── architecture.md         # /architecture  (Mermaid: data flow + crate graph)
│   ├── design/
│   │   └── color-system.md     # /design/color-system  (60-30-10 palette, tokens, WCAG table)
│   ├── getting-started/        # /getting-started/*  (first-analysis: Mermaid; reading-output: finding-anatomy.svg)
│   ├── concepts/               # /concepts/*
│   │   ├── dimensions.md       # (Mermaid: dimensions → rules tree)
│   │   └── analyzers-and-findings.md  # (Mermaid: two-axis analyzer pipeline)
│   ├── cli/                    # /cli/*  (Mermaid on show / watch / diff / baseline / lsp)
│   ├── configuration/          # /configuration/*  (baselines-and-fail-on: Mermaid gate flow)
│   ├── output/                 # /output/*
│   ├── integrations/           # /integrations/*  (github-action: Mermaid CI flow; lsp: Mermaid sequence)
│   ├── rules/                  # /rules/*  (index + one page per rule_id)
│   └── extending/              # /extending/*  (Mermaid on both add-a-language and add-an-analyzer)
├── src/
│   ├── pages/index.tsx         # homepage component (overrides docs at /)
│   ├── pages/index.module.css  # homepage styles
│   └── css/custom.css          # global theme — full 60-30-10 semantic token system
├── static/
│   └── img/
│       ├── logo.svg            # aperture/lens mark (primary #1a4480, accent #9a6200)
│       ├── logo-dark.svg       # dark-mode logo variant
│       ├── codelens-flow.svg   # hero pipeline illustration
│       ├── finding-anatomy.svg # labelled terminal-finding illustration (reading-output)
│       └── favicon.ico
└── build/                      # build output (gitignored)
```

---

## Routing

`presets[0].docs.routeBasePath = '/'` mounts the docs tree at the site root. The homepage at `src/pages/index.tsx` takes precedence at `/`, so docs entries do not have a route at the root — `intro.md` is at `/intro`.

| URL                              | Source                                       |
| -------------------------------- | -------------------------------------------- |
| `/`                              | `src/pages/index.tsx`                        |
| `/intro`                         | `docs/intro.md`                              |
| `/getting-started/install`       | `docs/getting-started/install.md`            |
| `/cli/analyze`                   | `docs/cli/analyze.md`                        |
| `/cli/show`                      | `docs/cli/show.md`                           |
| `/cli/report`                    | `docs/cli/report.md`                         |
| `/cli/diff`                      | `docs/cli/diff.md`                           |
| `/cli/baseline`                  | `docs/cli/baseline.md`                       |
| `/cli/watch`                     | `docs/cli/watch.md`                          |
| `/cli/install-hook`              | `docs/cli/install-hook.md`                   |
| `/cli/lsp`                       | `docs/cli/lsp.md`                            |
| `/integrations/github-action`    | `docs/integrations/github-action.md`         |
| `/integrations/lsp`              | `docs/integrations/lsp.md`                   |
| `/rules/`                        | `docs/rules/index.md`                        |
| `/rules/MAINT001-cyclomatic`     | `docs/rules/MAINT001-cyclomatic.md`          |
| `/architecture`                  | `docs/architecture.md`                       |
| `/design/color-system`           | `docs/design/color-system.md`                |

---

## Sidebar structure

Defined explicitly in [sidebars.ts](../sidebars.ts). Categories are flat (no nested categories beyond one level). The `Rules reference` category links to its own index page via `link: { type: 'doc', id: 'rules/index' }`.

---

## Build pipeline

```
npm run start    →  docusaurus start                 (dev server with HMR)
npm run build    →  docusaurus build                 (writes ./build)
npm run typecheck →  tsc --noEmit                    (TS sanity)
npm run serve    →  docusaurus serve                 (preview built site)
npm run clear    →  docusaurus clear                 (purge cache)
```

`docusaurus build` uses Rspack/SWC under the hood (no Babel config needed). It validates:

- Every internal link resolves (`onBrokenLinks: 'throw'`)
- Every Markdown link resolves (`onBrokenMarkdownLinks: 'warn'`)
- Frontmatter and MDX compile cleanly
- TypeScript compiles in `src/` and `*.config.ts`

A green `npm run build` is the test signal — there is no separate test runner.

---

## Theming

`src/css/custom.css` holds the full 60-30-10 semantic token system. The default Docusaurus theme is used otherwise; no custom theme components are layered on top. Full design system documentation: [docs/design/color-system.md](../docs/design/color-system.md) and [.agent/DESIGN.md](./DESIGN.md).

`themeConfig.colorMode.respectPrefersColorScheme = true` follows the OS dark-mode setting on first load.

`themeConfig.prism.additionalLanguages` registers `rust`, `toml`, `bash`, `json`, `python` so code fences highlight correctly. Default Prism does not ship Rust or TOML.

**Palette** — key anchor values (see [docs/design/color-system.md](../docs/design/color-system.md) for the full token table):

| Token | Light | Dark |
| ----- | ----- | ---- |
| `--cl-accent-primary` / `--ifm-color-primary` | `#1a4480` | `#7aa7f5` |
| `--cl-accent-secondary` | `#9a6200` | `#e0a93a` |
| `--cl-bg-default` | `#ffffff` | `#0d1117` |
| `--cl-text-primary` | `#111827` | `#e6edf3` |

Run `node scripts/verify-contrast.mjs` to validate WCAG AA compliance for all 16 contrast pairings.

**Mermaid** is configured in `themeConfig.mermaid` with `themeVariables` that echo the semantic palette (using the same hex values as `--cl-*` tokens). The `markdown.mermaid: true` flag enables Mermaid fences in MDX. `@docusaurus/theme-mermaid` is the only added dependency.

## Diagrams

Two conventions apply site-wide:

- **Mermaid in `docs/`** — use a `mermaid` fenced code block whenever a diagram materially aids comprehension of a process or dependency structure. Current pages with Mermaid: `intro.md`, `architecture.md`, `concepts/dimensions.md`, `concepts/analyzers-and-findings.md`, `getting-started/first-analysis.md`, `cli/show.md`, `cli/watch.md`, `cli/diff.md`, `cli/baseline.md`, `cli/lsp.md` (sequenceDiagram), `integrations/github-action.md`, `integrations/lsp.md` (sequenceDiagram), `extending/add-a-language.md`, `extending/add-an-analyzer.md`, `configuration/baselines-and-fail-on.md`.
- **Inline SVG in `src/pages/`** — React pages use inline `<svg>` elements. Mermaid cannot be rendered inside React components that are not MDX.
- **Standalone `.svg` in `static/img/`** — referenced via `![alt](/img/file.svg)` in MDX or via `useBaseUrl` in React. Use this when an illustration is non-procedural (annotated/labelled) and Mermaid cannot express it. Current standalone files: `codelens-flow.svg` (homepage hero), `finding-anatomy.svg` (reading-output page).

---

## Source-of-truth content

Most content is adapted from the codelens repo at `/home/user/codelens/`. Specific mappings:

| Site page                             | Source                                                               |
| ------------------------------------- | -------------------------------------------------------------------- |
| `docs/architecture.md`                | `/home/user/codelens/docs/architecture.md` + `.agent/ARCHITECTURE.md` |
| `docs/output/json-schema.md`          | `/home/user/codelens/docs/json-schema.md`                            |
| `docs/rules/<RULE_ID>.md`             | `/home/user/codelens/docs/rules/<RULE_ID>.md`                        |
| `docs/extending/*`                    | `/home/user/codelens/docs/architecture.md` (Tutorials 1 & 2)        |
| `docs/integrations/github-action.md`  | `/home/user/codelens/action.yml` + AGENTS.md HTTP API table          |
| `docs/integrations/lsp.md`            | `/home/user/codelens/.agent/ARCHITECTURE.md` (codelens-lsp section)  |

When the source moves, update both. The site is the **rendered** version — the source is the canonical text.
