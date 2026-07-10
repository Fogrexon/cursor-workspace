import type { Tile, TileKind } from '../types';
import type { BalanceConfig } from './balance';
import { fbm2D } from './noise';
import { makeTile } from './grid';

/**
 * ノイズで地形タイルを生成。中心付近は草地寄りにして初期村を置きやすくする。
 */
export function generateTerrain(
  width: number,
  height: number,
  seed: number,
  terrain: BalanceConfig['terrain'],
): Tile[] {
  const tiles: Tile[] = [];
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const maxDist = Math.hypot(cx, cy) || 1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = x * terrain.scale;
      const ny = y * terrain.scale;
      const moisture = fbm2D(nx, ny, seed);
      const forestN = fbm2D(nx + 40, ny - 17, seed + 7);
      const edge =
        x === 0 || y === 0 || x === width - 1 || y === height - 1 ? 0.06 : 0;

      // 中心は乾燥寄り（村用地）
      const dist = Math.hypot(x - cx, y - cy) / maxDist;
      const centerBias = Math.max(0, 1 - dist * 1.6) * 0.2;
      const m = moisture + edge - centerBias;

      let kind: TileKind;
      if (m > terrain.waterThreshold) {
        kind = 'water';
      } else if (
        forestN > terrain.forestThreshold &&
        m < terrain.waterThreshold - 0.03
      ) {
        kind = 'forest';
      } else {
        kind = 'grass';
      }

      const variant =
        kind === 'water'
          ? Math.floor(moisture * 3) % 3
          : kind === 'forest'
            ? Math.floor(forestN * 4) % 4
            : Math.floor((moisture + forestN) * 2) % 4;

      tiles.push(makeTile(kind, 0, variant));
    }
  }
  return tiles;
}

/** 建設時の地形追加コスト */
export function terrainBuildSurcharge(
  underKind: TileKind,
  action: 'building' | 'road' | 'rail' | 'crossing' | 'station',
  balance: BalanceConfig,
): number {
  const d = balance.development;
  if (underKind === 'forest') {
    return d.forestClearCost;
  }
  if (underKind === 'water') {
    if (action === 'road' || action === 'rail' || action === 'crossing') {
      return d.bridgeCost;
    }
    // 建物は水の上には建てない
    return Number.POSITIVE_INFINITY;
  }
  return 0;
}

/**
 * 道路/線路を置いた結果の kind。
 * 水上は橋。道路×線路は踏切。
 */
export function pavedKind(
  underKind: TileKind,
  want: 'road' | 'rail',
): TileKind {
  if (underKind === 'water' || underKind === 'bridge') {
    return 'bridge';
  }
  if (want === 'road' && underKind === 'rail') return 'crossing';
  if (want === 'rail' && underKind === 'road') return 'crossing';
  return want;
}
