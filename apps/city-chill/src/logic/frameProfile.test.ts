import { describe, expect, it } from 'vitest';
import { formatProfileLine, profileSimulation } from './frameProfile';
import { orderStationsForTour } from './vehicles';
import { idx, makeTile } from './grid';
import type { Tile } from '../types';

describe('frameProfile', () => {
  it('成長後の通常フレームが建設日より軽い', () => {
    const p = profileSimulation({
      width: 48,
      height: 48,
      seed: 11,
      growDays: 40,
      sampleFrames: 90,
    });
    expect(p.idleTickMs).toBeLessThan(8);
    expect(p.vehicleMs).toBeLessThan(8);
    expect(p.buildTickMs).toBeLessThan(80);
  });

  it('formatProfileLine が読みやすい', () => {
    const s = formatProfileLine(
      { fps: 58.2, simMs: 1.2, syncMs: 0.4, drawMs: 3.1, totalMs: 4.7 },
      { calls: 1200, vehicles: 12 },
    );
    expect(s).toContain('58fps');
    expect(s).toContain('sim 1.2');
    expect(s).toContain('calls 1200');
  });
});

describe('orderStationsForTour', () => {
  it('駅が多いときも幾何距離で高速に巡回順を決める', () => {
    const w = 40;
    const h = 20;
    const tiles: Tile[] = Array.from({ length: w * h }, () => makeTile('grass'));
    const stations: Array<{ x: number; y: number }> = [];
    for (let x = 2; x <= 36; x++) {
      tiles[idx(x, 10, w)] = makeTile(x % 5 === 2 ? 'station' : 'rail');
      if (x % 5 === 2) stations.push({ x, y: 10 });
    }
    expect(stations.length).toBeGreaterThanOrEqual(5);

    const t0 = performance.now();
    const order = orderStationsForTour(stations, tiles, w, h);
    const elapsed = performance.now() - t0;

    expect(order.length).toBe(stations.length);
    expect(elapsed).toBeLessThan(20);
  });
});
