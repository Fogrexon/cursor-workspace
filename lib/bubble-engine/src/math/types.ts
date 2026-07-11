export interface Vec2 {
  x: number;
  y: number;
}

export interface Transform2D {
  position: Vec2;
  angle: number;
  scale?: Vec2;
}

export interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export const vec2 = (x: number, y: number): Vec2 => ({ x, y });
