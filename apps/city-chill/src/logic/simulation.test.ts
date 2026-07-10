import { describe, expect, it } from 'vitest';
import { createRng, pickInt, chance } from './rng';
import { createInitialCity } from './init';
import {
  growPopulation,
  recomputeStats,
  stageFromPopulation,
  computeBuildNeeds,
  stageLabel,
} from './stats';
import { tryBuild, tickConstruction } from './growth';
import { idx, makeTile, countKind, adjacentToRoad } from './grid';
import { updateVehicles, spawnVehicles } from './vehicles';
import type { Tile, Vehicle } from '../types';

describe('rng', () => {
  it('同じ seed なら同じ列を返す', () => {
    const a = createRng(123);
    const b = createRng(123);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('pickInt は範囲内', () => {
    const rng = createRng(1);
    for (let i = 0; i < 50; i++) {
      const n = pickInt(rng, 2, 5);
      expect(n).toBeGreaterThanOrEqual(2);
      expect(n).toBeLessThanOrEqual(5);
    }
  });

  it('chance(0) は常に false、chance(1) は常に true', () => {
    const rng = createRng(9);
    expect(chance(rng, 0)).toBe(false);
    expect(chance(rng, 1)).toBe(true);
  });
});

describe('grid', () => {
  it('idx と countKind', () => {
    const tiles: Tile[] = [
      makeTile('grass'),
      makeTile('road'),
      makeTile('road'),
      makeTile('residential', 1),
    ];
    expect(idx(1, 1, 2)).toBe(3);
    expect(countKind(tiles, 'road')).toBe(2);
  });

  it('adjacentToRoad', () => {
    const w = 3;
    const tiles: Tile[] = Array.from({ length: 9 }, () => makeTile('grass'));
    tiles[idx(1, 1, w)] = makeTile('road');
    expect(adjacentToRoad(tiles, 0, 1, w, 3)).toBe(true);
    expect(adjacentToRoad(tiles, 0, 0, w, 3)).toBe(false);
  });
});

describe('stats', () => {
  it('初期村は village', () => {
    expect(stageFromPopulation(10)).toBe('village');
    expect(stageFromPopulation(80)).toBe('town');
    expect(stageFromPopulation(300)).toBe('city');
    expect(stageFromPopulation(900)).toBe('metropolis');
  });

  it('stageLabel が日本語を返す', () => {
    expect(stageLabel('village')).toBe('小さな村');
  });

  it('住宅が増えると housing が増える', () => {
    const tiles = [makeTile('residential', 2), makeTile('road')];
    const stats = recomputeStats(tiles, {
      population: 5,
      housing: 0,
      jobs: 0,
      transport: 0,
      education: 0,
      happiness: 50,
      budget: 100,
      industry: 0,
      commerce: 0,
      day: 1,
    });
    expect(stats.housing).toBe(16);
    expect(stats.transport).toBe(4);
  });

  it('人口は住宅キャパを超えて急増しない', () => {
    const stats = {
      population: 20,
      housing: 24,
      jobs: 30,
      transport: 40,
      education: 50,
      happiness: 70,
      budget: 100,
      industry: 10,
      commerce: 10,
      day: 1,
    };
    const next = growPopulation(stats);
    expect(next).toBeGreaterThan(20);
    expect(next).toBeLessThanOrEqual(24);
  });

  it('computeBuildNeeds は住宅不足で residential が高い', () => {
    const need = computeBuildNeeds(
      {
        population: 100,
        housing: 50,
        jobs: 80,
        transport: 50,
        education: 40,
        happiness: 60,
        budget: 200,
        industry: 20,
        commerce: 20,
        day: 10,
      },
      'town',
    );
    expect(need.residential).toBeGreaterThan(need.park);
  });
});

describe('init + growth', () => {
  it('初期マップに道路と住宅がある', () => {
    const city = createInitialCity({
      width: 20,
      height: 20,
      seed: 7,
      secondsPerDay: 1,
    });
    expect(countKind(city.tiles, 'road')).toBeGreaterThan(5);
    expect(countKind(city.tiles, 'residential')).toBeGreaterThan(0);
    expect(city.stats.population).toBeGreaterThanOrEqual(12);
  });

  it('建設でタイルが変わるか予算が減る', () => {
    const city = createInitialCity({
      width: 24,
      height: 24,
      seed: 99,
      secondsPerDay: 1,
    });
    const beforeBudget = city.stats.budget;
    const beforeRoads = countKind(city.tiles, 'road');
    let built = false;
    for (let d = 0; d < 30; d++) {
      const r = tryBuild(
        city.tiles,
        city.width,
        city.height,
        city.stats,
        city.stage,
        city.seed,
        d,
      );
      if (r.built) {
        city.stats.budget -= r.cost;
        built = true;
        break;
      }
    }
    expect(built).toBe(true);
    expect(city.stats.budget).toBeLessThan(beforeBudget);
    // 何かが建った or 道路が増えた
    const afterBuildings =
      countKind(city.tiles, 'residential') +
      countKind(city.tiles, 'commercial') +
      countKind(city.tiles, 'road') +
      countKind(city.tiles, 'park');
    expect(afterBuildings).toBeGreaterThanOrEqual(beforeRoads);
  });

  it('tickConstruction が建設カウンタを減らす', () => {
    const t = makeTile('residential', 1, 0, 5);
    tickConstruction([t]);
    expect(t.construction).toBeCloseTo(5 - 1 / 3, 5);
  });
});

describe('vehicles', () => {
  it('経路に沿って進む', () => {
    const v: Vehicle = {
      id: 1,
      kind: 'car',
      x: 0,
      y: 0,
      dir: 0,
      speed: 2,
      progress: 0,
      path: [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
      ],
      destination: { x: 2, y: 0 },
      color: 0,
    };
    updateVehicles([v], 0.5);
    expect(v.x).toBeCloseTo(1, 5);
    expect(v.progress).toBeCloseTo(1, 5);
    updateVehicles([v], 0.4);
    expect(v.x).toBeCloseTo(1.8, 5);
    expect(v.progress).toBeCloseTo(1.8, 5);
  });

  it('電車は先頭から順に曲がる', () => {
    const path = [
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 3 },
    ];
    const v: Vehicle = {
      id: 2,
      kind: 'train',
      x: 0,
      y: 0,
      dir: 0,
      speed: 2,
      progress: 3.2,
      path,
      destination: { x: 3, y: 3 },
      color: 0,
      cars: 4,
    };
    updateVehicles([v], 0);
    expect(v.carPoses).toHaveLength(4);
    // 先頭は角を曲がった後、後方車両はまだ直線上
    const head = v.carPoses![0]!;
    const tail = v.carPoses![3]!;
    expect(head.dir).toBeCloseTo(Math.PI / 2, 5);
    expect(tail.dir).toBeCloseTo(0, 5);
    expect(tail.y).toBeCloseTo(0, 5);
  });

  it('道路があれば車両がスポーンする', () => {
    const city = createInitialCity({
      width: 20,
      height: 20,
      seed: 3,
      secondsPerDay: 1,
    });
    const { vehicles } = spawnVehicles(
      city.tiles,
      city.width,
      city.height,
      [],
      1,
      80,
      3,
      1,
    );
    expect(vehicles.length).toBeGreaterThan(0);
  });
});
