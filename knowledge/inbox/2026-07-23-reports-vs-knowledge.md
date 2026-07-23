# 2026-07-23 reports vs knowledge 境界
- Source: chat
- App: report-viewer | cross-cutting
- Status: distilled
## Facts
- knowledge にはプロジェクト固有の記述が入っていてほしい
- ユーザー要請の deep research レポートは別の場所で管理してほしい
- Report Viewer はそのディレクトリ以下のレポートのみ閲覧できればよい
- 検索しやすいようレポートへのメタ情報が必要ならルール化してほしい
## Interpretation
- 調査成果物ディレクトリを `reports/` とし、必須 frontmatter をルール化する
## Open
- （なし）
## Not code
- deep research の内容自体の再調査は不要。置き場とビューワー範囲の再編成
