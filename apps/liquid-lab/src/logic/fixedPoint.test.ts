import { describe, expect, it } from 'vitest';
import {
  cellIndex,
  clampInt,
  decodeFixedPoint,
  encodeFixedPoint,
  FIXED_POINT_MULTIPLIER,
} from './fixedPoint';

describe('fixedPoint', () => {
  it('round-trips approximate floats', () => {
    const v = 1.234567;
    expect(decodeFixedPoint(encodeFixedPoint(v))).toBeCloseTo(v, 5);
  });

  it('uses the shared multiplier', () => {
    expect(encodeFixedPoint(1)).toBe(FIXED_POINT_MULTIPLIER);
  });

  it('maps 3D cell coords to linear index', () => {
    expect(cellIndex(0, 0, 0, 64)).toBe(0);
    expect(cellIndex(1, 0, 0, 64)).toBe(64 * 64);
    expect(cellIndex(0, 1, 0, 64)).toBe(64);
    expect(cellIndex(0, 0, 1, 64)).toBe(1);
  });

  it('clampInt truncates and clamps', () => {
    expect(clampInt(3.9, 0, 3)).toBe(3);
    expect(clampInt(-1, 0, 3)).toBe(0);
  });
});
