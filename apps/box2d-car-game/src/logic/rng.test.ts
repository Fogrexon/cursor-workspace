import { describe, expect, it } from 'vitest';
import { createRng, randomRange } from './rng';

describe('createRng', () => {
  it('同じシードからは同じ数列を返す(決定的)', () => {
    const a = createRng(123);
    const b = createRng(123);
    const seqA = [a(), a(), a(), a()];
    const seqB = [b(), b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it('異なるシードからは異なる数列を返す', () => {
    const a = createRng(1);
    const b = createRng(2);
    expect(a()).not.toEqual(b());
  });

  it('返す値は 0 以上 1 未満', () => {
    const rng = createRng(42);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('randomRange', () => {
  it('指定範囲内の値を返す', () => {
    const rng = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const v = randomRange(rng, -5, 5);
      expect(v).toBeGreaterThanOrEqual(-5);
      expect(v).toBeLessThan(5);
    }
  });

  it('min と max が等しいと常にその値', () => {
    const rng = createRng(7);
    expect(randomRange(rng, 3, 3)).toBe(3);
  });
});
