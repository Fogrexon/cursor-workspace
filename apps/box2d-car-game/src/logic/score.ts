import type { ScoreInput } from '../types';

/** コイン 1 枚あたりの加点 */
export const COIN_POINTS = 50;

/**
 * スタート地点からの到達距離(m)を返す。純粋関数。
 * 後退してもマイナスにはならず 0 で下げ止まる。
 */
export function metersFromStart(startX: number, currentX: number): number {
  return Math.max(0, currentX - startX);
}

/**
 * 距離とコインからスコアを算出する。純粋関数。
 * 距離 1m = 1点、コイン 1枚 = COIN_POINTS 点。
 */
export function computeScore(input: ScoreInput): number {
  const distancePoints = Math.max(0, Math.floor(input.distance));
  const coinPoints = Math.max(0, Math.floor(input.coins)) * COIN_POINTS;
  return distancePoints + coinPoints;
}

/** 距離を "12.3 m" のような表示文字列にする */
export function formatDistance(meters: number): string {
  return `${Math.max(0, meters).toFixed(1)} m`;
}

/** 既存ベストと比較して大きい方を返す(ハイスコア更新) */
export function bestScore(previous: number, current: number): number {
  return Math.max(previous, current);
}
