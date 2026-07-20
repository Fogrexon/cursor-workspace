# Graphim Demo

[`graphim`](https://github.com/Fogrexon/Graphim)（`lib/graphim` submodule）の WebGL 画像エフェクトを試すデモ。

意図: [knowledge/apps/graphim-demo/product-intent.md](../../knowledge/apps/graphim-demo/product-intent.md)

## Setup

```bash
git submodule update --init --recursive
cd lib/graphim && npm install
cd apps/graphim-demo && npm install
```

## Scripts

| Command | 説明 |
|---------|------|
| `npm run dev` | 開発サーバ（`/cursor-workspace/graphim-demo/`） |
| `npm test` | Vitest |
| `npm run build` | `docs/graphim-demo/` へビルド |

Vite 設定で `graphim/vite` の `graphimGlsl()` を有効にしている（`.fs` / `.vs` を string module 化）。

## Structure

```
src/
  main.ts
  logic/effects.ts
  ui/app.ts
  ui/effectGraph.ts
```
