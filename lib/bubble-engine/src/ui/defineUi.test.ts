import { describe, expect, it } from 'vitest';
import { defineUi } from './defineUi.ts';

describe('defineUi', () => {
  it('不変の UiDefinition を返す', () => {
    const def = defineUi('hud', {
      anchor: { edge: 'top-left', margin: { x: 16, y: 16 } },
      children: [{ name: 'score', text: { bind: 'score' } }],
    });
    expect(def.id).toBe('hud');
    expect(def.root.children?.[0]?.name).toBe('score');
  });
});
