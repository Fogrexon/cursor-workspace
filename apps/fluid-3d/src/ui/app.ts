import {
  cameraEye,
  createCamera,
  lookAt,
  mul4,
  orbitCamera,
  perspective,
  zoomCamera,
} from '../logic/camera';
import { getPreset, mergeParams, QUALITY_PRESETS } from '../logic/presets';
import { clampDt, invert4, screenToWaterUv } from '../logic/wave';
import { WaveRenderer } from '../render/WaveRenderer';
import { WasmWaveSimulator } from '../sim/wasmBridge';
import type { QualityId, WaveParams } from '../types';

export function mountApp(root: HTMLElement): void {
  root.innerHTML = `
    <div class="app">
      <header class="header">
        <div>
          <a class="back" href="../">← ポータルへ</a>
          <h1>Box Fluid</h1>
        </div>
        <div class="meta">
          <span id="backend">WASM 読込中…</span>
          <span id="fps">— fps</span>
          <span id="count">—</span>
        </div>
      </header>

      <div class="layout">
        <div class="viewport-wrap">
          <canvas id="viewport" aria-label="箱流体ビュー"></canvas>
          <p class="hint">ドラッグで回転 / ホイールでズーム / クリックで押し上げ</p>
        </div>

        <aside class="panel" aria-label="操作パネル">
          <label class="field">
            <span>粒子数</span>
            <select id="quality">
              ${QUALITY_PRESETS.map(
                (p) => `<option value="${p.id}">${p.label}</option>`,
              ).join('')}
            </select>
          </label>

          <label class="field">
            <span>重力 <em id="grav-val">3.50</em></span>
            <input id="gravity" type="range" min="1" max="10" step="0.1" value="3.5" />
          </label>

          <label class="field">
            <span>圧力 <em id="press-val">14.0</em></span>
            <input id="pressure" type="range" min="1" max="40" step="0.5" value="14" />
          </label>

          <label class="field">
            <span>粘性 <em id="visc-val">0.15</em></span>
            <input id="viscosity" type="range" min="0" max="2" step="0.01" value="0.15" />
          </label>

          <label class="field">
            <span>跳ね返り <em id="bounce-val">0.05</em></span>
            <input id="bounce" type="range" min="0" max="0.8" step="0.05" value="0.05" />
          </label>

          <label class="field">
            <span>摩擦 <em id="fric-val">0.06</em></span>
            <input id="friction" type="range" min="0" max="1" step="0.02" value="0.06" />
          </label>

          <div class="actions">
            <button type="button" id="pour" class="btn">追加で注ぐ</button>
            <button type="button" id="pause" class="btn btn-secondary">一時停止</button>
            <button type="button" id="reset" class="btn btn-secondary">リセット</button>
          </div>
        </aside>
      </div>
    </div>
  `;

  const canvas = root.querySelector<HTMLCanvasElement>('#viewport')!;
  const backendEl = root.querySelector('#backend')!;
  const fpsEl = root.querySelector('#fps')!;
  const countEl = root.querySelector('#count')!;
  const qualityEl = root.querySelector<HTMLSelectElement>('#quality')!;
  const gravEl = root.querySelector<HTMLInputElement>('#gravity')!;
  const pressEl = root.querySelector<HTMLInputElement>('#pressure')!;
  const viscEl = root.querySelector<HTMLInputElement>('#viscosity')!;
  const bounceEl = root.querySelector<HTMLInputElement>('#bounce')!;
  const fricEl = root.querySelector<HTMLInputElement>('#friction')!;
  const gravVal = root.querySelector('#grav-val')!;
  const pressVal = root.querySelector('#press-val')!;
  const viscVal = root.querySelector('#visc-val')!;
  const bounceVal = root.querySelector('#bounce-val')!;
  const fricVal = root.querySelector('#fric-val')!;
  const pourBtn = root.querySelector<HTMLButtonElement>('#pour')!;
  const pauseBtn = root.querySelector<HTMLButtonElement>('#pause')!;
  const resetBtn = root.querySelector<HTMLButtonElement>('#reset')!;

  let params: WaveParams = { ...getPreset('medium').params };
  qualityEl.value = 'medium';
  syncSliders(params);

  let cam = createCamera();
  let paused = false;
  let sim: WasmWaveSimulator | null = null;
  let renderer: WaveRenderer | null = null;
  let viewProj: Float32Array = new Float32Array(16);

  const empty = new Float32Array(0);
  const wasmUrl = `${import.meta.env.BASE_URL}wave.wasm`;

  void (async () => {
    try {
      renderer = new WaveRenderer(canvas);
      sim = await WasmWaveSimulator.load(wasmUrl);
      sim.applyParams(params);
      backendEl.textContent = 'WASM SPH';
      countEl.textContent = `${sim.getWaterCount()} particles`;
      loop(performance.now());
    } catch (err) {
      backendEl.textContent = '読込失敗';
      console.error(err);
    }
  })();

  function readSliders(): Partial<WaveParams> {
    return {
      gravity: Number(gravEl.value),
      pressure: Number(pressEl.value),
      viscosity: Number(viscEl.value),
      bounce: Number(bounceEl.value),
      friction: Number(fricEl.value),
    };
  }

  function syncSliders(p: WaveParams): void {
    gravEl.value = String(p.gravity);
    pressEl.value = String(p.pressure);
    viscEl.value = String(p.viscosity);
    bounceEl.value = String(p.bounce);
    fricEl.value = String(p.friction);
    gravVal.textContent = p.gravity.toFixed(2);
    pressVal.textContent = p.pressure.toFixed(1);
    viscVal.textContent = p.viscosity.toFixed(2);
    bounceVal.textContent = p.bounce.toFixed(2);
    fricVal.textContent = p.friction.toFixed(2);
  }

  function applyLiveParams(): void {
    if (!sim) return;
    params = mergeParams(params, readSliders());
    syncSliders(params);
    sim.applyParams(params, false);
  }

  qualityEl.addEventListener('change', () => {
    const preset = getPreset(qualityEl.value as QualityId);
    params = { ...preset.params, ...readSliders(), particleCount: preset.params.particleCount };
    params = mergeParams(params, {});
    syncSliders(params);
    if (sim) {
      sim.applyParams(params, true);
      countEl.textContent = `${sim.getWaterCount()} particles`;
    }
  });

  for (const el of [gravEl, pressEl, viscEl, bounceEl, fricEl]) {
    el.addEventListener('input', () => {
      gravVal.textContent = Number(gravEl.value).toFixed(2);
      pressVal.textContent = Number(pressEl.value).toFixed(1);
      viscVal.textContent = Number(viscEl.value).toFixed(2);
      bounceVal.textContent = Number(bounceEl.value).toFixed(2);
      fricVal.textContent = Number(fricEl.value).toFixed(2);
    });
    el.addEventListener('change', applyLiveParams);
  }

  pourBtn.addEventListener('click', () => {
    if (!sim) return;
    sim.pour(300);
    countEl.textContent = `${sim.getWaterCount()} particles`;
  });

  pauseBtn.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.textContent = paused ? '再開' : '一時停止';
  });

  resetBtn.addEventListener('click', () => {
    if (!sim) return;
    sim.applyParams(params, true);
    countEl.textContent = `${sim.getWaterCount()} particles`;
  });

  let dragging = false;
  let moved = false;
  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    moved = false;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (Math.hypot(dx, dy) > 2) moved = true;
    lastX = e.clientX;
    lastY = e.clientY;
    cam = orbitCamera(cam, dx * 0.005, dy * 0.005);
  });

  canvas.addEventListener('pointerup', (e) => {
    dragging = false;
    if (!moved && sim) {
      const rect = canvas.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      const inv = invert4(viewProj);
      if (inv) {
        const hit = screenToWaterUv(ndcX, ndcY, inv);
        if (hit) sim.splash(hit.u, hit.v);
      }
    }
  });

  canvas.addEventListener('pointercancel', () => {
    dragging = false;
  });

  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      cam = zoomCamera(cam, e.deltaY * 0.0015);
    },
    { passive: false },
  );

  let last = performance.now();
  let frames = 0;
  let fpsAccum = 0;

  function loop(now: number): void {
    const dt = clampDt((now - last) / 1000);
    last = now;
    frames++;
    fpsAccum += dt;
    if (fpsAccum >= 0.5) {
      fpsEl.textContent = `${Math.round(frames / fpsAccum)} fps`;
      frames = 0;
      fpsAccum = 0;
      if (sim) countEl.textContent = `${sim.getWaterCount()} particles`;
    }

    if (sim && renderer) {
      if (!paused) {
        const sub = 5;
        const h = dt / sub;
        for (let i = 0; i < sub; i++) sim.step(h);
      }

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.resize(rect.width, rect.height, dpr);

      const eye = cameraEye(cam);
      const view = lookAt(
        eye,
        { x: cam.targetX, y: cam.targetY, z: cam.targetZ },
        { x: 0, y: 1, z: 0 },
      );
      const proj = perspective(
        Math.PI / 3.5,
        Math.max(rect.width / Math.max(rect.height, 1), 0.1),
        0.05,
        20,
      );
      viewProj = mul4(proj, view);
      renderer.draw(
        sim.getWaterPositions(),
        sim.getWaterCount(),
        empty,
        empty,
        empty,
        0,
        viewProj,
        eye,
      );
    }

    requestAnimationFrame(loop);
  }
}
