import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { BuildingManifest } from '../../logic/buildingCatalog';

export interface LoadedBuildingModel {
  id: string;
  baseHeight: number;
  footprint: 1 | 2;
  /** モデル内の各メッシュ部品（同じ行列でインスタンス化） */
  parts: Array<{
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
  }>;
}

export interface BuildingLibrary {
  models: Map<string, LoadedBuildingModel>;
  dispose(): void;
}

/**
 * public/models/buildings の manifest + GLB を読み込む。
 */
export async function loadBuildingLibrary(baseUrl?: string): Promise<BuildingLibrary> {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const root = baseUrl ?? `${base}models/buildings/`;

  const manifestUrl = `${root}manifest.json`;
  const res = await fetch(manifestUrl);
  if (!res.ok) {
    throw new Error(`building manifest not found: ${manifestUrl}`);
  }
  const manifest = (await res.json()) as BuildingManifest;

  const loader = new GLTFLoader();
  const texLoader = new THREE.TextureLoader();
  const models = new Map<string, LoadedBuildingModel>();

  await Promise.all(
    manifest.models.map(async (entry) => {
      const [gltf, texture] = await Promise.all([
        loader.loadAsync(`${root}${entry.glb}`),
        texLoader.loadAsync(`${root}${entry.texture}`),
      ]);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = 4;

      const parts: LoadedBuildingModel['parts'] = [];
      gltf.scene.updateMatrixWorld(true);
      gltf.scene.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        const geo = obj.geometry.clone();
        obj.updateWorldMatrix(true, false);
        geo.applyMatrix4(obj.matrixWorld);
        const baseMat = Array.isArray(obj.material) ? obj.material[0]! : obj.material;
        const mat = (baseMat as THREE.MeshStandardMaterial).clone();
        mat.map = texture;
        mat.color.setHex(0xffffff);
        mat.needsUpdate = true;
        parts.push({ geometry: geo, material: mat });
      });
      if (parts.length === 0) {
        console.warn(`no meshes in ${entry.id}`);
        return;
      }
      models.set(entry.id, {
        id: entry.id,
        baseHeight: entry.baseHeight,
        footprint: entry.footprint,
        parts,
      });
    }),
  );

  return {
    models,
    dispose() {
      for (const m of models.values()) {
        for (const p of m.parts) {
          p.geometry.dispose();
          if (Array.isArray(p.material)) p.material.forEach((x) => x.dispose());
          else p.material.dispose();
        }
      }
      models.clear();
    },
  };
}
