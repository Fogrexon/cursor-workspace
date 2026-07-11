import type { ParticleBudget, PresetId } from '../types';
import {
  clampSimBounds,
  domainScale,
  toUnitSimBounds,
  type SimBounds,
  DEFAULT_SIM_BOUNDS,
} from './simBounds';

/** struct アラインメント: vec3+pad + vec3+pad + mat3 = 4+4+12 = 20 floats */
export const PARTICLE_STRUCT_FLOATS = 20;

export const GRID_SIZE = 64;
export const WORKGROUP_SIZE = 64;
export const MAX_PARTICLES = 8192 * 16; // 131072

export const PARTICLE_BUDGETS: ParticleBudget[] = [
  { id: 'small', label: 'Small (16k)', count: 8192 * 2 },
  { id: 'medium', label: 'Medium (32k)', count: 8192 * 4 },
  { id: 'large', label: 'Large (64k)', count: 8192 * 8 },
  { id: 'xlarge', label: 'Very Large (128k)', count: 8192 * 16 },
];

export const DEFAULT_PARTICLE_COUNT = PARTICLE_BUDGETS[1]!.count;

export function clampParticleCount(count: number): number {
  const stepped = Math.round(count / 4096) * 4096;
  return Math.min(MAX_PARTICLES, Math.max(4096, stepped));
}

export function listPresets(): { id: PresetId; label: string }[] {
  return [
    { id: 'dam-break', label: 'ダムブレイク' },
    { id: 'drop', label: 'ドロップ' },
    { id: 'cube', label: 'キューブ' },
  ];
}

function resolveWorldBounds(
  boundsOrWidth: SimBounds | number = DEFAULT_SIM_BOUNDS.width,
  depth?: number,
  height?: number,
): SimBounds {
  if (typeof boundsOrWidth === 'number') {
    return clampSimBounds({
      width: boundsOrWidth,
      depth: depth ?? boundsOrWidth,
      height: height ?? DEFAULT_SIM_BOUNDS.height,
    });
  }
  return clampSimBounds(boundsOrWidth);
}

/**
 * 単位立方体 [0,1]^3 内の初期位置を生成。
 * ワールド範囲は等方正規化してから配置する（床が広いほど液面は低い）。
 */
export function createInitialPositions(
  preset: PresetId,
  count: number,
  boundsOrWidth: SimBounds | number = DEFAULT_SIM_BOUNDS,
  fillRatio = 0.55,
): Float32Array {
  const n = clampParticleCount(count);
  const positions = new Float32Array(n * 3);
  const world = resolveWorldBounds(boundsOrWidth);
  const bounds = toUnitSimBounds(world);
  const { width, depth } = bounds;
  const fill = Math.min(0.75, Math.max(0.1, fillRatio));
  const maxWaterH = Math.min(0.85, bounds.height * 0.92);

  const baseVolume = Math.min(
    width * depth * maxWaterH,
    0.08 + (n / MAX_PARTICLES) * 0.9,
  );
  const volume = Math.min(width * depth * maxWaterH, baseVolume * (fill / 0.55));
  const waterHeight = Math.min(maxWaterH, volume / (width * depth));

  let originX = 0.5 - width / 2;
  let originY = Math.min(0.08, maxWaterH * 0.35);
  let originZ = 0.5 - depth / 2;
  let sizeX = width * 0.55;
  let sizeY = waterHeight;
  let sizeZ = depth;

  if (preset === 'dam-break') {
    originX = 0.5 - width / 2;
    sizeX = width * 0.42;
    sizeZ = depth;
  } else if (preset === 'drop') {
    sizeX = sizeZ = Math.min(Math.min(width, depth) * 0.7, Math.cbrt(volume));
    sizeY = Math.min(maxWaterH * 0.85, volume / (sizeX * sizeZ));
    originX = 0.5 - sizeX / 2;
    originY = Math.min(maxWaterH * 0.55, originY + bounds.height * 0.35);
    originZ = 0.5 - sizeZ / 2;
  } else {
    sizeX = sizeZ = Math.min(Math.min(width, depth) * 0.85, Math.cbrt(volume));
    sizeY = Math.min(maxWaterH, volume / (sizeX * sizeZ));
    originX = 0.5 - sizeX / 2;
    originZ = 0.5 - sizeZ / 2;
  }

  const nx = Math.max(1, Math.round(Math.cbrt((n * sizeX) / (sizeY * sizeZ))));
  const nz = Math.max(1, Math.round(Math.cbrt((n * sizeZ) / (sizeX * sizeY))));
  const ny = Math.max(1, Math.ceil(n / (nx * nz)));
  const sx = sizeX / nx;
  const sy = sizeY / ny;
  const sz = sizeZ / nz;

  let i = 0;
  for (let iy = 0; iy < ny && i < n; iy++) {
    for (let ix = 0; ix < nx && i < n; ix++) {
      for (let iz = 0; iz < nz && i < n; iz++) {
        const o = i * 3;
        positions[o] = originX + (ix + 0.5) * sx;
        positions[o + 1] = originY + (iy + 0.5) * sy;
        positions[o + 2] = originZ + (iz + 0.5) * sz;
        i++;
      }
    }
  }
  while (i < n) {
    const o = i * 3;
    positions[o] = originX + Math.random() * sizeX;
    positions[o + 1] = originY + Math.random() * sizeY;
    positions[o + 2] = originZ + Math.random() * sizeZ;
    i++;
  }

  return positions;
}

/** 沈静後の予想液深（ワールド単位） */
export function estimateSettledDepth(
  count: number,
  boundsOrWidth: SimBounds | number = DEFAULT_SIM_BOUNDS,
  fillRatio = 0.55,
): number {
  const n = clampParticleCount(count);
  const world = resolveWorldBounds(boundsOrWidth);
  const bounds = toUnitSimBounds(world);
  const { width, depth } = bounds;
  const fill = Math.min(0.75, Math.max(0.1, fillRatio));
  const maxWaterH = Math.min(0.85, bounds.height * 0.92);
  const area = width * depth;
  const baseVolume = Math.min(area * maxWaterH, 0.08 + (n / MAX_PARTICLES) * 0.9);
  const volume = Math.min(area * maxWaterH, baseVolume * (fill / 0.55));
  const unitDepth = volume / area;
  return unitDepth * domainScale(world);
}
