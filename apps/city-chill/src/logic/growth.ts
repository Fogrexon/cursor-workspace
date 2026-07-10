import type { CityStats, GrowthStage, Settlement, Tile, TileKind } from '../types';
import { DEFAULT_BALANCE, type BalanceConfig } from './balance';
import {
  findDemolitionForRoad,
  isLastEscapeForBuilding,
  isRoadGrowthBlocked,
  roadNeighborCount,
  wouldFormRoadBlock2x2,
} from './demolish';
import {
  adjacentToRoad,
  getTile,
  inBounds,
  isBuildable,
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
export const ROAD_FRAMES = 20;
export const RAIL_FRAMES = 24;

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

function findBuildableNearRoad(
  tiles: Tile[],
  width: number,
  height: number,
  rng: () => number,
  focus: Settlement | null,
): { x: number; y: number } | null {
  const candidates: Array<{ x: number; y: number; score: number }> = [];
  const cx = focus?.cx ?? width / 2;
  const cy = focus?.cy ?? height / 2;
  const scanR = focus ? Math.ceil(focus.radius) + 14 : Math.min(width, height);

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
      const forestPenalty = t.kind === 'forest' ? 0.35 : 0;
      const score =
        1 / (1 + dist * 0.12) +
        settlementBiasScore(x, y, focus) +
        rng() * 0.3 -
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
      if (t.tier >= maxTier || t.construction > 0) continue;
      candidates.push({ x, y });
    }
  }
  if (candidates.length === 0) return null;
  return candidates[pickInt(rng, 0, candidates.length - 1)]!;
}

function findRoadExtension(
  tiles: Tile[],
  width: number,
  height: number,
  rng: () => number,
  focus: Settlement | null,
): { x: number; y: number } | null {
  const ends: Array<{ x: number; y: number; score: number }> = [];
  const cx = focus?.cx ?? width / 2;
  const cy = focus?.cy ?? height / 2;
  const scanR = focus ? Math.ceil(focus.radius) + 18 : Math.min(width, height);
  const y0 = Math.max(0, cy - scanR);
  const y1 = Math.min(height - 1, cy + scanR);
  const x0 = Math.max(0, cx - scanR);
  const x1 = Math.min(width - 1, cx + scanR);

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const t = getTile(tiles, x, y, width, height);
      if (!t || !ROAD_LIKE.has(t.kind)) continue;

      const parentLinks = roadNeighborCount(tiles, x, y, width, height);
      const tipBonus = parentLinks <= 1 ? 4 : parentLinks === 2 ? 1.5 : -1;

      for (const n of neighbors4(x, y, width, height)) {
        const nt = tiles[n.y * width + n.x]!;
        if (!isPaveable(nt.kind)) continue;
        if (wouldFormRoadBlock2x2(tiles, n.x, n.y, width, height)) continue;

        const links = roadNeighborCount(tiles, n.x, n.y, width, height);
        if (links >= 3) continue;
        if (links >= 2 && parentLinks >= 2) continue;

        let score = tipBonus;

        const dx = n.x - x;
        const dy = n.y - y;
        const back = getTile(tiles, x - dx, y - dy, width, height);
        if (back && ROAD_LIKE.has(back.kind)) score += 5;
        else score += 0.5;

        if (links === 1) score += 3;
        else if (links === 2) score -= 2;

        // 集落から外向き（他集落方向への延伸も少し優遇）
        const dist = Math.hypot(n.x - cx, n.y - cy);
        const parentDist = Math.hypot(x - cx, y - cy);
        if (dist > parentDist) score += 2.5;
        else score -= 0.5;
        score += settlementBiasScore(n.x, n.y, focus) * 0.5;

        if (nt.kind === 'grass' || nt.kind === 'empty') score += 2;
        else if (nt.kind === 'forest') score += 0.8;
        else score -= 1.5;

        score += rng() * 0.4;
        ends.push({ x: n.x, y: n.y, score });
      }
    }
  }

  if (ends.length === 0) return null;
  ends.sort((a, b) => b.score - a.score);
  const pool = ends.slice(0, Math.min(8, ends.length));
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

/** 終点用: 駅用地にスナップ（道路は拒否） */
function snapStationSite(
  tiles: Tile[],
  p: { x: number; y: number },
  width: number,
  height: number,
): { x: number; y: number } | null {
  if (canPlaceStationOn(tiles, p.x, p.y, width, height)) return p;
  // 近傍の空き地を探す（道路隣接を優先）
  const neigh = neighbors4(p.x, p.y, width, height);
  const scored = neigh
    .filter((n) => canPlaceStationOn(tiles, n.x, n.y, width, height))
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
): { placed: number; kinds: string[]; cost: number; intercity: boolean } | null {
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
        if (needStation && t.kind === 'rail') total += 5; // 線路→駅の昇格
        continue;
      }
      if (needStation) {
        const site =
          canPlaceStationOn(tiles, c.x, c.y, width, height)
            ? c
            : snapStationSite(tiles, c, width, height);
        if (!site) return null;
        const st = getTile(tiles, site.x, site.y, width, height)!;
        if (st.kind === 'station') continue;
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

  const placeCell = (x: number, y: number, asStation: boolean): number => {
    const t = getTile(tiles, x, y, width, height)!;
    if (t.kind === 'rail' || t.kind === 'station' || t.kind === 'crossing' || t.kind === 'bridge') {
      return 0;
    }
    if (asStation && !canPlaceStationOn(tiles, x, y, width, height)) return -1;
    const cellCost = railCellCost(t.kind, asStation, balance);
    if (!Number.isFinite(cellCost)) return -1;

    if (asStation) {
      setTile(tiles, x, y, width, makeTile('station', 1, pickInt(rng, 0, 2), CONSTRUCTION_FRAMES));
      return cellCost;
    }
    if (t.kind === 'road') {
      setTile(tiles, x, y, width, makeTile('crossing', 0, 0, ROAD_FRAMES));
      return cellCost;
    }
    if (!isPaveable(t.kind)) return -1;
    const kind = pavedKind(t.kind, 'rail');
    setTile(tiles, x, y, width, makeTile(kind, 0, 0, RAIL_FRAMES));
    return cellCost;
  };

  const ensureStationAt = (x: number, y: number): number => {
    const t = getTile(tiles, x, y, width, height);
    if (!t) return -1;
    if (t.kind === 'station') return 0;
    if (canPlaceStationOn(tiles, x, y, width, height)) {
      if (t.kind === 'rail') {
        setTile(tiles, x, y, width, makeTile('station', 1, pickInt(rng, 0, 2), CONSTRUCTION_FRAMES));
        return 5;
      }
      return placeCell(x, y, true);
    }
    const site = snapStationSite(tiles, { x, y }, width, height);
    if (!site) return -1;
    const st = getTile(tiles, site.x, site.y, width, height)!;
    if (st.kind === 'station') return 0;
    if (st.kind === 'rail') {
      setTile(tiles, site.x, site.y, width, makeTile('station', 1, pickInt(rng, 0, 2), CONSTRUCTION_FRAMES));
      return 5;
    }
    return placeCell(site.x, site.y, true);
  };

  /** 見積もり OK なら一括敷設。条件を満たせなければロールバックして何も置かない */
  const commitPath = (
    path: Array<{ x: number; y: number }>,
    stationMode: 'both' | 'goal',
    intercityFlag: boolean,
  ): { placed: number; kinds: string[]; cost: number; intercity: boolean } | null => {
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

      if (needStation) {
        if (t.kind === 'station') {
          kinds.push('station');
          continue;
        }
        const spent = ensureStationAt(c.x, c.y);
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
      const spent = placeCell(c.x, c.y, false);
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
    };
  };

  const tryConnect = (
    a: { x: number; y: number },
    b: { x: number; y: number },
    maxLen: number,
    stationMode: 'both' | 'goal',
    intercityFlag: boolean,
  ): { placed: number; kinds: string[]; cost: number; intercity: boolean } | null => {
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
    for (let y = cy - 8; y <= cy + 8; y++) {
      for (let x = cx - 10; x <= cx + 10; x++) {
        if (!canPlaceStationOn(tiles, x, y, width, height)) continue;
        const nearRoad = neighbors4(x, y, width, height).some((n) =>
          ROAD_LIKE.has(tiles[n.y * width + n.x]!.kind),
        );
        if (!nearRoad) continue;
        sites.push({ x, y });
      }
    }
    if (sites.length < 2) return null;
    for (let attempt = 0; attempt < 24; attempt++) {
      const a = sites[pickInt(rng, 0, sites.length - 1)]!;
      const b = sites[pickInt(rng, 0, sites.length - 1)]!;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 6 || d > 14) continue;
      const r = tryConnect(a, b, 40, 'both', false);
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
    if (dist >= 5 && dist <= 40) stationTargets.push(e);
  }

  const scanR = focus ? Math.ceil(focus.radius) + 16 : 22;
  const sy0 = Math.max(2, (focus?.cy ?? start.y) - scanR);
  const sy1 = Math.min(height - 3, (focus?.cy ?? start.y) + scanR);
  const sx0 = Math.max(2, (focus?.cx ?? start.x) - scanR);
  const sx1 = Math.min(width - 3, (focus?.cx ?? start.x) + scanR);
  for (let y = sy0; y <= sy1; y++) {
    for (let x = sx0; x <= sx1; x++) {
      if (!canPlaceStationOn(tiles, x, y, width, height)) continue;
      if (tiles[y * width + x]!.kind === 'station') continue;
      const nearRoad = neighbors4(x, y, width, height).some((n) =>
        ROAD_LIKE.has(tiles[n.y * width + n.x]!.kind),
      );
      if (!nearRoad) continue;
      const dist = Math.hypot(x - start.x, y - start.y);
      if (dist < 5 || dist > 24) continue;
      stationTargets.push({ x, y });
    }
  }

  stationTargets.sort(
    (a, b) =>
      Math.hypot(a.x - start.x, a.y - start.y) - Math.hypot(b.x - start.x, b.y - start.y),
  );

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
      // 駅は道路上に建てない
      if (!canPlaceStationOn(tiles, x, y, width, height)) continue;

      const onRail = t.kind === 'rail';
      const nearRail = neighbors4(x, y, width, height).some((n) => {
        const nt = tiles[n.y * width + n.x]!;
        return nt.kind === 'rail' || nt.kind === 'crossing' || nt.kind === 'station';
      });
      const nearRoad = adjacentToRoad(tiles, x, y, width, height);
      // レール上、またはレール隣接、または道路隣接の空き地
      if (!onRail && !nearRail && !nearRoad) continue;

      const score =
        (onRail ? 3 : nearRail ? 2 : 1) +
        (nearRoad ? 2 : 0) +
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
  setTile(tiles, x, y, width, makeTile(kind, tier, pickInt(rng, 0, 3), CONSTRUCTION_FRAMES));
  return true;
}

function needsToWeights(
  need: BuildNeed,
  stage: GrowthStage,
  roadBlocked: boolean,
  multiSettlement: boolean,
): Array<{ key: BuildAction; w: number }> {
  const intercityBoost = multiSettlement
    ? stage === 'town'
      ? 0.35
      : stage === 'city'
        ? 0.7
        : stage === 'metropolis'
          ? 0.9
          : 0
    : 0;
  const w: Array<{ key: BuildAction; w: number }> = [
    { key: 'residential', w: need.residential },
    { key: 'commercial', w: need.commercial },
    { key: 'industrial', w: need.industrial },
    { key: 'road', w: need.road + (roadBlocked ? 1.2 : 0) + (multiSettlement ? 0.25 : 0) },
    { key: 'rail', w: need.rail + intercityBoost },
    { key: 'school', w: need.school },
    { key: 'park', w: need.park },
    { key: 'hospital', w: need.hospital },
    { key: 'tower', w: need.tower },
    { key: 'station', w: need.station + intercityBoost * 0.4 },
    { key: 'plaza', w: stage === 'city' || stage === 'metropolis' ? 0.25 : 0.05 },
    { key: 'upgrade', w: stage === 'town' ? 0.4 : stage === 'city' ? 0.7 : stage === 'metropolis' ? 1.0 : 0.1 },
    { key: 'skyscraper', w: need.skyscraper },
    { key: 'demolish', w: roadBlocked ? 1.8 : 0.05 },
  ];
  return w;
}

export interface BuildResult {
  built: boolean;
  kind?: string;
  cost: number;
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
  const need = computeBuildNeeds(stats, stage, balance);
  const roadBlocked = isRoadGrowthBlocked(tiles, width, height);
  const focus = pickSettlement(settlements, tiles, width, height, rng);
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
        setTile(tiles, target.x, target.y, width, makeTile('road', 0, 0, ROAD_FRAMES));
        return { built: true, kind: 'demolish', cost: demolishCost };
      }
    }
    if (action === 'demolish') return { built: false, cost: 0 };
  }

  if (action === 'upgrade') {
    const maxTier = stage === 'metropolis' ? 5 : stage === 'city' ? 4 : 3;
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
    const cost = costs.upgradeBase * (t.tier + 1);
    if (!canAfford(stats.budget, cost, balance)) return { built: false, cost: 0 };
    t.tier += 1;
    t.construction = UPGRADE_FRAMES;
    return { built: true, kind: 'upgrade', cost };
  }

  const baseCost = (costs as Record<string, number>)[action] ?? costs.fallback;

  if (action === 'road') {
    const spot = findRoadExtension(tiles, width, height, rng, focus);
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
      setTile(tiles, target.x, target.y, width, makeTile('road', 0, 0, ROAD_FRAMES));
      return { built: true, kind: 'demolish', cost: demolishCost };
    }
    const under = getTile(tiles, spot.x, spot.y, width, height)!;
    const surcharge = terrainBuildSurcharge(under.kind, 'road', balance);
    const total = costs.road + (Number.isFinite(surcharge) ? surcharge : 0);
    if (!canAfford(stats.budget, total, balance)) return { built: false, cost: 0 };
    const kind = pavedKind(under.kind, 'road');
    setTile(tiles, spot.x, spot.y, width, makeTile(kind, 0, 0, ROAD_FRAMES));
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
    return { built: true, kind: label, cost: corridor.cost };
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
      return { built: true, kind: 'station', cost: corridor.cost };
    }
    // 駅は道路上に建てない（findStationSpot が保証）
    const t = getTile(tiles, spot.x, spot.y, width, height)!;
    if (!canPlaceStationOn(tiles, spot.x, spot.y, width, height)) {
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
      makeTile('station', 1, pickInt(rng, 0, 2), CONSTRUCTION_FRAMES),
    );
    return { built: true, kind: 'station', cost: total };
  }

  const spot = findBuildableNearRoad(tiles, width, height, rng, focus);
  if (!spot) {
    const roadSpot = findRoadExtension(tiles, width, height, rng, focus);
    if (roadSpot) {
      const under = getTile(tiles, roadSpot.x, roadSpot.y, width, height)!;
      const surcharge = terrainBuildSurcharge(under.kind, 'road', balance);
      const total = costs.road + (Number.isFinite(surcharge) ? surcharge : 0);
      if (canAfford(stats.budget, total, balance)) {
        const kind = pavedKind(under.kind, 'road');
        setTile(tiles, roadSpot.x, roadSpot.y, width, makeTile(kind, 0, 0, ROAD_FRAMES));
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
      setTile(tiles, target.x, target.y, width, makeTile('road', 0, 0, ROAD_FRAMES));
      return { built: true, kind: 'demolish', cost: demolishCost };
    }
    return { built: false, cost: 0 };
  }

  const kind = action as TileKind;
  const tier = action === 'skyscraper' || action === 'tower' ? 2 : 1;
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

/** 建設アニメ進行 (ゆっくり減る) */
export function tickConstruction(tiles: Tile[]): void {
  for (const t of tiles) {
    if (t.construction > 0) {
      t.construction = Math.max(0, t.construction - 1 / 3);
    }
  }
}
