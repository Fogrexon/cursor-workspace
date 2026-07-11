import { describe, expect, it, beforeEach } from 'vitest';
import { World } from '../ecs/World.ts';
import { Scheduler } from '../core/Scheduler.ts';
import { SceneManager } from './SceneManager.ts';
import { SceneRegistry } from './SceneRegistry.ts';
import { SceneNavigator } from './SceneNavigator.ts';
import type { Scene, SceneContext } from './SceneContext.ts';
import { resetEntityIds } from '../ecs/Entity.ts';

class StubScene implements Scene {
  constructor(readonly id: string) {}
  setup(_ctx: SceneContext): void {}
  teardown(_ctx: SceneContext): void {}
}

describe('SceneNavigator', () => {
  beforeEach(() => resetEntityIds());

  it('load / unload を処理する', () => {
    const world = new World();
    const scenes = new SceneManager(world, new Scheduler());
    const registry = new SceneRegistry().register('a', () => new StubScene('a'));
    const nav = new SceneNavigator(world, scenes, registry);

    nav.execute({ op: 'load', sceneId: 'a', mode: 'single' });
    expect(scenes.isLoaded('a')).toBe(true);

    nav.execute({ op: 'unload', sceneId: 'a' });
    expect(scenes.isLoaded('a')).toBe(false);

    nav.dispose();
  });

  it('execute で複数リクエストを順に適用', () => {
    const world = new World();
    const scenes = new SceneManager(world, new Scheduler());
    const registry = new SceneRegistry()
      .register('a', () => new StubScene('a'))
      .register('b', () => new StubScene('b'));
    const nav = new SceneNavigator(world, scenes, registry);

    nav.execute([
      { op: 'load', sceneId: 'a', mode: 'additive' },
      { op: 'load', sceneId: 'b', mode: 'single' },
    ]);
    expect(scenes.isLoaded('a')).toBe(false);
    expect(scenes.isLoaded('b')).toBe(true);
  });
});
