import type { GrowthStage } from '../types';
import {
  mergeBalance,
  type BalanceConfig,
  type DeepPartial,
} from './balance';
import { BUILDING_KINDS, countKind } from './grid';
import { createSimulation, tickSimulation } from './simulation';

export interface HeadlessOptions {
  days?: number;
  seed?: number;
  width?: number;
  height?: number;
  secondsPerDay?: number;
  balance?: DeepPartial<BalanceConfig>;
  sampleEvery?: number;
}

export interface DaySnapshot {
  day: number;
  stage: GrowthStage;
  population: number;
  housing: number;
  jobs: number;
  transport: number;
  education: number;
  happiness: number;
  budget: number;
  industry: number;
  commerce: number;
  roads: number;
  rails: number;
  bridges: number;
  forests: number;
  waters: number;
  buildings: number;
  vehicles: number;
  events: string[];
}

export interface HeadlessReport {
  options: Required<Omit<HeadlessOptions, 'balance'>> & {
    balance: BalanceConfig;
  };
  final: DaySnapshot;
  samples: DaySnapshot[];
  stageTransitions: Array<{ day: number; from: GrowthStage; to: GrowthStage }>;
  summary: {
    reachedTownDay: number | null;
    reachedCityDay: number | null;
    reachedMetropolisDay: number | null;
    minHappiness: number;
    maxHappiness: number;
    minBudget: number;
    bankrupt: boolean;
    avgPopulationGrowth: number;
  };
}

function snapshot(
  state: ReturnType<typeof createSimulation>,
  events: string[],
): DaySnapshot {
  const buildings = [...BUILDING_KINDS].reduce((s, k) => s + countKind(state.tiles, k), 0);
  return {
    day: state.stats.day,
    stage: state.stage,
    population: state.stats.population,
    housing: state.stats.housing,
    jobs: state.stats.jobs,
    transport: state.stats.transport,
    education: state.stats.education,
    happiness: state.stats.happiness,
    budget: state.stats.budget,
    industry: state.stats.industry,
    commerce: state.stats.commerce,
    roads: countKind(state.tiles, 'road'),
    rails: countKind(state.tiles, 'rail'),
    bridges: countKind(state.tiles, 'bridge'),
    forests: countKind(state.tiles, 'forest'),
    waters: countKind(state.tiles, 'water'),
    buildings,
    vehicles: state.vehicles.length,
    events: [...events],
  };
}

/** GUI なしで都市シミュレーションを高速実行する */
export function runHeadless(options: HeadlessOptions = {}): HeadlessReport {
  const days = options.days ?? 500;
  const seed = options.seed ?? 42;
  const width = options.width ?? 28;
  const height = options.height ?? 28;
  const secondsPerDay = options.secondsPerDay ?? 0.4;
  const sampleEvery = options.sampleEvery ?? Math.max(1, Math.floor(days / 20));
  const balance = mergeBalance(options.balance);

  let state = createSimulation(
    { seed, width, height, secondsPerDay },
    balance,
  );

  const samples: DaySnapshot[] = [];
  const stageTransitions: Array<{ day: number; from: GrowthStage; to: GrowthStage }> = [];
  let dayEvents: string[] = [];
  let prevStage = state.stage;
  let minHappiness = state.stats.happiness;
  let maxHappiness = state.stats.happiness;
  let minBudget = state.stats.budget;
  let bankrupt = false;
  const startPop = state.stats.population;
  let lastDay = 0;

  samples.push(snapshot(state, []));

  // 1 日 = secondsPerDay 秒。buildCooldown が日次更新のトリガ
  const dt = secondsPerDay;
  const maxTicks = days * 4; // 余裕を持たせる
  let ticks = 0;

  while (state.stats.day < days && ticks < maxTicks) {
    ticks += 1;
    const prevDay = state.stats.day;
    const result = tickSimulation(state, dt, secondsPerDay, balance);
    state = result.state;

    if (result.events.length > 0) {
      dayEvents.push(...result.events);
    }

    if (state.stats.day > prevDay) {
      lastDay = state.stats.day;
      minHappiness = Math.min(minHappiness, state.stats.happiness);
      maxHappiness = Math.max(maxHappiness, state.stats.happiness);
      minBudget = Math.min(minBudget, state.stats.budget);
      if (state.stats.budget < -balance.budget.debtLimit) bankrupt = true;

      if (state.stage !== prevStage) {
        stageTransitions.push({
          day: state.stats.day,
          from: prevStage,
          to: state.stage,
        });
        prevStage = state.stage;
      }

      if (state.stats.day % sampleEvery === 0 || state.stats.day >= days) {
        samples.push(snapshot(state, dayEvents));
        dayEvents = [];
      } else {
        dayEvents = [];
      }
    }
  }

  const final = snapshot(state, dayEvents);
  if (samples.length === 0 || samples[samples.length - 1]!.day !== final.day) {
    samples.push(final);
  }

  const findStageDay = (stage: GrowthStage): number | null => {
    const t = stageTransitions.find((x) => x.to === stage);
    return t ? t.day : null;
  };

  const elapsedDays = Math.max(1, lastDay);
  const avgPopulationGrowth = (state.stats.population - startPop) / elapsedDays;

  return {
    options: {
      days,
      seed,
      width,
      height,
      secondsPerDay,
      sampleEvery,
      balance,
    },
    final,
    samples,
    stageTransitions,
    summary: {
      reachedTownDay: findStageDay('town'),
      reachedCityDay: findStageDay('city'),
      reachedMetropolisDay: findStageDay('metropolis'),
      minHappiness,
      maxHappiness,
      minBudget,
      bankrupt,
      avgPopulationGrowth,
    },
  };
}
