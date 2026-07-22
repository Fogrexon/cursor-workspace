# gen-ui Design Doc

- Status: accepted
- Date: 2026-07-18
- Code: `lib/gen-ui` (library) + `apps/gen-ui` (Cursor SDK host)
- Clarification: source is public; secrets are not; Pages hosts a static library demo only (no API keys; live agent is local)
- Slice 1: data-analysis generative UI with local filter/aggregate/view updates

## Problem

LLM に自由な HTML を出させると保証がなく、操作の意味も曖昧になる。分析 UI では、操作のたびに LLM へ戻すと遅延と不安定さが大きくなる。必要なのは、閉じた部品集合と簡潔な分析 DSL で、ローカルに動く探索画面を生成することである。

## Goal（これが実現されていれば完了）

| # | Criterion | How we know |
|---|-----------|-------------|
| G1 | 閉じた UI カタログがある | カタログ外 `type` は検証で拒否 |
| G2 | LLM 出力は JSON UI / 分析 spec のみ | `validateUiTree` が不正入力を reject |
| G3 | サイズ制限がある | depth/node 超過はエラー |
| G4 | `lib/gen-ui` が validate + DOM render + local data runtime を提供 | 単体テスト緑 |
| G5 | ホストが Cursor SDK + `render_ui` で画面を受け取れる | live/mock で画面更新 |
| G6 | **dataView の filter/chart/table 更新は LLM を経由しない** | select change で即座に再計算 |
| G7 | 秘密は git に載せない | `.env` gitignore |
| G8 | モックモードがある | `npm run demo:mock` |
| G9 | Pages は静的デモのみ。API キーなし・ライブ不可を明記 | `docs/gen-ui` + ページ内 notice |
| G10 | v1 データはダミー売上。将来 SQL/外部取得へ接続可能なモデル | `source` + `query` + `views` |

## Non-goals (slice 1)

- SQL engine 実装
- 外部データ取得
- UI 操作ごとの LLM round-trip
- Pages / GitHub への API キー配置・課金発生しうるライブ呼び出し

## Architecture

```
LLM / mock
  └─ render_ui(screen with dataView)
        │
        ▼
Host validates tree + known datasets
        │
        ▼
Browser renderer
  controls → local params
  executeDataQuery(source, query, params)
  chart / dataTable update
```

### Analysis DSL (concise)

```ts
{
  type: "dataView",
  source: "user_logs",
  controls: [{ type: "select", param: "platform", field: "platform", label: "Platform" }],
  query: {
    where: [{ field: "platform", op: "eq", param: "platform" }],
    groupBy: ["day"],
    measures: [{ op: "count", as: "events" }],
    orderBy: [{ field: "day" }]
  },
  views: [
    { type: "chart", kind: "line", x: "day", y: "events" },
    { type: "dataTable", columns: ["day", "events"] }
  ]
}
```

Empty/null param = All (predicate skipped). Dummy data: `user_logs` (~8k synthetic app events).

## Secrets

- Runtime: `CURSOR_API_KEY` via `.env` (gitignored)
- Commit: `.env.example` only
