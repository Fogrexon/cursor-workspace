import * as THREE from 'three';
import type { CityState, Tile } from '../../types';
import { animateBuilding, createBuildingMesh, disposeBuildingMaterials } from './buildings';
import { createGround, type GroundSystem } from './ground';
import { TILE } from './isoCamera';
import { createVehicleSystem, type VehicleSystem } from './vehicles3d';

function tileKey(tile: Tile): string {
  // 建設中は数フレームごとにキーを変えて成長を見せる
  const cBucket =
    tile.construction > 0 ? Math.ceil(tile.construction / 4) : 0;
  return `${tile.kind}:${tile.tier}:${cBucket}:${tile.variant}:${tile.footprint}`;
}

export interface WorldSystem {
  root: THREE.Group;
  sync(state: CityState, time: number): void;
  dispose(): void;
}

export function createWorld(maxW = 128, maxH = 128): WorldSystem {
  const root = new THREE.Group();
  root.name = 'world';

  const ground: GroundSystem = createGround(maxW * maxH);
  root.add(ground.group);

  const buildingsGroup = new THREE.Group();
  buildingsGroup.name = 'buildings';
  root.add(buildingsGroup);

  const vehicles: VehicleSystem = createVehicleSystem();
  root.add(vehicles.group);

  const buildingMap = new Map<number, { key: string; mesh: THREE.Group }>();
  /** アニメ対象だけ毎フレーム更新する */
  const animated = new Set<number>();
  let lastMapRevision = -1;
  let lastVisualRevision = -1;
  let lastW = 0;
  let lastH = 0;

  function removeBuilding(idx: number): void {
    const existing = buildingMap.get(idx);
    if (!existing) return;
    buildingsGroup.remove(existing.mesh);
    existing.mesh.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.geometry.dispose();
    });
    buildingMap.delete(idx);
    animated.delete(idx);
  }

  function upsertBuilding(idx: number, tile: Tile, x: number, y: number, time: number): void {
    const key = tileKey(tile);
    const existing = buildingMap.get(idx);
    if (existing && existing.key === key) return;

    if (existing) removeBuilding(idx);

    const mesh = createBuildingMesh(tile, time);
    if (!mesh) return;
    // 2x2 はアンカー左上から半タイルずらして中心に置く
    const ox = tile.footprint >= 2 ? 0.5 : 0;
    const oz = tile.footprint >= 2 ? 0.5 : 0;
    mesh.position.set((x + ox) * TILE, 0, (y + oz) * TILE);
    buildingsGroup.add(mesh);
    buildingMap.set(idx, { key, mesh });
    if (mesh.userData.animated) animated.add(idx);
  }

  function syncAllBuildings(state: CityState, time: number): void {
    const { width, height, tiles } = state;
    const live = new Set<number>();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        live.add(idx);
        upsertBuilding(idx, tiles[idx]!, x, y, time);
      }
    }
    for (const idx of buildingMap.keys()) {
      if (!live.has(idx)) removeBuilding(idx);
    }
  }

  function syncConstructionBuildings(state: CityState, time: number): void {
    const { width, tiles, constructionIndices } = state;
    const check = new Set(constructionIndices);
    for (const [idx, entry] of buildingMap) {
      // tileKey の 3 番目が construction bucket
      const cBucket = entry.key.split(':')[2];
      if (cBucket && cBucket !== '0') check.add(idx);
    }
    for (const idx of check) {
      const tile = tiles[idx];
      if (!tile) {
        removeBuilding(idx);
        continue;
      }
      const x = idx % width;
      const y = (idx / width) | 0;
      upsertBuilding(idx, tile, x, y, time);
    }
  }

  function sync(state: CityState, time: number): void {
    const { width, height } = state;
    ground.sync(state, time);

    const sizeChanged = width !== lastW || height !== lastH;
    const mapChanged = sizeChanged || state.mapRevision !== lastMapRevision;
    const visualChanged = state.visualRevision !== lastVisualRevision;

    if (mapChanged) {
      syncAllBuildings(state, time);
      lastMapRevision = state.mapRevision;
      lastVisualRevision = state.visualRevision;
      lastW = width;
      lastH = height;
    } else if (visualChanged) {
      syncConstructionBuildings(state, time);
      lastVisualRevision = state.visualRevision;
    }

    for (const idx of animated) {
      const entry = buildingMap.get(idx);
      if (entry) animateBuilding(entry.mesh, time);
    }

    vehicles.sync(state.vehicles, time);
  }

  function dispose(): void {
    ground.dispose();
    vehicles.dispose();
    for (const entry of buildingMap.values()) {
      buildingsGroup.remove(entry.mesh);
      entry.mesh.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
    }
    buildingMap.clear();
    animated.clear();
    disposeBuildingMaterials();
  }

  return { root, sync, dispose };
}
