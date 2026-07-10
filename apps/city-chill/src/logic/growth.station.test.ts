import { describe, expect, it } from 'vitest';
import { MIN_STATION_SPACING, tryBuild } from './growth';
import { DEFAULT_BALANCE } from './balance';
import { idx, makeTile } from './grid';
import type { CityStats, Tile } from '../types';

function grassGrid(w: number, h: number): Tile[] {
  return Array.from({ length: w * h }, () => makeTile('grass'));
}

function stats(budget: number): CityStats {
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

describe('station spacing', () => {
  it('既存駅のすぐ隣には新駅を建てない', () => {
    const w = 24;
    const h = 16;
    const tiles = grassGrid(w, h);
    for (let x = 2; x < w - 2; x++) tiles[idx(x, 8, w)] = makeTile('road', 0, 0, 0, 'x');
    tiles[idx(10, 7, w)] = makeTile('station', 1);
    // 密集地を用意しても間隔未満には建てない
    for (const [dx, dy] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
      [0, -2],
    ]) {
      tiles[idx(10 + dx, 7 + dy, w)] = makeTile('residential', 1);
    }

    const s = stats(5000);
    let builtNear = false;
    for (let i = 0; i < 40; i++) {
      const before = tiles.map((t) => t.kind);
      tryBuild(tiles, w, h, s, 'city', 50 + i, i, DEFAULT_BALANCE, []);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (before[y * w + x] === 'station') continue;
          if (tiles[y * w + x]!.kind !== 'station') continue;
          const d = Math.hypot(x - 10, y - 7);
          if (d < MIN_STATION_SPACING) builtNear = true;
        }
      }
    }
    expect(builtNear).toBe(false);
  });

  it('空地には駅を建てない（密集地のみ）', () => {
    const w = 20;
    const h = 12;
    // 線路・道路以外は水で囲む → 建物が置けないので密集地が形成されない
    const tiles: Tile[] = Array.from({ length: w * h }, () => makeTile('water'));
    for (let x = 2; x < w - 2; x++) {
      tiles[idx(x, 5, w)] = makeTile('rail', 0, 0, 0, 'x');
      tiles[idx(x, 6, w)] = makeTile('road', 0, 0, 0, 'x');
    }
    const s = stats(5000);
    for (let i = 0; i < 50; i++) {
      tryBuild(tiles, w, h, s, 'city', 70 + i, i, DEFAULT_BALANCE, []);
    }
    // 建物が無いので新駅は増えない（初期0）
    expect(tiles.filter((t) => t.kind === 'station').length).toBe(0);
  });

  it('MIN_STATION_SPACING は十分な間隔', () => {
    expect(MIN_STATION_SPACING).toBeGreaterThanOrEqual(8);
  });
});
