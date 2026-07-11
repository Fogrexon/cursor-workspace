import type { DrawStyle, GameRenderBackend } from './types.ts';
import type { Vec2 } from '../math/types.ts';

export type RecordedDrawCall =
  | { type: 'resize'; width: number; height: number }
  | { type: 'setCamera'; position: Vec2; zoom: number }
  | { type: 'clearWorld' }
  | { type: 'drawCircle'; worldPos: Vec2; radius: number; style: DrawStyle }
  | {
      type: 'drawEllipse';
      worldPos: Vec2;
      radiusX: number;
      radiusY: number;
      angle: number;
      style: DrawStyle;
    }
  | { type: 'drawPolygon'; worldPos: Vec2; angle: number; localVerts: Vec2[]; style: DrawStyle }
  | { type: 'drawEdgeChain'; points: Vec2[]; style: DrawStyle }
  | { type: 'drawLine'; a: Vec2; b: Vec2; style: DrawStyle };

export class RecordingGameRenderer implements GameRenderBackend {
  readonly calls: RecordedDrawCall[] = [];

  resize(width: number, height: number): void {
    this.calls.push({ type: 'resize', width, height });
  }

  setCamera(cam: { position: Vec2; zoom: number }): void {
    this.calls.push({ type: 'setCamera', position: { ...cam.position }, zoom: cam.zoom });
  }

  clearWorld(): void {
    this.calls.push({ type: 'clearWorld' });
  }

  drawCircle(worldPos: Vec2, radius: number, style: DrawStyle): void {
    this.calls.push({
      type: 'drawCircle',
      worldPos: { ...worldPos },
      radius,
      style: { ...style },
    });
  }

  drawEllipse(
    worldPos: Vec2,
    radiusX: number,
    radiusY: number,
    angle: number,
    style: DrawStyle,
  ): void {
    this.calls.push({
      type: 'drawEllipse',
      worldPos: { ...worldPos },
      radiusX,
      radiusY,
      angle,
      style: { ...style },
    });
  }

  drawPolygon(worldPos: Vec2, angle: number, localVerts: Vec2[], style: DrawStyle): void {
    this.calls.push({
      type: 'drawPolygon',
      worldPos: { ...worldPos },
      angle,
      localVerts: localVerts.map((v) => ({ ...v })),
      style: { ...style },
    });
  }

  drawEdgeChain(points: Vec2[], style: DrawStyle): void {
    this.calls.push({
      type: 'drawEdgeChain',
      points: points.map((p) => ({ ...p })),
      style: { ...style },
    });
  }

  drawLine(a: Vec2, b: Vec2, style: DrawStyle): void {
    this.calls.push({ type: 'drawLine', a: { ...a }, b: { ...b }, style: { ...style } });
  }
}
