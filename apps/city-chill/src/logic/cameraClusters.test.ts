import { describe, expect, it } from 'vitest';
import { autoZoomForCluster, computeCityClusters } from './cameraClusters';
import { idx, makeTile } from './grid';
import type { Tile } from '../types';

function grassGrid(w: number, h: number): Tile[] {
  return Array.from({ length: w * h }, () => makeTile('grass'));
}

function paintBlock(
  tiles: Tile[],
  w: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): void {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      tiles[idx(x, y, w)] = makeTile('residential', 1);
    }
  }
}

describe('computeCityClusters', () => {
  it('離れた2つの町を別クラスタにする', () => {
    const w = 64;
    const tiles = grassGrid(w, w);
    paintBlock(tiles, w, 8, 8, 14, 14);
    paintBlock(tiles, w, 48, 48, 56, 56);

    const clusters = computeCityClusters(tiles, w, w, [
      { id: 0, name: '青葉', cx: 11, cy: 11, radius: 8 },
      { id: 1, name: '緑ヶ丘', cx: 52, cy: 52, radius: 8 },
    ]);

    expect(clusters.length).toBe(2);
    const labels = clusters.map((c) => c.label).sort();
    expect(labels).toEqual(['緑ヶ丘', '青葉']);
  });

  it('空き地だけのマップでは空配列', () => {
    const w = 32;
    const tiles = grassGrid(w, w);
    expect(computeCityClusters(tiles, w, w)).toEqual([]);
  });

  it('鉄道でつながっていても2町は別クラスタのまま', () => {
    const w = 64;
    const tiles = grassGrid(w, w);
    paintBlock(tiles, w, 8, 8, 14, 14);
    paintBlock(tiles, w, 48, 8, 54, 14);
    // 都市間を線路で接続
    for (let x = 14; x <= 48; x++) {
      tiles[idx(x, 11, w)] = makeTile('rail');
    }
    tiles[idx(14, 11, w)] = makeTile('station');
    tiles[idx(48, 11, w)] = makeTile('station');

    const clusters = computeCityClusters(tiles, w, w, [
      { id: 0, name: '青葉', cx: 11, cy: 11, radius: 8 },
      { id: 1, name: '緑ヶ丘', cx: 51, cy: 11, radius: 8 },
    ]);

    expect(clusters.length).toBe(2);
    // 中心が線路の中間（x≈31）に寄らない
    for (const c of clusters) {
      expect(Math.abs(c.cx - 31)).toBeGreaterThan(10);
    }
  });

  it('大きいクラスタほど autoZoom が小さい（ズームアウト）', () => {
    const small = autoZoomForCluster({
      cx: 0,
      cy: 0,
      radius: 8,
      size: 10,
      label: null,
    });
    const large = autoZoomForCluster({
      cx: 0,
      cy: 0,
      radius: 40,
      size: 200,
      label: null,
    });
    expect(large).toBeLessThan(small);
  });
});
