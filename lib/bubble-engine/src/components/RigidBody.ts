import type { Vec2 } from '../math/types.ts';
import { defineComponent } from '../ecs/Component.ts';

export interface RigidBodyData {
  type: 'static' | 'dynamic' | 'kinematic';
  gravityScale?: number;
  fixedRotation?: boolean;
  _bodyId?: number;
}

export const RigidBody = defineComponent<RigidBodyData>('RigidBody');

export type ColliderShape =
  | {
      type: 'circle';
      radius: number;
      offset?: Vec2;
      density?: number;
      friction?: number;
      restitution?: number;
    }
  | {
      type: 'polygon';
      vertices: Vec2[];
      density?: number;
      friction?: number;
      restitution?: number;
    }
  | { type: 'edge'; a: Vec2; b: Vec2; friction?: number; restitution?: number }
  | { type: 'edgeChain'; points: Vec2[]; friction?: number; restitution?: number };

export interface ColliderData {
  shapes: ColliderShape[];
  category?: number;
  mask?: number;
}

export const Collider = defineComponent<ColliderData>('Collider');

export const PhysicsLayer = {
  Default: 1 << 0,
  Player: 1 << 1,
  Terrain: 1 << 2,
  Coin: 1 << 3,
  Trigger: 1 << 4,
  All: 0xffff,
} as const;
