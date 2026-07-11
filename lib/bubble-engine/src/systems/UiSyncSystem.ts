import type { World } from '../ecs/World.ts';
import { ScreenTransform } from '../components/ui/ScreenAnchor.ts';
import { UiText } from '../components/ui/UiText.ts';
import { UiPanel } from '../components/ui/UiPanel.ts';
import { UiAction } from '../components/ui/UiAction.ts';
import { UiParent } from '../components/ui/UiEffects.ts';
import { UiRenderer } from '../core/resources.ts';
import { estimateTextHeight } from '../ui/layout/textMeasure.ts';
import { measureUiNode } from '../ui/layout/measure.ts';
import { DEFAULT_UI_FONT } from '../ui/layout/textMeasure.ts';

export function runUiSyncSystem(world: World): void {
  if (!world.hasResource(UiRenderer)) return;
  const ui = world.resource(UiRenderer);
  const active = new Set<import('../ecs/Entity.ts').Entity>();

  // パネルを先に、テキストを後に描画（Pixi の sibling 順でテキストが前面に来る）
  for (const [entity, transform, panel] of world.query2(ScreenTransform, UiPanel)) {
    if (transform.visible === false) continue;
    active.add(entity);
    const uiAction = world.get(entity, UiAction);
    ui.syncPanel(
      entity,
      transform.x,
      transform.y,
      panel.width,
      panel.height,
      panel.background,
      uiAction?.action,
      transform.alpha,
    );
  }

  for (const [entity, transform, text] of world.query2(ScreenTransform, UiText)) {
    if (transform.visible === false) continue;
    active.add(entity);
    const fontSize = text.fontSize ?? 16;
    const content = text.text ?? '';
    const { x, y } = resolveTextCenter(world, entity, transform, fontSize);
    ui.syncText(entity, content, x, y, fontSize, text.color, DEFAULT_UI_FONT, transform.alpha);
  }

  ui.pruneEntities?.(active);
}

/** テキストは常にレイアウト枠（または親パネル）の中心に置く */
function resolveTextCenter(
  world: World,
  entity: import('../ecs/Entity.ts').Entity,
  transform: { x: number; y: number },
  fontSize: number,
): { x: number; y: number } {
  const parentLink = world.get(entity, UiParent);
  if (parentLink) {
    const parentPanel = world.get(parentLink.parent, UiPanel);
    const parentTf = world.get(parentLink.parent, ScreenTransform);
    if (parentPanel && parentTf) {
      return {
        x: parentTf.x + parentPanel.width / 2,
        y: parentTf.y + parentPanel.height / 2,
      };
    }
  }

  const size = measureUiNode(world, entity);
  const w = Math.max(size.width, 1);
  const h = Math.max(size.height, estimateTextHeight(fontSize));
  return {
    x: transform.x + w / 2,
    y: transform.y + h / 2,
  };
}
