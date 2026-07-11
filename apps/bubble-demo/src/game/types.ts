import {
  defineResource,
  defineComponent,
  type Entity,
  type Vec2,
} from '@playground/bubble-engine';

export const GameState = defineResource<{
  score: number;
  bestScore: number;
  birdsLeft: number;
  pigsLeft: number;
  headline: string;
  subline: string;
}>('GameState');

export const Destructible = defineComponent<{ kind: 'pig' | 'block'; hp: number }>('Destructible');

export const LevelState = defineResource<{
  slingshot: Vec2;
  forkLeft: Vec2;
  forkRight: Vec2;
  bird: Entity;
  bandLeft: Entity;
  bandRight: Entity;
  phase: 'aiming' | 'flying' | 'watching' | 'ended';
  birdsLeft: number;
  pigs: Entity[];
  blocks: Entity[];
  settleTimer: number;
  restTimer: number;
  flightTimer: number;
  structuresAwake: boolean;
}>('LevelState');

/** 鳥の待機位置（スリングの中心） */
export const SLINGSHOT = { x: -7, y: 0.85 } as const;

/** 左右のフォーク先端（ゴムの取り付け位置） */
export const SLINGSHOT_FORK_LEFT = { x: SLINGSHOT.x - 0.32, y: SLINGSHOT.y + 0.08 } as const;
export const SLINGSHOT_FORK_RIGHT = { x: SLINGSHOT.x + 0.32, y: SLINGSHOT.y + 0.08 } as const;

export const BIRDS_PER_LEVEL = 3;

/** 鳥の半径（横長楕円・回転固定で転がらない） */
export const BIRD_RADIUS = { x: 0.42, y: 0.28 } as const;
