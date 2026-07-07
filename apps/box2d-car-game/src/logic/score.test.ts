import { describe, expect, it } from 'vitest';
import { COIN_POINTS, bestScore, computeScore, formatDistance, metersFromStart } from './score';

describe('metersFromStart', () => {
  it('前進した距離を返す', () => {
    expect(metersFromStart(10, 35)).toBe(25);
  });

  it('スタート地点では 0', () => {
    expect(metersFromStart(10, 10)).toBe(0);
  });

  it('後退してもマイナスにならない', () => {
    expect(metersFromStart(10, 4)).toBe(0);
  });
});

describe('computeScore', () => {
  it('距離のみのスコア', () => {
    expect(computeScore({ distance: 100.9, coins: 0 })).toBe(100);
  });

  it('コインを加点する', () => {
    expect(computeScore({ distance: 0, coins: 3 })).toBe(3 * COIN_POINTS);
  });

  it('距離とコインの合算', () => {
    expect(computeScore({ distance: 50, coins: 2 })).toBe(50 + 2 * COIN_POINTS);
  });

  it('負の入力は 0 として扱う', () => {
    expect(computeScore({ distance: -5, coins: -2 })).toBe(0);
  });
});

describe('formatDistance', () => {
  it('小数第1位まで m 付きで表示', () => {
    expect(formatDistance(12.34)).toBe('12.3 m');
  });

  it('負の値は 0 m', () => {
    expect(formatDistance(-3)).toBe('0.0 m');
  });
});

describe('bestScore', () => {
  it('大きい方を返す', () => {
    expect(bestScore(100, 250)).toBe(250);
    expect(bestScore(300, 250)).toBe(300);
  });
});
