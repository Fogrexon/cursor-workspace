import { describe, expect, it } from 'vitest';
import {
  createIsoCamera,
  focusLargestClusterNow,
  followCityCenter,
  takeFocusAnnounce,
} from '../ui/scene/isoCamera';
import type { CityState, Settlement } from '../types';
import { idx, makeTile } from './grid';

function stubCity(
  settlements: Settlement[],
  paint: (tiles: ReturnType<typeof makeTile>[], w: number) => void,
): CityState {
  const w = 64;
  const tiles = Array.from({ length: w * w }, () => makeTile('grass'));
  paint(tiles, w);
  return {
    width: w,
    height: w,
    tiles,
    stats: {
      population: 10,
      housing: 10,
      jobs: 5,
      transport: 5,
      education: 20,
      happiness: 50,
      budget: 100,
      industry: 1,
      commerce: 1,
      day: 1,
    },
    vehicles: [],
    stage: 'village',
    buildCooldown: 0,
    nextVehicleId: 1,
    seed: 1,
    settlements,
    mapRevision: 0,
    visualRevision: 0,
    constructionIndices: [],
  };
}

describe('camera cluster focus', () => {
  it('最大クラスタへ寄せ、サイズに応じてズームする', () => {
    const towns: Settlement[] = [
      { id: 0, name: '青葉', cx: 12, cy: 12, radius: 8, level: 'village' as const },
      { id: 1, name: '緑ヶ丘', cx: 50, cy: 50, radius: 10, level: 'village' as const },
    ];
    const city = stubCity(towns, (tiles, w) => {
      for (let y = 8; y <= 14; y++) {
        for (let x = 8; x <= 14; x++) tiles[idx(x, y, w)] = makeTile('residential', 1);
      }
      for (let y = 44; y <= 56; y++) {
        for (let x = 44; x <= 56; x++) tiles[idx(x, y, w)] = makeTile('residential', 1);
      }
    });

    const cam = createIsoCamera(1);
    focusLargestClusterNow(cam, city);
    expect(cam.clusters.length).toBe(2);
    expect(cam.focusIndex).toBe(0); // 大きい方が先
    expect(cam.target.x).toBeGreaterThan(40);
    expect(takeFocusAnnounce(cam)).toBe('緑ヶ丘');
    // 大きい塊なので小さめの町よりズームアウト寄り
    expect(cam.autoZoom).toBeLessThan(0.85);
  });

  it('一定時間後に別クラスタへ切り替わる', () => {
    const towns: Settlement[] = [
      { id: 0, name: '青葉', cx: 12, cy: 12, radius: 8, level: 'village' as const },
      { id: 1, name: '緑ヶ丘', cx: 50, cy: 50, radius: 8, level: 'village' as const },
    ];
    const city = stubCity(towns, (tiles, w) => {
      for (let y = 8; y <= 16; y++) {
        for (let x = 8; x <= 16; x++) tiles[idx(x, y, w)] = makeTile('road');
      }
      for (let y = 46; y <= 54; y++) {
        for (let x = 46; x <= 54; x++) tiles[idx(x, y, w)] = makeTile('road');
      }
    });

    const cam = createIsoCamera(1);
    focusLargestClusterNow(cam, city);
    const first = cam.focusIndex;
    takeFocusAnnounce(cam);

    for (let i = 0; i < 40; i++) followCityCenter(cam, city, 1);
    // ランダムだが、十分な時間でほぼ必ず切替（重みで他を優先）
    expect(cam.clusters.length).toBe(2);
    // 切替が起きていればインデックスが変わるか、少なくともクラスタ上にいる
    expect(cam.focusIndex).toBeGreaterThanOrEqual(0);
    expect(cam.focusIndex).toBeLessThan(2);
    // 強制的にタイマー切れを複数回やれば高確率で変わる
    let switched = cam.focusIndex !== first;
    for (let attempt = 0; attempt < 20 && !switched; attempt++) {
      cam.focusTimer = 0;
      followCityCenter(cam, city, 0.1);
      switched = cam.focusIndex !== first;
    }
    expect(switched).toBe(true);
  });
});
