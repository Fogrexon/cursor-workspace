import { describe, expect, it } from 'vitest';
import { compileDocument } from './compile';

describe('compileDocument', () => {
  it('builds a parent/child tree from id rules', () => {
    const { scene, diagnostics } = compileDocument(`
      panel { display: column; gap: 8; padding: 12; }
      button { display: row; padding: 8 12; }
      #hud {
        type: panel;
        x: 20;
        y: 30;
        width: 240;
      }
      #title {
        type: text;
        parent: #hud;
        content: "Hello";
      }
      #go {
        type: button;
        parent: #hud;
        content: "Start";
      }
    `);

    expect(diagnostics).toEqual([]);
    expect(scene.roots.map((n) => n.id)).toEqual(['hud']);
    expect(scene.byId.get('hud')?.children.map((c) => c.id)).toEqual(['title', 'go']);
    expect(scene.byId.get('go')?.typeName).toBe('button');
  });

  it('reports missing parents', () => {
    const { diagnostics } = compileDocument(`
      #orphan {
        type: panel;
        parent: #missing;
      }
    `);
    expect(diagnostics.some((d) => d.message.includes('missing'))).toBe(true);
  });

  it('resolves parent when the reference looks like a hex color (#bar)', () => {
    const { scene, diagnostics } = compileDocument(`
      #bar { type: panel; width: 100; }
      #child { type: text; parent: #bar; content: "Hi"; }
    `);
    expect(diagnostics).toEqual([]);
    expect(scene.byId.get('bar')?.children.map((c) => c.id)).toEqual(['child']);
  });
});
