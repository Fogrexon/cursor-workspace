import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cursor-workspace/box2d-car-game/',
  build: {
    outDir: '../../docs/box2d-car-game',
    emptyOutDir: true,
  },
});
