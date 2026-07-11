import type { Entity } from '../ecs/Entity.ts';
import type { World } from '../ecs/World.ts';
import { SceneScope } from '../components/SceneScope.ts';
import { ScreenAnchor } from '../components/ui/ScreenAnchor.ts';
import { ScreenTransform } from '../components/ui/ScreenAnchor.ts';
import { UiLayout, UiLayoutChild } from '../components/ui/UiLayout.ts';
import { UiPanel } from '../components/ui/UiPanel.ts';
import { UiText } from '../components/ui/UiText.ts';
import { UiButton } from '../components/ui/UiButton.ts';
import { UiEffects, UiBind, UiParent } from '../components/ui/UiEffects.ts';
import { UiAction } from '../components/ui/UiAction.ts';
import type { UiDefinition } from './defineUi.ts';
import type { UiNodeDef } from './UiDefinition.ts';
import { expandUiNode } from './expandUiNode.ts';

export interface UiHandle {
  readonly id: string;
  readonly root: Entity;
  readonly entities: readonly Entity[];
  get(name: string): Entity;
  readonly names: readonly string[];
}

function buildNode(
  world: World,
  node: UiNodeDef,
  parent: Entity | null,
  names: Map<string, Entity>,
  entities: Entity[],
  sceneId?: string,
): Entity {
  const normalized = expandUiNode(node);
  const builder = world.spawn();
  if (normalized.scope) builder.with(SceneScope, { scope: normalized.scope, sceneId });
  else if (sceneId) builder.with(SceneScope, { sceneId });
  if (normalized.anchor) builder.with(ScreenAnchor, normalized.anchor);
  builder.with(ScreenTransform, { x: 0, y: 0, visible: normalized.visible ?? true });
  if (normalized.layout) builder.with(UiLayout, normalized.layout);
  if (normalized.layoutChild) builder.with(UiLayoutChild, normalized.layoutChild);
  if (normalized.panel) builder.with(UiPanel, normalized.panel);
  if (normalized.text) {
    builder.with(UiText, { ...normalized.text });
    if (normalized.text.bind) builder.with(UiBind, { key: normalized.text.bind });
  }
  if (normalized.uiButton) builder.with(UiButton, normalized.uiButton);
  if (normalized.action) builder.with(UiAction, { action: normalized.action });
  if (normalized.effects) builder.with(UiEffects, normalized.effects);
  const entity = builder.build();
  entities.push(entity);
  if (parent !== null) world.add(entity, UiParent, { parent });
  if (normalized.name) names.set(normalized.name, entity);
  for (const child of normalized.children ?? []) {
    buildNode(world, child, entity, names, entities, sceneId);
  }
  return entity;
}

export function mountUi(world: World, def: UiDefinition, sceneId?: string): UiHandle {
  const names = new Map<string, Entity>();
  const entities: Entity[] = [];
  const root = buildNode(world, expandUiNode(def.root), null, names, entities, sceneId);
  return {
    id: def.id,
    root,
    entities,
    get(name: string): Entity {
      const e = names.get(name);
      if (!e) throw new Error(`UI node not found: ${name}`);
      return e;
    },
    names: [...names.keys()],
  };
}

export function unmountUi(_world: World, _handle: UiHandle): void {
  // SceneContext / SceneManager が所有権で despawn する
}
