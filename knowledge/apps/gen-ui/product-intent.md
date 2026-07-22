# gen-ui — Product intent

## Player / user fantasy
エージェントに分析を頼むと、自由 HTML ではなく**許可された UI 部品と分析 spec**で、データを探索できる画面が現れる。フィルターや集計は即座に動き、操作のたびに LLM を待たない。

## Success
- 制約付き UI ツリーを検証・描画できるライブラリがある（公開ソース）
- Cursor SDK エージェントがそのツリーを custom tool 経由で提出できるホストがある（ローカル実行）
- LLM は宣言的な dataset/query/view spec を生成できる
- フィルター、集計、ソート、可視化更新はローカル runtime が決定論的に処理する
- 将来、同じモデルへ SQL と外部データソースを接続できる
- API キー等の秘密はリポジトリに含まれない
- Pages 公開は必須ではない

## Non-goals
- GitHub Pages での動作保証 / ポータル必須登録
- 任意 HTML・CSS・JS の生成
- UI 操作ごとの LLM round-trip
- 本番級の認可・サンドボックス・マルチテナント
- ソースコード自体の非公開

## Constraints
- TypeScript + `@cursor/sdk`（local runtime）
- UI はスキーマ検証を通過したものだけ描画する
- v1 の分析データはダミーデータ。分析実行はクライアント内
- 秘密情報は `.env`（gitignore）。ソースは `lib/gen-ui` + `apps/gen-ui`
