# Cursor Playground

Cursor で実装するアプリの実験場。各アプリを `apps/` 配下に実装し、ビルド成果物を `docs/` に出力して GitHub Pages で公開する。

公開 URL: `https://fogrexon.github.io/cursor-workspace/`(ポータルページから各アプリへ遷移)

## 構成

```
apps/<app-name>/   # 各アプリのソース(Vite プロジェクト)
lib/<lib-name>/    # 再利用可能なローカルライブラリ(file: 参照で利用)
docs/              # GitHub Pages の公開ルート
  index.html       # ポータルページ(手書き管理)
  <app-name>/      # 各アプリのビルド出力(コミットする)
blender/           # Blender MCP 用アセット
  scenes/          # .blend シーン
  exports/         # レンダー等の一時出力（原則コミットしない）
.cursor/
  rules/           # エージェント向けルール(構成・Blender・Vite・責務分離・テスト)
  skills/          # エージェント向けスキル(アプリ作成手順・UIスタイルガイド)
```

## GitHub Pages の設定

リポジトリの Settings → Pages で以下を設定する。

- Source: **Deploy from a branch**
- Branch: **main** / フォルダ: **/docs**

## アプリの追加方法

Cursor エージェントに「〜なアプリを作って」と依頼すれば、`.cursor/skills/create-app` のワークフローに従って実装からビルド・ポータル登録まで行われる。要点:

1. `apps/<app-name>/` に Vite プロジェクトを作成
2. `vite.config.ts` で `base: '/cursor-workspace/<app-name>/'` と `outDir: '../../docs/<app-name>'` を設定
3. `@playground/theme` を `file:../../lib/theme` で導入しトンマナを統一
4. UI とロジックを分離し、ロジックに Vitest のテストを書く
5. `npm test` と `npm run build` を通し、`docs/index.html` にカードを追加
