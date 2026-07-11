import { describe, expect, it, vi } from 'vitest';
import { World } from '../ecs/World.ts';
import { InputState } from '../core/resources.ts';
import type { PointerInput } from '../scene/PointerInput.ts';
import {
  enqueuePointerInput,
  ensureInputState,
  runUiInputSystem,
} from './UiInputSystem.ts';

function setupState(
  world: World,
  opts?: {
    isUiHit?: (x: number, y: number) => boolean;
    dispatch?: (input: PointerInput) => boolean;
  },
): void {
  ensureInputState(world);
  const state = world.resource(InputState);
  state.isUiHit = opts?.isUiHit;
  state.dispatchPointer = opts?.dispatch;
}

describe('UiInputSystem', () => {
  it('down on UI はワールドへ配信しない', () => {
    const world = new World();
    const dispatch = vi.fn(() => true);
    setupState(world, {
      isUiHit: () => true,
      dispatch,
    });

    enqueuePointerInput(world, { type: 'down', screenX: 10, screenY: 10 });
    runUiInputSystem(world);

    expect(dispatch).not.toHaveBeenCalled();
    expect(world.resource(InputState).uiPointerCapture).toBe(true);
    expect(world.resource(InputState).worldPointerActive).toBe(false);
  });

  it('down on world で capture 開始し move/up を配信する', () => {
    const world = new World();
    const dispatched: PointerInput[] = [];
    setupState(world, {
      isUiHit: () => false,
      dispatch: (input) => {
        dispatched.push(input);
        return true;
      },
    });

    enqueuePointerInput(world, { type: 'down', screenX: 1, screenY: 2 });
    enqueuePointerInput(world, { type: 'move', screenX: 3, screenY: 4 });
    enqueuePointerInput(world, { type: 'up', screenX: 5, screenY: 6 });
    runUiInputSystem(world);

    expect(dispatched).toEqual([
      { type: 'down', screenX: 1, screenY: 2 },
      { type: 'move', screenX: 3, screenY: 4 },
      { type: 'up', screenX: 5, screenY: 6 },
    ]);
    expect(world.resource(InputState).worldPointerActive).toBe(false);
  });

  it('world capture 中は UI 上を move しても配信する', () => {
    const world = new World();
    const dispatch = vi.fn(() => true);
    setupState(world, {
      isUiHit: (x) => x > 50,
      dispatch,
    });

    enqueuePointerInput(world, { type: 'down', screenX: 10, screenY: 10 });
    runUiInputSystem(world);
    dispatch.mockClear();

    enqueuePointerInput(world, { type: 'move', screenX: 100, screenY: 100 });
    runUiInputSystem(world);

    expect(dispatch).toHaveBeenCalledWith({ type: 'move', screenX: 100, screenY: 100 });
  });

  it('UI 上で開始した drag は move を配信しない', () => {
    const world = new World();
    const dispatch = vi.fn(() => true);
    setupState(world, {
      isUiHit: () => true,
      dispatch,
    });

    enqueuePointerInput(world, { type: 'down', screenX: 10, screenY: 10 });
    enqueuePointerInput(world, { type: 'move', screenX: 20, screenY: 20 });
    runUiInputSystem(world);

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('キューは runUiInputSystem で順に drain される', () => {
    const world = new World();
    const dispatch = vi.fn(() => true);
    setupState(world, { isUiHit: () => false, dispatch });

    enqueuePointerInput(world, { type: 'down', screenX: 0, screenY: 0 });
    enqueuePointerInput(world, { type: 'up', screenX: 0, screenY: 0 });
    expect(world.resource(InputState).pointerQueue).toHaveLength(2);

    runUiInputSystem(world);

    expect(world.resource(InputState).pointerQueue).toHaveLength(0);
    expect(dispatch).toHaveBeenCalledTimes(2);
  });
});
