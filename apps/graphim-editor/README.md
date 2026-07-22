# Graphim Node Editor

Graphim の WebGL2 エフェクト DAG を視覚的に設計するノードエディタです。

## Features

- ノードの追加・ドラッグ配置・ポート接続
- Image source ごとの画像割り当て・サムネイル表示（画像本体は IndexedDB）
- 単入力エフェクト、2〜3入力ブレンド、Delay、カスタム GLSL
- 常時表示する Final output と、独立した選択ノード出力プレビュー
- プロジェクト単位の出力ピクセルサイズ指定（最大 8192×8192）
- 3種類のプリセット
- JSON プロジェクトの保存・読み込みと `localStorage` 自動保存
- 接続不足・参照不正・循環の検証

## Commands

```bash
npm install
npm test
npm run dev
npm run build
```

開発 URL: `http://localhost:5173/cursor-workspace/graphim-editor/`
