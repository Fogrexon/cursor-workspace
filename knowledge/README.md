# Knowledge

コード解析だけでは分からない **ビジネス要件・ドメイン意図・インシデント教訓** を置く場所。

| 置き場 | 役割 |
|--------|------|
| `inbox/` | 会話からの生メモ（雑でよい） |
| `domain/` | 横断の用語・制約・非ゴール |
| `apps/<app>/` | アプリ固有の product intent |
| `decisions/` | 判断の履歴（ADR） |
| `incidents/` | やらかしの記録と再発防止 |

運用手順は `.cursor/skills/knowledge-capture/SKILL.md`。読むきっかけは `.cursor/rules/knowledge-usage.mdc`。

## 置かないもの

- **調査レポート（deep research）** → リポジトリ直下の `research/`（閲覧は `apps/report-viewer`）
- 実装手順・コーディング how-to → `.cursor/skills/` / `.cursor/rules/`

## 昇格ルール

1. 確定前・断片 → `inbox/`
2. 今後の作業に効く要約 → `domain/` または `apps/<app>/`
3. 毎回守る制約 → 短い `.cursor/rules/` に昇格
4. 手順が必要 → `.cursor/skills/` に昇格または参照
5. 再現可能な失敗 → 回帰テストを最優先の防波堤にする
