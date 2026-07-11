import { defineEvent } from '../ecs/events.ts';
import type { LoadSceneOptions } from './SceneManager.ts';

export interface SceneNavigateUnload {
  op: 'unload';
  sceneId: string;
}

export interface SceneNavigateLoad {
  op: 'load';
  sceneId: string;
  mode: LoadSceneOptions['mode'];
  persistent?: boolean;
}

export type SceneNavigateRequest = SceneNavigateUnload | SceneNavigateLoad;

export const SceneNavigate = defineEvent<SceneNavigateRequest>('SceneNavigate');
