import { describe, expect, it } from 'vitest';
import {
  clampParticleCount,
  createInitialPositions,
  estimateSettledDepth,
  listPresets,
  MAX_PARTICLES,
  PARTICLE_BUDGETS,
} from './particles';

describe('particles', () => {
  it('lists budgets and presets', () => {
    expect(PARTICLE_BUDGETS.length).toBeGreaterThanOrEqual(3);
    expect(listPresets()).toHaveLength(3);
    expect(MAX_PARTICLES).toBeGreaterThan(10000);
  });

  it('clampParticleCount snaps to 4096 steps', () => {
    expect(clampParticleCount(100)).toBe(4096);
    expect(clampParticleCount(9000)).toBe(8192);
    expect(clampParticleCount(999999)).toBe(MAX_PARTICLES);
  });

  it('creates the requested number of positions', () => {
    const pos = createInitialPositions('dam-break', 8192);
    expect(pos.length).toBe(8192 * 3);
    for (let i = 0; i < pos.length; i++) {
      expect(pos[i]!).toBeGreaterThanOrEqual(0);
      expect(pos[i]!).toBeLessThanOrEqual(1);
    }
  });

  it('keeps positions inside the unit cube for wide world bounds', () => {
    const pos = createInitialPositions('dam-break', 8192, {
      width: 60,
      depth: 35,
      height: 8,
    });
    for (let i = 0; i < pos.length; i++) {
      expect(pos[i]!).toBeGreaterThanOrEqual(0);
      expect(pos[i]!).toBeLessThanOrEqual(1);
    }
  });

  it('wide floor yields shallower settled depth in world units', () => {
    expect(
      estimateSettledDepth(8192 * 4, { width: 60, depth: 35, height: 8 }, 0.2),
    ).toBeLessThan(estimateSettledDepth(8192 * 4, { width: 20, depth: 20, height: 8 }, 0.55));
  });

  it('dam-break starts on the left', () => {
    const pos = createInitialPositions('dam-break', 8192);
    let sumX = 0;
    for (let i = 0; i < pos.length; i += 3) sumX += pos[i]!;
    expect(sumX / (pos.length / 3)).toBeLessThan(0.45);
  });

  it('higher count raises expected settled depth', () => {
    expect(estimateSettledDepth(8192 * 8, 20)).toBeGreaterThan(
      estimateSettledDepth(8192 * 2, 20),
    );
  });

  it('narrower box raises expected settled depth', () => {
    expect(
      estimateSettledDepth(8192 * 4, { width: 10, depth: 10, height: 30 }, 0.55),
    ).toBeGreaterThan(
      estimateSettledDepth(8192 * 4, { width: 40, depth: 40, height: 30 }, 0.55),
    );
  });

  it('lower fill ratio makes shallower water without more particles', () => {
    expect(estimateSettledDepth(8192 * 4, 20, 0.2)).toBeLessThan(
      estimateSettledDepth(8192 * 4, 20, 0.55),
    );
  });
});
