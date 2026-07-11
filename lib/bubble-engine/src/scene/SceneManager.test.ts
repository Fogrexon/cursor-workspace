import { describe, expect, it, beforeEach } from 'vitest';
import { SceneManager } from './SceneManager.ts';
import { World } from '../ecs/World.ts';
import { Scheduler } from '../core/Scheduler.ts';
import { defineComponent } from '../ecs/Component.ts';
import type { Scene, SceneContext } from './Scene.ts';
import { resetEntityIds } from '../ecs/Entity.ts';

const Marker = defineComponent<{ tag: string }>('Marker');

class TempScene implements Scene {
  readonly id: string;
  spawned: number[] = [];
  constructor(id: string) {
    this.id = id;
  }
  setup(ctx: SceneContext): void {
    const e = ctx.spawn().with(Marker, { tag: this.id }).build();
    this.spawned.push(e as number);
  }
  teardown(_ctx: SceneContext): void {}
}

class PersistentScene implements Scene {
  readonly id = 'persistent';
  setup(ctx: SceneContext): void {
    ctx.spawn().with(Marker, { tag: 'persistent' }).build();
  }
  teardown(_ctx: SceneContext): void {}
}

describe('SceneManager', () => {
  beforeEach(() => resetEntityIds());

  it('single load で non-persistent のみ unload し persistent は残る', () => {
    const world = new World();
    const mgr = new SceneManager(world, new Scheduler());
    mgr.load(new PersistentScene(), { mode: 'additive', persistent: true });
    mgr.load(new TempScene('game1'), { mode: 'single' });
    expect(mgr.isLoaded('persistent')).toBe(true);
    expect(mgr.isLoaded('game1')).toBe(true);

    mgr.load(new TempScene('game2'), { mode: 'single' });
    expect(mgr.isLoaded('game1')).toBe(false);
    expect(mgr.isLoaded('game2')).toBe(true);
    expect(mgr.isLoaded('persistent')).toBe(true);
  });

  it('update がロード済みシーンへ dt を渡す', () => {
    let dt = 0;
    class TickScene implements Scene {
      readonly id = 'tick';
      setup(_ctx: SceneContext): void {}
      teardown(_ctx: SceneContext): void {}
      update(_ctx: SceneContext, frameDt: number): void {
        dt = frameDt;
      }
    }
    const mgr = new SceneManager(new World(), new Scheduler());
    mgr.load(new TickScene(), { mode: 'single' });
    mgr.update(0.016);
    expect(dt).toBeCloseTo(0.016);
  });

  it('同 ID を再 load すると旧シーンを unload する', () => {
    const world = new World();
    const mgr = new SceneManager(world, new Scheduler());
    const first = new TempScene('hud');
    mgr.load(first, { mode: 'additive', persistent: true });
    mgr.load(new TempScene('hud'), { mode: 'additive', persistent: true });
    expect(mgr.active.filter((s) => s.id === 'hud')).toHaveLength(1);
    expect(world.get(first.spawned[0]! as never, Marker)).toBeUndefined();
  });
});
