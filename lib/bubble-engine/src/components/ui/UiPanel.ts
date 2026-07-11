import type { RgbaColor } from '../../math/types.ts';
import { defineComponent } from '../../ecs/Component.ts';

export interface UiPanelData {
  width: number;
  height: number;
  background?: RgbaColor;
  borderColor?: RgbaColor;
  borderWidth?: number;
  cornerRadius?: number;
  padding?: number;
}

export const UiPanel = defineComponent<UiPanelData>('UiPanel');
