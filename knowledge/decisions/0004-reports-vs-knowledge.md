# 0004 Separate deep research reports from knowledge/

- Status: accepted
- Date: 2026-07-23

## Context

`knowledge/` はコード解析では分からないプロジェクト固有の意図・制約・インシデントを置く場所。ユーザー要請の deep research は調査成果物であり、プロジェクト固有メモと同列に置くと境界が曖昧になる。Report Viewer も「読めるレポート」の範囲を明確にする必要がある。

## Decision

- プロジェクト固有の記述 → `knowledge/`
- ユーザー要請の deep research 等の調査成果物 → `reports/`（推奨サブdir: `reports/deep-research/`）
- Report Viewer は `reports/` 以下のみを表示対象とする
- 一覧・検索のため、各レポートに必須 YAML frontmatter を置く

## Alternatives rejected

- `knowledge/research/` に調査レポートを置く: knowledge の役割が調査アーカイブに侵食する
- メタデータを別 JSON で管理: ファイル単体で完結せず、レポート追加時に忘れやすい

## Consequences

- deep-research skill の出力先は `reports/deep-research/`
- Report Viewer / catalog 文言を knowledge 閲覧から reports 閲覧へ変更
- `.cursor/rules/reports.mdc` で常時拘束
