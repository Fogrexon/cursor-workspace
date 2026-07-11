import { describe, expect, it } from 'vitest';
import {
  BOUND_AXIS_MAX,
  BOUND_AXIS_MIN,
  BOUND_HEIGHT_MAX,
  BOUND_HEIGHT_MIN,
  boxCenterWorld,
  clampSimBounds,
  DEFAULT_SIM_BOUNDS,
  domainScale,
  floorArea,
  formatBounds,
  toUnitSimBounds,
  UNIT_DOMAIN_MAX,
} from './simBounds';

describe('simBounds', () => {
  it('clamps each axis within meter limits', () => {
    expect(clampSimBounds({ width: 0.05, depth: 999, height: 0.05 })).toEqual({
      width: BOUND_AXIS_MIN,
      depth: BOUND_AXIS_MAX,
      height: BOUND_HEIGHT_MIN,
    });
  });

  it('uses tens-of-meters scale', () => {
    expect(BOUND_AXIS_MIN).toBeGreaterThanOrEqual(5);
    expect(BOUND_AXIS_MAX).toBeGreaterThanOrEqual(100);
    expect(BOUND_HEIGHT_MAX).toBeGreaterThanOrEqual(30);
    expect(DEFAULT_SIM_BOUNDS.width).toBeGreaterThanOrEqual(10);
    expect(clampSimBounds({ width: 60, depth: 35, height: 8 })).toEqual({
      width: 60,
      depth: 35,
      height: 8,
    });
  });

  it('normalizes world meters into the unit cube isotropically', () => {
    const unit = toUnitSimBounds({ width: 60, depth: 30, height: 15 });
    expect(domainScale({ width: 60, depth: 30, height: 15 })).toBe(60);
    expect(unit.width).toBeCloseTo(1, 5);
    expect(unit.depth).toBeCloseTo(0.5, 5);
    expect(unit.height).toBeCloseTo(0.25, 5);
    expect(Math.max(unit.width, unit.depth, unit.height)).toBeLessThanOrEqual(
      UNIT_DOMAIN_MAX + 1e-9,
    );
  });

  it('keeps proportions when already within the largest axis', () => {
    const unit = toUnitSimBounds({ width: 20, depth: 10, height: 8 });
    expect(domainScale({ width: 20, depth: 10, height: 8 })).toBeCloseTo(20, 5);
    expect(unit.width).toBeCloseTo(1, 5);
    expect(unit.depth).toBeCloseTo(0.5, 5);
    expect(unit.height).toBeCloseTo(0.4, 5);
  });

  it('computes floor area in m²', () => {
    expect(floorArea({ width: 20, depth: 10, height: 8 })).toBeCloseTo(200, 5);
    expect(floorArea({ width: 60, depth: 35, height: 8 })).toBeCloseTo(2100, 5);
  });

  it('formats bounds for UI in meters', () => {
    expect(formatBounds({ width: 60, depth: 35, height: 8 })).toBe('60×35×8 m');
  });

  it('places box center at mid-height in world space', () => {
    const c = boxCenterWorld({ width: 60, depth: 35, height: 8 });
    expect(c.x).toBeCloseTo(0, 5);
    expect(c.z).toBeCloseTo(0, 5);
    // scale=60, unitH=8/60 → centerY = (-0.5 + 4/60) * 60 = -26
    expect(c.y).toBeCloseTo(-26, 5);
  });

  it('has square defaults', () => {
    expect(DEFAULT_SIM_BOUNDS.width).toBe(DEFAULT_SIM_BOUNDS.depth);
  });
});
