# Incident lessons

再発防止の一覧。詳細は `inbox/` または catalog 行のリンク先。

| ID | One-liner | Do not | Barrier | Status |
|----|-----------|--------|---------|--------|
| INC-2026-07-18-row-shrink-wrap | row 内ラベルが行幅を食って Settings Form がズレる | row の非 flex 子を親全幅で確定するな | test: layout Settings Form shrink-wrap | mitigated |
| INC-2026-07-21-dag-edge-overlap | DAG の線が重なる・中間ノードを貫通する | 同一ポート共有や列またぎの直通配線をするな | test: Bloom Glow separate ports + bypass route | mitigated |
| INC-2026-07-22-graphim-editor-animation | 時間依存 DAG が静止画として描画される | 表示用 node kind だけで連続描画を決めるな | test: executable graph animation detection | mitigated |
| INC-2026-07-22-shared-image-source-control | Source個別設定が共有Main画像に見える | Source画像を出力側の共有設定で変更するな | test: independent source params | mitigated |
| INC-2026-07-23-shallow-deep-research-report | deep researchを論文要約で済ませ、読者の意思決定とarchitecture分析を欠いた | 原典の構造分析と証拠追跡なしに設計提言を断定するな | skill: deep-research-report-ja quality gate | open |
