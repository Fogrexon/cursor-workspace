import type { PathPose, Tile, Vehicle, VehicleKind } from '../types';
import { getTile, neighbors4, RAIL_LIKE, ROAD_LIKE } from './grid';
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

/** 車両の経路キャッシュを無効化して path を差し替える */
export function setVehiclePath(
  v: Vehicle,
  path: Array<{ x: number; y: number }>,
): void {
  v.path = path;
  v.pathLens = undefined;
}

function ensurePathLens(v: Vehicle): number[] {
  if (v.pathLens && v.pathLens.length === v.path.length) return v.pathLens;
  v.pathLens = pathLengths(v.path);
  return v.pathLens;
}

function vehiclePathTotal(v: Vehicle): number {
  const lens = ensurePathLens(v);
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
  return poseAtWithLens(path, lens, s);
}

function poseAtWithLens(
  path: Array<{ x: number; y: number }>,
  lens: number[],
  s: number,
): PathPose {
  if (path.length === 0) return { x: 0, y: 0, dir: 0 };
  if (path.length === 1) {
    const p = path[0]!;
    return { x: p.x, y: p.y, dir: 0 };
  }

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

function poseAtVehicle(v: Vehicle, s: number): PathPose {
  return poseAtWithLens(v.path, ensurePathLens(v), s);
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
    poses.push(poseAtVehicle(v, Math.max(0, v.progress - i * TRAIN_CAR_SPACING)));
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
    const pose = poseAtVehicle(v, v.progress);
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
    const others = pool.filter((p) => p.x !== from.x || p.y !== from.y);
    if (others.length === 0) return null;
    return others[pickInt(rng, 0, others.length - 1)]!;
  }
  return candidates[pickInt(rng, 0, candidates.length - 1)]!;
}

/**
 * 線路網上で start から到達可能なマスのキー集合。
 * 非連結の別路線の駅を目的地に選ばないために使う。
 */
function reachableRailKeys(
  tiles: Tile[],
  width: number,
  height: number,
  start: { x: number; y: number },
  maxNodes = 4000,
): Set<number> {
  const key = (x: number, y: number) => y * width + x;
  const st = getTile(tiles, start.x, start.y, width, height);
  if (!st || !RAIL_LIKE.has(st.kind)) return new Set();

  const seen = new Set<number>();
  const q: Array<{ x: number; y: number }> = [{ x: start.x, y: start.y }];
  seen.add(key(start.x, start.y));
  while (q.length > 0 && seen.size < maxNodes) {
    const cur = q.shift()!;
    for (const n of neighbors4(cur.x, cur.y, width, height)) {
      const nk = key(n.x, n.y);
      if (seen.has(nk)) continue;
      const t = tiles[nk]!;
      if (!RAIL_LIKE.has(t.kind)) continue;
      seen.add(nk);
      q.push(n);
    }
  }
  return seen;
}

/**
 * 同じ網上の駅を巡回順に並べる。
 * 端の駅から幾何距離の最近傍でつなぐ（A* は実際の移動経路に任せる）。
 */
export function orderStationsForTour(
  stations: Array<{ x: number; y: number }>,
  _tiles: Tile[],
  _width: number,
  _height: number,
): Array<{ x: number; y: number }> {
  if (stations.length <= 1) return stations.map((s) => ({ ...s }));
  if (stations.length === 2) return stations.map((s) => ({ ...s }));

  const posKey = (p: { x: number; y: number }) => `${p.x},${p.y}`;
  const cx = stations.reduce((s, p) => s + p.x, 0) / stations.length;
  const cy = stations.reduce((s, p) => s + p.y, 0) / stations.length;

  // 重心から一番遠い駅を端点として開始
  let start = stations[0]!;
  let startD = -1;
  for (const s of stations) {
    const d = Math.hypot(s.x - cx, s.y - cy);
    if (d > startD) {
      startD = d;
      start = s;
    }
  }

  const order: Array<{ x: number; y: number }> = [{ ...start }];
  const used = new Set([posKey(start)]);

  while (order.length < stations.length) {
    const last = order[order.length - 1]!;
    let best: { x: number; y: number } | null = null;
    let bestD = Number.POSITIVE_INFINITY;
    for (const s of stations) {
      if (used.has(posKey(s))) continue;
      // 線路距離の A* は O(駅²) 回走り重いので、幾何距離で巡回順だけ決める
      const d = Math.abs(s.x - last.x) + Math.abs(s.y - last.y);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }
    if (!best) break;
    order.push({ ...best });
    used.add(posKey(best));
  }

  return order;
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
  setVehiclePath(v, path);
  v.progress = 0;
  applyPose(v);
  return true;
}

/** 電車: 同じ網上の全駅を順に巡回する */
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

  const reach = reachableRailKeys(tiles, width, height, from);
  if (reach.size < 2) return false;
  const key = (x: number, y: number) => y * width + x;

  const onNetStations = stations.filter((p) => reach.has(key(p.x, p.y)));

  let dest: { x: number; y: number } | null = null;

  if (onNetStations.length >= 2) {
    const tour = orderStationsForTour(onNetStations, tiles, width, height);
    // いま一番近い駅を特定
    let nearestIdx = 0;
    let nearestD = Number.POSITIVE_INFINITY;
    for (let i = 0; i < tour.length; i++) {
      const s = tour[i]!;
      const d = Math.hypot(s.x - from.x, s.y - from.y);
      if (d < nearestD) {
        nearestD = d;
        nearestIdx = i;
      }
    }

    if (nearestD > 1.5) {
      // 駅と駅の間 → まず最寄り駅へ
      dest = tour[nearestIdx]!;
    } else if (tour.length === 2) {
      dest = tour[1 - nearestIdx]!;
      v.railDir = nearestIdx === 0 ? 1 : -1;
    } else {
      // 3駅以上: 端で折り返しながら隣接駅へ（全駅停車）
      let dir: 1 | -1 = v.railDir ?? 1;
      let nextIdx = nearestIdx + dir;
      if (nextIdx < 0 || nextIdx >= tour.length) {
        dir = dir === 1 ? -1 : 1;
        nextIdx = nearestIdx + dir;
      }
      if (nextIdx < 0 || nextIdx >= tour.length) {
        nextIdx = nearestIdx === 0 ? 1 : nearestIdx - 1;
        dir = nextIdx > nearestIdx ? 1 : -1;
      }
      v.railDir = dir;
      dest = tour[nextIdx]!;
    }
  } else {
    // 駅が足りないときは線路マス間
    const destPool = rails.filter(
      (p) => reach.has(key(p.x, p.y)) && (p.x !== from.x || p.y !== from.y),
    );
    if (destPool.length === 0) return false;
    dest = pickOther(destPool, from, rng, 3);
  }

  if (!dest) return false;
  const path = findNetworkPath(
    tiles,
    width,
    height,
    from,
    dest,
    RAIL_LIKE,
    TRAIN_PATH_MAX,
  );
  if (!path || path.length < 2) return false;

  v.destination = { x: dest.x, y: dest.y };
  setVehiclePath(v, path);
  const cars = v.cars ?? 4;
  v.progress = Math.min((cars - 1) * TRAIN_CAR_SPACING, vehiclePathTotal(v) * 0.2);
  applyPose(v);
  return true;
}

/**
 * 敷設した線路経路の上に電車を1本作る。
 * 線路追加タイミングで呼ぶ。
 */
export function createTrainOnPath(
  path: Array<{ x: number; y: number }>,
  nextId: number,
  rng: () => number,
): Vehicle | null {
  if (path.length < 2) return null;
  const cars = pickInt(rng, 3, 5);
  const start = path[0]!;
  const dest = path[path.length - 1]!;
  const v: Vehicle = {
    id: nextId,
    kind: 'train',
    x: start.x,
    y: start.y,
    dir: 0,
    speed: 2.4,
    progress: 0,
    path: path.map((p) => ({ ...p })),
    destination: { ...dest },
    color: 0,
    cars,
    wait: 0,
  };
  v.progress = Math.min((cars - 1) * TRAIN_CAR_SPACING, pathTotalLength(v.path) * 0.2);
  applyPose(v);
  return v;
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
  const stations = collectTiles(tiles, width, height, (t) => t.kind === 'station');

  const targetCars = Math.min(40, Math.floor(population / 8) + Math.floor(roads.length / 6));

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
  let carCount = vehicles.filter((v) => v.kind !== 'train').length;

  while (carCount < targetCars && roads.length > 1) {
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
    carCount += 1;
  }

  // 連結した鉄道路線ごと（駅が2つ以上）に、少なくとも1本は走らせる
  id = ensureTrainsOnComponents(tiles, width, height, stations, vehicles, id, rng);

  return { vehicles, nextId: id };
}

/** 駅の連結成分を列挙（線路でつながった駅グループ） */
function stationComponents(
  tiles: Tile[],
  width: number,
  height: number,
  stations: Array<{ x: number; y: number }>,
): Array<Array<{ x: number; y: number }>> {
  const key = (x: number, y: number) => y * width + x;
  const unused = new Set(stations.map((s) => key(s.x, s.y)));
  const byKey = new Map(stations.map((s) => [key(s.x, s.y), s]));
  const comps: Array<Array<{ x: number; y: number }>> = [];

  while (unused.size > 0) {
    const startKey = unused.values().next().value as number;
    const start = byKey.get(startKey)!;
    const reach = reachableRailKeys(tiles, width, height, start);
    const group: Array<{ x: number; y: number }> = [];
    for (const k of unused) {
      if (reach.has(k)) {
        group.push(byKey.get(k)!);
      }
    }
    for (const s of group) unused.delete(key(s.x, s.y));
    if (group.length > 0) comps.push(group);
  }
  return comps;
}

function trainOnComponent(
  vehicles: Vehicle[],
  tiles: Tile[],
  width: number,
  height: number,
  stations: Array<{ x: number; y: number }>,
): boolean {
  if (stations.length === 0) return false;
  const reach = reachableRailKeys(tiles, width, height, stations[0]!);
  const key = (x: number, y: number) => y * width + x;
  return vehicles.some((v) => {
    if (v.kind !== 'train') return false;
    return reach.has(key(Math.round(v.x), Math.round(v.y)));
  });
}

function ensureTrainsOnComponents(
  tiles: Tile[],
  width: number,
  height: number,
  stations: Array<{ x: number; y: number }>,
  vehicles: Vehicle[],
  nextId: number,
  rng: () => number,
): number {
  let id = nextId;
  if (stations.length < 2) {
    if (vehicles.every((v) => v.kind !== 'train')) {
      const rails = collectTiles(tiles, width, height, (t) => RAIL_LIKE.has(t.kind));
      const t = spawnGuaranteedTrain(tiles, width, height, stations, rails, id, rng);
      if (t) {
        vehicles.push(t);
        id = t.id + 1;
      }
    }
    return id;
  }

  const comps = stationComponents(tiles, width, height, stations);
  for (const comp of comps) {
    if (comp.length < 2) continue;
    if (trainOnComponent(vehicles, tiles, width, height, comp)) continue;
    const t = spawnGuaranteedTrain(tiles, width, height, comp, comp, id, rng);
    if (t) {
      vehicles.push(t);
      id = t.id + 1;
    }
  }
  return id;
}

/**
 * 駅ペア（なければ線路端）を総当たりで試し、走れる経路があれば電車を1本作る。
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

  for (const { a, b } of pairs) {
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

  // 毎フレーム全マップ走査しない。再割当が必要なときだけ集める
  let roads: Array<{ x: number; y: number }> | null = null;
  let rails: Array<{ x: number; y: number }> | null = null;
  let stations: Array<{ x: number; y: number }> | null = null;
  const ensurePools = () => {
    if (!world || roads) return;
    roads = collectTiles(world.tiles, world.width, world.height, (t) => ROAD_LIKE.has(t.kind));
    rails = collectTiles(world.tiles, world.width, world.height, (t) => RAIL_LIKE.has(t.kind));
    stations = collectTiles(world.tiles, world.width, world.height, (t) => t.kind === 'station');
  };

  for (const v of vehicles) {
    if ((v.wait ?? 0) > 0) {
      v.wait = Math.max(0, (v.wait ?? 0) - dt);
      continue;
    }

    const total = vehiclePathTotal(v);
    if (total < 0.01) {
      if (world) {
        ensurePools();
        reassign(v, world, roads!, rails!, stations!, rng);
      }
      continue;
    }

    v.progress += v.speed * dt;

    if (v.progress >= total - 0.001) {
      v.progress = total;
      applyPose(v);
      if (world) {
        ensurePools();
        const ok = reassign(v, world, roads!, rails!, stations!, rng);
        if (!ok) {
          // 失敗時は終点に留まり、次の待機後に再試行（テレポートしない）
          v.progress = total;
          applyPose(v);
        }
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
): boolean {
  if (v.kind === 'train') {
    return assignTrainTrip(v, world.tiles, world.width, world.height, stations, rails, rng);
  }
  return assignCarTrip(v, world.tiles, world.width, world.height, roads, rng);
}
