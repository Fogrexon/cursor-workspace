import type { Tile, TileKind } from '../types';
import { getTile } from './grid';

export interface LinkMask {
  e: boolean;
  w: boolean;
  n: boolean;
  s: boolean;
}

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

export function linkCount(m: LinkMask): number {
  return (m.e ? 1 : 0) + (m.w ? 1 : 0) + (m.n ? 1 : 0) + (m.s ? 1 : 0);
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
