import type { Entity } from '../../ecs/Entity.ts';
import type { World } from '../../ecs/World.ts';
import { UiLayout, UiLayoutChild, type UiLayoutData } from '../../components/ui/UiLayout.ts';
import { UiPanel } from '../../components/ui/UiPanel.ts';
import { UiText } from '../../components/ui/UiText.ts';
import { UiButton } from '../../components/ui/UiButton.ts';
import { UiParent } from '../../components/ui/UiEffects.ts';
import { estimateTextHeight, estimateTextWidth } from './textMeasure.ts';

export interface Size {
  width: number;
  height: number;
}

function getUiChildren(world: World, parent: Entity): Entity[] {
  const children: Entity[] = [];
  for (const [entity, link] of world.query(UiParent)) {
    if (link.parent === parent) children.push(entity);
  }
  return children;
}

function normalizePadding(
  padding: number | { top: number; right: number; bottom: number; left: number } | undefined,
): { top: number; right: number; bottom: number; left: number } {
  if (padding === undefined) return { top: 0, right: 0, bottom: 0, left: 0 };
  if (typeof padding === 'number') {
    return { top: padding, right: padding, bottom: padding, left: padding };
  }
  return padding;
}

function measureLayoutChildren(
  world: World,
  layout: UiLayoutData,
  children: Entity[],
): Size {
  if (children.length === 0) return { width: 0, height: 0 };
  const padding = normalizePadding(layout.padding);
  const gap = layout.gap ?? 0;
  const childSizes = children.map((child) => measureUiNode(world, child));

  if (layout.mode === 'row') {
    const width =
      childSizes.reduce((sum, s) => sum + s.width, 0) +
      gap * Math.max(0, children.length - 1) +
      padding.left +
      padding.right;
    const height =
      Math.max(...childSizes.map((s) => s.height)) + padding.top + padding.bottom;
    return { width, height };
  }

  const width =
    Math.max(...childSizes.map((s) => s.width)) + padding.left + padding.right;
  const height =
    childSizes.reduce((sum, s) => sum + s.height, 0) +
    gap * Math.max(0, children.length - 1) +
    padding.top +
    padding.bottom;
  return { width, height };
}

export function measureUiNode(world: World, entity: Entity): Size {
  const panel = world.get(entity, UiPanel);
  const button = world.get(entity, UiButton);
  const text = world.get(entity, UiText);
  const layoutChild = world.get(entity, UiLayoutChild);
  const children = getUiChildren(world, entity);
  // layout 未指定でも children があれば column として扱う（配置漏れ防止）
  const layout =
    world.get(entity, UiLayout) ?? (children.length > 0 ? { mode: 'column' as const } : undefined);

  let size: Size;
  if (layout && children.length > 0) {
    const fromLayout = measureLayoutChildren(world, layout, children);
    if (panel) {
      size = {
        width: Math.max(panel.width, fromLayout.width),
        height: Math.max(panel.height, fromLayout.height),
      };
    } else {
      size = fromLayout;
    }
  } else if (panel) {
    size = { width: panel.width, height: panel.height };
  } else if (button) {
    size = { width: button.width, height: button.height };
  } else if (text) {
    const fontSize = text.fontSize ?? 16;
    const content = text.text ?? '';
    size = {
      width: estimateTextWidth(content, fontSize),
      height: estimateTextHeight(fontSize),
    };
  } else {
    size = { width: 0, height: 0 };
  }

  if (layoutChild?.minWidth !== undefined) {
    size = { ...size, width: Math.max(size.width, layoutChild.minWidth) };
  }
  if (layoutChild?.minHeight !== undefined) {
    size = { ...size, height: Math.max(size.height, layoutChild.minHeight) };
  }
  return size;
}

export { getUiChildren, normalizePadding };
