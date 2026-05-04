# codelens-docs

Public documentation site for [codelens](https://github.com/shubhamkaushal/codelens) — static code analysis for Rust, Python, and JavaScript/TypeScript with structured, multi-dimensional findings.

Built with [Docusaurus 3](https://docusaurus.io/).

## Local development

Requires Node 20+.

```bash
npm install
npm run start          # dev server at http://localhost:3000
npm run build          # static build to ./build
npm run typecheck      # tsc --noEmit
```

`onBrokenLinks: 'throw'` in `docusaurus.config.ts` gates the build on every internal link being valid — a green `npm run build` is the test signal.

## Repo layout

| Path              | Contents                                                       |
| ----------------- | -------------------------------------------------------------- |
| `docs/`           | MDX content tree (intro, getting-started, concepts, CLI, etc.) |
| `src/pages/`      | React homepage (`index.tsx`)                                   |
| `src/css/`        | Global theme overrides                                         |
| `static/`         | Static assets (favicon, images)                                |
| `sidebars.ts`     | Information architecture (sidebar order)                       |
| `docusaurus.config.ts` | Site config (URL, theme, navbar, footer)                  |
| `.agent/`         | Agent-readable docs about this site (architecture, conventions, dev) |
| `AGENTS.md`       | Quick reference for AI agents and humans                       |

## Contributing

See [`.agent/DOCS.md`](./.agent/DOCS.md) for the writing style guide and [`.agent/CONVENTIONS.md`](./.agent/CONVENTIONS.md) for code conventions.

## License

MIT — see [LICENSE](./LICENSE).
