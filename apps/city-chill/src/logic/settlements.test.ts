import { describe, expect, it } from 'vitest';
import { makeTile, idx } from './grid';
import { createRng } from './rng';
import {
  findIntercityRailPair,
  findStationSiteNear,
  mergeNearbySettlements,
  seedSettlements,
  settlementDevelopment,
} from './settlements';
import type { Tile } from '../types';

function grassGrid(w: number, h: number): Tile[] {
  return Array.from({ length: w * h }, () => makeTile('grass'));
}

describe('settlements', () => {
  it('広いマップでは複数の村を置く', () => {
    const w = 80;
    const tiles = grassGrid(w, w);
    const rng = createRng(42);
    const s = seedSettlements(tiles, w, w, rng);
    expect(s.length).toBeGreaterThanOrEqual(2);
    const names = new Set<string>();
    for (const v of s) {
      expect(tiles[v.cy * w + v.cx]!.kind).toBe('road');
      expect(v.name.length).toBeGreaterThan(0);
      expect(names.has(v.name)).toBe(false);
      names.add(v.name);
    }
  });

  it('128 マップでは集落を適度に置く', () => {
    const w = 128;
    const tiles = grassGrid(w, w);
    const s = seedSettlements(tiles, w, w, createRng(7));
    expect(s.length).toBeGreaterThanOrEqual(5);
    expect(s.length).toBeLessThanOrEqual(8);
    // 都市間が極端に遠くなりすぎない（最短ペアが 80 以内）
    let minPair = Infinity;
    for (let i = 0; i < s.length; i++) {
      for (let j = i + 1; j < s.length; j++) {
        minPair = Math.min(
          minPair,
          Math.hypot(s[i]!.cx - s[j]!.cx, s[i]!.cy - s[j]!.cy),
        );
      }
    }
    expect(minPair).toBeLessThan(80);
  });

  it('近い集落が道路でつながると合体する', () => {
    const w = 40;
    const tiles = grassGrid(w, w);
    const settlements = [
      { id: 0, name: '青葉', cx: 12, cy: 20, radius: 8, level: 'village' as const },
      { id: 1, name: '緑ヶ丘', cx: 22, cy: 20, radius: 8, level: 'village' as const },
    ];
    for (let x = 12; x <= 22; x++) {
      tiles[20 * w + x] = makeTile('road');
    }
    tiles[19 * w + 12] = makeTile('residential', 1);
    tiles[19 * w + 22] = makeTile('residential', 1);

    const r = mergeNearbySettlements(settlements, tiles, w, w);
    expect(r.merged).toBe(true);
    expect(settlements.length).toBe(1);
  });

  it('発展度は周辺の開発タイルを数える', () => {
    const w = 20;
    const tiles = grassGrid(w, w);
    tiles[10 * w + 10] = makeTile('road');
    tiles[10 * w + 11] = makeTile('residential', 1);
    const n = settlementDevelopment(tiles, w, w, {
      id: 0,
      name: '青葉',
      cx: 10,
      cy: 10,
      radius: 5,
      level: 'village',
    });
    expect(n).toBeGreaterThanOrEqual(2);
  });

  it('駅用地は道路マスではなく道路の隣を選ぶ', () => {
    const w = 20;
    const tiles = grassGrid(w, w);
    for (let x = 5; x <= 15; x++) tiles[idx(x, 10, w)] = makeTile('road');
    // 密集地（駅は建物の近くのみ）
    for (const [dx, dy] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
      [0, -1],
    ]) {
      tiles[idx(10 + dx, 10 + dy, w)] = makeTile('residential', 1);
    }
    const site = findStationSiteNear(tiles, w, w, 10, 10, 6);
    expect(site).not.toBeNull();
    expect(tiles[idx(site!.x, site!.y, w)]!.kind).not.toBe('road');
    expect(tiles[idx(site!.x, site!.y, w)]!.kind).toBe('grass');
  });

  it('都市間ペアの終点も道路マスにならない', () => {
    const w = 60;
    const tiles = grassGrid(w, w);
    for (const [cx, cy] of [
      [15, 30],
      [45, 30],
    ] as const) {
      for (let x = cx - 3; x <= cx + 3; x++) tiles[idx(x, cy, w)] = makeTile('road');
      for (let y = cy - 2; y <= cy + 2; y++) tiles[idx(cx, y, w)] = makeTile('road');
      for (const [dx, dy] of [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
        [2, -1],
      ]) {
        tiles[idx(cx + dx, cy + dy, w)] = makeTile('residential', 1);
      }
    }
    const settlements = [
      { id: 0, name: '青葉', cx: 15, cy: 30, radius: 10, level: 'village' as const },
      { id: 1, name: '緑ヶ丘', cx: 45, cy: 30, radius: 10, level: 'village' as const },
    ];
    const pair = findIntercityRailPair(settlements, tiles, w, w, createRng(1));
    expect(pair).not.toBeNull();
    expect(tiles[idx(pair!.a.x, pair!.a.y, w)]!.kind).not.toBe('road');
    expect(tiles[idx(pair!.b.x, pair!.b.y, w)]!.kind).not.toBe('road');
  });

  it('初期集落の規模にばらつきがある', () => {
    const w = 128;
    const tiles = grassGrid(w, w);
    const s = seedSettlements(tiles, w, w, createRng(99));
    expect(s.length).toBeGreaterThanOrEqual(5);
    const buildingCounts = s.map((v) => {
      let n = 0;
      const r = Math.ceil(v.radius);
      for (let y = v.cy - r; y <= v.cy + r; y++) {
        for (let x = v.cx - r; x <= v.cx + r; x++) {
          if (x < 0 || y < 0 || x >= w || y >= w) continue;
          const k = tiles[idx(x, y, w)]!.kind;
          if (
            k === 'residential' ||
            k === 'commercial' ||
            k === 'industrial' ||
            k === 'park' ||
            k === 'school' ||
            k === 'hospital' ||
            k === 'plaza'
          ) {
            n += 1;
          }
        }
      }
      return n;
    });
    const minB = Math.min(...buildingCounts);
    const maxB = Math.max(...buildingCounts);
    expect(minB).toBeLessThanOrEqual(6);
    expect(maxB).toBeGreaterThanOrEqual(10);
    expect(maxB).toBeGreaterThan(minB);
  });

  it('同じ規模でも道路形状が seed で変わる', () => {
    const w = 64;
    const sig = (seed: number) => {
      const tiles = grassGrid(w, w);
      seedSettlements(tiles, w, w, createRng(seed));
      // 道路の占有ビット列（粗い指紋）
      let h = 0;
      for (let i = 0; i < tiles.length; i++) {
        if (tiles[i]!.kind === 'road') h = (h * 33 + i) | 0;
      }
      return h;
    };
    expect(sig(1)).not.toBe(sig(2));
    expect(sig(3)).not.toBe(sig(7));
  });
});
