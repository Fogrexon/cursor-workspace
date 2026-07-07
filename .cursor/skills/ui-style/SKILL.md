---
name: ui-style
description: このリポジトリの全アプリで UI のトンマナを統一するためのスタイルガイド。アプリの UI・CSS・コンポーネント・配色・タイポグラフィを実装または変更するときに使う。lib/theme のデザイントークンの使い方を定義する。
---

# UI スタイルガイド(トンマナ統一)

全アプリで `lib/theme` のデザイントークン(CSS カスタムプロパティ)を使う。色・余白・角丸・影を独自の生値でハードコードしない。

## 導入

```json
// package.json
"dependencies": { "@playground/theme": "file:../../lib/theme" }
```

```typescript
// エントリポイント(main.ts など)で読み込む
import '@playground/theme/theme.css';
```

## トーン&マナー

- ダーク基調、アクセントは 1 色(インディゴ)に絞る
- フラット + 控えめな影。グラデーションや過剰な装飾は使わない
- 余白は 8px グリッド(`--space-*`)に揃える
- 角丸は `--radius`(カード)と `--radius-sm`(ボタン・入力)の 2 種のみ
- 遷移は `--transition` を使い、150ms 程度の控えめなものに留める

## 主要トークン

```css
/* 色 */
var(--color-bg)          /* ページ背景 */
var(--color-surface)     /* カード・パネル背景 */
var(--color-border)      /* 罫線 */
var(--color-text)        /* 本文 */
var(--color-text-muted)  /* 補足テキスト */
var(--color-accent)      /* アクセント(ボタン・リンク) */
var(--color-accent-hover)
var(--color-danger)      /* エラー・破壊的操作 */

/* 余白(8px グリッド) */
var(--space-1) ... var(--space-6)  /* 4, 8, 16, 24, 32, 48px */

/* その他 */
var(--radius) var(--radius-sm) var(--shadow) var(--transition)
var(--font-sans) var(--font-mono)
```

トークンの全定義は `lib/theme/theme.css` を参照。トークンが不足する場合はハードコードせず `lib/theme` に追加してから使う。

## 書き方の例

```css
/* ❌ BAD: 生値のハードコード */
.card { background: #1e1e2e; border-radius: 12px; padding: 20px; }

/* ✅ GOOD: トークンを使う */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-3);
}
```

## 共通 UI の慣例

- ボタン: 背景 `--color-accent`、hover で `--color-accent-hover`、角丸 `--radius-sm`
- ページ最上部にアプリタイトル、ポータル(`../`)へ戻るリンクを置く
- レスポンシブ必須。コンテンツ幅は `max-width: 960px; margin-inline: auto` を基本とする
