---
name: ui-style
description: >-
  Unified UI via lib/theme design system (token layers + ds-* primitives).
  Use when implementing or changing app UI, CSS, components, colors, or typography.
---

# UI style (design system)

This repo’s UI contract is a **design system**, not a one-off color theme.
Background: [knowledge/decisions/0004-design-system-layers.md](../../../knowledge/decisions/0004-design-system-layers.md)

## Setup

```json
"dependencies": { "@playground/theme": "file:../../lib/theme" }
```

```typescript
import '@playground/theme/theme.css';
import '@playground/theme/components.css';
```

## Token layers (must)

| Layer | Examples | Who may use |
|-------|----------|-------------|
| Primitive | `--ink-900`, `--mint-400`, `--space-raw-3` | `lib/theme` only |
| Semantic | `--color-bg`, `--color-action`, `--space-3`, `--text-md` | apps / portal |
| Component | `--btn-bg-primary`, `--control-height`, `--field-bg` | `.ds-*` or rare overrides |

- Missing token → add to `lib/theme/theme.css`, then consume.
- Do **not** hardcode hex / px radii / shadows in apps.
- Prefer `.ds-*` before inventing new class chrome.

## Tone

- Dark ink surfaces; one mint **action** color (not purple/indigo)
- Atmosphere only via theme `body` background; apps don’t invent gradients
- 8px rhythm via `--space-*`; radii via `--radius-sm` / `--radius` / `--radius-lg`
- Motion via `--motion-*` + `--ease-*` (respects `prefers-reduced-motion`)
- Type: Manrope + Noto Sans JP; roles via `--text-*` / `.ds-title` / `.ds-lede`
- Touch: interactive controls use `--control-height` (≥44px)

## Shared primitives

```css
.ds-page .ds-page--wide
.ds-title .ds-title--display .ds-lede .ds-section-label
.ds-nav-link
.ds-surface .ds-surface--pad .ds-surface--interactive
.ds-btn .ds-btn--primary .ds-btn--ghost .ds-btn--lg
.ds-field .ds-tag .ds-tag--muted .ds-meta .ds-empty .ds-rise
```

```css
/* bad */  .card { background: #121820; border-radius: 14px; }
/* good */ <article class="ds-surface ds-surface--pad ds-surface--interactive">
```

## Conventions

- Primary actions: `.ds-btn.ds-btn--primary`
- Quiet back links: `.ds-nav-link`
- App chrome: title + link back to portal (`../`)
- Content width: `.ds-page` / `--content-max` (reading: `--content-wide`)
- Portal (`docs/index.html`) hand-syncs tokens + ds rules from `lib/theme` (comment the sync source)
