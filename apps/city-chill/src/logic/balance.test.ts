import { describe, expect, it } from 'vitest';
import { DEFAULT_BALANCE, mergeBalance } from './balance';
import { growPopulation, recomputeStats, stageFromPopulation } from './stats';
import { makeTile } from './grid';

describe('mergeBalance', () => {
  it('省略時は DEFAULT_BALANCE と同等', () => {
    const m = mergeBalance();
    expect(m.population.initial).toBe(DEFAULT_BALANCE.population.initial);
    expect(m.buildCosts.road).toBe(DEFAULT_BALANCE.buildCosts.road);
    expect(m.stages.town).toBe(35);
  });

  it('部分上書きできる', () => {
    const m = mergeBalance({
      population: { initial: 99 },
      stages: { town: 10 },
    });
    expect(m.population.initial).toBe(99);
    expect(m.population.baseGrowth).toBe(DEFAULT_BALANCE.population.baseGrowth);
    expect(m.stages.town).toBe(10);
    expect(m.stages.city).toBe(DEFAULT_BALANCE.stages.city);
  });

  it('元の DEFAULT_BALANCE を破壊しない', () => {
    const before = DEFAULT_BALANCE.budget.initial;
    mergeBalance({ budget: { initial: 1 } });
    expect(DEFAULT_BALANCE.budget.initial).toBe(before);
  });
});

describe('balance-aware stats', () => {
  it('カスタム段階閾値が効く', () => {
    const bal = mergeBalance({ stages: { town: 5, city: 10, metropolis: 20 } });
    expect(stageFromPopulation(6, bal)).toBe('town');
    expect(stageFromPopulation(6)).toBe('village');
  });

  it('タイル寄与の上書きが効く', () => {
    const bal = mergeBalance({ tiles: { residentialHousing: 100 } });
    const tiles = [makeTile('residential', 1)];
    const prev = {
      population: 1,
      housing: 0,
      jobs: 0,
      transport: 0,
      education: 0,
      happiness: 50,
      budget: 100,
      industry: 0,
      commerce: 0,
      day: 0,
    };
    expect(recomputeStats(tiles, prev, bal).housing).toBe(100);
    expect(recomputeStats(tiles, prev).housing).toBe(8);
  });

  it('成長係数の上書きが効く', () => {
    const stats = {
      population: 20,
      housing: 100,
      jobs: 50,
      transport: 40,
      education: 50,
      happiness: 70,
      budget: 100,
      industry: 10,
      commerce: 10,
      day: 1,
    };
    const slow = mergeBalance({
      population: { housingRoomFactor: 0.01, baseGrowth: 0.1, popGrowthRate: 0.001 },
    });
    const fast = growPopulation(stats);
    const slowPop = growPopulation(stats, slow);
    expect(slowPop).toBeLessThan(fast);
  });
});
