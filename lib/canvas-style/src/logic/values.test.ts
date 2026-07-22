import { describe, expect, it } from 'vitest';
import { expandBox, resolveVariables } from './values';

describe('values', () => {
  it('expands padding shorthand', () => {
    expect(expandBox({ kind: 'number', value: 8 })).toEqual([8, 8, 8, 8]);
    expect(
      expandBox({
        kind: 'list',
        items: [
          { kind: 'number', value: 1 },
          { kind: 'number', value: 2 },
        ],
      }),
    ).toEqual([1, 2, 1, 2]);
  });

  it('resolves nested variables with fallback', () => {
    const vars = {
      '--a': { kind: 'var' as const, name: '--missing', fallback: { kind: 'color' as const, value: '#abc' } },
    };
    expect(resolveVariables({ kind: 'var', name: '--a' }, vars)).toEqual({
      kind: 'color',
      value: '#abc',
    });
  });

  it('breaks cyclic variables safely', () => {
    const vars = {
      '--a': { kind: 'var' as const, name: '--b' },
      '--b': { kind: 'var' as const, name: '--a' },
    };
    expect(resolveVariables({ kind: 'var', name: '--a' }, vars)).toEqual({
      kind: 'keyword',
      value: 'transparent',
    });
  });
});
