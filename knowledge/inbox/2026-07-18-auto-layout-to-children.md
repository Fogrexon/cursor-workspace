# 2026-07-18 Auto-layout when size omitted
- Source: chat
- App: canvas-style-ui
- Status: distilled
## Facts
- 特に設定されなかったら子要素のサイズに合わせてオートレイアウトしてほしい、という要件。
- DX 仕様を先に規定する作業と併せて述べられた。
## Interpretation
- `width`/`height` 省略 = その軸はコンテンツサイズ（子・テキスト + padding/gap/min*）。
- 親の余りを食うのは `grow` 明示時のみ。非 grow 子の黙った全幅ストレッチはしない。
- authoring-dx.md §4 に正本を置く。実装は DX 合意後。
## Open
- ルート Node のデフォルト（オート vs ビューポート stretch のオプトイン）。
## Not code
- いまはドキュメント反映のみ。レイアウトエンジン変更はレビューゲート後。
