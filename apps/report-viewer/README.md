# Knowledge Report Viewer

`knowledge/` 配下の Markdown（研究レポート、意思決定、インシデントなど）をブラウザで閲覧する静的アプリです。

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
  content/reports.ts   # knowledge/**/*.md を Vite glob で取り込み
  logic/               # catalog / markdown / route / toc（純関数）
  ui/                  # 一覧・詳細 DOM
```

- Markdown: `marked` + `DOMPurify`
- ルーティング: `location.hash`（`#/list`, `#/r/<id>`）
- スタイル: `@playground/theme`

## 公開

ポータルカードは `catalog/entries/apps/report-viewer.yaml` 経由。カタログ再生成:

```bash
cd tools/workspace-catalog && npm run build -- --root ../..
```
