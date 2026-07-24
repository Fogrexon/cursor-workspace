# Research Report Viewer

`research/` 配下の調査レポート（Markdown）をブラウザで閲覧する静的アプリです。  
`knowledge/`（実装意図・インシデント）は対象外です。

## 使い方

```bash
cd apps/report-viewer
npm install
npm test
npm run dev    # http://localhost:5173/cursor-workspace/report-viewer/
npm run build  # → docs/report-viewer/
```

## 構成

```
src/
  content/reports.ts   # research/**/*.md を Vite glob で取り込み
  logic/               # catalog / markdown / route / toc（純関数）
  ui/                  # 一覧・詳細 DOM
```

- Markdown: `marked` + `DOMPurify`
- ルーティング: `location.hash`（`#/list`, `#/r/<id>`）
- スタイル: `@playground/theme`

## 公開

ポータルでは `portalSection: research` により Apps とは別枠。カタログ再生成:

```bash
cd tools/workspace-catalog && npm run build -- --root ../..
```

意図: [knowledge/apps/report-viewer/product-intent.md](../../knowledge/apps/report-viewer/product-intent.md)
