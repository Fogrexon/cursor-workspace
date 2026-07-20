# AGENTS.md

See `.cursor/rules/` and `.cursor/skills/` for project conventions.

## Knowledge

- Product intent, domain constraints, ADRs, and incident lessons: `knowledge/`
- Capture / distill / promote: knowledge-capture skill
- Coding how-to stays in skills; hard Must/Must-not stays in rules (thin)

## Cursor Cloud

- No root `package.json`. Each `apps/<name>/` and `lib/<name>/` is its own npm project — `cd` there before commands.
- `lib/theme` is CSS-only (`file:../../lib/theme`). After theme changes, re-run `npm install` in consuming apps.

### Commands (per app dir)

| Action | Command |
|--------|---------|
| typecheck | via `npm run build` (`tsc` first; no separate ESLint) |
| test | `npm test` (`vitest run`) |
| build | `npm run build` → `docs/<app-name>/` (commit output) |
| dev | `npm run dev` → open `http://localhost:5173/cursor-workspace/<app-name>/` (root 404s; `base` is set) |

### Catalog (portal API)

| Action | Command |
|--------|---------|
| regenerate | `cd tools/workspace-catalog && npm run build -- --root ../..` → `docs/api/catalog.json` |
| check | `cd tools/workspace-catalog && npm run check -- --root ../..` |

Metadata lives in `catalog/` (YAML). Spec: `tools/workspace-catalog/README.md`.  
CI: `.github/workflows/catalog.yml`（同期チェック）。Pages デプロイ時も再生成（`deploy-pages.yml`）。