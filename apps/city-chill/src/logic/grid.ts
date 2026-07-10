import type { Tile, TileKind } from '../types';

export function idx(x: number, y: number, width: number): number {
  return y * width + x;
}

export function inBounds(x: number, y: number, width: number, height: number): boolean {
  return x >= 0 && y >= 0 && x < width && y < height;
}

export function getTile(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
): Tile | null {
  if (!inBounds(x, y, width, height)) return null;
  return tiles[idx(x, y, width)];
}

export function setTile(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  tile: Tile,
): void {
  tiles[idx(x, y, width)] = tile;
}

export function makeTile(
  kind: TileKind,
  tier = 0,
  variant = 0,
  construction = 0,
): Tile {
  return { kind, tier, variant, construction };
}

export const BUILDING_KINDS: ReadonlySet<TileKind> = new Set([
  'residential',
  'commercial',
  'industrial',
  'park',
  'school',
  'hospital',
  'station',
  'plaza',
  'tower',
  'skyscraper',
]);

export const ROAD_LIKE: ReadonlySet<TileKind> = new Set([
  'road',
  'station',
  'crossing',
  'bridge',
]);

export const RAIL_LIKE: ReadonlySet<TileKind> = new Set([
  'rail',
  'station',
  'crossing',
  'bridge',
]);

/** 建物を建てられる（森は伐採して開発可） */
export function isBuildable(kind: TileKind): boolean {
  return kind === 'grass' || kind === 'empty' || kind === 'forest';
}

/** 道路/線路を敷ける（水は橋になる） */
export function isPaveable(kind: TileKind): boolean {
  return isBuildable(kind) || kind === 'water' || kind === 'bridge';
}

export function isOccupied(kind: TileKind): boolean {
  return (
    BUILDING_KINDS.has(kind) ||
    kind === 'road' ||
    kind === 'rail' ||
    kind === 'crossing' ||
    kind === 'bridge' ||
    kind === 'water' ||
    kind === 'forest'
  );
}

const NEIGHBORS4: Array<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export function neighbors4(
  x: number,
  y: number,
  width: number,
  height: number,
): Array<{ x: number; y: number }> {
  const out: Array<{ x: number; y: number }> = [];
  for (const [dx, dy] of NEIGHBORS4) {
    const nx = x + dx;
    const ny = y + dy;
    if (inBounds(nx, ny, width, height)) out.push({ x: nx, y: ny });
  }
  return out;
}

/** 道路に隣接しているか */
export function adjacentToRoad(
  tiles: Tile[],
  x: number,
  y: number,
  width: number,
  height: number,
): boolean {
  return neighbors4(x, y, width, height).some((n) => {
    const t = tiles[idx(n.x, n.y, width)];
    return ROAD_LIKE.has(t.kind);
  });
}

/** 指定 kind のタイル数を数える */
export function countKind(tiles: Tile[], kind: TileKind): number {
  let n = 0;
  for (const t of tiles) {
    if (t.kind === kind) n += 1;
  }
  return n;
}

export function countKinds(tiles: Tile[], kinds: ReadonlySet<TileKind>): number {
  let n = 0;
  for (const t of tiles) {
    if (kinds.has(t.kind)) n += 1;
  }
  return n;
}
