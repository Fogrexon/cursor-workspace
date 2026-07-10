import type { Settlement, Tile, TileKind } from '../types';
import { BUILDING_KINDS, idx } from './grid';

/**
 * カメラ用の都市塊。建物・道路・駅のみ。
 * 線路・踏切・橋は含めない（都市間鉄道で2町が1塊になり、中間の空き地が中心になるのを防ぐ）。
 */
const URBAN: ReadonlySet<TileKind> = new Set([
  ...BUILDING_KINDS,
  'road',
  'station',
]);

export interface CityCluster {
  /** 重心 (タイル座標) */
  cx: number;
  cy: number;
  /** おおよその広がり半径 (タイル) */
  radius: number;
  /** 粗いセル数（規模の指標） */
  size: number;
  /** 最寄り集落名（あれば） */
  label: string | null;
}

/**
 * 都市タイル（建物・道路・駅）を粗いグリッド上で連結成分クラスタリングする。
 * 鉄道は無視する（都市間接続で中間点が中心になるのを防ぐ）。
 */
export function computeCityClusters(
  tiles: Tile[],
  width: number,
  height: number,
  settlements: Settlement[] = [],
  opts?: { step?: number; minSize?: number },
): CityCluster[] {
  const step = opts?.step ?? (width >= 128 ? 2 : 1);
  const minSize = opts?.minSize ?? 6;
  const gw = Math.ceil(width / step);
  const gh = Math.ceil(height / step);
  const marked = new Uint8Array(gw * gh);

  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      let hit = false;
      const x0 = gx * step;
      const y0 = gy * step;
      const x1 = Math.min(width, x0 + step);
      const y1 = Math.min(height, y0 + step);
      outer: for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          if (URBAN.has(tiles[idx(x, y, width)]!.kind)) {
            hit = true;
            break outer;
          }
        }
      }
      if (hit) marked[gy * gw + gx] = 1;
    }
  }

  const visited = new Uint8Array(gw * gh);
  const clusters: CityCluster[] = [];
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const;

  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      const start = gy * gw + gx;
      if (!marked[start] || visited[start]) continue;

      let sx = 0;
      let sy = 0;
      let n = 0;
      let minX = gx;
      let maxX = gx;
      let minY = gy;
      let maxY = gy;
      const stack = [start];
      visited[start] = 1;

      while (stack.length > 0) {
        const i = stack.pop()!;
        const cx = i % gw;
        const cy = (i / gw) | 0;
        sx += cx;
        sy += cy;
        n += 1;
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;

        for (const [dx, dy] of dirs) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
          const ni = ny * gw + nx;
          if (!marked[ni] || visited[ni]) continue;
          visited[ni] = 1;
          stack.push(ni);
        }
      }

      if (n < minSize) continue;

      const cgx = sx / n;
      const cgy = sy / n;
      const worldCx = (cgx + 0.5) * step;
      const worldCy = (cgy + 0.5) * step;
      const extent = Math.max(maxX - minX, maxY - minY) * step;
      const radius = Math.max(6, extent * 0.55 + Math.sqrt(n) * step * 0.35);

      let label: string | null = null;
      let best = Infinity;
      for (const s of settlements) {
        const d = Math.hypot(s.cx - worldCx, s.cy - worldCy);
        if (d < best) {
          best = d;
          label = s.name;
        }
      }
      // 集落から遠すぎる塊はラベルなし
      if (best > radius + 20) label = null;

      clusters.push({
        cx: worldCx,
        cy: worldCy,
        radius,
        size: n,
        label,
      });
    }
  }

  clusters.sort((a, b) => b.size - a.size);
  return clusters;
}

/** クラスタ規模 → カメラ autoZoom（大きいほどズームアウト＝値が小さい） */
export function autoZoomForCluster(cluster: CityCluster): number {
  // radius 8 → ~0.86 / 20 → ~0.70 / 40 → ~0.52
  const z = 0.95 - cluster.radius * 0.011 - Math.log2(1 + cluster.size) * 0.02;
  return Math.max(0.48, Math.min(0.9, z));
}
