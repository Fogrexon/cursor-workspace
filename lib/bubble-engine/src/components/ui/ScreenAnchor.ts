import { defineComponent } from '../../ecs/Component.ts';

export type ScreenEdge =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ScreenAnchorData {
  edge: ScreenEdge;
  margin?: { x: number; y: number };
  offset?: { x: number; y: number };
}

export const ScreenAnchor = defineComponent<ScreenAnchorData>('ScreenAnchor');

export interface ScreenTransformData {
  x: number;
  y: number;
  _layoutComputed?: boolean;
  rotation?: number;
  scale?: { x: number; y: number };
  alpha?: number;
  zIndex?: number;
  visible?: boolean;
}

export const ScreenTransform = defineComponent<ScreenTransformData>('ScreenTransform');
