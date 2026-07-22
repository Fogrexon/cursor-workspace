import { describe, expect, it } from 'vitest';
import { collectVariables, resolveStyleMap, toResolvedStyle } from './cascade';
import { parseStylesheet } from './parser';

describe('cascade', () => {
  it('resolves variables and specificity', () => {
    const sheet = parseStylesheet(`
      :root { --accent: #112233; }
      button { background: #000000; color: #ffffff; padding: 4; }
      .primary { background: var(--accent); }
      #go { background: #abcdef; }
    `);
    const variables = collectVariables(sheet);
    expect(variables['--accent']).toEqual({ kind: 'color', value: '#112233' });

    const node = {
      id: 'go',
      typeName: 'button',
      classNames: ['primary'],
      children: [],
    };
    const map = resolveStyleMap(sheet, node, new Set(), variables);
    const style = toResolvedStyle(map, node);
    expect(style.background).toBe('#abcdef');
    expect(style.color).toBe('#ffffff');
    expect(style.paddingTop).toBe(4);
  });

  it('applies pseudo-class only when state matches', () => {
    const sheet = parseStylesheet(`
      button { background: #111111; }
      button:hover { background: #222222; }
      button:active { background: #333333; }
    `);
    const node = { id: 'b', typeName: 'button', classNames: [], children: [] };
    const idle = toResolvedStyle(resolveStyleMap(sheet, node, new Set(), {}), node);
    const hover = toResolvedStyle(
      resolveStyleMap(sheet, node, new Set(['hover']), {}),
      node,
    );
    const active = toResolvedStyle(
      resolveStyleMap(sheet, node, new Set(['active']), {}),
      node,
    );
    expect(idle.background).toBe('#111111');
    expect(hover.background).toBe('#222222');
    expect(active.background).toBe('#333333');
  });

  it('supports !important over higher specificity', () => {
    const sheet = parseStylesheet(`
      button { color: #111111 !important; }
      #b { color: #eeeeee; }
    `);
    const node = { id: 'b', typeName: 'button', classNames: [], children: [] };
    const style = toResolvedStyle(resolveStyleMap(sheet, node, new Set(), {}), node);
    expect(style.color).toBe('#111111');
  });
});
