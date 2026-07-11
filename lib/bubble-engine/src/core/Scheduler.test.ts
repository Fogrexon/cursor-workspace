import { describe, expect, it, vi } from 'vitest';
import { Scheduler, SystemPhase } from './Scheduler.ts';
import type { SystemDef } from './types.ts';
import { World } from '../ecs/World.ts';

function makeSystem(name: string, phase: SystemPhase, order = 0, orderLog?: string[]): SystemDef {
  return {
    name,
    phase,
    order,
    run: vi.fn(() => {
      orderLog?.push(name);
    }),
  };
}

describe('Scheduler', () => {
  it('フェーズ順序どおりに System を実行する', () => {
    const world = new World();
    const scheduler = new Scheduler();
    const log: string[] = [];
    scheduler.register(makeSystem('pre', SystemPhase.PreFixed, 0, log));
    scheduler.register(makeSystem('phys', SystemPhase.Physics, 0, log));
    scheduler.register(makeSystem('render', SystemPhase.GameRender, 0, log));

    scheduler.runPhase(SystemPhase.PreFixed, world, 1 / 60);
    scheduler.runPhase(SystemPhase.Physics, world, 1 / 60);
    scheduler.runPhase(SystemPhase.GameRender, world, 1 / 60);

    expect(log).toEqual(['pre', 'phys', 'render']);
  });

  it('同一フェーズ内は order 昇順', () => {
    const world = new World();
    const scheduler = new Scheduler();
    const log: string[] = [];
    scheduler.register(makeSystem('a', SystemPhase.PostFixed, 10, log));
    scheduler.register(makeSystem('b', SystemPhase.PostFixed, 0, log));
    scheduler.runPhase(SystemPhase.PostFixed, world, 1 / 60);
    expect(log).toEqual(['b', 'a']);
  });
});
