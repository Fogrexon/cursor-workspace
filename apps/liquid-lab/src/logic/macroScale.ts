/**
 * 粒子数を増やさずに浅い・広い海域っぽく見せるためのマクロパラメータ。
 * 広さはシミュレーション範囲（幅・奥行き・高さ）で直接指定する。
 */

import { DEFAULT_SIM_BOUNDS, type SimBounds } from './simBounds';

export type MacroScaleParams = {
  /** シミュレーション速度。1=通常 */
  timeScale: number;
  /** 箱の床面積に対する水量の割合。小さいほど浅い（砂浜向き） */
  fillRatio: number;
  /** SSFR 用スプラット半径倍率 */
  splatScale: number;
};

export const DEFAULT_MACRO_SCALE: MacroScaleParams = {
  timeScale: 1,
  fillRatio: 0.55,
  splatScale: 1,
};

/** 広い浅い砂浜セット（粒子数は変えない・実スケールノブなし） */
export const BEACH_MACRO_PRESET: MacroScaleParams & {
  boxWidth: number;
  boxDepth: number;
  boxHeight: number;
  gravity: number;
  viscosity: number;
  stiffness: number;
  waveEnabled: boolean;
  waveFrequency: number;
  waveAmplitude: number;
} = {
  timeScale: 0.45,
  fillRatio: 0.18,
  splatScale: 1,
  boxWidth: 60,
  boxDepth: 35,
  boxHeight: 8,
  gravity: 100,
  viscosity: 0.26,
  stiffness: 20,
  waveEnabled: true,
  waveFrequency: 0.35,
  waveAmplitude: 0.06,
};

export function clampTimeScale(v: number): number {
  return Math.min(1.5, Math.max(0.15, v));
}

export function clampFillRatio(v: number): number {
  return Math.min(0.75, Math.max(0.1, v));
}

export function clampSplatScale(v: number): number {
  return Math.min(2.8, Math.max(0.6, v));
}

/** 描画スプラット半径 */
export function splatRadius(baseRadius: number, splatScale: number): number {
  return baseRadius * clampSplatScale(splatScale);
}

/**
 * カメラ距離倍率。床の対角がデフォルトより広いほど後退する。
 * ワールド範囲から直接算出（別ノブなし）。
 */
export function cameraDistanceFactor(bounds: Pick<SimBounds, 'width' | 'depth'>): number {
  const ref = Math.hypot(DEFAULT_SIM_BOUNDS.width, DEFAULT_SIM_BOUNDS.depth);
  const span = Math.hypot(bounds.width, bounds.depth);
  return Math.max(1, span / Math.max(1e-6, ref));
}

/** OrbitControls で全体を収めるための最大引き距離 */
export function cameraMaxDistance(bounds: Pick<SimBounds, 'width' | 'depth' | 'height'>): number {
  const floorDiag = Math.hypot(bounds.width, bounds.depth);
  const size = Math.max(floorDiag, bounds.height);
  return Math.max(40, size * 2.8);
}

/** 遠クリップ面 */
export function cameraFarPlane(bounds: Pick<SimBounds, 'width' | 'depth' | 'height'>): number {
  return Math.max(120, cameraMaxDistance(bounds) * 3);
}

/** 箱全体が視野に入るおおよそのカメラ距離 */
export function cameraFrameDistance(
  bounds: Pick<SimBounds, 'width' | 'depth' | 'height'>,
  fovDeg = 45,
): number {
  const size = Math.max(bounds.width, bounds.depth, bounds.height);
  const half = size * 0.5;
  const fov = (fovDeg * Math.PI) / 180;
  const fit = half / Math.tan(fov * 0.5);
  const maxDist = cameraMaxDistance(bounds);
  return Math.min(maxDist * 0.92, Math.max(2, fit * 1.35));
}
