/** シミュレーション領域（UI はメートル、内部 MLS-MPM は単位立方体へ正規化） */

export type SimBounds = {
  /** X 方向の幅 (m) */
  width: number;
  /** Z 方向の奥行き (m) */
  depth: number;
  /** Y 方向の高さ（床からの有効高さ・m） */
  height: number;
};

/**
 * UI のメートル範囲（数十 m 規模）。
 * MLS-MPM は常に [0,1]^3 で回すため、大きい範囲は domainScale で正規化する。
 */
export const BOUND_AXIS_MIN = 5;
export const BOUND_AXIS_MAX = 100;
export const BOUND_HEIGHT_MIN = 1;
export const BOUND_HEIGHT_MAX = 30;

/** 内部シミュレーション立方体の一辺（正規化後） */
export const UNIT_DOMAIN_MIN = 0.15;
export const UNIT_DOMAIN_MAX = 1;

/** 既定: 20 m 四方の浅い水槽 */
export const DEFAULT_SIM_BOUNDS: SimBounds = {
  width: 20,
  depth: 20,
  height: 8,
};

export function clampBoundAxis(
  v: number,
  min = BOUND_AXIS_MIN,
  max = BOUND_AXIS_MAX,
): number {
  return Math.min(max, Math.max(min, v));
}

export function clampSimBounds(bounds: SimBounds): SimBounds {
  return {
    width: clampBoundAxis(bounds.width),
    depth: clampBoundAxis(bounds.depth),
    height: clampBoundAxis(bounds.height, BOUND_HEIGHT_MIN, BOUND_HEIGHT_MAX),
  };
}

/**
 * ワールド範囲を単位立方体に収める等方スケール (m)。
 * max(幅, 奥行き, 高さ)。これでセルは立方体のまま。
 */
export function domainScale(bounds: Pick<SimBounds, 'width' | 'depth' | 'height'>): number {
  const b = clampSimBounds(bounds as SimBounds);
  return Math.max(b.width, b.depth, b.height, 1e-6);
}

/**
 * ワールド範囲 (m) → 単位立方体内の直方体。
 * 幅=60 m は幅=20 m の 3 倍ドメイン（カメラ・描画スケールで表現）。
 */
export function toUnitSimBounds(bounds: SimBounds): SimBounds {
  const b = clampSimBounds(bounds);
  const s = domainScale(b);
  return {
    width: b.width / s,
    depth: b.depth / s,
    height: b.height / s,
  };
}

/** 床面積 (m²) */
export function floorArea(bounds: SimBounds): number {
  const b = clampSimBounds(bounds);
  return b.width * b.depth;
}

/** UI 表示用: 幅×奥行き×高さ (m) */
export function formatBounds(bounds: SimBounds): string {
  const b = clampSimBounds(bounds);
  return `${b.width.toFixed(0)}×${b.depth.toFixed(0)}×${b.height.toFixed(0)} m`;
}

/**
 * ワールド空間での箱の中心。
 * simRoot は原点周りに domainScale 倍され、箱は単位空間で Y=[-0.5, -0.5+h]。
 */
export function boxCenterWorld(bounds: SimBounds): { x: number; y: number; z: number } {
  const unit = toUnitSimBounds(bounds);
  const s = domainScale(bounds);
  return {
    x: 0,
    y: (-0.5 + unit.height * 0.5) * s,
    z: 0,
  };
}
