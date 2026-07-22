# 2026-07-18 Generative UI + Cursor SDK
- Source: chat
- App: gen-ui
- Status: distilled
- Cursor SDK でエージェントアプリを構築する
- Web 公開（GitHub Pages アップロード）は不要。ローカル動作でよい
- セキュリティを極端に固める必要はないが、**git には上げない**
- 成果物は generative UI ライブラリ + それを使うアプリ
- 素の HTML を LLM に吐き出させるのは面白くない → **一定の制限の中で必要な UI が作れる設計**
- まずゴールを定義する design-doc を作り、それに従って実現まで改善する

## Interpretation
- `apps/` + `docs/` の Pages 公開フローは使わない
- コードは `local/` など gitignore 配下に置く
- 意図・ゴールは `knowledge/apps/gen-ui/` に残す（コードはローカル専用）
- UI は閉じたコンポーネント集合 + スキーマ検証。エージェントは custom tool でツリーを提出する

## Open
- コンポーネント集合の最終範囲は運用しながら拡張してよい（design-doc の Success を満たせばよい）

## Not code
- API キーはユーザー環境の `CURSOR_API_KEY` を使う想定
