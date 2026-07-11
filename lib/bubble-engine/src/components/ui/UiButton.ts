import type { RgbaColor } from '../../math/types.ts';
import { defineComponent } from '../../ecs/Component.ts';

export interface UiButtonData {
  label?: string;
  bindLabel?: string;
  width: number;
  height: number;
  state?: 'normal' | 'hover' | 'pressed' | 'disabled';
}

export const UiButton = defineComponent<UiButtonData>('UiButton');
