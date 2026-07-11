import type { Scene } from './SceneContext.ts';

export type SceneFactory = () => Scene;

/** sceneId → Scene ファクトリ */
export class SceneRegistry {
  private readonly factories = new Map<string, SceneFactory>();

  register(sceneId: string, factory: SceneFactory): this {
    this.factories.set(sceneId, factory);
    return this;
  }

  create(sceneId: string): Scene {
    const factory = this.factories.get(sceneId);
    if (!factory) throw new Error(`Scene not registered: ${sceneId}`);
    return factory();
  }

  has(sceneId: string): boolean {
    return this.factories.has(sceneId);
  }
}
