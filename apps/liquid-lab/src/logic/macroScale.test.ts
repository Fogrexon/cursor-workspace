import { describe, expect, it } from 'vitest';
import {
  BEACH_MACRO_PRESET,
  cameraDistanceFactor,
  cameraFarPlane,
  cameraFrameDistance,
  cameraMaxDistance,
  clampFillRatio,
  clampSplatScale,
  clampTimeScale,
  splatRadius,
} from './macroScale';
import { BOUND_AXIS_MAX, DEFAULT_SIM_BOUNDS } from './simBounds';

describe('macroScale', () => {
  it('clamps macro knobs into safe ranges', () => {
    expect(clampTimeScale(0)).toBe(0.15);
    expect(clampTimeScale(9)).toBe(1.5);
    expect(clampFillRatio(1)).toBe(0.75);
    expect(clampSplatScale(0.1)).toBe(0.6);
  });

  it('scales splat radius by splat scale only', () => {
    expect(splatRadius(0.02, 1)).toBeCloseTo(0.02, 5);
    expect(splatRadius(0.02, 2)).toBeCloseTo(0.04, 5);
  });

  it('pulls camera back for wider floor', () => {
    expect(cameraDistanceFactor(DEFAULT_SIM_BOUNDS)).toBeCloseTo(1, 5);
    expect(
      cameraDistanceFactor({ width: BOUND_AXIS_MAX, depth: BOUND_AXIS_MAX }),
    ).toBeGreaterThanOrEqual(5);
  });

  it('allows zooming out far enough to frame large domains', () => {
    const wide = { width: 100, depth: 100, height: 30 };
    expect(cameraMaxDistance(wide)).toBeGreaterThan(
      Math.hypot(wide.width, wide.depth),
    );
    expect(cameraFarPlane(wide)).toBeGreaterThan(cameraMaxDistance(wide));
    expect(cameraFrameDistance(wide)).toBeLessThan(cameraMaxDistance(wide));
    expect(cameraFrameDistance(wide)).toBeGreaterThan(wide.height);
  });

  it('beach preset uses a wide shallow domain without length scale', () => {
    expect(BEACH_MACRO_PRESET.fillRatio).toBeLessThan(0.35);
    expect(BEACH_MACRO_PRESET.boxWidth).toBeGreaterThan(1);
    expect(BEACH_MACRO_PRESET.boxDepth).toBeGreaterThan(1);
    expect(BEACH_MACRO_PRESET.boxDepth).toBeLessThan(BEACH_MACRO_PRESET.boxWidth);
    expect(BEACH_MACRO_PRESET.boxHeight).toBeLessThan(BEACH_MACRO_PRESET.boxWidth);
    expect('lengthScale' in BEACH_MACRO_PRESET).toBe(false);
  });
});
