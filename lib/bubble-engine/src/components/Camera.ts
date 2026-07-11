import type { Vec2 } from '../math/types.ts';
import { defineComponent } from '../ecs/Component.ts';
import type { Entity } from '../ecs/Entity.ts';

export interface CameraData {
  zoom: number;
  target?: Entity;
  offset?: Vec2;
  smoothing?: number;
  position: Vec2;
}

export const Camera = defineComponent<CameraData>('Camera');
