# 2026-07-20 View-scoped declarative UI
- Source: chat
- App: canvas-style-ui / lib canvas-style
- Status: distilled
## Facts
- 差分更新が大変なら、UI コンポーネントごとに別ツリーと依存 state を持てるようにするのはどうか、という提案。
- ユーザーは「それでいこう」と合意。
## Interpretation
- 第一級は `ui.view({ state, render })`。精密キー差分は当面作らない。
- 宣言的書き味（state 代入で追従）は view 内で実現する。
- Theme トークンと transition は全 view 共有パイプライン。
## Open
- id スコープ、z 順、共有 state の形。
## Not code
- 実装は authoring-dx §7 の順序で別タスク。
