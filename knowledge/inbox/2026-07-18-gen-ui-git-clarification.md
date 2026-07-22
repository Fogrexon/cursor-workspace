# 2026-07-18 Generative UI intent correction
- Source: chat
- App: gen-ui
- Status: distilled

## Facts
- 「git に上げない」は **アプリ本体ソースを秘匿する**意味ではなかった
- 正しくは: **ソースコードは公開してよい** / **API キー等の認証情報はアップロードしない** / **GitHub Pages 上での動作保証は不要**（ローカル動作でよい）

## Interpretation
- コードは `lib/gen-ui` + `apps/gen-ui` に置き、通常どおり git 管理する
- `.env` / `CURSOR_API_KEY` は gitignore。`.env.example` のみコミット可
- `docs/gen-ui` ビルドやポータルカードは必須ではない（Pages 非ゴール）

## Open
- なし

## Not code
- —
