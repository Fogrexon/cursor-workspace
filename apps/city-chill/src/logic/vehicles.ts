import type { PathPose, Tile, Vehicle, VehicleKind } from '../types';
import { getTile, RAIL_LIKE, ROAD_LIKE } from './grid';
import { findNetworkPath } from './networkPath';
import { createRng, pickInt } from './rng';

function collectTiles(
  tiles: Tile[],
  width: number,
  height: number,
  pred: (t: Tile) => boolean,
): Array<{ x: number; y: number }> {
  const out: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pred(tiles[y * width + x]!)) out.push({ x, y });
    }
  }
  return out;
}

/** 経路の累積弧長テーブル */
export function pathLengths(path: Array<{ x: number; y: number }>): number[] {
  const lens = [0];
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1]!;
    const b = path[i]!;
    lens.push(lens[i - 1]! + Math.hypot(b.x - a.x, b.y - a.y));
  }
  return lens;
}

export function pathTotalLength(path: Array<{ x: number; y: number }>): number {
  const lens = pathLengths(path);
  return lens[lens.length - 1] ?? 0;
}

/** 弧長 s における位置・向き。経路端でクランプ */
export function poseAt(path: Array<{ x: number; y: number }>, s: number): PathPose {
  if (path.length === 0) return { x: 0, y: 0, dir: 0 };
  if (path.length === 1) {
    const p = path[0]!;
    return { x: p.x, y: p.y, dir: 0 };
  }

  const lens = pathLengths(path);
  const total = lens[lens.length - 1]!;
  const t = Math.max(0, Math.min(total, s));

  let i = 0;
  while (i < lens.length - 2 && lens[i + 1]! < t) i += 1;

  const a = path[i]!;
  const b = path[i + 1]!;
  const segStart = lens[i]!;
  const segLen = Math.max(1e-6, lens[i + 1]! - segStart);
  const u = (t - segStart) / segLen;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return {
    x: a.x + dx * u,
    y: a.y + dy * u,
    dir: Math.atan2(dy, dx),
  };
}

const CAR_COLORS = [0, 1, 2, 3, 4, 5];
/** 電車の車両間隔 (タイル単位) */
export const TRAIN_CAR_SPACING = 0.55;
/** 都市間鉄道の建設上限(140)より長く取る */
export const TRAIN_PATH_MAX = 160;
const CAR_WAIT = 0.4;
const TRAIN_WAIT = 1.8;

function syncCarPoses(v: Vehicle): void {
  if (v.kind !== 'train') {
    v.carPoses = undefined;
    return;
  }
  const n = v.cars ?? 4;
  const poses: PathPose[] = [];
  for (let i = 0; i < n; i++) {
    poses.push(poseAt(v.path, Math.max(0, v.progress - i * TRAIN_CAR_SPACING)));
  }
  v.carPoses = poses;
  const head = poses[0]!;
  v.x = head.x;
  v.y = head.y;
  v.dir = head.dir;
}

function applyPose(v: Vehicle): void {
  if (v.kind === 'train') {
    syncCarPoses(v);
  } else {
    const pose = poseAt(v.path, v.progress);
    v.x = pose.x;
    v.y = pose.y;
    v.dir = pose.dir;
  }
}

function pickOther(
  pool: Array<{ x: number; y: number }>,
  from: { x: number; y: number },
  rng: () => number,
  minDist = 3,
): { x: number; y: number } | null {
  const candidates = pool.filter((p) => {
    const d = Math.hypot(p.x - from.x, p.y - from.y);
    return d >= minDist;
  });
  if (candidates.length === 0) {
    if (pool.length <= 1) return null;
    // 近いものしか無い場合でも別マスへ
    const others = pool.filter((p) => p.x !== from.x || p.y !== from.y);
    if (others.length === 0) return null;
    return others[pickInt(rng, 0, others.length - 1)]!;
  }
  return candidates[pickInt(rng, 0, candidates.length - 1)]!;
}

/** 車: 道路マス目的地へ経路を割り当て */
export function assignCarTrip(
  v: Vehicle,
  tiles: Tile[],
  width: number,
  height: number,
  roads: Array<{ x: number; y: number }>,
  rng: () => number,
): boolean {
  const start = { x: Math.round(v.x), y: Math.round(v.y) };
  // 現在地が道路上でなければ近い道路へスナップ
  const here = getTile(tiles, start.x, start.y, width, height);
  let from = start;
  if (!here || !ROAD_LIKE.has(here.kind)) {
    if (roads.length === 0) return false;
    from = roads[pickInt(rng, 0, roads.length - 1)]!;
  }

  let dest: { x: number; y: number } | null = null;
  let path: Array<{ x: number; y: number }> | null = null;
  for (let attempt = 0; attempt < 8; attempt++) {
    dest = pickOther(roads, from, rng, 4);
    if (!dest) return false;
    path = findNetworkPath(tiles, width, height, from, dest, ROAD_LIKE);
    if (path && path.length >= 2) break;
    path = null;
  }
  if (!path || !dest) return false;

  v.destination = dest;
  v.path = path;
  v.progress = 0;
  applyPose(v);
  return true;
}

/** 電車: 駅目的地へ経路を割り当て（都市間の長距離も可） */
export function assignTrainTrip(
  v: Vehicle,
  tiles: Tile[],
  width: number,
  height: number,
  stations: Array<{ x: number; y: number }>,
  rails: Array<{ x: number; y: number }>,
  rng: () => number,
): boolean {
  const start = { x: Math.round(v.x), y: Math.round(v.y) };
  const here = getTile(tiles, start.x, start.y, width, height);
  let from = start;
  if (!here || !RAIL_LIKE.has(here.kind)) {
    const pool = stations.length > 0 ? stations : rails;
    if (pool.length === 0) return false;
    from = pool[pickInt(rng, 0, pool.length - 1)]!;
  }

  const destPool = stations.length >= 2 ? stations : rails;
  const others = destPool.filter((p) => p.x !== from.x || p.y !== from.y);
  if (others.length === 0) return false;

  // 遠い駅を優先（都市間）。到達可能なものを探す
  const ranked = others
    .map((p) => ({ ...p, d: Math.hypot(p.x - from.x, p.y - from.y) }))
    .sort((a, b) => b.d - a.d);

  let dest: { x: number; y: number } | null = null;
  let path: Array<{ x: number; y: number }> | null = null;

  // 遠い順。先頭数件だけ軽くシャッフルしてバリエーションを出す
  const tryOrder = [...ranked];
  const top = Math.min(4, tryOrder.length);
  for (let i = top - 1; i > 0; i--) {
    const j = pickInt(rng, 0, i);
    const tmp = tryOrder[i]!;
    tryOrder[i] = tryOrder[j]!;
    tryOrder[j] = tmp;
  }

  for (const cand of tryOrder) {
    const p = findNetworkPath(
      tiles,
      width,
      height,
      from,
      cand,
      RAIL_LIKE,
      TRAIN_PATH_MAX,
    );
    if (p && p.length >= 2) {
      dest = { x: cand.x, y: cand.y };
      path = p;
      break;
    }
  }
  if (!path || !dest) return false;

  v.destination = dest;
  v.path = path;
  const cars = v.cars ?? 4;
  v.progress = Math.min((cars - 1) * TRAIN_CAR_SPACING, pathTotalLength(path) * 0.2);
  applyPose(v);
  return true;
}

export function spawnVehicles(
  tiles: Tile[],
  width: number,
  height: number,
  existing: Vehicle[],
  nextId: number,
  population: number,
  seed: number,
  day: number,
): { vehicles: Vehicle[]; nextId: number } {
  const rng = createRng((seed + day * 9973) >>> 0);
  const roads = collectTiles(tiles, width, height, (t) => ROAD_LIKE.has(t.kind));
  const rails = collectTiles(tiles, width, height, (t) => RAIL_LIKE.has(t.kind));
  const stations = collectTiles(tiles, width, height, (t) => t.kind === 'station');

  const targetCars = Math.min(40, Math.floor(population / 8) + Math.floor(roads.length / 6));
  // 追加の電車は控えめ。最低1本は別途保証する
  const bonusTrains =
    stations.length >= 4 ? Math.min(2, Math.floor(stations.length / 4)) : 0;

  // 経路が無効になった車両は落とす
  const vehicles = existing.filter((v) => {
    if (v.path.length < 2) return false;
    const dest = getTile(tiles, v.destination.x, v.destination.y, width, height);
    if (!dest) return false;
    if (v.kind === 'train') return RAIL_LIKE.has(dest.kind);
    return ROAD_LIKE.has(dest.kind);
  });

  let id = nextId;
  let attempts = 0;

  while (vehicles.filter((v) => v.kind !== 'train').length < targetCars && roads.length > 1) {
    if (++attempts > 60) break;
    const start = roads[pickInt(rng, 0, roads.length - 1)]!;
    const kindRoll = rng();
    let kind: VehicleKind = 'car';
    if (kindRoll > 0.92) kind = 'bus';
    else if (kindRoll > 0.82) kind = 'truck';

    const speed = kind === 'bus' ? 1.6 : kind === 'truck' ? 1.4 : 2.0 + rng() * 0.8;
    const v: Vehicle = {
      id: id++,
      kind,
      x: start.x,
      y: start.y,
      dir: 0,
      speed,
      progress: 0,
      path: [start, start],
      destination: { ...start },
      color: CAR_COLORS[pickInt(rng, 0, CAR_COLORS.length - 1)]!,
      wait: 0,
    };
    if (!assignCarTrip(v, tiles, width, height, roads, rng)) continue;
    vehicles.push(v);
  }

  // 走れる線路があるなら、必ず少なくとも1本は走らせる
  if (vehicles.filter((v) => v.kind === 'train').length === 0) {
    const guaranteed = spawnGuaranteedTrain(
      tiles,
      width,
      height,
      stations,
      rails,
      id,
      rng,
    );
    if (guaranteed) {
      vehicles.push(guaranteed);
      id = guaranteed.id + 1;
    }
  }

  // 余裕があれば追加（失敗しても最低1本は既にある）
  attempts = 0;
  const targetTrains = 1 + bonusTrains;
  while (vehicles.filter((v) => v.kind === 'train').length < targetTrains && rails.length > 1) {
    if (++attempts > 20) break;
    const pool = stations.length > 0 ? stations : rails;
    const start = pool[pickInt(rng, 0, pool.length - 1)]!;
    const cars = pickInt(rng, 3, 5);
    const v: Vehicle = {
      id: id++,
      kind: 'train',
      x: start.x,
      y: start.y,
      dir: 0,
      speed: 2.4,
      progress: 0,
      path: [start, start],
      destination: { ...start },
      color: 0,
      cars,
      wait: 0,
    };
    if (!assignTrainTrip(v, tiles, width, height, stations, rails, rng)) continue;
    vehicles.push(v);
  }

  return { vehicles, nextId: id };
}

/**
 * 駅ペア（なければ線路端）を総当たりで試し、走れる経路があれば電車を1本作る。
 * ランダム失敗で「線路だけ」になるのを防ぐ。
 */
function spawnGuaranteedTrain(
  tiles: Tile[],
  width: number,
  height: number,
  stations: Array<{ x: number; y: number }>,
  rails: Array<{ x: number; y: number }>,
  nextId: number,
  rng: () => number,
): Vehicle | null {
  const starts = stations.length >= 2 ? stations : rails;
  if (starts.length < 2) return null;

  // 遠いペアから試す（都市間を優先）
  const pairs: Array<{ a: { x: number; y: number }; b: { x: number; y: number }; d: number }> =
    [];
  for (let i = 0; i < starts.length; i++) {
    for (let j = i + 1; j < starts.length; j++) {
      const a = starts[i]!;
      const b = starts[j]!;
      pairs.push({ a, b, d: Math.hypot(a.x - b.x, a.y - b.y) });
    }
  }
  pairs.sort((p, q) => q.d - p.d);

  const limit = Math.min(pairs.length, stations.length >= 2 ? 48 : 24);
  for (let i = 0; i < limit; i++) {
    const { a, b } = pairs[i]!;
    const path = findNetworkPath(tiles, width, height, a, b, RAIL_LIKE, TRAIN_PATH_MAX);
    if (!path || path.length < 2) continue;

    const cars = pickInt(rng, 3, 5);
    const v: Vehicle = {
      id: nextId,
      kind: 'train',
      x: a.x,
      y: a.y,
      dir: 0,
      speed: 2.4,
      progress: 0,
      path,
      destination: { ...b },
      color: 0,
      cars,
      wait: 0,
    };
    v.progress = Math.min((cars - 1) * TRAIN_CAR_SPACING, pathTotalLength(path) * 0.2);
    applyPose(v);
    return v;
  }
  return null;
}

export interface VehicleWorld {
  tiles: Tile[];
  width: number;
  height: number;
  seed: number;
  day: number;
}

/**
 * 車両を dt 秒進める。
 * 目的地到着 → 短時間待機 → 次の目的地へ経路探索。
 */
export function updateVehicles(
  vehicles: Vehicle[],
  dt: number,
  world?: VehicleWorld,
): void {
  const rng = world
    ? createRng((world.seed ^ (world.day * 7919) ^ (vehicles.length * 104729)) >>> 0)
    : createRng(1);

  const roads = world
    ? collectTiles(world.tiles, world.width, world.height, (t) => ROAD_LIKE.has(t.kind))
    : [];
  const rails = world
    ? collectTiles(world.tiles, world.width, world.height, (t) => RAIL_LIKE.has(t.kind))
    : [];
  const stations = world
    ? collectTiles(world.tiles, world.width, world.height, (t) => t.kind === 'station')
    : [];

  for (const v of vehicles) {
    if ((v.wait ?? 0) > 0) {
      v.wait = Math.max(0, (v.wait ?? 0) - dt);
      continue;
    }

    const total = pathTotalLength(v.path);
    if (total < 0.01) {
      if (world) reassign(v, world, roads, rails, stations, rng);
      continue;
    }

    v.progress += v.speed * dt;

    if (v.progress >= total - 0.001) {
      v.progress = total;
      applyPose(v);
      // 到着 → 待機してから次へ。経路は先に組んでおく
      if (world) {
        reassign(v, world, roads, rails, stations, rng);
        v.progress = 0;
        applyPose(v);
      } else {
        v.progress = 0;
      }
      v.wait = v.kind === 'train' ? TRAIN_WAIT : CAR_WAIT;
      continue;
    }

    applyPose(v);
  }
}

function reassign(
  v: Vehicle,
  world: VehicleWorld,
  roads: Array<{ x: number; y: number }>,
  rails: Array<{ x: number; y: number }>,
  stations: Array<{ x: number; y: number }>,
  rng: () => number,
): void {
  if (v.kind === 'train') {
    assignTrainTrip(v, world.tiles, world.width, world.height, stations, rails, rng);
  } else {
    assignCarTrip(v, world.tiles, world.width, world.height, roads, rng);
  }
}
