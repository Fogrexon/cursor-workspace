import {
  Graphim,
  add,
  bloom,
  blur,
  chromatic,
  contrast,
  delay,
  difference,
  edge,
  frosted,
  gray,
  mask,
  mirror,
  mix,
  multiply,
  named,
  neg,
  overlay,
  pass,
  pixel,
  posterize,
  screen,
  sepia,
  source,
  tripleMix,
  vignette,
  type GraphHandle,
  type GraphimInstance,
} from 'graphim';
import sampleUrl from '../assets/sample.jpg';
import {
  isAnimatedEffect,
  isEffectId,
  listEffects,
  type EffectId,
} from '../logic/effects';
import { exportBaseName } from '../logic/exportName';
import { createRadialMaskImage } from '../logic/maskImage';
import { renderDagGraph } from './dagGraph';

/**
 * Mount the Graphim playground: sample image, rich effect picker, export.
 */
export function mountApp(root: HTMLElement): void {
  const effects = listEffects();
  const options = effects
    .map(
      (e) =>
        `<option value="${e.id}">${e.label}${e.inputs > 1 ? ` (${e.inputs}in)` : ''}</option>`,
    )
    .join('');

  root.innerHTML = `
    <header class="header">
      <p class="back"><a href="../">← Portal</a></p>
      <h1>Graphim Demo</h1>
      <p>WebGL2 フル DAG — 単一パス / 2〜3 入力ブレンド / Delay</p>
    </header>
    <section class="controls">
      <label>
        Effect
        <select id="effect">${options}</select>
      </label>
      <button type="button" id="export" class="btn">画像を書き出し</button>
    </section>
    <section class="stage-wrap">
      <img id="source" src="${sampleUrl}" alt="Sample for Graphim filters" />
    </section>
    <p id="status" class="status" aria-live="polite"></p>
    <section class="dag-panel" aria-labelledby="dag-title">
      <div class="dag-panel__header">
        <h2 id="dag-title">Effect DAG</h2>
        <p>入力から出力まで、実際に実行されるノード構成</p>
      </div>
      <div id="dag-graph" class="dag-graph"></div>
    </section>
  `;

  const img = root.querySelector<HTMLImageElement>('#source');
  const select = root.querySelector<HTMLSelectElement>('#effect');
  const exportBtn = root.querySelector<HTMLButtonElement>('#export');
  const status = root.querySelector<HTMLParagraphElement>('#status');
  const dagGraph = root.querySelector<HTMLDivElement>('#dag-graph');
  if (!img || !select || !exportBtn || !status || !dagGraph) {
    throw new Error('demo DOM missing');
  }

  let instance: GraphimInstance | null = null;
  let maskImg: HTMLImageElement | null = null;
  let current: EffectId = 'gray';

  const apply = (): void => {
    if (!instance) return;
    instance.stop();
    const graph = buildEffect(current, maskImg);
    instance.setGraph(graph);
    renderDagGraph(dagGraph, graph);
    if (isAnimatedEffect(current)) {
      instance.animate();
      status.textContent = `${current}: animating`;
    } else {
      instance.render();
      status.textContent = `${current}: rendered`;
    }
  };

  const start = async (): Promise<void> => {
    maskImg = await createRadialMaskImage(
      Math.max(img.naturalWidth, img.naturalHeight, 512),
    );
    instance = Graphim.mount({ image: img });
    apply();
  };

  const boot = (): void => {
    void start().catch((err) => {
      status.textContent = `init failed: ${err instanceof Error ? err.message : String(err)}`;
    });
  };

  if (img.complete && img.naturalWidth > 0) boot();
  else img.addEventListener('load', boot, { once: true });

  select.addEventListener('change', () => {
    const value = select.value;
    if (!isEffectId(value)) return;
    current = value;
    apply();
  });

  exportBtn.addEventListener('click', () => {
    void (async () => {
      if (!instance) return;
      try {
        await instance.download({
          fileName: exportBaseName(current),
          type: 'image/png',
        });
        status.textContent = `${current}: exported PNG`;
      } catch (err) {
        status.textContent = `export failed: ${err instanceof Error ? err.message : String(err)}`;
      }
    })();
  });
}

/** Build a DAG handle for the selected demo effect. */
function buildEffect(
  effectId: EffectId,
  maskImg: HTMLImageElement | null,
): GraphHandle {
  const src = source();
  const maskSource = maskImg ? source({ image: maskImg }) : gray(src);

  switch (effectId) {
    case 'gray':
      return gray(src);
    case 'sepia':
      return sepia(src);
    case 'neg':
      return neg(src);
    case 'blur':
      return blur(src, 8);
    case 'bloom':
      return bloom(src, { threshold: 0.45, strength: 2.5, blur: 1.2 });
    case 'pixel':
      return pixel(src, 12);
    case 'frosted':
      return frosted(src, 4);
    case 'vignette':
      return vignette(src, 1.2);
    case 'contrast':
      return contrast(src, { contrast: 1.5, brightness: 0.02 });
    case 'posterize':
      return posterize(src, 5);
    case 'mirror':
      return mirror(src);
    case 'chromatic':
      return chromatic(src, 6);
    case 'edge':
      return edge(src);
    case 'wave':
      return named(pass(
        `
uniform float strength;
void main() {
  vec2 p = vUv - vec2(0.5);
  float falloff = 1.0 - smoothstep(0.12, 0.72, length(p));
  float flowX = sin(p.y * 18.0 + time * 1.1)
    + 0.5 * sin(p.y * 31.0 - time * 0.7);
  float flowY = cos(p.x * 16.0 - time * 0.9)
    + 0.5 * cos(p.x * 27.0 + time * 0.6);
  vec2 flow = vec2(flowX, flowY) * 0.0045 * strength * falloff;
  vec2 prism = normalize(flow + vec2(0.0001)) * 0.0025 * strength;
  float r = texture(uMain, vUv + flow + prism).r;
  float g = texture(uMain, vUv + flow).g;
  float b = texture(uMain, vUv + flow - prism).b;
  fragColor = vec4(r, g, b, texture(uMain, vUv + flow).a);
}
`,
        src,
        { strength: 1 },
      ), 'Prismatic flow');
    case 'mixSplit':
      return mix(sepia(src), gray(src), 0.45);
    case 'bloomGlow':
      return mix(src, bloom(src, { threshold: 0.4, strength: 2.2, blur: 1.5 }), 0.55);
    case 'multiplyDuo':
      return multiply(src, maskSource);
    case 'screenDuo':
      return screen(src, blur(src, 14));
    case 'overlayDuo':
      return overlay(src, posterize(src, 4));
    case 'differenceDuo':
      return difference(src, mirror(src));
    case 'maskRadial':
      return mask(contrast(src, { contrast: 1.2 }), maskSource, 0);
    case 'tripleLook':
      return tripleMix(sepia(src), edge(src), blur(src, 6), [0.45, 0.35, 0.2]);
    case 'trail':
      return mix(src, delay(add(src, blur(src, 10), 0.35)), 0.55);
    default: {
      const _exhaustive: never = effectId;
      return _exhaustive;
    }
  }
}
