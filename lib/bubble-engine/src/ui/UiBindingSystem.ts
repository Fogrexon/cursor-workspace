import type { ResourceType } from '../ecs/Resource.ts';
import type { World } from '../ecs/World.ts';
import { UiBind } from '../components/ui/UiEffects.ts';
import { UiText } from '../components/ui/UiText.ts';

export interface UiBindDef<T> {
  resource: ResourceType<T>;
  select: (value: T) => unknown;
  format?: (value: unknown) => string;
}

const registry = new WeakMap<World, Map<string, UiBindDef<unknown>>>();

function getRegistry(world: World): Map<string, UiBindDef<unknown>> {
  let map = registry.get(world);
  if (!map) {
    map = new Map();
    registry.set(world, map);
  }
  return map;
}

export function bindUiRegistry<T>(world: World, key: string, def: UiBindDef<T>): void {
  getRegistry(world).set(key, def as UiBindDef<unknown>);
}

export function unbindUiRegistry(world: World, key: string): void {
  registry.get(world)?.delete(key);
}

export function runUiBindingSystem(world: World): void {
  const map = registry.get(world);
  if (!map) return;
  for (const [entity, bind] of world.query(UiBind)) {
    const def = map.get(bind.key);
    if (!def) continue;
    const raw = def.select(world.resource(def.resource));
    const text = def.format ? def.format(raw) : String(raw);
    const uiText = world.get(entity, UiText);
    if (uiText && uiText.text !== text) {
      uiText.text = text;
    }
  }
}
