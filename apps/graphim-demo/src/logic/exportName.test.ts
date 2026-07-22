import { describe, expect, it } from 'vitest';
import { exportBaseName } from './exportName';

describe('exportBaseName', () => {
  it('prefixes a safe effect id', () => {
    expect(exportBaseName('gray')).toBe('graphim-gray');
    expect(exportBaseName('frosted')).toBe('graphim-frosted');
  });

  it('sanitizes odd characters', () => {
    expect(exportBaseName('wave (custom)')).toBe('graphim-wave-custom');
  });
});
