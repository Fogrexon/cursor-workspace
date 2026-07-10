import { describe, expect, it } from 'vitest';
import { DEFAULT_BALANCE } from './balance';
import { idx, makeTile } from './grid';
import { tryBuild, spendRoom } from './growth';
import type { CityStats, Tile } from '../types';

function emptyStats(budget: number): CityStats {
  return {
    population: 800,
    housing: 900,
    jobs: 700,
    transport: 40,
    education: 50,
    happiness: 60,
    budget,
    industry: 30,
    commerce: 40,
    day: 100,
  };
}

function grassGrid(w: number, h: number): Tile[] {
  return Array.from({ length: w * h }, () => makeTile('grass'));
}

describe('spendRoom / debt', () => {
  it('借金枠まで建設できる', () => {
    expect(spendRoom(0, DEFAULT_BALANCE)).toBe(DEFAULT_BALANCE.budget.debtLimit);
    expect(spendRoom(-100, DEFAULT_BALANCE)).toBe(
      DEFAULT_BALANCE.budget.debtLimit - 100,
    );
  });
});

describe('rail corridor commit', () => {
  it('予算不足でも途中までの線路を残さない', () => {
    const w = 24;
    const h = 16;
    const tiles = grassGrid(w, h);
    for (let x = 2; x < w - 2; x++) {
      tiles[idx(x, 8, w)] = makeTile('road');
    }
    const stats = emptyStats(5);
    const tight = {
      ...DEFAULT_BALANCE,
      budget: { ...DEFAULT_BALANCE.budget, debtLimit: 10 },
      buildCosts: { ...DEFAULT_BALANCE.buildCosts, rail: 40, station: 80 },
    };

    for (let i = 0; i < 30; i++) {
      tryBuild(tiles, w, h, stats, 'city', 100 + i, i, tight, []);
    }
    const rails = tiles.filter((t) => t.kind === 'rail' || t.kind === 'crossing').length;
    const stations = tiles.filter((t) => t.kind === 'station').length;
    // 線路だけが中途半端に残るのは禁止（駅なし線路は不可）
    if (rails > 0) {
      expect(stations).toBeGreaterThanOrEqual(1);
    } else {
      expect(stations).toBe(0);
    }
  });

  it('十分な予算なら駅付きで線路が敷かれる', () => {
    const w = 20;
    const h = 14;
    const tiles = grassGrid(w, h);
    for (let x = 2; x < w - 2; x++) {
      tiles[idx(x, 7, w)] = makeTile('road');
    }
    const stats = emptyStats(5000);
    let builtRail = false;
    for (let i = 0; i < 40; i++) {
      const r = tryBuild(
        tiles,
        w,
        h,
        stats,
        'city',
        200 + i,
        i,
        DEFAULT_BALANCE,
        [],
      );
      if (
        r.built &&
        (r.kind === 'rail' || r.kind === 'station' || r.kind === 'intercity-rail')
      ) {
        builtRail = true;
        stats.budget -= r.cost;
        break;
      }
      if (r.built) stats.budget -= r.cost;
    }
    expect(builtRail).toBe(true);
    const stations = tiles.filter((t) => t.kind === 'station').length;
    const rails = tiles.filter(
      (t) => t.kind === 'rail' || t.kind === 'crossing' || t.kind === 'bridge',
    ).length;
    expect(stations).toBeGreaterThanOrEqual(1);
    expect(rails + stations).toBeGreaterThan(2);
  });
});
