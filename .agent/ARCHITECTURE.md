# ARCHITECTURE.md — Site structure

Living code map of the codelens-docs site.

---

## Top-level layout

```
codelens-docs/
├── docusaurus.config.ts        # site config (URL, theme, plugins)
├── sidebars.ts                 # IA — explicit sidebar tree
├── package.json                # deps + scripts
├── tsconfig.json               # TS config (extends @docusaurus/tsconfig)
├── docs/                       # MDX content tree
│   ├── intro.md                # /intro
│   ├── architecture.md         # /architecture
│   ├── getting-started/        # /getting-started/*
│   ├── concepts/               # /concepts/*
│   ├── cli/                    # /cli/*  (analyze, list, init, show, report, diff, baseline, watch, install-hook, lsp)
│   ├── configuration/          # /configuration/*
│   ├── output/                 # /output/*
│   ├── integrations/           # /integrations/*  (github-action, lsp)
│   ├── rules/                  # /rules/*  (index + one page per rule_id)
│   └── extending/              # /extending/*
├── src/
│   ├── pages/index.tsx         # homepage component (overrides docs at /)
│   ├── pages/index.module.css  # homepage styles
│   └── css/custom.css          # global theme overrides
├── static/                     # static assets (favicon, images)
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

`src/css/custom.css` holds global overrides. The default Docusaurus theme is used otherwise; no custom theme components are layered on top.

`themeConfig.colorMode.respectPrefersColorScheme = true` follows the OS dark-mode setting on first load.

`themeConfig.prism.additionalLanguages` registers `rust`, `toml`, `bash`, `json`, `python` so code fences highlight correctly. Default Prism does not ship Rust or TOML.

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
