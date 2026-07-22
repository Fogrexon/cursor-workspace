/** Reference snippet shown in the demo (matches the live createCanvasUi mount). */
export const GAME_HUD_CODE = `import {
  createCanvasUi,
  node,
  token,
  darkTheme,
  lightTheme,
} from '@playground/canvas-style';

const ui = createCanvasUi(canvas);

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

ui.view({
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
        opacity: app.hudOpen ? 1 : 0.35,
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
            text: \`HP \${app.hp}\`,
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

ui.view({
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
        direction: 'column',
        gap: 8,
      },
      children: [
        node('text', {
          id: 'score-text',
          style: {
            text: \`Score \${app.score}\`,
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
`;
