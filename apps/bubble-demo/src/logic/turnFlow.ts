import { isBirdAtRest } from './slingshot';

export const REST_HOLD_SEC = 0.35;
export const WATCHING_SEC = 1.2;
export const MAX_FLIGHT_SEC = 12;

export type TurnPhase = 'aiming' | 'flying' | 'watching';

export interface TurnTickInput {
  phase: TurnPhase;
  dt: number;
  linearSpeed: number;
  angularSpeed: number;
  isAwake: boolean;
  restTimer: number;
  flightTimer: number;
  settleTimer: number;
  offScreen?: boolean;
}

export interface TurnTickResult {
  phase: TurnPhase;
  restTimer: number;
  flightTimer: number;
  settleTimer: number;
  turnEnded: boolean;
  shouldFreezeBird: boolean;
}

/** 発射後のフェーズ遷移（flying → watching → ターン終了） */
export function tickTurnState(input: TurnTickInput): TurnTickResult {
  let { phase, restTimer, flightTimer, settleTimer } = input;
  let turnEnded = false;
  let shouldFreezeBird = false;

  if (phase === 'flying') {
    flightTimer += input.dt;

    if (input.offScreen) {
      shouldFreezeBird = true;
      turnEnded = true;
      return { phase, restTimer, flightTimer, settleTimer, turnEnded, shouldFreezeBird };
    }

    const sleeping = !input.isAwake;
    const slowEnough = isBirdAtRest(input.linearSpeed, input.angularSpeed);
    if (sleeping || slowEnough) restTimer += input.dt;
    else restTimer = 0;

    const timedOut = flightTimer >= MAX_FLIGHT_SEC;
    const rested = sleeping || restTimer >= REST_HOLD_SEC;
    if (rested || timedOut) {
      phase = 'watching';
      settleTimer = 0;
      restTimer = 0;
      shouldFreezeBird = true;
    }
  } else if (phase === 'watching') {
    settleTimer += input.dt;
    if (settleTimer >= WATCHING_SEC) {
      turnEnded = true;
    }
  }

  return { phase, restTimer, flightTimer, settleTimer, turnEnded, shouldFreezeBird };
}
