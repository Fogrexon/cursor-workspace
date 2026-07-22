import { describe, expect, it } from 'vitest';
import { darkTheme, mountTree, node, token } from '@playground/canvas-style';

describe('demo uses library API', () => {
  it('mounts a token-styled HUD tree', () => {
    const { scene, clickHandlers } = mountTree(
      node('panel', {
        id: 'hud',
        style: { fill: token('surface'), padding: 16, radius: 12 },
        children: [
          node('button', {
            id: 'hit',
            style: { text: 'Take hit', fill: token('accent') },
            onClick: () => undefined,
          }),
        ],
      }),
    );
    scene.theme = { ...darkTheme };
    expect(scene.byId.has('hud')).toBe(true);
    expect(clickHandlers.has('hit')).toBe(true);
    expect(scene.inlineStyles.get('hud')?.background).toEqual({
      kind: 'token',
      name: 'surface',
    });
  });
});
