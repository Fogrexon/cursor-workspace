import type { Tile, TileKind } from '../types';
import { getTile, inBounds, neighbors4 } from './grid';

export interface GridPos {
  x: number;
  y: number;
}

/**
 * 許可タイル集合上の A*。直進をわずかに優遇。
 */
export function findNetworkPath(
  tiles: Tile[],
  width: number,
  height: number,
  start: GridPos,
  goal: GridPos,
  allowed: ReadonlySet<TileKind>,
  maxLen = 64,
): GridPos[] | null {
  if (!inBounds(start.x, start.y, width, height)) return null;
  if (!inBounds(goal.x, goal.y, width, height)) return null;
  const st = getTile(tiles, start.x, start.y, width, height);
  const gt = getTile(tiles, goal.x, goal.y, width, height);
  if (!st || !gt || !allowed.has(st.kind) || !allowed.has(gt.kind)) return null;
  if (start.x === goal.x && start.y === goal.y) return [{ ...start }];

  const key = (x: number, y: number) => y * width + x;
  const heuristic = (x: number, y: number) => Math.abs(x - goal.x) + Math.abs(y - goal.y);

  type Node = {
    x: number;
    y: number;
    g: number;
    f: number;
    dx: number;
    dy: number;
  };
  const open: Node[] = [];
  const came = new Map<number, GridPos>();
  const gScore = new Map<number, number>();

  const sk = key(start.x, start.y);
  gScore.set(sk, 0);
  open.push({
    x: start.x,
    y: start.y,
    g: 0,
    f: heuristic(start.x, start.y),
    dx: 0,
    dy: 0,
  });

  let guard = 0;
  while (open.length > 0 && guard++ < width * height * 4) {
    // 線形探索で最小 f（マップが小さいので十分）
    let best = 0;
    for (let i = 1; i < open.length; i++) {
      if (open[i]!.f < open[best]!.f) best = i;
    }
    const cur = open.splice(best, 1)[0]!;

    if (cur.x === goal.x && cur.y === goal.y) {
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
      if (!t || !allowed.has(t.kind)) continue;

      const ndx = n.x - cur.x;
      const ndy = n.y - cur.y;
      let cost = 1;
      if (cur.dx !== 0 || cur.dy !== 0) {
        if (ndx === cur.dx && ndy === cur.dy) cost = 0.85;
        else cost = 1.2;
      }

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
        dx: ndx,
        dy: ndy,
      });
    }
  }

  return null;
}
