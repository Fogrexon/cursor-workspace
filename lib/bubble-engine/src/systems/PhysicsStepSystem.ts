import type { World } from '../ecs/World.ts';
import { RigidBody } from '../components/RigidBody.ts';
import { PhysicsWorld } from '../core/resources.ts';

export function runPhysicsStepSystem(world: World, dt: number): void {
  const adapter = world.resource(PhysicsWorld);
  for (const [entity] of world.query(RigidBody)) {
    adapter.syncBody(entity);
  }
  adapter.step(dt);
  for (const [entity, bodyDef] of world.query(RigidBody)) {
    if (bodyDef.type === 'dynamic') {
      adapter.syncTransformFromBody(entity);
    }
  }
  adapter.drainContactEvents(world);
}
