---
title: Color system
description: The 60-30-10 design system, palette, semantic tokens, and usage guidelines for the codelens documentation UI.
---

# Color system

This page documents the visual design system for the codelens documentation site: the palette, token hierarchy, 60-30-10 balance, WCAG contrast pairings, and usage rules. Follow it whenever you add or modify UI styles.

---

## Overview

The codelens docs UI uses a **60-30-10 color system** grounded in professional developer documentation precedents (Stripe, Vercel, Linear, GitHub Docs). All colors flow through a three-level token hierarchy so that every component picks up theme changes automatically and WCAG AA compliance is verifiable by script.

Three design objectives drove every palette decision:

- **Long-read comfort** — low-saturation surfaces, 1.65 line height, text contrast well above the 4.5:1 minimum.
- **Information hierarchy** — the 60-30-10 split makes it visually obvious which elements are background, which are structural chrome, and which demand attention.
- **Maintainability** — components consume semantic `--cl-*` tokens, never raw hex. Changing a color in one place propagates everywhere.

---

## The 60-30-10 balance

The rule distributes visual weight so that the dominant tone carries the space, a secondary tone defines structure, and the accent creates intentional focus.

| Layer | % | UI elements | Tokens |
|---|---|---|---|
| 60% dominant | 60 | Page background, main content area, reading surface, body text container | `--cl-bg-canvas`, `--cl-bg-default`, `--cl-bg-subtle` |
| 30% secondary | 30 | Navbar, sidebar, TOC rail, code blocks, cards, admonition surfaces, table backgrounds | `--cl-surface-*`, `--cl-border-*` |
| 10% accent | 10 | Links, primary buttons, active sidebar items, focus rings, CTAs, highlighted code lines | `--cl-accent-*`, `--cl-text-link*`, `--cl-focus-ring` |

:::note
The 60-30-10 split is a visual weight guide, not a pixel-count rule. A sidebar that spans 20% of the viewport still represents the 30% structural layer — it's about tone dominance, not area.
:::

### How the split maps to a documentation layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Navbar  (30% surface: --cl-surface-nav, 10% accent on active links) │
├─────────────┬────────────────────────────────────────┬───────────────┤
│  Sidebar    │                                        │  TOC rail     │
│  (30%       │   Content area                         │  (30%         │
│  surface:   │   (60% canvas: --cl-bg-default,        │  surface:     │
│  --cl-      │    --cl-bg-canvas)                     │  --cl-border- │
│  surface-   │                                        │  default)     │
│  sidebar)   │   Code blocks (30% --cl-surface-code)  │               │
│             │   Links (10% --cl-text-link)            │               │
│  Active     │   Buttons (10% --cl-accent-primary)    │               │
│  item:      │                                        │               │
│  10% accent │                                        │               │
└─────────────┴────────────────────────────────────────┴───────────────┘
│  Footer (30% surface: --ifm-footer-background-color)                 │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Palette

### Raw ramp — blue

Raw ramp tokens are **not consumed in components**. They exist only to derive semantic tokens.

| Token | Hex | Swatch |
|---|---|---|
| `--codelens-blue-50` | `#eef4ff` | <span style={{display:'inline-block',width:'1rem',height:'1rem',background:'#eef4ff',border:'1px solid #ddd',borderRadius:'2px',verticalAlign:'middle'}}></span> |
| `--codelens-blue-100` | `#d9e8ff` | <span style={{display:'inline-block',width:'1rem',height:'1rem',background:'#d9e8ff',border:'1px solid #ddd',borderRadius:'2px',verticalAlign:'middle'}}></span> |
| `--codelens-blue-200` | `#b3d1ff` | <span style={{display:'inline-block',width:'1rem',height:'1rem',background:'#b3d1ff',border:'1px solid #ddd',borderRadius:'2px',verticalAlign:'middle'}}></span> |
| `--codelens-blue-300` | `#7aacf7` | <span style={{display:'inline-block',width:'1rem',height:'1rem',background:'#7aacf7',border:'1px solid #ddd',borderRadius:'2px',verticalAlign:'middle'}}></span> |
| `--codelens-blue-400` | `#4d88e8` | <span style={{display:'inline-block',width:'1rem',height:'1rem',background:'#4d88e8',border:'1px solid #ddd',borderRadius:'2px',verticalAlign:'middle'}}></span> |
| `--codelens-blue-500` | `#2860c8` | <span style={{display:'inline-block',width:'1rem',height:'1rem',background:'#2860c8',border:'1px solid #ddd',borderRadius:'2px',verticalAlign:'middle'}}></span> |
| `--codelens-blue-600` | `#1e4d8c` | <span style={{display:'inline-block',width:'1rem',height:'1rem',background:'#1e4d8c',border:'1px solid #ddd',borderRadius:'2px',verticalAlign:'middle'}}></span> |
| `--codelens-blue-700` | `#1a4480` | <span style={{display:'inline-block',width:'1rem',height:'1rem',background:'#1a4480',border:'1px solid #ddd',borderRadius:'2px',verticalAlign:'middle'}}></span> |
| `--codelens-blue-800` | `#163c6e` | <span style={{display:'inline-block',width:'1rem',height:'1rem',background:'#163c6e',border:'1px solid #ddd',borderRadius:'2px',verticalAlign:'middle'}}></span> |
| `--codelens-blue-900` | `#102d54` | <span style={{display:'inline-block',width:'1rem',height:'1rem',background:'#102d54',border:'1px solid #ddd',borderRadius:'2px',verticalAlign:'middle'}}></span> |

### Raw ramp — amber (accent)

| Token | Hex | Swatch |
|---|---|---|
| `--codelens-amber-400` | `#e0a93a` | <span style={{display:'inline-block',width:'1rem',height:'1rem',background:'#e0a93a',border:'1px solid #ddd',borderRadius:'2px',verticalAlign:'middle'}}></span> |
| `--codelens-amber-500` | `#c8881a` | <span style={{display:'inline-block',width:'1rem',height:'1rem',background:'#c8881a',border:'1px solid #ddd',borderRadius:'2px',verticalAlign:'middle'}}></span> |
| `--codelens-amber-600` | `#9a6200` | <span style={{display:'inline-block',width:'1rem',height:'1rem',background:'#9a6200',border:'1px solid #ddd',borderRadius:'2px',verticalAlign:'middle'}}></span> |

### Semantic tokens — light mode

| Token | Hex | Role | WCAG ratio (on bg-default) |
|---|---|---|---|
| `--cl-bg-canvas` | `#f7f9fc` | Outer wrap, page shell | — |
| `--cl-bg-default` | `#ffffff` | Main content surface | — |
| `--cl-bg-subtle` | `#eef2f8` | Hover, selected bg | — |
| `--cl-surface-nav` | `#ffffff` | Navbar background | — |
| `--cl-surface-sidebar` | `#f4f7fb` | Sidebar background | — |
| `--cl-surface-card` | `#eef2f8` | Cards, admonition fills | — |
| `--cl-surface-code` | `#f1f4f9` | Code block background | — |
| `--cl-border-default` | `#dbe2ec` | Default border | — |
| `--cl-border-muted` | `#eef2f8` | Subtle dividers | — |
| `--cl-accent-primary` | `#1a4480` | Links, buttons, active | 9.62:1 |
| `--cl-accent-secondary` | `#9a6200` | Amber CTA, highlights | 5.47:1 |
| `--cl-text-primary` | `#111827` | Body text | 17.74:1 |
| `--cl-text-secondary` | `#374151` | Meta, captions | 12.63:1 |
| `--cl-text-muted` | `#4b5563` | Placeholders, disabled | 7.56:1 |
| `--cl-text-link` | `#1a4480` | Link color | 9.62:1 |

### Semantic tokens — dark mode

| Token | Hex | Role | WCAG ratio (on bg-default) |
|---|---|---|---|
| `--cl-bg-canvas` | `#0a0e15` | Outer wrap | — |
| `--cl-bg-default` | `#0d1117` | Main content surface | — |
| `--cl-bg-subtle` | `#111827` | Hover, selected bg | — |
| `--cl-surface-nav` | `#0d1117` | Navbar | — |
| `--cl-surface-sidebar` | `#11161f` | Sidebar | — |
| `--cl-surface-card` | `#161c28` | Cards, admonition fills | — |
| `--cl-surface-code` | `#0f141d` | Code block background | — |
| `--cl-border-default` | `#222a38` | Default border | — |
| `--cl-border-muted` | `#1a2030` | Subtle dividers | — |
| `--cl-accent-primary` | `#7aa7f5` | Links, buttons, active | 7.82:1 |
| `--cl-accent-secondary` | `#e0a93a` | Amber CTA, highlights | 5.63:1 |
| `--cl-text-primary` | `#e6edf3` | Body text | 16.02:1 |
| `--cl-text-secondary` | `#b0bec5` | Meta, captions | 9.48:1 |
| `--cl-text-muted` | `#8b949e` | Placeholders, disabled | 6.15:1 |
| `--cl-text-link` | `#7aa7f5` | Link color | 7.82:1 |

---

## Light vs dark theme

| Surface | Light | Dark |
|---|---|---|
| Page background | `#ffffff` | `#0d1117` |
| Canvas / shell | `#f7f9fc` | `#0a0e15` |
| Navbar | `#ffffff` | `#0d1117` |
| Sidebar | `#f4f7fb` | `#11161f` |
| Code block | `#f1f4f9` | `#0f141d` |
| Card / admonition | `#eef2f8` | `#161c28` |
| Default border | `#dbe2ec` | `#222a38` |
| Body text | `#111827` | `#e6edf3` |
| Link / accent | `#1a4480` | `#7aa7f5` |

---

## Typography contrast pairings

All pairings verified by `node scripts/verify-contrast.mjs`.

| Mode | Pairing | FG | BG | Ratio | AA |
|---|---|---|---|---|---|
| light | body text on page background | `#111827` | `#ffffff` | 17.74:1 | PASS |
| light | body text on sidebar | `#111827` | `#f4f7fb` | 16.51:1 | PASS |
| light | body text on code block | `#111827` | `#f1f4f9` | 16.09:1 | PASS |
| light | link on page background | `#1a4480` | `#ffffff` | 9.62:1 | PASS |
| light | link on sidebar | `#1a4480` | `#f4f7fb` | 8.95:1 | PASS |
| light | button text on button bg | `#ffffff` | `#1a4480` | 9.62:1 | PASS |
| light | accent on page bg (3:1 UI) | `#1a4480` | `#ffffff` | 9.62:1 | PASS |
| light | muted text on page background | `#4b5563` | `#ffffff` | 7.56:1 | PASS |
| dark | body text on page background | `#e6edf3` | `#0d1117` | 16.02:1 | PASS |
| dark | body text on sidebar | `#e6edf3` | `#11161f` | 15.34:1 | PASS |
| dark | body text on code block | `#e6edf3` | `#0f141d` | 15.62:1 | PASS |
| dark | link on page background | `#7aa7f5` | `#0d1117` | 7.82:1 | PASS |
| dark | link on sidebar | `#7aa7f5` | `#11161f` | 7.49:1 | PASS |
| dark | button text on button bg | `#ffffff` | `#1a4480` | 9.62:1 | PASS |
| dark | accent on page bg (3:1 UI) | `#7aa7f5` | `#0d1117` | 7.82:1 | PASS |
| dark | muted text on page background | `#8b949e` | `#0d1117` | 6.15:1 | PASS |

:::tip
Run `node scripts/verify-contrast.mjs` any time you change a palette color. The script exits non-zero on failure, so it can be wired into CI.
:::

---

## Usage guidelines

### Do

- Consume only `--cl-*` semantic tokens (or `--ifm-*` variables we map onto them) in component styles.
- Use `--cl-accent-primary` for interactive elements that need to stand out (links, focused inputs, primary buttons, active sidebar items).
- Use `--cl-surface-*` for structural chrome (navbar, sidebar, code blocks, cards).
- Use `--cl-text-muted` for metadata, timestamps, captions — not for body text.
- Keep hover and focus transitions at `150ms ease`.

### Do not

- Hardcode hex values in component CSS — always use a token.
- Use `--codelens-blue-N` or `--codelens-slate-N` ramp tokens in components — those are for deriving semantic tokens only.
- Add `outline: none` or `outline: 0` — use `--cl-focus-ring` instead.
- Use `transition` durations longer than `150ms` on interactive elements.
- Use the amber `--cl-accent-secondary` for body links — reserve it for call-to-action elements and the secondary button variant.

---

## Links, buttons, alerts

### Links

```css
/* Consumed automatically via --ifm-link-color */
a {
  color: var(--cl-text-link);
  transition: color 150ms ease;
}

a:hover {
  color: var(--cl-text-link-hover);
}
```

### Primary button

```css
.button--primary {
  background: var(--cl-accent-primary);
  color: var(--cl-text-inverse);
  transition: background 150ms ease;
}

.button--primary:hover {
  background: var(--cl-accent-primary-hover);
}
```

### Admonition (info)

```css
.alert--info {
  background: var(--cl-state-info-bg);
  border-color: var(--cl-state-info-border);
  color: var(--cl-state-info-text);
}
```

---

## Code syntax highlighting

Prism syntax tokens map to the semantic `--cl-syntax-*` variables. The code block background is `--cl-surface-code`, with a `1px solid --cl-code-border` border.

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `--cl-syntax-keyword` | `#1a4480` | `#7aa7f5` | `if`, `fn`, `let`, `const` |
| `--cl-syntax-string` | `#16a34a` | `#86efac` | String literals |
| `--cl-syntax-number` | `#9a6200` | `#f4c04a` | Numeric literals |
| `--cl-syntax-comment` | `#6b7890` | `#6b7890` | Inline and block comments |
| `--cl-syntax-function` | `#7c3aed` | `#c4b5fd` | Function and method names |
| `--cl-syntax-type` | `#0369a1` | `#67c3f3` | Type annotations, structs |
| `--cl-syntax-operator` | `#374151` | `#b0bec5` | Operators, punctuation |
| `--cl-syntax-variable` | `#1f2937` | `#e6edf3` | Variable names |

---

## Sidebar and navbar

**Navbar** uses `--cl-surface-nav` as its background. A single `1px solid --cl-border-default` bottom edge replaces the default Docusaurus drop shadow, keeping the transition subtle. Active navbar links receive `--cl-accent-primary`.

**Sidebar** background is `--cl-surface-sidebar`. The container has a `1px solid --cl-border-default` right border that separates it from the content area. Active sidebar links get a `2px solid --cl-accent-primary` left border and `font-weight: 600` — the accent left-border is the only place where both the 10% accent and a structural cue appear together.

```css
/* Active sidebar treatment */
.menu__link--active {
  color: var(--cl-accent-primary);
  background: var(--ifm-menu-color-background-active);
  border-left: 2px solid var(--cl-accent-primary);
  font-weight: 600;
}
```

---

## Callouts / admonitions

Admonitions use a `4px solid` left border and a tinted background from the `--cl-state-*` token family.

:::info
**Info** — `--cl-state-info-*` tokens. Blue tint. Use for version notes, scope, availability.
:::

:::tip
**Tip** — `--cl-state-tip-*` tokens. Green tint. Use for practical advice.
:::

:::note
**Note** — `--cl-state-note-*` tokens. Slate tint. Use for side information.
:::

:::caution
**Caution** — `--cl-state-caution-*` tokens. Amber tint. Use for mildly surprising behavior.
:::

:::warning
**Warning** — `--cl-state-warning-*` / `--cl-state-danger-*` tokens. Red tint. Use for data-loss risk.
:::

All five admonition types ship with both light and dark mode values.

---

## Tabs

Tabs use a bottom-border highlight pattern. The inactive state shows a transparent border; the active state fills it with `--cl-accent-primary`.

```css
.tabs__item {
  border-bottom: 2px solid transparent;
  color: var(--ifm-tabs-color);
  transition: color 150ms ease, border-color 150ms ease;
}

.tabs__item--active {
  border-bottom-color: var(--ifm-tabs-color-active-border);
  color: var(--ifm-tabs-color-active);
}
```

The tokens involved: `--ifm-tabs-color`, `--ifm-tabs-color-active`, `--ifm-tabs-color-active-border` — all mapped from `--cl-text-secondary` and `--cl-accent-primary` respectively.

---

## Search UI

The search bar (DocSearch) is styled via scoped `.DocSearch-*` class overrides rather than the `--docsearch-*` CSS variables, to keep parity with the rest of the semantic system:

| Element | Token |
|---|---|
| Button background | `--cl-surface-card` |
| Button border | `--cl-border-default` |
| Button text | `--cl-text-muted` |
| Button hover border | `--cl-accent-primary` |
| Modal background | `--cl-bg-default` |
| Modal border | `--cl-border-default` |
| Result text | `--cl-text-primary` |
| Result path | `--cl-text-muted` |

---

## API reference styling

The `.api-method` badge is a small `inline-block` element with monospace type, uppercase lettering, and a state-colored fill:

| Class | State tokens | Method |
|---|---|---|
| `.api-method--get` | `--cl-state-tip-*` (green) | GET |
| `.api-method--post` | `--cl-state-info-*` (blue) | POST |
| `.api-method--put` | `--cl-state-caution-*` (amber) | PUT |
| `.api-method--patch` | `--cl-state-note-*` (slate) | PATCH |
| `.api-method--delete` | `--cl-state-danger-*` (red) | DELETE |

```html
<span class="api-method api-method--get">GET</span>
<span class="api-method api-method--post">POST</span>
<span class="api-method api-method--delete">DELETE</span>
```

Use these badges in API reference pages next to endpoint headings, not inline in prose.

---

## Where each percentage appears in a documentation layout

```
60% — dominant (reading surface)
  ├── Page background: --cl-bg-default (#ffffff / #0d1117)
  ├── Canvas shell: --cl-bg-canvas (#f7f9fc / #0a0e15)
  └── Body text: --cl-text-primary (#111827 / #e6edf3)

30% — secondary (structural chrome)
  ├── Navbar: --cl-surface-nav
  ├── Sidebar: --cl-surface-sidebar
  ├── TOC rail: border --cl-border-default
  ├── Code blocks: --cl-surface-code
  ├── Cards / admonitions: --cl-surface-card
  └── Borders / dividers: --cl-border-default, --cl-border-muted

10% — accent (interactive focal points)
  ├── Links: --cl-text-link / --cl-text-link-hover
  ├── Primary buttons: --cl-accent-primary
  ├── Active sidebar item (border + text): --cl-accent-primary
  ├── Focus rings: --cl-focus-ring
  ├── Active tab underline: --ifm-tabs-color-active-border
  └── Highlighted code line bg: --docusaurus-highlighted-code-line-bg
```

---

## Gradients and hover states

### Hero gradient

One gradient utility is defined for hero/CTA panels only:

```css
.cl-hero-gradient {
  background: linear-gradient(
    135deg,
    var(--cl-accent-primary) 0%,
    var(--codelens-slate-700) 100%
  );
}
```

Do not use this class for anything other than full-bleed hero or CTA sections.

### Hover transitions

All interactive elements use `150ms ease` — no longer. Longer transitions feel sluggish on documentation sites where readers click frequently.

```css
/* Canonical hover pattern */
.element {
  transition: color 150ms ease, background 150ms ease;
}
```

---

## CSS variable naming convention

Token names follow the pattern: `--cl-{layer}-{role}-{variant}`

| Segment | Values | Meaning |
|---|---|---|
| `--cl-` | fixed prefix | Identifies a codelens semantic token |
| `{layer}` | `bg`, `surface`, `border`, `accent`, `text`, `state`, `code`, `syntax` | Design layer |
| `{role}` | `default`, `primary`, `secondary`, `muted`, `nav`, `sidebar`, `card`, etc. | Specific role within the layer |
| `{variant}` | `hover`, `active`, `muted`, `inverse`, `-bg`, `-border`, `-text` | State or sub-role variant |

**Hierarchy:**

```
--codelens-blue-700        (raw ramp — never in components)
  ↓ derived into
--cl-accent-primary        (semantic token — components use this)
  ↓ mapped onto
--ifm-color-primary        (Infima variable — Docusaurus uses this)
```

The mapping from `--cl-*` → `--ifm-*` lives in `:root` and `[data-theme='dark']`. Never skip a level — do not map a raw ramp token directly onto an Infima variable.

---

## Example `:root` and `[data-theme='dark']` blocks

The full file is at `src/css/custom.css`. A representative excerpt:

```css
:root {
  /* raw ramps — do not use in components */
  --codelens-blue-700: #1a4480;
  --codelens-slate-900: #111827;

  /* 60% dominant */
  --cl-bg-default: #ffffff;
  --cl-bg-canvas:  #f7f9fc;

  /* 30% secondary */
  --cl-surface-sidebar: #f4f7fb;
  --cl-surface-code:    #f1f4f9;
  --cl-border-default:  #dbe2ec;

  /* 10% accent */
  --cl-accent-primary:   #1a4480;
  --cl-text-link:        #1a4480;

  /* typography */
  --cl-text-primary:   #111827;
  --cl-text-muted:     #4b5563;

  /* Infima mapping */
  --ifm-color-primary:         #1a4480;
  --ifm-background-color:      var(--cl-bg-default);
  --ifm-link-color:            var(--cl-text-link);
  --ifm-menu-color-active:     var(--cl-accent-primary);
}

[data-theme='dark'] {
  --cl-bg-default: #0d1117;
  --cl-bg-canvas:  #0a0e15;
  --cl-surface-sidebar: #11161f;
  --cl-surface-code:    #0f141d;
  --cl-border-default:  #222a38;
  --cl-accent-primary:  #7aa7f5;
  --cl-text-link:       #7aa7f5;
  --cl-text-primary:    #e6edf3;
  --cl-text-muted:      #8b949e;

  --ifm-color-primary:    #7aa7f5;
  --ifm-background-color: var(--cl-bg-default);
  --ifm-link-color:       var(--cl-text-link);
}
```

---

## Verification

Run this command to validate WCAG AA compliance for all 16 contrast pairings (light + dark):

```bash
node scripts/verify-contrast.mjs
```

The script exits non-zero if any pairing fails, making it suitable for CI. It checks:

- Body text on page background (4.5:1 min)
- Body text on sidebar surface (4.5:1 min)
- Body text on code block background (4.5:1 min)
- Link color on page background (4.5:1 min)
- Link color on sidebar (4.5:1 min)
- Button text on button background (4.5:1 min)
- Accent on page background as UI element (3:1 min)
- Muted text on page background (4.5:1 min)

All pairings are checked for both light and dark mode.

The build also enforces link integrity: `onBrokenLinks: 'throw'` in `docusaurus.config.ts` causes `npm run build` to fail on any broken internal link.
