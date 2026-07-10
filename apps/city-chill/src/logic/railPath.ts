import type { Tile, TileKind } from '../types';
import { getTile, inBounds, isBuildable, neighbors4 } from './grid';

export interface GridPos {
  x: number;
  y: number;
}

/** 線路を通してよいタイルか（既存レール・橋・水含む） */
export function isRailPassable(kind: TileKind): boolean {
  return (
    isBuildable(kind) ||
    kind === 'road' ||
    kind === 'rail' ||
    kind === 'station' ||
    kind === 'crossing' ||
    kind === 'bridge' ||
    kind === 'water'
  );
}

/**
 * 新規に線路を置くコスト。
 * 道路は踏切になるので高くし、草地・既存レールを優先する。
 */
function stepCost(kind: TileKind): number {
  if (kind === 'rail' || kind === 'station') return 0.3;
  if (kind === 'crossing') return 0.45;
  if (kind === 'bridge') return 0.5;
  if (kind === 'grass' || kind === 'empty') return 1;
  if (kind === 'forest') return 1.8;
  if (kind === 'road') return 8; // 踏切は最終手段
  if (kind === 'water') return 12;
  return 99;
}

/**
 * A* で start→goal の線路経路を探す。
 * 水・建物は通れない。直進をわずかに優遇してジグザグを抑える。
 */
export function findRailPath(
  tiles: Tile[],
  width: number,
  height: number,
  start: GridPos,
  goal: GridPos,
  maxLen = 48,
): GridPos[] | null {
  if (!inBounds(start.x, start.y, width, height)) return null;
  if (!inBounds(goal.x, goal.y, width, height)) return null;

  const startT = getTile(tiles, start.x, start.y, width, height);
  const goalT = getTile(tiles, goal.x, goal.y, width, height);
  if (!startT || !goalT) return null;
  if (!isRailPassable(startT.kind) && !(startT.kind === 'rail' || startT.kind === 'station' || startT.kind === 'crossing')) {
    // 開始が既存レール端なら OK。新規敷設の始点は passable 必須
    if (!isRailPassable(startT.kind)) return null;
  }
  if (!isRailPassable(goalT.kind)) return null;

  const key = (x: number, y: number) => y * width + x;
  const heuristic = (x: number, y: number) => Math.abs(x - goal.x) + Math.abs(y - goal.y);

  type Node = { x: number; y: number; g: number; f: number; px: number; py: number; dx: number; dy: number };
  const open: Node[] = [];
  const came = new Map<number, { x: number; y: number }>();
  const gScore = new Map<number, number>();

  const sk = key(start.x, start.y);
  gScore.set(sk, 0);
  open.push({
    x: start.x,
    y: start.y,
    g: 0,
    f: heuristic(start.x, start.y),
    px: start.x,
    py: start.y,
    dx: 0,
    dy: 0,
  });

  let guard = 0;
  while (open.length > 0 && guard++ < width * height * 4) {
    // 線形探索で最小 f（毎ループ sort は O(n² log n) になる）
    let best = 0;
    for (let i = 1; i < open.length; i++) {
      if (open[i]!.f < open[best]!.f) best = i;
    }
    const cur = open.splice(best, 1)[0]!;

    if (cur.x === goal.x && cur.y === goal.y) {
      // 復元
      const path: GridPos[] = [{ x: cur.x, y: cur.y }];
      let cx = cur.x;
      let cy = cur.y;
      while (cx !== start.x || cy !== start.y) {
        const prev = came.get(key(cx, cy));
        if (!prev) break;
        cx = prev.x;
        cy = prev.y;
        path.push({ x: cx, y: cy });
      }
      path.reverse();
      if (path.length > maxLen) return null;
      return path;
    }

    for (const n of neighbors4(cur.x, cur.y, width, height)) {
      const t = getTile(tiles, n.x, n.y, width, height);
      if (!t || !isRailPassable(t.kind)) continue;

      const ndx = n.x - cur.x;
      const ndy = n.y - cur.y;
      let cost = stepCost(t.kind);
      // 直進ボーナス / 曲がりペナルティ
      if (cur.dx !== 0 || cur.dy !== 0) {
        if (ndx === cur.dx && ndy === cur.dy) cost *= 0.85;
        else cost *= 1.25;
      }
      // マップ端は避ける
      if (n.x <= 0 || n.y <= 0 || n.x >= width - 1 || n.y >= height - 1) cost += 2;

      const tentative = cur.g + cost;
      const nk = key(n.x, n.y);
      if (tentative >= (gScore.get(nk) ?? Infinity)) continue;

      gScore.set(nk, tentative);
      came.set(nk, { x: cur.x, y: cur.y });
      open.push({
        x: n.x,
        y: n.y,
        g: tentative,
        f: tentative + heuristic(n.x, n.y),
        px: cur.x,
        py: cur.y,
        dx: ndx,
        dy: ndy,
      });
    }
  }

  return null;
}

/**
 * 直線が塞がれているかざっくり判定（テスト・デバッグ用）
 */
export function straightBlocked(
  tiles: Tile[],
  width: number,
  height: number,
  a: GridPos,
  b: GridPos,
): boolean {
  let x = a.x;
  let y = a.y;
  while (x !== b.x || y !== b.y) {
    if (x !== b.x) x += x < b.x ? 1 : -1;
    else if (y !== b.y) y += y < b.y ? 1 : -1;
    const t = getTile(tiles, x, y, width, height);
    if (!t || !isRailPassable(t.kind)) return true;
  }
  return false;
}
