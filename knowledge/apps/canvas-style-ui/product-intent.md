# Canvas Style UI — Product intent
## Player / user fantasy
ゲーム HUD を、独立した view（小さな木 + 依存 state）の集合として Canvas 上に組み、state を変えるだけでその島の見た目が追従する。
## Success
- 実装体験は [authoring-dx.md](./authoring-dx.md) に従う。
- **`ui.state`（グローバル共有）** がデータの正本。複数 view が読んでよい。
- `ui.view({ render, state? })` が再評価の境界。読んだキーが変わった view だけ更新する。
- Style は layout / paint / text を一つのオブジェクトに統一する。
- スタイル共通化は **Recipe（定数 + spread）** と **Theme `token()`**（CSS セレクタではない）。
- Theme はセマンティック・トークン表。Motion は `transition` + ランタイム補間。
- `@playground/canvas-style` として他アプリから使える。
- `createCanvasUi` 経路だけで、旧 stylesheet モードが担っていた用途（テーマ・見た目再利用・状態連動）をカバーする。
## Non-goals
- Web CSS / DOM / セレクタ / カスケードの第一級互換。
- デモや推奨 API としての stylesheet モード。
- 巨大1本ツリー向けの Fine-grained 差分エンジン（当面）。
- 共有値を view ローカルに複製して手動同期する設計。
- bubble-engine 統合（別タスク）。
## Constraints
- コアは `lib/canvas-style`。グローバル state の依存追跡・view 隔離・Theme・transition を単体テストする。
- 設計の正本は authoring-dx。コード側 README からもリンクする。
