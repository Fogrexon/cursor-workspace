# 2026-07-24 デザインシステム（テーマではない）への要求
- Source: chat
- App: cross-cutting（lib/theme / portal / report-viewer）
- Status: distilled
## Facts
- スマホ対応はかなり良い、との評価。
- UI のテーマをもう少し頑張ってほしい。
- 現在のトレンドをまとめた後、Web UI として実装してほしい。
- フォローアップ: **テーマというよりデザインシステムに関する話**をしてほしい。
## Interpretation
- 求められているのは流行色の差し替えではなく、トークン階層・部品契約・アクセシビリティを含む **デザインシステム更新**。
- 実装の正本は `lib/theme`（トークン + `ds-*` プリミティブ）。ポータル／report-viewer が最初の消費者。
## Open
- なし（0004 で方針確定）
## Not code
- トレンド要約の詳細は [0004](../decisions/0004-design-system-layers.md) と実装スキル `ui-style` を参照。
