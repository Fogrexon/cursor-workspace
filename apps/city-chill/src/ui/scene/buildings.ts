import * as THREE from 'three';
import type { Tile, TileKind } from '../../types';

const matCache = new Map<string, THREE.MeshStandardMaterial>();

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

function buildingHeight(kind: TileKind, tier: number, construction: number): number {
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
  return Math.max(0.12, (base[kind] ?? 0.5) * (0.55 + tier * 0.28) * progress);
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

  // 基礎スラブ
  const slab = box(w * 1.1, 0.06, d * 1.1, mat('foundation', 0x6a6a70, { roughness: 0.95 }), 0.03);
  g.add(slab);

  // 資材パレット
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
    // 縦柱
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

  // タワークレーン
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

  // 工事ライト
  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 6, 6),
    mat('site-lamp', 0xffe080, { emissive: 0xffc040, emissiveIntensity: 0.9 }),
  );
  lamp.position.set(-w * 0.4, 0.35, -d * 0.4);
  lamp.userData.siteLamp = true;
  g.add(lamp);

  return g;
}

function addWindows(
  group: THREE.Group,
  w: number,
  h: number,
  d: number,
  kind: TileKind,
  variant: number,
): void {
  if (kind === 'station' || kind === 'park' || kind === 'plaza') return;
  const rows = Math.max(1, Math.floor(h / 0.28));
  const cols = kind === 'skyscraper' ? 4 : kind === 'tower' ? 3 : 2;
  const winMatOn = mat('win-on', 0xffe8a0, {
    emissive: 0xffc860,
    emissiveIntensity: 0.85,
    roughness: 0.4,
  });
  const winMatOff = mat('win-off', 0x1a2530, { roughness: 0.6 });

  const faceW = w * 0.92;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const lit = ((variant * 7 + row * 3 + col * 5) % 10) > 4;
      const m = lit ? winMatOn : winMatOff;
      const ww = faceW / cols * 0.45;
      const wh = 0.12;
      // +Z face
      const wx = -faceW / 2 + (col + 0.5) * (faceW / cols);
      const wy = 0.18 + row * (h * 0.85) / rows;
      const front = box(ww, wh, 0.02, m, wy);
      front.position.x = wx;
      front.position.z = d / 2 + 0.01;
      group.add(front);
      // +X face
      const side = box(0.02, wh, ww, m, wy);
      side.position.x = w / 2 + 0.01;
      side.position.z = wx * (d / w);
      group.add(side);
    }
  }
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
  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 5, 4),
    mat('canopy-hi', 0x5aba65, { roughness: 0.9 }),
  );
  highlight.position.set(-0.05, 0.48, 0.04);
  g.add(highlight);
  return g;
}

function makeRoof(w: number, d: number, color: number): THREE.Group {
  const g = new THREE.Group();
  // 切妻: 半幅の板2枚を棟で合わせる（全幅板だと交差して X になる）
  const roofMat = mat(`roof-${color}`, color, { roughness: 0.75 });
  const pitch = 0.48;
  const halfSpan = w * 0.52;
  const panelW = halfSpan / Math.cos(pitch);
  const rise = halfSpan * Math.tan(pitch);
  const depth = d * 0.98;

  // 左半分: +X 側が棟（上）、-X 側が軒
  const left = box(panelW, 0.035, depth, roofMat, 0);
  left.rotation.z = pitch;
  left.position.set(-halfSpan / 2, rise / 2, 0);
  g.add(left);

  // 右半分: -X 側が棟、-rotation で対称
  const right = box(panelW, 0.035, depth, roofMat, 0);
  right.rotation.z = -pitch;
  right.position.set(halfSpan / 2, rise / 2, 0);
  g.add(right);

  // 棟木（合わせ目を隠す）
  const ridge = box(0.04, 0.04, depth * 1.02, roofMat, 0);
  ridge.position.set(0, rise + 0.01, 0);
  g.add(ridge);

  return g;
}

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

/** タイルから建物グループを生成。草地・道路等は null */
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
    kind === 'bridge'
  ) {
    return null;
  }

  const group = new THREE.Group();
  group.userData = { kind, tier: tile.tier, construction: tile.construction, variant: tile.variant };

  if (kind === 'park') {
    for (let i = 0; i < 3; i++) {
      const tree = makeTree(tile.variant + i);
      tree.position.set((i - 1) * 0.28, 0, (i % 2) * 0.15 - 0.05);
      // 風揺れ用
      tree.userData.sway = i + tile.variant;
      group.add(tree);
    }
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

  const h = buildingHeight(kind, tile.tier, tile.construction);
  const w = kind === 'skyscraper' ? 0.72 : kind === 'tower' ? 0.55 : 0.62;
  const d = kind === 'skyscraper' ? 0.72 : 0.58;
  const bodyColor = BODY[kind] ?? BODY.residential!;
  const bodyMat = mat(`body-${kind}-${tile.variant % 3}`, bodyColor, {
    roughness: kind === 'skyscraper' ? 0.35 : 0.8,
    metalness: kind === 'skyscraper' || kind === 'tower' ? 0.35 : 0.08,
  });

  const body = box(w, h, d, bodyMat, h / 2);
  group.add(body);

  if (tile.construction > 0) {
    const progress = Math.max(0.12, 1 - tile.construction / 48);
    // 建設中は半透明の躯体 + 足場クレーン
    body.material = mat(`body-build-${kind}`, bodyColor, {
      transparent: true,
      opacity: 0.35 + progress * 0.5,
      roughness: 0.9,
    });
    group.add(makeScaffold(w, Math.max(h, 0.4), d, time, tile.variant, progress));
    group.userData.buildingProgress = progress;
    return group;
  }

  addWindows(group, w, h, d, kind, tile.variant);

  if (kind === 'residential' && tile.tier <= 2) {
    const roof = makeRoof(w, d, 0xa04040 + tile.variant * 0x080808);
    roof.position.y = h;
    group.add(roof);
  }

  if (kind === 'hospital') {
    const crossMat = mat('cross', 0xe05050, { emissive: 0x801010, emissiveIntensity: 0.4 });
    const v = box(0.08, 0.28, 0.04, crossMat, h * 0.7);
    const hz = box(0.22, 0.08, 0.04, crossMat, h * 0.7);
    v.position.z = d / 2 + 0.02;
    hz.position.z = d / 2 + 0.02;
    group.add(v, hz);
  }

  if (kind === 'school') {
    const flag = box(0.2, 0.1, 0.02, mat('flag', 0x4060a0), h + 0.12);
    group.add(flag);
    const pole = box(0.03, 0.25, 0.03, mat('pole', 0x888890), h + 0.05);
    pole.position.x = -0.12;
    group.add(pole);
  }

  if (kind === 'station') {
    const canopy = box(0.9, 0.08, 0.35, mat('canopy', 0xb0b0c0, { metalness: 0.2 }), h + 0.06);
    group.add(canopy);
    const postL = box(0.05, h * 0.6, 0.05, mat('post', 0x707080), h * 0.3);
    postL.position.set(-0.35, 0, 0.1);
    const postR = postL.clone();
    postR.position.x = 0.35;
    group.add(postL, postR);
    // 駅サイン
    const sign = box(0.28, 0.12, 0.03, mat('sign', 0xe0c040, { emissive: 0x806000, emissiveIntensity: 0.5 }), h * 0.55);
    sign.position.z = d / 2 + 0.03;
    group.add(sign);
  }

  if (kind === 'industrial') {
    const chimney = box(0.14, h + 0.35, 0.14, mat('chimney', 0x6a6058), (h + 0.35) / 2);
    chimney.position.set(0.2, 0, -0.1);
    group.add(chimney);
    // 煙パーティクル風スプライト代替: 半透明球
    for (let i = 0; i < 3; i++) {
      const smoke = new THREE.Mesh(
        new THREE.SphereGeometry(0.1 + i * 0.03, 5, 4),
        mat(`smoke-${i}`, 0xb4b4be, { transparent: true, opacity: 0.35 - i * 0.08, roughness: 1 }),
      );
      smoke.position.set(0.2, h + 0.4 + i * 0.18, -0.1);
      smoke.userData.smoke = i;
      group.add(smoke);
    }
  }

  if (kind === 'tower' || kind === 'skyscraper') {
    const antenna = box(0.03, 0.35, 0.03, mat('antenna', 0xc0d0e0, { metalness: 0.6 }), h + 0.18);
    group.add(antenna);
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 6, 6),
      mat('beacon', 0xff6060, { emissive: 0xff2020, emissiveIntensity: 1 }),
    );
    beacon.position.y = h + 0.38;
    beacon.userData.beacon = true;
    group.add(beacon);
  }

  return group;
}

/** アニメ用: 煙・木・ビーコン・クレーンを時間で更新 */
export function animateBuilding(group: THREE.Group, time: number): void {
  const variant = (group.userData.variant as number) ?? 0;
  group.traverse((obj) => {
    if (!(obj instanceof THREE.Object3D)) return;
    if (obj.userData.sway != null) {
      obj.rotation.z = Math.sin(time * 1.5 + obj.userData.sway) * 0.06;
    }
    if (obj.userData.smoke != null) {
      const i = obj.userData.smoke as number;
      const baseY = (group.userData.kind === 'industrial' ? buildingHeight('industrial', group.userData.tier, 0) : 1) + 0.4;
      obj.position.y = baseY + i * 0.18 + ((time * 0.4 + i * 0.3) % 0.5);
      obj.position.x = 0.2 + Math.sin(time + i) * 0.05;
      const m = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (m.opacity != null) m.opacity = 0.3 - i * 0.08;
    }
    if (obj.userData.beacon) {
      const on = Math.sin(time * 3 + variant) > 0.3;
      const m = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = on ? 1.2 : 0.15;
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
}
