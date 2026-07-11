import type { Vec2 } from '../math/types.ts';

export interface CameraState {
  position: Vec2;
  zoom: number;
}

export interface ViewSize {
  width: number;
  height: number;
}

export function worldToScreen(
  world: Vec2,
  camera: CameraState,
  view: ViewSize,
): Vec2 {
  return {
    x: (world.x - camera.position.x) * camera.zoom + view.width / 2,
    y: view.height / 2 - (world.y - camera.position.y) * camera.zoom,
  };
}

export function screenToWorld(
  screen: Vec2,
  camera: CameraState,
  view: ViewSize,
): Vec2 {
  return {
    x: (screen.x - view.width / 2) / camera.zoom + camera.position.x,
    y: camera.position.y - (screen.y - view.height / 2) / camera.zoom,
  };
}
