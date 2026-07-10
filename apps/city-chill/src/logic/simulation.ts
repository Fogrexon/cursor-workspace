import type { CityState, SimConfig } from '../types';
import { DEFAULT_BALANCE, mergeBalance, type BalanceConfig, type DeepPartial } from './balance';
import { collectConstructionIndices, tickConstruction, tryBuild } from './growth';
import { createInitialCity } from './init';
import { createRng } from './rng';
import {
  mergeNearbySettlements,
  refreshSettlementCenters,
} from './settlements';
import { growPopulation, recomputeStats, stageFromPopulation } from './stats';
import { spawnVehicles, updateVehicles, createTrainOnPath } from './vehicles';

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
 *
 * 状態はインプレース更新する（毎フレームの全タイル複製を避ける）。
 */
export function tickSimulation(
  state: CityState,
  dt: number,
  secondsPerDay: number,
  balance: BalanceConfig = DEFAULT_BALANCE,
): TickResult {
  const events: string[] = [];

  const cons = tickConstruction(state.tiles, state.constructionIndices);
  state.constructionIndices = cons.indices;
  if (cons.visualChanged) {
    state.visualRevision += 1;
  }

  updateVehicles(state.vehicles, dt, {
    tiles: state.tiles,
    width: state.width,
    height: state.height,
    seed: state.seed,
    day: state.stats.day,
  });

  state.buildCooldown -= dt;

  const bi = balance.buildInterval;
  const buildInterval = Math.max(bi.minSeconds, secondsPerDay * bi.dayFactor);
  if (state.buildCooldown <= 0) {
    const jitterRng = createRng((state.seed ^ (state.stats.day * 374761393) ^ 0x9e3779b9) >>> 0);
    state.buildCooldown = buildInterval * (bi.jitterMin + jitterRng() * bi.jitterRange);

    // 余剰予算があるほど1日に複数建設して街を広げる
    const bursts =
      state.stats.budget > 320 ? 4 : state.stats.budget > 180 ? 3 : state.stats.budget > 90 ? 2 : 1;

    let builtSomething = false;
    for (let b = 0; b < bursts; b++) {
      const result = tryBuild(
        state.tiles,
        state.width,
        state.height,
        state.stats,
        state.stage,
        state.seed,
        state.stats.day * 17 + b,
        balance,
        state.settlements,
      );
      if (!result.built || !result.kind) break;
      builtSomething = true;
      state.stats.budget -= result.cost;
      events.push(result.kind);
      if (result.trainPath && result.trainPath.length >= 2) {
        const trainRng = createRng(
          (state.seed ^ (state.stats.day * 2654435761) ^ (b * 0x85ebca6b)) >>> 0,
        );
        const train = createTrainOnPath(
          result.trainPath,
          state.nextVehicleId,
          trainRng,
        );
        if (train) {
          state.vehicles.push(train);
          state.nextVehicleId = train.id + 1;
        }
      }
      // 借金が深すぎたらその日は打ち切り
      if (state.stats.budget + balance.budget.debtLimit < 40) break;
    }

    if (builtSomething) {
      state.mapRevision += 1;
      state.visualRevision += 1;
      state.constructionIndices = collectConstructionIndices(state.tiles);
    }

    state.stats.day += 1;
    state.stats = recomputeStats(state.tiles, state.stats, balance);
    state.stats.population = growPopulation(state.stats, balance);
    state.stage = stageFromPopulation(state.stats.population, balance);

    // 集落の重心更新と合体判定（数日おきで十分）
    if (state.stats.day % 3 === 0) {
      refreshSettlementCenters(state.settlements, state.tiles, state.width, state.height);
      const merge = mergeNearbySettlements(
        state.settlements,
        state.tiles,
        state.width,
        state.height,
      );
      if (merge.merged) {
        events.push('merge');
      }
    }

    const spawned = spawnVehicles(
      state.tiles,
      state.width,
      state.height,
      state.vehicles,
      state.nextVehicleId,
      state.stats.population,
      state.seed,
      state.stats.day,
    );
    state.vehicles = spawned.vehicles;
    state.nextVehicleId = spawned.nextId;
  }

  return { state, events };
}
