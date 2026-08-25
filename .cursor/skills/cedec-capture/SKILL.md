---
name: cedec-capture
description: >-
  CEDEC 公開セッションを公式 timetable JSON から取り込み、apps/cedec-capture を
  更新・起動する。Use when the user asks to start/run 「cedec capture」,
  refresh CEDEC 2026 sessions, or recapture the conference catalog.
---

# CEDEC capture

公開メタデータだけを取り込む。動画・スライドの複製はしない。

## Run

```bash
cd apps/cedec-capture
npm run capture          # 公式 JSON を再取得 → src/content/sessions.json
npm test
npm run build            # → docs/cedec-capture/
npm run dev              # http://localhost:5173/cursor-workspace/cedec-capture/
```

カタログを触ったら:

```bash
cd tools/workspace-catalog && npm run build -- --root ../..
```

## Product

意図は [knowledge/apps/cedec-capture/product-intent.md](../../../knowledge/apps/cedec-capture/product-intent.md)。

初期表示は **playground 向け** フィルタ（レンダリング / ニューラルシェーダ / UI 等）。全件を見るときはトグルを外す。

## Must not

- タイムシフト動画や CEDiL のログイン必須 PDF をリポジトリに置かない
- 講演の全文起こしを作らない
- 公式 JSON の写真（speaker.photo）をコミットしない
