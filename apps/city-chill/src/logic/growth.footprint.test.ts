import { describe, expect, it } from 'vitest';
import type { CityStats, Tile } from '../types';
import { FOOTPRINT_2X2, getTile, idx, makeTile } from './grid';
import { recomputeStats } from './stats';
import {
  findFootprint2x2NearRoad,
  isHighLandValue,
  isPremiumLandValue,
  landValueScore,
  placeFootprint2x2,
} from './growth';
import { isDemolishable } from './demolish';
import { createRng } from './rng';

function blank(w: number, h: number): Tile[] {
  return Array.from({ length: w * h }, () => makeTile('grass'));
}

function richStats(over: Partial<CityStats> = {}): CityStats {
  return {
    population: 1200,
    housing: 1400,
    jobs: 1100,
    transport: 400,
    education: 50,
    happiness: 60,
    budget: 500,
    industry: 80,
    commerce: 90,
    day: 400,
    ...over,
  };
}

function denseCore(tiles: Tile[], w: number, cx: number, cy: number): void {
  for (let y = cy - 3; y <= cy + 3; y++) {
    for (let x = cx - 4; x <= cx + 4; x++) {
      if (x <= 0 || y <= 0 || x >= w - 1 || y >= w - 1) continue;
      if (tiles[idx(x, y, w)]!.kind === 'road') continue;
      const roll = (x + y * 3) % 5;
      tiles[idx(x, y, w)] = makeTile(
        roll === 0 ? 'tower' : roll === 1 ? 'commercial' : 'residential',
        roll === 0 ? 2 : 1,
      );
    }
  }
}

describe('2x2 skyscraper footprint', () => {
  it('placeFootprint2x2 はアンカー+3 pad を置き、占有する', () => {
    const w = 8;
    const h = 8;
    const tiles = blank(w, h);
    const rng = createRng(1);

    expect(placeFootprint2x2(tiles, w, h, 2, 2, 'skyscraper', 2, rng)).toBe(true);

    const anchor = getTile(tiles, 2, 2, w, h)!;
    expect(anchor.kind).toBe('skyscraper');
    expect(anchor.footprint).toBe(2);
    expect(anchor.tier).toBe(2);
    expect(anchor.anchorIdx).toBe(-1);

    const anchorIndex = idx(2, 2, w);
    for (const [dx, dy] of FOOTPRINT_2X2) {
      if (dx === 0 && dy === 0) continue;
      const pad = getTile(tiles, 2 + dx, 2 + dy, w, h)!;
      expect(pad.kind).toBe('pad');
      expect(pad.footprint).toBe(0);
      expect(pad.anchorIdx).toBe(anchorIndex);
    }
  });

  it('空きが足りないと配置失敗', () => {
    const w = 6;
    const h = 6;
    const tiles = blank(w, h);
    tiles[idx(3, 2, w)] = makeTile('road');
    const rng = createRng(2);
    expect(placeFootprint2x2(tiles, w, h, 2, 2, 'skyscraper', 2, rng)).toBe(false);
  });

  it('統計は pad を二重計上せず、2x2 は寄与が増える', () => {
    const w = 4;
    const h = 4;
    const tiles = blank(w, h);
    const rng = createRng(3);
    placeFootprint2x2(tiles, w, h, 1, 1, 'skyscraper', 2, rng);

    const single = blank(w, h);
    single[idx(0, 0, w)] = makeTile('skyscraper', 2, 0, 0, 'none', 1, -1);

    const prev = richStats({ housing: 0, jobs: 0, commerce: 0, budget: 0 });
    const with2x2 = recomputeStats(tiles, prev);
    const with1x1 = recomputeStats(single, prev);

    expect(with2x2.housing).toBeGreaterThan(with1x1.housing);
    expect(with2x2.jobs).toBeGreaterThan(with1x1.jobs);
    expect(with2x2.housing).toBeLessThan(with1x1.housing * 4);
  });

  it('2x2 アンカーと pad は解体対象外', () => {
    const w = 6;
    const h = 6;
    const tiles = blank(w, h);
    placeFootprint2x2(tiles, w, h, 1, 1, 'skyscraper', 2, createRng(4));
    expect(isDemolishable(tiles[idx(1, 1, w)]!)).toBe(false);
    expect(isDemolishable(tiles[idx(2, 1, w)]!)).toBe(false);
  });

  it('地価は大都会・密集・人口で緩やかに上がる', () => {
    const w = 14;
    const h = 14;
    const tiles = blank(w, h);
    for (let x = 1; x < 13; x++) tiles[idx(x, 7, w)] = makeTile('road');
    denseCore(tiles, w, 6, 5);
    denseCore(tiles, w, 6, 9);
    const stats = richStats({ population: 1000, budget: 400 });
    expect(landValueScore(tiles, 6, 6, w, h, 'metropolis', stats)).toBeGreaterThan(0.65);
    expect(isHighLandValue(tiles, 6, 6, w, h, 'metropolis', stats)).toBe(true);
    expect(isHighLandValue(tiles, 6, 6, w, h, 'city', stats)).toBe(false);
    expect(
      isHighLandValue(tiles, 6, 6, w, h, 'metropolis', richStats({ population: 100 })),
    ).toBe(false);
    expect(isPremiumLandValue(tiles, 6, 6, w, h, 'metropolis', stats)).toBe(false);
    expect(
      isPremiumLandValue(
        tiles,
        6,
        6,
        w,
        h,
        'metropolis',
        richStats({ population: 1200, budget: 500 }),
      ),
    ).toBe(true);
  });

  it('findFootprint2x2NearRoad は premium 地価の空き 2x2 を返す', () => {
    const w = 20;
    const h = 20;
    const tiles = blank(w, h);
    // 水平道路 y=9
    for (let x = 1; x < 19; x++) tiles[idx(x, 9, w)] = makeTile('road');
    // 北側密集エリア（y=2..7）: 道路との間に y=8 草地バッファを残す
    for (let y = 2; y <= 7; y++) {
      for (let x = 2; x <= 17; x++) {
        const roll = (x + y) % 4;
        tiles[idx(x, y, w)] = makeTile(
          roll === 0 ? 'tower' : roll === 1 ? 'commercial' : 'residential',
          2,
        );
      }
    }
    // 南側密集エリア（y=10..16）: 2x2 の空きポケットを x=8..9, y=10..11 に残す
    for (let y = 10; y <= 16; y++) {
      for (let x = 2; x <= 17; x++) {
        if (x >= 8 && x <= 9 && y >= 10 && y <= 11) continue;
        const roll = (x + y) % 4;
        tiles[idx(x, y, w)] = makeTile(
          roll === 0 ? 'tower' : roll === 1 ? 'commercial' : 'residential',
          2,
        );
      }
    }
    // y=8（草地）があるため、道路 y=9 の各タイルは2つ以上の paveable 隣接を持ち
    // isLastEscapeForBuilding が false になる
    const stats = richStats({ population: 1300, budget: 600 });
    const spot = findFootprint2x2NearRoad(
      tiles,
      w,
      h,
      createRng(9),
      null,
      'metropolis',
      stats,
      'premium',
    );
    expect(spot).not.toBeNull();
    expect(placeFootprint2x2(tiles, w, h, spot!.x, spot!.y, 'skyscraper', 2, createRng(10))).toBe(
      true,
    );
    expect(getTile(tiles, spot!.x, spot!.y, w, h)!.kind).toBe('skyscraper');
    expect(getTile(tiles, spot!.x + 1, spot!.y, w, h)!.kind).toBe('pad');
  });
});
