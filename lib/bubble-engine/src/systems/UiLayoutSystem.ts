import type { World } from '../ecs/World.ts';
import type { Entity } from '../ecs/Entity.ts';
import { ScreenAnchor, ScreenTransform } from '../components/ui/ScreenAnchor.ts';
import { UiLayout, UiLayoutChild } from '../components/ui/UiLayout.ts';
import { UiPanel } from '../components/ui/UiPanel.ts';
import { UiParent } from '../components/ui/UiEffects.ts';
import { Viewport } from '../core/resources.ts';
import { flexLayoutRow, flexLayoutColumn } from '../ui/layout/flexLayout.ts';
import { resolveScreenAnchor } from '../ui/layout/anchor.ts';
import {
  getUiChildren,
  measureUiNode,
  normalizePadding,
} from '../ui/layout/measure.ts';

function findUiRoots(world: World): Entity[] {
  const roots: Entity[] = [];
  for (const [entity] of world.query(ScreenAnchor)) {
    if (!world.has(entity, UiParent)) roots.push(entity);
  }
  return roots;
}

function layoutChildren(
  world: World,
  parent: Entity,
  screenX: number,
  screenY: number,
): void {
  const layout = world.get(parent, UiLayout);
  const children = getUiChildren(world, parent);
  if (!layout || children.length === 0) return;

  const padding = normalizePadding(layout.padding);
  const childSizes = children.map((child) => ({
    entity: child,
    ...measureUiNode(world, child),
    layoutChild: world.get(child, UiLayoutChild) ?? {},
  }));

  const panel = world.get(parent, UiPanel);
  const measuredW = Math.max(...childSizes.map((c) => c.width), 0);
  const measuredH = Math.max(...childSizes.map((c) => c.height), 0);
  const contentWidth = panel?.width ?? measuredW;
  const contentHeight = panel?.height ?? measuredH;

  const boxes =
    layout.mode === 'column'
      ? flexLayoutColumn({
          contentWidth,
          contentHeight,
          gap: layout.gap ?? 0,
          padding,
          align: layout.align ?? 'start',
          justify: layout.justify ?? 'start',
          children: childSizes.map((c) => ({
            width: c.width,
            height: c.height,
            layoutChild: c.layoutChild,
          })),
        })
      : flexLayoutRow({
          contentWidth,
          contentHeight,
          gap: layout.gap ?? 0,
          padding,
          align: layout.align ?? 'start',
          justify: layout.justify ?? 'start',
          children: childSizes.map((c) => ({
            width: c.width,
            height: c.height,
            layoutChild: c.layoutChild,
          })),
        });

  for (let i = 0; i < children.length; i++) {
    const child = children[i]!;
    const box = boxes[i]!;
    applyScreenTransform(world, child, screenX + box.x, screenY + box.y);
    layoutChildren(world, child, screenX + box.x, screenY + box.y);
  }
}

function applyScreenTransform(world: World, entity: Entity, x: number, y: number): void {
  const st = world.get(entity, ScreenTransform);
  if (!st) return;
  st.x = x;
  st.y = y;
  st._layoutComputed = true;
}

export function runUiLayoutSystem(world: World): void {
  const viewport = world.resource(Viewport);
  for (const root of findUiRoots(world)) {
    const size = measureUiNode(world, root);
    const anchor = world.get(root, ScreenAnchor)!;
    const { x, y } = resolveScreenAnchor(anchor, viewport, size.width, size.height);
    applyScreenTransform(world, root, x, y);
    layoutChildren(world, root, x, y);
  }
}
