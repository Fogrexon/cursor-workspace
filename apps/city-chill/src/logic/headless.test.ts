import { describe, expect, it } from 'vitest';
import { runHeadless } from './headless';

describe('runHeadless', () => {
  it('同じ seed なら同じ結果になる', () => {
    const a = runHeadless({ days: 80, seed: 7, secondsPerDay: 0.4 });
    const b = runHeadless({ days: 80, seed: 7, secondsPerDay: 0.4 });
    expect(a.final.population).toBe(b.final.population);
    expect(a.final.budget).toBe(b.final.budget);
    expect(a.final.stage).toBe(b.final.stage);
    expect(a.stageTransitions).toEqual(b.stageTransitions);
  });

  it('十分な日数で町以上に成長する', () => {
    const report = runHeadless({ days: 400, seed: 42, secondsPerDay: 0.4 });
    expect(report.final.day).toBeGreaterThanOrEqual(400);
    expect(report.final.population).toBeGreaterThan(40);
    expect(
      report.summary.reachedTownDay !== null ||
        report.final.stage === 'town' ||
        report.final.stage === 'city' ||
        report.final.stage === 'metropolis',
    ).toBe(true);
    expect(report.samples.length).toBeGreaterThan(1);
  });

  it('balance 上書きが反映される', () => {
    const slow = runHeadless({
      days: 100,
      seed: 1,
      secondsPerDay: 0.4,
      balance: {
        population: { housingRoomFactor: 0.01, baseGrowth: 0.2, popGrowthRate: 0.001 },
      },
    });
    const normal = runHeadless({ days: 100, seed: 1, secondsPerDay: 0.4 });
    expect(slow.final.population).toBeLessThan(normal.final.population);
  });

  it('summary に幸福度・予算の範囲が入る', () => {
    const report = runHeadless({ days: 50, seed: 3, secondsPerDay: 0.4 });
    expect(report.summary.minHappiness).toBeLessThanOrEqual(report.summary.maxHappiness);
    expect(report.summary.minBudget).toBeLessThanOrEqual(report.final.budget + 1);
    expect(typeof report.summary.bankrupt).toBe('boolean');
  });
});
