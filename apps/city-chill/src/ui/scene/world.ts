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
  return `${tile.kind}:${tile.tier}:${cBucket}:${tile.variant}`;
}

export interface WorldSystem {
  root: THREE.Group;
  sync(state: CityState, time: number): void;
  dispose(): void;
}

export function createWorld(maxW = 256, maxH = 256): WorldSystem {
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

  function sync(state: CityState, time: number): void {
    const { width, height, tiles } = state;
    ground.sync(state, time);

    const live = new Set<number>();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const tile = tiles[idx]!;
        const key = tileKey(tile);
        live.add(idx);

        const existing = buildingMap.get(idx);
        if (existing && existing.key === key) {
          animateBuilding(existing.mesh, time);
          continue;
        }

        if (existing) {
          buildingsGroup.remove(existing.mesh);
          existing.mesh.traverse((obj) => {
            if (obj instanceof THREE.Mesh) obj.geometry.dispose();
          });
          buildingMap.delete(idx);
        }

        const mesh = createBuildingMesh(tile, time);
        if (!mesh) continue;
        mesh.position.set(x * TILE, 0, y * TILE);
        buildingsGroup.add(mesh);
        buildingMap.set(idx, { key, mesh });
        animateBuilding(mesh, time);
      }
    }

    for (const [idx, entry] of buildingMap) {
      if (live.has(idx)) continue;
      buildingsGroup.remove(entry.mesh);
      entry.mesh.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
      buildingMap.delete(idx);
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
    disposeBuildingMaterials();
  }

  return { root, sync, dispose };
}
