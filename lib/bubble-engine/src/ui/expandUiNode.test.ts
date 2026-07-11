import { describe, expect, it } from 'vitest';
import { expandUiNode } from './expandUiNode.ts';

describe('expandUiNode', () => {
  it('button を panel + action + label に展開', () => {
    const expanded = expandUiNode({
      name: 'playBtn',
      button: {
        action: 'play',
        label: 'PLAY',
        width: 200,
        height: 48,
        fontSize: 20,
      },
    });
    expect(expanded.action).toBe('play');
    expect(expanded.panel?.width).toBe(200);
    expect(expanded.layout?.mode).toBe('row');
    expect(expanded.children?.some((c) => c.text?.text === 'PLAY')).toBe(true);
  });
});
