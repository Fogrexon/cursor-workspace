import { describe, expect, it } from 'vitest';
import { clampDt } from './wave';

describe('clampDt', () => {
  it('clamps', () => {
    expect(clampDt(1)).toBeLessThanOrEqual(1 / 40);
    expect(clampDt(-1)).toBe(0);
  });
});
