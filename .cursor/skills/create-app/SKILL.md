---
name: create-app
description: このリポジトリに新しいアプリを追加するワークフロー。ユーザーが「アプリを作って」「新しいアプリを追加」「〜を実装して公開して」などと依頼したとき、apps/ 配下に Vite プロジェクトを作成し docs/ にビルドして GitHub Pages で公開するまでの手順として使う。
---

# アプリ新規作成ワークフロー

新しいアプリを `apps/<app-name>/` に作り、ビルド成果物を `docs/<app-name>/` に出力し、ポータルに登録するまでの手順。ビルドと登録まで完了して初めてタスク完了。

## チェックリスト

```
- [ ] 1. apps/<app-name>/ に Vite プロジェクトを作成
- [ ] 2. vite.config.ts に base と outDir を設定
- [ ] 3. lib/theme を導入しトンマナを合わせる(ui-style スキル参照)
- [ ] 4. ui / logic を分離して実装
- [ ] 5. Vitest を設定し logic のテストを書く
- [ ] 6. npm test が通ることを確認
- [ ] 7. npm run build で docs/<app-name>/ に出力されることを確認
- [ ] 8. docs/index.html のポータルにアプリカードを追加
```

## 1. プロジェクト作成

```bash
# apps/ 配下で。テンプレートは用途に応じて vanilla-ts / react-ts など
npm create vite@latest <app-name> -- --template vanilla-ts
```

## 2. vite.config.ts

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cursor-workspace/<app-name>/',
  build: {
    outDir: '../../docs/<app-name>',
    emptyOutDir: true,
  },
});
```

## 3. package.json の要点

```json
{
  "name": "<app-name>",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest run"
  },
  "dependencies": {
    "@playground/theme": "file:../../lib/theme"
  },
  "devDependencies": {
    "vitest": "latest"
  }
}
```

依存の追加は `npm install` で行い、バージョンを手書きで捏造しない。

## 4. 実装

`src/ui/`(表示)と `src/logic/`(純粋ロジック)を分ける。separation-of-concerns ルールに従う。

## 5-6. テスト

logic の関数ごとに `*.test.ts` を書き、`npm test` が全て通ることを確認する。testing ルール参照。

## 7. ビルド確認

`npm run build` 後、`docs/<app-name>/index.html` が生成され、内部のアセットパスが `/cursor-workspace/<app-name>/` で始まることを確認する。

## 8. ポータル登録

`docs/index.html` のアプリ一覧に、既存カードと同じマークアップでカードを 1 枚追加する。

```html
<a class="card" href="./<app-name>/">
  <h2>アプリ名</h2>
  <p>1行の説明</p>
</a>
```
