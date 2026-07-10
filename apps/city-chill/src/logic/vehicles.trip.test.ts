import { describe, expect, it } from 'vitest';
import { findNetworkPath } from './networkPath';
import { assignCarTrip, assignTrainTrip, createTrainOnPath, orderStationsForTour, spawnVehicles, updateVehicles } from './vehicles';
import { idx, makeTile } from './grid';
import type { Tile, Vehicle } from '../types';

function roadGrid(w: number, h: number): Tile[] {
  return Array.from({ length: w * h }, () => makeTile('grass'));
}

describe('findNetworkPath', () => {
  it('道路網上で最短寄り経路を返す', () => {
    const w = 5;
    const tiles = roadGrid(w, 5);
    // 十字道路
    for (let x = 0; x < w; x++) tiles[idx(x, 2, w)] = makeTile('road');
    for (let y = 0; y < 5; y++) tiles[idx(2, y, w)] = makeTile('road');

    const path = findNetworkPath(
      tiles,
      w,
      5,
      { x: 0, y: 2 },
      { x: 4, y: 2 },
      new Set(['road']),
    );
    expect(path).not.toBeNull();
    expect(path![0]).toEqual({ x: 0, y: 2 });
    expect(path![path!.length - 1]).toEqual({ x: 4, y: 2 });
    expect(path!.every((p) => tiles[idx(p.x, p.y, w)]!.kind === 'road')).toBe(true);
  });
});

describe('destination trips', () => {
  it('車は道路マス目的地へ向かう経路を持つ', () => {
    const w = 8;
    const tiles = roadGrid(w, 8);
    for (let x = 1; x < 7; x++) tiles[idx(x, 3, w)] = makeTile('road');
    for (let y = 1; y < 7; y++) tiles[idx(3, y, w)] = makeTile('road');
    const roads = [
      { x: 1, y: 3 },
      { x: 6, y: 3 },
      { x: 3, y: 1 },
      { x: 3, y: 6 },
    ];
    const v: Vehicle = {
      id: 1,
      kind: 'car',
      x: 1,
      y: 3,
      dir: 0,
      speed: 2,
      progress: 0,
      path: [{ x: 1, y: 3 }],
      destination: { x: 1, y: 3 },
      color: 0,
    };
    const ok = assignCarTrip(v, tiles, w, 8, roads, () => 0.7);
    expect(ok).toBe(true);
    expect(v.path.length).toBeGreaterThanOrEqual(2);
    expect(v.destination.x !== 1 || v.destination.y !== 3).toBe(true);
    const last = v.path[v.path.length - 1]!;
    expect(last).toEqual(v.destination);
  });

  it('電車は駅間を結ぶ', () => {
    const w = 10;
    const tiles = roadGrid(w, 10);
    for (let x = 1; x < 9; x++) tiles[idx(x, 4, w)] = makeTile('rail');
    tiles[idx(1, 4, w)] = makeTile('station', 1);
    tiles[idx(8, 4, w)] = makeTile('station', 1);
    const stations = [
      { x: 1, y: 4 },
      { x: 8, y: 4 },
    ];
    const rails = [];
    for (let x = 1; x < 9; x++) rails.push({ x, y: 4 });

    const v: Vehicle = {
      id: 2,
      kind: 'train',
      x: 1,
      y: 4,
      dir: 0,
      speed: 2,
      progress: 0,
      path: [{ x: 1, y: 4 }],
      destination: { x: 1, y: 4 },
      color: 0,
      cars: 3,
    };
    const ok = assignTrainTrip(v, tiles, w, 10, stations, rails, () => 0.9);
    expect(ok).toBe(true);
    expect(v.destination).toEqual({ x: 8, y: 4 });
    expect(v.path[v.path.length - 1]).toEqual({ x: 8, y: 4 });
  });

  it('3駅ある路線では途中駅を飛ばさず次の駅へ向かう', () => {
    const w = 20;
    const tiles = roadGrid(w, 8);
    for (let x = 2; x <= 16; x++) tiles[idx(x, 3, w)] = makeTile('rail');
    tiles[idx(2, 3, w)] = makeTile('station', 1);
    tiles[idx(9, 3, w)] = makeTile('station', 1);
    tiles[idx(16, 3, w)] = makeTile('station', 1);
    const stations = [
      { x: 2, y: 3 },
      { x: 9, y: 3 },
      { x: 16, y: 3 },
    ];
    const rails = [];
    for (let x = 2; x <= 16; x++) rails.push({ x, y: 3 });

    const tour = orderStationsForTour(stations, tiles, w, 8);
    expect(tour).toHaveLength(3);
    // 端→中→端の順（または逆）
    expect(tour[1]).toEqual({ x: 9, y: 3 });

    const v: Vehicle = {
      id: 5,
      kind: 'train',
      x: 2,
      y: 3,
      dir: 0,
      speed: 2,
      progress: 0,
      path: [{ x: 2, y: 3 }],
      destination: { x: 2, y: 3 },
      color: 0,
      cars: 3,
    };
    expect(assignTrainTrip(v, tiles, w, 8, stations, rails, () => 0.5)).toBe(true);
    // 端駅にいるので次は途中駅（一番遠い端ではない）
    expect(v.destination).toEqual({ x: 9, y: 3 });

    v.x = 9;
    v.y = 3;
    expect(assignTrainTrip(v, tiles, w, 8, stations, rails, () => 0.5)).toBe(true);
    // 中間駅からは進行方向の隣（端駅）
    expect(v.destination).toEqual({ x: 16, y: 3 });

    v.x = 16;
    v.y = 3;
    expect(assignTrainTrip(v, tiles, w, 8, stations, rails, () => 0.5)).toBe(true);
    // 端で折り返し → 再び途中駅
    expect(v.destination).toEqual({ x: 9, y: 3 });
  });

  it('都市間の長い線路でも電車が経路を取れる', () => {
    const w = 120;
    const tiles = roadGrid(w, 8);
    for (let x = 2; x < 110; x++) tiles[idx(x, 4, w)] = makeTile('rail');
    tiles[idx(2, 4, w)] = makeTile('station', 1);
    tiles[idx(109, 4, w)] = makeTile('station', 1);
    const stations = [
      { x: 2, y: 4 },
      { x: 109, y: 4 },
    ];
    const rails = [];
    for (let x = 2; x < 110; x++) rails.push({ x, y: 4 });

    const v: Vehicle = {
      id: 4,
      kind: 'train',
      x: 2,
      y: 4,
      dir: 0,
      speed: 2,
      progress: 0,
      path: [{ x: 2, y: 4 }],
      destination: { x: 2, y: 4 },
      color: 0,
      cars: 4,
    };
    const ok = assignTrainTrip(v, tiles, w, 8, stations, rails, () => 0.5);
    expect(ok).toBe(true);
    expect(v.path.length).toBeGreaterThan(80);
    expect(v.destination).toEqual({ x: 109, y: 4 });
  });

  it('駅が2つ以上つながっていれば必ず電車が1本はスポーンする', () => {
    const w = 100;
    const tiles = roadGrid(w, 6);
    for (let x = 1; x < 90; x++) tiles[idx(x, 3, w)] = makeTile('rail');
    tiles[idx(1, 3, w)] = makeTile('station', 1);
    tiles[idx(89, 3, w)] = makeTile('station', 1);

    const { vehicles } = spawnVehicles(tiles, w, 6, [], 1, 50, 7, 1);
    const trains = vehicles.filter((v) => v.kind === 'train');
    expect(trains.length).toBeGreaterThanOrEqual(1);
    expect(trains[0]!.path.length).toBeGreaterThanOrEqual(2);
  });

  it('非連結の路線それぞれに電車が立つ', () => {
    const w = 40;
    const tiles = roadGrid(w, 20);
    // 路線A
    for (let x = 2; x <= 10; x++) tiles[idx(x, 4, w)] = makeTile('rail');
    tiles[idx(2, 4, w)] = makeTile('station', 1);
    tiles[idx(10, 4, w)] = makeTile('station', 1);
    // 路線B（離れた別ネット）
    for (let x = 25; x <= 35; x++) tiles[idx(x, 14, w)] = makeTile('rail');
    tiles[idx(25, 14, w)] = makeTile('station', 1);
    tiles[idx(35, 14, w)] = makeTile('station', 1);

    const { vehicles } = spawnVehicles(tiles, w, 20, [], 1, 50, 3, 1);
    const trains = vehicles.filter((v) => v.kind === 'train');
    expect(trains.length).toBeGreaterThanOrEqual(2);
  });

  it('線路経路を渡すと電車が1台できる', () => {
    const path = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ];
    const train = createTrainOnPath(path, 10, () => 0.5);
    expect(train).not.toBeNull();
    expect(train!.kind).toBe('train');
    expect(train!.path).toHaveLength(4);
    expect(train!.destination).toEqual({ x: 3, y: 0 });
  });

  it('到着後に次の目的地へ切り替わる', () => {
    const w = 6;
    const tiles = roadGrid(w, 6);
    for (let x = 0; x < w; x++) tiles[idx(x, 2, w)] = makeTile('road');
    const roads = [
      { x: 0, y: 2 },
      { x: 5, y: 2 },
      { x: 2, y: 2 },
      { x: 4, y: 2 },
    ];
    const v: Vehicle = {
      id: 3,
      kind: 'car',
      x: 0,
      y: 2,
      dir: 0,
      speed: 10,
      progress: 0,
      path: [
        { x: 0, y: 2 },
        { x: 5, y: 2 },
      ],
      destination: { x: 5, y: 2 },
      color: 0,
      wait: 0,
    };
    updateVehicles([v], 1, {
      tiles,
      width: w,
      height: 6,
      seed: 1,
      day: 1,
    });
    // 到着して待機に入り、次の経路がセットされる
    expect(v.wait ?? 0).toBeGreaterThan(0);
    expect(v.path.length).toBeGreaterThanOrEqual(2);
    void roads;
  });
});
