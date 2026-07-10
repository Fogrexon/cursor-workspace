import * as THREE from 'three';
import type { CityState } from '../../types';
import {
  autoZoomForCluster,
  computeCityClusters,
  type CityCluster,
} from '../../logic/cameraClusters';

/** タイル 1 辺のワールド単位 */
export const TILE = 1;

/** 1 クラスタを眺める秒数 */
const FOCUS_HOLD_MIN = 14;
const FOCUS_HOLD_MAX = 22;
/** クラスタ再計算の間隔（秒） */
const RECLUSTER_INTERVAL = 8;

export interface IsoCameraState {
  /** 注視点 (ワールド XZ) */
  target: THREE.Vector3;
  /** ユーザーパンオフセット (ワールド) */
  pan: THREE.Vector3;
  /** フラスタム高さの基準 (小さいほどズームイン) */
  zoom: number;
  /** クラスタ規模連動の目標ズーム */
  autoZoom: number;
  camera: THREE.OrthographicCamera;
  /** キャッシュした都市クラスタ */
  clusters: CityCluster[];
  /** フォーカス中クラスタのインデックス */
  focusIndex: number;
  /** 次にクラスタを切り替えるまでの残り秒 */
  focusTimer: number;
  /** 次にクラスタを再計算するまでの残り秒 */
  reclusterTimer: number;
  /** 目標 autoZoom（スムーズ追従用） */
  targetAutoZoom: number;
  /** フォーカス切替時の町名アナウンス */
  focusAnnounce: string | null;
}

const ISO_AZIMUTH = Math.PI / 4;
const ISO_ELEVATION = Math.atan(1 / Math.sqrt(2));
const CAM_DIST = 220;

export function createIsoCamera(aspect: number): IsoCameraState {
  const frustum = 18;
  const camera = new THREE.OrthographicCamera(
    (-frustum * aspect) / 2,
    (frustum * aspect) / 2,
    frustum / 2,
    -frustum / 2,
    0.1,
    2000,
  );
  camera.position.set(0, 0, 0);
  return {
    target: new THREE.Vector3(0, 0, 0),
    pan: new THREE.Vector3(0, 0, 0),
    zoom: 1,
    autoZoom: 0.72,
    camera,
    clusters: [],
    focusIndex: -1,
    focusTimer: 0,
    reclusterTimer: 0,
    targetAutoZoom: 0.72,
    focusAnnounce: null,
  };
}

export function gridToWorld(gx: number, gy: number, out = new THREE.Vector3()): THREE.Vector3 {
  return out.set(gx * TILE, 0, gy * TILE);
}

export function panByScreenDelta(
  state: IsoCameraState,
  dx: number,
  dy: number,
  viewH: number,
): void {
  const frustumH = getFrustumHeight(state);
  const worldPerPx = frustumH / viewH;
  const right = new THREE.Vector3(1, 0, -1).normalize();
  const up = new THREE.Vector3(-1, 0, -1).normalize();
  state.pan.addScaledVector(right, -dx * worldPerPx);
  state.pan.addScaledVector(up, dy * worldPerPx);
}

export function applyZoom(state: IsoCameraState, factor: number): void {
  state.zoom = Math.max(0.45, Math.min(1.8, state.zoom * factor));
}

function getFrustumHeight(state: IsoCameraState): number {
  return 28 / (state.zoom * state.autoZoom);
}

export function updateIsoCameraProjection(state: IsoCameraState, aspect: number): void {
  const h = getFrustumHeight(state);
  const w = h * aspect;
  const cam = state.camera;
  cam.left = -w / 2;
  cam.right = w / 2;
  cam.top = h / 2;
  cam.bottom = -h / 2;
  cam.updateProjectionMatrix();
}

export function syncIsoCamera(state: IsoCameraState): void {
  const look = new THREE.Vector3().copy(state.target).add(state.pan);
  const x = look.x + CAM_DIST * Math.cos(ISO_ELEVATION) * Math.sin(ISO_AZIMUTH);
  const y = look.y + CAM_DIST * Math.sin(ISO_ELEVATION);
  const z = look.z + CAM_DIST * Math.cos(ISO_ELEVATION) * Math.cos(ISO_AZIMUTH);
  state.camera.position.set(x, y, z);
  state.camera.lookAt(look);
  state.camera.updateMatrixWorld();
}

function holdDuration(): number {
  return FOCUS_HOLD_MIN + Math.random() * (FOCUS_HOLD_MAX - FOCUS_HOLD_MIN);
}

function refreshClusters(state: IsoCameraState, city: CityState): void {
  const prev = state.focusIndex >= 0 ? state.clusters[state.focusIndex] : null;
  state.clusters = computeCityClusters(
    city.tiles,
    city.width,
    city.height,
    city.settlements,
  );
  state.reclusterTimer = RECLUSTER_INTERVAL;

  if (state.clusters.length === 0) {
    state.focusIndex = -1;
    return;
  }

  // 再計算後も近いクラスタを維持
  if (prev) {
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < state.clusters.length; i++) {
      const c = state.clusters[i]!;
      const d = Math.hypot(c.cx - prev.cx, c.cy - prev.cy);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    state.focusIndex = best;
    const cur = state.clusters[best]!;
    state.targetAutoZoom = autoZoomForCluster(cur);
  }
}

function pickFocusIndex(clusters: CityCluster[], current: number): number {
  if (clusters.length === 0) return -1;
  if (clusters.length === 1) return 0;
  // 規模で重み付けしつつ、今と違うものを優先
  const weights = clusters.map((c, i) => {
    const base = Math.sqrt(c.size);
    return i === current ? base * 0.15 : base;
  });
  const sum = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * sum;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return i;
  }
  return clusters.length - 1;
}

function applyFocus(
  state: IsoCameraState,
  index: number,
  announce: boolean,
): void {
  if (index < 0 || index >= state.clusters.length) return;
  const c = state.clusters[index]!;
  const changed = index !== state.focusIndex;
  state.focusIndex = index;
  state.focusTimer = holdDuration();
  state.targetAutoZoom = autoZoomForCluster(c);
  if (changed || announce) {
    state.pan.set(0, 0, 0);
    if (c.label) state.focusAnnounce = c.label;
  }
}

/**
 * 一定間隔で開発タイルをクラスタリングし、塊の中心を眺める。
 * ズームはクラスタの大きさに連動（大きい都市ほど引く）。
 */
export function followCityCenter(state: IsoCameraState, city: CityState, dt: number): void {
  state.reclusterTimer -= dt;
  state.focusTimer -= dt;

  if (state.clusters.length === 0 || state.reclusterTimer <= 0) {
    refreshClusters(state, city);
  }

  if (state.clusters.length === 0) {
    // フォールバック: 集落があればその中心
    const s = city.settlements[0];
    if (s) {
      const k = 1 - Math.exp(-0.45 * dt);
      state.target.x += (s.cx * TILE - state.target.x) * k;
      state.target.z += (s.cy * TILE - state.target.z) * k;
    }
    return;
  }

  if (state.focusIndex < 0 || state.focusIndex >= state.clusters.length || state.focusTimer <= 0) {
    const next = pickFocusIndex(state.clusters, state.focusIndex);
    applyFocus(state, next, true);
  }

  const focus = state.clusters[state.focusIndex];
  if (focus) {
    const tx = focus.cx * TILE;
    const tz = focus.cy * TILE;
    const k = 1 - Math.exp(-0.5 * dt);
    state.target.x += (tx - state.target.x) * k;
    state.target.z += (tz - state.target.z) * k;
    state.autoZoom +=
      (state.targetAutoZoom - state.autoZoom) * (1 - Math.exp(-0.35 * dt));
  }
}

export function takeFocusAnnounce(state: IsoCameraState): string | null {
  const name = state.focusAnnounce;
  state.focusAnnounce = null;
  return name;
}

export function centerOnMap(state: IsoCameraState, width: number, height: number): void {
  state.target.set(((width - 1) / 2) * TILE, 0, ((height - 1) / 2) * TILE);
  state.pan.set(0, 0, 0);
  state.zoom = 1;
  state.autoZoom = 0.72;
  state.targetAutoZoom = 0.72;
  state.clusters = [];
  state.focusIndex = -1;
  state.focusTimer = 0;
  state.reclusterTimer = 0;
  state.focusAnnounce = null;
}

/** リセット直後: クラスタを計算して最大の塊へ寄せる */
export function focusLargestClusterNow(state: IsoCameraState, city: CityState): void {
  refreshClusters(state, city);
  if (state.clusters.length === 0) {
    const s = city.settlements[0];
    if (s) {
      state.target.set(s.cx * TILE, 0, s.cy * TILE);
      if (s.name) state.focusAnnounce = s.name;
    }
    return;
  }
  applyFocus(state, 0, true);
  const c = state.clusters[0]!;
  state.target.set(c.cx * TILE, 0, c.cy * TILE);
  state.autoZoom = state.targetAutoZoom;
}
