# 2026-07-20 canvas-style: stylesheet mode removal + style sharing
- Source: chat
- App: canvas-style-ui
- Status: distilled

## Facts
- ユーザー想定: `createCanvasUi` 経路で、stylesheet モードと**同等のことができる**ように実装している。
- したがってデモの **stylesheet（スタイル実験）モードは消す**。
- CSS の class / 要素セレクタによる共通化の代替として、このライブラリでの正規手段を明確にする必要がある（ユーザー質問）。

## Interpretation
- スタイル共通化の正規経路は **Recipe（Style 定数 + spread）** と **Theme `token()`**。セレクタ／カスケードは第一級にしない（authoring-dx 既存方針と一致）。
- 「同等」は CSS 構文の再現ではなく、テーマ共有・ボタン見た目の再利用・状態に応じた見た目変更などの**用途カバー**。
- デモ UI から stylesheet 実験タブ・samples を削除し、product-intent の「CSS は実験用」を「デモ・製品面から外す」に更新する。

## Open
- `:hover` / `:active` 相当を Recipe 経路だけでどう書くか（現状は interaction + 空 stylesheet では見た目が変わらないギャップ）。
- `createCanvasStyle` / パーサを lib から削除するか、内部・レガシーとして残すか。

## Not code
- —
