import WebGPU from 'three/addons/capabilities/WebGPU.js';
import type { PresetId } from '../types';
import { BEACH_MACRO_PRESET, DEFAULT_MACRO_SCALE } from '../logic/macroScale';
import { BEACH_SLOPE_PRESET } from '../logic/beachSlope';
import {
  BOUND_AXIS_MAX,
  BOUND_AXIS_MIN,
  BOUND_HEIGHT_MAX,
  BOUND_HEIGHT_MIN,
  DEFAULT_SIM_BOUNDS,
  formatBounds,
} from '../logic/simBounds';
import {
  DEFAULT_PARTICLE_COUNT,
  estimateSettledDepth,
  listPresets,
  PARTICLE_BUDGETS,
} from '../logic/particles';
import { createMlsMpmSim, type MlsMpmHandle } from './mlsMpmSim';

export async function mountApp(root: HTMLElement): Promise<void> {
  const presets = listPresets();

  if (!WebGPU.isAvailable()) {
    root.innerHTML = `
      <main class="fallback">
        <a class="back" href="../">← ポータルへ戻る</a>
        <h1>Liquid Lab</h1>
        <p>このブラウザは WebGPU に対応していません。Chrome / Edge の最新版で開いてください。</p>
      </main>
    `;
    return;
  }

  root.innerHTML = `
    <div class="layout">
      <header class="top">
        <a class="back" href="../">← ポータルへ戻る</a>
        <h1>Liquid Lab</h1>
        <p>数十メートル規模のシミュレーション範囲で、浅い砂浜のような流体を試せます。</p>
      </header>

      <div class="workspace">
        <div class="viewport" id="viewport">
          <div class="loading" id="loading">WebGPU を初期化中…</div>
        </div>

        <aside class="panel">
          <div class="panel-body">
            <div class="actions">
              <button type="button" id="btn-pause" class="btn">一時停止</button>
              <button type="button" id="btn-reset" class="btn btn-secondary">リセット</button>
            </div>

            <button type="button" id="btn-beach" class="btn btn-beach">砂浜ルックを適用</button>

            <div class="field">
              <label for="preset">プリセット</label>
              <select id="preset">
                ${presets
                  .map((p) => `<option value="${p.id}">${p.label}</option>`)
                  .join('')}
              </select>
            </div>

            <div class="field">
              <label for="count">水量(粒子数)</label>
              <select id="count">
                ${PARTICLE_BUDGETS.map(
                  (b) =>
                    `<option value="${b.count}" ${
                      b.count === DEFAULT_PARTICLE_COUNT ? 'selected' : ''
                    }>${b.label}</option>`,
                ).join('')}
              </select>
            </div>

            <p class="section-label">シミュレーション範囲 (m)</p>

            <div class="field">
              <label for="box-width">幅 (X) <span id="box-width-val">${DEFAULT_SIM_BOUNDS.width.toFixed(0)}</span> m</label>
              <input id="box-width" type="range" min="${BOUND_AXIS_MIN}" max="${BOUND_AXIS_MAX}" step="1" value="${DEFAULT_SIM_BOUNDS.width}" />
            </div>

            <div class="field">
              <label for="box-depth">奥行き (Z) <span id="box-depth-val">${DEFAULT_SIM_BOUNDS.depth.toFixed(0)}</span> m</label>
              <input id="box-depth" type="range" min="${BOUND_AXIS_MIN}" max="${BOUND_AXIS_MAX}" step="1" value="${DEFAULT_SIM_BOUNDS.depth}" />
            </div>

            <div class="field">
              <label for="box-height">高さ (Y) <span id="box-height-val">${DEFAULT_SIM_BOUNDS.height.toFixed(0)}</span> m</label>
              <input id="box-height" type="range" min="${BOUND_HEIGHT_MIN}" max="${BOUND_HEIGHT_MAX}" step="1" value="${DEFAULT_SIM_BOUNDS.height}" />
            </div>

            <p class="section-label">見た目・水深</p>

            <div class="field">
              <label for="time-scale">シミュレーション速度 <span id="time-scale-val">1.00</span></label>
              <input id="time-scale" type="range" min="0.15" max="1.5" step="0.05" value="1" />
            </div>

            <div class="field">
              <label for="fill-ratio">水深比 <span id="fill-ratio-val">0.55</span></label>
              <input id="fill-ratio" type="range" min="0.1" max="0.75" step="0.05" value="0.55" />
            </div>

            <div class="field">
              <label for="splat-scale">描画スケール <span id="splat-scale-val">1.00</span></label>
              <input id="splat-scale" type="range" min="0.6" max="2.8" step="0.05" value="1" />
            </div>

            <div class="field">
              <label for="gravity">重力 <span id="gravity-val">140</span></label>
              <input id="gravity" type="range" min="40" max="280" step="10" value="140" />
            </div>

            <div class="field">
              <label for="viscosity">粘性 <span id="viscosity-val">0.18</span></label>
              <input id="viscosity" type="range" min="0.05" max="0.5" step="0.01" value="0.18" />
            </div>

            <div class="field">
              <label for="stiffness">硬さ <span id="stiffness-val">28</span></label>
              <input id="stiffness" type="range" min="8" max="80" step="1" value="28" />
            </div>

            <div class="field field-toggle">
              <label for="wave-enabled">波発生装置</label>
              <input id="wave-enabled" type="checkbox" checked />
            </div>

            <div class="field">
              <label for="wave-freq">波の周波数 <span id="wave-freq-val">0.55</span> Hz</label>
              <input id="wave-freq" type="range" min="0.05" max="1.5" step="0.05" value="0.55" />
            </div>

            <div class="field">
              <label for="wave-amp">波の振幅 <span id="wave-amp-val">0.035</span></label>
              <input id="wave-amp" type="range" min="0.005" max="0.3" step="0.005" value="0.035" />
            </div>

            <p class="section-label">砂浜斜面</p>

            <div class="field field-toggle">
              <label for="beach-enabled">斜面を表示</label>
              <input id="beach-enabled" type="checkbox" />
            </div>

            <div class="field">
              <label for="beach-slope">傾き <span id="beach-slope-val">0.28</span></label>
              <input id="beach-slope" type="range" min="0.01" max="0.7" step="0.01" value="0.28" />
            </div>

            <div class="field">
              <label for="beach-flat">沖の平坦割合 <span id="beach-flat-val">0.28</span></label>
              <input id="beach-flat" type="range" min="0" max="0.7" step="0.01" value="0.28" />
            </div>

            <dl class="stats">
              <div><dt>粒子数</dt><dd id="stat-count">—</dd></div>
              <div><dt>予想液深</dt><dd id="stat-depth">—</dd></div>
              <div><dt>範囲</dt><dd id="stat-bounds">—</dd></div>
              <div><dt>描画</dt><dd>SSFR + 散乱</dd></div>
            </dl>

            <p class="hint">範囲はメートル単位（幅・奥行き 5〜100 m、高さ 1〜30 m）。広くすると同じ粒子数でも床に薄く広がります。</p>
          </div>
        </aside>
      </div>
    </div>
  `;

  const viewport = root.querySelector<HTMLElement>('#viewport')!;
  const loading = root.querySelector<HTMLElement>('#loading')!;
  const btnPause = root.querySelector<HTMLButtonElement>('#btn-pause')!;
  const btnReset = root.querySelector<HTMLButtonElement>('#btn-reset')!;
  const btnBeach = root.querySelector<HTMLButtonElement>('#btn-beach')!;
  const presetEl = root.querySelector<HTMLSelectElement>('#preset')!;
  const countEl = root.querySelector<HTMLSelectElement>('#count')!;
  const timeScaleEl = root.querySelector<HTMLInputElement>('#time-scale')!;
  const fillRatioEl = root.querySelector<HTMLInputElement>('#fill-ratio')!;
  const splatScaleEl = root.querySelector<HTMLInputElement>('#splat-scale')!;
  const boxWidthEl = root.querySelector<HTMLInputElement>('#box-width')!;
  const boxDepthEl = root.querySelector<HTMLInputElement>('#box-depth')!;
  const boxHeightEl = root.querySelector<HTMLInputElement>('#box-height')!;
  const gravityEl = root.querySelector<HTMLInputElement>('#gravity')!;
  const viscosityEl = root.querySelector<HTMLInputElement>('#viscosity')!;
  const stiffnessEl = root.querySelector<HTMLInputElement>('#stiffness')!;
  const waveEnabledEl = root.querySelector<HTMLInputElement>('#wave-enabled')!;
  const waveFreqEl = root.querySelector<HTMLInputElement>('#wave-freq')!;
  const waveAmpEl = root.querySelector<HTMLInputElement>('#wave-amp')!;
  const beachEnabledEl = root.querySelector<HTMLInputElement>('#beach-enabled')!;
  const beachSlopeEl = root.querySelector<HTMLInputElement>('#beach-slope')!;
  const beachFlatEl = root.querySelector<HTMLInputElement>('#beach-flat')!;
  const timeScaleVal = root.querySelector<HTMLSpanElement>('#time-scale-val')!;
  const fillRatioVal = root.querySelector<HTMLSpanElement>('#fill-ratio-val')!;
  const splatScaleVal = root.querySelector<HTMLSpanElement>('#splat-scale-val')!;
  const boxWidthVal = root.querySelector<HTMLSpanElement>('#box-width-val')!;
  const boxDepthVal = root.querySelector<HTMLSpanElement>('#box-depth-val')!;
  const boxHeightVal = root.querySelector<HTMLSpanElement>('#box-height-val')!;
  const gravityVal = root.querySelector<HTMLSpanElement>('#gravity-val')!;
  const viscosityVal = root.querySelector<HTMLSpanElement>('#viscosity-val')!;
  const stiffnessVal = root.querySelector<HTMLSpanElement>('#stiffness-val')!;
  const waveFreqVal = root.querySelector<HTMLSpanElement>('#wave-freq-val')!;
  const waveAmpVal = root.querySelector<HTMLSpanElement>('#wave-amp-val')!;
  const beachSlopeVal = root.querySelector<HTMLSpanElement>('#beach-slope-val')!;
  const beachFlatVal = root.querySelector<HTMLSpanElement>('#beach-flat-val')!;
  const statCount = root.querySelector<HTMLElement>('#stat-count')!;
  const statDepth = root.querySelector<HTMLElement>('#stat-depth')!;
  const statBounds = root.querySelector<HTMLElement>('#stat-bounds')!;

  let sim: MlsMpmHandle;
  let paused = false;
  try {
    sim = await createMlsMpmSim(viewport, {
      particleCount: DEFAULT_PARTICLE_COUNT,
      gravity: 140,
      viscosity: 0.18,
      stiffness: 28,
      boxWidth: DEFAULT_SIM_BOUNDS.width,
      boxDepth: DEFAULT_SIM_BOUNDS.depth,
      boxHeight: DEFAULT_SIM_BOUNDS.height,
      preset: 'dam-break',
      waveEnabled: true,
      waveFrequency: 0.55,
      waveAmplitude: 0.035,
      ...DEFAULT_MACRO_SCALE,
    });
  } catch (err) {
    loading.textContent =
      err instanceof Error ? err.message : 'WebGPU の初期化に失敗しました。';
    return;
  }
  loading.remove();

  function currentPreset(): PresetId {
    return presetEl.value as PresetId;
  }

  function currentCount(): number {
    return Number(countEl.value);
  }

  function readBounds() {
    return {
      width: Number(boxWidthEl.value),
      depth: Number(boxDepthEl.value),
      height: Number(boxHeightEl.value),
    };
  }

  function currentFillRatio(): number {
    return Number(fillRatioEl.value);
  }

  function updateStats(): void {
    const count = currentCount();
    const bounds = readBounds();
    const fill = currentFillRatio();
    statCount.textContent = count.toLocaleString();
    statDepth.textContent = `${estimateSettledDepth(count, bounds, fill).toFixed(1)} m`;
    statBounds.textContent = formatBounds(bounds);
  }

  function syncParams(): void {
    const g = Number(gravityEl.value);
    const v = Number(viscosityEl.value);
    const s = Number(stiffnessEl.value);
    sim.setGravity(g);
    sim.setViscosity(v);
    sim.setStiffness(s);
    gravityVal.textContent = String(g);
    viscosityVal.textContent = v.toFixed(2);
    stiffnessVal.textContent = String(s);
  }

  function syncMacro(): void {
    const timeScale = Number(timeScaleEl.value);
    const fillRatio = Number(fillRatioEl.value);
    const splatScale = Number(splatScaleEl.value);
    sim.setTimeScale(timeScale);
    sim.setSplatScale(splatScale);
    timeScaleVal.textContent = timeScale.toFixed(2);
    fillRatioVal.textContent = fillRatio.toFixed(2);
    splatScaleVal.textContent = splatScale.toFixed(2);
    updateStats();
  }

  function applyFillRatio(): void {
    const fillRatio = Number(fillRatioEl.value);
    fillRatioVal.textContent = fillRatio.toFixed(2);
    sim.setFillRatio(fillRatio);
    updateStats();
  }

  function applyBounds(): void {
    const bounds = readBounds();
    boxWidthVal.textContent = bounds.width.toFixed(0);
    boxDepthVal.textContent = bounds.depth.toFixed(0);
    boxHeightVal.textContent = bounds.height.toFixed(0);
    sim.setSimBounds(bounds);
    updateStats();
  }

  function syncWave(): void {
    const enabled = waveEnabledEl.checked;
    const freq = Number(waveFreqEl.value);
    const amp = Number(waveAmpEl.value);
    sim.setWaveEnabled(enabled);
    sim.setWaveFrequency(freq);
    sim.setWaveAmplitude(amp);
    waveFreqVal.textContent = freq.toFixed(2);
    waveAmpVal.textContent = amp.toFixed(3);
    waveFreqEl.disabled = !enabled;
    waveAmpEl.disabled = !enabled;
  }

  function syncBeach(): void {
    const enabled = beachEnabledEl.checked;
    const slope = Number(beachSlopeEl.value);
    const flatFraction = Number(beachFlatEl.value);
    sim.setBeachSlope({ enabled, slope, flatFraction });
    beachSlopeVal.textContent = slope.toFixed(2);
    beachFlatVal.textContent = flatFraction.toFixed(2);
    beachSlopeEl.disabled = !enabled;
    beachFlatEl.disabled = !enabled;
  }

  function writeControlsFromBeach(): void {
    const p = BEACH_MACRO_PRESET;
    const b = BEACH_SLOPE_PRESET;
    timeScaleEl.value = String(p.timeScale);
    fillRatioEl.value = String(p.fillRatio);
    splatScaleEl.value = String(p.splatScale);
    boxWidthEl.value = String(p.boxWidth);
    boxDepthEl.value = String(p.boxDepth);
    boxHeightEl.value = String(p.boxHeight);
    gravityEl.value = String(p.gravity);
    viscosityEl.value = String(p.viscosity);
    stiffnessEl.value = String(p.stiffness);
    waveEnabledEl.checked = p.waveEnabled;
    waveFreqEl.value = String(p.waveFrequency);
    waveAmpEl.value = String(p.waveAmplitude);
    beachEnabledEl.checked = b.enabled;
    beachSlopeEl.value = String(b.slope);
    beachFlatEl.value = String(b.flatFraction);
    boxWidthVal.textContent = p.boxWidth.toFixed(0);
    boxDepthVal.textContent = p.boxDepth.toFixed(0);
    boxHeightVal.textContent = p.boxHeight.toFixed(0);
    syncParams();
    syncMacro();
    syncWave();
    syncBeach();
    updateStats();
  }

  btnPause.addEventListener('click', (e) => {
    e.preventDefault();
    paused = !paused;
    sim.setPaused(paused);
    btnPause.textContent = paused ? '再開' : '一時停止';
  });

  btnReset.addEventListener('click', (e) => {
    e.preventDefault();
    sim.reset(currentPreset());
  });

  btnBeach.addEventListener('click', (e) => {
    e.preventDefault();
    sim.applyBeachLook();
    writeControlsFromBeach();
  });

  presetEl.addEventListener('change', () => {
    sim.reset(currentPreset());
  });

  countEl.addEventListener('change', () => {
    sim.setParticleCount(currentCount());
    updateStats();
  });

  for (const el of [boxWidthEl, boxDepthEl, boxHeightEl]) {
    el.addEventListener('input', () => {
      boxWidthVal.textContent = Number(boxWidthEl.value).toFixed(0);
      boxDepthVal.textContent = Number(boxDepthEl.value).toFixed(0);
      boxHeightVal.textContent = Number(boxHeightEl.value).toFixed(0);
      applyBounds();
    });
  }

  gravityEl.addEventListener('input', () => {
    syncParams();
    updateStats();
  });
  viscosityEl.addEventListener('input', syncParams);
  stiffnessEl.addEventListener('input', syncParams);
  timeScaleEl.addEventListener('input', syncMacro);
  splatScaleEl.addEventListener('input', syncMacro);
  fillRatioEl.addEventListener('input', () => {
    fillRatioVal.textContent = Number(fillRatioEl.value).toFixed(2);
  });
  fillRatioEl.addEventListener('change', applyFillRatio);
  fillRatioEl.addEventListener('pointerup', applyFillRatio);
  waveEnabledEl.addEventListener('change', syncWave);
  waveFreqEl.addEventListener('input', syncWave);
  waveAmpEl.addEventListener('input', syncWave);
  beachEnabledEl.addEventListener('change', syncBeach);
  beachSlopeEl.addEventListener('input', syncBeach);
  beachFlatEl.addEventListener('input', syncBeach);
  syncParams();
  syncMacro();
  syncWave();
  syncBeach();
  updateStats();

  const onResize = () => sim.resize();
  window.addEventListener('resize', onResize);

  (root as HTMLElement & { __dispose?: () => void }).__dispose = () => {
    window.removeEventListener('resize', onResize);
    sim.dispose();
  };
}
