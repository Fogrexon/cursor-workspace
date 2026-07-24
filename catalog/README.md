# Catalog

ワークスペースのアプリ／ライブラリ・メタ情報。YAML がソース・オブ・トゥルースで、静的 API にビルドする。

| ファイル | 役割 |
|----------|------|
| `workspace.yaml` | パス規約・公開 URL・GitHub リンクテンプレート |
| `entries/apps/*.yaml` | 各アプリ |
| `entries/libs/*.yaml` | 各ライブラリ |
| → `docs/api/catalog.json` | 生成される静的 API（Vercel で配信） |

仕様とビルダー: [`tools/workspace-catalog/`](../tools/workspace-catalog/)。

```bash
cd tools/workspace-catalog
npm install
npm run build -- --root ../..
npm run check -- --root ../..   # CI と同じ同期チェック
```

新しい app/lib を追加したら entry YAML を追加し、上記で JSON を再生成してコミットする（create-app skill 参照）。

GitHub Actions:

- **Catalog** — PR / push で test + 同期チェック（`.github/workflows/catalog.yml`）
- **Deploy** — `main` デプロイ時に YAML から `catalog.json` を再生成して Vercel で公開