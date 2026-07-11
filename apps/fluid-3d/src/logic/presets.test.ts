import { describe, expect, it } from 'vitest';
import { getPreset, mergeParams, QUALITY_PRESETS } from './presets';

describe('QUALITY_PRESETS', () => {
  it('uses modest box-fluid counts', () => {
    expect(QUALITY_PRESETS[2]!.params.particleCount).toBeLessThanOrEqual(3500);
  });
});

describe('mergeParams', () => {
  it('clamps', () => {
    const m = mergeParams(getPreset('medium').params, { particleCount: 1 });
    expect(m.particleCount).toBe(64);
  });
});
