# gen-ui — Product intent

## Player / user fantasy
エージェントに分析を頼むと、自由 HTML ではなく**許可された UI 部品と分析 spec**で、データを探索できる画面が現れる。Pages ではライブラリの見た目を確認でき、ライブエージェントはローカルだけ。

## Success
- 制約付き UI ツリーを検証・描画できるライブラリがある（公開ソース）
- Pages（`docs/gen-ui`）でフィクスチャデモを見られる
- Pages / GitHub に API キーを置かず、ページ上で「ライブはローカル専用」と明示する
- Cursor SDK ホストはローカル（`.env`）でのみ動く
- フィルター、集計、ソート、可視化更新はローカル runtime が決定論的に処理する

## Non-goals
- Pages 上での Cursor SDK ライブエージェント
- GitHub Secrets 経由で Pages から Cursor API を叩くこと
- 任意 HTML・CSS・JS の生成
- UI 操作ごとの LLM round-trip

## Constraints
- TypeScript + `@cursor/sdk`（local runtime only）
- 秘密情報は `.env`（gitignore）。`.env.example` のみコミット可
- ソースは `lib/gen-ui` + `apps/gen-ui`
