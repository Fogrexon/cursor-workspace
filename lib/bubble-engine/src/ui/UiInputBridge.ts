import type { Entity } from '../ecs/Entity.ts';
import type { World } from '../ecs/World.ts';
import type { UiRenderBackend } from '../render/uiTypes.ts';
import { UiActionClick } from './events.ts';

interface UiActionClickHost extends UiRenderBackend {
  setActionClickHandler(handler: (entity: Entity, action: string) => void): void;
}

/** Pixi UI の pointertap を UiActionClick イベントへ接続 */
export function wirePixiUiActions(world: World, ui: UiRenderBackend): void {
  const host = ui as UiActionClickHost;
  if (typeof host.setActionClickHandler !== 'function') return;
  host.setActionClickHandler((entity, action) => {
    world.events.emit(UiActionClick, { entity, action });
  });
}
