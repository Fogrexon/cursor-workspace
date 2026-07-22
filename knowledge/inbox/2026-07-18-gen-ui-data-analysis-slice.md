# 2026-07-18 Generative UI data-analysis slice
- Source: chat
- App: gen-ui
- Status: distilled

## Facts
- 最初の小単位はデータ分析タスク用エージェントとする
- 生成 UI はデータ可視化、SQL 等のデータ操作、汎用的な分析操作画面を担う
- フィルタリング等は簡潔な記述で構築できること
- UI 操作のたびに LLM へ通知し、返り値で画面を作り直す方式は採用しない
- 将来はタスク中に外部からデータ取得するが、現在はダミーデータを使う

## Interpretation
- LLM は画面と分析クエリの宣言的 spec を一度生成する
- select 等の操作、filter、group、aggregate、sort、chart/table 更新はローカル runtime が決定論的に処理する
- 第一段階はダミー売上データの `filter → aggregate → chart + table`
- SQL 実行は次段階とし、同じ dataset/query/view モデルへ接続する

## Open
- 外部データソースと SQL engine の選定は後続タスク

## Not code
- 本段階では分析結果の正しさを LLM 応答に依存させない
