import type { CityStats, GrowthStage, Tile } from '../types';
import { DEFAULT_BALANCE, type BalanceConfig } from './balance';
import { BUILDING_KINDS, countKind } from './grid';

/** タイルから統計を再計算する */
export function recomputeStats(
  tiles: Tile[],
  prev: CityStats,
  balance: BalanceConfig = DEFAULT_BALANCE,
): CityStats {
  const t = balance.tiles;
  const h = balance.happiness;
  const b = balance.budget;

  let housing = 0;
  let jobs = 0;
  let transport = 0;
  let education = 0;
  let industry = 0;
  let commerce = 0;
  let parks = 0;
  let hospitals = 0;

  for (const tile of tiles) {
    const tier = Math.max(1, tile.tier);
    switch (tile.kind) {
      case 'residential':
        housing += t.residentialHousing * tier;
        break;
      case 'tower':
        housing += t.towerHousing * tier;
        jobs += t.towerJobs * tier;
        break;
      case 'skyscraper':
        housing += t.skyscraperHousing * tier;
        jobs += t.skyscraperJobs * tier;
        commerce += t.skyscraperCommerce * tier;
        break;
      case 'commercial':
        jobs += t.commercialJobs * tier;
        commerce += t.commercialCommerce * tier;
        break;
      case 'industrial':
        jobs += t.industrialJobs * tier;
        industry += t.industrialIndustry * tier;
        break;
      case 'road':
        transport += t.roadTransport;
        break;
      case 'bridge':
        transport += balance.development.bridgeTransport;
        break;
      case 'rail':
        transport += t.railTransport;
        break;
      case 'crossing':
        transport += t.crossingTransport;
        break;
      case 'station':
        transport += t.stationTransport;
        jobs += t.stationJobs;
        break;
      case 'school':
        education += t.schoolEducation * tier;
        jobs += t.schoolJobs;
        break;
      case 'hospital':
        hospitals += 1;
        jobs += t.hospitalJobs;
        break;
      case 'park':
        parks += t.parkParks;
        break;
      case 'plaza':
        parks += t.plazaParks;
        commerce += t.plazaCommerce;
        break;
      default:
        break;
    }
  }

  education = Math.min(100, education);
  // 人口はキャパに向かって緩やかに追従 (呼び出し側で日次更新)
  const population = prev.population;

  const transportNeed = Math.max(1, population / h.transportNeedDivisor);
  const transportRatio = Math.min(h.transportRatioCap, transport / transportNeed);
  const jobRatio = jobs / Math.max(1, population * h.jobNeedFactor);
  const housingRatio = housing / Math.max(1, population);

  let happiness = h.base;
  happiness += Math.min(h.parksCap, parks * h.parksPer);
  happiness += Math.min(h.educationCap, education * h.educationFactor);
  happiness += Math.min(h.transportBonusCap, (transportRatio - h.transportBonusBase) * h.transportBonusScale);
  happiness += Math.min(h.jobBonusCap, (jobRatio - h.jobBonusBase) * h.jobBonusScale);
  happiness += Math.min(h.housingBonusCap, (housingRatio - h.housingBonusBase) * h.housingBonusScale);
  happiness += hospitals * h.hospitalBonus;
  happiness -= Math.max(0, (1 - transportRatio) * h.transportPenaltyScale);
  happiness -= Math.max(0, (h.jobPenaltyBase - jobRatio) * h.jobPenaltyScale);
  happiness = Math.max(h.min, Math.min(h.max, happiness));

  // 予算: 商業・産業・人口から収入、維持費を差し引き（緩やかに黒字寄り）
  const income =
    commerce * b.commerceIncome +
    industry * b.industryIncome +
    population * b.populationIncome +
    b.baseIncome;
  const upkeep =
    countKind(tiles, 'road') * b.roadUpkeep +
    countKind(tiles, 'rail') * b.railUpkeep +
    countKind(tiles, 'bridge') * balance.development.bridgeUpkeep +
    countKind(tiles, 'crossing') * b.roadUpkeep * 0.5 +
    [...BUILDING_KINDS].reduce((s, k) => s + countKind(tiles, k) * b.buildingUpkeep, 0);
  const budgetDelta = income - upkeep;

  return {
    population,
    housing,
    jobs,
    transport,
    education,
    happiness,
    budget: prev.budget + budgetDelta,
    industry,
    commerce,
    day: prev.day,
  };
}

/** 人口を 1 日分更新 */
export function growPopulation(
  stats: CityStats,
  balance: BalanceConfig = DEFAULT_BALANCE,
): number {
  const p = balance.population;
  const housingRoom = stats.housing - stats.population;
  const jobRoom = stats.jobs * p.jobRoomJobsMult - stats.population * p.jobRoomPopMult;
  const happinessFactor = p.happinessFactorBase + stats.happiness / p.happinessDivisor;
  const transportFactor = Math.min(
    p.transportFactorCap,
    p.transportFactorBase +
      stats.transport / Math.max(p.transportMinDenom, stats.population / p.transportPopDivisor),
  );

  let growth = 0;
  if (housingRoom > 0 && jobRoom > -stats.population * p.jobRoomThreshold) {
    growth = Math.min(
      housingRoom * p.housingRoomFactor,
      p.baseGrowth + stats.population * p.popGrowthRate * happinessFactor * transportFactor,
    );
  } else if (housingRoom < p.overcrowdingThreshold) {
    growth = -Math.min(p.overcrowdingLossCap, Math.abs(housingRoom) * p.overcrowdingLossRate);
  } else if (stats.happiness < p.lowHappinessThreshold) {
    growth = -p.lowHappinessLoss;
  }

  return Math.max(0, stats.population + growth);
}

export function stageFromPopulation(
  population: number,
  balance: BalanceConfig = DEFAULT_BALANCE,
): GrowthStage {
  if (population < balance.stages.town) return 'village';
  if (population < balance.stages.city) return 'town';
  if (population < balance.stages.metropolis) return 'city';
  return 'metropolis';
}

export function stageLabel(stage: GrowthStage): string {
  switch (stage) {
    case 'village':
      return '小さな村';
    case 'town':
      return '町';
    case 'city':
      return '都市';
    case 'metropolis':
      return '大都会';
  }
}

/** 次に何を建てるべきか優先度スコア */
export interface BuildNeed {
  residential: number;
  commercial: number;
  industrial: number;
  road: number;
  rail: number;
  school: number;
  park: number;
  hospital: number;
  tower: number;
  station: number;
  skyscraper: number;
}

export function computeBuildNeeds(
  stats: CityStats,
  stage: GrowthStage,
  balance: BalanceConfig = DEFAULT_BALANCE,
): BuildNeed {
  const h = balance.happiness;
  const pop = Math.max(1, stats.population);
  const housingGap = (stats.housing - pop) / pop;
  const jobGap = (stats.jobs - pop * h.jobNeedFactor) / pop;
  const transportGap = stats.transport / Math.max(1, pop / h.transportNeedDivisor) - 1;
  const eduGap = 40 - stats.education;
  const happyGap = 60 - stats.happiness;

  const need: BuildNeed = {
    residential: housingGap < 0.15 ? 1.2 - housingGap : 0.1,
    commercial: jobGap < 0.1 ? 1.0 - jobGap : 0.15,
    industrial: jobGap < 0 && stage !== 'village' ? 0.9 - jobGap : 0.1,
    road: transportGap < 0.2 ? 1.3 - transportGap : 0.2,
    rail: stage === 'city' || stage === 'metropolis' ? (transportGap < 0.4 ? 0.9 : 0.3) : 0.05,
    school: eduGap > 0 ? eduGap / 40 : 0.05,
    park: happyGap > 0 ? happyGap / 50 : 0.1,
    hospital: stage !== 'village' && stats.happiness < 55 ? 0.6 : 0.05,
    tower: stage === 'city' || stage === 'metropolis' ? (housingGap < 0.2 ? 0.8 : 0.2) : 0,
    station: stage === 'city' || stage === 'metropolis' ? (transportGap < 0.3 ? 0.7 : 0.15) : 0,
    skyscraper: stage === 'metropolis' && housingGap < 0.25 ? 0.7 : 0,
  };

  // 借金枠を超えて深く赤字なら大型建設を抑制
  const spendRoom = stats.budget + balance.budget.debtLimit;
  if (spendRoom < 80) {
    need.tower *= 0.1;
    need.rail *= 0.25;
    need.station *= 0.2;
    need.skyscraper = 0;
  } else if (stats.budget < 0) {
    // 借金中でも鉄道・駅は投資として残す（少し抑制）
    need.tower *= 0.5;
    need.skyscraper *= 0.3;
  }

  return need;
}

/** 後方互換: DEFAULT_BALANCE の建設コスト */
export const BUILD_COSTS: Record<string, number> = { ...DEFAULT_BALANCE.buildCosts };
