# @playground/theme

Shared **design system** for this playground: token layers + accessible CSS primitives.

Intent / ADR: [knowledge/decisions/0004-design-system-layers.md](../../knowledge/decisions/0004-design-system-layers.md)  
How-to for apps: [.cursor/skills/ui-style/SKILL.md](../../.cursor/skills/ui-style/SKILL.md)

## Public surface

| Import | Role |
|--------|------|
| `@playground/theme/theme.css` | Primitive → semantic → component tokens + base `body` |
| `@playground/theme/components.css` | `.ds-*` primitives (button, surface, field, tag, …) |

```ts
import '@playground/theme/theme.css';
import '@playground/theme/components.css';
```

Apps must not hardcode colors / radii / shadows. Prefer semantic tokens (`--color-action`, `--space-*`) or `.ds-*` classes. Do not reference `--ink-*` / `--mint-*` primitives in app CSS.

## Structure

```
lib/theme/
  theme.css        # tokens + base
  components.css   # ds-* recipes
  package.json
  README.md
```

## Tests / build

CSS-only package — no unit tests. Consumers verify via their `npm run build`. After token changes, re-`npm install` in apps that depend via `file:`.
