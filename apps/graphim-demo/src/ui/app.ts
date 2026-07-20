import { Renderer } from 'graphim';
import sampleUrl from '../assets/sample.jpg';
import {
  isAnimatedEffect,
  isEffectId,
  listEffects,
  type EffectId,
} from '../logic/effects';
import { buildEffectGraph } from './effectGraph';

/**
 * Mount the Graphim playground: sample image, effect picker, live WebGL preview.
 */
export function mountApp(root: HTMLElement): void {
  const effects = listEffects();
  const options = effects
    .map((e) => `<option value="${e.id}">${e.label}</option>`)
    .join('');

  root.innerHTML = `
    <header class="header">
      <p class="back"><a href="../">← Portal</a></p>
      <h1>Graphim Demo</h1>
      <p>WebGL ノードベース画像エフェクト（<code>lib/graphim</code> submodule）</p>
    </header>
    <section class="controls">
      <label>
        Effect
        <select id="effect">${options}</select>
      </label>
    </section>
    <section class="stage-wrap">
      <img id="source" src="${sampleUrl}" alt="Sample for Graphim filters" width="640" />
    </section>
    <p id="status" class="status" aria-live="polite"></p>
  `;

  const img = root.querySelector<HTMLImageElement>('#source');
  const select = root.querySelector<HTMLSelectElement>('#effect');
  const status = root.querySelector<HTMLParagraphElement>('#status');
  if (!img || !select || !status) throw new Error('demo DOM missing');

  let renderer: Renderer | null = null;
  let current: EffectId = 'gray';

  const apply = () => {
    if (!renderer) return;
    renderer.stopAnimate();
    const graph = buildEffectGraph(current);
    if (isAnimatedEffect(current)) {
      renderer.animate(graph);
      status.textContent = `${current}: animating`;
    } else {
      renderer.render(graph);
      status.textContent = `${current}: rendered`;
    }
  };

  const start = () => {
    renderer = new Renderer({ image: img });
    apply();
  };

  if (img.complete && img.naturalWidth > 0) start();
  else img.addEventListener('load', start, { once: true });

  select.addEventListener('change', () => {
    const value = select.value;
    if (!isEffectId(value)) return;
    current = value;
    apply();
  });
}
