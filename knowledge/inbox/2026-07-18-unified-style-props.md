# 2026-07-18 Unified style props (not layout-only split)
- Source: chat
- App: canvas-style-ui / lib canvas-style
- Status: distilled
## Facts
- x/y/width/height だけを外に出す統一でない仕組みは変だ、という指摘。
- ユーザーの元の疑義は「スタイルをテキストで渡す実装上の不都合」であり、静的/動的の分割ではない。
- 何が動的になるかは事前に決められない。
## Interpretation
- 正しい第一級 API は型付き `StyleProps`（全プロパティ同一）+ `patchStyle`。
- CSS 文字列は任意の作者向け便利機能（カスケード / :hover / クラス試作）。必須の「見た目レイヤ」ではない。
- 「stylesheet=見た目、TS=レイアウト」という以前の案内は誤りとして訂正する。
## Open
- オブジェクト API 側で :hover / 共有クラスをどう表すか（当面 stylesheet で補完可）。
## Not code
- 動的になりうるキーを白名单化しない。
