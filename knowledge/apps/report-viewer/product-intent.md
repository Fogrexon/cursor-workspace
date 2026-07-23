# Report Viewer — product intent

## Fantasy

ユーザー要請で書いた deep research を、GitHub Pages 上で検索・目次付きで読める。プロジェクト固有メモ（knowledge）と混ざらない。

## Success

- 表示対象は `reports/` 以下のレポート Markdown のみ
- frontmatter（title / summary / date / category / tags）で一覧・検索できる
- 長文でも TOC で移動できる

## Non-goals

- `knowledge/`（意図・インシデント・ADR）の閲覧 UI
- Markdown のオンライン編集・CMS
- サーバー側全文検索インデックス

## Constraints

- 静的 GitHub Pages（hash ルーティング）
- UI は `lib/theme` トークン
- レポート追加時は必須 frontmatter（`.cursor/rules/reports.mdc`）
