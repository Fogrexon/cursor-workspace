# Graphim project output size

Status: distilled

## Fact

- 画像サイズは Input ごとではなく、プロジェクト単位で指定したい。

## Interpretation

- 幅・高さは EditorDocument のプロジェクト設定として保存する。
- Final output、Node output、`resolution` uniform、画像書き出しは同じ描画バッファサイズを使う。
- 入力画像は各自の解像度を保ったテクスチャとして読み込み、プロジェクト解像度へ描画する。

## Open questions

- アスペクト比固定、定型サイズプリセット、入力画像への fit / crop 指定が必要か。

## Distilled to

- `knowledge/apps/graphim-editor/product-intent.md`
