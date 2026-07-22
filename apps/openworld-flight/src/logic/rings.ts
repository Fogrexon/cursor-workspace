import type { PlaneState, Ring, Vec3 } from '../types';
import { WORLD_SCALE } from './flight';

export function createRingCourse(): Ring[] {
  const s = WORLD_SCALE;
  // Loop over the dense multi-neighborhood town
  const spots: Array<[string, number, number, number]> = [
    ['r1', 0, 5, 14],
    ['r2', -6, 5.5, 8],
    ['r3', -12, 6, 2],
    ['r4', -10, 6.5, -6],
    ['r5', -4, 7, -12],
    ['r6', 4, 7, -12],
    ['r7', 10, 7.5, -6],
    ['r8', 14, 8, 2],
    ['r9', 10, 8.5, 10],
    ['r10', 4, 9, 14],
    ['r11', -4, 9.5, 14],
    ['r12', 0, 8, 0],
  ];
  return spots.map(([id, x, y, z]) => ({
    id,
    x: x * s,
    y: y * s * 0.42,
    z: z * s,
    radius: 1.5 * s * 0.38,
    collected: false,
  }));
}

export function distance3(a: Vec3, b: Vec3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.hypot(dx, dy, dz);
}

export function tryCollectRing(plane: PlaneState, rings: Ring[]): {
  rings: Ring[];
  collectedId: string | null;
} {
  let collectedId: string | null = null;
  const next = rings.map((ring) => {
    if (ring.collected || collectedId) return ring;
    const d = distance3(plane.position, { x: ring.x, y: ring.y, z: ring.z });
    if (d <= ring.radius) {
      collectedId = ring.id;
      return { ...ring, collected: true };
    }
    return ring;
  });
  return { rings: next, collectedId };
}

export function collectedCount(rings: Ring[]): number {
  return rings.filter((r) => r.collected).length;
}

export function allCollected(rings: Ring[]): boolean {
  return rings.length > 0 && rings.every((r) => r.collected);
}
