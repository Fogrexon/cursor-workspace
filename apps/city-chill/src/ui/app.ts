import type { CityState } from '../types';
import { createSimulation, tickSimulation } from '../logic/simulation';
import { createCityRenderer3D } from './scene/renderer3d';
import { renderHudShell, updateHudControls, updateHudStats } from './hud';

const SPEEDS = [1, 2, 4];
const MAP_SIZE = 256;
/** ベースの 1 日あたり秒数 (大きいほどゆっくり) */
const SECONDS_PER_DAY = 2.8;

export function mountApp(root: HTMLElement): void {
  root.innerHTML = `
    <div class="app">
      <div class="hud" id="hud"></div>
      <canvas id="city-canvas"></canvas>
      <div class="toast" id="toast" hidden></div>
    </div>
  `;

  const canvas = root.querySelector<HTMLCanvasElement>('#city-canvas')!;
  const hudEl = root.querySelector<HTMLElement>('#hud')!;
  const toastEl = root.querySelector<HTMLElement>('#toast')!;

  const view = createCityRenderer3D(canvas);

  let state: CityState = createSimulation({
    seed: Date.now() % 100000,
    width: MAP_SIZE,
    height: MAP_SIZE,
  });
  view.resetCamera(state);

  let paused = false;
  let speedIdx = 0;
  let panelOpen = true;
  /** シェル再描画が必要なときだけ true */
  let hudShellDirty = true;
  const secondsPerDay = SECONDS_PER_DAY;
  let last = performance.now();
  let time = 0;
  let hudTimer = 0;
  let toastTimer = 0;

  let dragging = false;
  let lastMx = 0;
  let lastMy = 0;

  function resize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    view.resize(w, h);
  }

  function rebuildHudShell(): void {
    const body = hudEl.querySelector('.panel-body');
    const scrollTop = body?.scrollTop ?? 0;

    hudEl.innerHTML = renderHudShell(state.stage, state.stats.day, {
      paused,
      speed: SPEEDS[speedIdx]!,
      panelOpen,
    });
    updateHudStats(hudEl, state.stats, state.stage);

    const bodyAfter = hudEl.querySelector('.panel-body');
    if (bodyAfter) bodyAfter.scrollTop = scrollTop;
    hudShellDirty = false;
  }

  function refreshHud(forceShell = false): void {
    if (forceShell || hudShellDirty) {
      rebuildHudShell();
      return;
    }
    // 数値だけ差し替え → panel-body のスクロールは維持される
    updateHudStats(hudEl, state.stats, state.stage);
    updateHudControls(hudEl, {
      paused,
      speed: SPEEDS[speedIdx]!,
      panelOpen,
    });
  }

  function showToast(msg: string): void {
    toastEl.hidden = false;
    toastEl.textContent = msg;
    toastTimer = 2.2;
  }

  const EVENT_LABELS: Record<string, string> = {
    residential: '新しい住宅が建った',
    commercial: '商店がオープン',
    industrial: '工場が稼働開始',
    road: '道路が延伸',
    rail: '線路が敷設された',
    'intercity-rail': '都市間鉄道が開通した',
    crossing: '踏切ができた',
    school: '学校が開校',
    park: '公園が整備された',
    hospital: '病院が完成',
    tower: '高層マンションが建った',
    station: '駅が開業',
    plaza: '広場ができた',
    skyscraper: '超高層ビルがそびえる',
    demolish: '再開発で道路を通した',
    upgrade: '建物がグレードアップ',
    merge: '近くの町がひとつになった',
    bridge: '橋が架かった',
  };

  function frame(now: number): void {
    const rawDt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const dt = paused ? 0 : rawDt * SPEEDS[speedIdx]!;
    time += rawDt;

    if (dt > 0) {
      const prevStage = state.stage;
      const result = tickSimulation(state, dt, secondsPerDay);
      state = result.state;

      for (const e of result.events) {
        const label = EVENT_LABELS[e];
        if (label) showToast(label);
      }
      if (prevStage !== state.stage) {
        showToast(`街が「${stageName(state.stage)}」に成長した`);
      }
    }

    view.render(state, time, rawDt);

    const focusTown = view.consumeFocusAnnounce();
    if (focusTown) showToast(`${focusTown}を眺める`);

    hudTimer -= rawDt;
    if (hudTimer <= 0) {
      refreshHud();
      hudTimer = 0.25;
    }

    if (toastTimer > 0) {
      toastTimer -= rawDt;
      if (toastTimer <= 0) toastEl.hidden = true;
    }

    requestAnimationFrame(frame);
  }

  function stageName(s: CityState['stage']): string {
    return { village: '小さな村', town: '町', city: '都市', metropolis: '大都会' }[s];
  }

  hudEl.addEventListener('click', (ev) => {
    const btn = (ev.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'toggle-panel') {
      panelOpen = !panelOpen;
      hudShellDirty = true;
      refreshHud(true);
    } else if (action === 'pause') {
      paused = !paused;
      refreshHud();
    } else if (action === 'speed') {
      speedIdx = (speedIdx + 1) % SPEEDS.length;
      refreshHud();
    } else if (action === 'reset') {
      state = createSimulation({
        seed: Date.now() % 100000,
        width: MAP_SIZE,
        height: MAP_SIZE,
      });
      view.resetCamera(state);
      showToast('新しい街が始まった');
      hudShellDirty = true;
      refreshHud(true);
    }
  });

  canvas.addEventListener('pointerdown', (ev) => {
    dragging = true;
    lastMx = ev.clientX;
    lastMy = ev.clientY;
    canvas.setPointerCapture(ev.pointerId);
  });
  canvas.addEventListener('pointermove', (ev) => {
    if (!dragging) return;
    const dx = ev.clientX - lastMx;
    const dy = ev.clientY - lastMy;
    lastMx = ev.clientX;
    lastMy = ev.clientY;
    view.pan(dx, dy, window.innerHeight);
  });
  canvas.addEventListener('pointerup', () => {
    dragging = false;
  });
  canvas.addEventListener('pointercancel', () => {
    dragging = false;
  });
  canvas.addEventListener(
    'wheel',
    (ev) => {
      ev.preventDefault();
      const factor = ev.deltaY > 0 ? 0.92 : 1.08;
      view.zoom(factor);
    },
    { passive: false },
  );

  window.addEventListener('resize', resize);
  resize();
  refreshHud(true);
  showToast('小さな村から、物語が始まる');
  requestAnimationFrame(frame);
}
