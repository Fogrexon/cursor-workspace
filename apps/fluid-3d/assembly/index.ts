/**
 * Müller-style SPH with:
 * - floor ghost density (fixes boundary density deficiency → enables stacking)
 * - short-range 3D particle volume repulsion (explicit sphere overlap)
 */

const MAX_WATER: i32 = 8000;
const TABLE: i32 = 16384;

let waterCount: i32 = 0;
let gravity: f32 = 3.5;
let gasStiff: f32 = 14.0;
let viscosity: f32 = 0.15;
let bounce: f32 = 0.05;
let friction: f32 = 0.06;
let rngState: u32 = 7;

const H: f32 = 0.05;
const H2: f32 = 0.0025;
const RHO0: f32 = 1000.0;
const MASS: f32 = RHO0 * (H * f32(0.5)) * (H * f32(0.5)) * (H * f32(0.5));
// Particle radius for volume (positional separation, not 1/r forces)
const PR: f32 = H * f32(0.2);

const POLY6: f32 = 315.0 / (64.0 * Mathf.PI * H * H * H * H * H * H * H * H * H);
const SPIKY_GRAD: f32 = -45.0 / (Mathf.PI * H * H * H * H * H * H);

const XMIN: f32 = -0.45;
const XMAX: f32 = 0.45;
const YMAX: f32 = 0.5;
const ZMIN: f32 = -0.45;
const ZMAX: f32 = 0.45;

const FLOOR_A: f32 = -0.08;
const FLOOR_B: f32 = 0.42;

function rand(): f32 {
  rngState ^= rngState << 13;
  rngState ^= rngState >> 17;
  rngState ^= rngState << 5;
  return f32(rngState & 0xffffff) / f32(0xffffff);
}

const wPos = new StaticArray<f32>(MAX_WATER * 3);
const wVel = new StaticArray<f32>(MAX_WATER * 3);
const wRho = new StaticArray<f32>(MAX_WATER);
const wPress = new StaticArray<f32>(MAX_WATER);
const cellHead = new StaticArray<i32>(TABLE);
const cellNext = new StaticArray<i32>(MAX_WATER);

function hash3(cx: i32, cy: i32, cz: i32): i32 {
  const n =
    unchecked(cx * 73856093) ^
    unchecked(cy * 19349663) ^
    unchecked(cz * 83492791);
  return ((n % TABLE) + TABLE) % TABLE;
}

function floorY(z: f32): f32 {
  return FLOOR_A + FLOOR_B * z;
}

function floorNormalLen(): f32 {
  return Mathf.sqrt(f32(1.0) + FLOOR_B * FLOOR_B);
}

/** Signed distance to slope plane (positive = above). */
function floorDist(y: f32, z: f32, nLen: f32): f32 {
  return (y - FLOOR_B * z - FLOOR_A) / nLen;
}

function spawnBlock(count: i32): void {
  const side = i32(Mathf.ceil(Mathf.cbrt(f32(count))));
  const spacing = H * f32(0.5);
  const oz = f32(0.16);
  const oy = floorY(oz) + spacing * f32(0.5) + f32(0.02);
  const ox = -f32(side) * spacing * f32(0.5);
  let n: i32 = 0;
  for (let zi: i32 = 0; zi < side && n < count; zi++) {
    for (let yi: i32 = 0; yi < side && n < count; yi++) {
      for (let xi: i32 = 0; xi < side && n < count; xi++) {
        unchecked((wPos[n * 3] = ox + f32(xi) * spacing + (rand() - f32(0.5)) * f32(0.0004)));
        unchecked((wPos[n * 3 + 1] = oy + f32(yi) * spacing));
        unchecked((wPos[n * 3 + 2] = oz + f32(zi) * spacing + (rand() - f32(0.5)) * f32(0.0004)));
        unchecked((wVel[n * 3] = 0.0));
        unchecked((wVel[n * 3 + 1] = 0.0));
        unchecked((wVel[n * 3 + 2] = 0.0));
        n = n + 1;
      }
    }
  }
  waterCount = n;
}

export function init(count: i32): void {
  const n = count < 64 ? 64 : count > MAX_WATER ? MAX_WATER : count;
  spawnBlock(n);
}

export function reset(): void {
  init(waterCount > 0 ? waterCount : 2000);
}

export function setParams(
  grav: f32,
  pressure: f32,
  visc: f32,
  bnc: f32,
  fric: f32,
): void {
  gravity = grav < 0.2 ? 0.2 : grav > 10.0 ? 10.0 : grav;
  gasStiff = pressure < 1.0 ? 1.0 : pressure > 40.0 ? 40.0 : pressure;
  viscosity = visc < 0.0 ? 0.0 : visc > 2.0 ? 2.0 : visc;
  bounce = bnc < 0.0 ? 0.0 : bnc > 0.8 ? 0.8 : bnc;
  friction = fric < 0.0 ? 0.0 : fric > 1.0 ? 1.0 : fric;
}

export function getWaterCount(): i32 {
  return waterCount;
}
export function getMaxWater(): i32 {
  return MAX_WATER;
}
export function waterPtr(): usize {
  return changetype<usize>(wPos);
}

export function getFloorA(): f32 {
  return FLOOR_A;
}
export function getFloorB(): f32 {
  return FLOOR_B;
}

function clearGrid(): void {
  for (let i: i32 = 0; i < TABLE; i++) {
    unchecked((cellHead[i] = -1));
  }
}

function insertGrid(i: i32): void {
  const key = hash3(
    i32(Mathf.floor(unchecked(wPos[i * 3]) / H)),
    i32(Mathf.floor(unchecked(wPos[i * 3 + 1]) / H)),
    i32(Mathf.floor(unchecked(wPos[i * 3 + 2]) / H)),
  );
  unchecked((cellNext[i] = cellHead[key]));
  unchecked((cellHead[key] = i));
}

export function step(dt: f32): void {
  let h: f32 = dt;
  if (h > 0.004) h = 0.004;
  if (h <= 0.0) return;

  clearGrid();
  for (let i: i32 = 0; i < waterCount; i++) insertGrid(i);

  const wSelf = POLY6 * H2 * H2 * H2;
  const nLen = floorNormalLen();
  const ny = f32(1.0) / nLen;
  const nz = -FLOOR_B / nLen;

  // Density + pressure
  for (let i: i32 = 0; i < waterCount; i++) {
    const x = unchecked(wPos[i * 3]);
    const y = unchecked(wPos[i * 3 + 1]);
    const z = unchecked(wPos[i * 3 + 2]);
    const cx = i32(Mathf.floor(x / H));
    const cy = i32(Mathf.floor(y / H));
    const cz = i32(Mathf.floor(z / H));

    let rho: f32 = MASS * wSelf;
    for (let ox: i32 = -1; ox <= 1; ox++) {
      for (let oy: i32 = -1; oy <= 1; oy++) {
        for (let oz: i32 = -1; oz <= 1; oz++) {
          let j = unchecked(cellHead[hash3(cx + ox, cy + oy, cz + oz)]);
          while (j >= 0) {
            if (j != i) {
              const dx = x - unchecked(wPos[j * 3]);
              const dy = y - unchecked(wPos[j * 3 + 1]);
              const dz = z - unchecked(wPos[j * 3 + 2]);
              const r2 = dx * dx + dy * dy + dz * dz;
              if (r2 < H2) {
                const d = H2 - r2;
                rho = rho + MASS * POLY6 * d * d * d;
              }
            }
            j = unchecked(cellNext[j]);
          }
        }
      }
    }

    // Ghost density from floor (missing hemisphere under the slope)
    const fd = floorDist(y, z, nLen);
    if (fd > 0.0 && fd < H) {
      const rMirror = fd * f32(2.0);
      if (rMirror < H) {
        const r2m = rMirror * rMirror;
        const d = H2 - r2m;
        rho = rho + MASS * POLY6 * d * d * d;
      }
    }
    // Ghost density from side walls
    if (x - XMIN < H) {
      const rw = (x - XMIN) * f32(2.0);
      if (rw < H) {
        const d = H2 - rw * rw;
        rho = rho + MASS * POLY6 * d * d * d;
      }
    }
    if (XMAX - x < H) {
      const rw = (XMAX - x) * f32(2.0);
      if (rw < H) {
        const d = H2 - rw * rw;
        rho = rho + MASS * POLY6 * d * d * d;
      }
    }
    if (z - ZMIN < H) {
      const rw = (z - ZMIN) * f32(2.0);
      if (rw < H) {
        const d = H2 - rw * rw;
        rho = rho + MASS * POLY6 * d * d * d;
      }
    }
    if (ZMAX - z < H) {
      const rw = (ZMAX - z) * f32(2.0);
      if (rw < H) {
        const d = H2 - rw * rw;
        rho = rho + MASS * POLY6 * d * d * d;
      }
    }

    if (rho < f32(1.0)) rho = f32(1.0);
    unchecked((wRho[i] = rho));
    // Linear EOS with capped compression — avoids Tait blow-up on density spikes
    let ratio = rho / RHO0;
    if (ratio > f32(1.6)) ratio = f32(1.6);
    let p = gasStiff * (ratio - f32(1.0));
    if (p < 0.0) p = 0.0;
    unchecked((wPress[i] = p));
  }

  for (let i: i32 = 0; i < waterCount; i++) {
    let x = unchecked(wPos[i * 3]);
    let y = unchecked(wPos[i * 3 + 1]);
    let z = unchecked(wPos[i * 3 + 2]);
    let vx = unchecked(wVel[i * 3]);
    let vy = unchecked(wVel[i * 3 + 1]);
    let vz = unchecked(wVel[i * 3 + 2]);

    const rhoi = unchecked(wRho[i]);
    const pi = unchecked(wPress[i]);
    const invRhoi2 = f32(1.0) / (rhoi * rhoi);

    let ax: f32 = 0.0;
    let ay: f32 = 0.0;
    let az: f32 = 0.0;
    let xsx: f32 = 0.0;
    let xsy: f32 = 0.0;
    let xsz: f32 = 0.0;
    // Accumulated positional separation (half-overlap), applied after forces
    let corrX: f32 = 0.0;
    let corrY: f32 = 0.0;
    let corrZ: f32 = 0.0;

    const cx = i32(Mathf.floor(x / H));
    const cy = i32(Mathf.floor(y / H));
    const cz = i32(Mathf.floor(z / H));

    for (let ox: i32 = -1; ox <= 1; ox++) {
      for (let oy: i32 = -1; oy <= 1; oy++) {
        for (let oz: i32 = -1; oz <= 1; oz++) {
          let j = unchecked(cellHead[hash3(cx + ox, cy + oy, cz + oz)]);
          while (j >= 0) {
            if (j != i) {
              const dx = x - unchecked(wPos[j * 3]);
              const dy = y - unchecked(wPos[j * 3 + 1]);
              const dz = z - unchecked(wPos[j * 3 + 2]);
              const r2 = dx * dx + dy * dy + dz * dz;
              if (r2 > f32(1.0e-12) && r2 < H2) {
                const r = Mathf.sqrt(r2);
                const rhoj = unchecked(wRho[j]);
                const pj = unchecked(wPress[j]);
                const invR = f32(1.0) / r;
                const hr = H - r;

                const grad = SPIKY_GRAD * hr * hr;
                const pressCoef =
                  -MASS * (pi * invRhoi2 + pj / (rhoj * rhoj)) * grad;
                ax = ax + dx * pressCoef * invR;
                ay = ay + dy * pressCoef * invR;
                az = az + dz * pressCoef * invR;

                // Positional volume: separate centers if closer than 2*PR
                // (no 1/r force — that was the intermittent explosion)
                if (r < PR) {
                  const pen = (PR - r) * f32(0.5);
                  corrX = corrX + dx * invR * pen;
                  corrY = corrY + dy * invR * pen;
                  corrZ = corrZ + dz * invR * pen;
                }

                // XSPH viscosity (stable); scale by poly6 weight
                if (viscosity > 0.0) {
                  const d = H2 - r2;
                  const wPoly = POLY6 * d * d * d;
                  const coef = viscosity * MASS * wPoly / (rhoj + f32(0.0001));
                  xsx = xsx + (unchecked(wVel[j * 3]) - vx) * coef;
                  xsy = xsy + (unchecked(wVel[j * 3 + 1]) - vy) * coef;
                  xsz = xsz + (unchecked(wVel[j * 3 + 2]) - vz) * coef;
                }
              }
            }
            j = unchecked(cellNext[j]);
          }
        }
      }
    }

    vx = vx + ax * h + xsx;
    vy = vy + (ay - gravity) * h + xsy;
    vz = vz + az * h + xsz;

    x = x + vx * h + corrX;
    y = y + vy * h + corrY;
    z = z + vz * h + corrZ;

    if (x < XMIN) {
      x = XMIN;
      if (vx < 0.0) vx = -vx * bounce;
    } else if (x > XMAX) {
      x = XMAX;
      if (vx > 0.0) vx = -vx * bounce;
    }
    if (z < ZMIN) {
      z = ZMIN;
      if (vz < 0.0) vz = -vz * bounce;
    } else if (z > ZMAX) {
      z = ZMAX;
      if (vz > 0.0) vz = -vz * bounce;
    }
    if (y > YMAX) {
      y = YMAX;
      if (vy > 0.0) vy = -vy * bounce;
    }

    // Slope contact
    const contactR = PR;
    let onFloor: bool = false;
    for (let pass: i32 = 0; pass < 2; pass++) {
      const dist = floorDist(y, z, nLen);
      if (dist >= contactR) break;
      onFloor = true;
      const pen = contactR - dist;
      y = y + pen * ny;
      z = z + pen * nz;
      if (z < ZMIN) z = ZMIN;
      if (z > ZMAX) z = ZMAX;

      const vDotN = vy * ny + vz * nz;
      if (vDotN < 0.0) {
        vy = vy - (f32(1.0) + bounce) * vDotN * ny;
        vz = vz - (f32(1.0) + bounce) * vDotN * nz;
      }
    }

    const fySafe = floorY(z) + contactR * f32(0.9);
    if (y < fySafe) {
      y = fySafe;
      if (vy < 0.0) vy = 0.0;
      onFloor = true;
    }

    if (onFloor && friction > 0.0) {
      const vDotN = vy * ny + vz * nz;
      let tx = vx;
      let ty = vy - vDotN * ny;
      let tz = vz - vDotN * nz;
      let damp = f32(1.0) - friction * f32(0.3);
      if (damp < 0.0) damp = 0.0;
      tx = tx * damp;
      ty = ty * damp;
      tz = tz * damp;
      vx = tx;
      vy = ty + vDotN * ny;
      vz = tz + vDotN * nz;
    }

    unchecked((wPos[i * 3] = x));
    unchecked((wPos[i * 3 + 1] = y));
    unchecked((wPos[i * 3 + 2] = z));
    unchecked((wVel[i * 3] = vx));
    unchecked((wVel[i * 3 + 1] = vy));
    unchecked((wVel[i * 3 + 2] = vz));
  }
}

export function splash(u: f32, v: f32, radius: f32, strength: f32): void {
  const cx = (u - f32(0.5)) * (XMAX - XMIN);
  const cz = (v - f32(0.5)) * (ZMAX - ZMIN);
  const r2 = radius * radius;
  for (let i: i32 = 0; i < waterCount; i++) {
    const dx = unchecked(wPos[i * 3]) - cx;
    const dz = unchecked(wPos[i * 3 + 2]) - cz;
    const d2 = dx * dx + dz * dz;
    if (d2 < r2) {
      const w = Mathf.exp(-d2 / (r2 * 0.4));
      unchecked((wVel[i * 3 + 1] = wVel[i * 3 + 1] + strength * w));
    }
  }
}

export function pour(extra: i32): void {
  const room = MAX_WATER - waterCount;
  const n = extra < room ? extra : room;
  if (n <= 0) return;
  const start = waterCount;
  const side = i32(Mathf.ceil(Mathf.cbrt(f32(n))));
  const spacing = H * f32(0.5);
  const oz = f32(0.18);
  const oy = floorY(oz) + f32(0.14);
  const ox = f32(-0.08);
  let k: i32 = 0;
  for (let zi: i32 = 0; zi < side && k < n; zi++) {
    for (let yi: i32 = 0; yi < side && k < n; yi++) {
      for (let xi: i32 = 0; xi < side && k < n; xi++) {
        const i = start + k;
        unchecked((wPos[i * 3] = ox + f32(xi) * spacing));
        unchecked((wPos[i * 3 + 1] = oy + f32(yi) * spacing));
        unchecked((wPos[i * 3 + 2] = oz + f32(zi) * spacing));
        unchecked((wVel[i * 3] = 0.0));
        unchecked((wVel[i * 3 + 1] = 0.0));
        unchecked((wVel[i * 3 + 2] = 0.0));
        k = k + 1;
      }
    }
  }
  waterCount = start + k;
}

export function memorySize(): i32 {
  return i32(memory.size()) << 16;
}
