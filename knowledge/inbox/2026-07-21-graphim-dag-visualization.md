# Graphim demo DAG visualization

Status: raw  
Date: 2026-07-21

## Fact（ユーザー発言）

- Wave カスタムシェーダの見た目を改善する
- 各デモで、構成している DAG をグラフとしてページに表示する

## Interpretation

- カスタムシェーダは強い全体歪みではなく、元画像を活かす流動・色分離表現にする
- 表示専用の別定義ではなく、レンダラへ渡す実際の `GraphHandle` を可視化する
- 分岐・合流・Delay・複数入力を一目で追える左から右の SVG とする

## Open questions

- 将来、表示グラフを編集可能なノードエディタへ発展させるか

## Not code

- 現段階は閲覧専用。ノード編集 UI はスコープ外
