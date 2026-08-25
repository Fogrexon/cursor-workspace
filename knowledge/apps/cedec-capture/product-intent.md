# CEDEC Capture — Product intent

## Player / user fantasy

CEDEC の約200本から、この playground で試したい描画・UI・シミュレーションの話だけをすぐ開ける。公式ページと CEDiL へ一跳で戻れる。

## Success

- 公式 timetable JSON からセッションを再取得できる
- 日付・分野・キーワード・テキストで絞り込める
- playground 関連度（レンダリング / ニューラルシェーダ / UI など）で優先表示できる
- 各セッションから公式詳細と CEDiL に辿れる
- GitHub Pages 上で静的に読める

## Non-goals

- 有料タイムシフト動画の取り込み・再生
- CEDiL ログインが必要な資料ファイルのミラー
- 全セッションの詳細レポート化（必要なら `research/` に別レポート）
- ライブ中の会場案内・お気に入り同期

## Constraints

- 公開メタデータのみ（公式 JSON / セッションページ）
- 講演の全文起こしやスライド複製はしない
- UI は `lib/theme` の ds-* を使う
