# @playground/canvas-style

Declarative Canvas UI for game HUDs and panels: global reactive state, view-scoped trees, theme tokens, and style transitions.

Product intent: [`knowledge/apps/canvas-style-ui/authoring-dx.md`](../../knowledge/apps/canvas-style-ui/authoring-dx.md).

## Public API

```ts
import {
  createCanvasUi,
  node,
  token,
  darkTheme,
  lightTheme,
} from '@playground/canvas-style';

const ui = createCanvasUi(canvas);
const app = ui.state({ hp: 100, score: 0, theme: 'dark' });
ui.setTheme(() => (app.theme === 'dark' ? darkTheme : lightTheme), {
  transition: 200,
});

ui.view({
  render: () =>
    node('panel', {
      id: 'hud',
      style: {
        fill: token('surface'),
        text: `HP ${app.hp}`,
        transition: { opacity: 200 },
      },
    }),
});
```

| Export | Role |
|--------|------|
| `createCanvasUi` | **Primary** runtime: `state`, `view`, `setTheme` |
| `node` / `token` | Tree builder + semantic theme refs |
| `darkTheme` / `lightTheme` | Built-in token tables |

Style sharing is **Recipe** (`const buttonPrimary = {…}` + spread) and **Theme** (`token('surface')`), not CSS class/type selectors. See [authoring-dx](../../knowledge/apps/canvas-style-ui/authoring-dx.md).

`createCanvasStyle` (stylesheet string API) remains in the package as legacy internals but is not the product path.

## Structure

```
src/
  logic/     parse, cascade, layout, reactive store, theme, style props
  runtime/   createCanvasUi, createCanvasStyle, paint, motion
  types.ts
  index.ts
```

## Commands

```bash
cd lib/canvas-style
npm test
```
