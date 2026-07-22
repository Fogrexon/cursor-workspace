import { defineConfig } from 'vite';
import { graphimGlsl } from 'graphim/vite';

export default defineConfig({
  base: '/cursor-workspace/graphim-editor/',
  plugins: [graphimGlsl()],
  build: {
    outDir: '../../docs/graphim-editor',
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ['graphim'],
  },
});
