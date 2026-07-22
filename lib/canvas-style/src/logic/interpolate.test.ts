import { describe, expect, it } from 'vitest';
import { ease, interpolateValue, stepTweens } from './interpolate';

describe('interpolate', () => {
  it('lerps numbers and hex colors', () => {
    expect(interpolateValue(0, 100, 0.5)).toBe(50);
    expect(interpolateValue('#000000', '#ffffff', 0.5)).toBe('#808080');
  });

  it('applies easeOut', () => {
    expect(ease(0, 'easeOut')).toBe(0);
    expect(ease(1, 'easeOut')).toBe(1);
    expect(ease(0.5, 'easeOut')).toBeGreaterThan(0.5);
  });

  it('steps tweens and drops finished ones', () => {
    const { values, remaining } = stepTweens(
      [
        {
          id: 'a',
          key: 'opacity',
          from: 0,
          to: 1,
          startMs: 0,
          durationMs: 100,
          easing: 'linear',
        },
      ],
      100,
    );
    expect(values.get('a\0opacity')).toBe(1);
    expect(remaining).toEqual([]);
  });
});
