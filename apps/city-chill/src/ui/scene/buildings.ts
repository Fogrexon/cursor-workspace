import * as THREE from 'three';
import type { Tile, TileKind } from '../../types';

const matCache = new Map<string, THREE.MeshStandardMaterial>();
const texCache = new Map<string, THREE.CanvasTexture>();
const facadeMatCache = new Map<string, THREE.MeshStandardMaterial>();

function mat(
  key: string,
  color: number,
  opts: Partial<THREE.MeshStandardMaterialParameters> = {},
): THREE.MeshStandardMaterial {
  const existing = matCache.get(key);
  if (existing) return existing;
  const m = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.85,
    metalness: 0.08,
    ...opts,
  });
  matCache.set(key, m);
  return m;
}

function box(
  w: number,
  h: number,
  d: number,
  material: THREE.Material,
  y = h / 2,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.y = y;
  return mesh;
}

export function buildingHeight(
  kind: TileKind,
  tier: number,
  construction: number,
  footprint = 1,
): number {
  const maxFrames = 48;
  const progress =
    construction > 0 ? Math.max(0.12, 1 - construction / maxFrames) : 1;
  const base: Partial<Record<TileKind, number>> = {
    residential: 0.55,
    commercial: 0.7,
    industrial: 0.65,
    park: 0.1,
    school: 0.75,
    hospital: 0.8,
    station: 0.5,
    plaza: 0.12,
    tower: 1.6,
    skyscraper: 3.2,
  };
  const fpBoost = footprint >= 2 ? 1.35 : 1;
  return Math.max(0.12, (base[kind] ?? 0.5) * (0.55 + tier * 0.28) * progress * fpBoost);
}

const RES_COLORS = [0xc4a882, 0xb89070, 0xd0b898, 0xa87860, 0xc8b090, 0x9a7a5a, 0xd8c4a8, 0xb0a088];
const COM_COLORS = [0x7a9ec4, 0x6a8ab0, 0x90b0c8, 0x5a7a98, 0xa0b8d0, 0x7088a8, 0x88a8c0, 0x4a6880];
const IND_COLORS = [0x8a8a70, 0x7a7a60, 0x9a9078, 0x6a6860, 0xa09880, 0x787060, 0x8a8070, 0x5a5850];
const TOWER_COLORS = [0x90b0d0, 0x80a0c0, 0xa0c0e0, 0x7088a8, 0xb0d0e8, 0x6880a0, 0x98b8d8, 0x506878];
const SKY_COLORS = [0xa8c0e0, 0x90a8c8, 0xb8d0f0, 0x7890b0, 0xc0d8f0, 0x6880a0, 0xa0b8d8, 0x587090];

const BODY: Record<string, number> = {
  residential: 0xc4a882,
  commercial: 0x7a9ec4,
  industrial: 0x8a8a70,
  school: 0xe8d080,
  hospital: 0xe8e8f0,
  station: 0x9090a0,
  plaza: 0xd0c8b0,
  tower: 0x90b0d0,
  skyscraper: 0xa8c0e0,
};

export function bodyColorFor(kind: TileKind, variant: number): number {
  const v = variant % 8;
  switch (kind) {
    case 'residential':
      return RES_COLORS[v]!;
    case 'commercial':
      return COM_COLORS[v]!;
    case 'industrial':
      return IND_COLORS[v]!;
    case 'tower':
      return TOWER_COLORS[v]!;
    case 'skyscraper':
      return SKY_COLORS[v]!;
    default:
      return BODY[kind] ?? BODY.residential!;
  }
}

export function footprintSize(kind: TileKind, footprint: number): { w: number; d: number } {
  if (footprint >= 2) {
    if (kind === 'skyscraper') return { w: 1.65, d: 1.65 };
    if (kind === 'tower') return { w: 1.45, d: 1.4 };
    return { w: 1.5, d: 1.5 };
  }
  if (kind === 'skyscraper') return { w: 0.72, d: 0.72 };
  if (kind === 'tower') return { w: 0.55, d: 0.58 };
  if (kind === 'industrial') return { w: 0.68, d: 0.62 };
  if (kind === 'commercial') return { w: 0.64, d: 0.58 };
  return { w: 0.62, d: 0.58 };
}

/** InstancedMesh でまとめて描ける完成建物か */
export function isBatchableBuilding(tile: Tile): boolean {
  if (tile.construction > 0) return false;
  if (tile.kind === 'pad' || tile.footprint === 0) return false;
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

/**
 * 窓グリッドを焼き込んだファサードテクスチャ（事前生成・キャッシュ）。
 * 個別窓 Mesh の代わりに使い、draw call を劇的に減らす。
 */
function getWindowTexture(kind: TileKind, style: number): THREE.CanvasTexture {
  const key = `${kind}:${style}`;
  const hit = texCache.get(key);
  if (hit) return hit;

  const tw = 64;
  const th = 128;
  const canvas = document.createElement('canvas');
  canvas.width = tw;
  canvas.height = th;
  const ctx = canvas.getContext('2d')!;

  // ベースは白（instanceColor / material.color で着色）
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, tw, th);

  const rows = kind === 'skyscraper' || kind === 'tower' ? 10 : 6;
  const cols = kind === 'skyscraper' || kind === 'tower' ? 5 : 4;
  const padX = 6;
  const padY = 8;
  const gapX = 3;
  const gapY = 4;
  const cellW = (tw - padX * 2 - gapX * (cols - 1)) / cols;
  const cellH = (th - padY * 2 - gapY * (rows - 1)) / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const lit = ((style * 7 + row * 3 + col * 5) % 10) > 4;
      if (kind === 'skyscraper' || kind === 'tower') {
        ctx.fillStyle = lit ? 'rgba(40, 70, 100, 0.55)' : 'rgba(20, 30, 45, 0.7)';
      } else if (kind === 'industrial') {
        ctx.fillStyle = lit ? 'rgba(50, 50, 40, 0.45)' : 'rgba(30, 30, 25, 0.55)';
      } else {
        ctx.fillStyle = lit ? 'rgba(255, 220, 140, 0.55)' : 'rgba(25, 35, 45, 0.65)';
      }
      const x = padX + col * (cellW + gapX);
      const y = padY + row * (cellH + gapY);
      ctx.fillRect(x, y, cellW, cellH);
    }
  }

  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0, 0, tw, 5);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  texCache.set(key, tex);
  return tex;
}

/** InstancedMesh 用の共有ファサード材（色は instanceColor） */
export function getFacadeMaterial(kind: TileKind, variant: number): THREE.MeshStandardMaterial {
  const style = variant % 4;
  const key = `facade-${kind}-${style}`;
  const hit = facadeMatCache.get(key);
  if (hit) return hit;

  const isGlass = kind === 'skyscraper' || kind === 'tower';
  const tex = getWindowTexture(kind, style);
  const m = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: tex,
    roughness: isGlass ? 0.32 : 0.78,
    metalness: isGlass ? 0.35 : 0.08,
  });
  facadeMatCache.set(key, m);
  return m;
}

function makeScaffold(
  w: number,
  h: number,
  d: number,
  time: number,
  variant: number,
  progress: number,
): THREE.Group {
  const g = new THREE.Group();
  g.userData.constructionSite = true;

  const slab = box(w * 1.1, 0.06, d * 1.1, mat('foundation', 0x6a6a70, { roughness: 0.95 }), 0.03);
  g.add(slab);

  const pallet = box(0.22, 0.08, 0.18, mat('pallet', 0x8a6030), 0.08);
  pallet.position.set(-w * 0.55, 0, d * 0.4);
  g.add(pallet);
  for (let i = 0; i < 3; i++) {
    const brick = box(0.18, 0.04, 0.08, mat('brick', 0xb05040), 0.14 + i * 0.045);
    brick.position.set(-w * 0.55, 0, d * 0.4);
    g.add(brick);
  }

  const frame = mat('scaffold', 0xc8a040, { metalness: 0.45, roughness: 0.45 });
  const levels = Math.max(2, Math.ceil(3 * progress + 1));
  for (let i = 0; i < levels; i++) {
    const y = ((i + 1) / (levels + 1)) * h * Math.max(0.4, progress);
    const bar = box(w * 1.08, 0.025, d * 1.08, frame, y);
    g.add(bar);
    for (const [sx, sz] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ] as const) {
      const post = box(0.03, y, 0.03, frame, y / 2);
      post.position.set(sx * w * 0.52, 0, sz * d * 0.52);
      g.add(post);
    }
  }

  const mastH = h + 0.7;
  const mast = box(0.07, mastH, 0.07, mat('crane', 0xc0c0c8, { metalness: 0.55 }), mastH / 2);
  mast.position.x = w * 0.42;
  g.add(mast);
  const cabin = box(0.16, 0.12, 0.14, mat('crane-cab', 0xe0a040, { metalness: 0.35 }), mastH - 0.05);
  cabin.position.x = w * 0.42;
  g.add(cabin);
  const boomLen = w * 1.1;
  const boom = box(boomLen, 0.045, 0.045, mat('crane-boom', 0xe0a040, { metalness: 0.4 }), mastH + 0.08);
  boom.position.x = w * 0.42 - boomLen * 0.25;
  boom.userData.craneBoom = true;
  g.add(boom);

  const sway = Math.sin(time * 1.2 + variant) * 0.22;
  const hookY = 0.25 + progress * (h * 0.7);
  const cableH = Math.max(0.15, mastH + 0.08 - hookY);
  const cable = box(0.012, cableH, 0.012, mat('cable', 0x888890), mastH + 0.08 - cableH / 2);
  cable.position.x = sway;
  cable.userData.craneCable = true;
  g.add(cable);
  const hook = box(0.07, 0.09, 0.07, mat('hook', 0xe0a040), hookY);
  hook.position.x = sway;
  hook.userData.craneHook = true;
  g.add(hook);

  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 6, 6),
    mat('site-lamp', 0xffe080, { emissive: 0xffc040, emissiveIntensity: 0.9 }),
  );
  lamp.position.set(-w * 0.4, 0.35, -d * 0.4);
  lamp.userData.siteLamp = true;
  g.add(lamp);

  return g;
}

function makeTree(variant: number): THREE.Group {
  const g = new THREE.Group();
  const trunk = box(0.08, 0.28, 0.08, mat('trunk', 0x5a4030), 0.14);
  g.add(trunk);
  const canopyMat = mat(`canopy-${variant % 2}`, variant % 2 === 0 ? 0x3a8a45 : 0x4a9a55, {
    roughness: 0.95,
  });
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 5), canopyMat);
  canopy.position.y = 0.42;
  canopy.scale.set(1, 0.9, 1);
  g.add(canopy);
  return g;
}

function makeRoof(w: number, d: number, color: number): THREE.Group {
  const g = new THREE.Group();
  const roofMat = mat(`roof-${color}`, color, { roughness: 0.75 });
  const pitch = 0.48;
  const halfSpan = w * 0.52;
  const panelW = halfSpan / Math.cos(pitch);
  const rise = halfSpan * Math.tan(pitch);
  const depth = d * 0.98;

  const left = box(panelW, 0.035, depth, roofMat, 0);
  left.rotation.z = pitch;
  left.position.set(-halfSpan / 2, rise / 2, 0);
  g.add(left);

  const right = box(panelW, 0.035, depth, roofMat, 0);
  right.rotation.z = -pitch;
  right.position.set(halfSpan / 2, rise / 2, 0);
  g.add(right);

  return g;
}

function makeFlatRoof(w: number, d: number, color: number, y: number): THREE.Mesh {
  return box(w * 1.02, 0.05, d * 1.02, mat(`flat-roof-${color}`, color, { roughness: 0.9 }), y);
}

/**
 * 個別 Group が必要な建物（建設中・公園など）用。
 * 完成した通常建物は buildingBatch の InstancedMesh を使う。
 */
export function createBuildingMesh(tile: Tile, time: number): THREE.Group | null {
  const kind = tile.kind;
  if (
    kind === 'grass' ||
    kind === 'empty' ||
    kind === 'water' ||
    kind === 'forest' ||
    kind === 'road' ||
    kind === 'rail' ||
    kind === 'crossing' ||
    kind === 'bridge' ||
    kind === 'pad'
  ) {
    return null;
  }

  const group = new THREE.Group();
  group.userData = {
    kind,
    tier: tile.tier,
    construction: tile.construction,
    variant: tile.variant,
    footprint: tile.footprint,
    animated: false,
  };

  if (kind === 'park') {
    for (let i = 0; i < 3; i++) {
      const tree = makeTree(tile.variant + i);
      tree.position.set((i - 1) * 0.28, 0, (i % 2) * 0.15 - 0.05);
      tree.userData.sway = i + tile.variant;
      group.add(tree);
    }
    group.userData.animated = true;
    return group;
  }

  if (kind === 'plaza') {
    group.add(box(0.75, 0.08, 0.75, mat('plaza', BODY.plaza!), 0.04));
    const fountain = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.15, 0.1, 8),
      mat('fountain', 0x6a90b0, { metalness: 0.3, roughness: 0.4 }),
    );
    fountain.position.y = 0.12;
    group.add(fountain);
    return group;
  }

  const fp = Math.max(1, tile.footprint || 1);
  const h = buildingHeight(kind, tile.tier, tile.construction, fp);
  const { w, d } = footprintSize(kind, fp);
  const bodyColor = bodyColorFor(kind, tile.variant);

  if (tile.construction <= 0) {
    const facade = getFacadeMaterial(kind, tile.variant);
    const bodyMat = facade.clone();
    bodyMat.color.setHex(bodyColor);
    group.add(box(w, h, d, bodyMat, h / 2));
    if (kind === 'residential' && tile.tier <= 2) {
      const roof = makeRoof(w, d, 0xa04040);
      roof.position.y = h;
      group.add(roof);
    } else if (kind !== 'tower' && kind !== 'skyscraper') {
      group.add(makeFlatRoof(w, d, 0x707880, h + 0.025));
    }
    return group;
  }

  const progress = Math.max(0.12, 1 - tile.construction / 48);
  const bodyMat = mat(`body-build-${kind}`, bodyColor, {
    transparent: true,
    opacity: 0.35 + progress * 0.5,
    roughness: 0.9,
  });
  group.add(box(w, h, d, bodyMat, h / 2));
  group.add(makeScaffold(w, Math.max(h, 0.4), d, time, tile.variant, progress));
  group.userData.buildingProgress = progress;
  group.userData.animated = true;
  return group;
}

export function animateBuilding(group: THREE.Group, time: number): void {
  const variant = (group.userData.variant as number) ?? 0;
  group.traverse((obj) => {
    if (!(obj instanceof THREE.Object3D)) return;
    if (obj.userData.sway != null) {
      obj.rotation.z = Math.sin(time * 1.5 + obj.userData.sway) * 0.06;
    }
    if (obj.userData.craneHook || obj.userData.craneCable) {
      const sway = Math.sin(time * 1.2 + variant) * 0.22;
      obj.position.x = sway;
    }
    if (obj.userData.siteLamp) {
      const on = Math.sin(time * 4 + variant) > -0.2;
      const m = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = on ? 1.1 : 0.25;
    }
  });
}

export function disposeBuildingMaterials(): void {
  for (const m of matCache.values()) m.dispose();
  matCache.clear();
  for (const m of facadeMatCache.values()) m.dispose();
  facadeMatCache.clear();
  for (const t of texCache.values()) t.dispose();
  texCache.clear();
}
