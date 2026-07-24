# 2026-07-24 research vs knowledge separation
- Source: chat
- App: report-viewer | cross-cutting
- Status: distilled
## Facts
- report-viewer（旧 Knowledge Report Viewer）は他の playground アプリと別枠で管理したい
- ビューワーで閲覧対象にするのは research 結果のレポートのみ
- `knowledge/` はリポジトリ実装に関する意図・制約・インシデントを格納する
- `knowledge/research/` に調査レポートを置くのは不適切
## Interpretation
- 調査レポートの正本はリポジトリ直下の `research/` に移す
- report-viewer は `research/**/*.md` のみバンドルする
- ポータル catalog に `portalSection: research` を追加し、Apps とは別セクションで表示する
## Open
- （なし）
## Not code
- knowledge-capture の成果物と deep research の成果物はディレクトリを混在させない
