import { describe, expect, it, vi } from 'vitest';
import { flattenBoxes, layoutScene } from './layout';
import { mountTree, node } from './tree';

describe('mountTree', () => {
  it('builds a nested tree without parent: #id in CSS', () => {
    const { scene } = mountTree(
      node('panel', {
        id: 'hud',
        style: { width: 200, padding: 8, display: 'column', gap: 4 },
        children: [
          node('text', { id: 'hp', content: 'HP 100' }),
          node('button', {
            id: 'pause',
            classNames: ['ghost'],
            content: 'Pause',
          }),
        ],
      }),
      `
        text { font-size: 14; color: #e8e8f0; }
        button { padding: 8; background: #6c7cff; color: #fff; }
        .ghost { background: transparent; border: 1 solid #32324a; }
      `,
    );

    expect(scene.roots.map((n) => n.id)).toEqual(['hud']);
    expect(scene.byId.get('hud')?.children.map((c) => c.id)).toEqual(['hp', 'pause']);
    expect(scene.byId.get('pause')?.classNames).toEqual(['ghost']);
    expect(scene.contentOverrides.get('hp')).toBe('HP 100');

    const boxes = flattenBoxes(layoutScene(scene, 800, 600));
    expect(boxes.find((b) => b.id === 'hp')?.style.content).toBe('HP 100');
    expect(boxes.find((b) => b.id === 'pause')?.style.background).toBe('transparent');
  });

  it('supports setContent-style overrides without remount', () => {
    const { scene } = mountTree(node('text', { id: 'score', content: '0' }));
    scene.contentOverrides.set('score', '42');
    const box = flattenBoxes(layoutScene(scene, 100, 100))[0]!;
    expect(box.style.content).toBe('42');
  });

  it('registers onClick handlers by id', () => {
    const onClick = vi.fn();
    const { clickHandlers } = mountTree(
      node('button', { id: 'go', content: 'Go', onClick }),
    );
    clickHandlers.get('go')?.();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('rejects duplicate ids', () => {
    expect(() =>
      mountTree([
        node('panel', { id: 'a' }),
        node('panel', { id: 'a' }),
      ]),
    ).toThrow(/Duplicate/);
  });
});
