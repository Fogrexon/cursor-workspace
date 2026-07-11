import { describe, expect, it } from 'vitest';
import {
  cameraEye,
  createCamera,
  lookAt,
  orbitCamera,
  perspective,
  zoomCamera,
} from './camera';

describe('camera', () => {
  it('orbits within pitch limits', () => {
    const cam = createCamera();
    expect(orbitCamera(cam, 0, 10).pitch).toBeLessThanOrEqual(1.2);
    expect(orbitCamera(cam, 0, -10).pitch).toBeGreaterThanOrEqual(-1.2);
  });

  it('zooms within distance limits', () => {
    const cam = createCamera();
    expect(zoomCamera(cam, 100).distance).toBe(4.5);
    expect(zoomCamera(cam, -100).distance).toBe(0.9);
  });

  it('builds eye position from spherical coords', () => {
    const cam = {
      ...createCamera(),
      yaw: 0,
      pitch: 0,
      distance: 2,
      targetX: 0,
      targetY: 0,
      targetZ: 0,
    };
    const eye = cameraEye(cam);
    expect(eye.x).toBeCloseTo(0);
    expect(eye.y).toBeCloseTo(0);
    expect(eye.z).toBeCloseTo(2);
  });

  it('creates view/projection matrices', () => {
    const view = lookAt(
      { x: 0, y: 1, z: 2 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
    );
    const proj = perspective(Math.PI / 4, 1, 0.1, 100);
    expect(view).toHaveLength(16);
    expect(proj[11]).toBe(-1);
  });
});
