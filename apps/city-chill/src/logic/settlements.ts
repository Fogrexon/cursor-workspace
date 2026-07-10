import type { Settlement, SettlementLevel, Tile, TileKind } from '../types';
import { mergeFacing } from './connections';
import { BUILDING_KINDS, getTile, idx, inBounds, makeTile, neighbors4, ROAD_LIKE } from './grid';
import { chance, pickInt } from './rng';

type Rng = () => number;

/** 初期集落に付ける町名プール */
const TOWN_NAMES = [
  '青葉',
  '緑ヶ丘',
  '桜台',
  '日向',
  '風見',
  '白砂',
  '山手',
  '朝霧',
  '紅葉',
  '金星',
  '鈴蘭',
  '潮見',
  '若葉',
  '霞丘',
  '月見',
  '星川',
] as const;

const DEVELOPED: ReadonlySet<TileKind> = new Set([
  ...BUILDING_KINDS,
  'road',
  'rail',
  'crossing',
  'bridge',
  'station',
]);

/**
 * 周辺の開発タイル数（settlementDevelopment の結果）から、その街の都会度を返す。
 * グローバルの stage（全体人口ベース）とは独立して街ごとに算出する。
 */
export function settlementLevelFromDevelopment(devCount: number): SettlementLevel {
  if (devCount < 18) return 'hamlet';
  if (devCount < 55) return 'village';
  if (devCount < 130) return 'town';
  if (devCount < 280) return 'city';
  return 'metropolis';
}

/** 初期集落の成長段階（ほぼ空〜中規模町） */
export type SeedMaturity = 'hamlet' | 'village' | 'borough' | 'town';

/** SeedMaturity から初期 SettlementLevel へのマッピング */
function seedMaturityToLevel(maturity: SeedMaturity): SettlementLevel {
  switch (maturity) {
    case 'hamlet': return 'hamlet';
    case 'village': return 'village';
    case 'borough': return 'village';
    case 'town': return 'town';
  }
}

function pickTownName(rng: Rng, used: Set<string>): string {
  const free = TOWN_NAMES.filter((n) => !used.has(n));
  const pool = free.length > 0 ? free : [...TOWN_NAMES];
  const name = pool[pickInt(rng, 0, pool.length - 1)]!;
  used.add(name);
  return name;
}

function carveRoad(
  tiles: Tile[],
  width: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): void {
  let x = x0;
  let y = y0;
  while (x !== x1 || y !== y1) {
    const t = tiles[idx(x, y, width)]!;
    if (t.kind !== 'water') {
      const axis = x !== x1 ? 'x' : 'z';
      const facing =
        t.kind === 'road' || t.kind === 'crossing' || t.kind === 'bridge'
          ? mergeFacing(t.facing, axis)
          : axis;
      tiles[idx(x, y, width)] = makeTile('road', 0, 0, 0, facing);
    }
    if (x !== x1) x += x < x1 ? 1 : -1;
    else if (y !== y1) y += y < y1 ? 1 : -1;
  }
  const end = tiles[idx(x1, y1, width)]!;
  if (end.kind !== 'water') {
    const axis = x0 !== x1 ? 'x' : 'z';
    const facing =
      end.kind === 'road' || end.kind === 'crossing' || end.kind === 'bridge'
        ? mergeFacing(end.facing, axis)
        : axis;
    tiles[idx(x1, y1, width)] = makeTile('road', 0, 0, 0, facing);
  }
}


/** 道路骨格の形 */
type RoadShape = 'cross' | 'tee' | 'ell' | 'strip' | 'branch' | 'loop';

function pickSeedMaturity(rng: Rng, index: number, total: number): SeedMaturity {
  // マップに複数あるときは規模をばらけさせる
  if (total >= 3) {
    if (index === 0) return chance(rng, 0.55) ? 'borough' : 'town';
    if (index === 1) return chance(rng, 0.6) ? 'hamlet' : 'village';
  }
  const roll = rng();
  if (roll < 0.22) return 'hamlet';
  if (roll < 0.55) return 'village';
  if (roll < 0.82) return 'borough';
  return 'town';
}

function pickRoadShape(rng: Rng, maturity: SeedMaturity): RoadShape {
  if (maturity === 'hamlet') {
    const r = rng();
    if (r < 0.35) return 'ell';
    if (r < 0.65) return 'strip';
    if (r < 0.85) return 'tee';
    return 'cross';
  }
  if (maturity === 'village') {
    const r = rng();
    if (r < 0.25) return 'cross';
    if (r < 0.45) return 'tee';
    if (r < 0.65) return 'ell';
    if (r < 0.85) return 'branch';
    return 'strip';
  }
  if (maturity === 'borough') {
    const r = rng();
    if (r < 0.2) return 'cross';
    if (r < 0.4) return 'branch';
    if (r < 0.6) return 'loop';
    if (r < 0.8) return 'tee';
    return 'ell';
  }
  const r = rng();
  if (r < 0.25) return 'loop';
  if (r < 0.5) return 'branch';
  if (r < 0.7) return 'cross';
  if (r < 0.85) return 'tee';
  return 'ell';
}

function placeBuildingSafe(
  tiles: Tile[],
  width: number,
  height: number,
  x: number,
  y: number,
  kind: Tile['kind'],
  tier: number,
  rng: Rng,
): void {
  if (x <= 0 || y <= 0 || x >= width - 1 || y >= height - 1) return;
  const t = tiles[idx(x, y, width)]!;
  if (t.kind === 'water' || t.kind === 'road' || t.kind === 'crossing' || t.kind === 'bridge') {
    return;
  }
  tiles[idx(x, y, width)] = makeTile(kind, tier, pickInt(rng, 0, 3));
}

/** 中心からランダム長の腕を伸ばす（非対称クロス用） */
function carveArm(
  tiles: Tile[],
  width: number,
  cx: number,
  cy: number,
  dx: number,
  dy: number,
  len: number,
): void {
  if (len <= 0) return;
  carveRoad(tiles, width, cx, cy, cx + dx * len, cy + dy * len);
}

function carveRoadSkeleton(
  tiles: Tile[],
  width: number,
  height: number,
  cx: number,
  cy: number,
  rng: Rng,
  maturity: SeedMaturity,
): void {
  const shape = pickRoadShape(rng, maturity);
  const scale =
    maturity === 'hamlet' ? 1 : maturity === 'village' ? 2 : maturity === 'borough' ? 3 : 4;
  // 東西・南北の伸びをばらけさせる
  const stretchX = scale + pickInt(rng, 0, 2) + (chance(rng, 0.4) ? 1 : 0);
  const stretchY = scale + pickInt(rng, 0, 2) + (chance(rng, 0.4) ? 1 : 0);
  const flip = chance(rng, 0.5);

  const armE = stretchX - pickInt(rng, 0, Math.min(2, stretchX - 1));
  const armW = stretchX - pickInt(rng, 0, Math.min(2, stretchX - 1));
  const armN = stretchY - pickInt(rng, 0, Math.min(2, stretchY - 1));
  const armS = stretchY - pickInt(rng, 0, Math.min(2, stretchY - 1));

  if (shape === 'strip') {
    if (flip) carveRoad(tiles, width, cx - armW, cy, cx + armE, cy);
    else carveRoad(tiles, width, cx, cy - armN, cx, cy + armS);
    // たまに短い枝
    if (chance(rng, 0.55)) {
      const spur = pickInt(rng, 1, Math.max(1, scale));
      const along = pickInt(rng, -Math.min(armW, armE), Math.min(armW, armE));
      if (flip) carveArm(tiles, width, cx + along, cy, 0, chance(rng, 0.5) ? 1 : -1, spur);
      else carveArm(tiles, width, cx, cy + along, chance(rng, 0.5) ? 1 : -1, 0, spur);
    }
    return;
  }

  if (shape === 'ell') {
    // L字: 2方向だけ（向きランダム）
    const dirs: Array<[number, number, number]> = [
      [1, 0, armE],
      [-1, 0, armW],
      [0, 1, armS],
      [0, -1, armN],
    ];
    // シャッフルして2本
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = pickInt(rng, 0, i);
      const tmp = dirs[i]!;
      dirs[i] = dirs[j]!;
      dirs[j] = tmp;
    }
    carveArm(tiles, width, cx, cy, dirs[0]![0], dirs[0]![1], dirs[0]![2]);
    carveArm(tiles, width, cx, cy, dirs[1]![0], dirs[1]![1], dirs[1]![2]);
    return;
  }

  if (shape === 'tee') {
    // T字: 幹線 + 片側の枝
    if (flip) {
      carveRoad(tiles, width, cx - armW, cy, cx + armE, cy);
      carveArm(tiles, width, cx, cy, 0, chance(rng, 0.5) ? 1 : -1, Math.max(armN, armS));
    } else {
      carveRoad(tiles, width, cx, cy - armN, cx, cy + armS);
      carveArm(tiles, width, cx, cy, chance(rng, 0.5) ? 1 : -1, 0, Math.max(armE, armW));
    }
    return;
  }

  if (shape === 'cross') {
    carveArm(tiles, width, cx, cy, 1, 0, armE);
    carveArm(tiles, width, cx, cy, -1, 0, armW);
    carveArm(tiles, width, cx, cy, 0, 1, armS);
    carveArm(tiles, width, cx, cy, 0, -1, armN);
    return;
  }

  if (shape === 'branch') {
    // 幹線 + ランダムな位置から枝
    if (flip) {
      carveRoad(tiles, width, cx - armW, cy, cx + armE, cy);
      const branches = 1 + pickInt(rng, 0, maturity === 'town' ? 3 : 2);
      for (let i = 0; i < branches; i++) {
        const along = pickInt(rng, -armW, armE);
        const len = pickInt(rng, 1, stretchY);
        carveArm(tiles, width, cx + along, cy, 0, chance(rng, 0.5) ? 1 : -1, len);
      }
    } else {
      carveRoad(tiles, width, cx, cy - armN, cx, cy + armS);
      const branches = 1 + pickInt(rng, 0, maturity === 'town' ? 3 : 2);
      for (let i = 0; i < branches; i++) {
        const along = pickInt(rng, -armN, armS);
        const len = pickInt(rng, 1, stretchX);
        carveArm(tiles, width, cx, cy + along, chance(rng, 0.5) ? 1 : -1, 0, len);
      }
    }
    // たまに短い平行路
    if (maturity !== 'hamlet' && chance(rng, 0.4)) {
      const off = pickInt(rng, 2, Math.max(2, scale + 1)) * (chance(rng, 0.5) ? 1 : -1);
      if (flip) {
        const y2 = cy + off;
        if (y2 > 0 && y2 < height - 1) {
          carveRoad(
            tiles,
            width,
            cx - pickInt(rng, 1, armW),
            y2,
            cx + pickInt(rng, 1, armE),
            y2,
          );
        }
      } else {
        const x2 = cx + off;
        if (x2 > 0 && x2 < width - 1) {
          carveRoad(
            tiles,
            width,
            x2,
            cy - pickInt(rng, 1, armN),
            x2,
            cy + pickInt(rng, 1, armS),
          );
        }
      }
    }
    return;
  }

  // loop: いびつな四角（辺の長さをばらけさせ、たまに1辺欠ける）
  const left = armW;
  const right = armE;
  const top = armN;
  const bottom = armS;
  const skip = chance(rng, 0.35) ? pickInt(rng, 0, 3) : -1;
  if (skip !== 0) carveRoad(tiles, width, cx - left, cy - top, cx + right, cy - top);
  if (skip !== 1) carveRoad(tiles, width, cx - left, cy + bottom, cx + right, cy + bottom);
  if (skip !== 2) carveRoad(tiles, width, cx - left, cy - top, cx - left, cy + bottom);
  if (skip !== 3) carveRoad(tiles, width, cx + right, cy - top, cx + right, cy + bottom);
  // 内部の十字や斜め接続
  if (chance(rng, 0.7)) {
    carveRoad(tiles, width, cx - pickInt(rng, 0, left), cy, cx + pickInt(rng, 0, right), cy);
  }
  if (chance(rng, 0.55)) {
    carveRoad(tiles, width, cx, cy - pickInt(rng, 0, top), cx, cy + pickInt(rng, 0, bottom));
  }
}

function pickBuildingKind(
  rng: Rng,
  maturity: SeedMaturity,
  index: number,
): { kind: Tile['kind']; tier: number } {
  const roll = rng();
  if (maturity === 'hamlet') {
    if (roll < 0.75) return { kind: 'residential', tier: 1 };
    return { kind: 'park', tier: 1 };
  }
  if (maturity === 'village') {
    if (roll < 0.55) return { kind: 'residential', tier: 1 };
    if (roll < 0.75) return { kind: 'commercial', tier: 1 };
    if (roll < 0.9) return { kind: 'park', tier: 1 };
    return { kind: 'industrial', tier: 1 };
  }
  if (maturity === 'borough') {
    if (index === 0 && chance(rng, 0.45)) return { kind: 'school', tier: 1 };
    if (roll < 0.45) return { kind: 'residential', tier: chance(rng, 0.35) ? 2 : 1 };
    if (roll < 0.65) return { kind: 'commercial', tier: 1 };
    if (roll < 0.78) return { kind: 'industrial', tier: 1 };
    if (roll < 0.9) return { kind: 'park', tier: 1 };
    return { kind: 'plaza', tier: 1 };
  }
  // town
  if (index === 0 && chance(rng, 0.55)) return { kind: 'school', tier: 1 };
  if (index === 1 && chance(rng, 0.4)) return { kind: 'hospital', tier: 1 };
  if (roll < 0.4) return { kind: 'residential', tier: chance(rng, 0.5) ? 2 : 1 };
  if (roll < 0.58) return { kind: 'commercial', tier: chance(rng, 0.4) ? 2 : 1 };
  if (roll < 0.72) return { kind: 'industrial', tier: 1 };
  if (roll < 0.84) return { kind: 'park', tier: 1 };
  if (roll < 0.92) return { kind: 'plaza', tier: 1 };
  return { kind: 'residential', tier: 1 };
}

/** 道路に面した空き地へ建物をばらまく */
function scatterBuildingsAlongRoads(
  tiles: Tile[],
  width: number,
  height: number,
  cx: number,
  cy: number,
  rng: Rng,
  maturity: SeedMaturity,
  scanR: number,
): void {
  const target =
    maturity === 'hamlet'
      ? pickInt(rng, 1, 3)
      : maturity === 'village'
        ? pickInt(rng, 4, 7)
        : maturity === 'borough'
          ? pickInt(rng, 8, 14)
          : pickInt(rng, 14, 24);

  const candidates: Array<{ x: number; y: number; score: number }> = [];
  for (let y = cy - scanR; y <= cy + scanR; y++) {
    for (let x = cx - scanR; x <= cx + scanR; x++) {
      if (x <= 0 || y <= 0 || x >= width - 1 || y >= height - 1) continue;
      const t = tiles[idx(x, y, width)]!;
      if (t.kind !== 'grass' && t.kind !== 'empty' && t.kind !== 'forest') continue;
      if (!neighbors4(x, y, width, height).some((n) => ROAD_LIKE.has(tiles[idx(n.x, n.y, width)]!.kind))) {
        continue;
      }
      const dist = Math.hypot(x - cx, y - cy);
      // 中心寄りをやや優先しつつ乱数で混ぜる
      candidates.push({ x, y, score: 3 - dist * 0.15 + rng() * 2.5 });
    }
  }
  candidates.sort((a, b) => b.score - a.score);

  const used = new Set<string>();
  let placed = 0;
  const pool = candidates.slice(0, Math.min(candidates.length, target * 3 + 8));
  // 上位からランダムに間引きながら置く
  while (placed < target && pool.length > 0) {
    const i = pickInt(rng, 0, Math.min(pool.length - 1, Math.max(2, Math.floor(pool.length * 0.4))));
    const c = pool.splice(i, 1)[0]!;
    const key = `${c.x},${c.y}`;
    if (used.has(key)) continue;
    // 隣が既に建物なら少し避ける（塊になりすぎ防止、ただし完全禁止ではない）
    const crowded = neighbors4(c.x, c.y, width, height).filter((n) =>
      BUILDING_KINDS.has(tiles[idx(n.x, n.y, width)]!.kind),
    ).length;
    if (crowded >= 3 && chance(rng, 0.7)) continue;
    const { kind, tier } = pickBuildingKind(rng, maturity, placed);
    placeBuildingSafe(tiles, width, height, c.x, c.y, kind, tier, rng);
    if (BUILDING_KINDS.has(tiles[idx(c.x, c.y, width)]!.kind)) {
      used.add(key);
      placed += 1;
    }
  }
}

/**
 * 集落の初期レイアウト。
 * 道路骨格をランダムに選び、建物は道路沿いにばらまく。
 */
function placeStarterBuildings(
  tiles: Tile[],
  width: number,
  height: number,
  cx: number,
  cy: number,
  rng: Rng,
  maturity: SeedMaturity,
): number {
  carveRoadSkeleton(tiles, width, height, cx, cy, rng, maturity);
  const scanR =
    maturity === 'hamlet' ? 3 : maturity === 'village' ? 5 : maturity === 'borough' ? 7 : 9;
  // loop 形状など一部のケースで中心タイルが道路に含まれないことがある。
  // 村の核として ±2 タイルは必ず非森地にする。
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (!inBounds(nx, ny, width, height)) continue;
      const t = tiles[idx(nx, ny, width)]!;
      if (t.kind === 'forest') tiles[idx(nx, ny, width)] = makeTile('grass');
    }
  }
  scatterBuildingsAlongRoads(tiles, width, height, cx, cy, rng, maturity, scanR);
  return scanR + 4;
}

/**
 * マップ上に複数の小さな村を配置する。
 * 大きいマップほど集落数を増やす（都市間が遠すぎない密度にする）。
 * 各集落は hamlet〜town まで成長段階がばらつく。
 */
export function seedSettlements(
  tiles: Tile[],
  width: number,
  height: number,
  rng: Rng,
): Settlement[] {
  const area = width * height;
  // 128² では 5〜8、それ以上の巨大マップでは 8〜12
  const count =
    area >= 200 * 200
      ? pickInt(rng, 8, 12)
      : area >= 100 * 100
        ? pickInt(rng, 5, 8)
        : area >= 80 * 80
          ? pickInt(rng, 3, 5)
          : 1;

  // 密集しすぎず、かつ目標数を置ける最短距離
  const minDist = Math.max(
    22,
    Math.floor(
      Math.min(width, height) *
        (area >= 200 * 200 ? 0.13 : area >= 100 * 100 ? 0.16 : 0.22),
    ),
  );
  const margin = Math.max(12, Math.floor(Math.min(width, height) * 0.08));
  const settlements: Settlement[] = [];
  const usedNames = new Set<string>();

  const tryPlace = (cx: number, cy: number, id: number, dist: number): boolean => {
    for (const s of settlements) {
      if (Math.hypot(cx - s.cx, cy - s.cy) < dist) return false;
    }
    const maturity = pickSeedMaturity(rng, settlements.length, count);
    const radius = placeStarterBuildings(tiles, width, height, cx, cy, rng, maturity);
    settlements.push({
      id,
      name: pickTownName(rng, usedNames),
      cx,
      cy,
      radius,
      level: seedMaturityToLevel(maturity),
    });
    return true;
  };

  // 1つ目は中央寄り
  const midX = Math.floor(width / 2 + (rng() - 0.5) * width * 0.15);
  const midY = Math.floor(height / 2 + (rng() - 0.5) * height * 0.15);
  tryPlace(
    Math.max(margin, Math.min(width - margin - 1, midX)),
    Math.max(margin, Math.min(height - margin - 1, midY)),
    0,
    minDist,
  );

  let guard = 0;
  let dist = minDist;
  while (settlements.length < count && guard++ < 240) {
    const cx = pickInt(rng, margin, width - margin - 1);
    const cy = pickInt(rng, margin, height - margin - 1);
    if (tryPlace(cx, cy, settlements.length, dist)) continue;
    // 置ききれないときは少し距離を緩める
    if (guard > 120 && settlements.length < count * 0.7) {
      dist = Math.max(24, Math.floor(dist * 0.92));
    }
  }

  // 最低2集落（広いマップ）
  if (count >= 3 && settlements.length < 2) {
    const cx = Math.max(margin, width - margin - 20);
    const cy = Math.max(margin, height - margin - 20);
    tryPlace(cx, cy, settlements.length, 24);
  }

  return settlements;
}

/** 集落の発展度（周辺の開発タイル数） */
export function settlementDevelopment(
  tiles: Tile[],
  width: number,
  height: number,
  s: Settlement,
): number {
  let n = 0;
  const r = Math.ceil(s.radius) + 4;
  for (let y = s.cy - r; y <= s.cy + r; y++) {
    for (let x = s.cx - r; x <= s.cx + r; x++) {
      if (!inBounds(x, y, width, height)) continue;
      if (Math.hypot(x - s.cx, y - s.cy) > r) continue;
      if (DEVELOPED.has(tiles[idx(x, y, width)]!.kind)) n += 1;
    }
  }
  return n;
}

/** 建設対象の集落を選ぶ（発展度で重み付け、たまに小さい村も伸ばす） */
export function pickSettlement(
  settlements: Settlement[],
  tiles: Tile[],
  width: number,
  height: number,
  rng: Rng,
): Settlement | null {
  if (settlements.length === 0) return null;
  if (settlements.length === 1) return settlements[0]!;

  const weights = settlements.map((s) => {
    const dev = settlementDevelopment(tiles, width, height, s);
    // 小さい村にもチャンスを残す
    return 0.4 + Math.sqrt(dev + 1);
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < settlements.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return settlements[i]!;
  }
  return settlements[settlements.length - 1]!;
}

/** 集落中心を建物の重心へゆっくり追従し、半径を更新（線路・駅だけでは引っ張らない） */
export function refreshSettlementCenters(
  settlements: Settlement[],
  tiles: Tile[],
  width: number,
  height: number,
): void {
  for (const s of settlements) {
    let sx = 0;
    let sy = 0;
    let n = 0;
    const r = Math.ceil(s.radius) + 8;
    for (let y = s.cy - r; y <= s.cy + r; y++) {
      for (let x = s.cx - r; x <= s.cx + r; x++) {
        if (!inBounds(x, y, width, height)) continue;
        if (Math.hypot(x - s.cx, y - s.cy) > r) continue;
        const t = tiles[idx(x, y, width)]!;
        // 道路・線路・空駅では町を広げない。建物のみ
        if (!BUILDING_KINDS.has(t.kind) || t.kind === 'station') continue;
        sx += x;
        sy += y;
        n += 1;
      }
    }
    if (n > 6) {
      s.cx = Math.round(s.cx * 0.7 + (sx / n) * 0.3);
      s.cy = Math.round(s.cy * 0.7 + (sy / n) * 0.3);
      s.radius = Math.min(48, Math.max(10, Math.sqrt(n) * 1.25));
    }
    // 開発タイル数から街レベルを更新（グローバル stage と独立）
    const dev = settlementDevelopment(tiles, width, height, s);
    s.level = settlementLevelFromDevelopment(dev);
  }
}

/**
 * 近い集落が道路でつながっていれば合体。
 * 合体した側の id を残し、吸収された id を返す。
 */
export function mergeNearbySettlements(
  settlements: Settlement[],
  tiles: Tile[],
  width: number,
  height: number,
): { merged: boolean; absorbedId: number | null } {
  if (settlements.length < 2) return { merged: false, absorbedId: null };

  for (let i = 0; i < settlements.length; i++) {
    for (let j = i + 1; j < settlements.length; j++) {
      const a = settlements[i]!;
      const b = settlements[j]!;
      const dist = Math.hypot(a.cx - b.cx, a.cy - b.cy);
      const touch = a.radius + b.radius + 6;
      if (dist > touch) continue;
      if (!roadConnected(tiles, width, height, a, b)) continue;

      // a に吸収
      const wA = settlementDevelopment(tiles, width, height, a);
      const wB = settlementDevelopment(tiles, width, height, b);
      const keep = wA >= wB ? a : b;
      const drop = wA >= wB ? b : a;
      keep.cx = Math.round((a.cx * wA + b.cx * wB) / Math.max(1, wA + wB));
      keep.cy = Math.round((a.cy * wA + b.cy * wB) / Math.max(1, wA + wB));
      keep.radius = Math.min(56, a.radius + b.radius * 0.6);
      const absorbedId = drop.id;
      const idxDrop = settlements.indexOf(drop);
      settlements.splice(idxDrop, 1);
      return { merged: true, absorbedId };
    }
  }
  return { merged: false, absorbedId: null };
}

/** 2集落間に道路ネットワークで到達できるか（BFS、上限付き） */
function roadConnected(
  tiles: Tile[],
  width: number,
  height: number,
  a: Settlement,
  b: Settlement,
): boolean {
  const start = findNearestRoad(tiles, width, height, a.cx, a.cy, 12);
  const goal = findNearestRoad(tiles, width, height, b.cx, b.cy, 12);
  if (!start || !goal) return false;

  const key = (x: number, y: number) => y * width + x;
  const goalK = key(goal.x, goal.y);
  const seen = new Set<number>();
  const q: Array<{ x: number; y: number }> = [start];
  seen.add(key(start.x, start.y));
  let steps = 0;
  const maxSteps = 4000;

  while (q.length > 0 && steps++ < maxSteps) {
    const cur = q.shift()!;
    if (key(cur.x, cur.y) === goalK) return true;
    // ゴール近傍に入ったら成功（厳密一致でなくても）
    if (Math.hypot(cur.x - goal.x, cur.y - goal.y) <= 2) return true;
    for (const n of neighbors4(cur.x, cur.y, width, height)) {
      const nk = key(n.x, n.y);
      if (seen.has(nk)) continue;
      const t = tiles[idx(n.x, n.y, width)]!;
      if (!ROAD_LIKE.has(t.kind) && t.kind !== 'bridge') continue;
      seen.add(nk);
      q.push(n);
    }
  }
  return false;
}

function findNearestRoad(
  tiles: Tile[],
  width: number,
  height: number,
  cx: number,
  cy: number,
  radius: number,
): { x: number; y: number } | null {
  let best: { x: number; y: number } | null = null;
  let bestD = Infinity;
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      if (!inBounds(x, y, width, height)) continue;
      const t = getTile(tiles, x, y, width, height);
      if (!t || !ROAD_LIKE.has(t.kind)) continue;
      const d = Math.hypot(x - cx, y - cy);
      if (d < bestD) {
        bestD = d;
        best = { x, y };
      }
    }
  }
  return best;
}

/**
 * 駅を置ける用地か。
 * 道路・水・橋の上は不可。草地/森/既存レールのみ。道路に隣接していると良い。
 */
export function isStationSite(kind: TileKind): boolean {
  return kind === 'grass' || kind === 'empty' || kind === 'forest' || kind === 'rail';
}

/** 近傍建物数（駅以外）。growth の密集判定と同趣旨 */
function countBuildingsNearLocal(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 4,
): number {
  let n = 0;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if (!inBounds(nx, ny, width, height)) continue;
      const k = tiles[idx(nx, ny, width)]!.kind;
      if (k === 'station') continue;
      if (BUILDING_KINDS.has(k)) n += 1;
    }
  }
  return n;
}

/** 集落付近の駅用地（密集地のみ。道路マス自体は使わない） */
export function findStationSiteNear(
  tiles: Tile[],
  width: number,
  height: number,
  cx: number,
  cy: number,
  radius: number,
): { x: number; y: number } | null {
  // 既存駅があればそれを使う
  const existing = findNearestKind(tiles, width, height, cx, cy, radius + 4, 'station');
  if (existing) return existing;

  let best: { x: number; y: number; score: number } | null = null;
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      if (!inBounds(x, y, width, height)) continue;
      const t = tiles[idx(x, y, width)]!;
      if (!isStationSite(t.kind)) continue;
      if (t.kind === 'road' || t.kind === 'crossing' || t.kind === 'bridge') continue;
      const density = countBuildingsNearLocal(tiles, x, y, width, height);
      if (density < 3) continue;
      let tooClose = false;
      for (let sy = y - 8; sy <= y + 8 && !tooClose; sy++) {
        for (let sx = x - 8; sx <= x + 8; sx++) {
          if (!inBounds(sx, sy, width, height)) continue;
          if (tiles[idx(sx, sy, width)]!.kind !== 'station') continue;
          if (Math.hypot(sx - x, sy - y) < 8) tooClose = true;
        }
      }
      if (tooClose) continue;
      const nearRoad = neighbors4(x, y, width, height).some((n) =>
        ROAD_LIKE.has(tiles[idx(n.x, n.y, width)]!.kind),
      );
      const dist = Math.hypot(x - cx, y - cy);
      let score = density * 2 + 8 - dist * 0.4;
      if (nearRoad) score += 4;
      if (t.kind === 'rail') score += 5;
      if (t.kind === 'forest') score -= 1;
      if (!best || score > best.score) best = { x, y, score };
    }
  }
  return best ? { x: best.x, y: best.y } : null;
}

/** 都市間鉄道の候補ペア（駅用地。道路マスは終点にしない） */
export function findIntercityRailPair(
  settlements: Settlement[],
  tiles: Tile[],
  width: number,
  height: number,
  rng: Rng,
): { a: { x: number; y: number }; b: { x: number; y: number } } | null {
  if (settlements.length < 2) return null;

  const sites: Array<{ x: number; y: number; sid: number }> = [];
  for (const s of settlements) {
    const site = findStationSiteNear(
      tiles,
      width,
      height,
      s.cx,
      s.cy,
      Math.ceil(s.radius) + 8,
    );
    if (site) sites.push({ ...site, sid: s.id });
  }

  const pairs: Array<{ a: (typeof sites)[0]; b: (typeof sites)[0]; dist: number }> = [];
  for (let i = 0; i < sites.length; i++) {
    for (let j = i + 1; j < sites.length; j++) {
      const a = sites[i]!;
      const b = sites[j]!;
      if (a.sid === b.sid) continue;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 18 || dist > 120) continue;
      if (hasRailNearPath(tiles, width, height, a, b)) continue;
      pairs.push({ a, b, dist });
    }
  }
  if (pairs.length === 0) return null;
  pairs.sort((p, q) => p.dist - q.dist);
  const pool = pairs.slice(0, Math.min(4, pairs.length));
  const pick = pool[pickInt(rng, 0, pool.length - 1)]!;
  return { a: { x: pick.a.x, y: pick.a.y }, b: { x: pick.b.x, y: pick.b.y } };
}

function findNearestKind(
  tiles: Tile[],
  width: number,
  height: number,
  cx: number,
  cy: number,
  radius: number,
  kind: TileKind,
): { x: number; y: number } | null {
  let best: { x: number; y: number } | null = null;
  let bestD = Infinity;
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      if (!inBounds(x, y, width, height)) continue;
      const t = tiles[idx(x, y, width)]!;
      if (t.kind !== kind) continue;
      const d = Math.hypot(x - cx, y - cy);
      if (d < bestD) {
        bestD = d;
        best = { x, y };
      }
    }
  }
  return best;
}

/** 2点間の帯に既に線路が多いか */
function hasRailNearPath(
  tiles: Tile[],
  width: number,
  height: number,
  a: { x: number; y: number },
  b: { x: number; y: number },
): boolean {
  const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y)));
  let rails = 0;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(a.x + (b.x - a.x) * t);
    const y = Math.round(a.y + (b.y - a.y) * t);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!inBounds(x + dx, y + dy, width, height)) continue;
        const k = tiles[idx(x + dx, y + dy, width)]!.kind;
        if (k === 'rail' || k === 'station' || k === 'crossing') rails += 1;
      }
    }
  }
  return rails > steps * 0.35;
}

/** 建設候補を集落周辺にバイアス */
export function settlementBiasScore(
  x: number,
  y: number,
  focus: Settlement | null,
  preferNear = true,
): number {
  if (!focus) return 0;
  const dist = Math.hypot(x - focus.cx, y - focus.cy);
  const soft = focus.radius + 6;
  if (preferNear) {
    // 集落圏内を優先、遠すぎると大きく減点
    if (dist <= soft) return 2 - dist / soft;
    return -dist / (soft * 3);
  }
  return 0;
}

export function shouldTryIntercityRail(
  settlements: Settlement[],
  stage: string,
  rng: Rng,
): boolean {
  if (settlements.length < 2) return false;
  // 町段階では都市間を引かない。都市以降も控えめ
  if (stage === 'village' || stage === 'town') return false;
  const p = stage === 'city' ? 0.05 : 0.16;
  return chance(rng, p);
}
