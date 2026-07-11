import type { World } from '../ecs/World.ts';
import type { Scene } from './SceneContext.ts';
import { SceneContext } from './SceneContext.ts';
import type { UiHandle } from '../ui/mountUi.ts';
import type { Scheduler } from '../core/Scheduler.ts';
import type { PointerInput } from './PointerInput.ts';

export interface LoadSceneOptions {
  mode: 'single' | 'additive';
  persistent?: boolean;
}

export interface SceneInstance {
  readonly id: string;
  readonly mode: 'single' | 'additive';
  readonly persistent: boolean;
  readonly handle: symbol;
}

interface LoadedScene {
  instance: SceneInstance;
  scene: Scene;
  ctx: SceneContext;
}

export class SceneManager {
  private readonly loaded: LoadedScene[] = [];
  private readonly uiHandlesByScene = new Map<string, UiHandle>();
  private handleCounter = 0;

  constructor(
    private readonly world: World,
    private readonly scheduler: Scheduler,
  ) {}

  get active(): readonly SceneInstance[] {
    return this.loaded.map((entry) => entry.instance);
  }

  load(scene: Scene, options: LoadSceneOptions): SceneInstance {
    // 同 ID が既にロード済みなら入れ替え（リトライ時の HUD 二重マウント防止）
    if (this.isLoaded(scene.id)) {
      this.unloadById(scene.id);
    }
    if (options.mode === 'single') {
      for (const entry of [...this.loaded]) {
        if (!entry.instance.persistent) this.unload(entry.instance);
      }
    }
    const handle = Symbol(`scene-${scene.id}-${this.handleCounter++}`);
    const ctx = new SceneContext(this.world, this.scheduler, scene.id);
    scene.setup(ctx);
    const instance: SceneInstance = {
      id: scene.id,
      mode: options.mode,
      persistent: options.persistent ?? false,
      handle,
    };
    this.loaded.push({ instance, scene, ctx });
    const uiHandle = ctx.getPrimaryUiHandle();
    if (uiHandle) this.uiHandlesByScene.set(scene.id, uiHandle);
    return instance;
  }

  unload(instance: SceneInstance | symbol): void {
    const handle = typeof instance === 'symbol' ? instance : instance.handle;
    const idx = this.loaded.findIndex((entry) => entry.instance.handle === handle);
    if (idx < 0) return;
    const entry = this.loaded[idx]!;
    entry.scene.teardown(entry.ctx);
    entry.ctx.despawnAll();
    this.loaded.splice(idx, 1);
    this.uiHandlesByScene.delete(entry.instance.id);
  }

  unloadById(sceneId: string): void {
    const entry = this.loaded.find((item) => item.instance.id === sceneId);
    if (entry) this.unload(entry.instance);
  }

  isLoaded(sceneId: string): boolean {
    return this.loaded.some((entry) => entry.instance.id === sceneId);
  }

  getUiHandle(sceneId: string): UiHandle | undefined {
    return this.uiHandlesByScene.get(sceneId);
  }

  /** ロード済みシーンの update を呼ぶ（GameApp から 1 回） */
  update(dt: number): void {
    for (const entry of this.loaded) {
      entry.scene.update?.(entry.ctx, dt);
    }
  }

  /** 後ろから順に onPointer。true なら入力消費 */
  dispatchPointer(input: PointerInput): boolean {
    for (let i = this.loaded.length - 1; i >= 0; i--) {
      const entry = this.loaded[i]!;
      if (entry.scene.onPointer?.(entry.ctx, input)) return true;
    }
    return false;
  }
}
