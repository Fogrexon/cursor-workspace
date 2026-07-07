# AGENTS.md

このリポジトリの詳しい構成・ワークフローは `README.md` と `.cursor/rules/`、`.cursor/skills/` を参照。

## Cursor Cloud specific instructions

### 構成の要点(実行時に効く前提)

- このリポジトリはルートに `package.json` やロックファイルを持たない。`apps/<app-name>/` と `lib/<lib-name>/` が **それぞれ独立した npm プロジェクト**で、各自 `node_modules` を持つ。作業する対象ディレクトリに `cd` してからコマンドを実行する。
- `lib/theme` は CSS のみのパッケージ(ビルド・テストなし)。各アプリから `file:../../lib/theme` で参照する。`lib/theme` を更新したら利用側アプリで `npm install` を再実行しないと反映されない。

### lint / test / build / run(各アプリ共通)

対象アプリのディレクトリで実行する(例: `apps/temperature-converter/`):

- lint/型チェック: 専用の ESLint は無い。`npm run build` の先頭で走る `tsc`(`noEmit` + `strict`)が型チェックのゲートを兼ねる。
- test: `npm test`(Vitest, `vitest run`)。
- build: `npm run build`(`tsc && vite build`)。成果物は `docs/<app-name>/` に出力され、**コミット対象**。
- dev: `npm run dev`(Vite dev server, 既定で `http://localhost:5173/`)。

### 非自明な落とし穴

- **dev サーバーの URL に base パスが付く。** `vite.config.ts` で `base: '/cursor-workspace/<app-name>/'` を設定しているため、ルート `http://localhost:5173/` は 404 になる。アプリは `http://localhost:5173/cursor-workspace/<app-name>/` で開くこと(ビルド後の `docs/` 配下のアセットパスも同じ base で始まる)。
- 新規アプリ追加時は `docs/index.html`(手書き管理のポータル)にカードを追加する。`docs/` 配下のビルド成果物は手で編集しない。
