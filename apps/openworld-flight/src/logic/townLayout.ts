import type { TownPlacement } from '../types';
import { TILE, WORLD_SCALE } from './flight';

/** Tile → world meters (already includes WORLD_SCALE). */
function t(tx: number, tz: number, y = 0): { x: number; y: number; z: number } {
  return {
    x: tx * TILE * WORLD_SCALE,
    y: y * WORLD_SCALE,
    z: tz * TILE * WORLD_SCALE,
  };
}

function place(
  asset: string,
  tx: number,
  tz: number,
  y = 0,
  rotY = 0,
  scale = 1,
): TownPlacement {
  return {
    asset,
    ...t(tx, tz, y),
    rotY,
    scale: scale * WORLD_SCALE,
  };
}

type ClusterBuilding = {
  asset: string;
  ox: number;
  oz: number;
  rotY?: number;
  scale?: number;
};

/** Pack a dense block of buildings around a cluster center. */
function addCluster(
  out: TownPlacement[],
  cx: number,
  cz: number,
  buildings: ClusterBuilding[],
  gz: number,
): void {
  for (const b of buildings) {
    out.push(place(b.asset, cx + b.ox, cz + b.oz, gz, b.rotY ?? 0, b.scale ?? 1));
  }
}

const DENSE_CORE: ClusterBuilding[] = [
  { asset: 'BLD-cottage-01', ox: -1.5, oz: 1.5, rotY: 180 },
  { asset: 'BLD-cottage-02', ox: 1.55, oz: 1.5, rotY: 180 },
  { asset: 'BLD-shop-01', ox: -1.55, oz: -1.5, rotY: 0 },
  { asset: 'BLD-inn-01', ox: 1.7, oz: -1.6, rotY: 0 },
  { asset: 'BLD-hut-01', ox: -2.4, oz: 1.3, rotY: 200 },
  { asset: 'BLD-hut-02', ox: 2.45, oz: 1.35, rotY: 160 },
  { asset: 'BLD-shed-01', ox: 2.7, oz: -0.7, rotY: 90 },
];

/**
 * Large town made of several dense neighborhoods (not sparse mega-spacing).
 * Overall footprint is wide; local building gaps stay kit-scale (~1.5–2.5 tiles).
 */
export function buildTownLayout(): TownPlacement[] {
  const gz = 0.05;
  const p: TownPlacement[] = [];

  // --- Central plaza (dense) ---
  addCluster(p, 0, 0, DENSE_CORE, gz);
  p.push(
    place('BLD-tower-01', -2.7, 2.7, gz, 20),
    place('BLD-watch-01', 2.85, 2.8, gz, -15),
    place('PROP-well-01', 0.35, 0.35, gz),
    place('PROP-lamp-00', -0.35, 0.35, gz),
    place('PROP-lamp-01', 0.35, -0.35, gz),
    place('PROP-bench-01', 0.7, 0.15, gz, 90),
    place('PROP-cart-01', 1.55, -0.2, gz, -20),
    place('PROP-sign-01', 0.15, -1.5, gz),
    place('PROP-barrel-00', -1.65, -0.5, gz),
    place('PROP-barrel-01', -1.85, -0.7, gz),
    place('PROP-crate-00', 1.65, -0.7, gz, 25),
    place('PROP-crate-01', 1.9, -0.55, gz),
  );

  // --- Dense ring around plaza (fills "empty" ring without huge gaps) ---
  addCluster(p, -4.5, 0.2, [
    { asset: 'BLD-cottage-01', ox: -1.2, oz: 1.2, rotY: 90 },
    { asset: 'BLD-hut-02', ox: -1.4, oz: -1.1, rotY: 100 },
    { asset: 'BLD-shed-01', ox: 0.3, oz: 1.4, rotY: 180 },
    { asset: 'BLD-shop-01', ox: 0.4, oz: -1.3, rotY: 90 },
  ], gz);
  addCluster(p, 4.6, -0.1, [
    { asset: 'BLD-cottage-02', ox: 1.2, oz: 1.1, rotY: 270 },
    { asset: 'BLD-inn-01', ox: 1.4, oz: -1.2, rotY: 270 },
    { asset: 'BLD-hut-01', ox: -0.2, oz: 1.35, rotY: 200 },
    { asset: 'BLD-shed-01', ox: -0.3, oz: -1.25, rotY: 0 },
  ], gz);
  addCluster(p, 0.1, 4.5, [
    { asset: 'BLD-cottage-01', ox: -1.3, oz: 1.1, rotY: 180 },
    { asset: 'BLD-cottage-02', ox: 1.3, oz: 1.15, rotY: 180 },
    { asset: 'BLD-hut-02', ox: -1.4, oz: -0.4, rotY: 160 },
    { asset: 'BLD-watch-01', ox: 1.5, oz: -0.3, rotY: -10 },
  ], gz);
  addCluster(p, 0, -4.6, [
    { asset: 'BLD-inn-01', ox: -1.4, oz: -1.1, rotY: 0 },
    { asset: 'BLD-shop-01', ox: 1.45, oz: -1.15, rotY: 10 },
    { asset: 'BLD-hut-01', ox: -1.5, oz: 0.35, rotY: 20 },
    { asset: 'BLD-hut-02', ox: 1.5, oz: 0.4, rotY: -15 },
  ], gz);

  // --- South gate neighborhood (dense block) ---
  p.push(
    place('ARCH-wall-01', -0.9, -7.2, gz, 0),
    place('ARCH-wall-door-01', 0, -7.2, gz, 0),
    place('ARCH-wall-01', 0.9, -7.2, gz, 0),
    place('ARCH-pillar-00', -1.5, -7.2, gz),
    place('ARCH-pillar-00', 1.5, -7.2, gz),
  );
  addCluster(p, 0, -9.2, [
    { asset: 'BLD-inn-01', ox: -1.6, oz: -0.2, rotY: 0 },
    { asset: 'BLD-shop-01', ox: 1.65, oz: -0.3, rotY: 10 },
    { asset: 'BLD-cottage-01', ox: -1.7, oz: -2.0, rotY: 0 },
    { asset: 'BLD-cottage-02', ox: 1.75, oz: -2.1, rotY: 5 },
    { asset: 'BLD-hut-02', ox: 0.1, oz: -3.2, rotY: 180 },
    { asset: 'BLD-shed-01', ox: 3.0, oz: -1.5, rotY: 90 },
    { asset: 'BLD-hut-01', ox: -3.0, oz: -1.4, rotY: 270 },
  ], gz);
  p.push(
    place('PROP-lamp-00', -0.4, -7.8, gz),
    place('PROP-lamp-01', 0.45, -7.9, gz),
    place('PROP-cart-01', 1.6, -9.5, gz, 35),
    place('PROP-barrel-00', -1.8, -9.0, gz),
    place('PROP-crate-00', 2.0, -9.2, gz, 20),
  );

  // --- North neighborhood ---
  p.push(
    place('ARCH-wall-01', -0.9, 7.4, gz, 180),
    place('ARCH-wall-door-01', 0, 7.4, gz, 180),
    place('ARCH-wall-01', 0.9, 7.4, gz, 180),
  );
  addCluster(p, 0, 9.5, [
    { asset: 'BLD-watch-01', ox: 0.1, oz: 1.6, rotY: 0 },
    { asset: 'BLD-cottage-01', ox: -1.7, oz: 0.2, rotY: 180 },
    { asset: 'BLD-cottage-02', ox: 1.75, oz: 0.25, rotY: 180 },
    { asset: 'BLD-hut-01', ox: -2.6, oz: 1.4, rotY: 40 },
    { asset: 'BLD-hut-02', ox: 2.7, oz: 1.35, rotY: -35 },
    { asset: 'BLD-shed-01', ox: -1.5, oz: 2.5, rotY: 180 },
    { asset: 'BLD-shop-01', ox: 1.6, oz: 2.55, rotY: 180 },
  ], gz);
  p.push(place('PROP-lamp-00', -0.5, 8.0, gz), place('PROP-sign-01', 0.3, 8.3, gz, 180));

  // --- West riverside neighborhood (dense) ---
  p.push(
    place('PROP-bridge-01', -6.5, 0, 0, 90),
    place('PROP-bridge-01', -6.5, 2.8, 0, 90, 0.95),
    place('PROP-bridge-01', -6.5, -2.8, 0, 90, 0.9),
  );
  addCluster(p, -9.5, 0, [
    { asset: 'BLD-cottage-01', ox: -1.4, oz: 1.4, rotY: 90 },
    { asset: 'BLD-cottage-02', ox: -1.5, oz: -1.35, rotY: 90 },
    { asset: 'BLD-hut-02', ox: -2.8, oz: 0.2, rotY: 110 },
    { asset: 'BLD-shed-01', ox: -0.2, oz: 2.5, rotY: 180 },
    { asset: 'BLD-shop-01', ox: -0.3, oz: -2.4, rotY: 0 },
    { asset: 'BLD-tower-01', ox: -3.5, oz: 2.6, rotY: 30 },
    { asset: 'BLD-inn-01', ox: -3.4, oz: -2.5, rotY: 100 },
  ], gz);
  p.push(
    place('PROP-well-01', -9.2, 0.2, gz),
    place('PROP-fence-00', -8.2, 1.6, gz, 90),
    place('PROP-fence-01', -8.2, 2.2, gz, 90),
    place('PROP-fence-00', -8.2, 2.8, gz, 90),
    place('ROCK-00', -7.3, -1.5, 0, 0, 0.85),
    place('ROCK-03', -7.1, 1.8, 0, 0, 0.7),
    place('STONE-00', -5.8, -0.9, 0),
    place('STONE-04', -5.7, 1.1, 0),
  );

  // --- East farm neighborhood (dense) ---
  addCluster(p, 9.8, 1.2, [
    { asset: 'BLD-barn-01', ox: 1.8, oz: 1.5, rotY: 180 },
    { asset: 'BLD-shed-01', ox: 0.2, oz: -1.6, rotY: -20 },
    { asset: 'BLD-cottage-02', ox: 2.6, oz: -0.8, rotY: 200 },
    { asset: 'BLD-hut-01', ox: 3.4, oz: 1.0, rotY: 160 },
    { asset: 'BLD-cottage-01', ox: 0.3, oz: 2.4, rotY: 180 },
    { asset: 'BLD-hut-02', ox: 3.5, oz: -2.2, rotY: 40 },
    { asset: 'BLD-shed-01', ox: 1.5, oz: -2.8, rotY: 90 },
  ], gz);
  p.push(
    place('PROP-fence-00', 8.5, 3.0, gz),
    place('PROP-fence-01', 9.2, 3.0, gz),
    place('PROP-fence-00', 9.9, 3.0, gz),
    place('PROP-fence-01', 10.6, 3.0, gz),
    place('PROP-fence-00', 11.3, 3.0, gz),
    place('PROP-cart-01', 10.2, 0.6, gz, 40),
    place('PROP-crate-00', 10.8, 1.1, gz, 15),
    place('PROP-barrel-00', 10.4, 1.5, gz),
    place('PROP-barrel-01', 11.0, 1.7, gz),
  );

  // --- Mid-east market strip (fills gap between plaza ring and farm) ---
  addCluster(p, 6.8, -3.5, [
    { asset: 'BLD-shop-01', ox: -1.2, oz: 0.8, rotY: 270 },
    { asset: 'BLD-inn-01', ox: 1.1, oz: 0.9, rotY: 270 },
    { asset: 'BLD-hut-01', ox: -1.3, oz: -1.0, rotY: 0 },
    { asset: 'BLD-hut-02', ox: 1.2, oz: -1.05, rotY: 10 },
    { asset: 'BLD-shed-01', ox: 0, oz: -2.1, rotY: 0 },
  ], gz);
  p.push(
    place('PROP-crate-01', 6.5, -3.0, gz),
    place('PROP-barrel-00', 7.2, -3.2, gz),
    place('PROP-cart-01', 7.5, -4.2, gz, -30),
  );

  // --- Mid-west cottages ---
  addCluster(p, -6.5, 3.8, [
    { asset: 'BLD-cottage-01', ox: -1.1, oz: 1.0, rotY: 120 },
    { asset: 'BLD-cottage-02', ox: 1.0, oz: 1.1, rotY: 150 },
    { asset: 'BLD-hut-01', ox: -1.2, oz: -0.9, rotY: 90 },
    { asset: 'BLD-shed-01', ox: 1.15, oz: -1.0, rotY: 200 },
  ], gz);

  // --- SE dense block ---
  addCluster(p, 8.5, -8.5, [
    { asset: 'BLD-cottage-01', ox: -1.2, oz: 1.0, rotY: -15 },
    { asset: 'BLD-hut-02', ox: 1.3, oz: 0.9, rotY: 30 },
    { asset: 'BLD-inn-01', ox: -1.1, oz: -1.2, rotY: 0 },
    { asset: 'BLD-shop-01', ox: 1.25, oz: -1.15, rotY: 20 },
    { asset: 'BLD-shed-01', ox: 0.1, oz: -2.3, rotY: 90 },
  ], gz);
  p.push(place('PROP-bench-01', 8.8, -8.0, gz, 40), place('BUSH-08', 7.8, -7.6, 0));

  // --- SW dense block ---
  addCluster(p, -8.2, -8.0, [
    { asset: 'BLD-hut-01', ox: -1.1, oz: 1.0, rotY: 120 },
    { asset: 'BLD-shed-01', ox: 1.2, oz: 0.9, rotY: 90 },
    { asset: 'BLD-cottage-02', ox: -1.0, oz: -1.2, rotY: 180 },
    { asset: 'BLD-hut-02', ox: 1.15, oz: -1.1, rotY: 200 },
  ], gz);
  p.push(place('PROP-barrel-01', -8.5, -7.6, gz), place('TREE-autumn-08', -7.0, -6.8, 0, -15));

  // --- NW dense block ---
  addCluster(p, -8.5, 8.8, [
    { asset: 'BLD-watch-01', ox: 0.2, oz: 1.3, rotY: 40 },
    { asset: 'BLD-barn-01', ox: -1.6, oz: -0.4, rotY: 200 },
    { asset: 'BLD-hut-01', ox: 1.5, oz: -0.5, rotY: 20 },
    { asset: 'BLD-cottage-01', ox: -1.4, oz: 1.5, rotY: 180 },
    { asset: 'BLD-shed-01', ox: 1.6, oz: 1.4, rotY: 160 },
  ], gz);
  p.push(place('RUIN-pillar-00', -10.2, 9.5, gz, 10), place('ROCK-03', -9.0, 8.2, 0, 0, 1.0));

  // --- NE ruins (tighter cluster) ---
  p.push(
    place('RUIN-pillar-00', 9.5, 9.0, gz),
    place('RUIN-pillar-02', 10.3, 9.6, gz, 35),
    place('RUIN-pillar-00', 11.0, 8.7, gz, 15),
    place('RUIN-pillar-02', 11.4, 10.0, gz, 55),
    place('ROCK-07', 10.5, 8.3, 0, 0, 1.1),
    place('ROCK-00', 11.8, 9.2, 0, 0, 1.2),
    place('TREE-dead-10', 9.0, 10.5, 0, 10),
    place('BLD-hut-01', 8.2, 8.0, gz, 25),
  );

  // --- Roads: continuous but not sparse ---
  for (let i = -11; i <= 11; i++) {
    if (i === 0) continue;
    p.push(place('PATH-stone-00', 0, i, 0.02, 0, 1.12));
    p.push(place('PATH-stone-01', i, 0, 0.02, 90, 1.12));
  }
  p.push(place('PATH-stone-04', 0, 0, 0.02, 0, 1.25));
  p.push(place('PATH-stone-08', 0, -7.2, 0.02));
  p.push(place('PATH-stone-08', 0, 7.4, 0.02, 180));
  for (const x of [-3, -5, -7, -9]) {
    p.push(place('PATH-stone-01', x, 0, 0.02, 90, 1.05));
  }
  for (const x of [3, 5, 7, 9, 11]) {
    p.push(place('PATH-stone-01', x, 0, 0.02, 90, 1.05));
  }

  // --- Tree belts (between neighborhoods, still fairly full) ---
  const forest: Array<[number, number, string, number]> = [
    [-3.2, 3.4, 'TREE-pine-03', 0],
    [-2.0, 4.0, 'TREE-pine-04', 30],
    [2.0, 3.9, 'TREE-oak-00', 15],
    [3.3, 3.3, 'TREE-oak-01', -20],
    [-3.8, -3.0, 'TREE-birch-06', 40],
    [3.6, -3.2, 'TREE-pine-03', 10],
    [-4.8, 2.0, 'TREE-oak-00', 60],
    [5.0, 1.8, 'TREE-autumn-08', -15],
    [-5.2, -2.2, 'TREE-pine-04', 25],
    [5.4, -1.8, 'TREE-dead-10', 0],
    [-1.0, 5.5, 'TREE-birch-06', -40],
    [1.2, 5.6, 'TREE-oak-01', 80],
    [-7.5, 1.5, 'TREE-pine-03', 12],
    [-8.0, -1.2, 'TREE-oak-00', -25],
    [-10.5, 2.5, 'TREE-pine-04', 50],
    [-11.0, -1.0, 'TREE-birch-06', 5],
    [7.5, 2.5, 'TREE-oak-01', 70],
    [8.2, -0.5, 'TREE-pine-03', -10],
    [11.0, 0.5, 'TREE-autumn-08', 33],
    [11.5, 3.2, 'TREE-pine-04', 18],
    [-2.5, -9.5, 'TREE-oak-00', 90],
    [2.8, -10.0, 'TREE-pine-03', -40],
    [0.0, -11.0, 'TREE-birch-06', 20],
    [5.5, -7.5, 'TREE-pine-04', 0],
    [-5.5, -7.0, 'TREE-oak-01', 45],
    [-3.0, 10.5, 'TREE-pine-03', 8],
    [3.2, 11.0, 'TREE-oak-00', 55],
    [5.5, 9.5, 'TREE-pine-04', -22],
    [-5.8, 9.0, 'TREE-birch-06', 14],
    [7.0, -5.5, 'TREE-oak-00', -50],
    [-7.0, 5.5, 'TREE-pine-03', 70],
    [10.0, -6.5, 'TREE-birch-06', -30],
    [-10.0, -5.5, 'TREE-autumn-08', 20],
  ];
  for (const [tx, tz, asset, rot] of forest) {
    p.push(place(asset, tx, tz, 0, rot));
  }

  // --- Bushes & flowers packed near buildings ---
  const bushes: Array<[number, number, string]> = [
    [-1.1, 1.0, 'BUSH-00'],
    [1.15, 1.05, 'BUSH-02'],
    [-2.0, -0.9, 'BUSH-05'],
    [2.05, -1.1, 'BUSH-08'],
    [3.0, 1.4, 'BUSH-00'],
    [-0.5, 2.3, 'BUSH-02'],
    [-4.8, 0.6, 'BUSH-05'],
    [5.0, 0.5, 'BUSH-08'],
    [0.7, -8.5, 'BUSH-00'],
    [-0.9, -8.3, 'BUSH-02'],
    [-9.0, 1.2, 'BUSH-05'],
    [10.5, 2.0, 'BUSH-08'],
    [8.0, -8.0, 'BUSH-00'],
    [-8.0, -7.5, 'BUSH-02'],
    [-8.0, 8.5, 'BUSH-00'],
    [9.2, 8.5, 'BUSH-02'],
  ];
  for (const [tx, tz, asset] of bushes) {
    p.push(place(asset, tx, tz, 0));
  }
  p.push(
    place('DET-flower-00', 0.5, 0.55, 0),
    place('DET-flower-02', -0.55, 0.6, 0),
    place('DET-grass-00', 1.1, 2.1, 0),
    place('DET-grass-00', -1.7, 2.0, 0),
    place('DET-flower-00', -9.0, 0.8, 0),
    place('DET-grass-00', 10.2, 2.4, 0),
    place('DET-flower-02', 0.4, -9.0, 0),
    place('DET-grass-00', -0.6, 9.2, 0),
  );

  return p;
}

export function uniqueAssets(placements: TownPlacement[]): string[] {
  return [...new Set(placements.map((p) => p.asset))].sort();
}

export function townBounds(placements: TownPlacement[]): {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
} {
  if (placements.length === 0) {
    return { minX: 0, maxX: 0, minZ: 0, maxZ: 0 };
  }
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const p of placements) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minZ = Math.min(minZ, p.z);
    maxZ = Math.max(maxZ, p.z);
  }
  return { minX, maxX, minZ, maxZ };
}

/** Rough building count for tests / tuning. */
export function countBuildings(placements: TownPlacement[]): number {
  return placements.filter((p) => p.asset.startsWith('BLD-')).length;
}
