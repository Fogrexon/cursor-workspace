import { describe, expect, it, beforeEach, vi } from 'vitest';
import { World } from '../ecs/World.ts';
import { Transform } from '../components/Transform.ts';
import { RigidBody, Collider, PhysicsLayer } from '../components/RigidBody.ts';
import { PhysicsWorld } from '../core/resources.ts';
import { PlanckPhysicsAdapter } from '../physics/PlanckAdapter.ts';
import { ContactBegin } from '../physics/events.ts';
import { runPhysicsStepSystem } from './PhysicsStepSystem.ts';
import { resetEntityIds } from '../ecs/Entity.ts';

describe('PhysicsStepSystem', () => {
  beforeEach(() => resetEntityIds());

  it('dynamic Body の Transform が物理 step 後に更新される', () => {
    const world = new World();
    const adapter = new PlanckPhysicsAdapter(world);
    adapter.setGravity({ x: 0, y: -10 });
    world.insertResource(PhysicsWorld, adapter);

    const e = world
      .spawn()
      .with(Transform, { position: { x: 0, y: 5 }, angle: 0 })
      .with(RigidBody, { type: 'dynamic' })
      .with(Collider, {
        shapes: [{ type: 'circle', radius: 0.5, density: 1 }],
        category: PhysicsLayer.Default,
        mask: PhysicsLayer.All,
      })
      .build();

    runPhysicsStepSystem(world, 1 / 60);
    const y1 = world.get(e, Transform)!.position.y;
    runPhysicsStepSystem(world, 1 / 60);
    const y2 = world.get(e, Transform)!.position.y;
    expect(y2).toBeLessThan(y1);
  });

  it('layer が一致する接触で ContactBegin を発火する', () => {
    const world = new World();
    const adapter = new PlanckPhysicsAdapter(world);
    world.insertResource(PhysicsWorld, adapter);
    const onContact = vi.fn();
    world.events.on(ContactBegin, onContact);

    world
      .spawn()
      .with(Transform, { position: { x: 0, y: 1 }, angle: 0 })
      .with(RigidBody, { type: 'dynamic' })
      .with(Collider, {
        shapes: [{ type: 'circle', radius: 0.5, density: 1 }],
        category: PhysicsLayer.Player,
        mask: PhysicsLayer.Coin,
      })
      .build();

    world
      .spawn()
      .with(Transform, { position: { x: 0, y: 1 }, angle: 0 })
      .with(RigidBody, { type: 'dynamic' })
      .with(Collider, {
        shapes: [{ type: 'circle', radius: 0.5, density: 1 }],
        category: PhysicsLayer.Coin,
        mask: PhysicsLayer.Player,
      })
      .build();

    for (let i = 0; i < 5; i++) runPhysicsStepSystem(world, 1 / 60);
    expect(onContact).toHaveBeenCalled();
  });

  it('layer 不一致の接触では ContactBegin を発火しない', () => {
    const world = new World();
    const adapter = new PlanckPhysicsAdapter(world);
    world.insertResource(PhysicsWorld, adapter);
    const onContact = vi.fn();
    world.events.on(ContactBegin, onContact);

    world
      .spawn()
      .with(Transform, { position: { x: 0, y: 1 }, angle: 0 })
      .with(RigidBody, { type: 'dynamic' })
      .with(Collider, {
        shapes: [{ type: 'circle', radius: 0.5, density: 1 }],
        category: PhysicsLayer.Player,
        mask: PhysicsLayer.Terrain,
      })
      .build();

    world
      .spawn()
      .with(Transform, { position: { x: 0, y: 1 }, angle: 0 })
      .with(RigidBody, { type: 'dynamic' })
      .with(Collider, {
        shapes: [{ type: 'circle', radius: 0.5, density: 1 }],
        category: PhysicsLayer.Coin,
        mask: PhysicsLayer.Terrain,
      })
      .build();

    for (let i = 0; i < 5; i++) runPhysicsStepSystem(world, 1 / 60);
    expect(onContact).not.toHaveBeenCalled();
  });
});
