# Graphim Node Editor — Product intent

## Player / user fantasy

Graphim の画像エフェクトをコードだけで組み立てる前に、ノードを配置して線でつなぎ、分岐・合流と結果を同じ画面で試せる。

## Success

- 入力、単入力エフェクト、2〜3入力合成、Delay、Output を視覚配置できる
- 出力ポートから入力ポートへ接続し、実際の DAG と同じ分岐・合流が見える
- 選択ノードの入力とパラメータを編集できる
- Image source ごとに別の画像を割り当て、ノード上で入力内容を確認できる
- 保存上の Final output を常時表示できる
- Final output とは別に、選択した任意ノードの中間出力をライブプレビューできる
- プロジェクト単位で出力ピクセルサイズを指定し、全Source・プレビュー・書き出しへ共通適用できる
- 不完全な接続や循環を WebGL 実行前に検出できる
- Graphim の実行結果をライブ表示し、画像として書き出せる
- プロジェクトを JSON で保存・復元できる

## Non-goals

- 汎用シェーダ IDE や GLSL デバッガの代替
- WebGL1 対応
- 複数ユーザーのリアルタイム共同編集

## Constraints

- `graphim-demo` は閲覧デモとして維持し、エディタは独立アプリにする
- 保存モデルには DOM、WebGL、画像バイナリを含めず、プレーンな JSON とする
- ユーザー画像のバイナリは IndexedDB、JSON グラフには安定した参照 ID のみを保存する
- Graphim の公開 DAG builder API にコンパイルして実行する
