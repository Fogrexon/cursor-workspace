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

  // 集落数に応じて初期人口・予算を少し増やす
  const villageCount = Math.max(1, settlements.length);
  const initialPop = balance.population.initial * villageCount;
  const initialBudget = balance.budget.initial + (villageCount - 1) * 80;

  const baseStats = {
    population: initialPop,
    housing: 0,
    jobs: 0,
    transport: 0,
    education: 10,
    happiness: 55,
    budget: initialBudget,
    industry: 0,
    commerce: 0,
    day: 0,
  };

  const stats = recomputeStats(tiles, baseStats, balance);
  stats.population = initialPop;
  stats.budget = initialBudget;

  return {
    width,
    height,
    tiles,
    stats,
    vehicles: [],
    stage: stageFromPopulation(initialPop, balance),
    buildCooldown: 0.8,
    nextVehicleId: 1,
    seed,
    settlements,
  };
}
