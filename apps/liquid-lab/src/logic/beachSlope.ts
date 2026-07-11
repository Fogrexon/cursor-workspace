/** 砂浜斜面（シミュレーション座標 [0,1]^3） */

export type BeachSlopeParams = {
  enabled: boolean;
  /**
   * 斜面の傾き dy/dx。
   * 実砂浜は 0.01〜0.08 程度、見た目強調なら 0.1〜0.4。
   */
  slope: number;
  /**
   * 箱の幅に対して、深い側から何割を平坦床にし、残りを斜面にするか。
   * 0 = 全体が斜面、0.35 = 沖側 35% は平坦。
   */
  flatFraction: number;
};

export const DEFAULT_BEACH_SLOPE: BeachSlopeParams = {
  enabled: false,
  slope: 0.28,
  flatFraction: 0.28,
};

export const BEACH_SLOPE_PRESET: BeachSlopeParams = {
  enabled: true,
  slope: 0.08,
  flatFraction: 0.2,
};

export function clampBeachSlope(slope: number): number {
  return Math.min(0.7, Math.max(0.01, slope));
}

export function clampFlatFraction(fraction: number): number {
  return Math.min(0.7, Math.max(0, fraction));
}

/**
 * 斜面が始まる X（箱の minX から flatFraction * width 進んだ位置）。
 * パドル側（小さい X）が沖、大きい X が浜。
 */
export function beachStartX(minX: number, width: number, flatFraction: number): number {
  return minX + width * clampFlatFraction(flatFraction);
}

/** 位置 x における床高さ（平坦部は baseY、斜面部は線形に上昇） */
export function beachFloorY(
  x: number,
  minX: number,
  width: number,
  baseY: number,
  slope: number,
  flatFraction: number,
): number {
  const start = beachStartX(minX, width, flatFraction);
  if (x <= start) return baseY;
  return baseY + (x - start) * clampBeachSlope(slope);
}

/** 斜面の長さ（X 方向） */
export function beachRunLength(width: number, flatFraction: number): number {
  return width * (1 - clampFlatFraction(flatFraction));
}

/** 斜面の立ち上がり高さ */
export function beachRise(width: number, slope: number, flatFraction: number): number {
  return beachRunLength(width, flatFraction) * clampBeachSlope(slope);
}
