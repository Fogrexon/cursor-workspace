import type { World } from '../ecs/World.ts';
import { Transform, Parent } from '../components/Transform.ts';
import type { Entity } from '../ecs/Entity.ts';
import type { Vec2 } from '../math/types.ts';

function rotate(v: Vec2, angle: number): Vec2 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
}

function computeWorldTransform(
  world: World,
  entity: Entity,
  cache: Map<Entity, { position: Vec2; angle: number; scale: Vec2 }>,
): { position: Vec2; angle: number; scale: Vec2 } {
  const cached = cache.get(entity);
  if (cached) return cached;

  const local = world.get(entity, Transform)!;
  const scale = local.scale ?? { x: 1, y: 1 };
  const parentLink = world.get(entity, Parent);
  if (!parentLink) {
    const result = { position: { ...local.position }, angle: local.angle, scale: { ...scale } };
    cache.set(entity, result);
    return result;
  }

  const parentWorld = computeWorldTransform(world, parentLink.parent, cache);
  const rotated = rotate(local.position, parentWorld.angle);
  const result = {
    position: {
      x: parentWorld.position.x + rotated.x * parentWorld.scale.x,
      y: parentWorld.position.y + rotated.y * parentWorld.scale.y,
    },
    angle: parentWorld.angle + local.angle,
    scale: {
      x: parentWorld.scale.x * scale.x,
      y: parentWorld.scale.y * scale.y,
    },
  };
  cache.set(entity, result);
  return result;
}

export function runHierarchySystem(world: World): void {
  const cache = new Map<Entity, { position: Vec2; angle: number; scale: Vec2 }>();
  for (const [entity] of world.query(Transform)) {
    const worldT = computeWorldTransform(world, entity, cache);
    const t = world.get(entity, Transform)!;
    t._worldPosition = { ...worldT.position };
    t._worldAngle = worldT.angle;
    t._worldScale = { ...worldT.scale };
  }
}
