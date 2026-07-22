import { describe, expect, it } from 'vitest';
import { darkTheme, lightTheme, resolveTokensInMap, token } from './theme';
import { stylePropsToMap } from './styleProps';

describe('theme tokens', () => {
  it('resolves token refs in a style map', () => {
    const map = stylePropsToMap({
      background: token('surface'),
      color: token('text'),
      opacity: 1,
    });
    const resolved = resolveTokensInMap(map, darkTheme);
    expect(resolved.background).toEqual({ kind: 'color', value: '#1c1c28' });
    expect(resolved.color).toEqual({ kind: 'color', value: '#e8e8f0' });
    expect(resolved.opacity).toEqual({ kind: 'number', value: 1 });
  });

  it('switches concrete colors when the theme table changes', () => {
    const map = stylePropsToMap({ background: token('surface') });
    expect(resolveTokensInMap(map, darkTheme).background).toEqual({
      kind: 'color',
      value: '#1c1c28',
    });
    expect(resolveTokensInMap(map, lightTheme).background).toEqual({
      kind: 'color',
      value: '#f4f4f8',
    });
  });

  it('falls back to transparent for missing tokens', () => {
    const map = stylePropsToMap({ background: token('missing') });
    expect(resolveTokensInMap(map, darkTheme).background).toEqual({
      kind: 'keyword',
      value: 'transparent',
    });
  });
});
