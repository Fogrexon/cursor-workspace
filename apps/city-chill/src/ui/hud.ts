import type { CityStats, GrowthStage } from '../types';
import { stageLabel } from '../logic/stats';

function barHtml(value: number, max: number, color: string): string {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return `<div class="bar"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div>`;
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString('ja-JP');
}

export interface HudControls {
  paused: boolean;
  speed: number;
  panelOpen: boolean;
}

/** 初回・開閉時のみフル描画。スクロール位置を壊さない */
export function renderHudShell(
  stage: GrowthStage,
  day: number,
  controls: HudControls,
): string {
  const { paused, speed, panelOpen } = controls;
  const controlBtns = `
      <div class="controls">
        <button type="button" data-action="pause" class="btn">${paused ? '再開' : '一時停止'}</button>
        <button type="button" data-action="speed" class="btn btn-ghost">速度 ×${speed}</button>
        <button type="button" data-action="reset" class="btn btn-ghost">最初から</button>
      </div>`;

  const panel = panelOpen
    ? `
    <aside class="panel" id="stats-panel" aria-label="都市の状態">
      <div class="panel-head">
        <h2>都市の状態</h2>
        <button type="button" data-action="toggle-panel" class="btn-icon" aria-label="パネルを閉じる" title="閉じる">×</button>
      </div>
      <div class="panel-body" id="stats-body">
        <dl class="stats" id="stats-list"></dl>
        ${controlBtns}
        <p class="hint">ドラッグで視点移動 · ホイールでズーム</p>
      </div>
    </aside>`
    : `
    <div class="panel-collapsed" id="stats-panel-collapsed">
      <button type="button" data-action="toggle-panel" class="btn btn-ghost panel-open-btn" aria-label="都市の状態を開く">
        状態
      </button>
      ${controlBtns}
    </div>`;

  return `
    <header class="top-bar">
      <div class="brand">
        <a class="back" href="../">← ポータル</a>
        <h1>City Chill</h1>
        <p class="tagline">街が育つのを、ただ眺める</p>
      </div>
      <div class="stage-badge" data-stage="${stage}">
        <span class="stage-label" id="hud-stage">${stageLabel(stage)}</span>
        <span class="day" id="hud-day">Day ${day}</span>
      </div>
    </header>
    ${panel}
  `;
}

/** 数値だけ更新（パネル DOM は維持 → スクロール保持） */
export function updateHudStats(
  root: HTMLElement,
  stats: CityStats,
  stage: GrowthStage,
): void {
  const stageEl = root.querySelector('#hud-stage');
  if (stageEl) stageEl.textContent = stageLabel(stage);
  const dayEl = root.querySelector('#hud-day');
  if (dayEl) dayEl.textContent = `Day ${stats.day}`;
  const badge = root.querySelector('.stage-badge');
  if (badge) badge.setAttribute('data-stage', stage);

  const list = root.querySelector('#stats-list');
  if (!list) return;

  list.innerHTML = `
        <div class="stat">
          <dt>人口</dt>
          <dd>${fmt(stats.population)} <span class="muted">/ 住宅 ${fmt(stats.housing)}</span></dd>
          ${barHtml(stats.population, Math.max(stats.housing, 1), 'var(--color-accent)')}
        </div>
        <div class="stat">
          <dt>雇用</dt>
          <dd>${fmt(stats.jobs)}</dd>
          ${barHtml(stats.jobs, Math.max(stats.population * 0.7, 1), 'var(--color-success)')}
        </div>
        <div class="stat">
          <dt>交通</dt>
          <dd>${fmt(stats.transport)}</dd>
          ${barHtml(stats.transport, Math.max(stats.population / 8, 20), '#6ec8ff')}
        </div>
        <div class="stat">
          <dt>教育</dt>
          <dd>${fmt(stats.education)}</dd>
          ${barHtml(stats.education, 100, '#e0c060')}
        </div>
        <div class="stat">
          <dt>幸福度</dt>
          <dd>${fmt(stats.happiness)}</dd>
          ${barHtml(stats.happiness, 100, '#ff8ab0')}
        </div>
        <div class="stat">
          <dt>予算</dt>
          <dd class="${stats.budget < 0 ? 'danger' : ''}">¥${fmt(stats.budget)}${
            stats.budget < 0 ? ' <span class="muted">（借入）</span>' : ''
          }</dd>
        </div>
        <div class="stat row">
          <div><dt>商業</dt><dd>${fmt(stats.commerce)}</dd></div>
          <div><dt>産業</dt><dd>${fmt(stats.industry)}</dd></div>
        </div>`;
}

/** 一時停止・速度ボタンのラベルだけ更新 */
export function updateHudControls(root: HTMLElement, controls: HudControls): void {
  const pauseBtn = root.querySelector<HTMLButtonElement>('button[data-action="pause"]');
  if (pauseBtn) pauseBtn.textContent = controls.paused ? '再開' : '一時停止';
  const speedBtn = root.querySelector<HTMLButtonElement>('button[data-action="speed"]');
  if (speedBtn) speedBtn.textContent = `速度 ×${controls.speed}`;
}
