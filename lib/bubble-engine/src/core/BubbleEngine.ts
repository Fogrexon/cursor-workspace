import type { Vec2 } from '../math/types.ts';
import { World } from '../ecs/World.ts';
import { GameLoop } from './GameLoop.ts';
import { Scheduler } from './Scheduler.ts';
import { SystemPhase, defineSystem, type SystemDef } from './types.ts';
import { SceneManager } from '../scene/SceneManager.ts';
import { PlanckPhysicsAdapter } from '../physics/PlanckAdapter.ts';
import {
  CameraState,
  GameRenderer,
  PhysicsWorld,
  Viewport,
  type ViewportData,
} from './resources.ts';
import type { GameRenderBackend } from '../render/types.ts';
import { runPhysicsSyncSystem } from '../systems/PhysicsSyncSystem.ts';
import { runPhysicsStepSystem } from '../systems/PhysicsStepSystem.ts';
import { runHierarchySystem } from '../systems/HierarchySystem.ts';
import { runGameRenderSystem } from '../systems/GameRenderSystem.ts';
import { runUiBindingSystem } from '../ui/UiBindingSystem.ts';
import { wirePixiUiActions } from '../ui/UiInputBridge.ts';
import { runUiLayoutSystem } from '../systems/UiLayoutSystem.ts';
import { runUiSyncSystem } from '../systems/UiSyncSystem.ts';
import { runCameraFollowSystem } from '../systems/CameraFollowSystem.ts';
import { createPixiAdapter, type PixiAdapter } from '../render/PixiAdapter.ts';
import { UiRenderer } from './resources.ts';
import { bindCanvasPointerInput } from '../input/canvasInput.ts';
import type { PointerInput } from '../scene/PointerInput.ts';
import { SceneNavigator } from '../scene/SceneNavigator.ts';
import type { SceneRegistry } from '../scene/SceneRegistry.ts';
import { runUiEffectSystem } from '../systems/UiEffectSystem.ts';
import { runDebugDrawSystem } from '../systems/DebugDrawSystem.ts';
import { enqueuePointerInput, ensureInputState, runUiInputSystem } from '../systems/UiInputSystem.ts';

export interface BubbleEngineOptions {
  viewport: ViewportData;
  gameRenderer: GameRenderBackend;
  uiRenderer?: import('../render/uiTypes.ts').UiRenderBackend;
  gravity?: Vec2;
  physicsAdapter?: PlanckPhysicsAdapter;
  fixedDt?: number;
  maxFrameTime?: number;
}

export interface BubbleEngineCanvasOptions {
  canvas: HTMLCanvasElement;
  gravity?: Vec2;
  fixedDt?: number;
  maxFrameTime?: number;
  /** createFromCanvas 後に bindCanvas する（既定 true） */
  autoBindCanvas?: boolean;
}

export class BubbleEngine {
  readonly world: World;
  readonly scheduler = new Scheduler();
  readonly scenes: SceneManager;
  private readonly loop: GameLoop;
  private started = false;
  private canvasBinding: {
    canvas: HTMLCanvasElement;
    resizeRenderer?: (width: number, height: number) => void;
  } | null = null;
  private unbindCanvas: (() => void) | null = null;
  private navigator: SceneNavigator | null = null;
  private uiHitTest: ((screenX: number, screenY: number) => boolean) | null = null;

  private constructor(world: World, options: BubbleEngineOptions) {
    this.world = world;
    this.scenes = new SceneManager(world, this.scheduler);
    this.loop = new GameLoop({
      fixedDt: options.fixedDt ?? 1 / 60,
      maxFrameTime: options.maxFrameTime ?? 0.1,
    });
    this.registerBuiltins();
    this.wireLoop();
  }

  static create(options: BubbleEngineOptions): BubbleEngine {
    const world = new World();
    const adapter = options.physicsAdapter ?? new PlanckPhysicsAdapter(world);
    if (options.gravity) adapter.setGravity(options.gravity);
    world.insertResource(PhysicsWorld, adapter);
    world.insertResource(GameRenderer, options.gameRenderer);
    if (options.uiRenderer) world.insertResource(UiRenderer, options.uiRenderer);
    world.insertResource(Viewport, { ...options.viewport });
    world.insertResource(CameraState, { position: { x: 0, y: 0 }, zoom: 34 });
    ensureInputState(world);
    options.gameRenderer.resize(options.viewport.width, options.viewport.height);
    return new BubbleEngine(world, options);
  }

  static async createFromCanvas(options: BubbleEngineCanvasOptions): Promise<{
    engine: BubbleEngine;
    pixi: PixiAdapter;
  }> {
    const pixi = await createPixiAdapter(options.canvas);
    const engine = BubbleEngine.create({
      viewport: { width: pixi.app.screen.width, height: pixi.app.screen.height },
      gameRenderer: pixi.gameRenderer,
      uiRenderer: pixi.uiRenderer,
      gravity: options.gravity,
      fixedDt: options.fixedDt,
      maxFrameTime: options.maxFrameTime,
    });
    wirePixiUiActions(engine.world, pixi.uiRenderer);
    engine.setUiHitTest((x, y) => pixi.uiRenderer.hitTestInteractive(x, y));
    if (options.autoBindCanvas !== false) {
      engine.bindCanvas(options.canvas, (w, h) => pixi.gameRenderer.resize(w, h));
    }
    return { engine, pixi };
  }

  /**
   * canvas の pointer を SceneManager へ配信し、毎フレーム Viewport を同期する。
   * UI クリックは Pixi が処理、ワールド入力は dispatchPointer へ。
   */
  bindCanvas(
    canvas: HTMLCanvasElement,
    resizeRenderer?: (width: number, height: number) => void,
  ): void {
    this.unbindCanvas?.();
    this.canvasBinding = { canvas, resizeRenderer };
    this.unbindCanvas = bindCanvasPointerInput(
      {
        canvas,
        getViewportSize: () => this.world.resource(Viewport),
      },
      (input: PointerInput) => {
        enqueuePointerInput(this.world, input);
      },
    );
    const inputState = ensureInputState(this.world);
    inputState.isUiHit = (x, y) => this.uiHitTest?.(x, y) ?? false;
    inputState.dispatchPointer = (input) => this.scenes.dispatchPointer(input);
  }

  /** Pixi UI の hit test（createFromCanvas が設定） */
  setUiHitTest(fn: (screenX: number, screenY: number) => boolean): void {
    this.uiHitTest = fn;
  }

  /** SceneRegistry を登録し SceneNavigate イベントを有効化 */
  registerScenes(registry: SceneRegistry): SceneNavigator {
    ensureInputState(this.world);
    this.navigator?.dispose();
    this.navigator = new SceneNavigator(this.world, this.scenes, registry);
    return this.navigator;
  }

  get sceneNavigator(): SceneNavigator | null {
    return this.navigator;
  }

  unbindCanvasInput(): void {
    this.unbindCanvas?.();
    this.unbindCanvas = null;
    this.canvasBinding = null;
  }

  registerSystem(system: SystemDef): void {
    this.scheduler.register(system);
  }

  start(): void {
    this.started = true;
  }

  stop(): void {
    this.started = false;
  }

  tick(now: number): void {
    if (!this.started) this.started = true;
    this.loop.tick(now);
  }

  private registerBuiltins(): void {
    this.scheduler.register(
      defineSystem({
        name: 'PhysicsSync',
        phase: SystemPhase.PreFixed,
        run: (world) => runPhysicsSyncSystem(world),
      }),
    );
    this.scheduler.register(
      defineSystem({
        name: 'PhysicsStep',
        phase: SystemPhase.Physics,
        run: (world, dt) => runPhysicsStepSystem(world, dt),
      }),
    );
    this.scheduler.register(
      defineSystem({
        name: 'CameraFollow',
        phase: SystemPhase.PreRender,
        order: 1,
        run: (world) => runCameraFollowSystem(world),
      }),
    );
    this.scheduler.register(
      defineSystem({
        name: 'Hierarchy',
        phase: SystemPhase.PreRender,
        order: 0,
        run: (world) => runHierarchySystem(world),
      }),
    );
    this.scheduler.register(
      defineSystem({
        name: 'GameRender',
        phase: SystemPhase.GameRender,
        order: 0,
        run: (world) => runGameRenderSystem(world),
      }),
    );
    this.scheduler.register(
      defineSystem({
        name: 'DebugDraw',
        phase: SystemPhase.GameRender,
        order: 1,
        run: (world) => runDebugDrawSystem(world),
      }),
    );
    this.scheduler.register(
      defineSystem({
        name: 'UiInput',
        phase: SystemPhase.Input,
        order: 0,
        run: (world) => runUiInputSystem(world),
      }),
    );
    this.scheduler.register(
      defineSystem({
        name: 'UiBinding',
        phase: SystemPhase.PreUi,
        order: 0,
        run: (world) => runUiBindingSystem(world),
      }),
    );
    this.scheduler.register(
      defineSystem({
        name: 'UiLayout',
        phase: SystemPhase.PreUi,
        order: 1,
        run: (world) => runUiLayoutSystem(world),
      }),
    );
    this.scheduler.register(
      defineSystem({
        name: 'UiEffect',
        phase: SystemPhase.PreUi,
        order: 2,
        run: (world, dt) => runUiEffectSystem(world, dt),
      }),
    );
    this.scheduler.register(
      defineSystem({
        name: 'UiSync',
        phase: SystemPhase.PreUi,
        order: 3,
        run: (world) => runUiSyncSystem(world),
      }),
    );
  }

  private wireLoop(): void {
    const fixedPhases = [SystemPhase.PreFixed, SystemPhase.Physics, SystemPhase.PostFixed];
    const renderPhases = [
      SystemPhase.PreRender,
      SystemPhase.GameRender,
      SystemPhase.PreUi,
      SystemPhase.UiRender,
    ];

    this.loop.onFixedUpdate((dt) => {
      for (const phase of fixedPhases) {
        this.scheduler.runPhase(phase, this.world, dt);
      }
    });
    this.loop.onFrameUpdate((dt) => {
      this.syncBoundViewport();
      this.scheduler.runPhase(SystemPhase.Input, this.world, dt);
      this.scenes.update(dt);
    });
    this.loop.onRender(() => {
      for (const phase of renderPhases) {
        this.scheduler.runPhase(phase, this.world, 0);
      }
    });
  }

  private syncBoundViewport(): void {
    if (!this.canvasBinding) return;
    const vp = this.world.resource(Viewport);
    const canvas = this.canvasBinding.canvas;
    const w = canvas.clientWidth || vp.width;
    const h = canvas.clientHeight || vp.height;
    if (vp.width === w && vp.height === h) return;
    vp.width = w;
    vp.height = h;
    this.canvasBinding.resizeRenderer?.(w, h);
  }
}
