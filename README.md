# Cursor Playground

Cursor で実装するアプリの実験場。各アプリを `apps/` 配下に実装し、ビルド成果物を `docs/` に出力して Vercel で公開する。

公開 URL: `https://cursor-workspace-mu.vercel.app/`（ポータルページから各アプリへ遷移）

## 構成

```
apps/<app-name>/   # 各アプリのソース(Vite プロジェクト)
lib/<lib-name>/    # 再利用可能なローカルライブラリ(file: 参照で利用)
docs/              # 静的公開ルート（Vercel が配信）
  index.html       # ポータルページ(catalog.json から描画)
  <app-name>/      # 各アプリのビルド出力(コミットする)
knowledge/         # 実装意図・ドメイン・インシデント（Pages 対象外）
research/          # deep research レポート（report-viewer で閲覧）
blender/           # Blender MCP 用アセット
  scenes/          # .blend シーン
  exports/         # レンダー等の一時出力（原則コミットしない）
.cursor/
  rules/           # エージェント向けルール(構成・Blender・Vite・責務分離・テスト)
  skills/          # エージェント向けスキル(アプリ作成手順・UIスタイルガイド)
```

## 公開（Vercel）

本番ドメイン: **https://cursor-workspace-mu.vercel.app/**

`vercel.json` で `docs/` を Output Directory にし、`/cursor-workspace/*` → `/*` に rewrite（Vite `base` は Pages 互換のまま）。ルートの `npm run build`（`tools/build-all.mjs`）が全 published アプリと catalog を生成する。公開 URL のソース・オブ・トゥルースは `catalog/workspace.yaml` の `pages.baseUrl`。

## アプリの追加方法

Cursor エージェントに「〜なアプリを作って」と依頼すれば、`.cursor/skills/create-app` のワークフローに従って実装からビルド・ポータル登録まで行われる。要点:

1. `apps/<app-name>/` に Vite プロジェクトを作成
2. `vite.config.ts` で `base: '/cursor-workspace/<app-name>/'` と `outDir: '../../docs/<app-name>'` を設定
3. `@playground/theme` を `file:../../lib/theme` で導入しトンマナを統一
4. UI とロジックを分離し、ロジックに Vitest のテストを書く
5. `npm test` と `npm run build` を通し、`docs/index.html` にカードを追加
