import { describe, expect, it } from 'vitest';
import {
  beachFloorY,
  beachRise,
  beachRunLength,
  beachStartX,
  clampBeachSlope,
  clampFlatFraction,
} from './beachSlope';

describe('beachSlope', () => {
  it('clamps slope and flat fraction', () => {
    expect(clampBeachSlope(0)).toBe(0.01);
    expect(clampBeachSlope(2)).toBe(0.7);
    expect(clampFlatFraction(-1)).toBe(0);
    expect(clampFlatFraction(1)).toBe(0.7);
  });

  it('keeps the offshore side flat', () => {
    const minX = 0.1;
    const width = 0.8;
    const baseY = 0.05;
    const y0 = beachFloorY(0.15, minX, width, baseY, 0.3, 0.25);
    expect(y0).toBeCloseTo(baseY, 5);
  });

  it('rises linearly on the shore side', () => {
    const minX = 0.1;
    const width = 0.8;
    const baseY = 0.05;
    const flat = 0.25;
    const slope = 0.4;
    const start = beachStartX(minX, width, flat);
    const x = start + 0.2;
    expect(beachFloorY(x, minX, width, baseY, slope, flat)).toBeCloseTo(
      baseY + 0.2 * slope,
      5,
    );
  });

  it('computes run and rise', () => {
    expect(beachRunLength(1, 0.25)).toBeCloseTo(0.75, 5);
    expect(beachRise(1, 0.4, 0.25)).toBeCloseTo(0.3, 5);
  });
});
