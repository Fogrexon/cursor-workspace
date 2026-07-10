import type { Tile, TileFacing, TileKind } from '../types';
import { getTile } from './grid';

export interface LinkMask {
  e: boolean;
  w: boolean;
  n: boolean;
  s: boolean;
}

export type JunctionKind = 'none' | 'end' | 'straight' | 'L' | 'T' | 'cross';

export function linkMask(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
  pred: (kind: TileKind) => boolean,
): LinkMask {
  const check = (dx: number, dy: number) => {
    const t = getTile(tiles, x + dx, y + dy, width, height);
    return !!t && pred(t.kind);
  };
  return {
    e: check(1, 0),
    w: check(-1, 0),
    s: check(0, 1),
    n: check(0, -1),
  };
}

export function facingOpens(facing: TileFacing, dir: keyof LinkMask): boolean {
  if (facing === 'none' || facing === 'both') return true;
  if (facing === 'x') return dir === 'e' || dir === 'w';
  return dir === 'n' || dir === 's';
}

export function mergeFacing(a: TileFacing, b: TileFacing): TileFacing {
  if (a === 'none') return b;
  if (b === 'none') return a;
  if (a === b) return a;
  return 'both';
}

/** 隣接2点の軸（斜めは both） */
export function axisBetween(
  a: { x: number; y: number },
  b: { x: number; y: number },
): TileFacing {
  if (a.y === b.y && a.x !== b.x) return 'x';
  if (a.x === b.x && a.y !== b.y) return 'z';
  return 'both';
}

/** 経路上のセル向き（前後の接続から） */
export function facingFromPath(
  prev: { x: number; y: number } | null,
  cur: { x: number; y: number },
  next: { x: number; y: number } | null,
): TileFacing {
  let f: TileFacing = 'none';
  if (prev) f = mergeFacing(f, axisBetween(prev, cur));
  if (next) f = mergeFacing(f, axisBetween(cur, next));
  return f === 'none' ? 'x' : f;
}

/**
 * 向きを考慮した接続マスク。
 * 並走する東西線路同士は南北では繋がらない（双方が x 向きのため）。
 */
export function orientedLinkMask(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
  pred: (kind: TileKind) => boolean,
): LinkMask {
  const self = getTile(tiles, x, y, width, height);
  if (!self) return { e: false, w: false, n: false, s: false };

  const check = (dx: number, dy: number, dir: keyof LinkMask, rev: keyof LinkMask) => {
    const t = getTile(tiles, x + dx, y + dy, width, height);
    if (!t || !pred(t.kind)) return false;
    // 両方未設定なら従来どおり（テスト用の簡易配置）
    if (self.facing === 'none' && t.facing === 'none') return true;
    return facingOpens(self.facing, dir) && facingOpens(t.facing, rev);
  };

  return {
    e: check(1, 0, 'e', 'w'),
    w: check(-1, 0, 'w', 'e'),
    s: check(0, 1, 's', 'n'),
    n: check(0, -1, 'n', 's'),
  };
}

export function linkCount(m: LinkMask): number {
  return (m.e ? 1 : 0) + (m.w ? 1 : 0) + (m.n ? 1 : 0) + (m.s ? 1 : 0);
}

/** 接続マスクから交差形状を判定 */
export function junctionKind(m: LinkMask): JunctionKind {
  const n = linkCount(m);
  if (n === 0) return 'none';
  if (n === 1) return 'end';
  if (n === 2) {
    if ((m.e && m.w) || (m.n && m.s)) return 'straight';
    return 'L';
  }
  if (n === 3) return 'T';
  return 'cross';
}

/** 東西が主軸なら 'x'、南北なら 'z'、両方なら 'both' */
export function primaryAxis(m: LinkMask): 'x' | 'z' | 'both' | 'none' {
  const horiz = m.e || m.w;
  const vert = m.n || m.s;
  if (horiz && vert) return 'both';
  if (horiz) return 'x';
  if (vert) return 'z';
  return 'none';
}

export function isRoadSurface(kind: TileKind): boolean {
  return kind === 'road' || kind === 'station' || kind === 'crossing' || kind === 'bridge';
}

export function isRailSurface(kind: TileKind): boolean {
  return kind === 'rail' || kind === 'station' || kind === 'crossing' || kind === 'bridge';
}

/** タイルに向きを合成して書き戻す */
export function applyFacing(tile: Tile, facing: TileFacing): void {
  tile.facing = mergeFacing(tile.facing, facing);
}
