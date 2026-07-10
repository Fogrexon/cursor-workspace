import type { CityState, SimConfig } from '../types';
import { DEFAULT_BALANCE, type BalanceConfig } from './balance';
import { recomputeStats, stageFromPopulation } from './stats';
import { createRng } from './rng';
import { seedSettlements } from './settlements';
import { generateTerrain } from './terrain';

/** 複数の小さな村からスタートする初期マップ */
export function createInitialCity(
  config: SimConfig,
  balance: BalanceConfig = DEFAULT_BALANCE,
): CityState {
  const { width, height, seed } = config;
  const rng = createRng(seed);

  const tiles = generateTerrain(width, height, seed, balance.terrain);
  const settlements = seedSettlements(tiles, width, height, rng);

  // 初期人口・予算は実際の住宅キャパに合わせる（集落規模のばらつきを反映）
  const baseStats = {
    population: balance.population.initial,
    housing: 0,
    jobs: 0,
    transport: 0,
    education: 10,
    happiness: 55,
    budget: balance.budget.initial,
    industry: 0,
    commerce: 0,
    day: 0,
  };

  const stats = recomputeStats(tiles, baseStats, balance);
  const fromHousing = Math.round(stats.housing * 0.62);
  const villageCount = Math.max(1, settlements.length);
  stats.population = Math.max(
    balance.population.initial,
    fromHousing + (villageCount - 1) * 4,
  );
  stats.budget =
    balance.budget.initial +
    Math.round(stats.housing * 0.9) +
    (villageCount - 1) * 40;

  return {
    width,
    height,
    tiles,
    stats,
    vehicles: [],
    stage: stageFromPopulation(stats.population, balance),
    buildCooldown: 0.8,
    nextVehicleId: 1,
    seed,
    settlements,
  };
}
