/** WebGPU atomicAdd 用の固定小数点スケール */
export const FIXED_POINT_MULTIPLIER = 1e7;

export function encodeFixedPoint(value: number, multiplier = FIXED_POINT_MULTIPLIER): number {
  return Math.trunc(value * multiplier);
}

export function decodeFixedPoint(value: number, multiplier = FIXED_POINT_MULTIPLIER): number {
  return value / multiplier;
}

export function cellIndex(x: number, y: number, z: number, gridSize: number): number {
  return x * gridSize * gridSize + y * gridSize + z;
}

export function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.trunc(value)));
}
