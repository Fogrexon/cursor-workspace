import { describe, expect, it } from 'vitest';
import { stylePropsToMap } from './styleProps';

describe('stylePropsToMap', () => {
  it('maps numeric and color props', () => {
    const map = stylePropsToMap({
      width: 120,
      padding: [8, 12],
      background: '#1c1c28',
      display: 'row',
      content: 'Hi',
    });
    expect(map.width).toEqual({ kind: 'number', value: 120 });
    expect(map.padding).toEqual({
      kind: 'list',
      items: [
        { kind: 'number', value: 8 },
        { kind: 'number', value: 12 },
      ],
    });
    expect(map.background).toEqual({ kind: 'color', value: '#1c1c28' });
    expect(map.content).toEqual({ kind: 'string', value: 'Hi' });
  });

  it('returns empty map for empty props', () => {
    expect(stylePropsToMap({})).toEqual({});
  });
});
