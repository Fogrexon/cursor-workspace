import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { TownPlacement } from '../types';
import { WORLD_SCALE } from '../logic/flight';

export type KitLibrary = Map<string, THREE.Object3D>;

function kitUrl(asset: string): string {
  return `${import.meta.env.BASE_URL}kit/${asset}.glb`;
}

export async function loadKitLibrary(assets: string[]): Promise<KitLibrary> {
  const loader = new GLTFLoader();
  const lib: KitLibrary = new Map();
  await Promise.all(
    assets.map(async (asset) => {
      const gltf = await loader.loadAsync(kitUrl(asset));
      const root = gltf.scene;
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          for (const m of mats) {
            if (m && 'map' in m && m.map) {
              m.map.colorSpace = THREE.SRGBColorSpace;
            }
          }
        }
      });
      lib.set(asset, root);
    }),
  );
  return lib;
}

export function instantiateTown(lib: KitLibrary, placements: TownPlacement[]): THREE.Group {
  const group = new THREE.Group();
  group.name = 'town';
  for (const p of placements) {
    const src = lib.get(p.asset);
    if (!src) continue;
    const clone = src.clone(true);
    clone.position.set(p.x, p.y, p.z);
    if (p.rotY) clone.rotation.y = THREE.MathUtils.degToRad(p.rotY);
    if (p.scale && p.scale !== 1) clone.scale.setScalar(p.scale);
    clone.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.computeBoundingSphere();
        obj.geometry.computeBoundingBox();
        obj.frustumCulled = false;
      }
    });
    group.add(clone);
  }
  group.updateMatrixWorld(true);
  return group;
}

export function createGround(size = 720): THREE.Group {
  const s = WORLD_SCALE;
  const group = new THREE.Group();
  group.name = 'ground';

  const grass = new THREE.Mesh(
    new THREE.CircleGeometry(size * 0.55, 96),
    new THREE.MeshStandardMaterial({ color: 0x4a7a3a, roughness: 0.95, metalness: 0 }),
  );
  grass.rotation.x = -Math.PI / 2;
  grass.receiveShadow = true;
  group.add(grass);

  const dirt = new THREE.Mesh(
    new THREE.PlaneGeometry(28 * s, 28 * s),
    new THREE.MeshStandardMaterial({ color: 0x6b5340, roughness: 0.92, metalness: 0 }),
  );
  dirt.rotation.x = -Math.PI / 2;
  dirt.position.set(28 * s, 0.01, 6 * s);
  dirt.receiveShadow = true;
  group.add(dirt);

  const farm = new THREE.Mesh(
    new THREE.PlaneGeometry(36 * s, 28 * s),
    new THREE.MeshStandardMaterial({ color: 0x7a8a45, roughness: 0.93, metalness: 0 }),
  );
  farm.rotation.x = -Math.PI / 2;
  farm.position.set(40 * s, 0.015, 20 * s);
  farm.receiveShadow = true;
  group.add(farm);

  const plaza = new THREE.Mesh(
    new THREE.CircleGeometry(12 * s, 48),
    new THREE.MeshStandardMaterial({ color: 0x8a8378, roughness: 0.9, metalness: 0 }),
  );
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.y = 0.02;
  plaza.receiveShadow = true;
  group.add(plaza);

  const river = new THREE.Mesh(
    new THREE.PlaneGeometry(7 * s, 120 * s),
    new THREE.MeshStandardMaterial({
      color: 0x3a7ea8,
      roughness: 0.35,
      metalness: 0.05,
      transparent: true,
      opacity: 0.88,
    }),
  );
  river.rotation.x = -Math.PI / 2;
  river.position.set(-32 * s, 0.03, 8 * s);
  river.receiveShadow = true;
  group.add(river);

  const roadMat = new THREE.MeshStandardMaterial({ color: 0x6e675c, roughness: 0.88, metalness: 0 });
  const ns = new THREE.Mesh(new THREE.PlaneGeometry(4 * s, 140 * s), roadMat);
  ns.rotation.x = -Math.PI / 2;
  ns.position.y = 0.04;
  ns.receiveShadow = true;
  group.add(ns);
  const ew = new THREE.Mesh(new THREE.PlaneGeometry(140 * s, 4 * s), roadMat.clone());
  ew.rotation.x = -Math.PI / 2;
  ew.position.y = 0.045;
  ew.receiveShadow = true;
  group.add(ew);

  const westSpur = new THREE.Mesh(new THREE.PlaneGeometry(50 * s, 3.2 * s), roadMat.clone());
  westSpur.rotation.x = -Math.PI / 2;
  westSpur.position.set(-28 * s, 0.04, 0);
  westSpur.receiveShadow = true;
  group.add(westSpur);

  const eastSpur = new THREE.Mesh(new THREE.PlaneGeometry(55 * s, 3.2 * s), roadMat.clone());
  eastSpur.rotation.x = -Math.PI / 2;
  eastSpur.position.set(32 * s, 0.04, 8 * s);
  eastSpur.receiveShadow = true;
  group.add(eastSpur);

  return group;
}
