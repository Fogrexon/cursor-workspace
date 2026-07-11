import type { ResourceType } from '../ecs/Resource.ts';
import type { Entity } from '../ecs/Entity.ts';
import type { World } from '../ecs/World.ts';
import { EntityBuilder } from '../ecs/EntityBuilder.ts';
import type { UiDefinition } from '../ui/defineUi.ts';
import { mountUi, type UiHandle } from '../ui/mountUi.ts';
import type { UiBindDef } from '../ui/UiBindingSystem.ts';
import { bindUiRegistry, unbindUiRegistry } from '../ui/UiBindingSystem.ts';
import type { Scheduler } from '../core/Scheduler.ts';
import type { SystemDef } from '../core/types.ts';
import { UiActionClick } from '../ui/events.ts';
import { SceneNavigate, type SceneNavigateRequest } from './SceneNavigate.ts';
import { SceneScope } from '../components/SceneScope.ts';

export interface Scene {
  readonly id: string;
  setup(ctx: SceneContext): void;
  teardown(ctx: SceneContext): void;
  /** シーン固有の毎フレーム更新（レベル進行・演出など） */
  update?(ctx: SceneContext, dt: number): void;
  /** ワールド入力（スリング操作など）。true で消費 */
  onPointer?(ctx: SceneContext, input: PointerInput): boolean;
}

export class SceneContext {
  private readonly entities: Entity[] = [];
  private readonly uiHandles: UiHandle[] = [];
  private readonly sceneResources: ResourceType<unknown>[] = [];
  private readonly bindKeys: string[] = [];
  private readonly disposers: Array<() => void> = [];
  private readonly systemNames: string[] = [];

  constructor(
    readonly world: World,
    private readonly scheduler: Scheduler,
    readonly sceneId: string,
  ) {}

  spawn(): EntityBuilder {
    const builder = this.world.spawn();
    builder.with(SceneScope, { sceneId: this.sceneId });
    const originalBuild = builder.build.bind(builder);
    builder.build = () => {
      const e = originalBuild();
      this.entities.push(e);
      return e;
    };
    return builder;
  }

  mountUi(def: UiDefinition): UiHandle {
    const handle = mountUi(this.world, def, this.sceneId);
    this.uiHandles.push(handle);
    for (const entity of handle.entities) {
      this.entities.push(entity);
    }
    return handle;
  }

  bindUi<T>(key: string, def: UiBindDef<T>): void {
    bindUiRegistry(this.world, key, def);
    this.bindKeys.push(key);
  }

  insertSceneResource<T>(type: ResourceType<T>, value: T): void {
    this.world.insertResource(type, value);
    this.sceneResources.push(type as ResourceType<unknown>);
  }

  /** シーン存続中だけ有効な ECS システムを登録（teardown で自動解除） */
  registerSystem(system: SystemDef): void {
    this.scheduler.register(system);
    this.systemNames.push(system.name);
  }

  /** defineUi の action と Pixi クリックを結びつける */
  onUiAction(action: string, handler: () => void): void {
    const off = this.world.events.on(UiActionClick, ({ action: clicked }) => {
      if (clicked === action) handler();
    });
    this.disposers.push(off);
  }

  /** シーン遷移リクエスト（SceneNavigator が処理） */
  navigate(request: SceneNavigateRequest | readonly SceneNavigateRequest[]): void {
    const list = Array.isArray(request) ? request : [request];
    for (const req of list) this.world.events.emit(SceneNavigate, req);
  }

  getPrimaryUiHandle(): UiHandle | undefined {
    return this.uiHandles[0];
  }

  despawnAll(): void {
    for (const off of this.disposers) off();
    this.disposers.length = 0;
    for (const name of this.systemNames) this.scheduler.unregister(name);
    this.systemNames.length = 0;
    for (const key of this.bindKeys) unbindUiRegistry(this.world, key);
    this.bindKeys.length = 0;
    for (const e of this.entities) {
      this.world.despawn(e);
    }
    this.entities.length = 0;
    for (const type of this.sceneResources) {
      this.world.removeResource(type);
    }
    this.sceneResources.length = 0;
    this.uiHandles.length = 0;
  }
}
