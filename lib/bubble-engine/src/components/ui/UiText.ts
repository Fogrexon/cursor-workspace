import type { RgbaColor } from '../../math/types.ts';
import { defineComponent } from '../../ecs/Component.ts';

export interface UiTextData {
  text?: string;
  bind?: string;
  fontSize?: number;
  color?: RgbaColor;
  align?: 'left' | 'center' | 'right';
  fontFamily?: string;
}

export const UiText = defineComponent<UiTextData>('UiText');
