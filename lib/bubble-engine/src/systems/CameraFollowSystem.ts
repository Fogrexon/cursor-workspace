import type { World } from '../ecs/World.ts';
import { Camera } from '../components/Camera.ts';
import { Transform } from '../components/Transform.ts';
import { ActiveCamera, CameraState } from '../core/resources.ts';

export function runCameraFollowSystem(world: World): void {
  if (!world.hasResource(ActiveCamera)) return;
  const camEntity = world.resource(ActiveCamera);
  if (camEntity === null) return;
  const cam = world.get(camEntity, Camera);
  if (!cam) return;

  if (cam.target !== undefined) {
    const target = world.get(cam.target, Transform);
    if (target) {
      const pos = target._worldPosition ?? target.position;
      const goal = {
        x: pos.x + (cam.offset?.x ?? 0),
        y: pos.y + (cam.offset?.y ?? 0),
      };
      const t = cam.smoothing ?? 1;
      cam.position = {
        x: cam.position.x + (goal.x - cam.position.x) * t,
        y: cam.position.y + (goal.y - cam.position.y) * t,
      };
    }
  }

  if (world.hasResource(CameraState)) {
    const state = world.resource(CameraState);
    state.position = { ...cam.position };
    state.zoom = cam.zoom;
  }
}
