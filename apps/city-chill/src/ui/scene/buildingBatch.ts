import * as THREE from 'three';
import type { CityState, Tile, TileKind } from '../../types';
import {
  animateBuilding,
  buildingHeight,
  bodyColorFor,
  createBuildingMesh,
  disposeBuildingMaterials,
  footprintSize,
  getFacadeMaterial,
  isBatchableBuilding,
} from './buildings';
import { TILE } from './isoCamera';

const dummy = new THREE.Object3D();
const tmpColor = new THREE.Color();

interface BatchLayer {
  mesh: THREE.InstancedMesh;
  count: number;
  capacity: number;
}

/**
 * 完成済み建物をアーキタイプ別 InstancedMesh で描画する。
 * 建設中・公園など特殊物だけ個別 Group に残す。
 */
export interface BuildingBatchSystem {
  group: THREE.Group;
  sync(state: CityState, time: number): void;
  dispose(): void;
}

function archetypeKey(tile: Tile): string {
  // 形は単位立方体のスケールで表現。材質だけ kind×窓スタイルで分ける
  return `${tile.kind}:${tile.variant % 4}`;
}

function isSpecialBuilding(tile: Tile): boolean {
  if (tile.kind === 'park' || tile.kind === 'plaza') return true;
  if (tile.construction > 0 && isBuildingKind(tile.kind)) return true;
  return false;
}

function isBuildingKind(kind: Tile['kind']): boolean {
  return (
    kind === 'residential' ||
    kind === 'commercial' ||
    kind === 'industrial' ||
    kind === 'school' ||
    kind === 'hospital' ||
    kind === 'station' ||
    kind === 'tower' ||
    kind === 'skyscraper' ||
    kind === 'park' ||
    kind === 'plaza'
  );
}

export function createBuildingBatchSystem(maxTiles: number): BuildingBatchSystem {
  const capacity = Math.min(4096, Math.max(512, maxTiles));
  const group = new THREE.Group();
  group.name = 'building-batch';

  const layers = new Map<string, BatchLayer>();
  const specialGroup = new THREE.Group();
  specialGroup.name = 'building-special';
  group.add(specialGroup);

  const specialMap = new Map<number, { key: string; mesh: THREE.Group }>();
  const animated = new Set<number>();
  const unitGeo = new THREE.BoxGeometry(1, 1, 1);

  let lastMapRevision = -1;
  let lastVisualRevision = -1;
  let lastW = 0;
  let lastH = 0;

  function ensureLayer(tile: Tile): BatchLayer {
    const key = archetypeKey(tile);
    let layer = layers.get(key);
    if (layer) return layer;

    const kind = tile.kind as TileKind;
    const mat = getFacadeMaterial(kind, tile.variant);
    const mesh = new THREE.InstancedMesh(unitGeo, mat, capacity);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3);
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.name = `batch-${key}`;
    group.add(mesh);
    layer = { mesh, count: 0, capacity };
    layers.set(key, layer);
    return layer;
  }

  function resetBatches(): void {
    for (const layer of layers.values()) {
      layer.count = 0;
      layer.mesh.count = 0;
    }
  }

  function placeBatch(tile: Tile, x: number, y: number): void {
    const layer = ensureLayer(tile);
    if (layer.count >= layer.capacity) return;

    const kind = tile.kind as TileKind;
    const fp = Math.max(1, tile.footprint || 1);
    const h = buildingHeight(kind, tile.tier, 0, fp);
    const { w, d } = footprintSize(kind, fp);
    const ox = fp >= 2 ? 0.5 : 0;
    const oz = fp >= 2 ? 0.5 : 0;

    dummy.position.set((x + ox) * TILE, h / 2, (y + oz) * TILE);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(w, h, d);
    dummy.updateMatrix();
    layer.mesh.setMatrixAt(layer.count, dummy.matrix);

    tmpColor.setHex(bodyColorFor(kind, tile.variant));
    layer.mesh.setColorAt(layer.count, tmpColor);
    layer.count += 1;
  }

  function removeSpecial(idx: number): void {
    const existing = specialMap.get(idx);
    if (!existing) return;
    specialGroup.remove(existing.mesh);
    existing.mesh.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        // 共有材以外の clone だけ dispose。geometry は個別生成分
        obj.geometry.dispose();
      }
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

        if (isBatchableBuilding(tile)) {
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

    for (const layer of layers.values()) {
      layer.mesh.count = layer.count;
      layer.mesh.instanceMatrix.needsUpdate = true;
      if (layer.mesh.instanceColor) layer.mesh.instanceColor.needsUpdate = true;
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
    for (const layer of layers.values()) {
      group.remove(layer.mesh);
      layer.mesh.dispose();
    }
    layers.clear();
    for (const entry of specialMap.values()) {
      specialGroup.remove(entry.mesh);
      entry.mesh.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
    }
    specialMap.clear();
    animated.clear();
    unitGeo.dispose();
    disposeBuildingMaterials();
  }

  return { group, sync, dispose };
}
