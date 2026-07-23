# Reports

ユーザー要請による **deep research レポート** など、調査成果物を置く場所。

`knowledge/`（プロジェクト固有の意図・制約・インシデント）とは分離する。

## Layout

```
reports/
  README.md
  deep-research/          # deep research 成果物（推奨）
    YYYY-MM-DD-<slug>.md
```

Report Viewer（`apps/report-viewer`）は **このディレクトリ以下の `*.md` のみ** を表示する（本 README は除外）。

## Frontmatter（必須）

各レポート先頭に YAML frontmatter を置く。ビューワーの一覧・検索はこれを優先する。

```yaml
---
title: 表示タイトル
summary: 一覧用の一行〜数行要約
date: YYYY-MM-DD
category: deep-research
tags:
  - example-tag
status: draft | final
audience: 想定読者（任意だが推奨）
lang: ja
---
```

| フィールド | 必須 | 説明 |
|------------|------|------|
| `title` | yes | 一覧・詳細ヘッダ |
| `summary` | yes | 検索・カード要約 |
| `date` | yes | `YYYY-MM-DD`。並び替えキー |
| `category` | yes | フィルタ用。通常 `deep-research` |
| `tags` | yes | 1つ以上。検索・タグ表示 |
| `status` | recommended | `draft` / `final` |
| `audience` | recommended | 想定読者 |
| `lang` | optional | 既定 `ja` |

## Must / Must not

詳細は `.cursor/rules/reports.mdc` と deep-research skill を参照。

- deep research の主成果物 → ここ（`reports/deep-research/`）
- プロジェクト固有の意図・非ゴール・インシデント → `knowledge/`（ここへ置かない）
