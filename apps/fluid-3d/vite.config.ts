import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cursor-workspace/fluid-3d/',
  build: {
    outDir: '../../docs/fluid-3d',
    emptyOutDir: true,
  },
  assetsInclude: ['**/*.wasm'],
});
