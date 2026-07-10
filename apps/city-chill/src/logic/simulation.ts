import type { CityState, SimConfig } from '../types';
import { DEFAULT_BALANCE, mergeBalance, type BalanceConfig, type DeepPartial } from './balance';
import { tickConstruction, tryBuild } from './growth';
import { createInitialCity } from './init';
import { createRng } from './rng';
import {
  mergeNearbySettlements,
  refreshSettlementCenters,
} from './settlements';
import { growPopulation, recomputeStats, stageFromPopulation } from './stats';
import { spawnVehicles, updateVehicles } from './vehicles';

export function createSimulation(
  config: Partial<SimConfig> = {},
  balance?: DeepPartial<BalanceConfig> | BalanceConfig,
): CityState {
  const full: SimConfig = {
    width: config.width ?? 28,
    height: config.height ?? 28,
    seed: config.seed ?? 42,
    secondsPerDay: config.secondsPerDay ?? 2.8,
  };
  const bal = balance ? mergeBalance(balance as DeepPartial<BalanceConfig>) : DEFAULT_BALANCE;
  return createInitialCity(full, bal);
}

export interface TickResult {
  state: CityState;
  events: string[];
}

/**
 * シミュレーションを dt 秒進める。
 * 建設・人口は buildCooldown 間隔、車両・建設アニメは毎フレーム。
 */
export function tickSimulation(
  state: CityState,
  dt: number,
  secondsPerDay: number,
  balance: BalanceConfig = DEFAULT_BALANCE,
): TickResult {
  const events: string[] = [];
  const next: CityState = {
    ...state,
    tiles: state.tiles.map((t) => ({ ...t })),
    stats: { ...state.stats },
    settlements: state.settlements.map((s) => ({ ...s })),
    vehicles: state.vehicles.map((v) => ({
      ...v,
      path: v.path.map((p) => ({ ...p })),
      destination: { ...v.destination },
      carPoses: v.carPoses?.map((p) => ({ ...p })),
    })),
  };

  tickConstruction(next.tiles);
  updateVehicles(next.vehicles, dt, {
    tiles: next.tiles,
    width: next.width,
    height: next.height,
    seed: next.seed,
    day: next.stats.day,
  });

  next.buildCooldown -= dt;

  const bi = balance.buildInterval;
  const buildInterval = Math.max(bi.minSeconds, secondsPerDay * bi.dayFactor);
  if (next.buildCooldown <= 0) {
    const jitterRng = createRng((next.seed ^ (next.stats.day * 374761393) ^ 0x9e3779b9) >>> 0);
    next.buildCooldown = buildInterval * (bi.jitterMin + jitterRng() * bi.jitterRange);

    const result = tryBuild(
      next.tiles,
      next.width,
      next.height,
      next.stats,
      next.stage,
      next.seed,
      next.stats.day,
      balance,
      next.settlements,
    );
    if (result.built && result.kind) {
      next.stats.budget -= result.cost;
      events.push(result.kind);
    }

    next.stats.day += 1;
    next.stats = recomputeStats(next.tiles, next.stats, balance);
    next.stats.population = growPopulation(next.stats, balance);
    next.stage = stageFromPopulation(next.stats.population, balance);

    // 集落の重心更新と合体判定（数日おきで十分）
    if (next.stats.day % 3 === 0) {
      refreshSettlementCenters(next.settlements, next.tiles, next.width, next.height);
      const merge = mergeNearbySettlements(
        next.settlements,
        next.tiles,
        next.width,
        next.height,
      );
      if (merge.merged) {
        events.push('merge');
      }
    }

    const spawned = spawnVehicles(
      next.tiles,
      next.width,
      next.height,
      next.vehicles,
      next.nextVehicleId,
      next.stats.population,
      next.seed,
      next.stats.day,
    );
    next.vehicles = spawned.vehicles;
    next.nextVehicleId = spawned.nextId;
  }

  return { state: next, events };
}
