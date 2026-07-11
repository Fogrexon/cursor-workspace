import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cursor-workspace/bubble-demo/',
  build: {
    outDir: '../../docs/bubble-demo',
    emptyOutDir: true,
  },
});
