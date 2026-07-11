# AGENTS.md

See `.cursor/rules/` and `.cursor/skills/` for project conventions.

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
