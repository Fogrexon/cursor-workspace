---
name: ui-style
description: >-
  Unified UI via lib/theme tokens. Use when implementing or changing app UI,
  CSS, components, colors, or typography.
---

# UI style

Use `lib/theme` CSS variables. Do not hardcode colors, spacing, radius, or shadows.

## Setup

```json
"dependencies": { "@playground/theme": "file:../../lib/theme" }
```

```typescript
import '@playground/theme/theme.css';
```

## Tone

- Dark ink base; one mint/teal accent (not purple/indigo)
- Light layered shadow; subtle atmospheric bg is OK via theme body (apps don't invent gradients)
- 8px grid (`--space-*`); radius only `--radius` / `--radius-sm`
- Transitions via `--transition` (~160ms)
- Typography: Manrope + Noto Sans JP (`--font-sans`); mono via `--font-mono`
- Mobile-first: touch targets ≥44px where interactive; use `--page-pad-inline` / safe-area

## Tokens

```css
var(--color-bg) var(--color-surface) var(--color-surface-hover) var(--color-border)
var(--color-text) var(--color-text-muted)
var(--color-accent) var(--color-accent-hover) var(--color-accent-text) var(--color-accent-muted)
var(--color-danger) var(--color-success)
var(--space-1) /* … */ var(--space-6)  /* 4–48px */
var(--content-max) var(--content-wide)
var(--page-pad-inline) var(--page-pad-inline-end)
var(--radius) var(--radius-sm) var(--shadow) var(--shadow-sm) var(--transition)
var(--font-sans) var(--font-mono)
var(--text-xs) var(--text-sm) var(--text-md) var(--text-lg) var(--text-xl) var(--text-2xl)
```

Full defs: `lib/theme/theme.css`. Missing token → add to theme, then use.

```css
/* bad */  .card { background: #1e1e2e; border-radius: 12px; padding: 20px; }
/* good */ .card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-3);
}
```

## Conventions

- Buttons: `--color-accent` / hover `--color-accent-hover`, text `--color-accent-text`, `--radius-sm`
- Top: app title + link back to portal (`../`)
- Responsive; content `max-width: var(--content-max); margin-inline: auto`
- Wide reading layouts may use `var(--content-wide)`
- Portal (`docs/index.html`) keeps token values in sync with `lib/theme/theme.css`
