import { describe, expect, it, beforeEach } from 'vitest';
import { World } from '../ecs/World.ts';
import { Transform, Parent } from '../components/Transform.ts';
import { resetEntityIds } from '../ecs/Entity.ts';
import { runHierarchySystem } from './HierarchySystem.ts';

describe('HierarchySystem', () => {
  beforeEach(() => resetEntityIds());

  it('Parent なし Entity は local = world', () => {
    const world = new World();
    const e = world.spawn().with(Transform, { position: { x: 3, y: 4 }, angle: 0.5 }).build();
    runHierarchySystem(world);
    const t = world.get(e, Transform)!;
    expect(t._worldPosition).toEqual({ x: 3, y: 4 });
    expect(t._worldAngle).toBeCloseTo(0.5);
  });

  it('Parent チェーンで _worldPosition / _worldAngle を合成する', () => {
    const world = new World();
    const parent = world
      .spawn()
      .with(Transform, { position: { x: 10, y: 0 }, angle: Math.PI / 2 })
      .build();
    const child = world
      .spawn()
      .with(Transform, { position: { x: 2, y: 0 }, angle: 0 })
      .with(Parent, { parent })
      .build();

    runHierarchySystem(world);

    const childT = world.get(child, Transform)!;
    expect(childT._worldPosition!.x).toBeCloseTo(10, 5);
    expect(childT._worldPosition!.y).toBeCloseTo(2, 5);
    expect(childT._worldAngle).toBeCloseTo(Math.PI / 2, 5);
  });

  it('3 段階の親子チェーンを再帰的に解決する', () => {
    const world = new World();
    const root = world
      .spawn()
      .with(Transform, { position: { x: 1, y: 1 }, angle: 0 })
      .build();
    const mid = world
      .spawn()
      .with(Transform, { position: { x: 5, y: 0 }, angle: 0 })
      .with(Parent, { parent: root })
      .build();
    const leaf = world
      .spawn()
      .with(Transform, { position: { x: 0, y: 3 }, angle: 0 })
      .with(Parent, { parent: mid })
      .build();

    runHierarchySystem(world);

    expect(world.get(leaf, Transform)!._worldPosition).toEqual({ x: 6, y: 4 });
  });
});
