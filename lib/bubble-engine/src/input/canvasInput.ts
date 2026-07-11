import type { ViewportData } from '../core/resources.ts';
import type { PointerInput } from '../scene/PointerInput.ts';

export interface CanvasBinding {
  canvas: HTMLCanvasElement;
  getViewportSize: () => ViewportData;
}

/** canvas 座標を Viewport スペースへ変換 */
export function pointerEventToScreen(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
  viewport: ViewportData,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * viewport.width,
    y: ((clientY - rect.top) / rect.height) * viewport.height,
  };
}

/** canvas に pointer リスナーを付け、解除関数を返す */
export function bindCanvasPointerInput(
  binding: CanvasBinding,
  dispatch: (input: PointerInput) => void,
): () => void {
  const { canvas } = binding;

  const toInput = (type: PointerInput['type'], e: PointerEvent): PointerInput => {
    const vp = binding.getViewportSize();
    const s = pointerEventToScreen(canvas, e.clientX, e.clientY, vp);
    return { type, screenX: s.x, screenY: s.y };
  };

  const onDown = (e: PointerEvent) => dispatch(toInput('down', e));
  const onMove = (e: PointerEvent) => dispatch(toInput('move', e));
  const onUp = (e: PointerEvent) => dispatch(toInput('up', e));

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  return () => {
    canvas.removeEventListener('pointerdown', onDown);
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('pointerup', onUp);
    canvas.removeEventListener('pointercancel', onUp);
  };
}
