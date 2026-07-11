import { defineComponent } from '../../ecs/Component.ts';
import type { Entity } from '../../ecs/Entity.ts';

export interface UiEffectsData {
  preset?: 'none' | 'pulse' | 'shake';
}

export const UiEffects = defineComponent<UiEffectsData>('UiEffects');

export interface UiParentData {
  parent: Entity;
}

export const UiParent = defineComponent<UiParentData>('UiParent');

export interface UiBindData {
  key: string;
}

export const UiBind = defineComponent<UiBindData>('UiBind');
