import fs from 'fs';

const buf = fs.readFileSync('public/wave.wasm');
const { instance } = await WebAssembly.instantiate(buf, {
  env: {
    abort() {
      throw new Error('abort');
    },
  },
});
const e = instance.exports;
e.setParams(0.07, 0.72, 1.4);
const t0 = performance.now();
e.init(8000);
for (let i = 0; i < 60; i++) e.step(1 / 60 / 2);
const ms = performance.now() - t0;
console.log(
  JSON.stringify({
    water: e.getWaterCount(),
    foam: e.getFoamCount(),
    maxWater: e.getMaxWater(),
    ms: Math.round(ms),
    ok: e.getWaterCount() === 8000 && e.getFoamCount() > 100,
  }),
);
