import * as THREE from 'three';
import type { CityState, Tile, TileKind } from '../../types';
import {
  isRailSurface,
  isRoadSurface,
  linkCount,
  linkMask,
  primaryAxis,
  type LinkMask,
} from '../../logic/connections';
import { TILE } from './isoCamera';

const GRASS_COLORS = [0x3d7a45, 0x458a4e, 0x367040, 0x4a9052];
const FOREST_COLORS = [0x2a5a32, 0x326038, 0x244828, 0x385c3a];
const WATER_COLORS = [0x2a5f8f, 0x326a9a, 0x245580];

type GroundKind =
  | 'grass'
  | 'forest'
  | 'water'
  | 'road'
  | 'rail'
  | 'crossing'
  | 'bridge'
  | 'empty';

function groundKind(kind: TileKind): GroundKind {
  if (kind === 'water') return 'water';
  if (kind === 'forest') return 'forest';
  if (kind === 'empty') return 'empty';
  if (kind === 'crossing') return 'crossing';
  if (kind === 'bridge') return 'bridge';
  if (kind === 'road' || kind === 'station') return 'road';
  if (kind === 'rail') return 'rail';
  return 'grass';
}

interface Layer {
  mesh: THREE.InstancedMesh;
  count: number;
  capacity: number;
}

export interface GroundSystem {
  group: THREE.Group;
  sync(state: CityState, time: number): void;
  dispose(): void;
}

function makeLayer(color: number, capacity: number, y: number): Layer {
  const geo = new THREE.BoxGeometry(TILE * 0.98, 0.08, TILE * 0.98);
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.92,
    metalness: 0.05,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, capacity);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.count = 0;
  mesh.position.y = y;
  mesh.frustumCulled = false;
  return { mesh, count: 0, capacity };
}

const dummy = new THREE.Object3D();

/**
 * 中央線ジオメトリは長手がローカル Z。
 * rotY=0 → ワールド Z（南北道路）、rotY=π/2 → ワールド X（東西道路）
 */
function lineRotY(m: LinkMask): number {
  const axis = primaryAxis(m);
  if (axis === 'x') return Math.PI / 2;
  return 0;
}

export function createGround(maxTiles: number): GroundSystem {
  const group = new THREE.Group();
  group.name = 'ground';

  const grassLayers = GRASS_COLORS.map((c, i) => {
    const layer = makeLayer(c, maxTiles, 0);
    layer.mesh.name = `grass-${i}`;
    group.add(layer.mesh);
    return layer;
  });

  const forestLayers = FOREST_COLORS.map((c, i) => {
    const layer = makeLayer(c, maxTiles, 0.02);
    layer.mesh.name = `forest-${i}`;
    group.add(layer.mesh);
    return layer;
  });

  // 森の木（簡易インスタンス）
  const trunkGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.28, 5);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3520, roughness: 0.9 });
  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, maxTiles * 3);
  trunks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  trunks.count = 0;
  trunks.frustumCulled = false;
  group.add(trunks);

  const canopyGeo = new THREE.ConeGeometry(0.18, 0.35, 6);
  const canopyMat = new THREE.MeshStandardMaterial({ color: 0x2d6b38, roughness: 0.85 });
  const canopies = new THREE.InstancedMesh(canopyGeo, canopyMat, maxTiles * 3);
  canopies.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  canopies.count = 0;
  canopies.frustumCulled = false;
  group.add(canopies);

  const waterLayers = WATER_COLORS.map((c, i) => {
    const layer = makeLayer(c, maxTiles, -0.04);
    const mat = layer.mesh.material as THREE.MeshStandardMaterial;
    mat.roughness = 0.35;
    mat.metalness = 0.15;
    mat.emissive = new THREE.Color(0x102030);
    mat.emissiveIntensity = 0.15;
    layer.mesh.name = `water-${i}`;
    group.add(layer.mesh);
    return layer;
  });

  const emptyLayer = makeLayer(0x2a2a35, maxTiles, -0.02);
  emptyLayer.mesh.name = 'empty';
  group.add(emptyLayer.mesh);

  const roadLayer = makeLayer(0x4a4a55, maxTiles, 0.05);
  roadLayer.mesh.name = 'road';
  group.add(roadLayer.mesh);

  // 橋デッキ（水の上の道路）
  const bridgeLayer = makeLayer(0x6a5a48, maxTiles, 0.12);
  bridgeLayer.mesh.name = 'bridge';
  group.add(bridgeLayer.mesh);

  const bridgeRail = makeLayer(0x8a7a68, maxTiles, 0.22);
  // 薄い手すり用にスケールで使う
  bridgeRail.mesh.name = 'bridge-rail';
  group.add(bridgeRail.mesh);

  // 道路センターライン (長手 = ローカル Z、rotY で向き)
  const lineGeo = new THREE.BoxGeometry(TILE * 0.08, 0.02, TILE * 0.55);
  const lineMat = new THREE.MeshStandardMaterial({
    color: 0xc8c070,
    roughness: 0.8,
    emissive: 0x403800,
    emissiveIntensity: 0.35,
  });
  const roadLines = new THREE.InstancedMesh(lineGeo, lineMat, maxTiles * 2);
  roadLines.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  roadLines.count = 0;
  roadLines.frustumCulled = false;
  roadLines.position.y = 0.1;
  group.add(roadLines);

  const railBed = makeLayer(0x3a3530, maxTiles, 0.04);
  railBed.mesh.name = 'rail-bed';
  group.add(railBed.mesh);

  // レール長手 = ローカル X
  const railGeo = new THREE.BoxGeometry(TILE * 0.7, 0.03, 0.06);
  const railMat = new THREE.MeshStandardMaterial({
    color: 0x8a8a90,
    metalness: 0.6,
    roughness: 0.4,
  });
  const railsA = new THREE.InstancedMesh(railGeo, railMat, maxTiles);
  const railsB = new THREE.InstancedMesh(railGeo, railMat.clone(), maxTiles);
  for (const m of [railsA, railsB]) {
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    m.count = 0;
    m.frustumCulled = false;
    m.position.y = 0.09;
    group.add(m);
  }

  const tieGeo = new THREE.BoxGeometry(0.12, 0.04, TILE * 0.45);
  const tieMat = new THREE.MeshStandardMaterial({ color: 0x5a4030, roughness: 0.95 });
  const ties = new THREE.InstancedMesh(tieGeo, tieMat, maxTiles * 3);
  ties.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  ties.count = 0;
  ties.frustumCulled = false;
  ties.position.y = 0.07;
  group.add(ties);

  // 踏切の遮断機アーム
  const gateGeo = new THREE.BoxGeometry(TILE * 0.7, 0.04, 0.05);
  const gateMat = new THREE.MeshStandardMaterial({
    color: 0xe05050,
    emissive: 0x601010,
    emissiveIntensity: 0.4,
    roughness: 0.6,
  });
  const gates = new THREE.InstancedMesh(gateGeo, gateMat, maxTiles * 2);
  gates.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  gates.count = 0;
  gates.frustumCulled = false;
  group.add(gates);

  const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.35, 6);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x333338, roughness: 0.7 });
  const poles = new THREE.InstancedMesh(poleGeo, poleMat, maxTiles * 2);
  poles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  poles.count = 0;
  poles.frustumCulled = false;
  group.add(poles);

  let lastSig = '';
  let lastW = 0;
  let lastH = 0;

  function resetCounts(): void {
    for (const l of grassLayers) l.count = 0;
    for (const l of forestLayers) l.count = 0;
    for (const l of waterLayers) l.count = 0;
    emptyLayer.count = 0;
    roadLayer.count = 0;
    bridgeLayer.count = 0;
    bridgeRail.count = 0;
    railBed.count = 0;
    roadLines.count = 0;
    railsA.count = 0;
    railsB.count = 0;
    ties.count = 0;
    gates.count = 0;
    poles.count = 0;
    trunks.count = 0;
    canopies.count = 0;
  }

  function place(layer: Layer, x: number, z: number, rotY = 0, sx = 1, sz = 1): void {
    if (layer.count >= layer.capacity) return;
    dummy.position.set(x * TILE, 0, z * TILE);
    dummy.rotation.set(0, rotY, 0);
    dummy.scale.set(sx, 1, sz);
    dummy.updateMatrix();
    layer.mesh.setMatrixAt(layer.count++, dummy.matrix);
  }

  function placeMesh(
    mesh: THREE.InstancedMesh,
    countRef: { count: number },
    capacity: number,
    x: number,
    z: number,
    rotY = 0,
    ox = 0,
    oy = 0,
    oz = 0,
    sx = 1,
    sy = 1,
    sz = 1,
  ): void {
    if (countRef.count >= capacity) return;
    dummy.position.set(x * TILE + ox, oy, z * TILE + oz);
    dummy.rotation.set(0, rotY, 0);
    dummy.scale.set(sx, sy, sz);
    dummy.updateMatrix();
    mesh.setMatrixAt(countRef.count++, dummy.matrix);
  }

  function signature(tiles: Tile[], w: number, h: number): string {
    let hsh = w * 73856093 ^ h * 19349663;
    for (let i = 0; i < tiles.length; i++) {
      const t = tiles[i]!;
      hsh =
        (hsh * 31 +
          t.kind.charCodeAt(0) +
          t.kind.charCodeAt(t.kind.length - 1) * 13 +
          t.tier * 7 +
          (t.construction > 0 ? 1 : 0) +
          t.variant) |
        0;
    }
    return `${hsh}`;
  }

  function placeRoadMarkings(
    x: number,
    y: number,
    m: LinkMask,
    lineCount: { count: number },
  ): void {
    const axis = primaryAxis(m);
    if (axis === 'both') {
      // 交差点: 短い十字
      placeMesh(roadLines, lineCount, maxTiles * 2, x, y, 0, 0, 0, 0, 1, 1, 0.45);
      placeMesh(roadLines, lineCount, maxTiles * 2, x, y, Math.PI / 2, 0, 0, 0, 1, 1, 0.45);
      return;
    }
    if (axis === 'none') {
      placeMesh(roadLines, lineCount, maxTiles * 2, x, y, 0);
      return;
    }
    placeMesh(roadLines, lineCount, maxTiles * 2, x, y, lineRotY(m));
  }

  function placeRails(
    x: number,
    y: number,
    m: LinkMask,
    railACount: { count: number },
    railBCount: { count: number },
    tieCount: { count: number },
  ): void {
    const axis = primaryAxis(m);
    // レール geo は長手 X。南北向きなら 90° 回転し、オフセットも入れ替え
    const rot = axis === 'z' ? Math.PI / 2 : 0;
    if (axis === 'z') {
      placeMesh(railsA, railACount, maxTiles, x, y, rot, -0.12, 0, 0);
      placeMesh(railsB, railBCount, maxTiles, x, y, rot, 0.12, 0, 0);
      for (let i = -1; i <= 1; i++) {
        placeMesh(ties, tieCount, maxTiles * 3, x, y, rot, 0, 0, i * 0.22);
      }
    } else if (axis === 'both') {
      // 交差: 両方の向きを薄く重ねる
      placeMesh(railsA, railACount, maxTiles, x, y, 0, 0, 0, -0.12, 0.7, 1, 1);
      placeMesh(railsB, railBCount, maxTiles, x, y, 0, 0, 0, 0.12, 0.7, 1, 1);
      placeMesh(railsA, railACount, maxTiles, x, y, Math.PI / 2, -0.12, 0, 0, 0.7, 1, 1);
      placeMesh(railsB, railBCount, maxTiles, x, y, Math.PI / 2, 0.12, 0, 0, 0.7, 1, 1);
    } else {
      placeMesh(railsA, railACount, maxTiles, x, y, 0, 0, 0, -0.12);
      placeMesh(railsB, railBCount, maxTiles, x, y, 0, 0, 0, 0.12);
      for (let i = -1; i <= 1; i++) {
        placeMesh(ties, tieCount, maxTiles * 3, x, y, 0, i * 0.22, 0, 0);
      }
    }
  }

  function placeCrossingGates(
    x: number,
    y: number,
    roadM: LinkMask,
    time: number,
    gateCount: { count: number },
    poleCount: { count: number },
  ): void {
    // 遮断機は道路軸に直交して配置。ゆっくり開閉アニメ
    const roadAxis = primaryAxis(roadM);
    const open = 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(time * 0.7 + x * 0.3 + y * 0.2));
    // open=1 で水平(閉)、open=0 でほぼ垂直(開) — chill なので半開き気味に揺らす
    const armAngle = (1 - open) * (Math.PI / 2) * 0.85;

    if (roadAxis === 'z' || roadAxis === 'none') {
      // 道路が南北 → 遮断機は東西に伸びる (rotY=0)、両脇にポール
      placeMesh(poles, poleCount, maxTiles * 2, x, y, 0, -0.35, 0.18, 0);
      placeMesh(poles, poleCount, maxTiles * 2, x, y, 0, 0.35, 0.18, 0);
      // アーム: ポール付け根から内側へ。簡易のため水平スケールで開閉表現
      placeMesh(gates, gateCount, maxTiles * 2, x, y, 0, -0.1, 0.28, 0, open, 1, 1);
      placeMesh(gates, gateCount, maxTiles * 2, x, y, 0, 0.1, 0.28, 0, open, 1, 1);
      void armAngle;
    } else {
      placeMesh(poles, poleCount, maxTiles * 2, x, y, 0, 0, 0.18, -0.35);
      placeMesh(poles, poleCount, maxTiles * 2, x, y, 0, 0, 0.18, 0.35);
      placeMesh(gates, gateCount, maxTiles * 2, x, y, Math.PI / 2, 0, 0.28, -0.1, open, 1, 1);
      placeMesh(gates, gateCount, maxTiles * 2, x, y, Math.PI / 2, 0, 0.28, 0.1, open, 1, 1);
    }
  }

  function sync(state: CityState, time: number): void {
    const { width, height, tiles } = state;
    const sig = signature(tiles, width, height);
    const sizeChanged = width !== lastW || height !== lastH;

    // 踏切ゲートは毎フレームアニメしたいので、crossing があるときは部分更新
    const hasCrossing = tiles.some((t) => t.kind === 'crossing');
    if (sig === lastSig && !sizeChanged && !hasCrossing) {
      for (const layer of waterLayers) {
        const mat = layer.mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.12 + 0.08 * Math.sin(time * 1.5);
      }
      return;
    }

    // crossing アニメのみのフレームではゲートだけ更新
    if (sig === lastSig && !sizeChanged && hasCrossing) {
      const gateCount = { count: 0 };
      const poleCount = { count: 0 };
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (tiles[y * width + x]!.kind !== 'crossing') continue;
          const roadM = linkMask(tiles, x, y, width, height, isRoadSurface);
          placeCrossingGates(x, y, roadM, time, gateCount, poleCount);
        }
      }
      gates.count = gateCount.count;
      gates.instanceMatrix.needsUpdate = true;
      poles.count = poleCount.count;
      poles.instanceMatrix.needsUpdate = true;
      for (const layer of waterLayers) {
        const mat = layer.mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.12 + 0.08 * Math.sin(time * 1.5);
      }
      return;
    }

    lastSig = sig;
    lastW = width;
    lastH = height;

    resetCounts();
    const lineCount = { count: 0 };
    const railACount = { count: 0 };
    const railBCount = { count: 0 };
    const tieCount = { count: 0 };
    const gateCount = { count: 0 };
    const poleCount = { count: 0 };
    const trunkCount = { count: 0 };
    const canopyCount = { count: 0 };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = tiles[y * width + x]!;
        const gk = groundKind(tile.kind);

        if (gk === 'water') {
          place(waterLayers[tile.variant % waterLayers.length]!, x, y);
          continue;
        }
        if (gk === 'empty') {
          place(emptyLayer, x, y);
          continue;
        }
        if (gk === 'forest') {
          place(forestLayers[tile.variant % forestLayers.length]!, x, y);
          // 2〜3本の木
          const nTrees = 2 + (tile.variant % 2);
          for (let i = 0; i < nTrees; i++) {
            const ox = ((i * 0.37 + tile.variant * 0.11) % 0.7) - 0.35;
            const oz = ((i * 0.53 + tile.variant * 0.07) % 0.7) - 0.35;
            placeMesh(trunks, trunkCount, maxTiles * 3, x, y, 0, ox, 0.14, oz);
            placeMesh(canopies, canopyCount, maxTiles * 3, x, y, 0, ox, 0.38, oz);
          }
          continue;
        }

        if (gk === 'bridge') {
          place(waterLayers[0]!, x, y);
          place(bridgeLayer, x, y, 0, 0.88, 0.88);
          const roadM = linkMask(tiles, x, y, width, height, isRoadSurface);
          placeRoadMarkings(x, y, roadM, lineCount);
          // 簡易手すり
          place(bridgeRail, x, y, 0, 0.95, 0.12);
          place(bridgeRail, x, y, 0, 0.12, 0.95);
          const railM = linkMask(tiles, x, y, width, height, isRailSurface);
          if (linkCount(railM) > 0) {
            placeRails(x, y, railM, railACount, railBCount, tieCount);
          }
          continue;
        }

        place(grassLayers[tile.variant % grassLayers.length]!, x, y);

        if (gk === 'road' || gk === 'crossing' || tile.kind === 'station') {
          place(roadLayer, x, y, 0, 0.92, 0.92);
          const roadM = linkMask(tiles, x, y, width, height, isRoadSurface);
          placeRoadMarkings(x, y, roadM, lineCount);
        }

        if (gk === 'rail' || gk === 'crossing' || tile.kind === 'station') {
          if (tile.kind === 'rail') {
            place(railBed, x, y, 0, 0.75, 0.75);
          }
          const railM = linkMask(tiles, x, y, width, height, isRailSurface);
          placeRails(x, y, railM, railACount, railBCount, tieCount);
        }

        if (gk === 'crossing') {
          const roadM = linkMask(tiles, x, y, width, height, isRoadSurface);
          placeCrossingGates(x, y, roadM, time, gateCount, poleCount);
        }
      }
    }

    for (const l of grassLayers) {
      l.mesh.count = l.count;
      l.mesh.instanceMatrix.needsUpdate = true;
    }
    for (const l of forestLayers) {
      l.mesh.count = l.count;
      l.mesh.instanceMatrix.needsUpdate = true;
    }
    for (const l of waterLayers) {
      l.mesh.count = l.count;
      l.mesh.instanceMatrix.needsUpdate = true;
    }
    emptyLayer.mesh.count = emptyLayer.count;
    emptyLayer.mesh.instanceMatrix.needsUpdate = true;
    roadLayer.mesh.count = roadLayer.count;
    roadLayer.mesh.instanceMatrix.needsUpdate = true;
    bridgeLayer.mesh.count = bridgeLayer.count;
    bridgeLayer.mesh.instanceMatrix.needsUpdate = true;
    bridgeRail.mesh.count = bridgeRail.count;
    bridgeRail.mesh.instanceMatrix.needsUpdate = true;
    railBed.mesh.count = railBed.count;
    railBed.mesh.instanceMatrix.needsUpdate = true;

    trunks.count = trunkCount.count;
    trunks.instanceMatrix.needsUpdate = true;
    canopies.count = canopyCount.count;
    canopies.instanceMatrix.needsUpdate = true;

    roadLines.count = lineCount.count;
    roadLines.instanceMatrix.needsUpdate = true;
    railsA.count = railACount.count;
    railsA.instanceMatrix.needsUpdate = true;
    railsB.count = railBCount.count;
    railsB.instanceMatrix.needsUpdate = true;
    ties.count = tieCount.count;
    ties.instanceMatrix.needsUpdate = true;
    gates.count = gateCount.count;
    gates.instanceMatrix.needsUpdate = true;
    poles.count = poleCount.count;
    poles.instanceMatrix.needsUpdate = true;
  }

  function dispose(): void {
    group.traverse((obj) => {
      if (obj instanceof THREE.InstancedMesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
  }

  return { group, sync, dispose };
}
