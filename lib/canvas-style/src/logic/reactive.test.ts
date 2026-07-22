import { describe, expect, it, vi } from 'vitest';
import { createReactiveStore, readsHit, trackReads } from './reactive';

describe('reactive store', () => {
  it('notifies on changed keys only', () => {
    const onChange = vi.fn();
    const state = createReactiveStore({ hp: 100, score: 0 }, onChange);
    state.hp = 85;
    expect(onChange).toHaveBeenCalledWith(new Set(['hp']));
    state.hp = 85;
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('tracks which keys a render reads', () => {
    const state = createReactiveStore({ hp: 100, score: 0 }, () => undefined);
    const { reads } = trackReads(() => state.hp + 1);
    expect(readsHit(reads, state.__storeId, new Set(['hp']))).toBe(true);
    expect(readsHit(reads, state.__storeId, new Set(['score']))).toBe(false);
  });
});
