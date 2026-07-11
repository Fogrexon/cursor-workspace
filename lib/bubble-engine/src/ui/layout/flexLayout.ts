import type { UiLayoutChildData } from '../../components/ui/UiLayout.ts';

export interface LayoutBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MeasuredChild {
  width: number;
  height: number;
  layoutChild: UiLayoutChildData;
}

export interface FlexRowOptions {
  contentWidth: number;
  contentHeight: number;
  gap: number;
  padding: { top: number; right: number; bottom: number; left: number };
  align: 'start' | 'center' | 'end' | 'stretch';
  justify: 'start' | 'center' | 'end' | 'space-between';
  children: MeasuredChild[];
}

export function flexLayoutRow(options: FlexRowOptions): LayoutBox[] {
  const { gap, padding, children, align = 'start', justify = 'start', contentWidth, contentHeight } =
    options;
  const innerW = contentWidth - padding.left - padding.right;
  const innerH = contentHeight - padding.top - padding.bottom;
  const totalW =
    children.reduce((sum, c) => sum + c.width, 0) + gap * Math.max(0, children.length - 1);
  let x = padding.left;
  if (justify === 'center') x += Math.max(0, (innerW - totalW) / 2);
  else if (justify === 'end') x += Math.max(0, innerW - totalW);

  return children.map((child) => {
    let y = padding.top;
    if (align === 'center') y += Math.max(0, (innerH - child.height) / 2);
    else if (align === 'end') y += Math.max(0, innerH - child.height);
    const box: LayoutBox = { x, y, width: child.width, height: child.height };
    x += child.width + gap;
    return box;
  });
}

export function flexLayoutColumn(options: FlexRowOptions): LayoutBox[] {
  const {
    gap,
    padding,
    children,
    align = 'start',
    justify = 'start',
    contentWidth,
    contentHeight,
  } = options;
  const innerW = contentWidth - padding.left - padding.right;
  const innerH = contentHeight - padding.top - padding.bottom;
  const totalH =
    children.reduce((sum, c) => sum + c.height, 0) + gap * Math.max(0, children.length - 1);
  let y = padding.top;
  if (justify === 'center') y += Math.max(0, (innerH - totalH) / 2);
  else if (justify === 'end') y += Math.max(0, innerH - totalH);

  return children.map((child) => {
    let x = padding.left;
    if (align === 'center') x += Math.max(0, (innerW - child.width) / 2);
    else if (align === 'end') x += Math.max(0, innerW - child.width);
    const box: LayoutBox = { x, y, width: child.width, height: child.height };
    y += child.height + gap;
    return box;
  });
}
