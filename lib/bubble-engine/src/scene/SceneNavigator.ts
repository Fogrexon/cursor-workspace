import type { World } from '../ecs/World.ts';
import type { SceneManager } from './SceneManager.ts';
import type { SceneRegistry } from './SceneRegistry.ts';
import { SceneNavigate, type SceneNavigateRequest } from './SceneNavigate.ts';

export class SceneNavigator {
  private readonly unsubscribe: () => void;

  constructor(
    world: World,
    private readonly scenes: SceneManager,
    private readonly registry: SceneRegistry,
  ) {
    this.unsubscribe = world.events.on(SceneNavigate, (req) => this.handle(req));
  }

  dispose(): void {
    this.unsubscribe();
  }

  execute(requests: SceneNavigateRequest | readonly SceneNavigateRequest[]): void {
    const list = Array.isArray(requests) ? requests : [requests];
    for (const req of list) this.handle(req);
  }

  private handle(req: SceneNavigateRequest): void {
    if (req.op === 'unload') {
      this.scenes.unloadById(req.sceneId);
      return;
    }
    const scene = this.registry.create(req.sceneId);
    this.scenes.load(scene, { mode: req.mode, persistent: req.persistent });
  }
}
