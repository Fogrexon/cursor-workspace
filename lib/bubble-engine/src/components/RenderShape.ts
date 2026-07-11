import type { RgbaColor, Vec2 } from '../math/types.ts';
import { defineComponent } from '../ecs/Component.ts';

export type CircleRenderData = {
  kind: 'circle';
  radius: number;
  fill?: RgbaColor;
  stroke?: RgbaColor;
  lineWidth?: number;
};

export type PolygonRenderData = {
  kind: 'polygon';
  vertices: Vec2[];
  fill?: RgbaColor;
  stroke?: RgbaColor;
  lineWidth?: number;
};

export type EllipseRenderData = {
  kind: 'ellipse';
  radiusX: number;
  radiusY: number;
  fill?: RgbaColor;
  stroke?: RgbaColor;
  lineWidth?: number;
};

export type EdgeChainRenderData = {
  kind: 'edgeChain';
  points: Vec2[];
  fill?: RgbaColor;
  stroke?: RgbaColor;
  lineWidth?: number;
};

export type LineRenderData = {
  kind: 'line';
  a: Vec2;
  b: Vec2;
  stroke?: RgbaColor;
  lineWidth?: number;
  hidden?: boolean;
};

export type RenderShapeData =
  | CircleRenderData
  | PolygonRenderData
  | EllipseRenderData
  | EdgeChainRenderData
  | LineRenderData;

export const RenderShape = defineComponent<RenderShapeData>('RenderShape');

export const CircleRender = defineComponent<CircleRenderData>('CircleRender');
export const PolygonRender = defineComponent<PolygonRenderData>('PolygonRender');
export const EdgeChainRender = defineComponent<EdgeChainRenderData>('EdgeChainRender');
export const LineRender = defineComponent<LineRenderData>('LineRender');
