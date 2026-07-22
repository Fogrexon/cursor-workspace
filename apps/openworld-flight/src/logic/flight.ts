import type { FlightInput, PlaneState, Vec3 } from '../types';

export const TILE = 4;
/** Enlarges kit town spacing & asset scale so a miniature plane can tour it. */
export const WORLD_SCALE = 5;

export const MIN_ALTITUDE = 3;
export const MAX_ALTITUDE = 140;
export const MIN_SPEED = 2;
export const MAX_SPEED = 12;
export const CRUISE_SPEED = 4.5;

const PITCH_RATE = 1.2;
const YAW_RATE = 1.35;
const ROLL_RATE = 2.0;
const THROTTLE_ACCEL = 9;
const DRAG = 0.26;
const AUTO_LEVEL = 0.6;

/** Soft chase camera — follows heading/position slowly, ignores plane roll/pitch. */
export type SoftCameraState = {
  yaw: number;
  position: Vec3;
  lookAt: Vec3;
};

export function createPlaneState(
  spawn: Vec3 = { x: 0, y: 20, z: 110 },
): PlaneState {
  return {
    position: { ...spawn },
    /** Face toward village center (-Z). */
    yaw: 0,
    pitch: 0.02,
    roll: 0,
    speed: CRUISE_SPEED,
  };
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpAngle(a: number, b: number, t: number): number {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

function expFollow(dt: number, rate: number): number {
  return 1 - Math.exp(-rate * Math.max(0, dt));
}

/** Forward unit vector from yaw/pitch (Y-up, -Z forward at yaw=0). */
export function forwardFromAttitude(yaw: number, pitch: number): Vec3 {
  const cp = Math.cos(pitch);
  return {
    x: Math.sin(yaw) * cp,
    y: Math.sin(pitch),
    z: -Math.cos(yaw) * cp,
  };
}

/**
 * Chase framing must track planeMesh scale (currently 0.28).
 * Distances below are “full-size” offsets × that scale — do not leave
 * absolute meters from the pre-shrink era.
 */
const PLANE_VIEW_SCALE = 0.28;

/** Ideal soft-chase target using horizontal heading only (no roll/pitch). */
export function softChaseTarget(
  plane: PlaneState,
  yaw: number,
  back = 9.0 * PLANE_VIEW_SCALE,
  up = 4.2 * PLANE_VIEW_SCALE,
  lookAhead = 16 * PLANE_VIEW_SCALE,
): { camera: Vec3; lookAt: Vec3 } {
  const fx = Math.sin(yaw);
  const fz = -Math.cos(yaw);
  const p = plane.position;
  return {
    camera: {
      x: p.x - fx * back,
      y: p.y + up,
      z: p.z - fz * back,
    },
    lookAt: {
      x: p.x + fx * lookAhead,
      y: p.y + 1.2 * PLANE_VIEW_SCALE,
      z: p.z + fz * lookAhead,
    },
  };
}

export function createSoftCamera(plane: PlaneState): SoftCameraState {
  const target = softChaseTarget(plane, plane.yaw);
  return {
    yaw: plane.yaw,
    position: { ...target.camera },
    lookAt: { ...target.lookAt },
  };
}

/** FOV / distance kicks driven by acceleration (m/s²). */
export type SpeedCamState = {
  fovOffset: number;
  backOffset: number;
  lookLift: number;
};

export function createSpeedCam(): SpeedCamState {
  return { fovOffset: 0, backOffset: 0, lookLift: 0 };
}

export function stepSpeedCam(
  state: SpeedCamState,
  speed: number,
  prevSpeed: number,
  dt: number,
): SpeedCamState {
  const accel = (speed - prevSpeed) / Math.max(dt, 1e-4);
  // Accel → wider FOV + pull back; decel → tighter FOV + creep in
  const targetFov = clamp(accel * 1.35, -5.5, 7);
  const targetBack = clamp(accel * 0.14, -0.55, 0.85);
  const targetLift = clamp(accel * 0.06, -0.25, 0.35);
  const k = expFollow(dt, 5.5);
  return {
    fovOffset: lerp(state.fovOffset, targetFov, k),
    backOffset: lerp(state.backOffset, targetBack, k),
    lookLift: lerp(state.lookLift, targetLift, k),
  };
}

/**
 * Ease camera toward a lagging chase pose.
 * yawRate / posRate / lookRate are follow strengths (higher = snappier).
 * backExtra / lookLift come from acceleration camera kicks.
 */
export function stepSoftCamera(
  cam: SoftCameraState,
  plane: PlaneState,
  dt: number,
  yawRate = 1.1,
  posRate = 1.6,
  lookRate = 2.2,
  backExtra = 0,
  lookLift = 0,
): SoftCameraState {
  const yaw = lerpAngle(cam.yaw, plane.yaw, expFollow(dt, yawRate));
  const target = softChaseTarget(
    plane,
    yaw,
    9.0 * PLANE_VIEW_SCALE + backExtra,
    4.2 * PLANE_VIEW_SCALE + lookLift * 0.35,
    16 * PLANE_VIEW_SCALE,
  );
  const pt = expFollow(dt, posRate);
  const lt = expFollow(dt, lookRate);
  return {
    yaw,
    position: {
      x: lerp(cam.position.x, target.camera.x, pt),
      y: lerp(cam.position.y, target.camera.y, pt),
      z: lerp(cam.position.z, target.camera.z, pt),
    },
    lookAt: {
      x: lerp(cam.lookAt.x, target.lookAt.x, lt),
      y: lerp(cam.lookAt.y, target.lookAt.y + lookLift, lt),
      z: lerp(cam.lookAt.z, target.lookAt.z, lt),
    },
  };
}

export function stepPlane(state: PlaneState, input: FlightInput, dt: number): PlaneState {
  const t = Math.max(0, Math.min(0.05, dt));
  let { yaw, pitch, roll, speed } = state;
  const pos = { ...state.position };

  const targetSpeed = lerp(MIN_SPEED, MAX_SPEED, (input.throttle + 1) * 0.5);
  speed += (targetSpeed - speed) * Math.min(1, THROTTLE_ACCEL * t);
  speed -= DRAG * t;
  speed = clamp(speed, MIN_SPEED * 0.55, MAX_SPEED);

  const turnFromRoll = -roll * 1.15;
  yaw += (input.yaw * YAW_RATE + turnFromRoll) * t;
  pitch += input.pitch * PITCH_RATE * t;
  roll += input.roll * ROLL_RATE * t;

  if (Math.abs(input.roll) < 0.05) {
    roll = lerp(roll, 0, Math.min(1, AUTO_LEVEL * t));
  }

  pitch = clamp(pitch, -0.75, 0.65);
  roll = clamp(roll, -1.1, 1.1);

  const fwd = forwardFromAttitude(yaw, pitch);
  pos.x += fwd.x * speed * t;
  pos.y += fwd.y * speed * t;
  pos.z += fwd.z * speed * t;

  if (pos.y < MIN_ALTITUDE) {
    pos.y = MIN_ALTITUDE;
    pitch = Math.max(pitch, 0.05);
  }
  if (pos.y > MAX_ALTITUDE) {
    pos.y = MAX_ALTITUDE;
    pitch = Math.min(pitch, -0.05);
  }

  return { position: pos, yaw, pitch, roll, speed };
}

export function formatSpeed(mps: number): string {
  return `${(mps * 3.6).toFixed(0)} km/h`;
}

export function formatAltitude(y: number): string {
  return `${y.toFixed(1)} m`;
}
