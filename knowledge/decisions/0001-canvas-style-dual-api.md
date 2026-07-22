# 0001 Canvas UI authoring model
- Status: accepted
- Date: 2026-07-18
## Context
CSS ライク文字列と「見た目=CSS / 座標=外」の分割は、テキストスタイルの不便さへの誤った解だった。動的キーは事前に決まらない。またサイズ未指定時は子に合わせるオートレイアウトがゲーム UI の自然な期待である。
## Decision
- 実装体験の正本は `knowledge/apps/canvas-style-ui/authoring-dx.md`。
- 第一級: **複数 `ui.view({ state, render })`** + 単一の型付き Style。
- 更新は view の state 代入で宣言的に追従する（手動 `update` は非推奨の逃げ道）。
- 共有は TS の Recipe（定数 spread）と Theme トークン表。カスケードは第一級にしない。
- `width`/`height` 省略軸はコンテンツ（子・テキスト）で決める。余り分配は `grow` 明示時のみ。
- CSS 文字列経路は実験用に格下げ。
- 更新粒度は view 隔離（[0003](0003-view-scoped-ui.md)）。Theme/Motion は [0002](0002-theme-and-motion.md)。
## Alternatives rejected
- layout プロパティだけ programmatic: 動的境界を偽る。
- string stylesheet を見た目の主経路にする: 再パース・型なし・更新コスト。
- 親幅への黙ったストレッチを非 flex 子の既定にする: フォーム行が崩れる。
## Consequences
- 現行単一 `setTree` / `patchStyle` / `setContent` / `setStylesheet` は deprecate 候補。
- 実装順は authoring-dx §7（view → Theme → transition → デモ）。
