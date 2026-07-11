import { defineResource } from '../ecs/Resource.ts';
import type { PlanckPhysicsAdapter } from '../physics/PlanckAdapter.ts';
import type { GameRenderBackend } from '../render/types.ts';
import type { UiRenderBackend } from '../render/uiTypes.ts';
import type { Entity } from '../ecs/Entity.ts';
import type { Vec2 } from '../math/types.ts';

export interface ViewportData {
  width: number;
  height: number;
}

export const Viewport = defineResource<ViewportData>('Viewport');
export const PhysicsWorld = defineResource<PlanckPhysicsAdapter>('PhysicsWorld');
export const GameRenderer = defineResource<GameRenderBackend>('GameRenderer');
export const UiRenderer = defineResource<UiRenderBackend>('UiRenderer');
export const ActiveCamera = defineResource<Entity | null>('ActiveCamera');

export interface CameraStateResource {
  position: Vec2;
  zoom: number;
}

export const CameraState = defineResource<CameraStateResource>('CameraState');

import type { PointerInput } from '../scene/PointerInput.ts';

/** ポインタ入力の共有状態（UI キャプチャ・キュー） */
export interface InputStateData {
  uiPointerCapture: boolean;
  /** ワールド pointerdown 後、pointerup まで true */
  worldPointerActive: boolean;
  pointerQueue: PointerInput[];
  /** BubbleEngine.bindCanvas が設定 */
  dispatchPointer?: (input: PointerInput) => boolean;
  isUiHit?: (screenX: number, screenY: number) => boolean;
}

export const InputState = defineResource<InputStateData>('InputState');
