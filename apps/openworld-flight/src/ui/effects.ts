import * as THREE from 'three';
import { forwardFromAttitude } from '../logic/flight';
import type { PlaneState } from '../types';

export type FlightEffects = {
  update(dt: number, plane: PlaneState, flying: boolean): void;
  burstAt(x: number, y: number, z: number, color?: number): void;
  reset(): void;
  dispose(): void;
};

type BurstParticle = {
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
  vz: number;
};

/** Atmospheric + plane FX for the miniature flight scene. */
export function createFlightEffects(scene: THREE.Scene): FlightEffects {
  const root = new THREE.Group();
  root.name = 'effects';
  scene.add(root);

  root.frustumCulled = false;

  // --- Soft sky clouds (billboard-ish discs) ---
  const cloudMat = new THREE.MeshBasicMaterial({
    color: 0xf4f7fb,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const clouds: THREE.Mesh[] = [];
  for (let i = 0; i < 28; i++) {
    const w = 18 + (i % 5) * 6;
    const mesh = new THREE.Mesh(new THREE.CircleGeometry(w, 20), cloudMat.clone());
    mesh.rotation.x = -Math.PI / 2 + 0.08;
    mesh.position.set(
      (i * 37) % 220 - 110,
      28 + (i % 7) * 4,
      (i * 53) % 240 - 120,
    );
    mesh.renderOrder = -1;
    mesh.frustumCulled = false;
    root.add(mesh);
    clouds.push(mesh);
  }

  function disableCull(obj: THREE.Object3D) {
    obj.frustumCulled = false;
  }

  function followBounds(geo: THREE.BufferGeometry, plane: PlaneState, radius: number) {
    if (!geo.boundingSphere) geo.boundingSphere = new THREE.Sphere();
    geo.boundingSphere.center.set(plane.position.x, plane.position.y, plane.position.z);
    geo.boundingSphere.radius = radius;
  }

  // --- Ambient dust / pollen ---
  const dustCount = 400;
  const dustPos = new Float32Array(dustCount * 3);
  const dustBase = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const x = (Math.random() - 0.5) * 180;
    const y = 2 + Math.random() * 40;
    const z = (Math.random() - 0.5) * 180;
    dustPos[i * 3] = x;
    dustPos[i * 3 + 1] = y;
    dustPos[i * 3 + 2] = z;
    dustBase[i * 3] = x;
    dustBase[i * 3 + 1] = y;
    dustBase[i * 3 + 2] = z;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      color: 0xffe8b0,
      size: 0.35,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
  disableCull(dust);
  root.add(dust);

  // --- Contrail behind plane ---
  const trailCount = 64;
  const trailPos = new Float32Array(trailCount * 3);
  const trailAge = new Float32Array(trailCount);
  for (let i = 0; i < trailCount; i++) {
    trailAge[i] = i / trailCount;
  }
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
  const trail = new THREE.Points(
    trailGeo,
    new THREE.PointsMaterial({
      color: 0xe8f0f8,
      size: 0.55,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
  disableCull(trail);
  root.add(trail);
  let trailWrite = 0;
  let trailAccum = 0;

  // --- Speed streaks ---
  const streakCount = 48;
  const streakPos = new Float32Array(streakCount * 3);
  const streakLife = new Float32Array(streakCount);
  const streakGeo = new THREE.BufferGeometry();
  streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPos, 3));
  const streaks = new THREE.Points(
    streakGeo,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.25,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
  disableCull(streaks);
  root.add(streaks);

  // --- Collect / burst sparks ---
  const burstCount = 96;
  const burstPos = new Float32Array(burstCount * 3);
  const burstParts: BurstParticle[] = Array.from({ length: burstCount }, () => ({
    life: 0,
    maxLife: 1,
    vx: 0,
    vy: 0,
    vz: 0,
  }));
  const burstGeo = new THREE.BufferGeometry();
  burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPos, 3));
  const burstMat = new THREE.PointsMaterial({
    color: 0xffd060,
    size: 0.45,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const burst = new THREE.Points(burstGeo, burstMat);
  disableCull(burst);
  root.add(burst);

  // --- Propeller motion disc (attached later via update using plane pos) ---
  const propDisc = new THREE.Mesh(
    new THREE.CircleGeometry(0.12, 24),
    new THREE.MeshBasicMaterial({
      color: 0x3a3a42,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  propDisc.name = 'propDisc';
  disableCull(propDisc);
  root.add(propDisc);

  let time = 0;

  function placeTrailPoint(plane: PlaneState) {
    const f = forwardFromAttitude(plane.yaw, plane.pitch);
    const i = trailWrite % trailCount;
    trailPos[i * 3] = plane.position.x - f.x * 0.35;
    trailPos[i * 3 + 1] = plane.position.y - f.y * 0.35;
    trailPos[i * 3 + 2] = plane.position.z - f.z * 0.35;
    trailAge[i] = 0;
    trailWrite++;
    (trailGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  function update(dt: number, plane: PlaneState, flying: boolean) {
    time += dt;
    const f = forwardFromAttitude(plane.yaw, plane.pitch);
    const speedT = Math.min(1, Math.max(0, (plane.speed - 3) / 9));

    // Clouds drift slowly
    for (let i = 0; i < clouds.length; i++) {
      const c = clouds[i]!;
      c.position.x += dt * (0.4 + (i % 3) * 0.15);
      if (c.position.x > 130) c.position.x = -130;
    }

    // Dust floats relative to plane neighborhood
    for (let i = 0; i < dustCount; i++) {
      const bx = dustBase[i * 3]!;
      const by = dustBase[i * 3 + 1]!;
      const bz = dustBase[i * 3 + 2]!;
      dustPos[i * 3] = plane.position.x + bx * 0.35 + Math.sin(time * 0.3 + i) * 2;
      dustPos[i * 3 + 1] = plane.position.y * 0.15 + by + Math.sin(time * 0.7 + i * 0.2) * 0.8;
      dustPos[i * 3 + 2] = plane.position.z + bz * 0.35 + Math.cos(time * 0.25 + i) * 2;
    }
    (dustGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    followBounds(dustGeo, plane, 120);
    (dust.material as THREE.PointsMaterial).opacity = 0.25 + speedT * 0.25;

    // Contrail
    if (flying) {
      trailAccum += dt;
      const interval = 0.04;
      while (trailAccum >= interval) {
        trailAccum -= interval;
        placeTrailPoint(plane);
      }
    }
    for (let i = 0; i < trailCount; i++) {
      trailAge[i]! += dt * 0.35;
      const age = trailAge[i]!;
      // fade by spreading upward slightly
      trailPos[i * 3 + 1]! += dt * 0.15;
      if (age > 1) {
        trailPos[i * 3 + 1]! += dt * 0.4;
      }
    }
    (trailGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    followBounds(trailGeo, plane, 80);
    (trail.material as THREE.PointsMaterial).opacity = 0.2 + speedT * 0.45;
    (trail.material as THREE.PointsMaterial).size = 0.35 + speedT * 0.5;

    // Speed streaks spawn ahead of camera path (pass beside plane)
    const streakMat = streaks.material as THREE.PointsMaterial;
    streakMat.opacity = speedT * 0.65;
    if (flying && speedT > 0.35) {
      for (let i = 0; i < streakCount; i++) {
        streakLife[i]! -= dt * 2.5;
        if (streakLife[i]! <= 0) {
          streakLife[i] = 0.4 + Math.random() * 0.5;
          const side = (Math.random() - 0.5) * 6;
          const up = (Math.random() - 0.3) * 3;
          streakPos[i * 3] = plane.position.x + f.x * 4 + side;
          streakPos[i * 3 + 1] = plane.position.y + up;
          streakPos[i * 3 + 2] = plane.position.z + f.z * 4 + side * 0.2;
        } else {
          streakPos[i * 3]! -= f.x * plane.speed * dt * 1.8;
          streakPos[i * 3 + 1]! -= f.y * plane.speed * dt * 1.8;
          streakPos[i * 3 + 2]! -= f.z * plane.speed * dt * 1.8;
        }
      }
      (streakGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      followBounds(streakGeo, plane, 40);
    } else {
      streakMat.opacity = 0;
    }

    // Burst particles
    let anyBurst = false;
    for (let i = 0; i < burstCount; i++) {
      const p = burstParts[i]!;
      if (p.life <= 0) {
        burstPos[i * 3 + 1] = -999;
        continue;
      }
      anyBurst = true;
      p.life -= dt;
      burstPos[i * 3]! += p.vx * dt;
      burstPos[i * 3 + 1]! += p.vy * dt;
      burstPos[i * 3 + 2]! += p.vz * dt;
      p.vy -= 4 * dt;
    }
    if (anyBurst) {
      (burstGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      followBounds(burstGeo, plane, 40);
      burstMat.opacity = 0.85;
    } else {
      burstMat.opacity = 0;
    }

    // Prop disc at nose, fades in with speed
    propDisc.position.set(
      plane.position.x + f.x * 0.22,
      plane.position.y + f.y * 0.22,
      plane.position.z + f.z * 0.22,
    );
    propDisc.lookAt(
      plane.position.x + f.x,
      plane.position.y + f.y,
      plane.position.z + f.z,
    );
    (propDisc.material as THREE.MeshBasicMaterial).opacity = flying ? 0.15 + speedT * 0.45 : 0;
  }

  function burstAt(x: number, y: number, z: number, color = 0xffd060) {
    burstMat.color.setHex(color);
    for (let i = 0; i < burstCount; i++) {
      const p = burstParts[i]!;
      p.life = 0.35 + Math.random() * 0.45;
      p.maxLife = p.life;
      const a = Math.random() * Math.PI * 2;
      const elev = (Math.random() - 0.2) * Math.PI;
      const sp = 4 + Math.random() * 10;
      p.vx = Math.cos(a) * Math.cos(elev) * sp;
      p.vy = Math.sin(elev) * sp + 2;
      p.vz = Math.sin(a) * Math.cos(elev) * sp;
      burstPos[i * 3] = x;
      burstPos[i * 3 + 1] = y;
      burstPos[i * 3 + 2] = z;
    }
    (burstGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  function reset() {
    for (let i = 0; i < trailCount; i++) {
      trailAge[i] = 1;
      trailPos[i * 3 + 1] = -999;
    }
    (trailGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    for (const p of burstParts) p.life = 0;
    burstMat.opacity = 0;
  }

  function dispose() {
    scene.remove(root);
    root.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
        obj.geometry.dispose();
        const m = obj.material;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m.dispose();
      }
    });
  }

  return { update, burstAt, reset, dispose };
}

/** Pulse ring emissive for idle sparkle. */
export function pulseRingMaterial(mat: THREE.MeshStandardMaterial, time: number, base = 0.35): void {
  mat.emissiveIntensity = base + Math.sin(time * 3) * 0.25;
}
