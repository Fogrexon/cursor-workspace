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

function buildingHeight(kind: TileKind, tier: number, construction: number, footprint = 1): number {
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

/** 直方体ファサード1面ぶんの窓を、建物の実寸に合わせて配置 */
function addWindowsOnFace(
  group: THREE.Group,
  face: 'front' | 'back' | 'left' | 'right',
  w: number,
  d: number,
  y0: number,
  y1: number,
  kind: TileKind,
  variant: number,
  faceIndex: number,
): void {
  const spanH = y1 - y0;
  if (spanH < 0.18) return;

  const faceWidth = face === 'front' || face === 'back' ? w : d;
  const rows = Math.max(1, Math.floor(spanH / 0.26));
  const cols = Math.max(
    1,
    kind === 'skyscraper'
      ? Math.round(faceWidth / 0.22)
      : kind === 'tower'
        ? Math.round(faceWidth / 0.2)
        : Math.max(2, Math.round(faceWidth / 0.28) + (variant % 2)),
  );

  const winMatOn = mat('win-on', 0xffe8a0, {
    emissive: 0xffc860,
    emissiveIntensity: 0.85,
    roughness: 0.4,
  });
  const winMatOff = mat('win-off', 0x1a2530, { roughness: 0.6 });
  const winMatBlue = mat('win-blue', 0x6a90b8, {
    emissive: 0x204060,
    emissiveIntensity: 0.25,
    roughness: 0.35,
    metalness: 0.4,
  });

  const style = variant % 4;
  const inset = 0.04;
  const usable = Math.max(0.12, faceWidth - inset * 2);
  const marginY = Math.min(0.08, spanH * 0.08);
  const usableH = Math.max(0.1, spanH - marginY * 2);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const lit = ((variant * 7 + row * 3 + col * 5 + faceIndex * 11) % 10) > 4;
      let m: THREE.Material = lit ? winMatOn : winMatOff;
      if (kind === 'skyscraper' || kind === 'tower') {
        m = style === 0 || style === 2 ? winMatBlue : lit ? winMatOn : winMatOff;
      }

      const cellW = usable / cols;
      const cellH = usableH / rows;
      const ww = cellW * (style === 1 ? 0.62 : 0.52);
      const wh = cellH * (style === 3 ? 0.7 : 0.55);
      const along = -usable / 2 + (col + 0.5) * cellW;
      const wy = y0 + marginY + (row + 0.5) * cellH;

      if (face === 'front' || face === 'back') {
        const z = face === 'front' ? d / 2 + 0.012 : -d / 2 - 0.012;
        const win = box(ww, wh, 0.02, m, wy);
        win.position.x = along;
        win.position.z = z;
        group.add(win);
      } else {
        const x = face === 'right' ? w / 2 + 0.012 : -w / 2 - 0.012;
        const win = box(0.02, wh, ww, m, wy);
        win.position.x = x;
        win.position.z = along;
        group.add(win);
      }
    }
  }
}

/** 1つの直方体セグメントの4面に窓を付ける */
function addWindowsOnBox(
  group: THREE.Group,
  w: number,
  d: number,
  y0: number,
  y1: number,
  kind: TileKind,
  variant: number,
): void {
  if (kind === 'station' || kind === 'park' || kind === 'plaza') return;
  addWindowsOnFace(group, 'front', w, d, y0, y1, kind, variant, 0);
  addWindowsOnFace(group, 'back', w, d, y0, y1, kind, variant, 1);
  addWindowsOnFace(group, 'left', w, d, y0, y1, kind, variant, 2);
  addWindowsOnFace(group, 'right', w, d, y0, y1, kind, variant, 3);
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

  const ridge = box(0.04, 0.04, depth * 1.02, roofMat, 0);
  ridge.position.set(0, rise + 0.01, 0);
  g.add(ridge);

  return g;
}

function makeFlatRoof(w: number, d: number, color: number, y: number): THREE.Mesh {
  return box(w * 1.02, 0.05, d * 1.02, mat(`flat-roof-${color}`, color, { roughness: 0.9 }), y);
}

function makeHipRoof(w: number, d: number, color: number): THREE.Group {
  const g = new THREE.Group();
  const roofMat = mat(`hip-${color}`, color, { roughness: 0.78 });
  const top = box(w * 0.55, 0.04, d * 0.55, roofMat, 0.12);
  g.add(top);
  const skirt = box(w * 1.05, 0.03, d * 1.05, roofMat, 0.02);
  g.add(skirt);
  return g;
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

function bodyColorFor(kind: TileKind, variant: number): number {
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

function footprintSize(kind: TileKind, footprint: number): { w: number; d: number } {
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
  };

  if (kind === 'park') {
    for (let i = 0; i < 3; i++) {
      const tree = makeTree(tile.variant + i);
      tree.position.set((i - 1) * 0.28, 0, (i % 2) * 0.15 - 0.05);
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

  const fp = Math.max(1, tile.footprint || 1);
  const h = buildingHeight(kind, tile.tier, tile.construction, fp);
  const { w, d } = footprintSize(kind, fp);
  const bodyColor = bodyColorFor(kind, tile.variant);
  const isGlass = kind === 'skyscraper' || kind === 'tower';
  const bodyMat = mat(`body-${kind}-v${tile.variant % 8}-fp${fp}`, bodyColor, {
    roughness: isGlass ? 0.28 + (tile.variant % 3) * 0.08 : 0.75 + (tile.variant % 3) * 0.05,
    metalness: isGlass ? 0.4 : 0.08,
  });

  /** 窓を載せる直方体セグメント [w, d, y0, y1] */
  const windowSegments: Array<{ w: number; d: number; y0: number; y1: number }> = [];

  // 塔・超高層: セットバックや段差
  if (kind === 'tower' || kind === 'skyscraper') {
    const style = tile.variant % 4;
    if (style === 0) {
      group.add(box(w, h, d, bodyMat, h / 2));
      windowSegments.push({ w, d, y0: 0.12, y1: h * 0.96 });
    } else if (style === 1) {
      const h1 = h * 0.62;
      const h2 = h * 0.38;
      group.add(box(w, h1, d, bodyMat, h1 / 2));
      group.add(box(w * 0.72, h2, d * 0.72, bodyMat, h1 + h2 / 2));
      windowSegments.push({ w, d, y0: 0.12, y1: h1 * 0.96 });
      windowSegments.push({ w: w * 0.72, d: d * 0.72, y0: h1 + 0.04, y1: h1 + h2 * 0.96 });
    } else if (style === 2) {
      const baseH = h * 0.22;
      const shaftH = h - baseH;
      group.add(box(w * 1.05, baseH, d * 1.05, bodyMat, baseH / 2));
      group.add(box(w * 0.78, shaftH, d * 0.78, bodyMat, baseH + shaftH / 2));
      windowSegments.push({ w: w * 1.05, d: d * 1.05, y0: 0.1, y1: baseH * 0.92 });
      windowSegments.push({
        w: w * 0.78,
        d: d * 0.78,
        y0: baseH + 0.04,
        y1: baseH + shaftH * 0.96,
      });
    } else {
      const s1 = h * 0.4;
      const s2 = h * 0.35;
      const s3 = h * 0.25;
      group.add(box(w, s1, d, bodyMat, s1 / 2));
      group.add(box(w * 0.82, s2, d * 0.82, bodyMat, s1 + s2 / 2));
      group.add(box(w * 0.58, s3, d * 0.58, bodyMat, s1 + s2 + s3 / 2));
      windowSegments.push({ w, d, y0: 0.12, y1: s1 * 0.96 });
      windowSegments.push({ w: w * 0.82, d: d * 0.82, y0: s1 + 0.04, y1: s1 + s2 * 0.96 });
      windowSegments.push({
        w: w * 0.58,
        d: d * 0.58,
        y0: s1 + s2 + 0.04,
        y1: s1 + s2 + s3 * 0.96,
      });
    }
  } else if (kind === 'industrial' && tile.variant % 3 === 1) {
    const wh = h * 0.85;
    group.add(box(w * 1.1, wh, d * 0.9, bodyMat, wh / 2));
    windowSegments.push({ w: w * 1.1, d: d * 0.9, y0: 0.15, y1: wh * 0.9 });
  } else if (kind === 'residential' && tile.variant % 4 === 2 && tile.tier <= 2) {
    group.add(box(w, h, d * 0.55, bodyMat, h / 2));
    const wing = box(w * 0.45, h * 0.9, d, bodyMat, (h * 0.9) / 2);
    wing.position.x = w * 0.28;
    group.add(wing);
    windowSegments.push({ w, d: d * 0.55, y0: 0.12, y1: h * 0.92 });
    // 翼はオフセットしているので簡易的に本体側のみ窓（翼は別途）
    windowSegments.push({
      w: w * 0.45,
      d,
      y0: 0.12,
      y1: h * 0.85,
    });
  } else {
    group.add(box(w, h, d, bodyMat, h / 2));
    windowSegments.push({ w, d, y0: 0.12, y1: h * 0.96 });
  }

  if (tile.construction > 0) {
    const progress = Math.max(0.12, 1 - tile.construction / 48);
    const bodyMeshes = group.children.filter((c) => c instanceof THREE.Mesh) as THREE.Mesh[];
    for (const bm of bodyMeshes) {
      bm.material = mat(`body-build-${kind}`, bodyColor, {
        transparent: true,
        opacity: 0.35 + progress * 0.5,
        roughness: 0.9,
      });
    }
    group.add(makeScaffold(w, Math.max(h, 0.4), d, time, tile.variant, progress));
    group.userData.buildingProgress = progress;
    return group;
  }

  for (const seg of windowSegments) {
    // L字翼の窓は x オフセットが必要なので、簡易グループでずらす
    if (
      kind === 'residential' &&
      tile.variant % 4 === 2 &&
      tile.tier <= 2 &&
      Math.abs(seg.w - w * 0.45) < 0.01
    ) {
      const wingGroup = new THREE.Group();
      wingGroup.position.x = w * 0.28;
      addWindowsOnBox(wingGroup, seg.w, seg.d, seg.y0, seg.y1, kind, tile.variant);
      group.add(wingGroup);
    } else {
      addWindowsOnBox(group, seg.w, seg.d, seg.y0, seg.y1, kind, tile.variant);
    }
  }

  if (kind === 'residential') {
    const roofStyle = tile.variant % 4;
    const roofColor = [0xa04040, 0x805030, 0x706050, 0xb05040][roofStyle]!;
    if (tile.tier <= 2) {
      if (roofStyle === 0 || roofStyle === 1) {
        const roof = makeRoof(w, d, roofColor + tile.variant * 0x040404);
        roof.position.y = h;
        group.add(roof);
      } else if (roofStyle === 2) {
        const hip = makeHipRoof(w, d, roofColor);
        hip.position.y = h;
        group.add(hip);
      } else {
        group.add(makeFlatRoof(w, d, 0x808890, h + 0.025));
      }
    } else {
      group.add(makeFlatRoof(w, d, 0x707880, h + 0.025));
    }
    // 玄関ポーチ
    if (tile.variant % 3 === 0 && tile.tier <= 2) {
      const porch = box(0.2, 0.08, 0.12, mat('porch', 0x8a7060), 0.08);
      porch.position.z = d / 2 + 0.06;
      group.add(porch);
    }
  }

  if (kind === 'commercial') {
    // 看板・庇
    const awningColor = [0xc04040, 0x4060a0, 0xd0a040, 0x40a060][tile.variant % 4]!;
    const awning = box(w * 0.95, 0.04, 0.14, mat(`awning-${awningColor}`, awningColor), h * 0.35);
    awning.position.z = d / 2 + 0.06;
    group.add(awning);
    if (tile.variant % 2 === 0) {
      const sign = box(0.28, 0.1, 0.03, mat(`com-sign-${tile.variant}`, 0xe0e0e8, { emissive: 0x404050, emissiveIntensity: 0.3 }), h * 0.55);
      sign.position.z = d / 2 + 0.03;
      group.add(sign);
    }
    if (tile.tier >= 2) {
      group.add(makeFlatRoof(w, d, 0x607080, h + 0.025));
    }
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
    const sign = box(0.28, 0.12, 0.03, mat('sign', 0xe0c040, { emissive: 0x806000, emissiveIntensity: 0.5 }), h * 0.55);
    sign.position.z = d / 2 + 0.03;
    group.add(sign);
  }

  if (kind === 'industrial') {
    const hasChimney = tile.variant % 3 !== 2;
    if (hasChimney) {
      const chimney = box(0.14, h + 0.35, 0.14, mat('chimney', 0x6a6058), (h + 0.35) / 2);
      chimney.position.set(0.2, 0, -0.1);
      group.add(chimney);
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
    // のこぎり屋根
    if (tile.variant % 3 === 0) {
      for (let i = 0; i < 2; i++) {
        const tooth = box(w * 0.35, 0.12, d * 0.9, mat('sawtooth', 0x9a9080), h + 0.06);
        tooth.position.x = (i - 0.5) * w * 0.4;
        group.add(tooth);
      }
    } else {
      group.add(makeFlatRoof(w, d, 0x6a6860, h + 0.025));
    }
  }

  if (kind === 'tower' || kind === 'skyscraper') {
    const antennaH = fp >= 2 ? 0.55 : 0.35;
    const antenna = box(0.03, antennaH, 0.03, mat('antenna', 0xc0d0e0, { metalness: 0.6 }), h + antennaH / 2);
    group.add(antenna);
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(fp >= 2 ? 0.07 : 0.05, 6, 6),
      mat('beacon', 0xff6060, { emissive: 0xff2020, emissiveIntensity: 1 }),
    );
    beacon.position.y = h + antennaH + 0.04;
    beacon.userData.beacon = true;
    group.add(beacon);
    // 屋上機械室
    if (tile.variant % 2 === 0) {
      const mech = box(w * 0.25, 0.12, d * 0.2, mat('mech', 0x8090a0, { metalness: 0.3 }), h + 0.06);
      mech.position.set(-w * 0.25, 0, -d * 0.2);
      group.add(mech);
    }
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
      const baseY =
        (group.userData.kind === 'industrial'
          ? buildingHeight('industrial', group.userData.tier, 0)
          : 1) + 0.4;
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
