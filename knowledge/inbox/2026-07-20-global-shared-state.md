# 2026-07-20 Global shared state
- Source: chat
- App: canvas-style-ui / lib canvas-style
- Status: distilled
## Facts
- ステートは共有できるグローバルなものを用意したほうがよさそう、という指摘。
## Interpretation
- `ui.state` を第一級の共有 bag にする。view ローカルは任意の補助。
- 再評価は「どの view がどのキーを読んだか」で絞る（view 隔離と両立）。
## Open
- state bag を複数（名前付き）にするか単一か。
## Not code
- authoring-dx / ADR 0003 を更新済み。実装は別タスク。
