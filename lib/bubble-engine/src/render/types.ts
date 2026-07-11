import type { RgbaColor, Vec2 } from '../math/types.ts';

export interface DrawStyle {
  fill?: RgbaColor;
  stroke?: RgbaColor;
  lineWidth?: number;
}

export interface GameRenderBackend {
  resize(width: number, height: number): void;
  setCamera(cam: { position: Vec2; zoom: number }): void;
  clearWorld(): void;
  drawCircle(worldPos: Vec2, radius: number, style: DrawStyle): void;
  drawEllipse(
    worldPos: Vec2,
    radiusX: number,
    radiusY: number,
    angle: number,
    style: DrawStyle,
  ): void;
  drawPolygon(worldPos: Vec2, angle: number, localVerts: Vec2[], style: DrawStyle): void;
  drawEdgeChain(points: Vec2[], style: DrawStyle): void;
  drawLine(a: Vec2, b: Vec2, style: DrawStyle): void;
}
