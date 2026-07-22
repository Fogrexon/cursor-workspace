# 0002 Theme tokens + runtime motion
- Status: accepted
- Date: 2026-07-20
## Context
ダーク／ライトとアニメを別物にすると API が割れる。DX は単一 Style モデルと view 単位の再評価を第一級にしている。
## Decision
- Theme = セマンティック・トークン表（`token('surface')`）。全 view で共有。
- Motion = style の `transition` 宣言 + Ui の RAF 補間（手呼び `animate` は低レベル逃げ道）。
- テーマ切替もトークン再解決 + 任意の transition。
## Alternatives rejected
- Recipe セット切替のみ: トークン横断の一貫したテーマに弱い。
- 利用者が毎フレーム update / animate: ボイラープレートが増える。
## Consequences
- view 再 render 後、変わった Style キーに transition があれば補間する。
- 正本: authoring-dx §5。更新粒度は [0003](0003-view-scoped-ui.md)。
