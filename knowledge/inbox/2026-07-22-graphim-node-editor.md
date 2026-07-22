# Graphim node editor

Status: distilled

## Fact

- Graphim のノードをノードエディタのように設計できるツールが必要。

## Interpretation

- 既存 `graphim-demo` はエフェクト閲覧デモとして維持し、編集ツールは独立した `graphim-editor` アプリにする。
- 「設計」には、ノード配置、分岐・合流を含む接続、パラメータ編集、実行結果の確認、プロジェクト保存を含める。

## Open questions

- 将来、Graphim の任意のサードパーティーノード定義をプラグインとして読み込むか。
- ノードグループ、Undo/Redo、ズーム・パンをどの優先度で追加するか。

## Distilled to

- `knowledge/apps/graphim-editor/product-intent.md`
