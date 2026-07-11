import type { Vec2 } from './types.ts';

/** 楕円を多角形で近似（当たり判定・描画共用） */
export function ellipseVerts(radiusX: number, radiusY: number, segments = 14): Vec2[] {
  const verts: Vec2[] = [];
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    verts.push({ x: Math.cos(t) * radiusX, y: Math.sin(t) * radiusY });
  }
  return verts;
}
