# 2026-07-18 Theme + animation model
- Source: chat
- App: canvas-style / canvas-style-ui
- Status: raw
## Facts
- ダーク／ライトなどテーマがちゃんと作れているか、という問い。
- アニメーションも完結できる仕組みを考えたい。
## Interpretation
- 現状の「テーマ」は CSS `:root` 変数のパース／解決のみ。typed Style 経路に Theme API・切替・ライトルートはない。アニメーション機構は未実装。
- DX（authoring-dx）に合わせるなら、トークン表としての Theme と、Style 補間としての Animation を同一の解決パイプラインに載せるのが自然。
## Open
- Theme をセマンティックトークン表にするか、Recipe セット（オブジェクトの束）の切替だけでよいか。
- アニメはランタイム内蔵（tick）か、利用者が毎フレーム `update` するか。
## Not code
- 実装前に authoring-dx へ Theme / Motion 節を足して合意する。
