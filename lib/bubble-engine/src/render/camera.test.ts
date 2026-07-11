import { describe, expect, it } from 'vitest';
import { screenToWorld, worldToScreen } from './camera.ts';

describe('camera', () => {
  const camera = { position: { x: 10, y: 5 }, zoom: 34 };
  const view = { width: 800, height: 600 };

  it('worldToScreen / screenToWorld の往復', () => {
    const world = { x: 12, y: 8 };
    const screen = worldToScreen(world, camera, view);
    const back = screenToWorld(screen, camera, view);
    expect(back.x).toBeCloseTo(world.x, 5);
    expect(back.y).toBeCloseTo(world.y, 5);
  });

  it('Y 軸が反転する（ワールド Y 上向き → スクリーン Y 下向き）', () => {
    const high = worldToScreen({ x: 10, y: 10 }, camera, view);
    const low = worldToScreen({ x: 10, y: 0 }, camera, view);
    expect(high.y).toBeLessThan(low.y);
  });
});
