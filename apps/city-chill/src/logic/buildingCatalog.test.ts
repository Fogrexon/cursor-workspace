import { describe, expect, it } from 'vitest';
import { BUILDING_MODEL_DEFS, pickBuildingModelId } from './buildingCatalog';
import { makeTile } from './grid';

describe('buildingCatalog', () => {
  it('種類ごとに複数の形モデルがある', () => {
    const kinds = new Set(BUILDING_MODEL_DEFS.map((d) => d.kind));
    expect(kinds.has('residential')).toBe(true);
    expect(kinds.has('tower')).toBe(true);
    expect(kinds.has('skyscraper')).toBe(true);
    expect(BUILDING_MODEL_DEFS.filter((d) => d.kind === 'residential').length).toBeGreaterThan(2);
    expect(BUILDING_MODEL_DEFS.filter((d) => d.kind === 'tower').length).toBeGreaterThan(3);
  });

  it('variant で別モデルが選ばれる', () => {
    const a = pickBuildingModelId(makeTile('residential', 1, 0));
    const b = pickBuildingModelId(makeTile('residential', 1, 1));
    const c = pickBuildingModelId(makeTile('residential', 1, 2));
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
    expect(c).toBeTruthy();
    expect(new Set([a, b, c]).size).toBeGreaterThan(1);
  });

  it('2x2 超高層は footprint 2 のモデルを使う', () => {
    const t = makeTile('skyscraper', 2, 0, 0, 'none', 2);
    const id = pickBuildingModelId(t);
    expect(id?.startsWith('sky2_')).toBe(true);
  });

  it('建設中は null', () => {
    expect(pickBuildingModelId(makeTile('residential', 1, 0, 12))).toBeNull();
  });
});
