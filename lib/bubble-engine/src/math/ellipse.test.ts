import { describe, expect, it } from 'vitest';
import { ellipseVerts } from './ellipse.ts';

describe('ellipseVerts', () => {
  it('指定半径の頂点を返す', () => {
    const verts = ellipseVerts(2, 1, 4);
    expect(verts).toHaveLength(4);
    expect(verts[0]!.x).toBeCloseTo(2);
    expect(verts[0]!.y).toBeCloseTo(0);
    expect(verts[2]!.x).toBeCloseTo(-2);
    expect(verts[2]!.y).toBeCloseTo(0);
  });
});
