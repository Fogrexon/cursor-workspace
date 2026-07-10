import { describe, expect, it } from 'vitest';
import { createSimulation, tickSimulation } from './simulation';
import { collectConstructionIndices, tickConstruction } from './growth';
import { makeTile } from './grid';
import { pathLengths, setVehiclePath, updateVehicles } from './vehicles';
import type { Vehicle } from '../types';

describe('performance helpers', () => {
  it('tickConstruction は activeIndices だけ更新する', () => {
    const tiles = [
      makeTile('residential', 1, 0, 5),
      makeTile('grass'),
      makeTile('commercial', 1, 0, 3),
    ];
    const result = tickConstruction(tiles, [0, 2]);
    expect(tiles[0]!.construction).toBeCloseTo(5 - 1 / 3, 5);
    expect(tiles[2]!.construction).toBeCloseTo(3 - 1 / 3, 5);
    expect(tiles[1]!.construction).toBe(0);
    expect(result.indices).toEqual([0, 2]);
    expect(result.visualChanged).toBe(false);
  });

  it('collectConstructionIndices が建設中だけ返す', () => {
    const tiles = [
      makeTile('residential', 1, 0, 2),
      makeTile('grass'),
      makeTile('road', 0, 0, 1),
    ];
    expect(collectConstructionIndices(tiles)).toEqual([0, 2]);
  });

  it('車両の pathLens をキャッシュする', () => {
    const v: Vehicle = {
      id: 1,
      kind: 'car',
      x: 0,
      y: 0,
      dir: 0,
      speed: 1,
      progress: 0,
      path: [
        { x: 0, y: 0 },
        { x: 4, y: 0 },
      ],
      destination: { x: 4, y: 0 },
      color: 0,
    };
    updateVehicles([v], 0.1);
    expect(v.pathLens).toEqual(pathLengths(v.path));
    const cached = v.pathLens;
    updateVehicles([v], 0.1);
    expect(v.pathLens).toBe(cached);

    setVehiclePath(v, [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
    ]);
    expect(v.pathLens).toBeUndefined();
    updateVehicles([v], 0.1);
    expect(v.pathLens).toEqual(pathLengths(v.path));
  });

  it('インプレース tick は同一 state 参照を返す', () => {
    const state = createSimulation({ width: 24, height: 24, seed: 7 });
    const result = tickSimulation(state, 0.05, 2.8);
    expect(result.state).toBe(state);
  });

  it('128x128 の通常フレームが妥当な時間で終わる', () => {
    let state = createSimulation({ width: 128, height: 128, seed: 99 });
    // ある程度街を育てる
    for (let i = 0; i < 80; i++) {
      state = tickSimulation(state, 0.5, 0.4).state;
    }
    const t0 = performance.now();
    for (let i = 0; i < 120; i++) {
      state = tickSimulation(state, 1 / 60, 2.8).state;
    }
    const elapsed = performance.now() - t0;
    // 120 フレーム分が 2 秒以内（CI でも余裕）
    expect(elapsed).toBeLessThan(2000);
  });
});
