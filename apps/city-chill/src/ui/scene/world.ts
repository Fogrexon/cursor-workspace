import * as THREE from 'three';
import type { CityState } from '../../types';
import { createBuildingBatchSystem, type BuildingBatchSystem } from './buildingBatch';
import { createGround, type GroundSystem } from './ground';
import { createVehicleSystem, type VehicleSystem } from './vehicles3d';

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

  const buildings: BuildingBatchSystem = createBuildingBatchSystem(maxW * maxH);
  root.add(buildings.group);

  const vehicles: VehicleSystem = createVehicleSystem();
  root.add(vehicles.group);

  function sync(state: CityState, time: number): void {
    ground.sync(state, time);
    buildings.sync(state, time);
    vehicles.sync(state.vehicles, time);
  }

  function dispose(): void {
    ground.dispose();
    buildings.dispose();
    vehicles.dispose();
  }

  return { root, sync, dispose };
}
