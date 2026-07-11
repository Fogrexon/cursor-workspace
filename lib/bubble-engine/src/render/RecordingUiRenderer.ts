import type { Entity } from '../ecs/Entity.ts';
import type { RgbaColor } from '../math/types.ts';
import type { UiRenderBackend } from './uiTypes.ts';

export class RecordingUiRenderer implements UiRenderBackend {
  private readonly texts = new Map<
    Entity,
    { text: string; x: number; y: number; fontSize: number; fontFamily?: string; alpha?: number }
  >();
  private readonly panels = new Map<
    Entity,
    { x: number; y: number; width: number; height: number; background?: RgbaColor; alpha?: number }
  >();

  syncText(
    entity: Entity,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color?: RgbaColor,
    fontFamily?: string,
    alpha?: number,
  ): void {
    this.texts.set(entity, { text, x, y, fontSize, fontFamily, alpha });
  }

  syncPanel(
    entity: Entity,
    x: number,
    y: number,
    width: number,
    height: number,
    background?: RgbaColor,
    _action?: string,
    alpha?: number,
  ): void {
    this.panels.set(entity, { x, y, width, height, background, alpha });
  }

  pruneEntities(active: ReadonlySet<Entity>): void {
    for (const [entity] of this.texts) {
      if (!active.has(entity)) this.texts.delete(entity);
    }
    for (const [entity] of this.panels) {
      if (!active.has(entity)) this.panels.delete(entity);
    }
  }

  getText(entity: Entity): string | undefined {
    return this.texts.get(entity)?.text;
  }

  getPosition(entity: Entity): { x: number; y: number } | undefined {
    const t = this.texts.get(entity);
    if (t) return { x: t.x, y: t.y };
    const p = this.panels.get(entity);
    if (p) return { x: p.x, y: p.y };
    return undefined;
  }
}
