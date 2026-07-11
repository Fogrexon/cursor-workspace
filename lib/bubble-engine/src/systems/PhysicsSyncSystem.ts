import type { World } from '../ecs/World.ts';
import { RigidBody } from '../components/RigidBody.ts';
import { Transform } from '../components/Transform.ts';
import { PhysicsWorld } from '../core/resources.ts';

export function runPhysicsSyncSystem(world: World): void {
  const adapter = world.resource(PhysicsWorld);
  for (const [entity, bodyDef, transform] of world.query2(RigidBody, Transform)) {
    if (bodyDef.type !== 'kinematic') continue;
    adapter.syncBody(entity);
    adapter.setTransform(entity, transform);
  }
}
