import type { World } from '../ecs/World.ts';
import { defineResource } from '../ecs/Resource.ts';
import { Transform } from '../components/Transform.ts';
import { Collider, type ColliderShape } from '../components/RigidBody.ts';
import { ScreenTransform, ScreenAnchor } from '../components/ui/ScreenAnchor.ts';
import { GameRenderer, CameraState, Viewport } from '../core/resources.ts';
import { screenToWorld } from '../render/camera.ts';
import type { Vec2 } from '../math/types.ts';

export interface DebugDrawData {
  enabled: boolean;
  showColliders: boolean;
  showUiAnchors: boolean;
}

export const DebugDraw = defineResource<DebugDrawData>('DebugDraw');

const DEBUG_STROKE = { r: 0.2, g: 1, b: 0.4, a: 0.85 };
const UI_ANCHOR_STROKE = { r: 1, g: 0.35, b: 0.9, a: 0.9 };

/** GameRender 後: collider / UI anchor のデバッグ描画 */
export function runDebugDrawSystem(world: World): void {
  if (!world.hasResource(DebugDraw)) return;
  const cfg = world.resource(DebugDraw);
  if (!cfg.enabled) return;

  if (cfg.showColliders && world.hasResource(GameRenderer)) {
    drawColliders(world);
  }
  if (cfg.showUiAnchors && world.hasResource(GameRenderer) && world.hasResource(Viewport)) {
    drawUiAnchors(world);
  }
}

function drawColliders(world: World): void {
  const renderer = world.resource(GameRenderer);
  const style = { stroke: DEBUG_STROKE, lineWidth: 1 };

  for (const [entity, collider] of world.query(Collider)) {
    const transform = world.get(entity, Transform);
    if (!transform) continue;
    const pos = transform._worldPosition ?? transform.position;
    const angle = transform._worldAngle ?? transform.angle;

    for (const shape of collider.shapes) {
      drawColliderShape(renderer, pos, angle, shape, style);
    }
  }
}

function drawColliderShape(
  renderer: import('../render/types.ts').GameRenderBackend,
  pos: Vec2,
  angle: number,
  shape: ColliderShape,
  style: { stroke: typeof DEBUG_STROKE; lineWidth: number },
): void {
  switch (shape.type) {
    case 'circle': {
      const offset = shape.offset ?? { x: 0, y: 0 };
      renderer.drawCircle({ x: pos.x + offset.x, y: pos.y + offset.y }, shape.radius, style);
      break;
    }
    case 'polygon':
      renderer.drawPolygon(pos, angle, shape.vertices, style);
      break;
    case 'edge':
      renderer.drawLine(
        { x: pos.x + shape.a.x, y: pos.y + shape.a.y },
        { x: pos.x + shape.b.x, y: pos.y + shape.b.y },
        style,
      );
      break;
    case 'edgeChain':
      renderer.drawEdgeChain(shape.points.map((p) => ({ x: pos.x + p.x, y: pos.y + p.y })), style);
      break;
  }
}

/** UI anchor をワールド空間の小さな十字で可視化（カメラ投影経由） */
function drawUiAnchors(world: World): void {
  const renderer = world.resource(GameRenderer);
  const viewport = world.resource(Viewport);
  const cam = world.resource(CameraState);
  const style = { stroke: UI_ANCHOR_STROKE, lineWidth: 1 };
  const size = 6 / cam.zoom;

  for (const [entity, transform, anchor] of world.query2(ScreenTransform, ScreenAnchor)) {
    void anchor;
    void entity;
    const worldPt = screenToWorld({ x: transform.x, y: transform.y }, cam, viewport);
    renderer.drawLine(
      { x: worldPt.x - size, y: worldPt.y },
      { x: worldPt.x + size, y: worldPt.y },
      style,
    );
    renderer.drawLine(
      { x: worldPt.x, y: worldPt.y - size },
      { x: worldPt.x, y: worldPt.y + size },
      style,
    );
  }
}
