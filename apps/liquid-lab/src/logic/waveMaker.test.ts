import { describe, expect, it } from 'vitest';
import {
  clampWaveAmplitude,
  maxWaveAmplitudeForBox,
  paddleHalfZ,
  paddlePositionX,
  paddleRestX,
  paddleVelocityX,
  WAVE_AMPLITUDE_MAX,
} from './waveMaker';

describe('waveMaker', () => {
  it('rests near the left wall inside the box', () => {
    const rest = paddleRestX(0.55);
    const half = 0.55 * 0.5;
    const wall = 0.5 - half;
    expect(rest).toBeGreaterThan(wall);
    expect(rest).toBeLessThan(0.5);
  });

  it('oscillates around rest within amplitude', () => {
    const rest = 0.2;
    const amp = 0.03;
    const freq = 0.5;
    const xs = [0, 0.25, 0.5, 0.75, 1].map((t) =>
      paddlePositionX(t / freq, rest, amp, freq),
    );
    for (const x of xs) {
      expect(x).toBeGreaterThanOrEqual(rest - amp - 1e-9);
      expect(x).toBeLessThanOrEqual(rest + amp + 1e-9);
    }
    expect(paddlePositionX(0, rest, amp, freq)).toBeCloseTo(rest, 5);
    expect(paddlePositionX(0.5 / freq, rest, amp, freq)).toBeCloseTo(rest, 5);
  });

  it('velocity peaks when displacement is zero', () => {
    const amp = 0.04;
    const freq = 1;
    const v0 = paddleVelocityX(0, amp, freq);
    expect(Math.abs(v0)).toBeCloseTo(amp * 2 * Math.PI * freq, 5);
    expect(paddleVelocityX(0.25, amp, freq)).toBeCloseTo(0, 5);
  });

  it('paddle half-Z scales with box depth', () => {
    expect(paddleHalfZ(0.8)).toBeGreaterThan(paddleHalfZ(0.4));
  });

  it('allows large wave amplitudes up to the cap', () => {
    expect(clampWaveAmplitude(0.25)).toBeCloseTo(0.25, 5);
    expect(clampWaveAmplitude(1)).toBe(WAVE_AMPLITUDE_MAX);
  });

  it('limits paddle travel by box width', () => {
    expect(maxWaveAmplitudeForBox(1)).toBeGreaterThan(maxWaveAmplitudeForBox(0.4));
    expect(maxWaveAmplitudeForBox(1)).toBeLessThanOrEqual(WAVE_AMPLITUDE_MAX);
  });

  it('treats unit-space widths above 1 as full domain', () => {
    expect(maxWaveAmplitudeForBox(6)).toBeCloseTo(maxWaveAmplitudeForBox(1), 5);
    expect(paddleHalfZ(3.5)).toBeCloseTo(paddleHalfZ(1), 5);
  });
});
