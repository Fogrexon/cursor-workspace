import type { QualityId, QualityPreset, WaveParams } from '../types';

export const QUALITY_PRESETS: readonly QualityPreset[] = [
  {
    id: 'low',
    label: '軽量 (1,000)',
    params: {
      particleCount: 1000,
      gravity: 3.5,
      pressure: 12.0,
      viscosity: 0.12,
      bounce: 0.05,
      friction: 0.05,
    },
  },
  {
    id: 'medium',
    label: '標準 (2,000)',
    params: {
      particleCount: 2000,
      gravity: 3.5,
      pressure: 14.0,
      viscosity: 0.15,
      bounce: 0.05,
      friction: 0.06,
    },
  },
  {
    id: 'high',
    label: '多め (3,500)',
    params: {
      particleCount: 3500,
      gravity: 3.5,
      pressure: 16.0,
      viscosity: 0.16,
      bounce: 0.04,
      friction: 0.06,
    },
  },
] as const;

export function getPreset(id: QualityId): QualityPreset {
  return QUALITY_PRESETS.find((p) => p.id === id) ?? QUALITY_PRESETS[0];
}

export function mergeParams(
  base: WaveParams,
  patch: Partial<WaveParams>,
): WaveParams {
  return {
    particleCount: clampInt(patch.particleCount ?? base.particleCount, 64, 8000),
    gravity: clampNum(patch.gravity ?? base.gravity, 0.2, 10),
    pressure: clampNum(patch.pressure ?? base.pressure, 1, 40),
    viscosity: clampNum(patch.viscosity ?? base.viscosity, 0, 2),
    bounce: clampNum(patch.bounce ?? base.bounce, 0, 0.8),
    friction: clampNum(patch.friction ?? base.friction, 0, 1),
  };
}

function clampNum(v: number, min: number, max: number): number {
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, v));
}

function clampInt(v: number, min: number, max: number): number {
  return Math.round(clampNum(v, min, max));
}
