/** ネストしたオブジェクトの部分上書き用 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown>
    ? DeepPartial<T[K]>
    : T[K];
};

/** バランス調整用の全定数 */
export interface BalanceConfig {
  /** 人口成長 */
  population: {
    /** housingRoom に掛ける成長上限係数 */
    housingRoomFactor: number;
    /** 基本成長量 */
    baseGrowth: number;
    /** 人口比例の成長率 */
    popGrowthRate: number;
    /** 幸福度ファクターの底上げ */
    happinessFactorBase: number;
    /** 幸福度を割る値 (happiness / N) */
    happinessDivisor: number;
    /** 交通ファクターの底上げ */
    transportFactorBase: number;
    /** 交通ファクター上限 */
    transportFactorCap: number;
    /** 交通ファクター計算の人口除数 */
    transportPopDivisor: number;
    /** 交通ファクター分母の下限 */
    transportMinDenom: number;
    /** jobRoom = jobs * この値 */
    jobRoomJobsMult: number;
    /** jobRoom から引く population * この値 */
    jobRoomPopMult: number;
    /** 成長許可の jobRoom 下限 (population * この値の負) */
    jobRoomThreshold: number;
    /** 過密判定の housingRoom 閾値 */
    overcrowdingThreshold: number;
    /** 過密時の減少上限 */
    overcrowdingLossCap: number;
    /** 過密時の減少率 */
    overcrowdingLossRate: number;
    /** 低幸福度の閾値 */
    lowHappinessThreshold: number;
    /** 低幸福度時の減少量 */
    lowHappinessLoss: number;
    /** 初期人口 */
    initial: number;
  };
  /** 予算 */
  budget: {
    commerceIncome: number;
    industryIncome: number;
    populationIncome: number;
    baseIncome: number;
    roadUpkeep: number;
    railUpkeep: number;
    buildingUpkeep: number;
    initial: number;
    /**
     * 許容借金枠。建設は budget + debtLimit まで使える。
     * 日次収支で赤字が続くと枠内で借金状態になる。
     */
    debtLimit: number;
  };
  /** 建設コスト */
  buildCosts: {
    residential: number;
    commercial: number;
    industrial: number;
    road: number;
    rail: number;
    crossing: number;
    school: number;
    park: number;
    hospital: number;
    tower: number;
    station: number;
    plaza: number;
    skyscraper: number;
    /** アップグレード: base * (tier + 1) */
    upgradeBase: number;
    /** 未知アクションのフォールバック */
    fallback: number;
  };
  /**
   * 地形開発コスト（建設コストに加算）。
   * 収入だけでなく伐採・架橋が予算を圧迫する。
   */
  development: {
    /** 森を切り開いて建設する追加コスト */
    forestClearCost: number;
    /** 水上に道路/線路（橋）を置く追加コスト */
    bridgeCost: number;
    /** 橋の日次維持費 */
    bridgeUpkeep: number;
    /** 橋1マスの交通寄与 */
    bridgeTransport: number;
  };
  /** 初期地形ノイズパラメータ */
  terrain: {
    waterThreshold: number;
    forestThreshold: number;
    scale: number;
  };
  /** 段階の人口境界 (未満でその段階) */
  stages: {
    town: number;
    city: number;
    metropolis: number;
  };
  /** 建設間隔 */
  buildInterval: {
    /** secondsPerDay に掛ける係数 */
    dayFactor: number;
    /** 間隔の下限秒 */
    minSeconds: number;
    /** 揺らぎ下限 (乗数) */
    jitterMin: number;
    /** 揺らぎ幅 (乗数) */
    jitterRange: number;
  };
  /** タイル寄与 (tier 倍するものは perTier) */
  tiles: {
    residentialHousing: number;
    towerHousing: number;
    towerJobs: number;
    skyscraperHousing: number;
    skyscraperJobs: number;
    skyscraperCommerce: number;
    commercialJobs: number;
    commercialCommerce: number;
    industrialJobs: number;
    industrialIndustry: number;
    roadTransport: number;
    railTransport: number;
    crossingTransport: number;
    stationTransport: number;
    stationJobs: number;
    schoolEducation: number;
    schoolJobs: number;
    hospitalJobs: number;
    plazaParks: number;
    plazaCommerce: number;
    parkParks: number;
  };
  /** 幸福度・比率計算 */
  happiness: {
    base: number;
    parksCap: number;
    parksPer: number;
    educationCap: number;
    educationFactor: number;
    transportBonusCap: number;
    transportBonusBase: number;
    transportBonusScale: number;
    jobBonusCap: number;
    jobBonusBase: number;
    jobBonusScale: number;
    housingBonusCap: number;
    housingBonusBase: number;
    housingBonusScale: number;
    hospitalBonus: number;
    transportPenaltyScale: number;
    jobPenaltyBase: number;
    jobPenaltyScale: number;
    min: number;
    max: number;
    /** 交通需要 = population / この値 */
    transportNeedDivisor: number;
    transportRatioCap: number;
    /** 雇用需要 = population * この値 */
    jobNeedFactor: number;
  };
}

export const DEFAULT_BALANCE: BalanceConfig = {
  population: {
    housingRoomFactor: 0.24,
    baseGrowth: 4,
    popGrowthRate: 0.062,
    happinessFactorBase: 0.45,
    happinessDivisor: 180,
    transportFactorBase: 0.45,
    transportFactorCap: 1.25,
    transportPopDivisor: 8,
    transportMinDenom: 20,
    jobRoomJobsMult: 1.25,
    jobRoomPopMult: 0.45,
    jobRoomThreshold: 0.25,
    overcrowdingThreshold: -5,
    overcrowdingLossCap: 3,
    overcrowdingLossRate: 0.05,
    lowHappinessThreshold: 30,
    lowHappinessLoss: 1.5,
    initial: 12,
  },
  budget: {
    /** 収入は控えめ、維持費で余剰を食う */
    commerceIncome: 1.35,
    industryIncome: 1.1,
    populationIncome: 0.12,
    baseIncome: 4,
    roadUpkeep: 0.55,
    railUpkeep: 1.6,
    buildingUpkeep: 0.9,
    initial: 260,
    debtLimit: 500,
  },
  buildCosts: {
    residential: 22,
    commercial: 32,
    industrial: 42,
    road: 12,
    rail: 90,
    crossing: 70,
    school: 75,
    park: 18,
    hospital: 95,
    tower: 170,
    station: 240,
    plaza: 28,
    skyscraper: 340,
    upgradeBase: 20,
    fallback: 28,
  },
  development: {
    forestClearCost: 22,
    bridgeCost: 95,
    bridgeUpkeep: 2.2,
    bridgeTransport: 6,
  },
  terrain: {
    waterThreshold: 0.63,
    forestThreshold: 0.54,
    scale: 0.035,
  },
  stages: {
    /** 小さな村 → 町（商店・学校が出始める） */
    town: 60,
    /** 町 → 都市（中層・塔・鉄道） */
    city: 250,
    /** 都市 → 大都会（超高層が出始める） */
    metropolis: 900,
  },
  buildInterval: {
    dayFactor: 0.42,
    minSeconds: 0.32,
    jitterMin: 0.7,
    jitterRange: 0.45,
  },
  tiles: {
    residentialHousing: 8,
    towerHousing: 42,
    towerJobs: 6,
    skyscraperHousing: 90,
    skyscraperJobs: 35,
    skyscraperCommerce: 22,
    commercialJobs: 12,
    commercialCommerce: 10,
    industrialJobs: 18,
    industrialIndustry: 15,
    roadTransport: 4,
    railTransport: 10,
    crossingTransport: 14,
    stationTransport: 28,
    stationJobs: 10,
    schoolEducation: 18,
    schoolJobs: 6,
    hospitalJobs: 10,
    plazaParks: 2,
    plazaCommerce: 5,
    parkParks: 1,
  },
  happiness: {
    base: 45,
    parksCap: 20,
    parksPer: 3,
    educationCap: 15,
    educationFactor: 0.15,
    transportBonusCap: 15,
    transportBonusBase: 0.5,
    transportBonusScale: 20,
    jobBonusCap: 10,
    jobBonusBase: 0.7,
    jobBonusScale: 15,
    housingBonusCap: 8,
    housingBonusBase: 0.8,
    housingBonusScale: 10,
    hospitalBonus: 4,
    transportPenaltyScale: 25,
    jobPenaltyBase: 0.6,
    jobPenaltyScale: 30,
    min: 5,
    max: 100,
    transportNeedDivisor: 12,
    transportRatioCap: 1.5,
    jobNeedFactor: 0.55,
  },
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function deepMerge<T extends Record<string, unknown>>(base: T, partial?: DeepPartial<T>): T {
  if (!partial) return structuredClone(base);
  const out = structuredClone(base);
  for (const key of Object.keys(partial) as Array<keyof T>) {
    const pv = partial[key];
    if (pv === undefined) continue;
    const bv = out[key];
    if (isPlainObject(bv) && isPlainObject(pv)) {
      out[key] = deepMerge(bv as Record<string, unknown>, pv as DeepPartial<Record<string, unknown>>) as T[keyof T];
    } else {
      out[key] = pv as T[keyof T];
    }
  }
  return out;
}

/** partial を DEFAULT_BALANCE にマージして完全な設定を返す */
export function mergeBalance(partial?: DeepPartial<BalanceConfig>): BalanceConfig {
  return deepMerge(DEFAULT_BALANCE as unknown as Record<string, unknown>, partial as DeepPartial<Record<string, unknown>> | undefined) as unknown as BalanceConfig;
}
