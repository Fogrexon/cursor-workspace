import { describe, expect, it } from 'vitest';
import {
  findDemolitionForRoad,
  isDemolishable,
  isLastEscapeTile,
  isRoadGrowthBlocked,
  wouldFormRoadBlock2x2,
} from './demolish';
import { idx, makeTile } from './grid';
import type { Tile } from '../types';
import { tryBuild } from './growth';

function grid(w: number, h: number, fill: Tile['kind'] = 'grass'): Tile[] {
  return Array.from({ length: w * h }, () => makeTile(fill));
}

/** マップ上の 2×2 道路ブロック数 */
function countRoadBlocks2x2(tiles: Tile[], w: number, h: number): number {
  let n = 0;
  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const kinds = [
        tiles[idx(x, y, w)]!.kind,
        tiles[idx(x + 1, y, w)]!.kind,
        tiles[idx(x, y + 1, w)]!.kind,
        tiles[idx(x + 1, y + 1, w)]!.kind,
      ];
      if (
        kinds.every(
          (k) => k === 'road' || k === 'crossing' || k === 'bridge' || k === 'station',
        )
      ) {
        n += 1;
      }
    }
  }
  return n;
}

describe('demolish', () => {
  it('公園は壊せるが駅・学校・線路は壊せない', () => {
    expect(isDemolishable(makeTile('park', 1))).toBe(true);
    expect(isDemolishable(makeTile('residential', 1))).toBe(true);
    expect(isDemolishable(makeTile('residential', 3))).toBe(false);
    expect(isDemolishable(makeTile('station', 1))).toBe(false);
    expect(isDemolishable(makeTile('school', 1))).toBe(false);
    expect(isDemolishable(makeTile('rail'))).toBe(false);
    expect(isDemolishable(makeTile('crossing'))).toBe(false);
    expect(isDemolishable(makeTile('road'))).toBe(false);
  });

  it('行き止まりの隣が線路でも取り壊し候補にしない', () => {
    const w = 5;
    const tiles = grid(w, 5, 'school'); // 学校は壊せない
    tiles[idx(1, 2, w)] = makeTile('road');
    tiles[idx(2, 2, w)] = makeTile('road');
    tiles[idx(3, 2, w)] = makeTile('rail'); // 線路は壊さない
    tiles[idx(2, 1, w)] = makeTile('rail');
    tiles[idx(2, 3, w)] = makeTile('park', 1); // 先端から外へ伸ばせる唯一の候補
    tiles[idx(1, 1, w)] = makeTile('school', 1);
    tiles[idx(1, 3, w)] = makeTile('school', 1);
    tiles[idx(0, 2, w)] = makeTile('school', 1);

    const target = findDemolitionForRoad(tiles, w, 5, 20, 40);
    expect(target).not.toBeNull();
    expect(target!.kind).toBe('park');
    expect(tiles[idx(3, 2, w)]!.kind).toBe('rail');
  });

  it('道路の最後の逃げ道を検出する', () => {
    const w = 5;
    const tiles = grid(w, 5);
    tiles[idx(2, 2, w)] = makeTile('road');
    tiles[idx(1, 2, w)] = makeTile('residential', 1);
    tiles[idx(2, 1, w)] = makeTile('park', 1);
    tiles[idx(2, 3, w)] = makeTile('park', 1);
    tiles[idx(3, 2, w)] = makeTile('grass');
    expect(isLastEscapeTile(tiles, 3, 2, w, 5)).toBe(true);
    expect(isLastEscapeTile(tiles, 0, 0, w, 5)).toBe(false);
  });

  it('行き止まりを公園で塞がれたら取り壊し候補になる', () => {
    const w = 5;
    const tiles = grid(w, 5, 'residential');
    tiles[idx(1, 2, w)] = makeTile('road');
    tiles[idx(2, 2, w)] = makeTile('road');
    tiles[idx(3, 2, w)] = makeTile('park', 1);
    tiles[idx(2, 1, w)] = makeTile('residential', 1);
    tiles[idx(2, 3, w)] = makeTile('residential', 1);
    tiles[idx(1, 1, w)] = makeTile('residential', 1);
    tiles[idx(1, 3, w)] = makeTile('residential', 1);
    tiles[idx(0, 2, w)] = makeTile('residential', 1);
    expect(isRoadGrowthBlocked(tiles, w, 5)).toBe(true);
    const target = findDemolitionForRoad(tiles, w, 5, 20, 40);
    expect(target).not.toBeNull();
    expect(target!.kind).toBe('park');
    expect(target!.x).toBe(3);
    expect(target!.y).toBe(2);
  });

  it('住宅逼迫時は住宅より公園を壊す', () => {
    const w = 5;
    const tiles = grid(w, 5, 'commercial');
    tiles[idx(1, 2, w)] = makeTile('road');
    tiles[idx(2, 2, w)] = makeTile('road');
    tiles[idx(3, 2, w)] = makeTile('residential', 1);
    tiles[idx(2, 1, w)] = makeTile('park', 1);
    tiles[idx(2, 3, w)] = makeTile('commercial', 1);
    tiles[idx(1, 1, w)] = makeTile('commercial', 1);
    tiles[idx(1, 3, w)] = makeTile('commercial', 1);
    tiles[idx(0, 2, w)] = makeTile('commercial', 1);
    const target = findDemolitionForRoad(tiles, w, 5, 100, 80);
    expect(target).not.toBeNull();
    expect(target!.kind).toBe('park');
  });

  it('2×2 になる取り壊しは候補にしない', () => {
    const w = 6;
    const tiles = grid(w, 6, 'park');
    // L字: (2,2)-(3,2)-(3,3)。(2,3) を埋めると 2×2
    tiles[idx(2, 2, w)] = makeTile('road');
    tiles[idx(3, 2, w)] = makeTile('road');
    tiles[idx(3, 3, w)] = makeTile('road');
    tiles[idx(2, 3, w)] = makeTile('park', 1);
    tiles[idx(3, 4, w)] = makeTile('park', 1);
    tiles[idx(4, 3, w)] = makeTile('residential', 3);

    expect(wouldFormRoadBlock2x2(tiles, 2, 3, w, 6)).toBe(true);
    const target = findDemolitionForRoad(tiles, w, 6, 20, 40);
    expect(target).not.toBeNull();
    expect(!(target!.x === 2 && target!.y === 3)).toBe(true);
  });

  it('塞がれた道路は tryBuild で取り壊して延伸できる', () => {
    const w = 8;
    const tiles = grid(w, 8, 'residential');
    for (let x = 2; x <= 5; x++) tiles[idx(x, 4, w)] = makeTile('road');
    for (let y = 2; y <= 5; y++) tiles[idx(4, y, w)] = makeTile('road');
    for (let x = 1; x <= 6; x++) {
      tiles[idx(x, 1, w)] = makeTile('park', 1);
      tiles[idx(x, 6, w)] = makeTile('park', 1);
    }
    for (let y = 2; y <= 5; y++) {
      tiles[idx(1, y, w)] = makeTile('park', 1);
      tiles[idx(6, y, w)] = makeTile('park', 1);
    }
    tiles[idx(2, 2, w)] = makeTile('park', 1);
    tiles[idx(2, 3, w)] = makeTile('park', 1);
    tiles[idx(2, 5, w)] = makeTile('park', 1);
    tiles[idx(3, 2, w)] = makeTile('park', 1);
    tiles[idx(3, 3, w)] = makeTile('park', 1);
    tiles[idx(3, 5, w)] = makeTile('park', 1);
    tiles[idx(5, 2, w)] = makeTile('park', 1);
    tiles[idx(5, 3, w)] = makeTile('park', 1);
    tiles[idx(5, 5, w)] = makeTile('park', 1);

    const stats = {
      population: 50,
      housing: 80,
      jobs: 40,
      transport: 20,
      education: 20,
      happiness: 60,
      budget: 500,
      industry: 10,
      commerce: 10,
      day: 30,
    };
    expect(isRoadGrowthBlocked(tiles, w, 8)).toBe(true);

    const roadsBefore = tiles.filter((t) => t.kind === 'road').length;
    let demolished = false;
    for (let d = 0; d < 40; d++) {
      const r = tryBuild(tiles, w, 8, stats, 'town', 99, d);
      if (r.built && r.kind === 'demolish') {
        demolished = true;
        stats.budget -= r.cost;
        break;
      }
      if (r.built) stats.budget -= r.cost;
    }
    expect(demolished).toBe(true);
    const roadsAfter = tiles.filter((t) => t.kind === 'road').length;
    expect(roadsAfter).toBeGreaterThan(roadsBefore);
    expect(countRoadBlocks2x2(tiles, w, 8)).toBe(0);
  });

  it('道路を繰り返し伸ばしても 2×2 固まりができない', () => {
    const w = 12;
    const tiles = grid(w, 12);
    for (let x = 4; x <= 7; x++) tiles[idx(x, 6, w)] = makeTile('road');
    for (let y = 4; y <= 7; y++) tiles[idx(6, y, w)] = makeTile('road');

    const stats = {
      population: 40,
      housing: 60,
      jobs: 30,
      transport: 20,
      education: 20,
      happiness: 60,
      budget: 5000,
      industry: 10,
      commerce: 10,
      day: 0,
    };

    let roadsBuilt = 0;
    for (let d = 0; d < 80; d++) {
      stats.day = d;
      const r = tryBuild(tiles, w, 12, stats, 'town', 42, d);
      if (r.built) {
        stats.budget -= r.cost;
        if (r.kind === 'road' || r.kind === 'bridge' || r.kind === 'demolish') {
          roadsBuilt += 1;
        }
      }
    }
    expect(roadsBuilt).toBeGreaterThan(3);
    expect(countRoadBlocks2x2(tiles, w, 12)).toBe(0);
  });
});

describe('wouldFormRoadBlock2x2', () => {
  it('L字の角を埋めると true', () => {
    const w = 4;
    const tiles = grid(w, 4);
    tiles[idx(1, 1, w)] = makeTile('road');
    tiles[idx(2, 1, w)] = makeTile('road');
    tiles[idx(2, 2, w)] = makeTile('road');
    expect(wouldFormRoadBlock2x2(tiles, 1, 2, w, 4)).toBe(true);
    expect(wouldFormRoadBlock2x2(tiles, 3, 1, w, 4)).toBe(false);
  });
});
