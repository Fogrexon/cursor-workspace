import { describe, expect, it } from 'vitest';
import { addDestroyScore, bestScore, evaluateOutcome, PIG_POINTS, BLOCK_POINTS } from './score';

describe('addDestroyScore', () => {
  it('豚とブロックで加点', () => {
    expect(addDestroyScore(0, 'pig')).toBe(PIG_POINTS);
    expect(addDestroyScore(100, 'block')).toBe(100 + BLOCK_POINTS);
  });
});

describe('evaluateOutcome', () => {
  it('豚全滅で勝利', () => {
    expect(evaluateOutcome(0, 1, false)).toBe('win');
  });

  it('鳥使い切りで敗北', () => {
    expect(evaluateOutcome(2, 0, false)).toBe('lose');
  });

  it('飛行中は続行', () => {
    expect(evaluateOutcome(2, 0, true)).toBe('playing');
  });
});

describe('bestScore', () => {
  it('大きい方', () => {
    expect(bestScore(100, 200)).toBe(200);
  });
});
