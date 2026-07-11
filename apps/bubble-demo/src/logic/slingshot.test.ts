import { describe, expect, it } from 'vitest';
import {
  MAX_PULL,
  clampPullPoint,
  computeLaunchVelocity,
  contactDamage,
  isBirdAtRest,
} from './slingshot';

describe('computeLaunchVelocity', () => {
  it('引いた方向の反対へ飛ぶ', () => {
    const v = computeLaunchVelocity({ x: 0, y: 0 }, { x: -1, y: 0 });
    expect(v.x).toBeGreaterThan(0);
    expect(Math.abs(v.y)).toBeLessThan(0.01);
  });

  it('最大引き量で頭打ち', () => {
    const atMax = computeLaunchVelocity({ x: 0, y: 0 }, { x: MAX_PULL, y: 0 });
    const beyond = computeLaunchVelocity({ x: 0, y: 0 }, { x: MAX_PULL * 3, y: 0 });
    expect(beyond.x).toBeCloseTo(atMax.x, 5);
  });
});

describe('clampPullPoint', () => {
  it('最大距離を超えない', () => {
    const p = clampPullPoint({ x: 0, y: 0 }, { x: -10, y: 0 });
    expect(Math.hypot(p.x, p.y)).toBeCloseTo(MAX_PULL, 5);
  });

  it('右方向への引きを抑える', () => {
    const p = clampPullPoint({ x: 0, y: 0 }, { x: 5, y: 0 });
    expect(p.x).toBeLessThanOrEqual(0.05);
  });
});

describe('contactDamage', () => {
  it('低速はダメージなし', () => {
    expect(contactDamage(1)).toBe(0);
  });

  it('高速は大ダメージ', () => {
    expect(contactDamage(5)).toBe(2);
  });
});

describe('isBirdAtRest', () => {
  it('線速度のみで判定', () => {
    expect(isBirdAtRest(0.2)).toBe(true);
    expect(isBirdAtRest(1)).toBe(false);
  });
});
