import type { World } from '../ecs/World.ts';
import { SystemPhase, type SystemDef } from './types.ts';

export { SystemPhase };

export class Scheduler {
  private readonly systems: SystemDef[] = [];

  register(system: SystemDef): void {
    this.systems.push(system);
  }

  unregister(name: string): void {
    const idx = this.systems.findIndex((s) => s.name === name);
    if (idx >= 0) this.systems.splice(idx, 1);
  }

  runPhase(phase: SystemPhase, world: World, dt: number): void {
    const list = this.systems
      .filter((s) => s.phase === phase)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    for (const system of list) {
      system.run(world, dt);
    }
  }
}
