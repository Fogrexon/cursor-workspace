import { defineComponent } from '../../ecs/Component.ts';

export interface UiActionData {
  action: string;
}

/** クリック可能 UI（Pixi の interactive に同期） */
export const UiAction = defineComponent<UiActionData>('UiAction');
