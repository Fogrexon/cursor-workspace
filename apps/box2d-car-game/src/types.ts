export interface Point {
  x: number;
  y: number;
}

export interface TerrainOptions {
  /** 地形を決定づけるシード値 */
  seed: number;
  /** 生成する区間の数(点の数は +1) */
  segmentCount: number;
  /** 点どうしの水平間隔 (m) */
  segmentWidth: number;
  /** 先頭に置く平坦なスタート区間の数 */
  flatSegments: number;
  /** 丘の最大振幅 (m) */
  amplitude: number;
  /** 起伏の細かさ 0..1 */
  roughness: number;
}

export interface Coin {
  x: number;
  y: number;
  taken: boolean;
}

export interface ScoreInput {
  /** スタートからの到達距離 (m) */
  distance: number;
  /** 取得したコイン数 */
  coins: number;
}

/** アクセル/ブレーキの入力状態 */
export interface DriveInput {
  throttle: boolean;
  brake: boolean;
}
