import type { CityState } from '../types';
import { createSimulation, tickSimulation } from './simulation';

export interface FrameProfile {
  /** 通常フレーム（建設日以外）の tick 平均 ms */
  idleTickMs: number;
  /** 建設日を含む tick 平均 ms */
  buildTickMs: number;
  /** 車両更新だけの平均 ms（建設なしフレーム） */
  vehicleMs: number;
  days: number;
  vehicles: number;
  roads: number;
  population: number;
}

/**
 * 成長後の都市でシミュレーション負荷を測る（描画なし）。
 * Node / ブラウザ両対応。
 */
export function profileSimulation(options?: {
  width?: number;
  height?: number;
  seed?: number;
  growDays?: number;
  sampleFrames?: number;
}): FrameProfile {
  const width = options?.width ?? 128;
  const height = options?.height ?? 128;
  const seed = options?.seed ?? 42;
  const growDays = options?.growDays ?? 120;
  const sampleFrames = options?.sampleFrames ?? 180;

  let state = createSimulation({ width, height, seed, secondsPerDay: 0.4 });

  // ある程度育てる
  while (state.stats.day < growDays) {
    state = tickSimulation(state, 0.4, 0.4).state;
  }

  let idleSum = 0;
  let idleN = 0;
  let buildSum = 0;
  let buildN = 0;

  for (let i = 0; i < sampleFrames; i++) {
    const dayBefore = state.stats.day;
    const t0 = performance.now();
    state = tickSimulation(state, 1 / 60, 2.8).state;
    const dt = performance.now() - t0;
    if (state.stats.day > dayBefore) {
      buildSum += dt;
      buildN += 1;
    } else {
      idleSum += dt;
      idleN += 1;
    }
  }

  // 車両更新だけ切り出し（建設クールダウンを先送り）
  state.buildCooldown = 999;
  let vehicleSum = 0;
  const vehicleFrames = 120;
  for (let i = 0; i < vehicleFrames; i++) {
    const t0 = performance.now();
    state = tickSimulation(state, 1 / 60, 2.8).state;
    vehicleSum += performance.now() - t0;
  }

  let roads = 0;
  for (const t of state.tiles) {
    if (t.kind === 'road' || t.kind === 'bridge' || t.kind === 'crossing') roads += 1;
  }

  return {
    idleTickMs: idleN ? idleSum / idleN : 0,
    buildTickMs: buildN ? buildSum / buildN : 0,
    vehicleMs: vehicleSum / vehicleFrames,
    days: state.stats.day,
    vehicles: state.vehicles.length,
    roads,
    population: state.stats.population,
  };
}

/** ランタイム用の移動平均プロファイラ */
export function createFrameProfiler() {
  const alpha = 0.08;
  let simMs = 0;
  let syncMs = 0;
  let drawMs = 0;
  let fps = 60;
  let last = performance.now();
  let frames = 0;
  let fpsAccum = 0;

  return {
    beginFrame(now: number) {
      const raw = Math.max(1e-3, (now - last) / 1000);
      last = now;
      frames += 1;
      fpsAccum += raw;
      if (fpsAccum >= 0.5) {
        fps = frames / fpsAccum;
        frames = 0;
        fpsAccum = 0;
      }
    },
    markSim(ms: number) {
      simMs = simMs * (1 - alpha) + ms * alpha;
    },
    markSync(ms: number) {
      syncMs = syncMs * (1 - alpha) + ms * alpha;
    },
    markDraw(ms: number) {
      drawMs = drawMs * (1 - alpha) + ms * alpha;
    },
    snapshot() {
      return {
        fps,
        simMs,
        syncMs,
        drawMs,
        totalMs: simMs + syncMs + drawMs,
      };
    },
  };
}

export type FrameProfiler = ReturnType<typeof createFrameProfiler>;

/** デバッグ表示用の短い文字列 */
export function formatProfileLine(
  p: ReturnType<FrameProfiler['snapshot']>,
  extra?: { calls?: number; triangles?: number; vehicles?: number },
): string {
  const parts = [
    `${p.fps.toFixed(0)}fps`,
    `sim ${p.simMs.toFixed(1)}`,
    `sync ${p.syncMs.toFixed(1)}`,
    `draw ${p.drawMs.toFixed(1)}`,
  ];
  if (extra?.calls != null) parts.push(`calls ${extra.calls}`);
  if (extra?.vehicles != null) parts.push(`veh ${extra.vehicles}`);
  return parts.join(' · ');
}

/** CityState の簡易メトリクス（描画負荷の代理） */
export function countRenderProxies(state: CityState): {
  buildings: number;
  vehicles: number;
} {
  let buildings = 0;
  for (const t of state.tiles) {
    if (
      t.kind === 'residential' ||
      t.kind === 'commercial' ||
      t.kind === 'industrial' ||
      t.kind === 'tower' ||
      t.kind === 'skyscraper' ||
      t.kind === 'school' ||
      t.kind === 'hospital' ||
      t.kind === 'station' ||
      t.kind === 'park' ||
      t.kind === 'plaza'
    ) {
      buildings += 1;
    }
  }
  return { buildings, vehicles: state.vehicles.length };
}
