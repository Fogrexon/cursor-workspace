import { describe, expect, it } from 'vitest';
import { DEFAULT_BALANCE, mergeBalance } from './balance';
import { countKind } from './grid';
import { generateTerrain, terrainBuildSurcharge, pavedKind } from './terrain';
import { createInitialCity } from './init';
import { fbm2D } from './noise';

describe('noise / terrain', () => {
  it('fbm は 0..1 付近に収まる', () => {
    for (let i = 0; i < 20; i++) {
      const v = fbm2D(i * 0.3, i * 0.17, 42);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('ノイズ地形は水・森・草をまとまった比率で含む', () => {
    const tiles = generateTerrain(48, 48, 7, DEFAULT_BALANCE.terrain);
    const water = countKind(tiles, 'water');
    const forest = countKind(tiles, 'forest');
    const grass = countKind(tiles, 'grass');
    const total = tiles.length;
    expect(water).toBeGreaterThan(total * 0.01);
    expect(water).toBeLessThan(total * 0.4);
    expect(forest).toBeGreaterThan(total * 0.03);
    expect(grass).toBeGreaterThan(total * 0.25);
  });

  it('同じ seed なら同じ地形', () => {
    const a = generateTerrain(16, 16, 99, DEFAULT_BALANCE.terrain);
    const b = generateTerrain(16, 16, 99, DEFAULT_BALANCE.terrain);
    expect(a.map((t) => t.kind).join()).toBe(b.map((t) => t.kind).join());
  });

  it('初期村の中心は草地/道路で水が無い', () => {
    const city = createInitialCity({ width: 64, height: 64, seed: 3, secondsPerDay: 1 });
    expect(city.settlements.length).toBeGreaterThanOrEqual(1);
    for (const s of city.settlements) {
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const t = city.tiles[(s.cy + dy) * 64 + (s.cx + dx)]!;
          expect(t.kind).not.toBe('water');
          expect(t.kind).not.toBe('forest');
        }
      }
    }
  });

  it('伐採・架橋のサーチャージが加算される', () => {
    const bal = mergeBalance();
    expect(terrainBuildSurcharge('forest', 'building', bal)).toBe(bal.development.forestClearCost);
    expect(terrainBuildSurcharge('water', 'road', bal)).toBe(bal.development.bridgeCost);
    expect(terrainBuildSurcharge('grass', 'road', bal)).toBe(0);
    expect(pavedKind('water', 'road')).toBe('bridge');
    expect(pavedKind('forest', 'road')).toBe('road');
  });
});
