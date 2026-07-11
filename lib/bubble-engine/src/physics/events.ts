import { defineEvent } from '../ecs/events.ts';
import type { Entity } from '../ecs/Entity.ts';
import type { Vec2 } from '../math/types.ts';

export interface ContactBeginPayload {
  entityA: Entity;
  entityB: Entity;
  point: Vec2;
}

export const ContactBegin = defineEvent<ContactBeginPayload>('ContactBegin');
