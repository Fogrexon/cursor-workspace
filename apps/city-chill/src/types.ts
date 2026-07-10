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
  | 'skyscraper';

/** 建物の発展段階 (見た目の高さ・密度に影響) */
export type BuildingTier = 1 | 2 | 3 | 4 | 5;

export interface Tile {
  kind: TileKind;
  /** 建物の高さ段階。道路・草地などは 0 */
  tier: number;
  /** 建設アニメ用: 0=完成, >0 は建設中フレーム */
  construction: number;
  /** 見た目のバリエーション */
  variant: number;
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
}

export interface Settlement {
  id: number;
  /** 表示用の町名（初期生成時に付与） */
  name: string;
  cx: number;
  cy: number;
  /** 影響半径（発展に応じて広がる） */
  radius: number;
}

export interface CityState {
  width: number;
  height: number;
  tiles: Tile[];
  stats: CityStats;
  vehicles: Vehicle[];
  stage: GrowthStage;
  /** 次に建設する候補のクールダウン */
  buildCooldown: number;
  nextVehicleId: number;
  seed: number;
  /** 複数の小さな町。道路でつながると合体する */
  settlements: Settlement[];
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
