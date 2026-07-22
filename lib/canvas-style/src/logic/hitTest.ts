import type { LayoutBox } from '../types';
import { flattenBoxes } from './layout';

export function hitTest(boxes: LayoutBox[], x: number, y: number): LayoutBox | undefined {
  const flat = flattenBoxes(boxes);
  for (let i = flat.length - 1; i >= 0; i -= 1) {
    const box = flat[i]!;
    if (x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height) {
      return box;
    }
  }
  return undefined;
}
