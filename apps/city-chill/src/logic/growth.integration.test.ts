import { describe, expect, it } from 'vitest';
import { createSimulation, tickSimulation } from './simulation';
import { countKind } from './grid';

describe('long-run growth', () => {
  it('十分な tick で町以上に成長する', () => {
    let state = createSimulation({ seed: 42, secondsPerDay: 0.4 });
    const seen = new Set<string>([state.stage]);

    for (let i = 0; i < 600; i++) {
      state = tickSimulation(state, 0.4, 0.4).state;
      seen.add(state.stage);
    }

    expect(state.stats.day).toBeGreaterThan(100);
    expect(state.stats.population).toBeGreaterThan(40);
    expect(seen.has('town') || seen.has('city') || seen.has('metropolis')).toBe(true);
    const roadSurface =
      countKind(state.tiles, 'road') + countKind(state.tiles, 'crossing');
    expect(roadSurface).toBeGreaterThan(10);
    expect(state.vehicles.length).toBeGreaterThan(0);
  });
});
