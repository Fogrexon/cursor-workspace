# Graphim as submodule + demo

Status: raw  
Date: 2026-07-20

## Fact（ユーザー発言）

- graphim ライブラリをローカルにクローンしてくる
- サブリポジトリとしてこのリポジトリに入れる
- ライブラリとして動かしつつ、デモページとセットでこのリポジトリで管理したい
- ライブラリ構成は古いので Vite ベースの最新に書き換えてほしい（アーキテクチャ編集は後から）

## Interpretation

- 対象は [Fogrexon/Graphim](https://github.com/Fogrexon/Graphim)（WebGL 画像エフェクト）
- `git submodule` で `lib/graphim`、デモは `apps/graphim-demo` → `docs/graphim-demo`
- ツールチェーン刷新: Rollup/Babel/uuid/glslify → Vite + Vitest + `graphim/vite` GLSL プラグイン、ソース直出し `exports`
- ノードグラフ等の内部アーキテクチャは据え置き

## Open questions

- Graphim 上流への submodule 内コミット / push のタイミング
- アーキテクチャ刷新のスコープ（ノード API、WebGL2、など）

## Not code

- ライブラリの「正」は引き続き Graphim リポジトリ；playground は消費・デモ・Pages 公開の場
