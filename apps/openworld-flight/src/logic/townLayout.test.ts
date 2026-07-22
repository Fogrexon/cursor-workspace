import {
  buildTownLayout,
  countBuildings,
  townBounds,
  uniqueAssets,
} from './townLayout';
import { describe, expect, it } from 'vitest';

describe('buildTownLayout', () => {
  it('places multiple buildings and kit props', () => {
    const layout = buildTownLayout();
    expect(layout.length).toBeGreaterThan(100);
    const assets = uniqueAssets(layout);
    expect(assets.some((a) => a.startsWith('BLD-'))).toBe(true);
    expect(assets.some((a) => a.startsWith('TREE-'))).toBe(true);
    expect(assets).toContain('PROP-well-01');
    expect(assets).toContain('PROP-bridge-01');
  });

  it('keeps a dense building count (not sparse mega-spacing)', () => {
    expect(countBuildings(buildTownLayout())).toBeGreaterThan(60);
  });

  it('returns empty bounds for empty layout', () => {
    expect(townBounds([])).toEqual({ minX: 0, maxX: 0, minZ: 0, maxZ: 0 });
  });

  it('spans a wide overall footprint', () => {
    const b = townBounds(buildTownLayout());
    expect(b.minX).toBeLessThan(-50);
    expect(b.maxX).toBeGreaterThan(50);
    expect(b.minZ).toBeLessThan(-45);
    expect(b.maxZ).toBeGreaterThan(45);
  });
});
