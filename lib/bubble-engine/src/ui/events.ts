import { defineEvent } from '../ecs/events.ts';
import type { Entity } from '../ecs/Entity.ts';

export interface UiActionClickPayload {
  entity: Entity;
  action: string;
}

export const UiActionClick = defineEvent<UiActionClickPayload>('UiActionClick');
