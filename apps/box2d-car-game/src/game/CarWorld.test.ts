import { describe, expect, it } from 'vitest';
import { CarWorld } from './CarWorld';
import type { Point } from '../types';

/** 平坦な地面を作る(y=0 の直線) */
function flatTerrain(length = 200, step = 3): Point[] {
  const pts: Point[] = [];
  for (let x = 0; x <= length; x += step) pts.push({ x, y: 0 });
  return pts;
}

function simulate(world: CarWorld, throttle: boolean, steps: number): void {
  for (let i = 0; i < steps; i++) {
    world.step(1 / 60, { throttle, brake: false });
  }
}

describe('CarWorld', () => {
  it('生成直後は車体・車輪の座標を取得できる', () => {
    const world = new CarWorld(flatTerrain(), 6);
    const chassis = world.getChassisTransform();
    expect(Number.isFinite(chassis.x)).toBe(true);
    expect(world.getWheelTransforms()).toHaveLength(2);
  });

  it('しばらく待つと地面に着地して安定する(裏返らない)', () => {
    const world = new CarWorld(flatTerrain(), 6);
    simulate(world, false, 120);
    expect(world.isFlipped()).toBe(false);
    const chassis = world.getChassisTransform();
    // 平地なので大きく落下しない
    expect(chassis.y).toBeGreaterThan(-5);
  });

  it('アクセルを入れると前進する(+x 方向へ進む)', () => {
    const world = new CarWorld(flatTerrain(), 6);
    simulate(world, false, 60); // 着地させる
    const before = world.getChassisTransform().x;
    simulate(world, true, 180);
    const after = world.getChassisTransform().x;
    expect(after).toBeGreaterThan(before + 2);
  });

  it('アクセルを入れると平均で前向きに進む', () => {
    const world = new CarWorld(flatTerrain(), 6);
    simulate(world, false, 60); // 着地させる
    const beforeX = world.getChassisTransform().x;
    const steps = 180;
    simulate(world, true, steps);
    const afterX = world.getChassisTransform().x;
    const avgSpeed = (afterX - beforeX) / (steps / 60);
    expect(avgSpeed).toBeGreaterThan(0);
  });
});
