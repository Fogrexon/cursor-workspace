import { UNIT_DOMAIN_MIN, UNIT_DOMAIN_MAX } from './simBounds';

/** 波発生パドルの運動・寸法（単位立方体シミュレーション座標） */

export type WaveMakerParams = {
  enabled: boolean;
  /** Hz */
  frequency: number;
  /** 振幅（単位立方体座標の絶対値） */
  amplitude: number;
};

export const DEFAULT_WAVE_MAKER: WaveMakerParams = {
  enabled: true,
  frequency: 0.55,
  amplitude: 0.035,
};

export const WAVE_AMPLITUDE_MIN = 0.005;
export const WAVE_AMPLITUDE_MAX = 0.3;

export function clampWaveAmplitude(amplitude: number): number {
  return Math.min(WAVE_AMPLITUDE_MAX, Math.max(WAVE_AMPLITUDE_MIN, amplitude));
}

function clampUnitAxis(v: number): number {
  return Math.min(UNIT_DOMAIN_MAX, Math.max(UNIT_DOMAIN_MIN, v));
}

/**
 * パドルが箱の外に出ないよう、箱幅から許容振幅を求める。
 * rest は左壁付近なので、右方向への移動余地が上限。
 * @param boxWidth 単位立方体内の箱幅（≤ 1）
 */
export function maxWaveAmplitudeForBox(
  boxWidth: number,
  halfThickness = 0.018,
): number {
  const half = clampUnitAxis(boxWidth) * 0.5;
  const travel = Math.max(0.02, half - halfThickness - 0.04);
  return Math.min(WAVE_AMPLITUDE_MAX, travel);
}

/** 箱の左壁付近に置くパドルの静止 X（単位立方体） */
export function paddleRestX(boxWidth: number, halfThickness = 0.018): number {
  const half = clampUnitAxis(boxWidth) * 0.5;
  const wall = 0.5 - half + 2 / 64;
  return wall + halfThickness + 0.01;
}

export function paddleHalfZ(boxDepth: number): number {
  return clampUnitAxis(boxDepth) * 0.42;
}

/** x(t) = rest + amp * sin(2π f t) */
export function paddlePositionX(
  timeSec: number,
  restX: number,
  amplitude: number,
  frequency: number,
): number {
  return restX + amplitude * Math.sin(2 * Math.PI * frequency * timeSec);
}

/** dx/dt */
export function paddleVelocityX(
  timeSec: number,
  amplitude: number,
  frequency: number,
): number {
  return amplitude * 2 * Math.PI * frequency * Math.cos(2 * Math.PI * frequency * timeSec);
}
