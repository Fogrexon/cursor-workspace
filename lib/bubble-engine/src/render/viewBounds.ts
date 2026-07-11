import type { Vec2 } from '../math/types.ts';
import { screenToWorld } from './camera.ts';
import type { CameraStateResource, ViewportData } from '../core/resources.ts';

export interface ViewCamera {
  position: Vec2;
  zoom: number;
}

export interface ViewSize {
  width: number;
  height: number;
}

/** ワールド座標がカメラの表示範囲外か */
export function isOutsideView(
  worldPos: Vec2,
  camera: ViewCamera | CameraStateResource,
  view: ViewSize | ViewportData,
  marginWorld = 0.4,
): boolean {
  const topLeft = screenToWorld({ x: 0, y: 0 }, camera, view);
  const bottomRight = screenToWorld({ x: view.width, y: view.height }, camera, view);
  const minX = Math.min(topLeft.x, bottomRight.x) - marginWorld;
  const maxX = Math.max(topLeft.x, bottomRight.x) + marginWorld;
  const minY = Math.min(topLeft.y, bottomRight.y) - marginWorld;
  const maxY = Math.max(topLeft.y, bottomRight.y) + marginWorld;
  return worldPos.x < minX || worldPos.x > maxX || worldPos.y < minY || worldPos.y > maxY;
}
