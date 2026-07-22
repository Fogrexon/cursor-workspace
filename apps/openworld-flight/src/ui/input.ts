import type { FlightInput } from '../types';

export type InputController = {
  sample(): FlightInput;
  dispose(): void;
};

export function createInputController(): InputController {
  const keys = new Set<string>();

  const onDown = (e: KeyboardEvent) => {
    keys.add(e.code);
    if (
      e.code === 'ArrowUp' ||
      e.code === 'ArrowDown' ||
      e.code === 'ArrowLeft' ||
      e.code === 'ArrowRight' ||
      e.code === 'Space'
    ) {
      e.preventDefault();
    }
  };
  const onUp = (e: KeyboardEvent) => {
    keys.delete(e.code);
  };
  const onBlur = () => keys.clear();

  window.addEventListener('keydown', onDown);
  window.addEventListener('keyup', onUp);
  window.addEventListener('blur', onBlur);

  return {
    sample(): FlightInput {
      let pitch = 0;
      let yaw = 0;
      let roll = 0;
      let throttle = 0;

      if (keys.has('KeyW') || keys.has('ArrowUp')) pitch += 1;
      if (keys.has('KeyS') || keys.has('ArrowDown')) pitch -= 1;
      // A/← = left turn (−yaw), D/→ = right turn (+yaw)
      if (keys.has('KeyA') || keys.has('ArrowLeft')) yaw -= 1;
      if (keys.has('KeyD') || keys.has('ArrowRight')) yaw += 1;
      if (keys.has('KeyQ')) roll += 1;
      if (keys.has('KeyE')) roll -= 1;
      if (keys.has('ShiftLeft') || keys.has('ShiftRight')) throttle += 1;
      if (keys.has('ControlLeft') || keys.has('ControlRight')) throttle -= 1;

      return { pitch, yaw, roll, throttle };
    },
    dispose() {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    },
  };
}
