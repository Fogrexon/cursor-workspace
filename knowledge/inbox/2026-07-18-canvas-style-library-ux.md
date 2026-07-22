# 2026-07-18 Canvas Style — library + game UX
- Source: chat
- App: canvas-style-ui / lib canvas-style
- Status: distilled
## Facts
- ライブラリとして使える形にしてほしい。
- 最終用途はゲーム用 UI のデザイン。
- テキストを string で渡すだけで本当に使いやすいか、という疑義がある。
- 仕様に対するクオリティチェックと改善ループを自律的に回してほしい。
## Interpretation
- string DSL 単体はライブ編集・テーマ試作には向くが、ゲーム HUD（HP 更新、クリック、部分変更）には向かない。
- 正しい形は「見た目 = stylesheet」「構造・状態・イベント = TS ツリー / patch API」の二層。
- コアは `lib/canvas-style`（`@playground/canvas-style`）に抽出し、デモアプリは消費者にする。
## Open
- bubble-engine の UI 系との統合は今回の範囲外（将来）。
## Not code
- 「使いやすさ」の判定基準は、ゲームループ中に再パースなしで content / class / イベントを更新できること。
