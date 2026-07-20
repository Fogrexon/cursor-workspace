import * as THREE from 'three';
import type { CityState, Tile } from '../../types';
import {
  buildingHeight,
  createBuildingMesh,
  disposeBuildingMaterials,
  animateBuilding,
  isBatchableBuilding,
} from './buildings';
import { pickBuildingModelId, getModelDef } from '../../logic/buildingCatalog';
import {
  loadBuildingLibrary,
  type BuildingLibrary,
  type LoadedBuildingModel,
} from './buildingLibrary';
import { TILE } from './isoCamera';

const dummy = new THREE.Object3D();

interface PartLayer {
  mesh: THREE.InstancedMesh;
  count: number;
}

interface ModelBatch {
  model: LoadedBuildingModel;
  parts: PartLayer[];
}

/**
 * 事前 GLB モデルを InstancedMesh で描画する。
 * 建設中・公園などは従来どおり個別 Group。
 */
export interface BuildingBatchSystem {
  group: THREE.Group;
  sync(state: CityState, time: number): void;
  dispose(): void;
}

function isSpecialBuilding(tile: Tile): boolean {
  if (tile.kind === 'park' || tile.kind === 'plaza') return true;
  if (tile.construction <= 0) return false;
  switch (tile.kind) {
    case 'residential':
    case 'commercial':
    case 'industrial':
    case 'school':
    case 'hospital':
    case 'station':
    case 'tower':
    case 'skyscraper':
      return true;
    default:
      return false;
  }
}

export async function createBuildingBatchSystem(
  maxTiles: number,
): Promise<BuildingBatchSystem> {
  const capacity = Math.min(4096, Math.max(512, maxTiles));
  const group = new THREE.Group();
  group.name = 'building-batch';

  const library: BuildingLibrary = await loadBuildingLibrary();
  const batches = new Map<string, ModelBatch>();

  for (const [id, model] of library.models) {
    const parts: PartLayer[] = model.parts.map((part, i) => {
      const mesh = new THREE.InstancedMesh(part.geometry, part.material, capacity);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.count = 0;
      mesh.frustumCulled = false;
      mesh.name = `batch-${id}-${i}`;
      group.add(mesh);
      return { mesh, count: 0 };
    });
    batches.set(id, { model, parts });
  }

  const specialGroup = new THREE.Group();
  specialGroup.name = 'building-special';
  group.add(specialGroup);

  const specialMap = new Map<number, { key: string; mesh: THREE.Group }>();
  const animated = new Set<number>();

  let lastMapRevision = -1;
  let lastVisualRevision = -1;
  let lastW = 0;
  let lastH = 0;

  function resetBatches(): void {
    for (const batch of batches.values()) {
      for (const part of batch.parts) {
        part.count = 0;
        part.mesh.count = 0;
      }
    }
  }

  function placeBatch(tile: Tile, x: number, y: number): void {
    const modelId = pickBuildingModelId(tile);
    if (!modelId) return;
    const batch = batches.get(modelId);
    if (!batch) return;

    const def = getModelDef(modelId);
    const fp = Math.max(1, tile.footprint || 1);
    const targetH = buildingHeight(tile.kind, tile.tier, 0, fp);
    const baseH = def?.baseHeight ?? batch.model.baseHeight;
    const sy = baseH > 1e-6 ? targetH / baseH : 1;

    const ox = fp >= 2 ? 0.5 : 0;
    const oz = fp >= 2 ? 0.5 : 0;
    dummy.position.set((x + ox) * TILE, 0, (y + oz) * TILE);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(1, sy, 1);
    dummy.updateMatrix();

    for (const part of batch.parts) {
      if (part.count >= capacity) continue;
      part.mesh.setMatrixAt(part.count, dummy.matrix);
      part.count += 1;
    }
  }

  function removeSpecial(idx: number): void {
    const existing = specialMap.get(idx);
    if (!existing) return;
    specialGroup.remove(existing.mesh);
    existing.mesh.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.geometry.dispose();
    });
    specialMap.delete(idx);
    animated.delete(idx);
  }

  function upsertSpecial(idx: number, tile: Tile, x: number, y: number, time: number): void {
    const key = `${tile.kind}:${tile.tier}:${Math.ceil(tile.construction / 4)}:${tile.variant}:${tile.footprint}`;
    const existing = specialMap.get(idx);
    if (existing && existing.key === key) return;
    if (existing) removeSpecial(idx);

    const mesh = createBuildingMesh(tile, time);
    if (!mesh) return;
    const ox = tile.footprint >= 2 ? 0.5 : 0;
    const oz = tile.footprint >= 2 ? 0.5 : 0;
    mesh.position.set((x + ox) * TILE, 0, (y + oz) * TILE);
    specialGroup.add(mesh);
    specialMap.set(idx, { key, mesh });
    if (mesh.userData.animated) animated.add(idx);
  }

  function rebuild(state: CityState, time: number): void {
    const { width, height, tiles } = state;
    resetBatches();

    const liveSpecial = new Set<number>();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const tile = tiles[idx]!;
        if (tile.kind === 'pad' || tile.footprint === 0) continue;

        if (isBatchableBuilding(tile) && pickBuildingModelId(tile)) {
          placeBatch(tile, x, y);
        } else if (isSpecialBuilding(tile)) {
          liveSpecial.add(idx);
          upsertSpecial(idx, tile, x, y, time);
        }
      }
    }

    for (const idx of [...specialMap.keys()]) {
      if (!liveSpecial.has(idx)) removeSpecial(idx);
    }

    for (const batch of batches.values()) {
      for (const part of batch.parts) {
        part.mesh.count = part.count;
        part.mesh.instanceMatrix.needsUpdate = true;
      }
    }
  }

  function sync(state: CityState, time: number): void {
    const { width, height } = state;
    const sizeChanged = width !== lastW || height !== lastH;
    const mapChanged = sizeChanged || state.mapRevision !== lastMapRevision;
    const visualChanged = state.visualRevision !== lastVisualRevision;

    if (mapChanged || visualChanged) {
      rebuild(state, time);
      lastMapRevision = state.mapRevision;
      lastVisualRevision = state.visualRevision;
      lastW = width;
      lastH = height;
    }

    for (const idx of animated) {
      const entry = specialMap.get(idx);
      if (entry) animateBuilding(entry.mesh, time);
    }
  }

  function dispose(): void {
    for (const batch of batches.values()) {
      for (const part of batch.parts) {
        group.remove(part.mesh);
        part.mesh.dispose();
      }
    }
    batches.clear();
    for (const entry of specialMap.values()) {
      specialGroup.remove(entry.mesh);
      entry.mesh.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
    }
    specialMap.clear();
    animated.clear();
    library.dispose();
    disposeBuildingMaterials();
  }

  return { group, sync, dispose };
}
