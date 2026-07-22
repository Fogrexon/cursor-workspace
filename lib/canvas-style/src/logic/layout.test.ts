import { describe, expect, it } from 'vitest';
import { compileDocument } from './compile';
import { flattenBoxes, layoutScene } from './layout';

describe('layoutScene', () => {
  it('lays out a column panel with absolute root position', () => {
    const { scene } = compileDocument(`
      panel { display: column; gap: 8; padding: 10; background: #1c1c28; }
      text { font-size: 16; }
      button { display: row; padding: 8 12; min-height: 32; }
      #hud { type: panel; x: 40; y: 50; width: 200; }
      #title { type: text; parent: #hud; content: "Title"; }
      #go { type: button; parent: #hud; content: "Go"; height: 32; }
    `);

    const boxes = layoutScene(scene, 800, 600);
    const flat = flattenBoxes(boxes);
    const hud = flat.find((b) => b.id === 'hud')!;
    const title = flat.find((b) => b.id === 'title')!;
    const go = flat.find((b) => b.id === 'go')!;

    expect(hud.x).toBe(40);
    expect(hud.y).toBe(50);
    expect(hud.width).toBe(200);
    expect(title.y).toBeLessThan(go.y);
    expect(go.height).toBe(32);
  });

  it('distributes flex children in a row', () => {
    const { scene } = compileDocument(`
      row { display: row; gap: 0; padding: 0; }
      button { height: 40; }
      #bar { type: row; width: 300; height: 40; x: 0; y: 0; }
      #a { type: button; parent: #bar; flex: 1; content: "A"; }
      #b { type: button; parent: #bar; flex: 2; content: "B"; }
    `);

    const boxes = layoutScene(scene, 800, 600);
    const flat = flattenBoxes(boxes);
    const a = flat.find((b) => b.id === 'a')!;
    const b = flat.find((b) => b.id === 'b')!;
    expect(a.width).toBeCloseTo(100, 0);
    expect(b.width).toBeCloseTo(200, 0);
  });

  it('returns empty layout for empty scene', () => {
    const { scene } = compileDocument('');
    expect(layoutScene(scene, 800, 600)).toEqual([]);
  });

  it('shrink-wraps non-flex row children so label+value settings rows align', () => {
    // Mirrors apps/canvas-style-ui Settings Form sample.
    const { scene } = compileDocument(`
      panel { display: column; padding: 20; gap: 14; }
      row { display: row; align: center; gap: 12; padding: 0; }
      label { font-size: 13; min-width: 110; }
      value { font-size: 14; font-weight: 600; }
      #card { type: panel; x: 180; y: 48; width: 360; }
      #row-scale { type: row; parent: #card; }
      #lbl-scale { type: label; parent: #row-scale; content: "UI Scale"; }
      #val-scale {
        type: value;
        parent: #row-scale;
        content: "125%";
        flex: 1;
        text-align: right;
      }
      #row-theme { type: row; parent: #card; }
      #lbl-theme { type: label; parent: #row-theme; content: "Theme"; }
      #val-theme {
        type: value;
        parent: #row-theme;
        content: "Indigo Night";
        flex: 1;
        text-align: right;
      }
    `);

    const flat = flattenBoxes(layoutScene(scene, 800, 600));
    const card = flat.find((b) => b.id === 'card')!;
    const row = flat.find((b) => b.id === 'row-scale')!;
    const label = flat.find((b) => b.id === 'lbl-scale')!;
    const value = flat.find((b) => b.id === 'val-scale')!;
    const label2 = flat.find((b) => b.id === 'lbl-theme')!;
    const value2 = flat.find((b) => b.id === 'val-theme')!;

    const contentWidth = card.width - 40; // padding 20*2
    expect(row.width).toBe(contentWidth);

    // Label must NOT eat the whole row (the Settings Form bug).
    expect(label.width).toBeGreaterThanOrEqual(110);
    expect(label.width).toBeLessThan(contentWidth / 2);
    expect(value.x).toBeGreaterThan(label.x + label.width);
    expect(value.width).toBeGreaterThan(label.width);
    expect(value.x + value.width).toBeLessThanOrEqual(row.contentX + row.contentWidth + 0.5);

    // Columns line up across rows.
    expect(label2.x).toBe(label.x);
    expect(value2.x).toBe(value.x);
  });
});
