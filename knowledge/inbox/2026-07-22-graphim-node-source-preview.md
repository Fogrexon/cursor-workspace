# Graphim node source and output previews

Status: distilled

## Fact

- Image source ノードへ Main image 以外の複数画像を設定したい。
- Image source ノード上に割り当て画像を表示したい。
- ノード選択時に、そのノード自身の output をプレビューしたい。
- 最終 Output の画像は常時表示し、選択ノードの output は別枠で表示したい。

## Interpretation

- 画像はグラフ全体の1設定ではなく、各 Source ノードが独立したアセット参照を持つ。
- Final と中間プレビューは別々の Graphim instance で描画し、選択操作で Final を置き換えない。
- JSON の可搬性と容量を守るため画像バイナリは IndexedDB、グラフには参照 ID のみ保存する。

## Open questions

- 別ブラウザへ画像込みで移す ZIP プロジェクト形式が必要か。

## Distilled to

- `knowledge/apps/graphim-editor/product-intent.md`
