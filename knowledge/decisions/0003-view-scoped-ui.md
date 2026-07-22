# 0003 View-scoped trees + global shared state
- Status: accepted
- Date: 2026-07-20
## Context
宣言的 UI の大規模化に対し、1本ツリーの精密差分は高い。view 分割で再評価境界を作る。一方、HP/Score/Theme など島をまたぐ値はローカル複製より共有 bag の方が自然、という指摘。
## Decision
- **グローバル共有 state** を `ui.state({...})` として第一級にする。複数 view が読んでよい。
- **再評価単位は `ui.view`**。render が読んだ state キーが変わった view だけ再 `render`。
- **view ローカル state は正規の第二級機能**（UI 専用の一時状態用）。共有データの複製先としては使わない。
- Fine-grained なキー単位 Style patch エンジンは当面作らない。
- Theme / transition は全 view 共有パイプライン（[0002](0002-theme-and-motion.md)）。
- 正本: `knowledge/apps/canvas-style-ui/authoring-dx.md`。
## Alternatives rejected
- view ローカル state のみ: 共有データの手動同期が発生する。
- 全体 remount のみ: 大規模で無駄が大きい。
- キー単位精密差分を最初から: 初期ゲーム UI には過剰。
## Consequences
- 実装順: `ui.state` + 依存追跡 → `ui.view` → Theme → transition → デモ。
- 依存追跡は「view がどのグローバル／ローカルキーを読んだか」まででよい。
