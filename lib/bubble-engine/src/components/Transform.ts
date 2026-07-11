import type { Vec2 } from '../math/types.ts';
import { defineComponent } from '../ecs/Component.ts';

export interface TransformData {
  position: Vec2;
  angle: number;
  scale?: Vec2;
  _worldPosition?: Vec2;
  _worldAngle?: number;
  _worldScale?: Vec2;
}

export const Transform = defineComponent<TransformData>('Transform');

export interface ParentData {
  parent: import('../ecs/Entity.ts').Entity;
}

export const Parent = defineComponent<ParentData>('Parent');
