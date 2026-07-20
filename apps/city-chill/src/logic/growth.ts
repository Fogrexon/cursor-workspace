import type { CityStats, GrowthStage, Settlement, SettlementLevel, Tile, TileFacing, TileKind } from '../types';
import { DEFAULT_BALANCE, type BalanceConfig } from './balance';
import {
  applyFacing,
  axisBetween,
  facingFromPath,
  isRoadSurface,
  mergeFacing,
} from './connections';
import {
  findDemolitionForRoad,
  isLastEscapeForBuilding,
  isRoadGrowthBlocked,
  roadNeighborCount,
  wouldFormRoadBlock2x2,
} from './demolish';
import {
  adjacentToRoad,
  BUILDING_KINDS,
  FOOTPRINT_2X2,
  footprint2x2TouchesRoad,
  getTile,
  idx,
  inBounds,
  isBuildable,
  isFootprint2x2Clear,
  isPaveable,
  makeTile,
  neighbors4,
  ROAD_LIKE,
  setTile,
} from './grid';
import { findRailPath } from './railPath';
import { createRng, pickInt } from './rng';
import {
  findIntercityRailPair,
  pickSettlement,
  settlementBiasScore,
  shouldTryIntercityRail,
} from './settlements';
import { computeBuildNeeds, type BuildNeed } from './stats';
import { pavedKind, terrainBuildSurcharge } from './terrain';

/** 建設アニメの初期フレーム数 (大きいほど長い) */
export const CONSTRUCTION_FRAMES = 48;
export const UPGRADE_FRAMES = 36;
export const ROAD_FRAMES = 28;
export const RAIL_FRAMES = 36;
/** 回廊を端から順に見せるためのタイル間ディレイ */
export const RAIL_BUILD_STAGGER = 4;
/** 駅同士の最小間隔（タイル）。これ未満には新駅を置かない */
export const MIN_STATION_SPACING = 8;
/** 駅を置くのに必要な近傍建物数（人口密集の代理指標） */
export const MIN_STATION_URBAN_BUILDINGS = 3;
/** 密集判定の半径 */
export const STATION_URBAN_RADIUS = 4;

/** 近傍の建物数（駅以外）。人口密集地の代理 */
export function countBuildingsNear(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
  radius = STATION_URBAN_RADIUS,
): number {
  let n = 0;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if (!inBounds(nx, ny, width, height)) continue;
      const k = tiles[ny * width + nx]!.kind;
      if (k === 'station') continue;
      if (BUILDING_KINDS.has(k)) n += 1;
    }
  }
  return n;
}

/** 駅を置くに足る人口密集地か */
export function isUrbanStationSite(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
  minBuildings = MIN_STATION_URBAN_BUILDINGS,
): boolean {
  return countBuildingsNear(tiles, x, y, width, height) >= minBuildings;
}

/** 隣接する道路・線路の向きを経路軸に合わせて更新 */
function stampFacingAlongPath(
  tiles: Tile[],
  path: Array<{ x: number; y: number }>,
  width: number,
): void {
  for (let i = 0; i < path.length; i++) {
    const cur = path[i]!;
    const prev = i > 0 ? path[i - 1]! : null;
    const next = i < path.length - 1 ? path[i + 1]! : null;
    const facing = facingFromPath(prev, cur, next);
    const t = tiles[cur.y * width + cur.x];
    if (!t) continue;
    applyFacing(t, facing);
  }
}

/** 単発の道路マス向きを近傍から推定して書き込む */
function stampRoadFacingAt(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  const t = getTile(tiles, x, y, width, height);
  if (!t || !isRoadSurface(t.kind)) return;
  let facing: TileFacing = 'none';
  for (const n of neighbors4(x, y, width, height)) {
    const nt = tiles[n.y * width + n.x]!;
    if (!isRoadSurface(nt.kind)) continue;
    const axis = axisBetween({ x, y }, n);
    facing = mergeFacing(facing, axis);
    applyFacing(nt, axis);
  }
  applyFacing(t, facing === 'none' ? 'x' : facing);
}

type BuildAction =
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'road'
  | 'rail'
  | 'school'
  | 'park'
  | 'hospital'
  | 'tower'
  | 'station'
  | 'plaza'
  | 'skyscraper'
  | 'upgrade'
  | 'demolish';

function weightedPick(rng: () => number, weights: Array<{ key: BuildAction; w: number }>): BuildAction {
  const total = weights.reduce((s, x) => s + Math.max(0, x.w), 0);
  if (total <= 0) return 'park';
  let r = rng() * total;
  for (const item of weights) {
    r -= Math.max(0, item.w);
    if (r <= 0) return item.key;
  }
  return weights[weights.length - 1]!.key;
}

/**
 * 道路沿いの建設候補。
 * 過疎の一本道沿いには建てず、集落圏内か既存建物の近く（インフィル）を優先する。
 */
export function findBuildableNearRoad(
  tiles: Tile[],
  width: number,
  height: number,
  rng: () => number,
  focus: Settlement | null,
): { x: number; y: number } | null {
  const candidates: Array<{ x: number; y: number; score: number }> = [];
  const cx = focus?.cx ?? width / 2;
  const cy = focus?.cy ?? height / 2;
  const coreR = focus ? focus.radius + 2 : 8;
  const scanR = focus ? Math.ceil(focus.radius) + 10 : Math.min(width, height);

  const y0 = Math.max(0, cy - scanR);
  const y1 = Math.min(height - 1, cy + scanR);
  const x0 = Math.max(0, cx - scanR);
  const x1 = Math.min(width - 1, cx + scanR);

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const t = getTile(tiles, x, y, width, height);
      if (!t || !isBuildable(t.kind)) continue;
      if (!adjacentToRoad(tiles, x, y, width, height)) continue;
      if (isLastEscapeForBuilding(tiles, x, y, width, height)) continue;

      const dist = Math.hypot(x - cx, y - cy);
      const density = countBuildingsNear(tiles, x, y, width, height, 3);
      // 過疎フロンティア: 建物もなく集落からも遠い道路沿いには建てない
      if (density === 0 && dist > coreR) continue;
      if (density === 0 && dist > Math.max(5, coreR * 0.55)) continue;

      const roadAdj = neighbors4(x, y, width, height).filter((n) =>
        ROAD_LIKE.has(tiles[n.y * width + n.x]!.kind),
      ).length;
      const forestPenalty = t.kind === 'forest' ? 0.4 : 0;
      const score =
        density * 0.65 +
        roadAdj * 0.45 +
        1 / (1 + dist * 0.2) +
        settlementBiasScore(x, y, focus) +
        rng() * 0.25 -
        forestPenalty;
      candidates.push({ x, y, score });
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);
  const top = candidates.slice(0, Math.min(12, candidates.length));
  return top[pickInt(rng, 0, top.length - 1)]!;
}

function findUpgradeTarget(
  tiles: Tile[],
  width: number,
  height: number,
  rng: () => number,
  kinds: TileKind[],
  maxTier: number,
): { x: number; y: number } | null {
  const candidates: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = getTile(tiles, x, y, width, height);
      if (!t) continue;
      if (!kinds.includes(t.kind)) continue;
      if (t.kind === 'pad' || t.footprint === 0) continue;
      if (t.tier >= maxTier || t.construction > 0) continue;
      candidates.push({ x, y });
    }
  }
  if (candidates.length === 0) return null;
  return candidates[pickInt(rng, 0, candidates.length - 1)]!;
}

/**
 * 道路延伸候補。
 * 一本道の外向き延伸より、既存道路からの分岐（T字）と建物周辺の網目化を優先する。
 * 伐採・橋など地形追加コストが高いマスは避け、安い草地を選ぶ。
 */
export function findRoadExtension(
  tiles: Tile[],
  width: number,
  height: number,
  rng: () => number,
  focus: Settlement | null,
  balance: BalanceConfig = DEFAULT_BALANCE,
): { x: number; y: number } | null {
  const ends: Array<{ x: number; y: number; score: number }> = [];
  const cx = focus?.cx ?? width / 2;
  const cy = focus?.cy ?? height / 2;
  const coreR = focus ? focus.radius + 4 : 10;
  const scanR = focus ? Math.ceil(focus.radius) + 12 : Math.min(width, height);
  const baseRoadCost = Math.max(1, balance.buildCosts.road);
  const y0 = Math.max(0, cy - scanR);
  const y1 = Math.min(height - 1, cy + scanR);
  const x0 = Math.max(0, cx - scanR);
  const x1 = Math.min(width - 1, cx + scanR);

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const t = getTile(tiles, x, y, width, height);
      if (!t || !ROAD_LIKE.has(t.kind)) continue;

      const parentLinks = roadNeighborCount(tiles, x, y, width, height);

      for (const n of neighbors4(x, y, width, height)) {
        const nt = tiles[n.y * width + n.x]!;
        if (!isPaveable(nt.kind)) continue;
        if (wouldFormRoadBlock2x2(tiles, n.x, n.y, width, height)) continue;

        const surcharge = terrainBuildSurcharge(nt.kind, 'road', balance);
        if (!Number.isFinite(surcharge)) continue;
        const totalCost = baseRoadCost + surcharge;

        const links = roadNeighborCount(tiles, n.x, n.y, width, height);
        if (links >= 3) continue;
        if (links >= 2 && parentLinks >= 2) continue;

        // 幹線の途中から枝を出す（T字）を先端延伸より強く優遇
        let score = 0;
        if (parentLinks === 2) score += 4.8;
        else if (parentLinks <= 1) score += 1.6;
        else score -= 1.2;

        const dx = n.x - x;
        const dy = n.y - y;
        const back = getTile(tiles, x - dx, y - dy, width, height);
        const isStraight = !!(back && ROAD_LIKE.has(back.kind));
        // 直進は弱め、直角分岐を優先して網目を作る
        if (isStraight) score += 1.0;
        else score += 3.2;

        // 既存道路へ近づく接続は歓迎
        if (links === 1) score += 3.5;
        else if (links === 2) score -= 1.8;

        const density = countBuildingsNear(tiles, n.x, n.y, width, height, 3);
        const parentDensity = countBuildingsNear(tiles, x, y, width, height, 3);
        score += Math.min(4.5, density * 0.85 + parentDensity * 0.35);

        const dist = Math.hypot(n.x - cx, n.y - cy);
        const parentDist = Math.hypot(x - cx, y - cy);

        // 集落圏外の過疎延伸を強く抑える
        if (dist > coreR) {
          score -= (dist - coreR) * 0.45;
          if (density === 0 && parentDensity === 0) score -= 4.0;
        } else {
          score += 1.2 - (dist / (coreR + 1)) * 0.6;
        }

        // 外向きは建物があるときだけわずかに優遇（フロンティア開拓はしない）
        if (dist > parentDist) {
          score += density + parentDensity > 0 ? 0.7 : -2.0;
        } else {
          score += 0.4;
        }

        score += settlementBiasScore(n.x, n.y, focus) * 0.85;

        // 安いマスを選ぶ（草地≪伐採≪橋）。コスト比で減点するので特別扱いしない
        const costRatio = totalCost / baseRoadCost;
        score += 1.4 / costRatio;
        score -= (costRatio - 1) * 4.5;

        // 極端な過疎先端は候補から外す（分岐も圏内にない場合の逃げ道は残す）
        if (dist > coreR + 6 && density === 0 && parentDensity === 0 && parentLinks <= 1) {
          continue;
        }

        score += rng() * 0.5;
        ends.push({ x: n.x, y: n.y, score });
      }
    }
  }

  if (ends.length === 0) return null;
  ends.sort((a, b) => b.score - a.score);
  const pool = ends.slice(0, Math.min(10, ends.length));
  return pool[pickInt(rng, 0, pool.length - 1)]!;
}

function collectRailNodes(
  tiles: Tile[],
  width: number,
  height: number,
): Array<{ x: number; y: number }> {
  const nodes: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = tiles[y * width + x]!;
      if (
        t.kind === 'rail' ||
        t.kind === 'station' ||
        t.kind === 'crossing' ||
        t.kind === 'bridge'
      ) {
        nodes.push({ x, y });
      }
    }
  }
  return nodes;
}

/** 駅を置けるマス（道路・水・橋の上は不可） */
function canPlaceStationOn(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
): boolean {
  const t = getTile(tiles, x, y, width, height);
  if (!t) return false;
  return t.kind === 'grass' || t.kind === 'empty' || t.kind === 'forest' || t.kind === 'rail';
}

/** 既存駅までの最短距離 */
function nearestStationDistance(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
): number {
  let best = Number.POSITIVE_INFINITY;
  for (let sy = 0; sy < height; sy++) {
    for (let sx = 0; sx < width; sx++) {
      if (tiles[sy * width + sx]!.kind !== 'station') continue;
      const d = Math.hypot(sx - x, sy - y);
      if (d < best) best = d;
    }
  }
  return best;
}

/** 新駅を置けるか（用地 + 間隔 + 人口密集地） */
function canBuildNewStationAt(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
  minSpacing = MIN_STATION_SPACING,
): boolean {
  if (!canPlaceStationOn(tiles, x, y, width, height)) return false;
  if (tiles[y * width + x]!.kind === 'station') return true;
  if (nearestStationDistance(tiles, x, y, width, height) < minSpacing) return false;
  // 空地に駅を立てて町を引っ張らない。密集地のみ
  return isUrbanStationSite(tiles, x, y, width, height);
}

/** 半径内の既存駅 */
function findStationWithin(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): { x: number; y: number } | null {
  let best: { x: number; y: number } | null = null;
  let bestD = radius;
  const y0 = Math.max(0, Math.floor(y - radius));
  const y1 = Math.min(height - 1, Math.ceil(y + radius));
  const x0 = Math.max(0, Math.floor(x - radius));
  const x1 = Math.min(width - 1, Math.ceil(x + radius));
  for (let sy = y0; sy <= y1; sy++) {
    for (let sx = x0; sx <= x1; sx++) {
      const tile = tiles[sy * width + sx];
      if (!tile || tile.kind !== 'station') continue;
      const d = Math.hypot(sx - x, sy - y);
      if (d <= bestD) {
        bestD = d;
        best = { x: sx, y: sy };
      }
    }
  }
  return best;
}

/** 終点用: 駅用地にスナップ（道路は拒否）。近すぎる新駅は避ける */
function snapStationSite(
  tiles: Tile[],
  p: { x: number; y: number },
  width: number,
  height: number,
): { x: number; y: number } | null {
  // 近くに既存駅があればそれを使う
  const existing = findStationWithin(tiles, p.x, p.y, width, height, MIN_STATION_SPACING);
  if (existing) return existing;

  if (canBuildNewStationAt(tiles, p.x, p.y, width, height)) return p;
  // 近傍の空き地を探す（道路隣接を優先、間隔も守る）
  const neigh = neighbors4(p.x, p.y, width, height);
  const scored = neigh
    .filter((n) => canBuildNewStationAt(tiles, n.x, n.y, width, height))
    .map((n) => {
      const nearRoad = neighbors4(n.x, n.y, width, height).some((m) =>
        ROAD_LIKE.has(tiles[m.y * width + m.x]!.kind),
      );
      return { ...n, score: nearRoad ? 2 : 1 };
    })
    .sort((a, b) => b.score - a.score);
  return scored[0] ?? null;
}

/** 線路1マスの配置コスト（地形サーチャージ込み） */
function railCellCost(
  underKind: TileKind,
  asStation: boolean,
  balance: BalanceConfig,
): number {
  const costs = balance.buildCosts;
  // 駅は道路上に建てない
  if (asStation && (underKind === 'road' || underKind === 'water' || underKind === 'bridge')) {
    return Number.POSITIVE_INFINITY;
  }
  const base = asStation
    ? costs.station
    : underKind === 'road'
      ? costs.crossing
      : costs.rail;
  const action =
    asStation ? 'station' : underKind === 'road' ? 'crossing' : 'rail';
  const surcharge = terrainBuildSurcharge(underKind, action, balance);
  if (!Number.isFinite(surcharge)) return Number.POSITIVE_INFINITY;
  return base + surcharge;
}

/** 使える建設資金（手元 + 借金枠） */
export function spendRoom(budget: number, balance: BalanceConfig): number {
  return budget + balance.budget.debtLimit;
}

function canAfford(budget: number, cost: number, balance: BalanceConfig): boolean {
  return cost <= spendRoom(budget, balance);
}

/**
 * 駅A→駅B、または既存路線→新駅を一括敷設する。
 * 途中で予算切れにならないよう、先に見積もってから確定する。
 * 中途半端な線路だけの敷設はしない。
 */
function buildRailCorridor(
  tiles: Tile[],
  width: number,
  height: number,
  rng: () => number,
  balance: BalanceConfig,
  budget: number,
  focus: Settlement | null,
  intercity: { a: { x: number; y: number }; b: { x: number; y: number } } | null,
): { placed: number; kinds: string[]; cost: number; intercity: boolean; path: Array<{ x: number; y: number }> } | null {
  const cap = spendRoom(budget, balance);
  const existing = collectRailNodes(tiles, width, height);

  /**
   * stationMode:
   * - both: 両端に駅（駅↔駅）
   * - goal: 終点のみ駅（既存路線→新駅）。始点は既存 rail/station のまま
   */
  const estimatePath = (
    path: Array<{ x: number; y: number }>,
    stationMode: 'both' | 'goal',
  ): number | null => {
    if (path.length < 2) return null;
    let total = 0;
    for (let i = 0; i < path.length; i++) {
      const c = path[i]!;
      const isStart = i === 0;
      const isGoal = i === path.length - 1;
      const needStation =
        (stationMode === 'both' && (isStart || isGoal)) ||
        (stationMode === 'goal' && isGoal);
      const t = getTile(tiles, c.x, c.y, width, height)!;
      if (t.kind === 'station') continue;
      if (t.kind === 'rail' || t.kind === 'crossing' || t.kind === 'bridge') {
        if (needStation && t.kind === 'rail') {
          // 近傍に既存駅があれば昇格しない
          if (!findStationWithin(tiles, c.x, c.y, width, height, MIN_STATION_SPACING - 0.01)) {
            total += 5;
          }
        }
        continue;
      }
      if (needStation) {
        // 近傍に既存駅があれば新設コストなし
        if (findStationWithin(tiles, c.x, c.y, width, height, MIN_STATION_SPACING - 0.01)) {
          continue;
        }
        const site =
          canBuildNewStationAt(tiles, c.x, c.y, width, height)
            ? c
            : snapStationSite(tiles, c, width, height);
        if (!site) return null;
        const st = getTile(tiles, site.x, site.y, width, height)!;
        if (st.kind === 'station') continue;
        if (!canBuildNewStationAt(tiles, site.x, site.y, width, height)) return null;
        const cell = railCellCost(st.kind === 'rail' ? 'grass' : st.kind, true, balance);
        if (!Number.isFinite(cell)) return null;
        total += cell;
        continue;
      }
      if (isStart && stationMode === 'goal') {
        // 既存ネットワーク上から伸ばす前提。始点が線路系でなければ不可
        return null;
      }
      if (t.kind === 'road' || isPaveable(t.kind)) {
        const cell = railCellCost(t.kind, false, balance);
        if (!Number.isFinite(cell)) return null;
        total += cell;
      } else {
        return null;
      }
    }
    return total;
  };

  const placeCell = (
    x: number,
    y: number,
    asStation: boolean,
    construction = asStation ? CONSTRUCTION_FRAMES : RAIL_FRAMES,
  ): number => {
    const t = getTile(tiles, x, y, width, height)!;
    if (t.kind === 'rail' || t.kind === 'station' || t.kind === 'crossing' || t.kind === 'bridge') {
      return 0;
    }
    if (asStation && !canBuildNewStationAt(tiles, x, y, width, height)) return -1;
    const cellCost = railCellCost(t.kind, asStation, balance);
    if (!Number.isFinite(cellCost)) return -1;

    if (asStation) {
      setTile(
        tiles,
        x,
        y,
        width,
        makeTile('station', 1, pickInt(rng, 0, 2), construction, 'both'),
      );
      return cellCost;
    }
    if (t.kind === 'road') {
      setTile(
        tiles,
        x,
        y,
        width,
        makeTile('crossing', 0, 0, Math.max(construction, ROAD_FRAMES), 'both'),
      );
      return cellCost;
    }
    if (!isPaveable(t.kind)) return -1;
    const kind = pavedKind(t.kind, 'rail');
    setTile(tiles, x, y, width, makeTile(kind, 0, 0, construction, 'x'));
    return cellCost;
  };

  const ensureStationAt = (x: number, y: number, construction = CONSTRUCTION_FRAMES): number => {
    const t = getTile(tiles, x, y, width, height);
    if (!t) return -1;
    if (t.kind === 'station') return 0;
    // 近傍に既存駅があれば新設しない（間隔を保つ）
    if (findStationWithin(tiles, x, y, width, height, MIN_STATION_SPACING - 0.01)) {
      return 0;
    }
    if (canBuildNewStationAt(tiles, x, y, width, height)) {
      if (t.kind === 'rail') {
        setTile(
          tiles,
          x,
          y,
          width,
          makeTile('station', 1, pickInt(rng, 0, 2), construction, mergeFacing(t.facing, 'both')),
        );
        return 5;
      }
      return placeCell(x, y, true, construction);
    }
    const site = snapStationSite(tiles, { x, y }, width, height);
    if (!site) return -1;
    const st = getTile(tiles, site.x, site.y, width, height)!;
    if (st.kind === 'station') return 0;
    if (!canBuildNewStationAt(tiles, site.x, site.y, width, height)) return -1;
    if (st.kind === 'rail') {
      setTile(
        tiles,
        site.x,
        site.y,
        width,
        makeTile('station', 1, pickInt(rng, 0, 2), construction, mergeFacing(st.facing, 'both')),
      );
      return 5;
    }
    return placeCell(site.x, site.y, true, construction);
  };

  /** 見積もり OK なら一括敷設。条件を満たせなければロールバックして何も置かない */
  const commitPath = (
    path: Array<{ x: number; y: number }>,
    stationMode: 'both' | 'goal',
    intercityFlag: boolean,
  ): { placed: number; kinds: string[]; cost: number; intercity: boolean; path: Array<{ x: number; y: number }> } | null => {
    const est = estimatePath(path, stationMode);
    if (est == null || est > cap) return null;

    const snap = path.map((c) => {
      const t = tiles[c.y * width + c.x]!;
      return { x: c.x, y: c.y, tile: { ...t } };
    });
    const extra: Array<{ x: number; y: number; tile: Tile }> = [];
    for (const c of [path[0]!, path[path.length - 1]!]) {
      for (const n of neighbors4(c.x, c.y, width, height)) {
        if (snap.some((s) => s.x === n.x && s.y === n.y)) continue;
        if (extra.some((s) => s.x === n.x && s.y === n.y)) continue;
        extra.push({ x: n.x, y: n.y, tile: { ...tiles[n.y * width + n.x]! } });
      }
    }

    const kinds: string[] = [];
    let placed = 0;
    let cost = 0;
    let ok = true;

    for (let i = 0; i < path.length; i++) {
      const c = path[i]!;
      const isStart = i === 0;
      const isGoal = i === path.length - 1;
      const needStation =
        (stationMode === 'both' && (isStart || isGoal)) ||
        (stationMode === 'goal' && isGoal);
      const t = getTile(tiles, c.x, c.y, width, height)!;
      const buildFrames = RAIL_FRAMES + i * RAIL_BUILD_STAGGER;

      if (needStation) {
        if (t.kind === 'station') {
          kinds.push('station');
          continue;
        }
        const spent = ensureStationAt(c.x, c.y, Math.max(buildFrames, CONSTRUCTION_FRAMES));
        if (spent < 0) {
          ok = false;
          break;
        }
        cost += spent;
        kinds.push('station');
        if (spent > 5) placed += 1;
        continue;
      }

      if (
        t.kind === 'rail' ||
        t.kind === 'station' ||
        t.kind === 'crossing' ||
        t.kind === 'bridge'
      ) {
        continue;
      }
      const spent = placeCell(c.x, c.y, false, buildFrames);
      if (spent < 0) {
        ok = false;
        break;
      }
      cost += spent;
      placed += 1;
      const nt = getTile(tiles, c.x, c.y, width, height)!;
      kinds.push(nt.kind);
    }

    if (ok) {
      stampFacingAlongPath(tiles, path, width);
      const hasStationNear = (x: number, y: number) => {
        const here = getTile(tiles, x, y, width, height);
        if (here?.kind === 'station') return true;
        return neighbors4(x, y, width, height).some(
          (n) => tiles[n.y * width + n.x]!.kind === 'station',
        );
      };
      const onNetwork = (x: number, y: number) => {
        const k = getTile(tiles, x, y, width, height)?.kind;
        return k === 'rail' || k === 'station' || k === 'crossing' || k === 'bridge';
      };
      const a = path[0]!;
      const b = path[path.length - 1]!;
      if (stationMode === 'both') {
        if (!hasStationNear(a.x, a.y) || !hasStationNear(b.x, b.y)) ok = false;
      } else {
        if (!onNetwork(a.x, a.y) || !hasStationNear(b.x, b.y)) ok = false;
      }
    }

    if (!ok || cost > cap) {
      for (const s of snap) setTile(tiles, s.x, s.y, width, s.tile);
      for (const s of extra) setTile(tiles, s.x, s.y, width, s.tile);
      return null;
    }

    return {
      placed,
      kinds: [...new Set(kinds)],
      cost,
      intercity: intercityFlag,
      path,
    };
  };

  const tryConnect = (
    a: { x: number; y: number },
    b: { x: number; y: number },
    maxLen: number,
    stationMode: 'both' | 'goal',
    intercityFlag: boolean,
  ): { placed: number; kinds: string[]; cost: number; intercity: boolean; path: Array<{ x: number; y: number }> } | null => {
    let start = a;
    let goal = b;
    if (stationMode === 'both') {
      const sa = snapStationSite(tiles, a, width, height);
      const sb = snapStationSite(tiles, b, width, height);
      if (!sa || !sb) return null;
      start = getTile(tiles, a.x, a.y, width, height)?.kind === 'station' ? a : sa;
      goal = getTile(tiles, b.x, b.y, width, height)?.kind === 'station' ? b : sb;
    } else {
      // 既存路線から: 始点はそのまま、終点だけ駅用地へ
      const sk = getTile(tiles, a.x, a.y, width, height)?.kind;
      if (sk !== 'rail' && sk !== 'station' && sk !== 'crossing' && sk !== 'bridge') {
        return null;
      }
      if (getTile(tiles, b.x, b.y, width, height)?.kind !== 'station') {
        const sb = snapStationSite(tiles, b, width, height);
        if (!sb) return null;
        goal = sb;
      }
    }
    const path = findRailPath(tiles, width, height, start, goal, maxLen);
    if (!path) return null;
    return commitPath(path, stationMode, intercityFlag);
  };

  // 1) 都市間: 駅↔駅
  if (intercity) {
    const r = tryConnect(intercity.a, intercity.b, 140, 'both', true);
    if (r) return r;
  }

  // 2) 新規: 集落内の駅用地2点を結ぶ
  if (existing.length === 0) {
    const cx = focus?.cx ?? Math.floor(width / 2);
    const cy = focus?.cy ?? Math.floor(height / 2);
    const sites: Array<{ x: number; y: number }> = [];
    for (let y = cy - 12; y <= cy + 12; y++) {
      for (let x = cx - 14; x <= cx + 14; x++) {
        if (!canBuildNewStationAt(tiles, x, y, width, height)) continue;
        const nearRoad = neighbors4(x, y, width, height).some((n) =>
          ROAD_LIKE.has(tiles[n.y * width + n.x]!.kind),
        );
        if (!nearRoad) continue;
        sites.push({ x, y });
      }
    }
    if (sites.length < 2) return null;
    for (let attempt = 0; attempt < 40; attempt++) {
      const a = sites[pickInt(rng, 0, sites.length - 1)]!;
      const b = sites[pickInt(rng, 0, sites.length - 1)]!;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < MIN_STATION_SPACING || d > 22) continue;
      const r = tryConnect(a, b, 48, 'both', false);
      if (r) return r;
    }
    return null;
  }

  // 3) 既存路線の途中/端 → 新しい駅（始点は駅化しない）
  const starts = existing.filter((p) => {
    const k = tiles[p.y * width + p.x]!.kind;
    return k === 'rail' || k === 'station';
  });
  if (starts.length === 0) return null;

  starts.sort((a, b) => {
    if (!focus) return 0;
    return (
      Math.hypot(a.x - focus.cx, a.y - focus.cy) -
      Math.hypot(b.x - focus.cx, b.y - focus.cy)
    );
  });

  const start = starts[pickInt(rng, 0, Math.min(5, starts.length - 1))]!;
  const stationTargets: Array<{ x: number; y: number }> = [];

  for (const e of existing) {
    if (e.x === start.x && e.y === start.y) continue;
    if (tiles[e.y * width + e.x]!.kind !== 'station') continue;
    const dist = Math.hypot(e.x - start.x, e.y - start.y);
    if (dist >= MIN_STATION_SPACING && dist <= 40) stationTargets.push(e);
  }

  const scanR = focus ? Math.ceil(focus.radius) + 16 : 22;
  const sy0 = Math.max(2, (focus?.cy ?? start.y) - scanR);
  const sy1 = Math.min(height - 3, (focus?.cy ?? start.y) + scanR);
  const sx0 = Math.max(2, (focus?.cx ?? start.x) - scanR);
  const sx1 = Math.min(width - 3, (focus?.cx ?? start.x) + scanR);
  for (let y = sy0; y <= sy1; y++) {
    for (let x = sx0; x <= sx1; x++) {
      if (!canBuildNewStationAt(tiles, x, y, width, height)) continue;
      const nearRoad = neighbors4(x, y, width, height).some((n) =>
        ROAD_LIKE.has(tiles[n.y * width + n.x]!.kind),
      );
      if (!nearRoad) continue;
      const dist = Math.hypot(x - start.x, y - start.y);
      if (dist < MIN_STATION_SPACING || dist > 28) continue;
      stationTargets.push({ x, y });
    }
  }

  stationTargets.sort((a, b) => {
    const dens =
      countBuildingsNear(tiles, b.x, b.y, width, height) -
      countBuildingsNear(tiles, a.x, a.y, width, height);
    if (dens !== 0) return dens;
    return (
      Math.hypot(a.x - start.x, a.y - start.y) - Math.hypot(b.x - start.x, b.y - start.y)
    );
  });

  const pool = stationTargets.slice(0, Math.min(10, stationTargets.length));
  for (let i = 0; i < pool.length; i++) {
    const target = pool[pickInt(rng, 0, pool.length - 1)]!;
    const r = tryConnect(start, target, 60, 'goal', false);
    if (r) return r;
  }

  return null;
}

function findStationSpot(
  tiles: Tile[],
  width: number,
  height: number,
  rng: () => number,
  focus: Settlement | null,
): { x: number; y: number } | null {
  const candidates: Array<{ x: number; y: number; score: number }> = [];
  const cx = focus?.cx ?? width / 2;
  const cy = focus?.cy ?? height / 2;
  const scanR = focus ? Math.ceil(focus.radius) + 12 : 24;
  const y0 = Math.max(1, cy - scanR);
  const y1 = Math.min(height - 2, cy + scanR);
  const x0 = Math.max(1, cx - scanR);
  const x1 = Math.min(width - 2, cx + scanR);

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const t = getTile(tiles, x, y, width, height);
      if (!t) continue;
      if (t.kind === 'station') continue;
      if (!canBuildNewStationAt(tiles, x, y, width, height)) continue;

      const onRail = t.kind === 'rail';
      const nearRail = neighbors4(x, y, width, height).some((n) => {
        const nt = tiles[n.y * width + n.x]!;
        return nt.kind === 'rail' || nt.kind === 'crossing' || nt.kind === 'station';
      });
      // 既存路線の利便性向上が主目的。線路から離れた空地には建てない
      if (!onRail && !nearRail) continue;

      const density = countBuildingsNear(tiles, x, y, width, height);
      const score =
        density * 1.5 +
        (onRail ? 4 : nearRail ? 2.5 : 0) +
        settlementBiasScore(x, y, focus) +
        rng() * 0.3;
      candidates.push({ x, y, score });
    }
  }
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);
  return candidates[pickInt(rng, 0, Math.min(5, candidates.length - 1))]!;
}

function placeBuilding(
  tiles: Tile[],
  width: number,
  height: number,
  x: number,
  y: number,
  kind: TileKind,
  tier: number,
  rng: () => number,
): boolean {
  if (!inBounds(x, y, width, height)) return false;
  const t = getTile(tiles, x, y, width, height);
  if (!t || !isBuildable(t.kind)) return false;
  setTile(tiles, x, y, width, makeTile(kind, tier, pickInt(rng, 0, 7), CONSTRUCTION_FRAMES));
  return true;
}

/**
 * 地価スコア 0〜1。
 * 周辺密度・高級用途・街レベル・人口・予算から緩やかに上がる。
 * stage（グローバルネットワーク段階）ではなく、街単体の level を使う。
 */
export function landValueScore(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
  level: SettlementLevel,
  stats: CityStats,
  balance: BalanceConfig = DEFAULT_BALANCE,
): number {
  const density = countBuildingsNear(tiles, x, y, width, height, 4);
  const densityScore = Math.min(1, density / 16);

  let premium = 0;
  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      const t = getTile(tiles, x + dx, y + dy, width, height);
      if (!t) continue;
      if (t.kind === 'commercial') premium += 0.025;
      else if (t.kind === 'tower') premium += 0.05;
      else if (t.kind === 'skyscraper') premium += 0.07;
      else if (t.kind === 'plaza' || t.kind === 'station') premium += 0.02;
    }
  }
  premium = Math.min(1, premium);

  const levelScore =
    level === 'metropolis' ? 0.5 : level === 'city' ? 0.28 : level === 'town' ? 0.1 : 0;

  const metro = Math.max(1, balance.stages.metropolis);
  const popScore = Math.min(1, stats.population / (metro * 1.5));
  const budgetScore = Math.min(0.15, Math.max(0, stats.budget) / 2500);

  return (
    densityScore * 0.38 +
    premium * 0.22 +
    levelScore * 0.22 +
    popScore * 0.13 +
    budgetScore * 0.05
  );
}

/** 塔向け: 街レベルが city 以上で中程度の地価 */
export function isMediumLandValue(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
  level: SettlementLevel,
  stats: CityStats,
  balance: BalanceConfig = DEFAULT_BALANCE,
): boolean {
  if (level !== 'city' && level !== 'metropolis') return false;
  if (stats.population < balance.stages.city * 0.85) return false;
  return landValueScore(tiles, x, y, width, height, level, stats, balance) >= 0.48;
}

/** 超高層（1タイル）向け: 街レベルが metropolis + 高地価 */
export function isHighLandValue(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
  level: SettlementLevel,
  stats: CityStats,
  balance: BalanceConfig = DEFAULT_BALANCE,
): boolean {
  if (level !== 'metropolis') return false;
  if (stats.population < balance.stages.metropolis) return false;
  if (stats.budget < 80) return false;
  return landValueScore(tiles, x, y, width, height, level, stats, balance) >= 0.68;
}

/** 2x2 超高層向け: さらに人口・地価が乗ってから */
export function isPremiumLandValue(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
  level: SettlementLevel,
  stats: CityStats,
  balance: BalanceConfig = DEFAULT_BALANCE,
): boolean {
  if (level !== 'metropolis') return false;
  if (stats.population < balance.stages.metropolis * 1.25) return false;
  if (stats.budget < 150) return false;
  return landValueScore(tiles, x, y, width, height, level, stats, balance) >= 0.74;
}

/** 2x2 空き（建設可・道路隣接・逃げ道を塞がない）を探す */
export function findFootprint2x2NearRoad(
  tiles: Tile[],
  width: number,
  height: number,
  rng: () => number,
  focus: Settlement | null,
  level: SettlementLevel,
  stats: CityStats,
  landCheck: 'high' | 'premium' = 'premium',
  balance: BalanceConfig = DEFAULT_BALANCE,
): { x: number; y: number } | null {
  const candidates: Array<{ x: number; y: number; score: number }> = [];
  const cx = focus?.cx ?? width / 2;
  const cy = focus?.cy ?? height / 2;
  const scanR = focus ? Math.ceil(focus.radius) + 14 : Math.min(width, height);

  const y0 = Math.max(0, cy - scanR);
  const y1 = Math.min(height - 2, cy + scanR);
  const x0 = Math.max(0, cx - scanR);
  const x1 = Math.min(width - 2, cx + scanR);

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!isFootprint2x2Clear(tiles, x, y, width, height)) continue;
      if (!footprint2x2TouchesRoad(tiles, x, y, width, height)) continue;
      const ok =
        landCheck === 'premium'
          ? isPremiumLandValue(tiles, x, y, width, height, level, stats, balance)
          : isHighLandValue(tiles, x, y, width, height, level, stats, balance);
      if (!ok) continue;

      let blocksEscape = false;
      for (const [dx, dy] of FOOTPRINT_2X2) {
        if (isLastEscapeForBuilding(tiles, x + dx, y + dy, width, height)) {
          blocksEscape = true;
          break;
        }
      }
      if (blocksEscape) continue;

      const dist = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      const density = countBuildingsNear(tiles, x, y, width, height, 3);
      const lv = landValueScore(tiles, x, y, width, height, level, stats, balance);
      candidates.push({
        x,
        y,
        score: density * 0.08 + lv * 3 - dist * 0.08 + settlementBiasScore(x, y, focus) + rng() * 0.25,
      });
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);
  const top = candidates.slice(0, Math.min(8, candidates.length));
  return top[pickInt(rng, 0, top.length - 1)]!;
}

/** 2x2 高層を配置。アンカーに kind、他3マスは pad */
export function placeFootprint2x2(
  tiles: Tile[],
  width: number,
  height: number,
  ax: number,
  ay: number,
  kind: TileKind,
  tier: number,
  rng: () => number,
): boolean {
  if (!isFootprint2x2Clear(tiles, ax, ay, width, height)) return false;
  const variant = pickInt(rng, 0, 7);
  const anchorIndex = idx(ax, ay, width);
  for (const [dx, dy] of FOOTPRINT_2X2) {
    const x = ax + dx;
    const y = ay + dy;
    if (dx === 0 && dy === 0) {
      setTile(
        tiles,
        x,
        y,
        width,
        makeTile(kind, tier, variant, CONSTRUCTION_FRAMES, 'none', 2, -1),
      );
    } else {
      setTile(
        tiles,
        x,
        y,
        width,
        makeTile('pad', 0, variant, CONSTRUCTION_FRAMES, 'none', 0, anchorIndex),
      );
    }
  }
  return true;
}

function needsToWeights(
  need: BuildNeed,
  stage: GrowthStage,
  roadBlocked: boolean,
  multiSettlement: boolean,
): Array<{ key: BuildAction; w: number }> {
  // 都市間鉄道は大都会寄り。町段階ではほぼ狙わない
  const intercityBoost = multiSettlement
    ? stage === 'metropolis'
      ? 0.35
      : stage === 'city'
        ? 0.12
        : 0
    : 0;
  const w: Array<{ key: BuildAction; w: number }> = [
    { key: 'residential', w: need.residential },
    { key: 'commercial', w: need.commercial },
    { key: 'industrial', w: need.industrial },
    { key: 'road', w: need.road + (roadBlocked ? 1.4 : 0) + (multiSettlement ? 0.35 : 0) },
    { key: 'rail', w: need.rail + intercityBoost },
    { key: 'school', w: need.school },
    { key: 'park', w: need.park },
    { key: 'hospital', w: need.hospital },
    { key: 'tower', w: need.tower },
    { key: 'station', w: need.station },
    {
      key: 'plaza',
      w: stage === 'city' ? 0.3 : stage === 'metropolis' ? 0.45 : 0.05,
    },
    {
      key: 'upgrade',
      w: stage === 'town' ? 0.55 : stage === 'city' ? 0.95 : stage === 'metropolis' ? 1.4 : 0.15,
    },
    { key: 'skyscraper', w: need.skyscraper },
    { key: 'demolish', w: roadBlocked ? 2.0 : 0.05 },
  ];
  return w;
}

export interface BuildResult {
  built: boolean;
  kind?: string;
  cost: number;
  /** 線路コリドーを敷いたとき、その経路（電車スポーン用） */
  trainPath?: Array<{ x: number; y: number }>;
}

/** 1 回の建設試行（集落フォーカス付き） */
export function tryBuild(
  tiles: Tile[],
  width: number,
  height: number,
  stats: CityStats,
  stage: GrowthStage,
  seed: number,
  day: number,
  balance: BalanceConfig = DEFAULT_BALANCE,
  settlements: Settlement[] = [],
): BuildResult {
  const rng = createRng((seed ^ (day * 2654435761)) >>> 0);
  const costs = balance.buildCosts;
  const focus = pickSettlement(settlements, tiles, width, height, rng);

  // 街の都会度: フォーカス集落の level を使い、グローバル stage とは分ける。
  // 集落が未定またはレベル未設定のときはグローバル stage で代替。
  const focusLevel: SettlementLevel = focus?.level ?? stage;

  const need = computeBuildNeeds(stats, stage, focusLevel, balance);
  const roadBlocked = isRoadGrowthBlocked(tiles, width, height);
  const multi = settlements.length >= 2;
  const action = weightedPick(rng, needsToWeights(need, stage, roadBlocked, multi));

  if (action === 'demolish' || (action === 'road' && roadBlocked)) {
    const target = findDemolitionForRoad(
      tiles,
      width,
      height,
      stats.population,
      stats.housing,
    );
    if (target) {
      const demolishCost = Math.round(costs.road * 1.5);
      if (canAfford(stats.budget, demolishCost, balance)) {
        setTile(tiles, target.x, target.y, width, makeTile('road', 0, 0, ROAD_FRAMES, 'x'));
        stampRoadFacingAt(tiles, target.x, target.y, width, height);
        return { built: true, kind: 'demolish', cost: demolishCost };
      }
    }
    if (action === 'demolish') return { built: false, cost: 0 };
  }

  if (action === 'upgrade') {
    // アップグレード上限は街レベルで決める（グローバル stage ではなく局所密度）
    const maxTier = focusLevel === 'metropolis' ? 5 : focusLevel === 'city' ? 4 : 3;
    const target = findUpgradeTarget(
      tiles,
      width,
      height,
      rng,
      ['residential', 'commercial', 'industrial', 'tower'],
      maxTier,
    );
    if (!target) return { built: false, cost: 0 };
    const t = getTile(tiles, target.x, target.y, width, height)!;
    const cost = costs.upgradeBase * (t.tier + 1) * (t.footprint >= 2 ? 2 : 1);
    if (!canAfford(stats.budget, cost, balance)) return { built: false, cost: 0 };
    t.tier += 1;
    t.construction = UPGRADE_FRAMES;
    // 2x2 の pad も建設アニメを同期
    if (t.footprint >= 2) {
      for (const [dx, dy] of FOOTPRINT_2X2) {
        if (dx === 0 && dy === 0) continue;
        const pad = getTile(tiles, target.x + dx, target.y + dy, width, height);
        if (pad && pad.kind === 'pad') pad.construction = UPGRADE_FRAMES;
      }
    }
    return { built: true, kind: 'upgrade', cost };
  }

  const baseCost = (costs as Record<string, number>)[action] ?? costs.fallback;

  if (action === 'road') {
    const spot = findRoadExtension(tiles, width, height, rng, focus, balance);
    if (!spot) {
      const target = findDemolitionForRoad(
        tiles,
        width,
        height,
        stats.population,
        stats.housing,
      );
      if (!target) return { built: false, cost: 0 };
      const demolishCost = Math.round(costs.road * 1.5);
      if (!canAfford(stats.budget, demolishCost, balance)) return { built: false, cost: 0 };
      setTile(tiles, target.x, target.y, width, makeTile('road', 0, 0, ROAD_FRAMES, 'x'));
      stampRoadFacingAt(tiles, target.x, target.y, width, height);
      return { built: true, kind: 'demolish', cost: demolishCost };
    }
    const under = getTile(tiles, spot.x, spot.y, width, height)!;
    const surcharge = terrainBuildSurcharge(under.kind, 'road', balance);
    const total = costs.road + (Number.isFinite(surcharge) ? surcharge : 0);
    if (!canAfford(stats.budget, total, balance)) return { built: false, cost: 0 };
    const kind = pavedKind(under.kind, 'road');
    setTile(tiles, spot.x, spot.y, width, makeTile(kind, 0, 0, ROAD_FRAMES, 'x'));
    stampRoadFacingAt(tiles, spot.x, spot.y, width, height);
    return { built: true, kind, cost: total };
  }

  if (action === 'rail') {
    const wantIntercity = shouldTryIntercityRail(settlements, stage, rng);
    const pair = wantIntercity
      ? findIntercityRailPair(settlements, tiles, width, height, rng)
      : null;
    const corridor = buildRailCorridor(
      tiles,
      width,
      height,
      rng,
      balance,
      stats.budget,
      focus,
      pair,
    );
    if (!corridor) return { built: false, cost: 0 };
    const label = corridor.intercity
      ? 'intercity-rail'
      : corridor.kinds.includes('station')
        ? 'rail'
        : corridor.kinds.includes('bridge')
          ? 'bridge'
          : corridor.kinds.includes('crossing')
            ? 'crossing'
            : 'rail';
    return {
      built: true,
      kind: label,
      cost: corridor.cost,
      trainPath: corridor.path.length >= 2 ? corridor.path : undefined,
    };
  }

  if (action === 'station') {
    const spot = findStationSpot(tiles, width, height, rng, focus);
    if (!spot) {
      const corridor = buildRailCorridor(
        tiles,
        width,
        height,
        rng,
        balance,
        stats.budget,
        focus,
        null,
      );
      if (!corridor) return { built: false, cost: 0 };
      return {
        built: true,
        kind: 'station',
        cost: corridor.cost,
        trainPath: corridor.path.length >= 2 ? corridor.path : undefined,
      };
    }
    // 駅は道路上に建てない（findStationSpot が保証）
    const t = getTile(tiles, spot.x, spot.y, width, height)!;
    if (!canBuildNewStationAt(tiles, spot.x, spot.y, width, height)) {
      return { built: false, cost: 0 };
    }
    const surcharge = terrainBuildSurcharge(
      t.kind === 'rail' ? 'grass' : t.kind,
      'station',
      balance,
    );
    const total = costs.station + (Number.isFinite(surcharge) ? surcharge : 0);
    if (!canAfford(stats.budget, total, balance)) return { built: false, cost: 0 };
    setTile(
      tiles,
      spot.x,
      spot.y,
      width,
      makeTile(
        'station',
        1,
        pickInt(rng, 0, 2),
        CONSTRUCTION_FRAMES,
        mergeFacing(t.facing === 'none' ? 'x' : t.facing, 'both'),
      ),
    );
    return { built: true, kind: 'station', cost: total };
  }

  const spot = findBuildableNearRoad(tiles, width, height, rng, focus);
  if (!spot) {
    const roadSpot = findRoadExtension(tiles, width, height, rng, focus, balance);
    if (roadSpot) {
      const under = getTile(tiles, roadSpot.x, roadSpot.y, width, height)!;
      const surcharge = terrainBuildSurcharge(under.kind, 'road', balance);
      const total = costs.road + (Number.isFinite(surcharge) ? surcharge : 0);
      if (canAfford(stats.budget, total, balance)) {
        const kind = pavedKind(under.kind, 'road');
        setTile(tiles, roadSpot.x, roadSpot.y, width, makeTile(kind, 0, 0, ROAD_FRAMES, 'x'));
        stampRoadFacingAt(tiles, roadSpot.x, roadSpot.y, width, height);
        return { built: true, kind, cost: total };
      }
    }
    const target = findDemolitionForRoad(
      tiles,
      width,
      height,
      stats.population,
      stats.housing,
    );
    const demolishCost = Math.round(costs.road * 1.5);
    if (target && canAfford(stats.budget, demolishCost, balance)) {
      setTile(tiles, target.x, target.y, width, makeTile('road', 0, 0, ROAD_FRAMES, 'x'));
      stampRoadFacingAt(tiles, target.x, target.y, width, height);
      return { built: true, kind: 'demolish', cost: demolishCost };
    }
    return { built: false, cost: 0 };
  }

  const kind = action as TileKind;
  const tier = action === 'skyscraper' || action === 'tower' ? 2 : 1;

  // 地価が高いエリアでは超高層・塔を 2x2 で試行（街レベルで判定）
  const want2x2 =
    (action === 'skyscraper' && focusLevel === 'metropolis') ||
    (action === 'tower' && focusLevel === 'metropolis');
  if (want2x2) {
    const spot2 = findFootprint2x2NearRoad(
      tiles,
      width,
      height,
      rng,
      focus,
      focusLevel,
      stats,
      action === 'skyscraper' ? 'premium' : 'high',
      balance,
    );
    if (spot2) {
      const under2 = getTile(tiles, spot2.x, spot2.y, width, height)!;
      const surcharge2 = terrainBuildSurcharge(under2.kind, 'building', balance);
      if (Number.isFinite(surcharge2)) {
        const total2 = Math.round(baseCost * 2.4) + surcharge2;
        if (
          canAfford(stats.budget, total2, balance) &&
          placeFootprint2x2(tiles, width, height, spot2.x, spot2.y, kind, tier, rng)
        ) {
          return {
            built: true,
            kind: action === 'skyscraper' ? 'skyscraper-2x2' : 'tower-2x2',
            cost: total2,
          };
        }
      }
    }
  }

  // 1タイルの塔・超高層も地価ゲート（街レベルで判定）
  if (action === 'skyscraper') {
    if (
      !isHighLandValue(tiles, spot.x, spot.y, width, height, focusLevel, stats, balance)
    ) {
      return { built: false, cost: 0 };
    }
  } else if (action === 'tower') {
    if (
      !isMediumLandValue(tiles, spot.x, spot.y, width, height, focusLevel, stats, balance)
    ) {
      return { built: false, cost: 0 };
    }
  }

  const under = getTile(tiles, spot.x, spot.y, width, height)!;
  const surcharge = terrainBuildSurcharge(under.kind, 'building', balance);
  if (!Number.isFinite(surcharge)) return { built: false, cost: 0 };
  const total = baseCost + surcharge;
  if (!canAfford(stats.budget, total, balance)) return { built: false, cost: 0 };
  if (!placeBuilding(tiles, width, height, spot.x, spot.y, kind, tier, rng)) {
    return { built: false, cost: 0 };
  }
  return { built: true, kind: action, cost: total };
}

const CONSTRUCTION_STEP = 1 / 3;

/** 建設中タイルの index を集める（建設日のあとなど） */
export function collectConstructionIndices(tiles: Tile[]): number[] {
  const out: number[] = [];
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i]!.construction > 0) out.push(i);
  }
  return out;
}

export interface ConstructionTickResult {
  indices: number[];
  /** ground/building の見た目バケットが変わったか */
  visualChanged: boolean;
}

/**
 * 建設アニメ進行 (ゆっくり減る)。
 * activeIndices があればその範囲だけ更新し、全タイル走査を避ける。
 */
export function tickConstruction(
  tiles: Tile[],
  activeIndices?: number[],
): ConstructionTickResult {
  const next: number[] = [];
  let visualChanged = false;

  const tickOne = (i: number) => {
    const t = tiles[i];
    if (!t || t.construction <= 0) return;
    const prevGround = Math.ceil(t.construction / 3);
    const prevBuild = Math.ceil(t.construction / 4);
    t.construction = Math.max(0, t.construction - CONSTRUCTION_STEP);
    if (t.construction > 0) {
      next.push(i);
      if (
        Math.ceil(t.construction / 3) !== prevGround ||
        Math.ceil(t.construction / 4) !== prevBuild
      ) {
        visualChanged = true;
      }
    } else {
      visualChanged = true;
    }
  };

  if (activeIndices) {
    for (const i of activeIndices) tickOne(i);
  } else {
    for (let i = 0; i < tiles.length; i++) tickOne(i);
  }

  return { indices: next, visualChanged };
}
