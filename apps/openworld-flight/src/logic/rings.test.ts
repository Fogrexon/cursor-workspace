import {
  allCollected,
  collectedCount,
  createRingCourse,
  distance3,
  tryCollectRing,
} from './rings';
import { createPlaneState } from './flight';
import { describe, expect, it } from 'vitest';

describe('rings', () => {
  it('creates a non-empty course', () => {
    const rings = createRingCourse();
    expect(rings.length).toBeGreaterThan(0);
    expect(collectedCount(rings)).toBe(0);
    expect(allCollected(rings)).toBe(false);
  });

  it('collects a ring when plane is inside radius', () => {
    const rings = createRingCourse();
    const target = rings[0]!;
    const plane = createPlaneState({ x: target.x, y: target.y, z: target.z });
    const result = tryCollectRing(plane, rings);
    expect(result.collectedId).toBe(target.id);
    expect(collectedCount(result.rings)).toBe(1);
  });

  it('does not collect when far away', () => {
    const rings = createRingCourse();
    const plane = createPlaneState({ x: 999, y: 50, z: 999 });
    const result = tryCollectRing(plane, rings);
    expect(result.collectedId).toBeNull();
    expect(collectedCount(result.rings)).toBe(0);
  });

  it('computes distance', () => {
    expect(distance3({ x: 0, y: 0, z: 0 }, { x: 3, y: 4, z: 0 })).toBe(5);
  });
});
