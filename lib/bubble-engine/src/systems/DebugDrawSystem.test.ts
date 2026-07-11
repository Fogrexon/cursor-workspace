import { beforeEach, describe, expect, it } from 'vitest';
import { World } from '../ecs/World.ts';
import { resetEntityIds } from '../ecs/Entity.ts';
import { Transform } from '../components/Transform.ts';
import { Collider } from '../components/RigidBody.ts';
import { DebugDraw, runDebugDrawSystem } from './DebugDrawSystem.ts';
import { RecordingGameRenderer } from '../render/RecordingGameRenderer.ts';
import { GameRenderer } from '../core/resources.ts';

describe('DebugDrawSystem', () => {
  beforeEach(() => resetEntityIds());

  it('showColliders 時に Collider を wireframe 描画する', () => {
    const world = new World();
    const renderer = new RecordingGameRenderer();
    world.insertResource(GameRenderer, renderer);
    world.insertResource(DebugDraw, { enabled: true, showColliders: true, showUiAnchors: false });

    world
      .spawn()
      .with(Transform, { position: { x: 1, y: 2 }, angle: 0 })
      .with(Collider, {
        shapes: [{ type: 'circle', radius: 0.5 }],
      })
      .build();

    runDebugDrawSystem(world);

    const circles = renderer.calls.filter((c) => c.type === 'drawCircle');
    expect(circles).toHaveLength(1);
    expect(circles[0]).toMatchObject({
      type: 'drawCircle',
      worldPos: { x: 1, y: 2 },
      radius: 0.5,
    });
  });

  it('enabled=false では描画しない', () => {
    const world = new World();
    const renderer = new RecordingGameRenderer();
    world.insertResource(GameRenderer, renderer);
    world.insertResource(DebugDraw, { enabled: false, showColliders: true, showUiAnchors: false });

    world
      .spawn()
      .with(Transform, { position: { x: 0, y: 0 }, angle: 0 })
      .with(Collider, { shapes: [{ type: 'circle', radius: 1 }] })
      .build();

    runDebugDrawSystem(world);

    expect(renderer.calls.filter((c) => c.type === 'drawCircle')).toHaveLength(0);
  });
});
