import { describe, expect, it } from 'vitest';
import {
  EFFECT_IDS,
  getEffectLabel,
  isAnimatedEffect,
  isEffectId,
  listEffects,
} from './effects';

describe('listEffects', () => {
  it('returns one meta entry per known id', () => {
    const list = listEffects();
    expect(list).toHaveLength(EFFECT_IDS.length);
    expect(list.map((e) => e.id)).toEqual([...EFFECT_IDS]);
  });

  it('marks only wave as animated', () => {
    const animated = listEffects().filter((e) => e.animated).map((e) => e.id);
    expect(animated).toEqual(['wave']);
  });
});

describe('isEffectId / getEffectLabel', () => {
  it('accepts known ids and rejects others', () => {
    expect(isEffectId('gray')).toBe(true);
    expect(isEffectId('nope')).toBe(false);
  });

  it('returns label for known ids and raw string otherwise', () => {
    expect(getEffectLabel('sepia')).toBe('Sepia');
    expect(getEffectLabel('custom')).toBe('custom');
  });
});

describe('isAnimatedEffect', () => {
  it('is true only for wave', () => {
    expect(isAnimatedEffect('wave')).toBe(true);
    expect(isAnimatedEffect('blur')).toBe(false);
  });
});
