/** タイル種別 */
export type TileKind =
  | 'empty'
  | 'grass'
  | 'forest'
  | 'water'
  | 'road'
  | 'rail'
  | 'crossing'
  | 'bridge'
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'park'
  | 'school'
  | 'hospital'
  | 'station'
  | 'plaza'
  | 'tower'
  | 'skyscraper'
  /** 2x2 などマルチタイル建物の占有マス（描画・統計はアンカーのみ） */
  | 'pad';

/** 建物の発展段階 (見た目の高さ・密度に影響) */
export type BuildingTier = 1 | 2 | 3 | 4 | 5;

/**
 * 道路・線路の主向き。
 * 並走する線路が直交接続に見えないよう、接続判定に使う。
 * - x: 東西
 * - z: 南北
 * - both: L/T/十字など分岐・交差
 * - none: 未設定（草地など）
 */
export type TileFacing = 'none' | 'x' | 'z' | 'both';

export interface Tile {
  kind: TileKind;
  /** 建物の高さ段階。道路・草地などは 0 */
  tier: number;
  /** 建設アニメ用: 0=完成, >0 は建設中フレーム */
  construction: number;
  /** 見た目のバリエーション */
  variant: number;
  /** 道路・線路の向き（並走と分岐の区別用） */
  facing: TileFacing;
  /**
   * フットプリント辺長。
   * - 通常建物・インフラ: 1
   * - 2x2 高層のアンカー: 2
   * - pad（占有マス）: 0
   */
  footprint: number;
  /**
   * pad のときアンカーの線形 index。それ以外は -1。
   */
  anchorIdx: number;
}

/** 都市の裏パラメーター */
export interface CityStats {
  /** 人口 */
  population: number;
  /** 住宅キャパ */
  housing: number;
  /** 雇用数 */
  jobs: number;
  /** 交通キャパ (道路・鉄道の充実度) */
  transport: number;
  /** 教育水準 0–100 */
  education: number;
  /** 幸福度 0–100 */
  happiness: number;
  /** 市の予算 */
  budget: number;
  /** 産業力 */
  industry: number;
  /** 商業力 */
  commerce: number;
  /** 経過日数 */
  day: number;
}

export type GrowthStage = 'village' | 'town' | 'city' | 'metropolis';

/**
 * マップ全体のネットワーク段階。全体人口から計算し、都市間鉄道・予算施策など
 * マップ横断の判断にのみ使う。個々の街の都会度には SettlementLevel を使うこと。
 */
export type NetworkPhase = GrowthStage;

/**
 * 個々の街（settlement）の都会度。
 * 街の周辺建物密度から計算し、地価・超高層・塔の建設可否判定に使う。
 * グローバルの NetworkPhase とは独立して管理する。
 */
export type SettlementLevel = 'hamlet' | 'village' | 'town' | 'city' | 'metropolis';

export type VehicleKind = 'car' | 'bus' | 'truck' | 'train';

export interface PathPose {
  x: number;
  y: number;
  dir: number;
}

export interface Vehicle {
  id: number;
  kind: VehicleKind;
  /** 先頭（機関車）のグリッド座標 */
  x: number;
  y: number;
  /** 先頭の進行方向 (ラジアン、+x=0 / +y=π/2) */
  dir: number;
  /** タイル/秒 */
  speed: number;
  /** 経路上の弧長位置 (先頭、タイル単位) */
  progress: number;
  /** 現在の目的地までの経路 (グリッド座標列) */
  path: Array<{ x: number; y: number }>;
  /** 目的地 (車: 道路マス / 電車: 駅) */
  destination: { x: number; y: number };
  /** 色バリエーション */
  color: number;
  /** 列車の車両数 (train のみ) */
  cars?: number;
  /** 各車両の姿勢 (train のみ、描画用に毎 tick 更新) */
  carPoses?: PathPose[];
  /** 目的地到着後の待機残り秒 (駅停車など) */
  wait?: number;
  /** 電車の駅巡回方向 (+1 / -1)。端で折り返す */
  railDir?: 1 | -1;
  /** 経路の累積弧長キャッシュ（path 変更時に再計算） */
  pathLens?: number[];
}

export interface Settlement {
  id: number;
  /** 表示用の町名（初期生成時に付与） */
  name: string;
  cx: number;
  cy: number;
  /** 影響半径（発展に応じて広がる） */
  radius: number;
  /**
   * 街の都会度。周辺の建物密度から計算。
   * 地価・超高層・塔の建設可否判定に使う（グローバル stage とは独立）。
   */
  level: SettlementLevel;
}

export interface CityState {
  width: number;
  height: number;
  tiles: Tile[];
  stats: CityStats;
  vehicles: Vehicle[];
  /**
   * マップ全体のネットワーク段階（全体人口から計算）。
   * 都市間鉄道・予算施策などマップ横断の判断にのみ使う。
   * 個々の街の都会度は settlements[i].level を参照すること。
   */
  stage: GrowthStage;
  /** 次に建設する候補のクールダウン */
  buildCooldown: number;
  nextVehicleId: number;
  seed: number;
  /** 複数の小さな町。道路でつながると合体する */
  settlements: Settlement[];
  /**
   * タイルの kind/tier/facing など構造が変わったときに増える。
   * UI の差分同期用（毎フレーム全走査を避ける）。
   */
  mapRevision: number;
  /**
   * 建設アニメなど見た目バケットが変わったときに増える。
   */
  visualRevision: number;
  /** 建設中タイルの線形 index（tickConstruction の走査範囲を絞る） */
  constructionIndices: number[];
}

export interface SimConfig {
  /** 1 日あたりの実秒 */
  secondsPerDay: number;
  /** マップ幅 */
  width: number;
  /** マップ高さ */
  height: number;
  seed: number;
}
