# 2026-08-25 CEDEC Capture 起動
- Source: chat
- App: cedec-capture
- Status: raw

## Facts

- ユーザー依頼は「cedec captureを起動して」
- リポジトリに CEDEC 専用アプリは無かった
- CEDEC 2026 は 2026-07-22〜24 に開催済み。タイムシフトは 2026-08-04 で終了
- 公式セッション一覧は `https://cedec.cesa.or.jp/2026/session/timetable.json`
- 講演資料は CEDiL で順次公開（ログインが必要なものあり）

## Interpretation

- 「起動」は既存オートメーションの UUID 起動ではなく、公開セッションの取り込みビューアを動かして使えるようにすること
- 成果物の主面は `apps/cedec-capture`（Pages）。全本の deep research レポートは非ゴール

## Open

- 今後、特定セッションの実装メモを `research/` に落とすかは未指定

## Not code

- 有料配信や CEDiL の非公開 PDF は対象外
