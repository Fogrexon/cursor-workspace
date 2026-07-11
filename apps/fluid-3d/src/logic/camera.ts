import type { CameraState, Vec3 } from '../types';

export function createCamera(): CameraState {
  return {
    yaw: 0.7,
    pitch: 0.4,
    distance: 1.7,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
  };
}

export function orbitCamera(
  cam: CameraState,
  dYaw: number,
  dPitch: number,
): CameraState {
  const pitch = Math.max(-1.2, Math.min(1.2, cam.pitch + dPitch));
  return { ...cam, yaw: cam.yaw + dYaw, pitch };
}

export function zoomCamera(cam: CameraState, delta: number): CameraState {
  const distance = Math.max(0.9, Math.min(4.5, cam.distance + delta));
  return { ...cam, distance };
}

export function cameraEye(cam: CameraState): Vec3 {
  const cp = Math.cos(cam.pitch);
  return {
    x: cam.targetX + cam.distance * cp * Math.sin(cam.yaw),
    y: cam.targetY + cam.distance * Math.sin(cam.pitch),
    z: cam.targetZ + cam.distance * cp * Math.cos(cam.yaw),
  };
}

/** Column-major 4x4 look-at matrix. */
export function lookAt(eye: Vec3, target: Vec3, up: Vec3): Float32Array {
  const zx = eye.x - target.x;
  const zy = eye.y - target.y;
  const zz = eye.z - target.z;
  const zl = 1 / Math.hypot(zx, zy, zz);
  const z0 = zx * zl;
  const z1 = zy * zl;
  const z2 = zz * zl;

  let xx = up.y * z2 - up.z * z1;
  let xy = up.z * z0 - up.x * z2;
  let xz = up.x * z1 - up.y * z0;
  const xl = 1 / Math.hypot(xx, xy, xz);
  xx *= xl;
  xy *= xl;
  xz *= xl;

  const y0 = z1 * xz - z2 * xy;
  const y1 = z2 * xx - z0 * xz;
  const y2 = z0 * xy - z1 * xx;

  const out = new Float32Array(16);
  out[0] = xx;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = xy;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = xz;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(xx * eye.x + xy * eye.y + xz * eye.z);
  out[13] = -(y0 * eye.x + y1 * eye.y + y2 * eye.z);
  out[14] = -(z0 * eye.x + z1 * eye.y + z2 * eye.z);
  out[15] = 1;
  return out;
}

export function perspective(
  fovY: number,
  aspect: number,
  near: number,
  far: number,
): Float32Array {
  const f = 1 / Math.tan(fovY / 2);
  const nf = 1 / (near - far);
  const out = new Float32Array(16);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[14] = 2 * far * near * nf;
  return out;
}

export function mul4(a: Float32Array, b: Float32Array): Float32Array {
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      out[col * 4 + row] =
        a[row] * b[col * 4] +
        a[4 + row] * b[col * 4 + 1] +
        a[8 + row] * b[col * 4 + 2] +
        a[12 + row] * b[col * 4 + 3];
    }
  }
  return out;
}
