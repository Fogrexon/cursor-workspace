import type { Settlement, Tile, TileKind } from '../types';
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
      tiles[idx(x, y, width)] = makeTile('road');
    }
    if (x !== x1) x += x < x1 ? 1 : -1;
    else if (y !== y1) y += y < y1 ? 1 : -1;
  }
  const end = tiles[idx(x1, y1, width)]!;
  if (end.kind !== 'water') {
    tiles[idx(x1, y1, width)] = makeTile('road');
  }
}

function clearVillageCore(
  tiles: Tile[],
  width: number,
  height: number,
  cx: number,
  cy: number,
  rng: Rng,
): void {
  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx;
      const y = cy + dy;
      if (x <= 0 || y <= 0 || x >= width - 1 || y >= height - 1) continue;
      const t = tiles[idx(x, y, width)]!;
      if (t.kind === 'water' || t.kind === 'forest') {
        tiles[idx(x, y, width)] = makeTile('grass', 0, pickInt(rng, 0, 3));
      }
    }
  }
}

function placeStarterBuildings(
  tiles: Tile[],
  width: number,
  height: number,
  cx: number,
  cy: number,
  rng: Rng,
): void {
  carveRoad(tiles, width, cx - 3, cy, cx + 3, cy);
  carveRoad(tiles, width, cx, cy - 2, cx, cy + 2);

  const starters: Array<{ dx: number; dy: number; kind: Tile['kind']; tier: number }> = [
    { dx: -1, dy: -1, kind: 'residential', tier: 1 },
    { dx: 1, dy: -1, kind: 'residential', tier: 1 },
    { dx: -1, dy: 1, kind: 'residential', tier: 1 },
    { dx: 1, dy: 1, kind: 'commercial', tier: 1 },
    { dx: 2, dy: -1, kind: 'park', tier: 1 },
  ];
  for (const s of starters) {
    const x = cx + s.dx;
    const y = cy + s.dy;
    if (x > 0 && y > 0 && x < width - 1 && y < height - 1) {
      tiles[idx(x, y, width)] = makeTile(s.kind, s.tier, pickInt(rng, 0, 2));
    }
  }
}

/**
 * マップ上に複数の小さな村を配置する。
 * 大きいマップほど集落数を増やす。
 */
export function seedSettlements(
  tiles: Tile[],
  width: number,
  height: number,
  rng: Rng,
): Settlement[] {
  const area = width * height;
  const count =
    area >= 200 * 200 ? pickInt(rng, 4, 6) : area >= 80 * 80 ? pickInt(rng, 3, 4) : 1;

  const minDist = Math.max(28, Math.floor(Math.min(width, height) * 0.22));
  const margin = Math.max(12, Math.floor(Math.min(width, height) * 0.08));
  const settlements: Settlement[] = [];
  const usedNames = new Set<string>();

  const tryPlace = (cx: number, cy: number, id: number): boolean => {
    for (const s of settlements) {
      if (Math.hypot(cx - s.cx, cy - s.cy) < minDist) return false;
    }
    clearVillageCore(tiles, width, height, cx, cy, rng);
    placeStarterBuildings(tiles, width, height, cx, cy, rng);
    settlements.push({
      id,
      name: pickTownName(rng, usedNames),
      cx,
      cy,
      radius: 10,
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
  );

  let guard = 0;
  while (settlements.length < count && guard++ < 80) {
    const cx = pickInt(rng, margin, width - margin - 1);
    const cy = pickInt(rng, margin, height - margin - 1);
    tryPlace(cx, cy, settlements.length);
  }

  // 最低2集落（広いマップ）
  if (count >= 3 && settlements.length < 2) {
    const cx = Math.max(margin, width - margin - 20);
    const cy = Math.max(margin, height - margin - 20);
    tryPlace(cx, cy, settlements.length);
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

/** 集落中心を開発の重心へゆっくり追従し、半径を更新 */
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
        if (!DEVELOPED.has(t.kind)) continue;
        sx += x;
        sy += y;
        n += 1;
      }
    }
    if (n > 8) {
      s.cx = Math.round(s.cx * 0.7 + (sx / n) * 0.3);
      s.cy = Math.round(s.cy * 0.7 + (sy / n) * 0.3);
      s.radius = Math.min(48, Math.max(10, Math.sqrt(n) * 1.1));
    }
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

/** 集落付近の駅用地（道路の隣の空き地を優先。道路マス自体は使わない） */
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
      // 道路そのものは駅にしない
      if (t.kind === 'road' || t.kind === 'crossing' || t.kind === 'bridge') continue;
      const nearRoad = neighbors4(x, y, width, height).some((n) =>
        ROAD_LIKE.has(tiles[idx(n.x, n.y, width)]!.kind),
      );
      const dist = Math.hypot(x - cx, y - cy);
      let score = 10 - dist * 0.4;
      if (nearRoad) score += 5;
      if (t.kind === 'rail') score += 3;
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
  if (stage === 'village') return false;
  // town 以降で徐々に都市間鉄道を狙う
  const p = stage === 'town' ? 0.18 : stage === 'city' ? 0.35 : 0.45;
  return chance(rng, p);
}
