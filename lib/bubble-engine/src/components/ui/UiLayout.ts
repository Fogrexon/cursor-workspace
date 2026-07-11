import { defineComponent } from '../../ecs/Component.ts';

export type LayoutMode = 'row' | 'column' | 'stack';

export interface UiLayoutData {
  mode: LayoutMode;
  gap?: number;
  padding?: number | { top: number; right: number; bottom: number; left: number };
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between';
}

export interface UiLayoutChildData {
  grow?: number;
  basis?: number | 'auto';
  alignSelf?: 'start' | 'center' | 'end' | 'stretch';
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
  minWidth?: number;
  minHeight?: number;
}

export const UiLayout = defineComponent<UiLayoutData>('UiLayout');
export const UiLayoutChild = defineComponent<UiLayoutChildData>('UiLayoutChild');
