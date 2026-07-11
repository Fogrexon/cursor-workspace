import { describe, expect, it } from 'vitest';
import type { Settlement, Tile } from '../types';
import { idx, makeTile } from './grid';
import { createRng } from './rng';
import { findBuildableNearRoad, findRoadExtension } from './growth';

function blank(w: number, h: number): Tile[] {
  return Array.from({ length: w * h }, () => makeTile('grass'));
}

function focusAt(cx: number, cy: number, radius = 6): Settlement {
  return { id: 0, name: '試験町', cx, cy, radius, level: 'village' };
}

describe('road branching & sparse build', () => {
  it('一本道の先端より幹線からの直角分岐を選びやすい', () => {
    const w = 21;
    const h = 15;
    const tiles = blank(w, h);
    const cy = 7;
    // 東西の幹線
    for (let x = 2; x <= 18; x++) tiles[idx(x, cy, w)] = makeTile('road');
    // 西端からさらに外へ伸びた過疎の先端
    tiles[idx(19, cy, w)] = makeTile('road');
    // 町の中心付近に建物
    tiles[idx(8, cy - 1, w)] = makeTile('residential', 1);
    tiles[idx(9, cy - 1, w)] = makeTile('residential', 1);
    tiles[idx(10, cy + 1, w)] = makeTile('commercial', 1);

    const focus = focusAt(10, cy, 5);
    let branchHits = 0;
    let tipHits = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const spot = findRoadExtension(tiles, w, h, createRng(seed), focus);
      expect(spot).not.toBeNull();
      if (!spot) continue;
      // 幹線からの南北分岐（建物近く）
      if (spot.y !== cy && spot.x >= 6 && spot.x <= 14) branchHits += 1;
      // 過疎先端のさらに外側
      if (spot.x >= 19 && spot.y === cy) tipHits += 1;
    }
    expect(branchHits).toBeGreaterThan(tipHits);
    expect(branchHits).toBeGreaterThan(15);
  });

  it('過疎の一本道沿いには建物を置かない', () => {
    const w = 24;
    const h = 12;
    const tiles = blank(w, h);
    const cy = 6;
    for (let x = 2; x <= 20; x++) tiles[idx(x, cy, w)] = makeTile('road');
    // 町の中心（左寄り）にだけ建物
    tiles[idx(4, cy - 1, w)] = makeTile('residential', 1);
    tiles[idx(5, cy + 1, w)] = makeTile('residential', 1);

    const focus = focusAt(5, cy, 4);
    for (let seed = 1; seed <= 30; seed++) {
      const spot = findBuildableNearRoad(tiles, w, h, createRng(seed), focus);
      expect(spot).not.toBeNull();
      if (!spot) continue;
      // 遠い先端付近（x>=14）には建てない
      expect(spot.x).toBeLessThan(14);
      expect(Math.hypot(spot.x - 5, spot.y - cy)).toBeLessThanOrEqual(7);
    }
  });

  it('集落圏内の空き地には建物を置ける', () => {
    const w = 14;
    const h = 14;
    const tiles = blank(w, h);
    // 小さな十字路
    for (let x = 4; x <= 9; x++) tiles[idx(x, 7, w)] = makeTile('road');
    for (let y = 4; y <= 9; y++) tiles[idx(7, y, w)] = makeTile('road');
    tiles[idx(6, 6, w)] = makeTile('residential', 1);

    const focus = focusAt(7, 7, 5);
    const spot = findBuildableNearRoad(tiles, w, h, createRng(3), focus);
    expect(spot).not.toBeNull();
    expect(Math.hypot(spot!.x - 7, spot!.y - 7)).toBeLessThanOrEqual(6);
  });
});
