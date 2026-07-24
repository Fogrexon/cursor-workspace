# workspace-catalog

YAML で記述したワークスペース／アプリ／ライブラリのメタ情報から、**静的な JSON API**（`catalog.json`）を生成するツール。

GitHub Pages のような静的配信でも `fetch('./api/catalog.json')` で利用できる。サーバーは不要。

他の workspace 系リポジトリでも、このディレクトリをコピーするか依存として参照し、`catalog/workspace.yaml` + `catalog/entries/**/*.yaml` を置けば同じ形で使える。

## Layout (consuming repo)

```
catalog/
  workspace.yaml          # パス規約・Pages URL・GitHub テンプレート
  entries/
    apps/<id>.yaml
    libs/<id>.yaml
docs/
  api/catalog.json        # 生成物（コミットして Pages で配信）
```

## Commands

```bash
cd tools/workspace-catalog
npm install
npm test
npm run build -- --root ../..   # repo root を指定 → docs/api/catalog.json
npm run check -- --root ../..   # YAML とコミット済み JSON の同期確認（generatedAt 無視）
# または
npx workspace-catalog --root /path/to/repo
npx workspace-catalog --check --root /path/to/repo
```

## GitHub Actions

| Workflow | トリガー | 内容 |
|----------|----------|------|
| [`.github/workflows/catalog.yml`](../../.github/workflows/catalog.yml) | `catalog/` / tool 変更の PR・push、手動 | `npm test` + `npm run check` |
| [`.github/workflows/deploy-pages.yml`](../../.github/workflows/deploy-pages.yml) | `main` push、手動 | デプロイ前に `catalog.json` を再生成して Pages へ |

他リポジトリへコピーする場合は、上記 2 workflow も合わせて持っていく（`working-directory` / `cache-dependency-path` をパスに合わせる）。

## Spec

| ファイル | 役割 |
|----------|------|
| [schema/workspace.schema.json](schema/workspace.schema.json) | リポジトリ全体のパス・URL |
| [schema/entry.schema.json](schema/entry.schema.json) | 各 app/lib のメタデータ |
| [schema/catalog.schema.json](schema/catalog.schema.json) | 出力 JSON（API） |

YAML 先頭に `"$schema": "../tools/workspace-catalog/schema/....json"` を書いてエディタ補完できる。

## Output shape (v1)

```json
{
  "version": 1,
  "generatedAt": "...",
  "workspace": {
    "id": "...",
    "title": "...",
    "pagesBaseUrl": "https://…/",
    "apiUrl": "https://…/api/catalog.json",
    "source": { "provider": "github", "owner": "…", "repo": "…", "branch": "main", "url": "…" }
  },
  "items": [
    {
      "id": "liquid-lab",
      "kind": "app",
      "title": "Liquid Lab",
      "summary": "…",
      "tags": ["…"],
      "status": "published",
      "sourcePath": "apps/liquid-lab",
      "links": {
        "demo": "https://…/liquid-lab/",
        "source": "https://github.com/…/tree/main/apps/liquid-lab",
        "docs": null
      },
      "related": [],
      "order": 10,
      "portal": true
    }
  ]
}
```

## Status / portal

| status | 意味 |
|--------|------|
| `published` | Pages 上で公開。app はデフォルトで portal 表示 |
| `local` | ソースのみ（デモ URL なし想定） |
| `draft` / `archived` | 一覧には載るが portal では通常除外 |

`portal: false` で明示的にホームから外せる。lib はデフォルトで portal 非表示（API には含まれる）。

| portalSection | 意味 |
|---------------|------|
| `playground`（既定） | ポータルの **Apps** 枠 |
| `research` | ポータルの **Research** 枠（調査レポートビューアなど。デモアプリと混在させない） |

## Reuse in another repo

1. `tools/workspace-catalog/` をコピー（または git subtree / パッケージ化）
2. `catalog/workspace.yaml` で `paths` / `pages.baseUrl` / `source` を合わせる
3. `entries/` に YAML を追加
4. CI または手元で `npm run build -- --root <repo>` → `docs/api/catalog.json` をコミット
