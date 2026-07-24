# 0004 Design system = token layers + accessible primitives
- Status: accepted
- Date: 2026-07-24
## Context
ポータル／Research Viewer の見た目改善依頼が、「色テーマ差し替え」ではなく **デザインシステム**（意思決定の共有契約）として扱ってほしい、という意図に明確化された。2025–2026 の実務でも、コンポーネント見た目の流行より **トークン階層・アクセシビリティ・ガバナンス** が差分になる。
## Decision
`lib/theme` を次の契約にする。
1. **3層トークン**: Primitive（生値）→ Semantic（意図）→ Component（部品固有）。アプリ／ポータルは Semantic または Component のみ参照する。
2. **共有プリミティブ**: `.ds-btn` / `.ds-surface` / `.ds-field` / `.ds-tag` / `.ds-nav-link` / `.ds-section-label` を `components.css` に置く。WCAG 2.2 寄りのフォーカスリング・タッチターゲットを部品側に焼き込む。
3. **モーション／密度**: `--motion-*` と `--control-height*` をトークン化し、`prefers-reduced-motion` を既定で尊重する。
4. **見た目の流行そのものは薄く**: ブランドはインク＋ミントのまま。流行を追うのは「トークン階層と部品契約」側。
## Alternatives rejected
- 色パレットだけ差し替える: システムにならず、アプリごとのハードコードが再発する。
- フルコンポーネントライブラリ導入（Radix/shadcn 丸ごと）: このリポジトリ規模では過剰。薄い CSS プリミティブで十分。
## Consequences
- ui-style スキルは「色のトンマナ」ではなく **トークン階層と ds-* 利用** を正とする。
- ポータル（`docs/index.html`）は静的のためトークン／部品 CSS を手同期する（コメントで正本を明示）。
- 他アプリは次回ビルドで Semantic トークン互換のまま追従可能（既存 `--color-*` は Semantic エイリアスとして維持）。
