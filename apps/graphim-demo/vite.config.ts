import { defineConfig } from 'vite';
import { graphimGlsl } from 'graphim/vite';

export default defineConfig({
  base: '/cursor-workspace/graphim-demo/',
  plugins: [graphimGlsl()],
  build: {
    outDir: '../../docs/graphim-demo',
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ['graphim'],
  },
});
