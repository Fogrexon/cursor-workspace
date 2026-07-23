# Knowledge Report Viewer — product intent

## Fantasy

`knowledge/` に置いた調査レポートや意思決定メモを、GitHub Pages 上でそのまま読める。Markdown ソースを複製せず、ビルド時に取り込み、目次付きで読める。

## Success

- research / decisions / domain / incidents / inbox / apps の Markdown が一覧できる
- 本文が GFM（表・コード）付きでレンダリングされる
- ハーネス調査レポートなど長文でも TOC で移動できる

## Non-goals

- Markdown のオンライン編集・CMS
- サーバー側検索インデックス
- knowledge 以外のドキュメント取り込み（スキルやルール本体）

## Constraints

- 静的 GitHub Pages（hash ルーティング）
- UI は `lib/theme` トークンに従う
- 表示対象はリポジトリ内 first-party Markdown（サニタイズは防御層）
