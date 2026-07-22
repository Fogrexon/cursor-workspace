# Graphim Demo — Product intent

## Player / user fantasy

ブラウザ上で Graphim のフィルタを切り替え、WebGL 画像エフェクトの感触をすぐ試せる。

## Success

- `lib/graphim`（Fogrexon/Graphim submodule）を `file:` で消費している
- 主要 Primitives + カスタムシェーダ（wave）が動く
- Pages 上のデモ（`docs/graphim-demo`）からポータル経由で開ける
- WebGL2 + 宣言的 DAG API（`Graphim.mount` / builders）
- 各サンプルで、分岐・合流を含む実際の DAG を画面上で確認できる
- カスタムシェーダは、ライブラリの表現力が伝わる視覚品質にする

## Non-goals

- ノードエディタ UI（グラフの視覚編集）
- WebGL1 フォールバック

## Constraints

- ライブラリ履歴は Graphim リポジトリ側。playground は submodule ポインタ + デモを管理する
- Vite 消費時は `graphim/vite` の `graphimGlsl()` が必要
- 破壊的 API（旧 `Renderer` / `Filter.connect` 階層は廃止済み）
