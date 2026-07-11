import * as THREE from 'three';
import type { CityState } from '../../types';
import {
  applyZoom,
  centerOnMap,
  createIsoCamera,
  focusLargestClusterNow,
  followCityCenter,
  panByScreenDelta,
  syncIsoCamera,
  takeFocusAnnounce,
  updateIsoCameraProjection,
  type IsoCameraState,
} from './isoCamera';
import { createLights } from './lights';
import { createWorld, type WorldSystem } from './world';

export interface CityRenderer3D {
  render(state: CityState, time: number, dt: number): void;
  /** sync / draw を分けて計測する */
  renderTimed(
    state: CityState,
    time: number,
    dt: number,
  ): { syncMs: number; drawMs: number; calls: number };
  resize(cssW: number, cssH: number): void;
  pan(dx: number, dy: number, viewH: number): void;
  zoom(factor: number): void;
  /** 最大の都市クラスタへ寄せる */
  resetCamera(state: CityState): void;
  /** フォーカスが切り替わったら町名を返す */
  consumeFocusAnnounce(): string | null;
  dispose(): void;
  readonly canvas: HTMLCanvasElement;
}

export function createCityRenderer3D(canvas: HTMLCanvasElement): CityRenderer3D {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.55;

  const scene = new THREE.Scene();
  createLights(scene);

  let aspect = 1;
  const cam: IsoCameraState = createIsoCamera(aspect);
  const world: WorldSystem = createWorld(128, 128);
  scene.add(world.root);

  let cssW = 1;
  let cssH = 1;

  function resize(w: number, h: number): void {
    cssW = Math.max(1, w);
    cssH = Math.max(1, h);
    aspect = cssW / cssH;
    renderer.setSize(cssW, cssH, false);
    updateIsoCameraProjection(cam, aspect);
    syncIsoCamera(cam);
  }

  function render(state: CityState, time: number, dt: number): void {
    followCityCenter(cam, state, dt);
    updateIsoCameraProjection(cam, aspect);
    syncIsoCamera(cam);
    world.sync(state, time);
    renderer.render(scene, cam.camera);
  }

  function renderTimed(
    state: CityState,
    time: number,
    dt: number,
  ): { syncMs: number; drawMs: number; calls: number } {
    followCityCenter(cam, state, dt);
    updateIsoCameraProjection(cam, aspect);
    syncIsoCamera(cam);
    const t0 = performance.now();
    world.sync(state, time);
    const t1 = performance.now();
    renderer.render(scene, cam.camera);
    const t2 = performance.now();
    return {
      syncMs: t1 - t0,
      drawMs: t2 - t1,
      calls: renderer.info.render.calls,
    };
  }

  function pan(dx: number, dy: number, viewH: number): void {
    panByScreenDelta(cam, dx, dy, viewH);
    syncIsoCamera(cam);
  }

  function zoom(factor: number): void {
    applyZoom(cam, factor);
    updateIsoCameraProjection(cam, aspect);
    syncIsoCamera(cam);
  }

  function resetCamera(state: CityState): void {
    centerOnMap(cam, state.width, state.height);
    focusLargestClusterNow(cam, state);
    updateIsoCameraProjection(cam, aspect);
    syncIsoCamera(cam);
  }

  function consumeFocusAnnounce(): string | null {
    return takeFocusAnnounce(cam);
  }

  function dispose(): void {
    world.dispose();
    renderer.dispose();
  }

  return {
    render,
    renderTimed,
    resize,
    pan,
    zoom,
    resetCamera,
    consumeFocusAnnounce,
    dispose,
    canvas,
  };
}
