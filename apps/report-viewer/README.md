# Report Viewer

`reports/` 配下の deep research 成果物をブラウザで閲覧する静的アプリです。  
`knowledge/`（プロジェクト固有メモ）は表示しません。

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
  content/reports.ts   # reports/**/*.md を Vite glob で取り込み
  logic/               # frontmatter / catalog / markdown / route / toc
  ui/                  # 一覧・詳細 DOM
```

- メタ: YAML frontmatter（`title`, `summary`, `date`, `category`, `tags`）
- Markdown: `marked` + `DOMPurify`
- ルーティング: `location.hash`（`#/list`, `#/r/<id>`）
- スタイル: `@playground/theme`

規約: `reports/README.md` / `.cursor/rules/reports.mdc`  
意図: `knowledge/apps/report-viewer/product-intent.md`

## 公開

ポータルカードは `catalog/entries/apps/report-viewer.yaml` 経由。カタログ再生成:

```bash
cd tools/workspace-catalog && npm run build -- --root ../..
```
