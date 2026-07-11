import type { Entity } from '../ecs/Entity.ts';
import type { RgbaColor } from '../math/types.ts';

export interface UiRenderBackend {
  syncText(
    entity: Entity,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color?: RgbaColor,
    fontFamily?: string,
    alpha?: number,
  ): void;
  syncPanel(
    entity: Entity,
    x: number,
    y: number,
    width: number,
    height: number,
    background?: RgbaColor,
    action?: string,
    alpha?: number,
  ): void;
  getText(entity: Entity): string | undefined;
  getPosition(entity: Entity): { x: number; y: number } | undefined;
  /** Pixi 上の UI クリックを ECS イベントへ橋渡し */
  setActionClickHandler?(handler: (entity: Entity, action: string) => void): void;
  /** 任意: 非表示になった Entity の描画キャッシュを掃除 */
  pruneEntities?(active: ReadonlySet<Entity>): void;
}
