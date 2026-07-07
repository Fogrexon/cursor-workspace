import { describe, expect, it } from 'vitest';
import { generateCoins, generateTerrain, sampleTerrainHeight } from './terrain';
import type { Point, TerrainOptions } from '../types';

const baseOpts: TerrainOptions = {
  seed: 1,
  segmentCount: 100,
  segmentWidth: 2,
  flatSegments: 5,
  amplitude: 3,
  roughness: 0.5,
};

describe('generateTerrain', () => {
  it('区間数 +1 個の点を返す', () => {
    const pts = generateTerrain(baseOpts);
    expect(pts).toHaveLength(baseOpts.segmentCount + 1);
  });

  it('x は等間隔かつ昇順', () => {
    const pts = generateTerrain(baseOpts);
    for (let i = 0; i < pts.length; i++) {
      expect(pts[i].x).toBeCloseTo(i * baseOpts.segmentWidth);
    }
  });

  it('先頭の平坦区間は高さ 0', () => {
    const pts = generateTerrain(baseOpts);
    for (let i = 0; i <= baseOpts.flatSegments; i++) {
      expect(pts[i].y).toBe(0);
    }
  });

  it('平坦区間より先には起伏がある', () => {
    const pts = generateTerrain(baseOpts);
    const beyond = pts.slice(baseOpts.flatSegments + 8);
    const hasHills = beyond.some((p) => Math.abs(p.y) > 0.01);
    expect(hasHills).toBe(true);
  });

  it('同じシードなら同じ地形(決定的)', () => {
    const a = generateTerrain(baseOpts);
    const b = generateTerrain(baseOpts);
    expect(a).toEqual(b);
  });

  it('異なるシードなら異なる地形', () => {
    const a = generateTerrain(baseOpts);
    const b = generateTerrain({ ...baseOpts, seed: 999 });
    expect(a).not.toEqual(b);
  });
});

describe('sampleTerrainHeight', () => {
  const line: Point[] = [
    { x: 0, y: 0 },
    { x: 10, y: 10 },
    { x: 20, y: 0 },
  ];

  it('点の中間は線形補間される', () => {
    expect(sampleTerrainHeight(line, 5)).toBeCloseTo(5);
    expect(sampleTerrainHeight(line, 15)).toBeCloseTo(5);
  });

  it('点そのものの高さを返す', () => {
    expect(sampleTerrainHeight(line, 10)).toBeCloseTo(10);
  });

  it('範囲外は端点でクランプ', () => {
    expect(sampleTerrainHeight(line, -100)).toBe(0);
    expect(sampleTerrainHeight(line, 100)).toBe(0);
  });

  it('空配列は 0', () => {
    expect(sampleTerrainHeight([], 5)).toBe(0);
  });
});

describe('generateCoins', () => {
  const terrain = generateTerrain(baseOpts);

  it('スタート区間より手前にはコインを置かない', () => {
    const coins = generateCoins(terrain, { spacing: 6, height: 2, skipUntilX: 20 });
    expect(coins.every((c) => c.x > 20)).toBe(true);
  });

  it('コインは地面より上に配置される', () => {
    const coins = generateCoins(terrain, { spacing: 6, height: 2, skipUntilX: 20 });
    for (const c of coins) {
      expect(c.y).toBeGreaterThan(sampleTerrainHeight(terrain, c.x));
    }
  });

  it('初期状態は未取得', () => {
    const coins = generateCoins(terrain, { spacing: 6, height: 2, skipUntilX: 20 });
    expect(coins.every((c) => c.taken === false)).toBe(true);
  });

  it('spacing が 0 以下なら空', () => {
    expect(generateCoins(terrain, { spacing: 0, height: 2, skipUntilX: 0 })).toEqual([]);
  });
});
