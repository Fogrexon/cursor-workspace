import { defineComponent } from '../ecs/Component.ts';

export type SceneScopeKind = 'game' | 'ui-persistent' | 'ui-scene';

export interface SceneScopeData {
  /** 所属シーン ID（SceneContext が自動付与） */
  sceneId?: string;
  scope?: SceneScopeKind;
}

export const SceneScope = defineComponent<SceneScopeData>('SceneScope');
