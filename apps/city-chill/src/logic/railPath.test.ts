import { describe, expect, it } from 'vitest';
import { findRailPath, straightBlocked } from './railPath';
import { idx, makeTile } from './grid';
import type { Tile } from '../types';

function grid(w: number, h: number): Tile[] {
  return Array.from({ length: w * h }, () => makeTile('grass'));
}

describe('findRailPath', () => {
  it('直線が空いていればほぼ直線の経路を返す', () => {
    const w = 10;
    const tiles = grid(w, 10);
    const path = findRailPath(tiles, w, 10, { x: 1, y: 5 }, { x: 8, y: 5 });
    expect(path).not.toBeNull();
    expect(path!.length).toBe(8);
    expect(path!.every((p) => p.y === 5)).toBe(true);
  });

  it('広い池は迂回する（橋コストが高い）', () => {
    const w = 11;
    const tiles = grid(w, 11);
    // 中央に縦の池で東西を塞ぐ
    for (let y = 2; y <= 8; y++) {
      tiles[idx(5, y, w)] = makeTile('water');
    }
    expect(straightBlocked(tiles, w, 11, { x: 1, y: 5 }, { x: 9, y: 5 })).toBe(false);
    // water は通れるがコスト高 → 迂回を選ぶ
    const path = findRailPath(tiles, w, 11, { x: 1, y: 5 }, { x: 9, y: 5 });
    expect(path).not.toBeNull();
    expect(path!.some((p) => tiles[idx(p.x, p.y, w)]!.kind === 'water')).toBe(false);
    expect(path!.length).toBeGreaterThan(9);
    expect(path![0]).toEqual({ x: 1, y: 5 });
    expect(path![path!.length - 1]).toEqual({ x: 9, y: 5 });
  });

  it('水路しか無いときは橋経路を取る', () => {
    const w = 7;
    const tiles = grid(w, 7);
    // 端まで水で塞ぎ、迂回不可
    for (let y = 0; y < 7; y++) {
      tiles[idx(3, y, w)] = makeTile('water');
    }
    const path = findRailPath(tiles, w, 7, { x: 1, y: 3 }, { x: 5, y: 3 });
    expect(path).not.toBeNull();
    expect(path!.some((p) => tiles[idx(p.x, p.y, w)]!.kind === 'water')).toBe(true);
  });

  it('建物は草地で迂回し、道路は使わない', () => {
    const w = 9;
    const tiles = grid(w, 9);
    for (let y = 1; y <= 7; y++) {
      tiles[idx(4, y, w)] = makeTile('residential', 1);
    }
    // 道路もあるがコストが高いので使わない
    tiles[idx(4, 1, w)] = makeTile('road');

    const path = findRailPath(tiles, w, 9, { x: 1, y: 4 }, { x: 7, y: 4 });
    expect(path).not.toBeNull();
    expect(path!.some((p) => tiles[idx(p.x, p.y, w)]!.kind === 'residential')).toBe(false);
    expect(path!.every((p) => tiles[idx(p.x, p.y, w)]!.kind !== 'road')).toBe(true);
  });

  it('草地があれば道路より草地を選ぶ', () => {
    const w = 9;
    const tiles = grid(w, 9);
    // 中央に横道路
    for (let x = 0; x < w; x++) tiles[idx(x, 4, w)] = makeTile('road');
    const path = findRailPath(tiles, w, 9, { x: 1, y: 2 }, { x: 7, y: 2 });
    expect(path).not.toBeNull();
    // y=2 の草地直線を選ぶ（道路 y=4 は避ける）
    expect(path!.every((p) => p.y === 2)).toBe(true);
    expect(path!.every((p) => tiles[idx(p.x, p.y, w)]!.kind !== 'road')).toBe(true);
  });

  it('建物で完全に塞がれていれば null', () => {
    const w = 7;
    const tiles = grid(w, 7);
    for (let y = 0; y < 7; y++) {
      tiles[idx(3, y, w)] = makeTile('residential', 1);
    }
    const path = findRailPath(tiles, w, 7, { x: 1, y: 3 }, { x: 5, y: 3 });
    expect(path).toBeNull();
  });
});
