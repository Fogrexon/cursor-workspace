import { describe, expect, it } from 'vitest';
import {
  isRailSurface,
  isRoadSurface,
  junctionKind,
  linkMask,
  orientedLinkMask,
  primaryAxis,
} from './connections';
import { makeTile, countKind, idx } from './grid';
import { poseAt, TRAIN_CAR_SPACING, updateVehicles } from './vehicles';
import { tryBuild } from './growth';
import type { Tile, Vehicle } from '../types';

describe('connections', () => {
  it('東西道路なら primaryAxis は x', () => {
    const w = 3;
    const tiles: Tile[] = Array.from({ length: 9 }, () => makeTile('grass'));
    tiles[1 * w + 0] = makeTile('road', 0, 0, 0, 'x');
    tiles[1 * w + 1] = makeTile('road', 0, 0, 0, 'x');
    tiles[1 * w + 2] = makeTile('road', 0, 0, 0, 'x');
    const m = linkMask(tiles, 1, 1, w, 3, isRoadSurface);
    expect(m.e).toBe(true);
    expect(m.w).toBe(true);
    expect(primaryAxis(m)).toBe('x');
  });

  it('南北線路なら primaryAxis は z', () => {
    const w = 3;
    const tiles: Tile[] = Array.from({ length: 9 }, () => makeTile('grass'));
    tiles[0 * w + 1] = makeTile('rail', 0, 0, 0, 'z');
    tiles[1 * w + 1] = makeTile('rail', 0, 0, 0, 'z');
    tiles[2 * w + 1] = makeTile('rail', 0, 0, 0, 'z');
    const m = linkMask(tiles, 1, 1, w, 3, isRailSurface);
    expect(primaryAxis(m)).toBe('z');
  });

  it('crossing は road/rail 両方の surface', () => {
    expect(isRoadSurface('crossing')).toBe(true);
    expect(isRailSurface('crossing')).toBe(true);
  });

  it('並走する東西線路は南北で繋がらない', () => {
    const w = 4;
    const h = 3;
    const tiles: Tile[] = Array.from({ length: w * h }, () => makeTile('grass'));
    for (let x = 0; x < w; x++) {
      tiles[0 * w + x] = makeTile('rail', 0, 0, 0, 'x');
      tiles[1 * w + x] = makeTile('rail', 0, 0, 0, 'x');
    }
    const m = orientedLinkMask(tiles, 1, 0, w, h, isRailSurface);
    expect(m.e).toBe(true);
    expect(m.w).toBe(true);
    expect(m.s).toBe(false);
    expect(junctionKind(m)).toBe('straight');
  });

  it('L字・T字・十字を junctionKind で区別する', () => {
    expect(junctionKind({ e: true, n: true, w: false, s: false })).toBe('L');
    expect(junctionKind({ e: true, w: true, n: true, s: false })).toBe('T');
    expect(junctionKind({ e: true, w: true, n: true, s: true })).toBe('cross');
    expect(junctionKind({ e: true, w: true, n: false, s: false })).toBe('straight');
  });

  it('both 向きの分岐は並走線路とも接続できる', () => {
    const w = 3;
    const h = 3;
    const tiles: Tile[] = Array.from({ length: w * h }, () => makeTile('grass'));
    tiles[1 * w + 0] = makeTile('rail', 0, 0, 0, 'x');
    tiles[1 * w + 1] = makeTile('rail', 0, 0, 0, 'both');
    tiles[1 * w + 2] = makeTile('rail', 0, 0, 0, 'x');
    tiles[0 * w + 1] = makeTile('rail', 0, 0, 0, 'z');
    const m = orientedLinkMask(tiles, 1, 1, w, h, isRailSurface);
    expect(junctionKind(m)).toBe('T');
    expect(m.n).toBe(true);
  });
});

describe('rail corridor', () => {
  it('rail 建設で複数タイルが繋がる', () => {
    const w = 28;
    const h = 16;
    const tiles = Array.from({ length: w * h }, () => makeTile('grass'));
    for (let x = 2; x < w - 2; x++) {
      tiles[idx(x, 7, w)] = makeTile('road', 0, 0, 0, 'x');
      tiles[idx(x, 8, w)] = makeTile('road', 0, 0, 0, 'x');
    }
    // 密集地2か所（駅間隔を満たす）
    for (const cx of [5, 18]) {
      for (const [dx, dy] of [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
        [0, -1],
      ]) {
        tiles[idx(cx + dx, 7 + dy, w)] = makeTile('residential', 1);
      }
    }
    const stats = {
      population: 800,
      housing: 900,
      jobs: 700,
      transport: 40,
      education: 50,
      happiness: 60,
      budget: 5000,
      industry: 30,
      commerce: 40,
      day: 100,
    };
    let rails = 0;
    for (let d = 0; d < 120; d++) {
      const r = tryBuild(tiles, w, h, stats, 'city', 200 + d, d, undefined, []);
      if (r.built) stats.budget -= r.cost;
      rails =
        countKind(tiles, 'rail') +
        countKind(tiles, 'station') +
        countKind(tiles, 'crossing');
      if (rails >= 5) break;
    }
    expect(rails).toBeGreaterThanOrEqual(5);
  });
});

describe('train articulation', () => {
  it('poseAt で角を曲がると dir が変わる', () => {
    const path = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
    ];
    const before = poseAt(path, 1.0);
    const after = poseAt(path, 2.5);
    expect(before.dir).toBeCloseTo(0, 5);
    expect(after.dir).toBeCloseTo(Math.PI / 2, 5);
  });

  it('連結車両は間隔を空けて配置される', () => {
    const path = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
    ];
    const v: Vehicle = {
      id: 1,
      kind: 'train',
      x: 0,
      y: 0,
      dir: 0,
      speed: 0,
      progress: 5,
      path,
      destination: { x: 10, y: 0 },
      color: 0,
      cars: 4,
    };
    updateVehicles([v], 0);
    expect(v.carPoses).toHaveLength(4);
    const dx = v.carPoses![0]!.x - v.carPoses![1]!.x;
    expect(dx).toBeCloseTo(TRAIN_CAR_SPACING, 5);
  });
});
