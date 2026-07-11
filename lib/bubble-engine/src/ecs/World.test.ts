import { describe, expect, it, beforeEach, vi } from 'vitest';
import { defineComponent } from './Component.ts';
import { defineResource } from './Resource.ts';
import { resetEntityIds } from './Entity.ts';
import { World } from './World.ts';
import { PhysicsWorld } from '../core/resources.ts';
import { Transform } from '../components/Transform.ts';
import { RigidBody, Collider, PhysicsLayer } from '../components/RigidBody.ts';
import { PlanckPhysicsAdapter } from '../physics/PlanckAdapter.ts';

const Position = defineComponent<{ x: number; y: number }>('Position');
const Velocity = defineComponent<{ vx: number }>('Velocity');
const Score = defineResource<{ value: number }>('Score');

describe('World', () => {
  beforeEach(() => {
    resetEntityIds();
  });

  it('spawn/despawn で Entity を生成・削除する', () => {
    const world = new World();
    const e = world.spawn().with(Position, { x: 1, y: 2 }).build();
    expect(world.has(e, Position)).toBe(true);
    world.despawn(e);
    expect(world.get(e, Position)).toBeUndefined();
  });

  it('despawn で Component が全削除される', () => {
    const world = new World();
    const e = world.spawn().with(Position, { x: 0, y: 0 }).with(Velocity, { vx: 1 }).build();
    world.despawn(e);
    expect(world.has(e, Position)).toBe(false);
    expect(world.has(e, Velocity)).toBe(false);
  });

  it('add/get/remove/has が動作する', () => {
    const world = new World();
    const e = world.spawn().build();
    world.add(e, Position, { x: 5, y: 6 });
    expect(world.get(e, Position)).toEqual({ x: 5, y: 6 });
    world.remove(e, Position);
    expect(world.has(e, Position)).toBe(false);
  });

  it('死んだ Entity への add はエラー', () => {
    const world = new World();
    const e = world.spawn().build();
    world.despawn(e);
    expect(() => world.add(e, Position, { x: 0, y: 0 })).toThrow();
  });

  it('Resource の insert/has/remove/resource', () => {
    const world = new World();
    expect(world.hasResource(Score)).toBe(false);
    world.insertResource(Score, { value: 10 });
    expect(world.resource(Score).value).toBe(10);
    world.removeResource(Score);
    expect(world.hasResource(Score)).toBe(false);
    expect(() => world.resource(Score)).toThrow();
  });

  it('despawn で Physics Body も破棄する', () => {
    const world = new World();
    const adapter = new PlanckPhysicsAdapter(world);
    world.insertResource(PhysicsWorld, adapter);
    const destroySpy = vi.spyOn(adapter, 'destroyBody');

    const e = world
      .spawn()
      .with(Transform, { position: { x: 0, y: 1 }, angle: 0 })
      .with(RigidBody, { type: 'dynamic' })
      .with(Collider, {
        shapes: [{ type: 'circle', radius: 0.5 }],
        category: PhysicsLayer.Default,
        mask: PhysicsLayer.All,
      })
      .build();
    adapter.syncBody(e);

    world.despawn(e);
    expect(destroySpy).toHaveBeenCalledWith(e);
  });
});
