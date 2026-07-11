import type { ScreenAnchorData } from '../../components/ui/ScreenAnchor.ts';
import type { ViewportData } from '../../core/resources.ts';

export function resolveScreenAnchor(
  anchor: ScreenAnchorData,
  viewport: ViewportData,
  width: number,
  height: number,
): { x: number; y: number } {
  const margin = anchor.margin ?? { x: 0, y: 0 };
  const offset = anchor.offset ?? { x: 0, y: 0 };

  switch (anchor.edge) {
    case 'top-left':
      return { x: margin.x + offset.x, y: margin.y + offset.y };
    case 'top-center':
      return { x: viewport.width / 2 - width / 2 + offset.x, y: margin.y + offset.y };
    case 'top-right':
      return { x: viewport.width - width - margin.x + offset.x, y: margin.y + offset.y };
    case 'center-left':
      return { x: margin.x + offset.x, y: viewport.height / 2 - height / 2 + offset.y };
    case 'center':
      return {
        x: viewport.width / 2 - width / 2 + offset.x,
        y: viewport.height / 2 - height / 2 + offset.y,
      };
    case 'center-right':
      return {
        x: viewport.width - width - margin.x + offset.x,
        y: viewport.height / 2 - height / 2 + offset.y,
      };
    case 'bottom-left':
      return { x: margin.x + offset.x, y: viewport.height - height - margin.y + offset.y };
    case 'bottom-center':
      return {
        x: viewport.width / 2 - width / 2 + offset.x,
        y: viewport.height - height - margin.y + offset.y,
      };
    case 'bottom-right':
      return {
        x: viewport.width - width - margin.x + offset.x,
        y: viewport.height - height - margin.y + offset.y,
      };
  }
}
