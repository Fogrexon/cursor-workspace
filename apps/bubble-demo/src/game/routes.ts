import type { SceneNavigateRequest } from '@playground/bubble-engine';

export const ROUTE_MENU: SceneNavigateRequest[] = [
  { op: 'unload', sceneId: 'level' },
  { op: 'unload', sceneId: 'hud' },
  { op: 'unload', sceneId: 'result' },
  { op: 'load', sceneId: 'menu', mode: 'additive' },
];

export const ROUTE_LEVEL: SceneNavigateRequest[] = [
  { op: 'unload', sceneId: 'menu' },
  { op: 'unload', sceneId: 'result' },
  { op: 'load', sceneId: 'hud', mode: 'additive', persistent: true },
  { op: 'load', sceneId: 'level', mode: 'single' },
];

export const ROUTE_RESULT: SceneNavigateRequest[] = [
  { op: 'load', sceneId: 'result', mode: 'additive' },
];
