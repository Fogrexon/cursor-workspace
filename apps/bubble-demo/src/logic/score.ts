export const PIG_POINTS = 500;
export const BLOCK_POINTS = 100;

export function addDestroyScore(current: number, kind: 'pig' | 'block'): number {
  return current + (kind === 'pig' ? PIG_POINTS : BLOCK_POINTS);
}

export function bestScore(previous: number, current: number): number {
  return Math.max(previous, current);
}

export type LevelOutcome = 'playing' | 'win' | 'lose';

/** 勝敗判定 */
export function evaluateOutcome(pigsLeft: number, birdsLeft: number, birdInFlight: boolean): LevelOutcome {
  if (pigsLeft <= 0) return 'win';
  if (birdsLeft <= 0 && !birdInFlight) return 'lose';
  return 'playing';
}
