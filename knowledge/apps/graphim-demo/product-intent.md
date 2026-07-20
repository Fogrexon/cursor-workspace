# Graphim Demo — Product intent

## Player / user fantasy

ブラウザ上で Graphim のフィルタを切り替え、WebGL 画像エフェクトの感触をすぐ試せる。

## Success

- `lib/graphim`（Fogrexon/Graphim submodule）を `file:` で消費している
- 主要 Primitives + カスタムシェーダ（wave）が動く
- Pages 上のデモ（`docs/graphim-demo`）からポータル経由で開ける

## Non-goals

- Graphim 本体の大規模リライトや npm 再公開フローの置き換え
- ノードエディタ UI（グラフの視覚編集）

## Constraints

- ライブラリ履歴は Graphim リポジトリ側。playground は submodule ポインタ + デモを管理する
- Vite 消費時は `graphim/vite` の `graphimGlsl()` が必要（シェーダを string module 化）
- ノードグラフ等のアーキテクチャ刷新は別タスク（現状はツールチェーンのみ現代化）
