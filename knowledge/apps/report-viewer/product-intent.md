# Research Report Viewer — product intent

## Fantasy

`research/` に置いた deep research レポートを、GitHub Pages 上でそのまま読める。Markdown ソースを複製せず、ビルド時に取り込み、目次付きで読める。

## Success

- `research/` 配下の調査レポート Markdown が一覧できる
- 本文が GFM（表・コード）付きでレンダリングされる
- 長文レポートでも TOC で移動できる
- ポータルでは playground Apps とは別の Research 枠に載る

## Non-goals

- Markdown のオンライン編集・CMS
- サーバー側検索インデックス
- `knowledge/`（実装意図・インシデント・ADR）の閲覧
- スキルやルール本体の取り込み

## Constraints

- 静的 GitHub Pages（hash ルーティング）
- UI は `lib/theme` デザインシステム（Semantic トークン + `.ds-*`）に従う
- スマホでも読めること（一覧のタッチ領域、TOC は狭い幅で折りたたみ可能）
- 表示対象は `research/` の first-party Markdown（サニタイズは防御層）
- catalog では `portalSection: research` で Apps と分離する
