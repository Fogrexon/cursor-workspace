# Canvas UI — Authoring DX（合意用ドラフト）

- Status: accepted（書き味の方針は合意済み。実装はこれに合わせる）
- Package: `@playground/canvas-style`
- Audience: Canvas 上にゲーム HUD / パネルを置くアプリ開発者

## 一文の体験

UI を **view（独立した小さな木）** の集合として書く。  
**グローバルな共有 state**（と必要なら view ローカル state）から宣言的にツリーを作り、**読んだ state が変わった view だけ**再評価する。  
Style は layout / paint / text を一つのオブジェクトに載せ、テーマはトークン表、動きは `transition` で宣言する。

CSS 互換・セレクタ・カスケード・巨大1本ツリーの精密差分は第一級にしない。

---

## 1. Happy path

```ts
import {
  createCanvasUi,
  node,
  token,
  darkTheme,
  lightTheme,
} from '@playground/canvas-style';

const ui = createCanvasUi(canvas);

// グローバル共有 state（複数 view が読んでよい）
const app = ui.state({
  hp: 100,
  score: 0,
  theme: 'dark' as 'dark' | 'light',
  hudOpen: true,
});

ui.setTheme(() => (app.theme === 'dark' ? darkTheme : lightTheme), {
  transition: 200,
});

const buttonPrimary = {
  padding: [10, 12] as const,
  fill: token('accent'),
  textColor: '#ffffff',
  radius: 6,
  textSize: 13,
  textWeight: 600,
};

// view = 再評価の境界。render が読んだグローバル／ローカル state だけが依存になる
const hud = ui.view({
  // ローカルは島専用の一時 UI 用。省略可
  state: { pulse: false },
  render: (local) =>
    node('panel', {
      id: 'hud',
      style: {
        x: 24,
        y: app.hudOpen ? 24 : 8,
        width: 280,
        direction: 'column',
        gap: 10,
        padding: 16,
        fill: token('surface'),
        stroke: token('border'),
        radius: 12,
        opacity: app.hudOpen ? 1 : 0,
        transition: { opacity: 220, y: 220 },
      },
      children: [
        node('text', {
          id: 'title',
          style: {
            text: 'Survival Run',
            textSize: 18,
            textWeight: 700,
            textColor: token('text'),
          },
        }),
        node('text', {
          id: 'hp-label',
          style: {
            text: `HP ${app.hp}`,
            textSize: 13,
            textColor: app.hp < 30 ? token('danger') : token('muted'),
            transition: { textColor: 160 },
          },
        }),
        node('panel', {
          id: 'hp-fill',
          style: {
            width: (248 * app.hp) / 100,
            height: 10,
            fill: app.hp < 30 ? token('danger') : token('ok'),
            radius: 6,
            transition: { width: 180, fill: 180 },
          },
        }),
        node('button', {
          id: 'hit',
          style: { ...buttonPrimary, text: 'Take hit' },
          onClick: () => {
            app.hp = Math.max(0, app.hp - 15);
          },
        }),
        node('button', {
          id: 'toggle',
          style: { ...buttonPrimary, text: local.pulse ? 'Hide*' : 'Hide' },
          onClick: () => {
            app.hudOpen = !app.hudOpen;
            local.pulse = !local.pulse;
          },
        }),
      ],
    }),
});

const scoreboard = ui.view({
  render: () =>
    node('panel', {
      id: 'scoreboard',
      style: {
        x: 520,
        y: 24,
        width: 160,
        padding: 12,
        fill: token('surface'),
        stroke: token('border'),
        radius: 12,
      },
      children: [
        node('text', {
          id: 'score-text',
          style: {
            text: `Score ${app.score}`,
            textColor: token('text'),
            textSize: 16,
            textWeight: 700,
          },
        }),
        node('button', {
          id: 'theme',
          style: { ...buttonPrimary, text: 'Theme' },
          onClick: () => {
            app.theme = app.theme === 'dark' ? 'light' : 'dark';
          },
        }),
        node('button', {
          id: 'loot',
          style: { ...buttonPrimary, text: '+Score' },
          onClick: () => {
            app.score += 10;
          },
        }),
      ],
    }),
});

// ゲーム側はグローバル state を触るだけ
app.hp -= 15; // → hud だけ再評価（scoreboard は app.hp を読んでいない）
app.score += 10; // → scoreboard だけ再評価
```

### Happy path で保証したいこと

- **共有・ゲームデータの正本は `ui.state(...)`（グローバル）**。複数 view が同じ値を読んでよい
- **再評価単位は `ui.view`**。`render` が実際に読んだキーだけが依存になる
- **view ローカル state は正規機能**（非推奨ではない）。ただし用途は「その view だけの UI 一時状態」に限る
- Style は layout / paint / text を同一オブジェクトに載せる
- アニメは `transition`、テーマは `token` + 共有 Theme 表
- 手動 `update` は推奨しない

### State の使い分け（正規）

| 種類 | API | 位置づけ | 置くもの | 置かないもの |
|------|-----|----------|----------|--------------|
| **Global** | `ui.state({...})` | **既定・第一級** | HP, Score, Theme, 画面モード, クエスト進行などアプリ／複数 view が知る値 | — |
| **Local** | `ui.view({ state: {...} })` | **正規・第二級**（任意） | そのパネルだけの開閉、タブ選択、入力中ドラフト、一瞬の UI フラグ | HP/Score/Theme など共有すべき値 |

ローカルは「使えはするけど非推奨」ではない。  
**共有データをローカルに置いて view 間で手動同期する使い方**だけが非推奨。

迷ったら **全部グローバル** でよい。ローカルは、グローバル bag を汚したくない UI 専用の細部が出たときに使う。

---

## 2. なぜ view 分割か（大規模化）

精密なキー単位差分エンジンは作らない（初期コストが高い）。

| 方式 | 採用 |
|------|------|
| 巨大1本ツリー + Fine-grained 差分 | しない（当面） |
| **グローバル state + view 単位の再 render** | **する（第一級）** |
| view 内の丸ごと再 `render` | する（view を小さく保つ前提） |

依存は「どの view の render がどの state キーを読んだか」で取る。

view をまたぐレイアウトは弱くなる → 絶対配置か、同じ view にまとめる。

---

## 3. 禁止・非推奨

| やらない | 理由 |
|----------|------|
| 毎フレーム巨大 CSS 文字列を再適用 | パース・型なし・差分不能 |
| `x`/`width` だけ別 API | 動的境界を偽る |
| 全部を1本の巨大 `render` に押し込む | view 分割の意味がなくなる |
| 共有値を view ローカルに複製して手動同期 | グローバル `ui.state` を使え |
| HP/Score/Theme を view ローカルだけに持つ | 共有データの正本が消える |
| セレクタ／カスケードに頼る上書き | 予測しづらい |

手動 `update(id, partial)` / `animate` は逃げ道として残してよいが、**推奨経路ではない**。

---

## 4. 概念

| 概念 | 意味 |
|------|------|
| **Ui** | Canvas に結びつくランタイム。複数 view を合成して描画 |
| **Global state** | `ui.state({...})`。アプリ／複数 view が知るデータの正本。**既定で使う** |
| **View** | 独立した Node ツリー + 任意のローカル state + `render`。再評価の境界 |
| **Local state** | view 専用の UI 一時状態。**正規機能・省略可**。共有データの置き場ではない |
| **Node** | id・種別・style・children・onClick |
| **Style** | layout + paint + text の一つの型付きオブジェクト |
| **Recipe** | 普通の Style 定数（spread）。CSS の class / 要素ルールの代わり |
| **Theme** | セマンティック・トークン表（`token('surface')`） |
| **Transition** | style キーの目標値が変わったときの補間宣言 |

### スタイル共通化（stylesheet の代替）

CSS の `button { … }` / `.primary { … }` は**使わない**。代わりに TypeScript で共有する。

| やりたいこと | このライブラリでのやり方 |
|--------------|---------------------------|
| ボタン見た目を複数箇所で同じに | `const buttonPrimary = { … }` を `style: { ...buttonPrimary, text: '…' }` |
| 色・表面をアプリ全体で揃える | `token('surface')` + `ui.setTheme(...)` |
| 状態で見た目を変える | `render` 内で `app.hp < 30 ? token('danger') : token('ok')` |
| ホバー専用ルール | Open（セレクタ `:hover` は第一級にしない。別 API が要るなら追記） |

`createCanvasUi` 経路だけで旧 stylesheet モードと**用途として同等**であることを目指す。デモの stylesheet モードは置かない。

id は Canvas 全体で一意（またはランタイムが view 接頭辞を付与）。衝突は診断する。

---

## 5. Style / オートレイアウト / Theme / Motion

### Style

layout / paint / text は同じ `style`。語彙の最終名（`fill` 等）は実装時に現行 API から移行してよい。

### オートレイアウト

`width` / `height` 省略軸は子・テキストに合わせる。余り分配は `grow` 明示時のみ。

### Theme

```ts
ui.setTheme(() => (app.theme === 'dark' ? darkTheme : lightTheme), {
  transition: 200,
});
```

### Motion

```ts
style: {
  opacity: app.hudOpen ? 1 : 0,
  transition: { opacity: 220, y: 220 },
}
```

---

## 6. いまの実装との差分

| 現状 | DX |
|------|-----|
| `setTree` / `setDocument` 単一木 | → 複数 `ui.view({ render, state? })` |
| `patchStyle` / `setContent` 手動 | → **`ui.state` 代入** |
| 共有 state なし | → **`ui.state` が第一級** |
| CSS stylesheet 主経路 | → **廃止（デモから削除）。共通化は Recipe + Theme** |
| テーマなし | → `token` + Theme 表 |
| アニメなし | → `transition` + RAF |
| 全体レイアウト毎回 | → **依存キーを読んだ view だけ**再 layout |

---

## 7. 実装順序（合意済み方針）

1. `ui.state`（グローバル）+ キー単位の依存追跡
2. `ui.view` + 該当 view だけ再 `render`
3. Theme トークン + `setTheme`
4. `transition`
5. デモをグローバル state + 複数 view の HUD に刷新
6. （後回し）プロパティ語彙リネーム、`:hover` 相当の Recipe 経路、view 内 Fine-grained
7. （任意）`createCanvasStyle` / パーサを lib から削除するかレガシー固定するか

---

## 8. Open

- view の描画順 / z-index
- id の接頭辞自動付与かグローバル一意の強制か
- `ui.state` を複数（名前付きストア）作れるか、単一 bag か
- ルートのデフォルトサイズ（オート vs ビューポート）
- `:hover` / `:active` を Recipe 経路でどう書くか
- `createCanvasStyle` を lib から削除するか
