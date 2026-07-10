import type { Tile, TileKind } from '../types';
import {
  getTile,
  inBounds,
  isBuildable,
  isPaveable,
  neighbors4,
  ROAD_LIKE,
} from './grid';

/**
 * 道路延伸のために取り壊してよいのは建物だけ。
 * 線路・踏切・駅・道路・水などは絶対に対象外。
 */
const DEMOLISH_BASE: Partial<Record<TileKind, number>> = {
  park: 20,
  plaza: 16,
  residential: 5,
  commercial: 4,
  industrial: 2,
};

const DEMOLISHABLE_KINDS: ReadonlySet<TileKind> = new Set(
  Object.keys(DEMOLISH_BASE) as TileKind[],
);

export function isDemolishable(tile: Tile): boolean {
  // ホワイトリスト: 建物以外（rail / crossing / station 含む）は壊さない
  if (!DEMOLISHABLE_KINDS.has(tile.kind)) return false;
  if (tile.construction > 0) return false;
  const base = DEMOLISH_BASE[tile.kind];
  if (base == null) return false;
  // 高層は残す
  if (tile.kind === 'residential' && tile.tier >= 3) return false;
  if (tile.kind === 'commercial' && tile.tier >= 3) return false;
  if (tile.kind === 'industrial' && tile.tier >= 2) return false;
  return true;
}

export function roadNeighborCount(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
): number {
  return neighbors4(x, y, width, height).filter((n) => {
    const t = tiles[n.y * width + n.x]!;
    return ROAD_LIKE.has(t.kind);
  }).length;
}

/** 道路を伸ばせる隣接マス数（草地・森・水） */
function paveableNeighborCount(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
): number {
  return neighbors4(x, y, width, height).filter((n) => {
    const t = tiles[n.y * width + n.x]!;
    return isPaveable(t.kind);
  }).length;
}

/**
 * (x,y) に道路を置くと 2×2 の道路ブロックができるか。
 * 固まった配置を防ぐためのハード制約。
 */
export function wouldFormRoadBlock2x2(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
): boolean {
  const isRoad = (px: number, py: number): boolean => {
    if (px === x && py === y) return true;
    if (!inBounds(px, py, width, height)) return false;
    return ROAD_LIKE.has(tiles[py * width + px]!.kind);
  };

  const corners: Array<[number, number]> = [
    [x, y],
    [x - 1, y],
    [x, y - 1],
    [x - 1, y - 1],
  ];
  for (const [ox, oy] of corners) {
    if (
      isRoad(ox, oy) &&
      isRoad(ox + 1, oy) &&
      isRoad(ox, oy + 1) &&
      isRoad(ox + 1, oy + 1)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * この空き地が、隣接する道路タイルにとって「最後の逃げ道」か。
 * true なら建物を建てず、道路延伸用に残す。
 */
export function isLastEscapeTile(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
): boolean {
  if (!inBounds(x, y, width, height)) return false;
  const t = getTile(tiles, x, y, width, height);
  if (!t || !isPaveable(t.kind)) return false;
  // 2×2 になる逃げ道は「逃げ」にならない
  if (wouldFormRoadBlock2x2(tiles, x, y, width, height)) return false;

  for (const n of neighbors4(x, y, width, height)) {
    const nt = tiles[n.y * width + n.x]!;
    if (!ROAD_LIKE.has(nt.kind)) continue;
    if (paveableNeighborCount(tiles, n.x, n.y, width, height) <= 1) {
      return true;
    }
  }
  return false;
}

export interface DemolishCandidate {
  x: number;
  y: number;
  score: number;
  kind: TileKind;
}

/**
 * 道路延伸のために壊すべき建物を探す。
 * - 行き止まり先端（roadLinks===1、舗装可能隣接ゼロ）のみ
 * - 2×2 固まりになる候補は除外
 * - 外側の先端から外へ直線延伸を優先
 * - 公園・低層を優先、住宅逼迫時は住宅を避ける
 */
export function findDemolitionForRoad(
  tiles: Tile[],
  width: number,
  height: number,
  population: number,
  housing: number,
): DemolishCandidate | null {
  const cx = width / 2;
  const cy = height / 2;
  const housingTight = housing < population * 1.05;
  const candidates: DemolishCandidate[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = tiles[y * width + x]!;
      if (!ROAD_LIKE.has(t.kind)) continue;
      // まだ伸ばせるなら壊さない
      if (paveableNeighborCount(tiles, x, y, width, height) > 0) continue;
      const roadLinks = roadNeighborCount(tiles, x, y, width, height);
      // 真の先端のみ（直線の途中や交差点は壊して横に埋めない）
      if (roadLinks !== 1) continue;

      const tipDist = Math.hypot(x - cx, y - cy);

      for (const n of neighbors4(x, y, width, height)) {
        const nt = tiles[n.y * width + n.x]!;
        if (!isDemolishable(nt)) continue;
        if (wouldFormRoadBlock2x2(tiles, n.x, n.y, width, height)) continue;

        // 新マスの道路隣接は親の1つだけ（スパース）
        const futureLinks = roadNeighborCount(tiles, n.x, n.y, width, height);
        if (futureLinks !== 1) continue;

        let score = DEMOLISH_BASE[nt.kind] ?? 1;
        score -= nt.tier * 2;

        // 外側の先端を優先（内側へ掘り返さない）
        score += tipDist * 2;

        // 外向き延伸
        const dist = Math.hypot(n.x - cx, n.y - cy);
        if (dist > tipDist + 0.1) score += 8;
        else if (dist < tipDist - 0.1) score -= 10;
        else score -= 2;

        // 直線延伸: 親の反対側に道路がある
        const dx = n.x - x;
        const dy = n.y - y;
        const back = getTile(tiles, x - dx, y - dy, width, height);
        if (back && ROAD_LIKE.has(back.kind)) score += 6;
        else score += 1; // 分岐は弱く許可

        const beyond = neighbors4(n.x, n.y, width, height).filter(
          (b) => b.x !== x || b.y !== y,
        );
        const opensSpace = beyond.some((b) => {
          const bt = tiles[b.y * width + b.x]!;
          return isPaveable(bt.kind) || isDemolishable(bt);
        });
        if (opensSpace) score += 4;
        if (housingTight && (nt.kind === 'residential' || nt.kind === 'commercial')) {
          score -= 8;
        }

        if (score > 0) {
          candidates.push({ x: n.x, y: n.y, score, kind: nt.kind });
        }
      }
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]!;
}

/** 舗装可能な空きがなく道路延伸が詰まっているか */
export function isRoadGrowthBlocked(
  tiles: Tile[],
  width: number,
  height: number,
): boolean {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = tiles[y * width + x]!;
      if (!ROAD_LIKE.has(t.kind)) continue;
      for (const n of neighbors4(x, y, width, height)) {
        const nt = tiles[n.y * width + n.x]!;
        if (!isPaveable(nt.kind)) continue;
        if (!wouldFormRoadBlock2x2(tiles, n.x, n.y, width, height)) {
          return false;
        }
      }
    }
  }
  let hasRoad = false;
  for (const t of tiles) {
    if (ROAD_LIKE.has(t.kind)) {
      hasRoad = true;
      break;
    }
  }
  return hasRoad;
}

/**
 * 建物用: 草地/森の逃げ道（水は建物不可なので isBuildable）
 */
export function isLastEscapeForBuilding(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
): boolean {
  if (!inBounds(x, y, width, height)) return false;
  const t = getTile(tiles, x, y, width, height);
  if (!t || !isBuildable(t.kind)) return false;
  if (wouldFormRoadBlock2x2(tiles, x, y, width, height)) return false;

  for (const n of neighbors4(x, y, width, height)) {
    const nt = tiles[n.y * width + n.x]!;
    if (!ROAD_LIKE.has(nt.kind)) continue;
    const escapes = neighbors4(n.x, n.y, width, height).filter((b) => {
      const bt = tiles[b.y * width + b.x]!;
      return (
        isPaveable(bt.kind) &&
        !wouldFormRoadBlock2x2(tiles, b.x, b.y, width, height)
      );
    }).length;
    if (escapes <= 1) return true;
  }
  return false;
}
