import type { World } from '../ecs/World.ts';

export enum SystemPhase {
  Input = 'input',
  PreFixed = 'preFixed',
  Physics = 'physics',
  PostFixed = 'postFixed',
  PreRender = 'preRender',
  GameRender = 'gameRender',
  PreUi = 'preUi',
  UiRender = 'uiRender',
}

export interface SystemDef {
  readonly name: string;
  readonly phase: SystemPhase;
  readonly order?: number;
  run(world: World, dt: number): void;
}

export function defineSystem(def: SystemDef): SystemDef {
  return def;
}
