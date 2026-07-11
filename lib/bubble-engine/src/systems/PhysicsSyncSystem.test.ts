import { describe, expect, it, beforeEach } from 'vitest';
import { World } from '../ecs/World.ts';
import { Transform } from '../components/Transform.ts';
import { RigidBody, Collider, PhysicsLayer } from '../components/RigidBody.ts';
import { PhysicsWorld } from '../core/resources.ts';
import { PlanckPhysicsAdapter } from '../physics/PlanckAdapter.ts';
import { runPhysicsSyncSystem } from './PhysicsSyncSystem.ts';
import { resetEntityIds } from '../ecs/Entity.ts';

describe('PhysicsSyncSystem', () => {
  beforeEach(() => resetEntityIds());

  it('kinematic Body に Transform を planck へ反映する', () => {
    const world = new World();
    const adapter = new PlanckPhysicsAdapter(world);
    world.insertResource(PhysicsWorld, adapter);

    const e = world
      .spawn()
      .with(Transform, { position: { x: 0, y: 0 }, angle: 0 })
      .with(RigidBody, { type: 'kinematic' })
      .with(Collider, {
        shapes: [{ type: 'circle', radius: 0.5 }],
        category: PhysicsLayer.Default,
        mask: PhysicsLayer.All,
      })
      .build();

    adapter.syncBody(e);
    world.get(e, Transform)!.position = { x: 5, y: 2 };
    runPhysicsSyncSystem(world);

    const pos = adapter.getTransform(e).position;
    expect(pos.x).toBeCloseTo(5, 5);
    expect(pos.y).toBeCloseTo(2, 5);
  });
});
