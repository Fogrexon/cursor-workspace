import type { World } from '../ecs/World.ts';
import { Transform } from '../components/Transform.ts';
import { RenderShape } from '../components/RenderShape.ts';
import { CameraState, GameRenderer } from '../core/resources.ts';

export function runGameRenderSystem(world: World): void {
  const renderer = world.resource(GameRenderer);
  const camera = world.resource(CameraState);
  renderer.clearWorld();
  renderer.setCamera(camera);

  for (const [entity, shape] of world.query(RenderShape)) {
    const transform = world.get(entity, Transform);
    if (!transform) continue;
    const pos = transform._worldPosition ?? transform.position;
    const angle = transform._worldAngle ?? transform.angle;
    const style = {
      fill: 'fill' in shape ? shape.fill : undefined,
      stroke: 'stroke' in shape ? shape.stroke : undefined,
      lineWidth: 'lineWidth' in shape ? shape.lineWidth : undefined,
    };

    switch (shape.kind) {
      case 'circle':
        renderer.drawCircle(pos, shape.radius, style);
        break;
      case 'ellipse':
        renderer.drawEllipse(pos, shape.radiusX, shape.radiusY, angle, style);
        break;
      case 'polygon':
        renderer.drawPolygon(pos, angle, shape.vertices, style);
        break;
      case 'edgeChain':
        renderer.drawEdgeChain(shape.points, style);
        break;
      case 'line':
        if (!shape.hidden) renderer.drawLine(shape.a, shape.b, style);
        break;
    }
  }
}
