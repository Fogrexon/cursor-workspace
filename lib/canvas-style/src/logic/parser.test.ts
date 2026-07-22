import { describe, expect, it } from 'vitest';
import { parseStylesheet } from './parser';

describe('parseStylesheet', () => {
  it('parses type, class, id, pseudo and declarations', () => {
    const sheet = parseStylesheet(`
      /* toolbar */
      button.primary:hover {
        background: #6c7cff;
        padding: 8 12;
        content: "Go";
      }
      #ok {
        type: button;
        parent: #panel;
      }
    `);

    expect(sheet.diagnostics).toEqual([]);
    expect(sheet.rules).toHaveLength(2);

    const button = sheet.rules[0]!;
    expect(button.selectors[0]).toMatchObject({
      type: 'button',
      classes: ['primary'],
      pseudo: 'hover',
    });
    expect(button.declarations.map((d) => d.property)).toEqual([
      'background',
      'padding',
      'content',
    ]);
    expect(button.declarations[2]?.value).toEqual({ kind: 'string', value: 'Go' });

    const ok = sheet.rules[1]!;
    expect(ok.selectors[0]?.id).toBe('ok');
  });

  it('parses :root variables and var()', () => {
    const sheet = parseStylesheet(`
      :root {
        --accent: #6c7cff;
      }
      panel {
        background: var(--accent, #000);
      }
    `);

    expect(sheet.diagnostics).toEqual([]);
    expect(sheet.rules[0]?.selectors[0]?.type).toBe('root');
    const bg = sheet.rules[1]?.declarations[0]?.value;
    expect(bg).toEqual({
      kind: 'var',
      name: '--accent',
      fallback: { kind: 'color', value: '#000' },
    });
  });

  it('reports line/column diagnostics for broken syntax', () => {
    const sheet = parseStylesheet(`
panel {
  color #fff
}
`);
    expect(sheet.diagnostics.length).toBeGreaterThan(0);
    expect(sheet.diagnostics[0]?.line).toBeGreaterThan(0);
    expect(sheet.diagnostics[0]?.column).toBeGreaterThan(0);
  });

  it('handles empty input', () => {
    const sheet = parseStylesheet('');
    expect(sheet.rules).toEqual([]);
    expect(sheet.diagnostics).toEqual([]);
  });

  it('accepts hex-looking and mixed IDs (#a, #go, #bar)', () => {
    const sheet = parseStylesheet(`
      #a { type: button; }
      #go { type: panel; parent: #a; }
      #bar { type: panel; parent: #go; }
    `);
    expect(sheet.diagnostics).toEqual([]);
    expect(sheet.rules[0]?.selectors[0]?.id).toBe('a');
    expect(sheet.rules[1]?.selectors[0]?.id).toBe('go');
    expect(sheet.rules[2]?.selectors[0]?.id).toBe('bar');
    // #a / #go are not valid CSS color lengths → keyword; used as parent IDs via asString
    expect(sheet.rules[1]?.declarations.find((d) => d.property === 'parent')?.value).toEqual({
      kind: 'keyword',
      value: '#a',
    });
    expect(sheet.rules[2]?.declarations.find((d) => d.property === 'parent')?.value).toEqual({
      kind: 'keyword',
      value: '#go',
    });
  });
});
