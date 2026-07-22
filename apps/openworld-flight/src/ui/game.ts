import * as THREE from 'three';
import {
  createPlaneState,
  createSoftCamera,
  createSpeedCam,
  formatAltitude,
  formatSpeed,
  stepPlane,
  stepSoftCamera,
  stepSpeedCam,
  type SoftCameraState,
  type SpeedCamState,
} from '../logic/flight';
import {
  allCollected,
  collectedCount,
  createRingCourse,
  tryCollectRing,
} from '../logic/rings';
import { buildTownLayout, uniqueAssets } from '../logic/townLayout';
import type { GamePhase, PlaneState, Ring } from '../types';
import { createInputController } from './input';
import { createGround, instantiateTown, loadKitLibrary } from './kitLoader';
import { createPlaneMesh } from './planeMesh';
import { createFlightEffects, pulseRingMaterial } from './effects';

export type GameHud = {
  setStatus(text: string): void;
  setSpeed(text: string): void;
  setAltitude(text: string): void;
  setRings(text: string): void;
  showOverlay(title: string, body: string, button: string): void;
  hideOverlay(): void;
};

export type FlightGame = {
  start(): void;
  dispose(): void;
};

export async function createFlightGame(
  canvas: HTMLCanvasElement,
  hud: GameHud,
): Promise<FlightGame> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7eb6e0);
  scene.fog = new THREE.FogExp2(0x9ec5e8, 0.0024);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.3, 1000);

  const hemi = new THREE.HemisphereLight(0xe8f4ff, 0x6b7a4a, 0.95);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff2d6, 1.45);
  sun.position.set(100, 140, 60);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = 450;
  sun.shadow.camera.left = -200;
  sun.shadow.camera.right = 200;
  sun.shadow.camera.top = 200;
  sun.shadow.camera.bottom = -200;
  scene.add(sun);

  const sunDisc = new THREE.Mesh(
    new THREE.CircleGeometry(14, 32),
    new THREE.MeshBasicMaterial({ color: 0xfff0c0, fog: false, depthWrite: false }),
  );
  sunDisc.position.set(180, 120, -80);
  sunDisc.lookAt(0, 40, 0);
  scene.add(sunDisc);

  hud.setStatus('キット読み込み中…');
  const layout = buildTownLayout();
  const lib = await loadKitLibrary(uniqueAssets(layout));
  scene.add(createGround());
  scene.add(instantiateTown(lib, layout));

  const attitude = new THREE.Group();
  const planeMesh = createPlaneMesh();
  attitude.add(planeMesh);
  scene.add(attitude);
  const prop = planeMesh.getObjectByName('propeller');

  const ringMeshes = new Map<string, THREE.Mesh>();
  const ringMats = new Map<string, THREE.MeshStandardMaterial>();
  let rings: Ring[] = createRingCourse();
  const ringGroup = new THREE.Group();
  scene.add(ringGroup);
  for (const ring of rings) {
    const tube = Math.max(0.08, ring.radius * 0.08);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffc857,
      emissive: 0xc47a00,
      emissiveIntensity: 0.45,
      roughness: 0.35,
      metalness: 0.25,
    });
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(ring.radius * 0.72, tube, 8, 28), mat);
    mesh.position.set(ring.x, ring.y, ring.z);
    mesh.rotation.y = Math.PI / 2;
    ringMeshes.set(ring.id, mesh);
    ringMats.set(ring.id, mat);
    ringGroup.add(mesh);
  }

  const effects = createFlightEffects(scene);
  let fxTime = 0;

  const input = createInputController();
  let plane: PlaneState = createPlaneState();
  let softCam: SoftCameraState = createSoftCamera(plane);
  let speedCam: SpeedCamState = createSpeedCam();
  let prevSpeed = plane.speed;
  const BASE_FOV = 55;
  let phase: GamePhase = 'ready';
  let raf = 0;
  let last = performance.now();
  let running = false;

  function resize() {
    const parent = canvas.parentElement;
    const w = Math.max(1, parent?.clientWidth ?? canvas.clientWidth);
    const h = Math.max(1, parent?.clientHeight ?? canvas.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function syncVisuals(dt: number) {
    fxTime += dt;
    attitude.position.set(plane.position.x, plane.position.y, plane.position.z);
    attitude.rotation.order = 'YXZ';
    // Sim + camera use plane.yaw; mesh yaw is mirrored for −Z fuselage under parent Ry.
    attitude.rotation.y = -plane.yaw;
    attitude.rotation.x = plane.pitch;
    attitude.rotation.z = plane.roll;

    if (prop) prop.rotation.z += plane.speed * dt * 8;

    speedCam = stepSpeedCam(speedCam, plane.speed, prevSpeed, dt);
    prevSpeed = plane.speed;

    // Soft chase + accel/decel framing kicks
    softCam = stepSoftCamera(
      softCam,
      plane,
      dt,
      1.1,
      1.6,
      2.2,
      speedCam.backOffset,
      speedCam.lookLift,
    );
    camera.position.set(softCam.position.x, softCam.position.y, softCam.position.z);
    camera.up.set(0, 1, 0);
    camera.lookAt(softCam.lookAt.x, softCam.lookAt.y, softCam.lookAt.z);
    camera.fov = BASE_FOV + speedCam.fovOffset;
    camera.updateProjectionMatrix();

    for (const ring of rings) {
      const mesh = ringMeshes.get(ring.id);
      const mat = ringMats.get(ring.id);
      if (!mesh) continue;
      mesh.visible = !ring.collected;
      if (!ring.collected) {
        mesh.rotation.z += dt * 1.1;
        mesh.rotation.x = Math.sin(fxTime * 1.4 + ring.x * 0.01) * 0.15;
        if (mat) pulseRingMaterial(mat, fxTime + ring.z * 0.01);
      }
    }

    effects.update(dt, plane, running && phase === 'flying');
  }

  function updateHud() {
    hud.setSpeed(formatSpeed(plane.speed));
    hud.setAltitude(formatAltitude(plane.position.y));
    hud.setRings(`${collectedCount(rings)} / ${rings.length}`);
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    resize();

    if (running && phase === 'flying') {
      plane = stepPlane(plane, input.sample(), dt);
      const result = tryCollectRing(plane, rings);
      rings = result.rings;
      if (result.collectedId) {
        const got = rings.find((r) => r.id === result.collectedId);
        if (got) effects.burstAt(got.x, got.y, got.z);
        hud.setStatus(`リング取得！ (${collectedCount(rings)}/${rings.length})`);
      }
      if (allCollected(rings)) {
        phase = 'cleared';
        running = false;
        hud.setStatus('全リングクリア！');
        hud.showOverlay(
          'クリア！',
          '村のスカイコースをすべて通過しました。もう一周しますか？',
          'もう一度',
        );
      }
    }

    syncVisuals(dt);
    updateHud();
    renderer.render(scene, camera);
  }

  function start() {
    plane = createPlaneState();
    softCam = createSoftCamera(plane);
    speedCam = createSpeedCam();
    prevSpeed = plane.speed;
    camera.fov = BASE_FOV;
    camera.updateProjectionMatrix();
    rings = createRingCourse().map((r) => ({ ...r, collected: false }));
    for (const ring of rings) {
      const mesh = ringMeshes.get(ring.id);
      if (mesh) mesh.visible = true;
    }
    effects.reset();
    phase = 'flying';
    running = true;
    hud.hideOverlay();
    hud.setStatus('離陸！ リングをくぐろう');
    last = performance.now();
  }

  resize();
  raf = requestAnimationFrame(frame);
  hud.setStatus('準備完了');
  hud.showOverlay(
    'Openworld Flight',
    'openworld-kit の村をミニチュア飛行機で飛び回ろう。WASD / 矢印で姿勢、Shift 加速、Ctrl 減速、Q/E でロール。黄色いリングをすべてくぐるとクリア。',
    '離陸する',
  );

  return {
    start,
    dispose() {
      cancelAnimationFrame(raf);
      input.dispose();
      effects.dispose();
      renderer.dispose();
    },
  };
}
