import { describe, expect, it } from 'vitest';
import { emptyFilters } from './catalog';
import { parseHash, serializeHash } from './route';

describe('route', () => {
  it('parses empty hash as list', () => {
    expect(parseHash('')).toEqual({ view: 'list', filters: emptyFilters() });
    expect(parseHash('#/list')).toEqual({
      view: 'list',
      filters: emptyFilters(),
    });
  });

  it('round-trips list filters and session uuid', () => {
    const list = {
      view: 'list' as const,
      filters: {
        query: 'shader',
        day: '2026-07-24',
        field: 'ENG',
        keyword: 'レンダリング',
        playgroundOnly: true,
      },
    };
    expect(parseHash(serializeHash(list))).toEqual(list);

    const session = { view: 'session' as const, uuid: 's69774c1c622ae' };
    expect(serializeHash(session)).toBe('#/s/s69774c1c622ae');
    expect(parseHash('#/s/s69774c1c622ae')).toEqual(session);
  });
});
