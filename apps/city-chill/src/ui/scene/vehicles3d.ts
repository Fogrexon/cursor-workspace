import * as THREE from 'three';
import type { Vehicle, VehicleKind } from '../../types';
import { TILE } from './isoCamera';

const CAR_PALETTE = [0xe05050, 0x5080e0, 0xe0c040, 0x50c070, 0xc060e0, 0xe08040];

const matCache = new Map<string, THREE.MeshStandardMaterial>();

function mat(key: string, color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.25, ...opts });
    matCache.set(key, m);
  }
  return m;
}

function box(w: number, h: number, d: number, material: THREE.Material, y = h / 2): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.y = y;
  return mesh;
}

function makeCar(color: number): THREE.Group {
  const g = new THREE.Group();
  const body = box(0.38, 0.12, 0.22, mat(`car-${color}`, color), 0.1);
  g.add(body);
  const cabin = box(0.2, 0.1, 0.2, mat(`cabin-${color}`, color, { roughness: 0.4 }), 0.2);
  cabin.position.x = -0.02;
  g.add(cabin);
  const glass = box(0.16, 0.08, 0.18, mat('glass', 0xa0c8e8, {
    transparent: true,
    opacity: 0.65,
    metalness: 0.3,
    roughness: 0.2,
    emissive: 0x204060,
    emissiveIntensity: 0.15,
  }), 0.2);
  glass.position.x = 0.06;
  g.add(glass);
  const wheelMat = mat('wheel', 0x1a1a1a, { roughness: 0.9 });
  for (const [x, z] of [
    [-0.12, 0.12],
    [0.12, 0.12],
    [-0.12, -0.12],
    [0.12, -0.12],
  ] as const) {
    const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 8), wheelMat);
    wh.rotation.z = Math.PI / 2;
    wh.position.set(x, 0.05, z);
    g.add(wh);
  }
  return g;
}

function makeBus(color: number): THREE.Group {
  const g = new THREE.Group();
  const body = box(0.55, 0.22, 0.24, mat(`bus-${color}`, color), 0.16);
  g.add(body);
  const stripe = box(0.52, 0.04, 0.25, mat('bus-stripe', 0xf0f0f0), 0.14);
  g.add(stripe);
  for (let i = -2; i <= 2; i++) {
    const win = box(0.07, 0.08, 0.02, mat('bus-win', 0x80b0e0, {
      emissive: 0x406080,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.8,
    }), 0.22);
    win.position.set(i * 0.09, 0, 0.13);
    g.add(win);
  }
  return g;
}

function makeTruck(color: number): THREE.Group {
  const g = new THREE.Group();
  const cab = box(0.22, 0.18, 0.22, mat(`truck-cab-${color}`, color), 0.16);
  cab.position.x = 0.14;
  g.add(cab);
  const cargo = box(0.32, 0.2, 0.24, mat('cargo', 0x6a6a70, { roughness: 0.7 }), 0.18);
  cargo.position.x = -0.12;
  g.add(cargo);
  const glass = box(0.02, 0.1, 0.18, mat('truck-glass', 0xa0c8e8, { transparent: true, opacity: 0.7 }), 0.2);
  glass.position.set(0.26, 0, 0);
  g.add(glass);
  return g;
}

function makeTrainCar(isEngine: boolean, index: number): THREE.Group {
  const g = new THREE.Group();
  const bodyColor = isEngine ? 0x3a5a8a : 0xd0d0d8;
  const body = box(0.42, 0.18, 0.22, mat(`train-${isEngine}-${index}`, bodyColor, {
    metalness: 0.35,
    roughness: 0.45,
  }), 0.16);
  g.add(body);
  if (isEngine) {
    const nose = box(0.12, 0.14, 0.2, mat('engine-nose', 0x2a4a7a), 0.14);
    nose.position.x = 0.24;
    g.add(nose);
    const light = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 6, 6),
      mat('headlight', 0xffe080, { emissive: 0xffc040, emissiveIntensity: 1 }),
    );
    light.position.set(0.32, 0.14, 0);
    light.userData.headlight = true;
    g.add(light);
  } else {
    const win = box(0.28, 0.08, 0.02, mat('train-win', 0x6490c8, {
      emissive: 0x305070,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.75,
    }), 0.2);
    win.position.z = 0.12;
    g.add(win);
  }
  const coupler = box(0.06, 0.04, 0.04, mat('coupler', 0x444448), 0.1);
  coupler.position.x = -0.24;
  g.add(coupler);
  return g;
}

function makeVehicleGroup(kind: VehicleKind, colorIdx: number, cars?: number): THREE.Group {
  const color = CAR_PALETTE[colorIdx % CAR_PALETTE.length]!;
  if (kind === 'bus') return makeBus(color);
  if (kind === 'truck') return makeTruck(color);
  if (kind === 'train') {
    // 各車両は独立にワールド座標へ置くため、親は空のコンテナ
    const train = new THREE.Group();
    train.userData.isTrain = true;
    const n = cars ?? 4;
    for (let i = 0; i < n; i++) {
      const car = makeTrainCar(i === 0, i);
      car.userData.carIndex = i;
      train.add(car);
    }
    return train;
  }
  return makeCar(color);
}

export interface VehicleSystem {
  group: THREE.Group;
  sync(vehicles: Vehicle[], time: number): void;
  dispose(): void;
}

export function createVehicleSystem(): VehicleSystem {
  const group = new THREE.Group();
  group.name = 'vehicles';
  const byId = new Map<number, THREE.Group>();

  function sync(vehicles: Vehicle[], time: number): void {
    const seen = new Set<number>();
    for (const v of vehicles) {
      seen.add(v.id);
      let mesh = byId.get(v.id);
      if (!mesh) {
        mesh = makeVehicleGroup(v.kind, v.color, v.cars);
        mesh.userData.id = v.id;
        byId.set(v.id, mesh);
        group.add(mesh);
      }

      if (v.kind === 'train' && v.carPoses && v.carPoses.length > 0) {
        // 親は原点固定、各車両を経路上の個別ポーズへ
        mesh.position.set(0, 0, 0);
        mesh.rotation.set(0, 0, 0);
        const children = mesh.children;
        for (let i = 0; i < children.length; i++) {
          const car = children[i] as THREE.Object3D;
          const pose = v.carPoses[i] ?? v.carPoses[v.carPoses.length - 1]!;
          car.position.set(pose.x * TILE, 0.02, pose.y * TILE);
          car.rotation.y = -pose.dir;
        }
      } else {
        mesh.position.set(v.x * TILE, 0.02, v.y * TILE);
        mesh.rotation.y = -v.dir;
      }

      mesh.traverse((obj) => {
        if (obj.userData.headlight) {
          const on = Math.sin(time * 8) > 0;
          const m = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
          m.emissiveIntensity = on ? 1.4 : 0.2;
        }
      });
    }
    for (const [id, mesh] of byId) {
      if (!seen.has(id)) {
        group.remove(mesh);
        mesh.traverse((obj) => {
          if (obj instanceof THREE.Mesh) obj.geometry.dispose();
        });
        byId.delete(id);
      }
    }
  }

  function dispose(): void {
    for (const mesh of byId.values()) {
      group.remove(mesh);
      mesh.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
    }
    byId.clear();
    for (const m of matCache.values()) m.dispose();
    matCache.clear();
  }

  return { group, sync, dispose };
}
