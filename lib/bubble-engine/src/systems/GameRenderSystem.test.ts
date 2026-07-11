import { describe, expect, it, beforeEach } from 'vitest';
import { World } from '../ecs/World.ts';
import { Transform } from '../components/Transform.ts';
import { RenderShape } from '../components/RenderShape.ts';
import { CameraState, GameRenderer } from '../core/resources.ts';
import { RecordingGameRenderer } from '../render/RecordingGameRenderer.ts';
import { runHierarchySystem } from './HierarchySystem.ts';
import { runGameRenderSystem } from './GameRenderSystem.ts';
import { resetEntityIds } from '../ecs/Entity.ts';

describe('GameRenderSystem', () => {
  beforeEach(() => resetEntityIds());

  it('_worldPosition + RenderShape circle を RecordingGameRenderer に記録する', () => {
    const world = new World();
    const renderer = new RecordingGameRenderer();
    world.insertResource(GameRenderer, renderer);
    world.insertResource(CameraState, { position: { x: 0, y: 0 }, zoom: 34 });

    world
      .spawn()
      .with(Transform, { position: { x: 2, y: 3 }, angle: 0 })
      .with(RenderShape, { kind: 'circle', radius: 0.5, fill: { r: 1, g: 0, b: 0, a: 1 } })
      .build();

    runHierarchySystem(world);
    runGameRenderSystem(world);

    const draw = renderer.calls.find((c) => c.type === 'drawCircle');
    expect(draw).toBeDefined();
    expect(draw).toMatchObject({
      type: 'drawCircle',
      worldPos: { x: 2, y: 3 },
      radius: 0.5,
    });
    expect(renderer.calls.some((c) => c.type === 'clearWorld')).toBe(true);
  });
});
