# Graphim Demo

[`graphim`](https://github.com/Fogrexon/Graphim)（`lib/graphim` submodule）の WebGL2 DAG デモ。選択中エフェクトの実行グラフを SVG で表示する。

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

Vite で `graphimGlsl()` を有効化している。

## Structure

```
src/
  main.ts
  logic/effects.ts   # エフェクト一覧（純関数）
  logic/dagLayout.ts # DAG の列・行レイアウト（純関数）
  ui/app.ts          # Graphim.mount + builders
  ui/dagGraph.ts     # 実行 DAG の SVG 表示
```
