# canvas-style-ui

Playground demo for `@playground/canvas-style`: declarative HUD views with global state, Recipe-based shared styles, and theme tokens.

Intent: [`knowledge/apps/canvas-style-ui/`](../../knowledge/apps/canvas-style-ui/).

## Entry

- `src/main.ts` → `mountApp` in `src/ui/app.ts`
- Mounts `createCanvasUi` with global `state` + two `view`s (HUD + scoreboard)
- Style sharing: Recipe constants (`buttonPrimary`) + `token()` / `setTheme` — not CSS selectors

## Commands

```bash
cd apps/canvas-style-ui
npm install
npm run dev      # http://localhost:5173/cursor-workspace/canvas-style-ui/
npm test
npm run build    # → docs/canvas-style-ui/
```
