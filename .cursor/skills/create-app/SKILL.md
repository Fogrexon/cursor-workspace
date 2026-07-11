---
name: create-app
description: >-
  Add a new app to this repo. Use when the user asks to create/add an app or
  implement and publish something under apps/ → docs/ for GitHub Pages
  (e.g. 「アプリを作って」「新しいアプリを追加」「実装して公開」).
---

# Create app

Ship only when built to `docs/<app-name>/` and registered on the portal.

## Checklist

1. Create Vite project in `apps/<app-name>/`
2. Set `base` + `outDir` in `vite.config.ts`
3. Add `lib/theme` (ui-style skill)
4. Split `ui/` / `logic/`
5. Vitest + logic tests
6. `npm test` green
7. `npm run build` → `docs/<app-name>/`
8. Add portal card in `docs/index.html`

## Scaffold

```bash
# from apps/
npm create vite@latest <app-name> -- --template vanilla-ts
```

```typescript
// vite.config.ts
export default defineConfig({
  base: '/cursor-workspace/<app-name>/',
  build: { outDir: '../../docs/<app-name>', emptyOutDir: true },
});
```

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest run"
  },
  "dependencies": { "@playground/theme": "file:../../lib/theme" },
  "devDependencies": { "vitest": "latest" }
}
```

Add deps via `npm install` — do not invent versions by hand.

## Implement / test / build

- `src/ui/` vs `src/logic/` — separation-of-concerns rule
- `*.test.ts` per logic module; `npm test` must pass — testing rule
- After build, asset paths in `docs/<app-name>/index.html` must start with `/cursor-workspace/<app-name>/`

## Portal

```html
<a class="card" href="./<app-name>/">
  <h2>App name</h2>
  <p>One-line description</p>
</a>
```
