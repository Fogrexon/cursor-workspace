# CEDEC Capture

CEDEC 2026 の公式セッション一覧を取り込み、この playground 向けに絞り込んで読むアプリです。

## 使い方

```bash
cd apps/cedec-capture
npm install
npm run capture   # 公式 timetable.json を再取得
npm test
npm run dev       # http://localhost:5173/cursor-workspace/cedec-capture/
npm run build     # → docs/cedec-capture/
```

## 構成

```
src/
  content/sessions.json  # capture 成果（公式 JSON の薄い写し）
  logic/                 # フィルタ・関連度・ルーティング（純関数）
  ui/                    # 一覧・詳細 DOM
scripts/capture.mjs      # 公式ソースからの再取り込み
```

- データ源: `https://cedec.cesa.or.jp/2026/session/timetable.json`
- ルーティング: `location.hash`（`#/list`, `#/s/<uuid>`）
- スタイル: `@playground/theme`

意図: [knowledge/apps/cedec-capture/product-intent.md](../../knowledge/apps/cedec-capture/product-intent.md)
