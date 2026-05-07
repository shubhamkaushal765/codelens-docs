# DESIGN.md — Design system contract

Agent-oriented reference for the codelens-docs visual design system. For the user-facing doc, see [docs/design/color-system.md](../docs/design/color-system.md).

---

## Token hierarchy

```
--codelens-blue-N / --codelens-amber-N / --codelens-slate-N
  (raw ramps — defined in :root, never used in components)
    ↓
--cl-{layer}-{role}-{variant}
  (semantic tokens — the only tokens components may consume)
    ↓
--ifm-{name}
  (Infima/Docusaurus variables — mapped from --cl-* in :root and [data-theme='dark'])
```

**Rule: components MUST consume only `--cl-*` semantic tokens (or `--ifm-*` ones we map onto them). They MUST NOT hardcode hex values.**

---

## 60-30-10 layer assignments

| Layer | % | Tokens | Examples |
|---|---|---|---|
| Dominant | 60 | `--cl-bg-*` | page background, canvas, content area |
| Secondary | 30 | `--cl-surface-*`, `--cl-border-*` | navbar, sidebar, code blocks, cards, borders |
| Accent | 10 | `--cl-accent-*`, `--cl-text-link*`, `--cl-focus-ring` | links, buttons, active items, focus rings |

---

## Light mode key values

| Token | Hex | Role |
|---|---|---|
| `--cl-bg-default` | `#ffffff` | Main content surface |
| `--cl-bg-canvas` | `#f7f9fc` | Outer shell / canvas |
| `--cl-surface-sidebar` | `#f4f7fb` | Sidebar background |
| `--cl-surface-code` | `#f1f4f9` | Code block background |
| `--cl-border-default` | `#dbe2ec` | Default border |
| `--cl-accent-primary` | `#1a4480` | Links, buttons, active (9.62:1 on white) |
| `--cl-text-primary` | `#111827` | Body text (17.74:1 on white) |
| `--cl-text-muted` | `#4b5563` | Meta / captions (7.56:1 on white) |

## Dark mode key values

| Token | Hex | Role |
|---|---|---|
| `--cl-bg-default` | `#0d1117` | Main content surface |
| `--cl-bg-canvas` | `#0a0e15` | Outer shell / canvas |
| `--cl-surface-sidebar` | `#11161f` | Sidebar background |
| `--cl-surface-code` | `#0f141d` | Code block background |
| `--cl-border-default` | `#222a38` | Default border |
| `--cl-accent-primary` | `#7aa7f5` | Links, buttons, active (7.82:1 on #0d1117) |
| `--cl-text-primary` | `#e6edf3` | Body text (16.02:1 on #0d1117) |
| `--cl-text-muted` | `#8b949e` | Meta / captions (6.15:1 on #0d1117) |

---

## WCAG check

```bash
node scripts/verify-contrast.mjs
```

Exits 0 if all 16 pairings (light + dark) pass WCAG AA. Exits 1 on any failure. Run this before shipping any palette change.

---

## When to add a new token vs reuse an existing one

Add a new `--cl-*` token when:
- The role is semantically distinct and does not map cleanly to any existing token.
- You need light/dark parity for a new surface type.

Reuse an existing token when:
- The visual role is the same and only the component context differs.
- You can express the need via a modifier class or variant without a new variable.

Never add a raw ramp index (`--codelens-blue-N`) without also adding a semantic `--cl-*` alias that components can consume.

---

## Naming convention

`--cl-{layer}-{role}-{variant}`

| Segment | Allowed values |
|---|---|
| layer | `bg`, `surface`, `border`, `accent`, `text`, `state`, `code`, `syntax` |
| role | `default`, `canvas`, `subtle`, `nav`, `sidebar`, `card`, `code`, `elevated`, `primary`, `secondary`, `muted`, `inverse`, `link` |
| variant | `hover`, `active`, `muted`, `inverse`, `-bg`, `-border`, `-text` (for state tokens) |

---

## Files to edit

| Task | File |
|---|---|
| Change a color | `src/css/custom.css` + update `scripts/verify-contrast.mjs` palette object |
| Add a semantic token | `src/css/custom.css` (both `:root` and `[data-theme='dark']`) |
| Update user-facing docs | `docs/design/color-system.md` |
| Update Mermaid theme | `docusaurus.config.ts` → `themeConfig.mermaid.options.themeVariables` |
