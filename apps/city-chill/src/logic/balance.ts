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
    housingRoomFactor: 0.18,
    baseGrowth: 3,
    popGrowthRate: 0.055,
    happinessFactorBase: 0.4,
    happinessDivisor: 200,
    transportFactorBase: 0.5,
    transportFactorCap: 1.2,
    transportPopDivisor: 8,
    transportMinDenom: 20,
    jobRoomJobsMult: 1.2,
    jobRoomPopMult: 0.5,
    jobRoomThreshold: 0.2,
    overcrowdingThreshold: -5,
    overcrowdingLossCap: 3,
    overcrowdingLossRate: 0.05,
    lowHappinessThreshold: 30,
    lowHappinessLoss: 1.5,
    initial: 12,
  },
  budget: {
    /** 収入は成長に比例するが、維持費・開発コストで序盤〜中盤は締まる */
    commerceIncome: 1.8,
    industryIncome: 1.4,
    populationIncome: 0.2,
    baseIncome: 5,
    roadUpkeep: 0.35,
    railUpkeep: 0.75,
    buildingUpkeep: 0.5,
    initial: 280,
    /** インフラ投資のための適度な借金を許容 */
    debtLimit: 450,
  },
  buildCosts: {
    residential: 28,
    commercial: 38,
    industrial: 48,
    road: 14,
    rail: 50,
    crossing: 40,
    school: 80,
    park: 20,
    hospital: 100,
    tower: 200,
    station: 150,
    plaza: 30,
    skyscraper: 400,
    upgradeBase: 22,
    fallback: 30,
  },
  development: {
    /** 森伐採: 草地より高く、拡張は草地優先になる */
    forestClearCost: 28,
    /** 架橋: 迂回できるなら避け、水路しか無いときだけ */
    bridgeCost: 80,
    bridgeUpkeep: 1.5,
    bridgeTransport: 6,
  },
  terrain: {
    waterThreshold: 0.63,
    forestThreshold: 0.54,
    /** 256 マップでも湖・森が塊として見えるスケール */
    scale: 0.035,
  },
  stages: {
    town: 35,
    city: 140,
    metropolis: 450,
  },
  buildInterval: {
    dayFactor: 0.85,
    minSeconds: 0.7,
    jitterMin: 0.75,
    jitterRange: 0.5,
  },
  tiles: {
    residentialHousing: 8,
    towerHousing: 40,
    towerJobs: 5,
    skyscraperHousing: 80,
    skyscraperJobs: 30,
    skyscraperCommerce: 20,
    commercialJobs: 12,
    commercialCommerce: 10,
    industrialJobs: 18,
    industrialIndustry: 15,
    roadTransport: 4,
    railTransport: 10,
    crossingTransport: 14,
    stationTransport: 25,
    stationJobs: 8,
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
