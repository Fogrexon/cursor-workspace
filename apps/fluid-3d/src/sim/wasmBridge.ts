import type { WaveParams } from '../types';

export interface WaveExports {
  memory: WebAssembly.Memory;
  init(count: number): void;
  reset(): void;
  setParams(
    gravity: number,
    pressure: number,
    viscosity: number,
    bounce: number,
    friction: number,
  ): void;
  getWaterCount(): number;
  getMaxWater(): number;
  waterPtr(): number;
  splash(u: number, v: number, radius: number, strength: number): void;
  pour(extra: number): void;
  step(dt: number): void;
}

export class WasmWaveSimulator {
  private readonly api: WaveExports;

  private constructor(api: WaveExports) {
    this.api = api;
  }

  static async load(wasmUrl: string): Promise<WasmWaveSimulator> {
    const imports = {
      env: {
        abort(_m: number, _f: number, line: number, column: number): void {
          throw new Error(`WASM abort at ${line}:${column}`);
        },
      },
    };
    const res = await fetch(wasmUrl);
    if (!res.ok) throw new Error(`Failed to fetch WASM: ${res.status}`);
    const result = await WebAssembly.instantiateStreaming(res, imports);
    return new WasmWaveSimulator(
      result.instance.exports as unknown as WaveExports,
    );
  }

  applyParams(params: WaveParams, reinit = true): void {
    this.api.setParams(
      params.gravity,
      params.pressure,
      params.viscosity,
      params.bounce,
      params.friction,
    );
    if (reinit) this.api.init(params.particleCount);
  }

  reset(): void {
    this.api.reset();
  }

  step(dt: number): void {
    this.api.step(dt);
  }

  pour(extra = 300): void {
    this.api.pour(extra);
  }

  getWaterCount(): number {
    return this.api.getWaterCount();
  }

  getWaterPositions(): Float32Array {
    return new Float32Array(
      this.api.memory.buffer,
      this.api.waterPtr(),
      this.api.getWaterCount() * 3,
    );
  }

  splash(u: number, v: number, radius = 0.1, strength = 1.5): void {
    this.api.splash(u, v, radius, strength);
  }
}
