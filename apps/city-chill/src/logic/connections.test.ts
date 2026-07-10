import { describe, expect, it } from 'vitest';
import {
  isRailSurface,
  isRoadSurface,
  linkMask,
  primaryAxis,
} from './connections';
import { makeTile } from './grid';
import { poseAt, TRAIN_CAR_SPACING, updateVehicles } from './vehicles';
import { createInitialCity } from './init';
import { tryBuild } from './growth';
import { countKind } from './grid';
import type { Tile, Vehicle } from '../types';

describe('connections', () => {
  it('東西道路なら primaryAxis は x', () => {
    const w = 3;
    const tiles: Tile[] = Array.from({ length: 9 }, () => makeTile('grass'));
    tiles[1 * w + 0] = makeTile('road');
    tiles[1 * w + 1] = makeTile('road');
    tiles[1 * w + 2] = makeTile('road');
    const m = linkMask(tiles, 1, 1, w, 3, isRoadSurface);
    expect(m.e).toBe(true);
    expect(m.w).toBe(true);
    expect(primaryAxis(m)).toBe('x');
  });

  it('南北線路なら primaryAxis は z', () => {
    const w = 3;
    const tiles: Tile[] = Array.from({ length: 9 }, () => makeTile('grass'));
    tiles[0 * w + 1] = makeTile('rail');
    tiles[1 * w + 1] = makeTile('rail');
    tiles[2 * w + 1] = makeTile('rail');
    const m = linkMask(tiles, 1, 1, w, 3, isRailSurface);
    expect(primaryAxis(m)).toBe('z');
  });

  it('crossing は road/rail 両方の surface', () => {
    expect(isRoadSurface('crossing')).toBe(true);
    expect(isRailSurface('crossing')).toBe(true);
  });
});

describe('rail corridor', () => {
  it('rail 建設で複数タイルが繋がる', () => {
    const city = createInitialCity({
      width: 24,
      height: 24,
      seed: 11,
      secondsPerDay: 1,
    });
    // city 段階相当の予算・需要で rail を狙う
    city.stats.budget = 5000;
    city.stage = 'city';
    city.stats.population = 200;
    let rails = 0;
    for (let d = 0; d < 80; d++) {
      const r = tryBuild(
        city.tiles,
        city.width,
        city.height,
        city.stats,
        'city',
        city.seed,
        d + 100,
      );
      if (r.built) city.stats.budget -= r.cost;
      rails = countKind(city.tiles, 'rail') + countKind(city.tiles, 'station') + countKind(city.tiles, 'crossing');
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
