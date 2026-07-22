import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cursor-workspace/canvas-style-ui/',
  build: {
    outDir: '../../docs/canvas-style-ui',
    emptyOutDir: true,
  },
});
