import type { LayoutBox } from '../types';

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function paintBox(ctx: CanvasRenderingContext2D, box: LayoutBox): void {
  const { style } = box;
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, style.opacity));

  if (style.background !== 'transparent') {
    roundRect(ctx, box.x, box.y, box.width, box.height, style.borderRadius);
    ctx.fillStyle = style.background;
    ctx.fill();
  }

  if (style.borderWidth > 0 && style.borderColor !== 'transparent') {
    roundRect(ctx, box.x, box.y, box.width, box.height, style.borderRadius);
    ctx.lineWidth = style.borderWidth;
    ctx.strokeStyle = style.borderColor;
    ctx.stroke();
  }

  if (style.content) {
    ctx.fillStyle = style.color;
    ctx.font = `${style.fontWeight} ${style.fontSize}px "Segoe UI", "Hiragino Sans", "Noto Sans JP", sans-serif`;
    ctx.textBaseline = 'middle';
    const textY = box.contentY + box.contentHeight / 2;
    const centered =
      style.textAlign === 'center' ||
      style.typeName === 'button' ||
      (style.display === 'row' && style.justify === 'center');
    let textX = box.contentX;
    if (centered) {
      ctx.textAlign = 'center';
      textX = box.contentX + box.contentWidth / 2;
    } else if (style.textAlign === 'right') {
      ctx.textAlign = 'right';
      textX = box.contentX + box.contentWidth;
    } else {
      ctx.textAlign = 'left';
    }
    ctx.fillText(style.content, textX, textY, box.contentWidth);
  }

  ctx.restore();
  for (const child of box.children) {
    paintBox(ctx, child);
  }
}
