import { describe, expect, it } from 'vitest';
import { parseHash, serializeHash } from './route';

describe('parseHash / serializeHash', () => {
  it('defaults to list', () => {
    expect(parseHash('')).toEqual({ view: 'list', query: '', category: 'all' });
    expect(parseHash('#/list')).toEqual({
      view: 'list',
      query: '',
      category: 'all',
    });
  });

  it('round-trips list filters', () => {
    const route = {
      view: 'list' as const,
      query: 'harness',
      category: 'research' as const,
    };
    const hash = serializeHash(route);
    expect(hash).toContain('q=harness');
    expect(parseHash(hash)).toEqual(route);
  });

  it('round-trips report ids with slashes', () => {
    const route = {
      view: 'report' as const,
      id: 'research/2026-07-23-llm-agent-execution-harness',
    };
    const hash = serializeHash(route);
    expect(parseHash(hash)).toEqual(route);
  });
});
