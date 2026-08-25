import { describe, expect, it } from 'vitest';
import { emptyFilters, filterSessions, findSession } from './catalog';
import { businessSession, sampleSession } from './fixtures';

describe('filterSessions', () => {
  const sessions = [sampleSession, businessSession];

  it('returns all sessions when filters are empty', () => {
    const out = filterSessions(sessions, emptyFilters());
    expect(out.map((s) => s.uuid)).toContain('s69774c1c622ae');
    expect(out.map((s) => s.uuid)).toContain('s-business');
  });

  it('filters by field and query', () => {
    const byField = filterSessions(sessions, {
      ...emptyFilters(),
      field: 'ENG',
    });
    expect(byField).toHaveLength(1);
    expect(byField[0]?.uuid).toBe('s69774c1c622ae');

    const byQuery = filterSessions(sessions, {
      ...emptyFilters(),
      query: 'Cygames',
    });
    expect(byQuery).toHaveLength(1);
  });

  it('playgroundOnly hides low-score talks', () => {
    const out = filterSessions(sessions, {
      ...emptyFilters(),
      playgroundOnly: true,
    });
    expect(out).toHaveLength(1);
    expect(out[0]?.uuid).toBe('s69774c1c622ae');
  });
});

describe('findSession', () => {
  it('finds by uuid and returns undefined when missing', () => {
    expect(findSession([sampleSession], 's69774c1c622ae')?.title).toMatch(
      /ニューラル/,
    );
    expect(findSession([sampleSession], 'missing')).toBeUndefined();
  });
});
