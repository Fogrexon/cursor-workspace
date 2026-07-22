# Graphim DAG architecture rewrite

Status: raw  
Date: 2026-07-20

## Fact（ユーザー発言）

- アーキテクチャ刷新を行う（既存にとらわれず最適を考える）
- テストとコメントを忘れずに
- WebGL2 のみ（1=A）
- フル DAG で実装（Blend / Delay 含む）

## Interpretation

- 継承ベースの `GraphimNode` 階層を廃止し、宣言的 DAG + WebGL2 実行器に置換
- デモは新 API（`Graphim.mount` + builders）へ追従
- 破壊的変更を受け入れ、互換レイヤは作らない

## Not code

- ノードエディタ UI は非目標
