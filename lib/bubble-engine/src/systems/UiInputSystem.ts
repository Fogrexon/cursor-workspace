import type { World } from '../ecs/World.ts';
import { InputState, type InputStateData } from '../core/resources.ts';
import type { PointerInput } from '../scene/PointerInput.ts';

const defaultInputState = (): InputStateData => ({
  uiPointerCapture: false,
  worldPointerActive: false,
  pointerQueue: [],
});

export function ensureInputState(world: World): InputStateData {
  if (!world.hasResource(InputState)) {
    world.insertResource(InputState, defaultInputState());
  }
  return world.resource(InputState);
}

/** canvas 等から pointer を enqueue（同一フレーム内で runUiInputSystem が drain） */
export function enqueuePointerInput(world: World, input: PointerInput): void {
  ensureInputState(world).pointerQueue.push(input);
}

export function setUiPointerCapture(world: World, captured: boolean): void {
  ensureInputState(world).uiPointerCapture = captured;
}

export function isUiPointerCapture(world: World): boolean {
  return world.hasResource(InputState) && world.resource(InputState).uiPointerCapture;
}

/** Input フェーズで呼び出し: キューを drain し UI/world の優先度で配信 */
export function runUiInputSystem(world: World): void {
  if (!world.hasResource(InputState)) return;
  const state = world.resource(InputState);
  while (state.pointerQueue.length > 0) {
    const input = state.pointerQueue.shift()!;
    routePointerInput(state, input);
  }
}

function routePointerInput(state: InputStateData, input: PointerInput): void {
  const uiHit = state.isUiHit?.(input.screenX, input.screenY) ?? false;

  if (input.type === 'down') {
    if (uiHit) {
      state.uiPointerCapture = true;
      state.worldPointerActive = false;
      return;
    }
    state.uiPointerCapture = false;
    state.worldPointerActive = true;
    state.dispatchPointer?.(input);
    return;
  }

  if (input.type === 'move') {
    if (state.worldPointerActive) {
      state.dispatchPointer?.(input);
    }
    return;
  }

  if (input.type === 'up') {
    if (state.worldPointerActive) {
      state.dispatchPointer?.(input);
    }
    state.worldPointerActive = false;
    state.uiPointerCapture = false;
  }
}
