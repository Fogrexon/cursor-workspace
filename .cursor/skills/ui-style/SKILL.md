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

- Dark base; one indigo accent
- Flat, light shadow; no gradients/heavy decoration
- 8px grid (`--space-*`); radius only `--radius` / `--radius-sm`
- Transitions via `--transition` (~150ms)

## Tokens

```css
var(--color-bg) var(--color-surface) var(--color-border)
var(--color-text) var(--color-text-muted)
var(--color-accent) var(--color-accent-hover) var(--color-danger)
var(--space-1) /* … */ var(--space-6)  /* 4–48px */
var(--radius) var(--radius-sm) var(--shadow) var(--transition)
var(--font-sans) var(--font-mono)
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

- Buttons: `--color-accent` / hover `--color-accent-hover`, `--radius-sm`
- Top: app title + link back to portal (`../`)
- Responsive; content `max-width: 960px; margin-inline: auto`
