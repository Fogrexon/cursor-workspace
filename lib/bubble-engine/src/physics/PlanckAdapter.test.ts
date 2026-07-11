import { describe, expect, it } from 'vitest';
import { PlanckPhysicsAdapter } from './PlanckAdapter.ts';
import { PhysicsLayer, RigidBody, Collider } from '../components/RigidBody.ts';
import { Transform } from '../components/Transform.ts';
import { World } from '../ecs/World.ts';
import { resetEntityIds } from '../ecs/Entity.ts';

describe('PlanckPhysicsAdapter', () => {
  it('dynamic body が重力で y 座標が変化する', () => {
    resetEntityIds();
    const world = new World();
    const adapter = new PlanckPhysicsAdapter(world);
    adapter.setGravity({ x: 0, y: -10 });

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

    adapter.syncBody(e);
    const y0 = adapter.getTransform(e).position.y;
    adapter.step(1 / 60);
    adapter.syncTransformFromBody(e);
    const y1 = world.get(e, Transform)!.position.y;
    expect(y1).toBeLessThan(y0);
  });

  it('category/mask が一致しない Body 同士は接触しない', () => {
    resetEntityIds();
    const world = new World();
    const adapter = new PlanckPhysicsAdapter(world);

    const player = world
      .spawn()
      .with(Transform, { position: { x: 0, y: 1 }, angle: 0 })
      .with(RigidBody, { type: 'dynamic' })
      .with(Collider, {
        shapes: [{ type: 'circle', radius: 0.5, density: 1 }],
        category: PhysicsLayer.Player,
        mask: PhysicsLayer.Terrain,
      })
      .build();

    const coin = world
      .spawn()
      .with(Transform, { position: { x: 0, y: 1 }, angle: 0 })
      .with(RigidBody, { type: 'dynamic' })
      .with(Collider, {
        shapes: [{ type: 'circle', radius: 0.5, density: 1 }],
        category: PhysicsLayer.Coin,
        mask: PhysicsLayer.Terrain,
      })
      .build();

    let contacts = 0;
    adapter.planckWorld.on('begin-contact', () => {
      contacts++;
    });

    adapter.syncBody(player);
    adapter.syncBody(coin);
    for (let i = 0; i < 10; i++) adapter.step(1 / 60);
    expect(contacts).toBe(0);
  });

  it('fixedRotation なら impulse 後も回転しない', () => {
    resetEntityIds();
    const world = new World();
    const adapter = new PlanckPhysicsAdapter(world);

    const e = world
      .spawn()
      .with(Transform, { position: { x: 0, y: 1 }, angle: 0 })
      .with(RigidBody, { type: 'dynamic', fixedRotation: true })
      .with(Collider, {
        shapes: [{ type: 'circle', radius: 0.5, density: 1, friction: 0.3 }],
        category: PhysicsLayer.Default,
        mask: PhysicsLayer.All,
      })
      .build();

    adapter.syncBody(e);
    adapter.applyLinearImpulse(e, { x: 8, y: 2 });
    for (let i = 0; i < 120; i++) adapter.step(1 / 60);
    expect(Math.abs(adapter.getAngularVelocity(e))).toBeLessThan(0.001);
    expect(adapter.getTransform(e).angle).toBeCloseTo(0, 4);
  });
});
