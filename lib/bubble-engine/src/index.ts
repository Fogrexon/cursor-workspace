// ECS
export { World } from './ecs/World.ts';
export { defineComponent } from './ecs/Component.ts';
export { defineResource } from './ecs/Resource.ts';
export { defineEvent } from './ecs/events.ts';
export type { Entity } from './ecs/Entity.ts';

// Components
export { Transform, Parent } from './components/Transform.ts';
export { RigidBody, Collider, PhysicsLayer } from './components/RigidBody.ts';
export { RenderShape } from './components/RenderShape.ts';
export { Camera } from './components/Camera.ts';

// Core
export { BubbleEngine, type BubbleEngineOptions, type BubbleEngineCanvasOptions } from './core/BubbleEngine.ts';
export { Scheduler } from './core/Scheduler.ts';
export { SystemPhase, defineSystem, type SystemDef } from './core/types.ts';
export {
  Viewport,
  PhysicsWorld,
  GameRenderer,
  UiRenderer,
  ActiveCamera,
  CameraState,
} from './core/resources.ts';

// Physics
export { PlanckPhysicsAdapter } from './physics/PlanckAdapter.ts';
export { ContactBegin } from './physics/events.ts';

// Scene
export type { Scene } from './scene/SceneContext.ts';
export { SceneContext } from './scene/SceneContext.ts';
export type { PointerInput } from './scene/PointerInput.ts';
export { UiAction } from './components/ui/UiAction.ts';
export { UiActionClick, type UiActionClickPayload } from './ui/events.ts';
export { SceneManager, type LoadSceneOptions, type SceneInstance } from './scene/SceneManager.ts';
export { SceneRegistry } from './scene/SceneRegistry.ts';
export { SceneNavigator } from './scene/SceneNavigator.ts';
export { SceneNavigate, type SceneNavigateRequest } from './scene/SceneNavigate.ts';
export { InputState, type InputStateData } from './core/resources.ts';
export {
  enqueuePointerInput,
  ensureInputState,
  isUiPointerCapture,
  runUiInputSystem,
  setUiPointerCapture,
} from './systems/UiInputSystem.ts';
export { DebugDraw, type DebugDrawData } from './systems/DebugDrawSystem.ts';
export { runDebugDrawSystem } from './systems/DebugDrawSystem.ts';
export { EffectClock, runUiEffectSystem } from './systems/UiEffectSystem.ts';
export { isOutsideView } from './render/viewBounds.ts';
export { expandUiNode, type UiButtonDef } from './ui/expandUiNode.ts';

export { defineUi, type UiDefinition } from './ui/defineUi.ts';
export { ScreenTransform, ScreenAnchor } from './components/ui/ScreenAnchor.ts';
export { UiPanel } from './components/ui/UiPanel.ts';
export { UiButton } from './components/ui/UiButton.ts';
export { UiText } from './components/ui/UiText.ts';
export { mountUi, type UiHandle } from './ui/mountUi.ts';
export type { UiBindDef } from './ui/UiBindingSystem.ts';
export { bindUiRegistry, unbindUiRegistry, runUiBindingSystem } from './ui/UiBindingSystem.ts';
export { wirePixiUiActions } from './ui/UiInputBridge.ts';
export { bindCanvasPointerInput, pointerEventToScreen } from './input/canvasInput.ts';

// Render (test / swap)
export type { GameRenderBackend, DrawStyle } from './render/types.ts';
export { RecordingGameRenderer } from './render/RecordingGameRenderer.ts';
export { RecordingUiRenderer } from './render/RecordingUiRenderer.ts';
export { createPixiAdapter, type PixiAdapter } from './render/PixiAdapter.ts';
export { worldToScreen, screenToWorld } from './render/camera.ts';

// Systems (for custom registration)
export { runHierarchySystem } from './systems/HierarchySystem.ts';
export { runPhysicsSyncSystem } from './systems/PhysicsSyncSystem.ts';
export { runPhysicsStepSystem } from './systems/PhysicsStepSystem.ts';
export { runGameRenderSystem } from './systems/GameRenderSystem.ts';
export { runUiLayoutSystem } from './systems/UiLayoutSystem.ts';
export { runUiSyncSystem } from './systems/UiSyncSystem.ts';
export { runCameraFollowSystem } from './systems/CameraFollowSystem.ts';

// Types
export type { Vec2, RgbaColor, Transform2D } from './math/types.ts';
export { ellipseVerts } from './math/ellipse.ts';
