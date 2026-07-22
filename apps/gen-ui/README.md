# gen-ui

Pages では **ライブラリの静的デモ**のみ公開します。Cursor SDK のライブエージェントはローカル専用です。

## Pages と API キー

- GitHub / GitHub Pages に `CURSOR_API_KEY` 等は**一切渡しません**（課金防止）
- Pages 上ではエージェントチャットは動きません（ページ上部にその旨を表示）
- 動くのは `@playground/gen-ui` のフィクスチャとローカル `dataView` のみ

## Commands

```bash
cd apps/gen-ui
npm install
npm test
npm run build   # → docs/gen-ui/ （Pages）
```

### Local agent host（API キーは `.env` のみ）

```bash
cp .env.example .env   # CURSOR_API_KEY=
npm run demo:mock      # キー不要モック
npm run dev            # ライブ（.env 必須）
```

- Library: `lib/gen-ui`
- Design: `knowledge/apps/gen-ui/design.md`
