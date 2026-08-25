import { describe, expect, it } from 'vitest';
import catalog from '../content/sessions.json';

describe('captured catalog', () => {
  it('contains CEDEC 2026 sessions from the official timetable', () => {
    expect(catalog.event.name).toBe('CEDEC 2026');
    expect(catalog.sessionCount).toBeGreaterThan(200);
    expect(catalog.sessions).toHaveLength(catalog.sessionCount);
    const neural = catalog.sessions.find((s) =>
      s.title.includes('ニューラルシェーディング'),
    );
    expect(neural?.keywords).toEqual(
      expect.arrayContaining(['レンダリング', 'モデル学習']),
    );
    expect(neural?.officialUrl).toContain(neural?.uuid);
  });
});
