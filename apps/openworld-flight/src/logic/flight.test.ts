import {
  createPlaneState,
  createSoftCamera,
  createSpeedCam,
  forwardFromAttitude,
  formatAltitude,
  formatSpeed,
  MIN_ALTITUDE,
  softChaseTarget,
  stepPlane,
  stepSoftCamera,
  stepSpeedCam,
} from './flight';
import type { FlightInput } from '../types';
import { describe, expect, it } from 'vitest';

describe('forwardFromAttitude', () => {
  it('points along -Z at yaw 0 pitch 0', () => {
    const f = forwardFromAttitude(0, 0);
    expect(f.x).toBeCloseTo(0, 5);
    expect(f.y).toBeCloseTo(0, 5);
    expect(f.z).toBeCloseTo(-1, 5);
  });

  it('spawns south of town facing the village', () => {
    const s = createPlaneState();
    expect(s.position.z).toBeGreaterThan(20);
    expect(s.yaw).toBe(0);
  });

  it('points +X at yaw +90deg', () => {
    const f = forwardFromAttitude(Math.PI / 2, 0);
    expect(f.x).toBeCloseTo(1, 5);
    expect(f.z).toBeCloseTo(0, 5);
  });
});

describe('softChaseTarget', () => {
  it('places camera behind on +Z when heading -Z', () => {
    const plane = createPlaneState({ x: 0, y: 10, z: 0 });
    plane.yaw = 0;
    const pose = softChaseTarget(plane, 0, 4 * 0.28, 2 * 0.28, 6 * 0.28);
    expect(pose.camera.z).toBeGreaterThan(plane.position.z);
    expect(pose.camera.y).toBeGreaterThan(plane.position.y);
    expect(pose.lookAt.z).toBeLessThan(plane.position.z);
  });

  it('ignores plane roll when computing chase offset', () => {
    const plane = createPlaneState({ x: 0, y: 10, z: 0 });
    plane.yaw = 0;
    plane.roll = 0.8;
    const a = softChaseTarget(plane, 0, 4, 2, 6);
    plane.roll = -0.8;
    const b = softChaseTarget(plane, 0, 4, 2, 6);
    expect(a.camera.x).toBeCloseTo(b.camera.x, 5);
    expect(a.camera.y).toBeCloseTo(b.camera.y, 5);
    expect(a.camera.z).toBeCloseTo(b.camera.z, 5);
  });
});

describe('stepSoftCamera', () => {
  it('lags behind a sudden yaw change', () => {
    const plane = createPlaneState({ x: 0, y: 10, z: 0 });
    plane.yaw = 0;
    let cam = createSoftCamera(plane);
    plane.yaw = Math.PI / 2;
    cam = stepSoftCamera(cam, plane, 0.05, 1.1, 1.6, 2.2);
    expect(Math.abs(cam.yaw)).toBeLessThan(Math.PI / 2);
    expect(cam.yaw).toBeGreaterThan(0);
  });
});

describe('stepPlane', () => {
  const idle: FlightInput = { pitch: 0, yaw: 0, roll: 0, throttle: 0 };

  it('moves forward when throttled', () => {
    const before = createPlaneState({ x: 0, y: 10, z: 0 });
    before.yaw = 0;
    before.pitch = 0;
    const after = stepPlane(before, { ...idle, throttle: 1 }, 0.5);
    expect(after.position.z).toBeLessThan(before.position.z);
    expect(after.speed).toBeGreaterThan(before.speed);
  });

  it('clamps altitude to minimum', () => {
    const low = createPlaneState({ x: 0, y: 0.2, z: 0 });
    low.pitch = -0.5;
    const after = stepPlane(low, idle, 0.2);
    expect(after.position.y).toBeGreaterThanOrEqual(MIN_ALTITUDE);
  });
});

describe('stepSpeedCam', () => {
  it('opens FOV and pulls back when accelerating', () => {
    let cam = createSpeedCam();
    cam = stepSpeedCam(cam, 10, 4, 0.1);
    expect(cam.fovOffset).toBeGreaterThan(0);
    expect(cam.backOffset).toBeGreaterThan(0);
  });

  it('tightens FOV when decelerating', () => {
    let cam = createSpeedCam();
    cam = stepSpeedCam(cam, 3, 10, 0.1);
    expect(cam.fovOffset).toBeLessThan(0);
    expect(cam.backOffset).toBeLessThan(0);
  });
});

describe('formatters', () => {
  it('formats speed and altitude', () => {
    expect(formatSpeed(10)).toBe('36 km/h');
    expect(formatAltitude(3.14)).toBe('3.1 m');
  });
});
