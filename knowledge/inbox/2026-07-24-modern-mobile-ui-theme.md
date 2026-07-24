# 2026-07-24 ポータル / Research Viewer の UI 現代化とモバイル対応
- Source: chat
- App: cross-cutting（portal / report-viewer / lib/theme）
- Status: raw
## Facts
- ルートページや research を見るビューワなど、全体的に UI がダサめに見える。
- もっとナウい感じの UI テーマにしてほしい。
- スマホで見ても違和感のない UI にしてほしい。
## Interpretation
- 共通トークン（`lib/theme`）の色・タイポ・陰影が古く／汎用ダーク＋インディゴに寄り、ポータルと Research Viewer のレイアウトもデスクトップ前提でモバイルが弱い。
- トンマナ更新はアプリ個別のハードコードではなく `lib/theme` を正本にし、ポータル（`docs/index.html`）と `report-viewer` のレイアウト／タッチターゲットをモバイルファーストで整える。
## Open
- 全アプリの `docs/<app>/` 再ビルドをこの変更に含めるか（トークン変更の反映範囲）。当面はポータルと report-viewer を優先し、他アプリは次回ビルドで追従でよいか。
## Not code
- ポータルはアプリ一覧なので「ダッシュボード的なカードグリッド」は許容。ヒーローに統計やプロモは載せない。
