import { describe, expect, it } from 'vitest';
import { flexLayoutRow, flexLayoutColumn } from './flexLayout.ts';
import type { MeasuredChild } from './flexLayout.ts';

describe('flexLayout', () => {
  it('row: gap と padding を反映して子を横並びにする', () => {
    const children: MeasuredChild[] = [
      { width: 50, height: 20, layoutChild: {} },
      { width: 30, height: 20, layoutChild: {} },
    ];
    const boxes = flexLayoutRow({
      contentWidth: 200,
      contentHeight: 40,
      gap: 10,
      padding: { top: 0, right: 0, bottom: 0, left: 5 },
      align: 'start',
      justify: 'start',
      children,
    });
    expect(boxes[0]).toEqual({ x: 5, y: 0, width: 50, height: 20 });
    expect(boxes[1]).toEqual({ x: 65, y: 0, width: 30, height: 20 });
  });

  it('column: gap と padding を反映して子を縦並びにする', () => {
    const children: MeasuredChild[] = [
      { width: 80, height: 20, layoutChild: {} },
      { width: 60, height: 30, layoutChild: {} },
    ];
    const boxes = flexLayoutColumn({
      contentWidth: 100,
      contentHeight: 100,
      gap: 8,
      padding: { top: 4, right: 0, bottom: 0, left: 10 },
      align: 'center',
      justify: 'start',
      children,
    });
    // align center はパネル内幅 (100-10=90) 基準で中央寄せ
    expect(boxes[0]).toEqual({ x: 15, y: 4, width: 80, height: 20 });
    expect(boxes[1]).toEqual({ x: 25, y: 32, width: 60, height: 30 });
  });

  it('column: align center は contentWidth（パネル幅）基準で子を中央寄せ', () => {
    const children: MeasuredChild[] = [
      { width: 200, height: 30, layoutChild: {} },
      { width: 160, height: 44, layoutChild: {} },
    ];
    const boxes = flexLayoutColumn({
      contentWidth: 320,
      contentHeight: 260,
      gap: 14,
      padding: { top: 20, right: 20, bottom: 20, left: 20 },
      align: 'center',
      justify: 'center',
      children,
    });
    // innerW = 280 → button x = 20 + (280-160)/2 = 80
    expect(boxes[1]!.x).toBe(80);
  });

  it('row: justify center で子を中央寄せ', () => {
    const children: MeasuredChild[] = [{ width: 40, height: 20, layoutChild: {} }];
    const boxes = flexLayoutRow({
      contentWidth: 100,
      contentHeight: 40,
      gap: 0,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      align: 'center',
      justify: 'center',
      children,
    });
    expect(boxes[0]!.x).toBe(30);
    expect(boxes[0]!.y).toBe(10);
  });

  it('row: align center で子をパネル高さの中央に配置', () => {
    const children: MeasuredChild[] = [{ width: 60, height: 22, layoutChild: {} }];
    const boxes = flexLayoutRow({
      contentWidth: 220,
      contentHeight: 52,
      gap: 0,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      align: 'center',
      justify: 'center',
      children,
    });
    expect(boxes[0]!.x).toBe(80);
    expect(boxes[0]!.y).toBe(15);
  });
});
