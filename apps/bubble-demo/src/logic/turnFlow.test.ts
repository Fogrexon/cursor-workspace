import { describe, expect, it } from 'vitest';
import { MAX_FLIGHT_SEC, REST_HOLD_SEC, tickTurnState, WATCHING_SEC } from './turnFlow';

describe('tickTurnState', () => {
  it('低速が続けば flying → watching に遷移', () => {
    let phase: 'flying' | 'watching' = 'flying';
    let restTimer = 0;
    let flightTimer = 0;
    let settleTimer = 0;

    for (let i = 0; i < 20; i++) {
      const r = tickTurnState({
        phase,
        dt: 0.05,
        linearSpeed: 0.2,
        angularSpeed: 0.1,
        isAwake: true,
        restTimer,
        flightTimer,
        settleTimer,
      });
      phase = r.phase;
      restTimer = r.restTimer;
      flightTimer = r.flightTimer;
      settleTimer = r.settleTimer;
      if (r.shouldFreezeBird) break;
    }

    expect(phase).toBe('watching');
    expect(restTimer).toBe(0);
  });

  it('watching が満了すると turnEnded', () => {
    const r = tickTurnState({
      phase: 'watching',
      dt: WATCHING_SEC,
      linearSpeed: 0,
      angularSpeed: 0,
      isAwake: false,
      restTimer: 0,
      flightTimer: 0,
      settleTimer: 0,
    });
    expect(r.turnEnded).toBe(true);
  });

  it('最大飛行時間で強制終了', () => {
    const r = tickTurnState({
      phase: 'flying',
      dt: MAX_FLIGHT_SEC,
      linearSpeed: 3,
      angularSpeed: 2,
      isAwake: true,
      restTimer: 0,
      flightTimer: 0,
      settleTimer: 0,
    });
    expect(r.phase).toBe('watching');
    expect(r.shouldFreezeBird).toBe(true);
  });

  it('高速中は restTimer がリセットされる', () => {
    const r = tickTurnState({
      phase: 'flying',
      dt: 0.1,
      linearSpeed: 4,
      angularSpeed: 3,
      isAwake: true,
      restTimer: REST_HOLD_SEC,
      flightTimer: 1,
      settleTimer: 0,
    });
    expect(r.phase).toBe('flying');
    expect(r.restTimer).toBe(0);
  });

  it('画面外なら即 turnEnded', () => {
    const r = tickTurnState({
      phase: 'flying',
      dt: 0.016,
      linearSpeed: 5,
      angularSpeed: 0,
      isAwake: true,
      restTimer: 0,
      flightTimer: 0,
      settleTimer: 0,
      offScreen: true,
    });
    expect(r.turnEnded).toBe(true);
    expect(r.shouldFreezeBird).toBe(true);
    expect(r.phase).toBe('flying');
  });
});
