---
name: create-app
description: >-
  Add a new app to this repo. Use when the user asks to create/add an app or
  implement and publish something under apps/ → docs/ for GitHub Pages
  (e.g. 「アプリを作って」「新しいアプリを追加」「実装して公開」).
---

# Create app

Ship only when built to `docs/<app-name>/` and registered in the catalog.

## Checklist

1. Create Vite project in `apps/<app-name>/`
2. Set `base` + `outDir` in `vite.config.ts`
3. Add `lib/theme` (ui-style skill)
4. Split `ui/` / `logic/`
5. Vitest + logic tests
6. `npm test` green
7. `npm run build` → `docs/<app-name>/`
8. Add `catalog/entries/apps/<app-name>.yaml` and regenerate catalog JSON

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

## Catalog (portal + static API)

Do **not** hand-edit portal cards in `docs/index.html`. Add an entry YAML, then regenerate:

```yaml
# catalog/entries/apps/<app-name>.yaml
id: <app-name>
kind: app
title: App name
summary: One-line description
tags: [example]
status: published
order: 80
```

```bash
cd tools/workspace-catalog
npm install   # first time
npm run build -- --root ../..
# → docs/api/catalog.json
# CI: npm run check -- --root ../..（.github/workflows/catalog.yml）
```

Spec / reuse in other repos: `tools/workspace-catalog/README.md`.
Local-only apps (no Pages): `status: local`, `demoPath: null`, `portal: false`.
