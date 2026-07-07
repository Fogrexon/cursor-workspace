import type { Coin, Point, TerrainOptions } from '../types';
import { createRng, randomRange } from './rng';

interface Wave {
  amplitude: number;
  frequency: number;
  phase: number;
}

/**
 * シードから起伏を決める正弦波の重ね合わせを作る。
 * これ自体は純粋(rng に依存)なので同じシードで同じ地形になる。
 */
function buildWaves(rng: () => number, amplitude: number, roughness: number): Wave[] {
  const layers = 4;
  const waves: Wave[] = [];
  for (let i = 0; i < layers; i++) {
    // 層が上がるほど高周波・低振幅。roughness で高周波成分を強める。
    const falloff = 1 / (i + 1);
    waves.push({
      amplitude: amplitude * falloff * randomRange(rng, 0.5, 1),
      frequency: (0.05 + i * 0.08 * (0.5 + roughness)) * randomRange(rng, 0.8, 1.2),
      phase: randomRange(rng, 0, Math.PI * 2),
    });
  }
  return waves;
}

/** 指定 x(m)における地面の高さ(m)を返す */
function heightAt(waves: Wave[], x: number, flatWidth: number, rampWidth: number): number {
  if (x <= flatWidth) return 0;
  // 平坦区間の直後は急に山にならないよう、振幅を徐々に立ち上げる。
  const ramp = Math.min(1, (x - flatWidth) / rampWidth);
  let h = 0;
  for (const w of waves) {
    h += w.amplitude * Math.sin(w.frequency * x + w.phase);
  }
  return h * ramp;
}

/**
 * ヒルクライム用の地形(点列)を生成する。純粋関数。
 * 返す点は x 昇順で、先頭 flatSegments 区間は必ず平坦(y=0)。
 */
export function generateTerrain(opts: TerrainOptions): Point[] {
  const { seed, segmentCount, segmentWidth, flatSegments, amplitude, roughness } = opts;
  const rng = createRng(seed);
  const waves = buildWaves(rng, amplitude, roughness);
  const flatWidth = flatSegments * segmentWidth;
  const rampWidth = segmentWidth * 6;

  const points: Point[] = [];
  for (let i = 0; i <= segmentCount; i++) {
    const x = i * segmentWidth;
    points.push({ x, y: heightAt(waves, x, flatWidth, rampWidth) });
  }
  return points;
}

/**
 * 地形の上にコインを一定間隔で配置する。純粋関数。
 * 平坦なスタート区間にはコインを置かない。
 */
export function generateCoins(
  terrain: Point[],
  opts: { spacing: number; height: number; skipUntilX: number },
): Coin[] {
  const { spacing, height, skipUntilX } = opts;
  if (terrain.length < 2 || spacing <= 0) return [];
  const coins: Coin[] = [];
  const maxX = terrain[terrain.length - 1].x;
  for (let x = skipUntilX + spacing; x < maxX; x += spacing) {
    const groundY = sampleTerrainHeight(terrain, x);
    coins.push({ x, y: groundY + height, taken: false });
  }
  return coins;
}

/**
 * 点列を線形補間して x における地面の高さを返す。純粋関数。
 * 範囲外は端点の高さでクランプする。
 */
export function sampleTerrainHeight(terrain: Point[], x: number): number {
  if (terrain.length === 0) return 0;
  if (x <= terrain[0].x) return terrain[0].y;
  const last = terrain[terrain.length - 1];
  if (x >= last.x) return last.y;

  // 等間隔前提でおおよそのインデックスを求めてから線形補間する。
  let lo = 0;
  let hi = terrain.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (terrain[mid].x <= x) lo = mid;
    else hi = mid;
  }
  const a = terrain[lo];
  const b = terrain[hi];
  const t = (x - a.x) / (b.x - a.x);
  return a.y + (b.y - a.y) * t;
}
